import { type ChildProcessWithoutNullStreams, spawn, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
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
  type ProviderTurnStartResult,
  RuntimeMode,
  ProviderInteractionMode,
} from "@t3tools/contracts";
import { normalizeModelSlug } from "@t3tools/shared/model";
import { Effect, Context } from "effect";

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

interface GeminiSessionContext {
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

export interface GeminiAppServerSendTurnInput {
  readonly threadId: ThreadId;
  readonly input?: string;
  readonly attachments?: ReadonlyArray<{ type: "image"; url: string }>;
  readonly model?: string;
  readonly serviceTier?: string | null;
  readonly effort?: string;
  readonly interactionMode?: ProviderInteractionMode;
}

export interface GeminiAppServerStartSessionInput {
  readonly threadId: ThreadId;
  readonly provider?: "gemini";
  readonly cwd?: string;
  readonly model?: string;
  readonly serviceTier?: string;
  readonly resumeCursor?: unknown;
  readonly runtimeMode: RuntimeMode;
}

export interface GeminiThreadTurnSnapshot {
  id: TurnId;
  items: unknown[];
}

export interface GeminiThreadSnapshot {
  threadId: string;
  turns: GeminiThreadTurnSnapshot[];
}

const ANSI_ESCAPE_CHAR = String.fromCharCode(27);
const ANSI_ESCAPE_REGEX = new RegExp(`${ANSI_ESCAPE_CHAR}\\[[0-9;]*m`, "g");
const GEMINI_STDERR_LOG_REGEX =
  /^\d{4}-\d{2}-\d{2}T\S+\s+(TRACE|DEBUG|INFO|WARN|ERROR)\s+\S+:\s+(.*)$/;
const BENIGN_ERROR_LOG_SNIPPETS = [
  "state db missing rollout path for thread",
  "state db record_discrepancy: find_thread_path_by_id_str_in_subdir, falling_back",
];
const GEMINI_DEFAULT_MODEL = "gemini-3.1-pro-preview";

/** Timeout for the long-running `prompt` request (10 minutes). */
const PROMPT_TIMEOUT_MS = 600_000;

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

/**
 * On Windows with `shell: true`, `child.kill()` only terminates the `cmd.exe`
 * wrapper, leaving the actual command running. Use `taskkill /T` to kill the
 * entire process tree instead.
 */
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

export function normalizeGeminiModelSlug(
  model: string | undefined | null,
  preferredId?: string,
): string | undefined {
  const normalized = normalizeModelSlug(model);
  if (!normalized) {
    return undefined;
  }

  if (preferredId?.endsWith("-gemini") && preferredId !== normalized) {
    return preferredId;
  }

  return normalized;
}

export function classifyGeminiStderrLine(rawLine: string): { message: string } | null {
  const line = rawLine.replaceAll(ANSI_ESCAPE_REGEX, "").trim();
  if (!line) {
    return null;
  }

  const match = line.match(GEMINI_STDERR_LOG_REGEX);
  if (match) {
    const level = match[1];
    if (level && level !== "ERROR") {
      return null;
    }

    const isBenignError = BENIGN_ERROR_LOG_SNIPPETS.some((snippet) => line.includes(snippet));
    if (isBenignError) {
      return null;
    }
  }

  return { message: line };
}

/**
 * Map T3 Code runtime mode to the ACP session mode id.
 * Gemini CLI supports: "default", "autoEdit", "yolo"
 */
function runtimeModeToAcpMode(runtimeMode: RuntimeMode): string {
  switch (runtimeMode) {
    case "full-access":
      return "yolo";
    case "approval-required":
    default:
      return "default";
  }
}

/**
 * Map ACP tool kind to the provider request kind used by the adapter layer.
 */
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

/**
 * Map ACP tool kind to the Codex-style approval method name expected by the
 * adapter layer's event mapping.
 */
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

export interface GeminiAppServerManagerEvents {
  event: [event: ProviderEvent];
}

/**
 * GeminiAppServerManager — manages Gemini CLI sessions using the ACP
 * (Agent Client Protocol) over JSON-RPC/ndjson stdio.
 *
 * Protocol flow per session:
 *   1. Spawn `gemini --experimental-acp [--model <model>]`
 *   2. initialize({ protocolVersion: 1 }) → { authMethods, agentCapabilities }
 *   3. authenticate({ methodId }) → void
 *   4. session/new({ cwd, mcpServers: [] }) → { sessionId, modes }
 *   5. session/prompt({ sessionId, prompt: [...] }) → { stopReason } (long-running)
 *      During prompt, server pushes `session/update` notifications and
 *      `session/request_permission` requests.
 *   6. session/cancel({ sessionId }) to interrupt a running prompt.
 */
export class GeminiAppServerManager extends EventEmitter<GeminiAppServerManagerEvents> {
  private readonly sessions = new Map<ThreadId, GeminiSessionContext>();

  private runPromise: (effect: Effect.Effect<unknown, never>) => Promise<unknown>;
  constructor(services?: Context.Context<never>) {
    super();
    this.runPromise = services ? Effect.runPromiseWith(services) : Effect.runPromise;
  }

  async startSession(input: GeminiAppServerStartSessionInput): Promise<ProviderSession> {
    const threadId = input.threadId;
    const now = new Date().toISOString();
    let context: GeminiSessionContext | undefined;

    try {
      const resolvedCwd = input.cwd ?? process.cwd();

      const session: ProviderSession = {
        provider: "gemini",
        status: "connecting",
        runtimeMode: input.runtimeMode,
        model: normalizeGeminiModelSlug(input.model),
        cwd: resolvedCwd,
        threadId,
        createdAt: now,
        updatedAt: now,
      };

      const geminiOptions = readGeminiProviderOptions(input);
      const geminiBinaryPath = geminiOptions.binaryPath ?? "gemini";
      const geminiHomePath = geminiOptions.homePath;

      const spawnArgs = ["--experimental-acp"];
      const resolvedModel = normalizeGeminiModelSlug(input.model) ?? GEMINI_DEFAULT_MODEL;
      spawnArgs.push("--model", resolvedModel);

      const child = spawn(geminiBinaryPath, spawnArgs, {
        cwd: resolvedCwd,
        env: {
          ...process.env,
          ...(geminiHomePath ? { GEMINI_HOME: geminiHomePath } : {}),
        },
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

      this.emitLifecycleEvent(context, "session/connecting", "Starting gemini --experimental-acp");

      // Step 1: ACP initialize
      const initResponse = await this.sendRequest<{
        protocolVersion?: string | number;
        authMethods?: Array<{ id: string; name: string; description?: string }>;
        agentInfo?: { name?: string; version?: string };
        agentCapabilities?: unknown;
      }>(context, "initialize", { protocolVersion: 1 });

      await Effect.logInfo("gemini ACP initialize response", {
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
        await Effect.logInfo("gemini ACP authenticated", {
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
          await Effect.logInfo("gemini ACP loadSession succeeded", {
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
          await Effect.logWarning("gemini ACP loadSession fell back to newSession", {
            threadId,
            resumeSessionId,
            cause: error instanceof Error ? error.message : String(error),
          }).pipe(this.runPromise);
          // Fall through to newSession below
        }
      }

      if (!acpSessionId) {
        this.emitLifecycleEvent(
          context,
          "session/threadOpenRequested",
          "Starting a new Gemini ACP session.",
        );
        const newSessionResponse = await this.sendRequest<{
          sessionId?: string;
          modes?: { availableModes?: unknown[]; currentModeId?: string };
        }>(context, "session/new", {
          cwd: resolvedCwd,
          mcpServers: [],
        });

        acpSessionId = newSessionResponse?.sessionId;
        if (!acpSessionId) {
          throw new Error("newSession response did not include a sessionId.");
        }

        await Effect.logInfo("gemini ACP newSession succeeded", {
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
        await Effect.logInfo("gemini ACP session mode set", {
          threadId,
          acpMode,
          runtimeMode: input.runtimeMode,
        }).pipe(this.runPromise);
      } catch (error) {
        await Effect.logWarning("gemini ACP set_mode failed during startup", {
          threadId,
          acpMode,
          cause: error instanceof Error ? error.message : String(error),
        }).pipe(this.runPromise);
        // Non-fatal — the fallback auto-approve in handleRequestPermission covers this
      }

      this.updateSession(context, {
        status: "ready",
        resumeCursor: { sessionId: acpSessionId },
      });
      this.emitLifecycleEvent(
        context,
        "session/threadOpenResolved",
        `Gemini ACP session established.`,
      );
      this.emitLifecycleEvent(context, "session/ready", `Connected to ACP session ${acpSessionId}`);
      return { ...context.session };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to start Gemini session.";
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
          provider: "gemini",
          threadId,
          createdAt: new Date().toISOString(),
          method: "session/startFailed",
          message,
        });
      }
      throw new Error(message, { cause: error });
    }
  }

  async sendTurn(input: GeminiAppServerSendTurnInput): Promise<ProviderTurnStartResult> {
    const context = this.requireSession(input.threadId);

    if (!context.acpSessionId) {
      throw new Error("Session is missing ACP session id.");
    }

    // Build ACP prompt content blocks
    const promptContent: Array<
      { type: "text"; text: string } | { type: "image"; mimeType: string; data: string }
    > = [];
    if (input.input) {
      promptContent.push({ type: "text", text: input.input });
    }
    for (const attachment of input.attachments ?? []) {
      if (attachment.type === "image" && attachment.url) {
        // data: URLs → extract mime and base64
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

    // Emit synthetic turn/started notification so the adapter sees the turn begin
    this.emitEvent({
      id: EventId.make(randomUUID()),
      kind: "notification",
      provider: "gemini",
      threadId: context.session.threadId,
      createdAt: new Date().toISOString(),
      method: "turn/started",
      turnId,
      payload: {
        turn: {
          id: turnId,
          model:
            normalizeGeminiModelSlug(input.model ?? context.session.model) ?? GEMINI_DEFAULT_MODEL,
        },
      },
    });

    this.updateSession(context, {
      status: "running",
      activeTurnId: turnId,
    });

    // Fire prompt asynchronously — don't block the sendTurn return.
    this.executePrompt(context, turnId, promptContent, input);

    return {
      threadId: context.session.threadId,
      turnId,
      ...(context.acpSessionId !== undefined
        ? { resumeCursor: { sessionId: context.acpSessionId } }
        : {}),
    };
  }

  /**
   * Executes the ACP `prompt` request and emits turn/completed when done.
   * Runs asynchronously — errors are emitted as events, not thrown.
   */
  private async executePrompt(
    context: GeminiSessionContext,
    turnId: TurnId,
    promptContent: Array<{ type: string; text?: string; mimeType?: string; data?: string }>,
    input: GeminiAppServerSendTurnInput,
  ): Promise<void> {
    try {
      // Optionally change session mode before prompting
      if (input.interactionMode && context.acpSessionId) {
        try {
          await this.sendRequest(context, "session/set_mode", {
            sessionId: context.acpSessionId,
            modeId: input.interactionMode,
          });
        } catch (error) {
          await Effect.logWarning("gemini ACP setSessionMode failed", {
            threadId: context.session.threadId,
            mode: input.interactionMode,
            cause: error instanceof Error ? error.message : String(error),
          }).pipe(this.runPromise);
          // Non-fatal — proceed with prompt
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
        provider: "gemini",
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
        provider: "gemini",
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

    // ACP cancel is a notification (fire-and-forget, no response expected)
    this.writeMessage(context, {
      method: "session/cancel",
      params: { sessionId: context.acpSessionId },
    });
  }

  async readThread(threadId: ThreadId): Promise<GeminiThreadSnapshot> {
    this.requireSession(threadId);
    // ACP does not have a thread/read equivalent. History is streamed on
    // loadSession, not returned via a dedicated read method.
    throw new Error("readThread is not supported by the Gemini ACP provider.");
  }

  async rollbackThread(threadId: ThreadId, _numTurns: number): Promise<GeminiThreadSnapshot> {
    this.requireSession(threadId);
    throw new Error("rollbackThread is not supported by the Gemini ACP provider.");
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

    // Map decision to ACP outcome
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
      // "accept"
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
      provider: "gemini",
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
      provider: "gemini",
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

  private requireSession(threadId: ThreadId): GeminiSessionContext {
    const context = this.sessions.get(threadId);
    if (!context) {
      throw new Error(`Unknown session for thread: ${threadId}`);
    }

    if (context.session.status === "closed") {
      throw new Error(`Session is closed for thread: ${threadId}`);
    }

    return context;
  }

  private attachProcessListeners(context: GeminiSessionContext): void {
    context.output.on("line", (line) => {
      this.handleStdoutLine(context, line);
    });

    context.child.stderr.on("data", (chunk: Buffer) => {
      const raw = chunk.toString();
      const lines = raw.split(/\r?\n/g);
      for (const rawLine of lines) {
        const classified = classifyGeminiStderrLine(rawLine);
        if (!classified) {
          continue;
        }

        this.emitErrorEvent(context, "process/stderr", classified.message);
      }
    });

    context.child.on("error", (error) => {
      const message = error.message || "gemini ACP process errored.";
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

      const message = `gemini ACP exited (code=${code ?? "null"}, signal=${signal ?? "null"}).`;
      this.updateSession(context, {
        status: "closed",
        activeTurnId: undefined,
        lastError: code === 0 ? context.session.lastError : message,
      });
      this.emitLifecycleEvent(context, "session/exited", message);
      this.sessions.delete(context.session.threadId);
    });
  }

  private handleStdoutLine(context: GeminiSessionContext, line: string): void {
    const trimmed = line.trim();
    // Skip empty lines and non-JSON log output from the Gemini CLI
    // (e.g. "Ignore file not found", "Hook registry initialized", etc.)
    if (!trimmed || !trimmed.startsWith("{")) {
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      // Silently skip non-JSON lines — the Gemini CLI may emit log lines to stdout
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

  /**
   * Handle ACP `sessionUpdate` notifications and translate them to
   * ProviderEvent method names the adapter layer understands.
   */
  private handleServerNotification(
    context: GeminiSessionContext,
    notification: JsonRpcNotification,
  ): void {
    if (notification.method !== "session/update") {
      // Forward unknown notifications as-is
      this.emitEvent({
        id: EventId.make(randomUUID()),
        kind: "notification",
        provider: "gemini",
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
            provider: "gemini",
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
            provider: "gemini",
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
            provider: "gemini",
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

        // Determine the item type for the adapter
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
            provider: "gemini",
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
          // completed or failed
          this.emitEvent({
            id: EventId.make(randomUUID()),
            kind: "notification",
            provider: "gemini",
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
          provider: "gemini",
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
        // Pass through unrecognized session updates
        this.emitEvent({
          id: EventId.make(randomUUID()),
          kind: "notification",
          provider: "gemini",
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

  /**
   * Handle ACP server→client requests. The main one is `requestPermission`.
   */
  private handleServerRequest(context: GeminiSessionContext, request: JsonRpcRequest): void {
    if (request.method === "session/request_permission") {
      this.handleRequestPermission(context, request);
      return;
    }

    // Unknown server request — reject it
    this.writeMessage(context, {
      id: request.id,
      error: {
        code: -32601,
        message: `Unsupported server request: ${request.method}`,
      },
    });
  }

  private handleRequestPermission(context: GeminiSessionContext, request: JsonRpcRequest): void {
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
        provider: "gemini",
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

    // Extract detail from tool call content for the approval request event
    const contentBlocks = asArray(toolCall?.content) ?? [];
    const firstContent = asObject(contentBlocks[0]);
    const detail =
      title ?? asString(firstContent?.path) ?? asString(asObject(firstContent?.content)?.text);

    // Build payload that matches what the adapter expects
    const payload: Record<string, unknown> = {
      ...params,
      ...(detail ? { command: detail, reason: detail } : {}),
    };
    // If there are diff content blocks, extract file info
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
      provider: "gemini",
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

  private handleResponse(context: GeminiSessionContext, response: JsonRpcResponse): void {
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
    context: GeminiSessionContext,
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

  private writeMessage(context: GeminiSessionContext, message: Record<string, unknown>): void {
    const encoded = JSON.stringify({ jsonrpc: "2.0", ...message });
    if (!context.child.stdin.writable) {
      throw new Error("Cannot write to gemini ACP stdin.");
    }

    context.child.stdin.write(`${encoded}\n`);
  }

  private emitLifecycleEvent(context: GeminiSessionContext, method: string, message: string): void {
    this.emitEvent({
      id: EventId.make(randomUUID()),
      kind: "session",
      provider: "gemini",
      threadId: context.session.threadId,
      createdAt: new Date().toISOString(),
      method,
      message,
    });
  }

  private emitErrorEvent(context: GeminiSessionContext, method: string, message: string): void {
    this.emitEvent({
      id: EventId.make(randomUUID()),
      kind: "error",
      provider: "gemini",
      threadId: context.session.threadId,
      createdAt: new Date().toISOString(),
      method,
      message,
    });
  }

  private emitEvent(event: ProviderEvent): void {
    this.emit("event", event);
  }

  private updateSession(context: GeminiSessionContext, updates: Partial<ProviderSession>): void {
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

function readGeminiProviderOptions(_input: GeminiAppServerStartSessionInput): {
  readonly binaryPath?: string;
  readonly homePath?: string;
} {
  return {};
}

function readResumeSessionId(input: GeminiAppServerStartSessionInput): string | undefined {
  const cursor = input.resumeCursor;
  if (!cursor || typeof cursor !== "object" || Array.isArray(cursor)) {
    return undefined;
  }
  // Support both new format { sessionId } and legacy format { threadId }
  const sessionId = (cursor as Record<string, unknown>).sessionId;
  if (typeof sessionId === "string" && sessionId.trim().length > 0) {
    return sessionId.trim();
  }
  return undefined;
}
