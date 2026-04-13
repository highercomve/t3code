import { type ChildProcessWithoutNullStreams, spawn, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { EventEmitter } from "node:events";
import readline from "node:readline";

import {
  ApprovalRequestId,
  EventId,
  ProviderItemId,
  ProviderRequestKind,
  type ProviderUserInputAnswers,
  ThreadId,
  TurnId,
  type ProviderApprovalDecision,
  type ProviderEvent,
  type ProviderSession,
  type ProviderSessionStartInput,
  type ProviderTurnStartResult,
  RuntimeMode,
  ProviderInteractionMode,
  PROVIDER_CLAUDE_AGENT,
} from "@t3tools/contracts";
import { normalizeModelSlug } from "@t3tools/shared/model";
import { Effect, Context } from "effect";

// ── Types ────────────────────────────────────────────────────────────

type PendingRequestKey = string;

interface PendingRequest {
  method: string;
  timeout: ReturnType<typeof setTimeout>;
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
}

interface AcpPermissionOption {
  optionId: string;
  name: string;
  kind: string;
}

interface PendingApprovalRequest {
  requestId: ApprovalRequestId;
  jsonRpcId: string | number;
  requestKind: ProviderRequestKind;
  threadId: ThreadId;
  turnId?: TurnId;
  itemId?: ProviderItemId;
  options: AcpPermissionOption[];
}

interface PendingUserInputRequest {
  requestId: ApprovalRequestId;
  jsonRpcId: string | number;
  threadId: ThreadId;
  turnId?: TurnId;
  itemId?: ProviderItemId;
}

interface ClaudeCodeSessionContext {
  session: ProviderSession;
  acpSessionId: string | undefined;
  child: ChildProcessWithoutNullStreams;
  output: readline.Interface;
  pending: Map<PendingRequestKey, PendingRequest>;
  pendingApprovals: Map<ApprovalRequestId, PendingApprovalRequest>;
  pendingUserInputs: Map<ApprovalRequestId, PendingUserInputRequest>;
  nextRequestId: number;
  stopping: boolean;
}

interface JsonRpcError {
  code?: number;
  message?: string;
}

interface JsonRpcRequest {
  id: string | number;
  method: string;
  params?: unknown;
}

interface JsonRpcResponse {
  id: string | number;
  result?: unknown;
  error?: JsonRpcError;
}

interface JsonRpcNotification {
  method: string;
  params?: unknown;
}

// ── Public types ─────────────────────────────────────────────────────

export interface ClaudeCodeAppServerSendTurnInput {
  readonly threadId: ThreadId;
  readonly input?: string;
  readonly attachments?: ReadonlyArray<{ type: "image"; url: string }>;
  readonly model?: string;
  readonly serviceTier?: string | null;
  readonly effort?: string;
  readonly interactionMode?: ProviderInteractionMode;
}

export interface ClaudeCodeAppServerStartSessionInput {
  readonly threadId: ThreadId;
  readonly provider?: "claudeCode";
  readonly cwd?: string;
  readonly model?: string;
  readonly serviceTier?: string;
  readonly resumeCursor?: unknown;
  readonly providerOptions?: Record<string, unknown>;
  readonly runtimeMode: RuntimeMode;
}

export interface ClaudeCodeThreadTurnSnapshot {
  id: TurnId;
  items: unknown[];
}

export interface ClaudeCodeThreadSnapshot {
  threadId: string;
  turns: ClaudeCodeThreadTurnSnapshot[];
}

// ── Constants ────────────────────────────────────────────────────────

const PROVIDER = PROVIDER_CLAUDE_AGENT;
const CLAUDE_CODE_DEFAULT_MODEL = "claude-sonnet-4-6";

/** Timeout for the long-running `prompt` request (10 minutes). */
const PROMPT_TIMEOUT_MS = 600_000;

// ── Helpers ──────────────────────────────────────────────────────────

function asObject(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asArray(value: unknown): unknown[] | undefined {
  return Array.isArray(value) ? value : undefined;
}

function killChildTree(child: ChildProcessWithoutNullStreams): void {
  if (process.platform === "win32" && child.pid !== undefined) {
    try {
      spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
      return;
    } catch {
      // fallback to direct kill
    }
  }
  child.kill();
}

function runtimeModeToAcpMode(runtimeMode: RuntimeMode): string {
  switch (runtimeMode) {
    case "full-access":
      return "yolo";
    case "approval-required":
    default:
      return "default";
  }
}

function acpToolKindToRequestKind(kind: string | undefined): ProviderRequestKind | undefined {
  switch (kind) {
    case "execute":
      return "command";
    case "read":
    case "search":
      return "file-read";
    case "edit":
    case "delete":
    case "move":
      return "file-change";
    default:
      return "command";
  }
}

function acpToolKindToApprovalMethod(kind: string | undefined): string {
  switch (kind) {
    case "read":
    case "search":
      return "item/fileRead/requestApproval";
    case "edit":
    case "delete":
    case "move":
      return "item/fileChange/requestApproval";
    default:
      return "item/commandExecution/requestApproval";
  }
}

export function classifyClaudeCodeStderrLine(rawLine: string): { message: string } | null {
  const line = rawLine.trim();
  if (!line) {
    return null;
  }
  return { message: line };
}

// ── Manager ──────────────────────────────────────────────────────────

export interface ClaudeCodeAppServerManagerEvents {
  event: [event: ProviderEvent];
}

/**
 * ClaudeCodeAppServerManager — manages Claude Code sessions using the ACP
 * (Agent Client Protocol) over JSON-RPC/ndjson stdio via the `claude` CLI.
 *
 * Protocol flow per session:
 *   1. Spawn `node <claude-agent-acp>`
 *   2. initialize({ protocolVersion: 1 }) → { authMethods, agentCapabilities }
 *   3. authenticate({ methodId }) → void
 *   4. session/new({ cwd, mcpServers: [] }) → { sessionId, modes, models }
 *   5. session/prompt({ sessionId, prompt: [...] }) → { stopReason } (long-running)
 *      During prompt, server pushes `session/update` notifications and
 *      `session/request_permission` requests.
 *   6. session/cancel({ sessionId }) to interrupt a running prompt.
 */
export class ClaudeCodeAppServerManager extends EventEmitter<ClaudeCodeAppServerManagerEvents> {
  private readonly sessions = new Map<ThreadId, ClaudeCodeSessionContext>();

  private runPromise: (effect: Effect.Effect<unknown, never>) => Promise<unknown>;
  constructor(services?: Context.Context<never>) {
    super();
    this.runPromise = services ? Effect.runPromiseWith(services) : Effect.runPromise;
  }

  async startSession(input: ClaudeCodeAppServerStartSessionInput): Promise<ProviderSession> {
    const threadId = input.threadId;
    const now = new Date().toISOString();
    let context: ClaudeCodeSessionContext | undefined;

    try {
      const resolvedCwd = input.cwd ?? process.cwd();
      const resolvedModel = normalizeModelSlug(input.model, PROVIDER) ?? CLAUDE_CODE_DEFAULT_MODEL;

      const session: ProviderSession = {
        provider: PROVIDER,
        status: "connecting",
        runtimeMode: input.runtimeMode,
        model: resolvedModel,
        cwd: resolvedCwd,
        threadId,
        createdAt: now,
        updatedAt: now,
      };

      const claudeCodeOptions = readClaudeCodeProviderOptions(input);
      const binaryPath = claudeCodeOptions.binaryPath ?? resolveClaudeAgentAcpBinary();

      const env: Record<string, string | undefined> = {
        ...process.env,
      };
      if (claudeCodeOptions.apiKey) {
        env.ANTHROPIC_API_KEY = claudeCodeOptions.apiKey;
      }

      const child = spawn("node", [binaryPath], {
        cwd: resolvedCwd,
        env,
        stdio: ["pipe", "pipe", "pipe"],
        shell: process.platform === "win32",
      });
      const output = readline.createInterface({ input: child.stdout });

      context = {
        session,
        acpSessionId: undefined,
        child,
        output,
        pending: new Map(),
        pendingApprovals: new Map(),
        pendingUserInputs: new Map(),
        nextRequestId: 1,
        stopping: false,
      };

      this.sessions.set(threadId, context);
      this.attachProcessListeners(context);

      this.emitLifecycleEvent(context, "session/connecting", "Starting claude-agent-acp");

      // Step 1: ACP initialize
      const initResponse = await this.sendRequest<{
        protocolVersion?: string | number;
        authMethods?: Array<{ id: string; name: string; description?: string }>;
        agentInfo?: { name?: string; version?: string };
        agentCapabilities?: unknown;
      }>(context, "initialize", { protocolVersion: 1 });

      await Effect.logInfo("claudeCode ACP initialize response", {
        threadId,
        protocolVersion: initResponse?.protocolVersion,
        agentInfo: initResponse?.agentInfo,
        authMethodCount: initResponse?.authMethods?.length ?? 0,
      }).pipe(this.runPromise);

      // Step 2: ACP authenticate
      const authMethods = initResponse?.authMethods ?? [];
      if (authMethods.length > 0) {
        const methodId = authMethods[0]?.id;
        await this.sendRequest(context, "authenticate", { methodId });
        await Effect.logInfo("claudeCode ACP authenticated", {
          threadId,
          methodId,
        }).pipe(this.runPromise);
      }

      // Step 3: ACP newSession or loadSession
      const resumeSessionId = readResumeSessionId(input);
      let acpSessionId: string | undefined;

      if (resumeSessionId) {
        this.emitLifecycleEvent(
          context,
          "session/threadOpenRequested",
          `Attempting to resume ACP session ${resumeSessionId}.`,
        );
        try {
          const loadResponse = await this.sendRequest<{
            modes?: { availableModes?: unknown[]; currentModeId?: string };
          }>(context, "session/load", {
            sessionId: resumeSessionId,
            cwd: resolvedCwd,
            mcpServers: [],
          });
          acpSessionId = resumeSessionId;
          await Effect.logInfo("claudeCode ACP loadSession succeeded", {
            threadId,
            sessionId: acpSessionId,
            currentMode: loadResponse?.modes?.currentModeId,
          }).pipe(this.runPromise);
        } catch (error) {
          this.emitLifecycleEvent(
            context,
            "session/threadResumeFallback",
            `Could not resume session ${resumeSessionId}; starting a new session.`,
          );
          await Effect.logWarning("claudeCode ACP loadSession fell back to newSession", {
            threadId,
            resumeSessionId,
            cause: error instanceof Error ? error.message : String(error),
          }).pipe(this.runPromise);
        }
      }

      if (!acpSessionId) {
        this.emitLifecycleEvent(
          context,
          "session/threadOpenRequested",
          "Starting a new Claude Code ACP session.",
        );
        const newSessionResponse = await this.sendRequest<{
          sessionId?: string;
          modes?: { availableModes?: unknown[]; currentModeId?: string };
          models?: {
            availableModels?: Array<{ modelId: string; name: string; description?: string }>;
            currentModelId?: string;
          };
        }>(context, "session/new", {
          cwd: resolvedCwd,
          mcpServers: [],
        });

        acpSessionId = newSessionResponse?.sessionId;
        if (!acpSessionId) {
          throw new Error("newSession response did not include a sessionId.");
        }

        // Log available models from the ACP response
        const availableModels = newSessionResponse?.models?.availableModels;
        if (availableModels && availableModels.length > 0) {
          await Effect.logInfo("claudeCode ACP available models", {
            threadId,
            models: availableModels.map((m) => m.modelId),
            currentModel: newSessionResponse?.models?.currentModelId,
          }).pipe(this.runPromise);
        }

        await Effect.logInfo("claudeCode ACP newSession succeeded", {
          threadId,
          sessionId: acpSessionId,
          currentMode: newSessionResponse?.modes?.currentModeId,
        }).pipe(this.runPromise);
      }

      context.acpSessionId = acpSessionId;

      // Set ACP mode based on runtime mode
      const acpMode = runtimeModeToAcpMode(input.runtimeMode);
      try {
        await this.sendRequest(context, "session/set_mode", {
          sessionId: acpSessionId,
          modeId: acpMode,
        });
        await Effect.logInfo("claudeCode ACP session mode set", {
          threadId,
          acpMode,
          runtimeMode: input.runtimeMode,
        }).pipe(this.runPromise);
      } catch (error) {
        await Effect.logWarning("claudeCode ACP set_mode failed during startup", {
          threadId,
          acpMode,
          cause: error instanceof Error ? error.message : String(error),
        }).pipe(this.runPromise);
      }

      this.updateSession(context, {
        status: "ready",
        resumeCursor: { sessionId: acpSessionId },
      });
      this.emitLifecycleEvent(
        context,
        "session/threadOpenResolved",
        `Claude Code ACP session established.`,
      );
      this.emitLifecycleEvent(context, "session/ready", `Connected to ACP session ${acpSessionId}`);
      return { ...context.session };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to start Claude Code session.";
      if (context) {
        this.updateSession(context, {
          status: "error",
          lastError: message,
        });
        this.emitErrorEvent(context, "session/startFailed", message);
        this.stopSession(threadId);
      } else {
        this.emitEvent({
          id: EventId.make(randomUUID()),
          kind: "error",
          provider: PROVIDER,
          threadId,
          createdAt: new Date().toISOString(),
          method: "session/startFailed",
          message,
        });
      }
      throw new Error(message, { cause: error });
    }
  }

  async sendTurn(input: ClaudeCodeAppServerSendTurnInput): Promise<ProviderTurnStartResult> {
    const context = this.requireSession(input.threadId);

    if (!context.acpSessionId) {
      throw new Error("Session is missing ACP session id.");
    }

    const promptContent: Array<
      { type: "text"; text: string } | { type: "image"; mimeType: string; data: string }
    > = [];
    if (input.input) {
      promptContent.push({ type: "text", text: input.input });
    }
    for (const attachment of input.attachments ?? []) {
      if (attachment.type === "image" && attachment.url) {
        const dataUrlMatch = attachment.url.match(/^data:([^;]+);base64,(.+)$/);
        if (dataUrlMatch && dataUrlMatch[1] && dataUrlMatch[2]) {
          promptContent.push({
            type: "image",
            mimeType: dataUrlMatch[1],
            data: dataUrlMatch[2],
          });
        }
      }
    }
    if (promptContent.length === 0) {
      throw new Error("Turn input must include text or attachments.");
    }

    const turnId = TurnId.make(randomUUID());

    this.emitEvent({
      id: EventId.make(randomUUID()),
      kind: "notification",
      provider: PROVIDER,
      threadId: context.session.threadId,
      createdAt: new Date().toISOString(),
      method: "turn/started",
      turnId,
      payload: {
        turn: {
          id: turnId,
          model:
            normalizeModelSlug(input.model ?? context.session.model, PROVIDER) ??
            CLAUDE_CODE_DEFAULT_MODEL,
        },
      },
    });

    this.updateSession(context, {
      status: "running",
      activeTurnId: turnId,
    });

    this.executePrompt(context, turnId, promptContent, input);

    return {
      threadId: context.session.threadId,
      turnId,
      ...(context.acpSessionId !== undefined
        ? { resumeCursor: { sessionId: context.acpSessionId } }
        : {}),
    };
  }

  private async executePrompt(
    context: ClaudeCodeSessionContext,
    turnId: TurnId,
    promptContent: Array<{ type: string; text?: string; mimeType?: string; data?: string }>,
    input: ClaudeCodeAppServerSendTurnInput,
  ): Promise<void> {
    try {
      if (input.interactionMode && context.acpSessionId) {
        try {
          await this.sendRequest(context, "session/set_mode", {
            sessionId: context.acpSessionId,
            modeId: input.interactionMode,
          });
        } catch (error) {
          await Effect.logWarning("claudeCode ACP setSessionMode failed", {
            threadId: context.session.threadId,
            mode: input.interactionMode,
            cause: error instanceof Error ? error.message : String(error),
          }).pipe(this.runPromise);
        }
      }

      const response = await this.sendRequest<{ stopReason?: string }>(
        context,
        "session/prompt",
        {
          sessionId: context.acpSessionId,
          prompt: promptContent,
        },
        PROMPT_TIMEOUT_MS,
      );

      if (context.stopping) {
        return;
      }

      const stopReason = response?.stopReason ?? "end_turn";
      const turnStatus = stopReason === "end_turn" ? "completed" : "cancelled";

      this.emitEvent({
        id: EventId.make(randomUUID()),
        kind: "notification",
        provider: PROVIDER,
        threadId: context.session.threadId,
        createdAt: new Date().toISOString(),
        method: "turn/completed",
        turnId,
        payload: {
          turn: {
            id: turnId,
            status: turnStatus,
            stopReason,
          },
        },
      });
      this.updateSession(context, {
        status: "ready",
        activeTurnId: undefined,
      });
    } catch (error) {
      if (context.stopping) {
        return;
      }

      const message = error instanceof Error ? error.message : "Prompt failed";

      this.emitEvent({
        id: EventId.make(randomUUID()),
        kind: "notification",
        provider: PROVIDER,
        threadId: context.session.threadId,
        createdAt: new Date().toISOString(),
        method: "turn/completed",
        turnId,
        payload: {
          turn: {
            id: turnId,
            status: "failed",
            error: { message },
          },
        },
      });
      this.updateSession(context, {
        status: "error",
        activeTurnId: undefined,
        lastError: message,
      });
    }
  }

  async interruptTurn(threadId: ThreadId, _turnId?: TurnId): Promise<void> {
    const context = this.requireSession(threadId);

    if (!context.acpSessionId) {
      return;
    }

    this.writeMessage(context, {
      method: "session/cancel",
      params: { sessionId: context.acpSessionId },
    });
  }

  async readThread(threadId: ThreadId): Promise<ClaudeCodeThreadSnapshot> {
    this.requireSession(threadId);
    throw new Error("readThread is not supported by the Claude Code ACP provider.");
  }

  async rollbackThread(threadId: ThreadId, _numTurns: number): Promise<ClaudeCodeThreadSnapshot> {
    this.requireSession(threadId);
    throw new Error("rollbackThread is not supported by the Claude Code ACP provider.");
  }

  async respondToRequest(
    threadId: ThreadId,
    requestId: ApprovalRequestId,
    decision: ProviderApprovalDecision,
  ): Promise<void> {
    const context = this.requireSession(threadId);
    const pendingRequest = context.pendingApprovals.get(requestId);
    if (!pendingRequest) {
      throw new Error(`Unknown pending approval request: ${requestId}`);
    }

    context.pendingApprovals.delete(requestId);

    let outcome: { outcome: string; optionId: string };
    if (decision === "decline" || decision === "cancel") {
      outcome = { outcome: "cancelled", optionId: "" };
    } else if (decision === "acceptForSession") {
      const alwaysOption = pendingRequest.options.find((o) => o.kind === "allow_always");
      outcome = {
        outcome: "proceed",
        optionId: alwaysOption?.optionId ?? "ProceedAlways",
      };
    } else {
      const onceOption = pendingRequest.options.find((o) => o.kind === "allow_once");
      outcome = {
        outcome: "proceed",
        optionId: onceOption?.optionId ?? "ProceedOnce",
      };
    }

    this.writeMessage(context, {
      id: pendingRequest.jsonRpcId,
      result: { outcome },
    });

    this.emitEvent({
      id: EventId.make(randomUUID()),
      kind: "notification",
      provider: PROVIDER,
      threadId: context.session.threadId,
      createdAt: new Date().toISOString(),
      method: "item/requestApproval/decision",
      turnId: pendingRequest.turnId,
      itemId: pendingRequest.itemId,
      requestId: pendingRequest.requestId,
      requestKind: pendingRequest.requestKind,
      payload: {
        requestId: pendingRequest.requestId,
        requestKind: pendingRequest.requestKind,
        decision,
      },
    });
  }

  async respondToUserInput(
    threadId: ThreadId,
    requestId: ApprovalRequestId,
    answers: ProviderUserInputAnswers,
  ): Promise<void> {
    const context = this.requireSession(threadId);
    const pendingRequest = context.pendingUserInputs.get(requestId);
    if (!pendingRequest) {
      throw new Error(`Unknown pending user input request: ${requestId}`);
    }

    context.pendingUserInputs.delete(requestId);
    this.writeMessage(context, {
      id: pendingRequest.jsonRpcId,
      result: { answers },
    });

    this.emitEvent({
      id: EventId.make(randomUUID()),
      kind: "notification",
      provider: PROVIDER,
      threadId: context.session.threadId,
      createdAt: new Date().toISOString(),
      method: "item/tool/requestUserInput/answered",
      turnId: pendingRequest.turnId,
      itemId: pendingRequest.itemId,
      requestId: pendingRequest.requestId,
      payload: {
        requestId: pendingRequest.requestId,
        answers,
      },
    });
  }

  stopSession(threadId: ThreadId): void {
    const context = this.sessions.get(threadId);
    if (!context) {
      return;
    }

    context.stopping = true;

    for (const pending of context.pending.values()) {
      clearTimeout(pending.timeout);
      pending.reject(new Error("Session stopped before request completed."));
    }
    context.pending.clear();
    context.pendingApprovals.clear();
    context.pendingUserInputs.clear();

    context.output.close();

    if (!context.child.killed) {
      killChildTree(context.child);
    }

    this.updateSession(context, {
      status: "closed",
      activeTurnId: undefined,
    });
    this.emitLifecycleEvent(context, "session/closed", "Session stopped");
    this.sessions.delete(threadId);
  }

  listSessions(): ProviderSession[] {
    return Array.from(this.sessions.values(), ({ session }) => ({
      ...session,
    }));
  }

  hasSession(threadId: ThreadId): boolean {
    return this.sessions.has(threadId);
  }

  stopAll(): void {
    for (const threadId of this.sessions.keys()) {
      this.stopSession(threadId);
    }
  }

  private requireSession(threadId: ThreadId): ClaudeCodeSessionContext {
    const context = this.sessions.get(threadId);
    if (!context) {
      throw new Error(`Unknown session for thread: ${threadId}`);
    }

    if (context.session.status === "closed") {
      throw new Error(`Session is closed for thread: ${threadId}`);
    }

    return context;
  }

  private attachProcessListeners(context: ClaudeCodeSessionContext): void {
    context.output.on("line", (line) => {
      this.handleStdoutLine(context, line);
    });

    context.child.stderr.on("data", (chunk: Buffer) => {
      const raw = chunk.toString();
      const lines = raw.split(/\r?\n/g);
      for (const rawLine of lines) {
        const classified = classifyClaudeCodeStderrLine(rawLine);
        if (!classified) {
          continue;
        }

        this.emitErrorEvent(context, "process/stderr", classified.message);
      }
    });

    context.child.on("error", (error) => {
      const message = error.message || "claude-agent-acp process errored.";
      this.updateSession(context, {
        status: "error",
        lastError: message,
      });
      this.emitErrorEvent(context, "process/error", message);
    });

    context.child.on("exit", (code, signal) => {
      if (context.stopping) {
        return;
      }

      const message = `claude-agent-acp exited (code=${code ?? "null"}, signal=${signal ?? "null"}).`;
      this.updateSession(context, {
        status: "closed",
        activeTurnId: undefined,
        lastError: code === 0 ? context.session.lastError : message,
      });
      this.emitLifecycleEvent(context, "session/exited", message);
      this.sessions.delete(context.session.threadId);
    });
  }

  private handleStdoutLine(context: ClaudeCodeSessionContext, line: string): void {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.startsWith("{")) {
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      return;
    }

    if (!parsed || typeof parsed !== "object") {
      this.emitErrorEvent(
        context,
        "protocol/invalidMessage",
        "Received non-object protocol message.",
      );
      return;
    }

    if (this.isServerRequest(parsed)) {
      this.handleServerRequest(context, parsed);
      return;
    }

    if (this.isServerNotification(parsed)) {
      this.handleServerNotification(context, parsed);
      return;
    }

    if (this.isResponse(parsed)) {
      this.handleResponse(context, parsed);
      return;
    }

    this.emitErrorEvent(
      context,
      "protocol/unrecognizedMessage",
      "Received protocol message in an unknown shape.",
    );
  }

  private handleServerNotification(
    context: ClaudeCodeSessionContext,
    notification: JsonRpcNotification,
  ): void {
    if (notification.method !== "session/update") {
      this.emitEvent({
        id: EventId.make(randomUUID()),
        kind: "notification",
        provider: PROVIDER,
        threadId: context.session.threadId,
        createdAt: new Date().toISOString(),
        method: notification.method,
        payload: notification.params,
      });
      return;
    }

    const params = asObject(notification.params);
    const update = asObject(params?.update);
    if (!update) {
      return;
    }

    const updateType = asString(update.sessionUpdate);
    const turnId = context.session.activeTurnId;

    switch (updateType) {
      case "agent_message_chunk": {
        const content = asObject(update.content);
        const text = asString(content?.text);
        if (text) {
          this.emitEvent({
            id: EventId.make(randomUUID()),
            kind: "notification",
            provider: PROVIDER,
            threadId: context.session.threadId,
            createdAt: new Date().toISOString(),
            method: "item/agentMessage/delta",
            turnId,
            textDelta: text,
            payload: update,
          });
        }
        break;
      }

      case "agent_thought_chunk": {
        const content = asObject(update.content);
        const text = asString(content?.text);
        if (text) {
          this.emitEvent({
            id: EventId.make(randomUUID()),
            kind: "notification",
            provider: PROVIDER,
            threadId: context.session.threadId,
            createdAt: new Date().toISOString(),
            method: "item/reasoning/textDelta",
            turnId,
            textDelta: text,
            payload: update,
          });
        }
        break;
      }

      case "user_message_chunk": {
        const content = asObject(update.content);
        const text = asString(content?.text);
        if (text) {
          this.emitEvent({
            id: EventId.make(randomUUID()),
            kind: "notification",
            provider: PROVIDER,
            threadId: context.session.threadId,
            createdAt: new Date().toISOString(),
            method: "item/userMessage/delta",
            turnId,
            textDelta: text,
            payload: update,
          });
        }
        break;
      }

      case "tool_call": {
        const toolCallId = asString(update.toolCallId);
        const status = asString(update.status);
        const title = asString(update.title);
        const kind = asString(update.kind);
        const contentBlocks = asArray(update.content);
        const itemId = toolCallId ? ProviderItemId.make(toolCallId) : undefined;

        const canonicalItemKind =
          kind === "read" || kind === "search"
            ? "fileRead"
            : kind === "edit" || kind === "delete" || kind === "move"
              ? "fileChange"
              : "commandExecution";

        if (status === "in_progress" || status === "pending") {
          this.emitEvent({
            id: EventId.make(randomUUID()),
            kind: "notification",
            provider: PROVIDER,
            threadId: context.session.threadId,
            createdAt: new Date().toISOString(),
            method: "item/started",
            turnId,
            itemId,
            payload: {
              item: {
                id: toolCallId,
                type: canonicalItemKind,
                title,
                status,
                content: contentBlocks,
                kind,
              },
            },
          });
        } else {
          this.emitEvent({
            id: EventId.make(randomUUID()),
            kind: "notification",
            provider: PROVIDER,
            threadId: context.session.threadId,
            createdAt: new Date().toISOString(),
            method: "item/completed",
            turnId,
            itemId,
            payload: {
              item: {
                id: toolCallId,
                type: canonicalItemKind,
                title,
                status,
                content: contentBlocks,
                kind,
              },
            },
          });
        }
        break;
      }

      case "tool_call_update": {
        const toolCallId = asString(update.toolCallId);
        const status = asString(update.status);
        const contentBlocks = asArray(update.content);
        const itemId = toolCallId ? ProviderItemId.make(toolCallId) : undefined;

        this.emitEvent({
          id: EventId.make(randomUUID()),
          kind: "notification",
          provider: PROVIDER,
          threadId: context.session.threadId,
          createdAt: new Date().toISOString(),
          method: status === "completed" || status === "failed" ? "item/completed" : "item/started",
          turnId,
          itemId,
          payload: {
            item: {
              id: toolCallId,
              status,
              content: contentBlocks,
            },
          },
        });
        break;
      }

      default: {
        this.emitEvent({
          id: EventId.make(randomUUID()),
          kind: "notification",
          provider: PROVIDER,
          threadId: context.session.threadId,
          createdAt: new Date().toISOString(),
          method: `acp/sessionUpdate/${updateType ?? "unknown"}`,
          turnId,
          payload: update,
        });
        break;
      }
    }
  }

  private handleServerRequest(context: ClaudeCodeSessionContext, request: JsonRpcRequest): void {
    if (request.method === "session/request_permission") {
      this.handleRequestPermission(context, request);
      return;
    }

    this.writeMessage(context, {
      id: request.id,
      error: {
        code: -32601,
        message: `Unsupported server request: ${request.method}`,
      },
    });
  }

  private handleRequestPermission(
    context: ClaudeCodeSessionContext,
    request: JsonRpcRequest,
  ): void {
    const params = asObject(request.params);
    const toolCall = asObject(params?.toolCall);
    const toolKind = asString(toolCall?.kind);
    const toolCallId = asString(toolCall?.toolCallId);
    const title = asString(toolCall?.title);
    const rawOptions = asArray(params?.options) ?? [];

    const options: AcpPermissionOption[] = rawOptions
      .map((opt) => {
        const o = asObject(opt);
        return o
          ? {
              optionId: asString(o.optionId) ?? "",
              name: asString(o.name) ?? "",
              kind: asString(o.kind) ?? "",
            }
          : undefined;
      })
      .filter((o): o is AcpPermissionOption => o !== undefined);

    const requestId = ApprovalRequestId.make(randomUUID());
    const requestKind = acpToolKindToRequestKind(toolKind);
    const approvalMethod = acpToolKindToApprovalMethod(toolKind);
    const turnId = context.session.activeTurnId;
    const itemId = toolCallId ? ProviderItemId.make(toolCallId) : undefined;

    // In full-access mode, auto-approve all permission requests immediately
    if (context.session.runtimeMode === "full-access") {
      const alwaysOption = options.find((o) => o.kind === "allow_always");
      const onceOption = options.find((o) => o.kind === "allow_once");
      const selectedOption = alwaysOption ?? onceOption;
      this.writeMessage(context, {
        id: request.id,
        result: {
          outcome: {
            outcome: "proceed",
            optionId: selectedOption?.optionId ?? "ProceedOnce",
          },
        },
      });
      this.emitEvent({
        id: EventId.make(randomUUID()),
        kind: "notification",
        provider: PROVIDER,
        threadId: context.session.threadId,
        createdAt: new Date().toISOString(),
        method: "item/requestApproval/decision",
        turnId,
        itemId,
        requestId,
        requestKind,
        payload: {
          requestId,
          requestKind,
          decision: "accept",
        },
      });
      return;
    }

    const pendingRequest: PendingApprovalRequest = {
      requestId,
      jsonRpcId: request.id,
      requestKind: requestKind ?? "command",
      threadId: context.session.threadId,
      ...(turnId ? { turnId } : {}),
      ...(itemId ? { itemId } : {}),
      options,
    };
    context.pendingApprovals.set(requestId, pendingRequest);

    const contentBlocks = asArray(toolCall?.content) ?? [];
    const firstContent = asObject(contentBlocks[0]);
    const detail =
      title ?? asString(firstContent?.path) ?? asString(asObject(firstContent?.content)?.text);

    const payload: Record<string, unknown> = {
      ...params,
      ...(detail ? { command: detail, reason: detail } : {}),
    };
    for (const block of contentBlocks) {
      const b = asObject(block);
      if (b && asString(b.type) === "diff") {
        payload.path = asString(b.path);
        payload.oldText = asString(b.oldText);
        payload.newText = asString(b.newText);
        break;
      }
    }

    this.emitEvent({
      id: EventId.make(randomUUID()),
      kind: "request",
      provider: PROVIDER,
      threadId: context.session.threadId,
      createdAt: new Date().toISOString(),
      method: approvalMethod,
      turnId,
      itemId,
      requestId,
      requestKind,
      payload,
    });
  }

  private handleResponse(context: ClaudeCodeSessionContext, response: JsonRpcResponse): void {
    const key = String(response.id);
    const pending = context.pending.get(key);
    if (!pending) {
      return;
    }

    clearTimeout(pending.timeout);
    context.pending.delete(key);

    if (response.error?.message) {
      pending.reject(new Error(`${pending.method} failed: ${String(response.error.message)}`));
      return;
    }

    pending.resolve(response.result);
  }

  private async sendRequest<TResponse>(
    context: ClaudeCodeSessionContext,
    method: string,
    params: unknown,
    timeoutMs = 20_000,
  ): Promise<TResponse> {
    const id = context.nextRequestId;
    context.nextRequestId += 1;

    const result = await new Promise<unknown>((resolve, reject) => {
      const timeout = setTimeout(() => {
        context.pending.delete(String(id));
        reject(new Error(`Timed out waiting for ${method}.`));
      }, timeoutMs);

      context.pending.set(String(id), {
        method,
        timeout,
        resolve,
        reject,
      });
      this.writeMessage(context, {
        method,
        id,
        params,
      });
    });

    return result as TResponse;
  }

  private writeMessage(context: ClaudeCodeSessionContext, message: Record<string, unknown>): void {
    const encoded = JSON.stringify({ jsonrpc: "2.0", ...message });
    if (!context.child.stdin.writable) {
      throw new Error("Cannot write to claude-agent-acp stdin.");
    }

    context.child.stdin.write(`${encoded}\n`);
  }

  private emitLifecycleEvent(
    context: ClaudeCodeSessionContext,
    method: string,
    message: string,
  ): void {
    this.emitEvent({
      id: EventId.make(randomUUID()),
      kind: "session",
      provider: PROVIDER,
      threadId: context.session.threadId,
      createdAt: new Date().toISOString(),
      method,
      message,
    });
  }

  private emitErrorEvent(context: ClaudeCodeSessionContext, method: string, message: string): void {
    this.emitEvent({
      id: EventId.make(randomUUID()),
      kind: "error",
      provider: PROVIDER,
      threadId: context.session.threadId,
      createdAt: new Date().toISOString(),
      method,
      message,
    });
  }

  private emitEvent(event: ProviderEvent): void {
    this.emit("event", event);
  }

  private updateSession(
    context: ClaudeCodeSessionContext,
    updates: Partial<ProviderSession>,
  ): void {
    context.session = {
      ...context.session,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  private isServerRequest(value: unknown): value is JsonRpcRequest {
    if (!value || typeof value !== "object") {
      return false;
    }

    const candidate = value as Record<string, unknown>;
    return (
      typeof candidate.method === "string" &&
      (typeof candidate.id === "string" || typeof candidate.id === "number")
    );
  }

  private isServerNotification(value: unknown): value is JsonRpcNotification {
    if (!value || typeof value !== "object") {
      return false;
    }

    const candidate = value as Record<string, unknown>;
    return typeof candidate.method === "string" && !("id" in candidate);
  }

  private isResponse(value: unknown): value is JsonRpcResponse {
    if (!value || typeof value !== "object") {
      return false;
    }

    const candidate = value as Record<string, unknown>;
    const hasId = typeof candidate.id === "string" || typeof candidate.id === "number";
    const hasMethod = typeof candidate.method === "string";
    return hasId && !hasMethod;
  }
}

// ── Helpers ──────────────────────────────────────────────────────────

function resolveClaudeAgentAcpBinary(): string {
  try {
    return require.resolve("@zed-industries/claude-agent-acp/dist/index.js");
  } catch {
    return path.resolve(
      __dirname,
      "../node_modules/@zed-industries/claude-agent-acp/dist/index.js",
    );
  }
}

function readClaudeCodeProviderOptions(input: ClaudeCodeAppServerStartSessionInput): {
  readonly binaryPath?: string;
  readonly apiKey?: string;
} {
  const options = input.providerOptions?.claudeCode as
    | { binaryPath?: string; apiKey?: string }
    | undefined;
  if (!options) {
    return {};
  }
  return {
    ...(options.binaryPath ? { binaryPath: options.binaryPath } : {}),
    ...(options.apiKey ? { apiKey: options.apiKey } : {}),
  };
}

function readResumeSessionId(input: ClaudeCodeAppServerStartSessionInput): string | undefined {
  const cursor = input.resumeCursor;
  if (!cursor || typeof cursor !== "object" || Array.isArray(cursor)) {
    return undefined;
  }
  const sessionId = (cursor as Record<string, unknown>).sessionId;
  if (typeof sessionId === "string" && sessionId.trim().length > 0) {
    return sessionId.trim();
  }
  return undefined;
}
