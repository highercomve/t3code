import { type ChildProcessWithoutNullStreams, spawn, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { EventEmitter } from "node:events";
import readline from "node:readline";

import {
  ApprovalRequestId,
  EventId,
  ProviderItemId,
  ProviderRequestKind,
  ThreadId,
  TurnId,
  type ProviderEvent,
  type ProviderSession,
  type ProviderTurnStartResult,
  RuntimeMode,
  ProviderInteractionMode,
} from "@t3tools/contracts";

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
  method:
    | "item/commandExecution/requestApproval"
    | "item/fileChange/requestApproval"
    | "item/fileRead/requestApproval";
  requestKind: ProviderRequestKind;
  threadId: ThreadId;
  turnId?: TurnId;
  itemId?: ProviderItemId;
  options: AcpPermissionOption[];
}

interface CopilotSessionContext {
  session: ProviderSession;
  copilotSessionId: string | undefined;
  child: ChildProcessWithoutNullStreams;
  output: readline.Interface;
  pending: Map<PendingRequestKey, PendingRequest>;
  pendingApprovals: Map<ApprovalRequestId, PendingApprovalRequest>;
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

export interface CopilotAppServerSendTurnInput {
  readonly threadId: ThreadId;
  readonly input?: string | undefined;
  readonly attachments?: ReadonlyArray<{ type: "image"; url: string }> | undefined;
  readonly model?: string | undefined;
  readonly effort?: string | undefined;
  readonly interactionMode?: ProviderInteractionMode | undefined;
}

export interface CopilotAppServerStartSessionInput {
  readonly threadId: ThreadId;
  readonly provider?: "copilotAgent" | undefined;
  readonly cwd?: string | undefined;
  readonly model?: string | undefined;
  readonly binaryPath: string;
  readonly runtimeMode: RuntimeMode;
}

// ── Constants ────────────────────────────────────────────────────────

const PROVIDER = "copilotAgent" as const;

/** Timeout for the long-running `session/prompt` request (10 minutes). */
const PROMPT_TIMEOUT_MS = 600_000;

const ANSI_ESCAPE_CHAR = String.fromCharCode(27);
const ANSI_ESCAPE_REGEX = new RegExp(`${ANSI_ESCAPE_CHAR}\\[[0-9;]*m`, "g");

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

// ── Manager ──────────────────────────────────────────────────────────

/**
 * CopilotAppServerManager — manages Copilot sessions using the ACP
 * (Agent Client Protocol) over JSON-RPC/ndjson stdio via `copilot --acp`.
 *
 * Protocol flow per session:
 *   1. Spawn `copilot --acp --allow-all [--model ...]`
 *   2. initialize({ protocolVersion: 1 }) → { agentCapabilities, agentInfo }
 *   3. session/new({ cwd, mcpServers: [] }) → { sessionId, models, modes }
 *   4. session/prompt({ sessionId, prompt: [...] }) → { stopReason } (long-running)
 *      During prompt, server pushes `session/update` notifications and
 *      `session/request_permission` requests.
 *   5. session/cancel({ sessionId }) to interrupt a running prompt.
 */
export class CopilotAppServerManager extends EventEmitter {
  private sessions = new Map<ThreadId, CopilotSessionContext>();
  private binaryPath: string = "copilot";

  constructor(binaryPath?: string) {
    super();
    if (binaryPath) {
      this.binaryPath = binaryPath;
    }
  }

  async startSession(input: CopilotAppServerStartSessionInput): Promise<ProviderSession> {
    const { threadId, cwd, model, binaryPath } = input;
    const resolvedBinaryPath = binaryPath || this.binaryPath;
    const resolvedCwd = cwd || process.cwd();
    const now = new Date().toISOString();

    const child = spawn(
      resolvedBinaryPath,
      ["--acp", "--allow-all", ...(model ? ["--model", model] : [])],
      {
        cwd: resolvedCwd,
        stdio: ["pipe", "pipe", "pipe"],
        shell: process.platform === "win32",
        env: {
          ...process.env,
        },
      },
    );

    const output = readline.createInterface({
      input: child.stdout,
      crlfDelay: Infinity,
    });

    const context: CopilotSessionContext = {
      session: {
        threadId,
        createdAt: now,
        updatedAt: now,
        provider: PROVIDER,
        runtimeMode: input.runtimeMode || "full-access",
        status: "connecting" as const,
      },
      copilotSessionId: undefined,
      child,
      output,
      pending: new Map(),
      pendingApprovals: new Map(),
      nextRequestId: 1,
      stopping: false,
    };

    this.sessions.set(threadId, context);
    this.attachProcessListeners(context);

    this.emitLifecycleEvent(context, "session/connecting", "Starting copilot --acp");

    try {
      // Step 1: ACP initialize
      await this.sendRequest<{
        protocolVersion?: number;
        agentCapabilities?: unknown;
        agentInfo?: { name?: string; title?: string; version?: string };
      }>(context, "initialize", {
        protocolVersion: 1,
        capabilities: {},
        clientInfo: {
          name: "t3code",
          version: "1.0.0",
        },
      });

      // Step 2: ACP session/new — creates a session and returns sessionId
      this.emitLifecycleEvent(
        context,
        "session/threadOpenRequested",
        "Starting a new Copilot ACP session.",
      );

      const newSessionResponse = await this.sendRequest<{
        sessionId?: string;
        models?: {
          availableModels?: Array<{ modelId: string; name?: string; description?: string }>;
          currentModelId?: string;
        };
        modes?: {
          availableModes?: unknown[];
          currentModeId?: string;
        };
        configOptions?: unknown[];
      }>(context, "session/new", {
        cwd: resolvedCwd,
        mcpServers: [],
      });

      const copilotSessionId = newSessionResponse?.sessionId;
      if (!copilotSessionId) {
        throw new Error("session/new response did not include a sessionId.");
      }

      context.copilotSessionId = copilotSessionId;

      this.updateSession(context, {
        status: "ready",
        resumeCursor: { sessionId: copilotSessionId },
      });
      this.emitLifecycleEvent(
        context,
        "session/threadOpenResolved",
        "Copilot ACP session established.",
      );
      this.emitLifecycleEvent(
        context,
        "session/ready",
        `Connected to ACP session ${copilotSessionId}`,
      );

      return { ...context.session };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to start Copilot session.";
      this.updateSession(context, {
        status: "error",
        lastError: message,
      });
      this.emitErrorEvent(context, "session/startFailed", message);
      this.stopSession(threadId);
      throw new Error(message, { cause: error });
    }
  }

  async sendTurn(input: CopilotAppServerSendTurnInput): Promise<ProviderTurnStartResult> {
    const context = this.requireSession(input.threadId);

    if (!context.copilotSessionId) {
      throw new Error("Session is missing Copilot ACP session id.");
    }

    const promptContent: Array<{ type: "text"; text: string }> = [];
    if (input.input) {
      promptContent.push({ type: "text", text: input.input });
    }
    if (promptContent.length === 0) {
      throw new Error("Turn input must include text.");
    }

    // Generate a turnId locally since Copilot doesn't return one
    const turnId = TurnId.makeUnsafe(randomUUID());

    this.emitEvent({
      id: EventId.makeUnsafe(randomUUID()),
      kind: "notification",
      provider: PROVIDER,
      threadId: context.session.threadId,
      createdAt: new Date().toISOString(),
      method: "turn/started",
      turnId,
      payload: {
        turn: {
          id: turnId,
        },
      },
    });

    this.updateSession(context, {
      status: "running",
      activeTurnId: turnId,
    });

    // Execute prompt asynchronously (fire-and-forget, completion handled internally)
    this.executePrompt(context, turnId, promptContent);

    return {
      threadId: input.threadId,
      turnId,
      ...(context.copilotSessionId !== undefined
        ? { resumeCursor: { sessionId: context.copilotSessionId } }
        : {}),
    };
  }

  private async executePrompt(
    context: CopilotSessionContext,
    turnId: TurnId,
    promptContent: Array<{ type: "text"; text: string }>,
  ): Promise<void> {
    try {
      const response = await this.sendRequest<{ stopReason?: string }>(
        context,
        "session/prompt",
        {
          sessionId: context.copilotSessionId,
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
        id: EventId.makeUnsafe(randomUUID()),
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
        id: EventId.makeUnsafe(randomUUID()),
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

    if (!context.copilotSessionId) {
      return;
    }

    // Send session/cancel as a notification (no response expected)
    this.writeMessage(context, {
      method: "session/cancel",
      params: { sessionId: context.copilotSessionId },
    });
  }

  async stopSession(threadId: ThreadId): Promise<void> {
    const context = this.sessions.get(threadId);
    if (!context) {
      return;
    }

    context.stopping = true;

    // Clear all pending requests
    for (const pending of context.pending.values()) {
      clearTimeout(pending.timeout);
      pending.reject(new Error("Session stopped before request completed."));
    }
    context.pending.clear();
    context.pendingApprovals.clear();

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

  async readThread(
    threadId: ThreadId,
  ): Promise<{ threadId: string; turns: Array<{ id: TurnId; items: unknown[] }> }> {
    this.requireSession(threadId);
    // Copilot ACP does not support reading thread history
    return {
      threadId,
      turns: [],
    };
  }

  async rollbackThread(_threadId: ThreadId, _numTurns: number): Promise<void> {
    // Copilot ACP does not support thread rollback
    throw new Error("rollbackThread is not supported by the Copilot ACP provider.");
  }

  async respondToRequest(
    threadId: ThreadId,
    requestId: ApprovalRequestId,
    decision: "approve" | "deny",
  ): Promise<void> {
    const context = this.requireSession(threadId);

    const pending = context.pendingApprovals.get(requestId);
    if (!pending) {
      throw new Error(`No pending request found for ${requestId}`);
    }

    context.pendingApprovals.delete(requestId);

    let outcome: { outcome: string; optionId: string };
    if (decision === "deny") {
      outcome = { outcome: "cancelled", optionId: "" };
    } else {
      const alwaysOption = pending.options.find((o) => o.kind === "allow_always");
      const onceOption = pending.options.find((o) => o.kind === "allow_once");
      const selectedOption = alwaysOption ?? onceOption;
      outcome = {
        outcome: "proceed",
        optionId: selectedOption?.optionId ?? "ProceedOnce",
      };
    }

    this.writeMessage(context, {
      id: pending.jsonRpcId,
      result: { outcome },
    });

    this.emitEvent({
      id: EventId.makeUnsafe(randomUUID()),
      kind: "notification",
      provider: PROVIDER,
      threadId: context.session.threadId,
      createdAt: new Date().toISOString(),
      method: "item/requestApproval/decision",
      requestId,
      requestKind: pending.requestKind,
      ...(pending.turnId ? { turnId: pending.turnId } : {}),
      ...(pending.itemId ? { itemId: pending.itemId } : {}),
      payload: {
        requestId,
        requestKind: pending.requestKind,
        decision,
      },
    });
  }

  async respondToUserInput(
    threadId: ThreadId,
    requestId: ApprovalRequestId,
    answers: string[],
  ): Promise<void> {
    const context = this.requireSession(threadId);

    const pending = context.pendingApprovals.get(requestId);
    if (!pending) {
      throw new Error(`No pending user input request found for ${requestId}`);
    }

    context.pendingApprovals.delete(requestId);
    this.writeMessage(context, {
      id: pending.jsonRpcId,
      result: { answers },
    });

    this.emitEvent({
      id: EventId.makeUnsafe(randomUUID()),
      kind: "notification",
      provider: PROVIDER,
      threadId: context.session.threadId,
      createdAt: new Date().toISOString(),
      method: "item/tool/requestUserInput/answered",
      ...(pending.turnId ? { turnId: pending.turnId } : {}),
      ...(pending.itemId ? { itemId: pending.itemId } : {}),
      payload: { answers },
    });
  }

  getActiveSessions(): ThreadId[] {
    return Array.from(this.sessions.keys());
  }

  // ── Private helpers ────────────────────────────────────────────────

  private requireSession(threadId: ThreadId): CopilotSessionContext {
    const context = this.sessions.get(threadId);
    if (!context) {
      throw new Error(`No session found for thread ${threadId}`);
    }
    if (context.session.status === "closed") {
      throw new Error(`Session is closed for thread: ${threadId}`);
    }
    return context;
  }

  private attachProcessListeners(context: CopilotSessionContext): void {
    context.output.on("line", (line: string) => {
      this.handleLine(context, line);
    });

    context.child.stderr.on("data", (chunk: Buffer) => {
      const raw = chunk.toString();
      const lines = raw.split(/\r?\n/g);
      for (const rawLine of lines) {
        const trimmed = rawLine.trim();
        if (trimmed) {
          this.emitErrorEvent(context, "process/stderr", trimmed);
        }
      }
    });

    context.child.on("error", (error: Error) => {
      const message = error.message || "copilot process errored.";
      this.updateSession(context, {
        status: "error",
        lastError: message,
      });
      this.emitErrorEvent(context, "process/error", message);
    });

    context.child.on("exit", (code: number | null, signal: string | null) => {
      if (context.stopping) {
        return;
      }

      const message = `copilot exited (code=${code ?? "null"}, signal=${signal ?? "null"}).`;
      this.updateSession(context, {
        status: "closed",
        activeTurnId: undefined,
        lastError: code === 0 ? context.session.lastError : message,
      });
      this.emitLifecycleEvent(context, "session/exited", message);
      this.sessions.delete(context.session.threadId);
    });
  }

  private async sendRequest<TResponse>(
    context: CopilotSessionContext,
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

  private writeMessage(context: CopilotSessionContext, message: unknown): void {
    const encoded = JSON.stringify(message);
    if (!context.child.stdin.writable) {
      throw new Error("Cannot write to copilot stdin.");
    }
    context.child.stdin.write(`${encoded}\n`);
  }

  private handleLine(context: CopilotSessionContext, line: string): void {
    const cleaned = line.replace(ANSI_ESCAPE_REGEX, "").trim();
    if (!cleaned || !cleaned.startsWith("{")) {
      return;
    }

    let data: unknown;
    try {
      data = JSON.parse(cleaned);
    } catch {
      return;
    }

    if (!data || typeof data !== "object") {
      return;
    }

    const record = data as Record<string, unknown>;

    // Server request: has both `method` and `id`
    if (typeof record.method === "string" && "id" in record) {
      this.handleServerRequest(context, record as unknown as JsonRpcRequest);
      return;
    }

    // Notification: has `method` but no `id`
    if (typeof record.method === "string" && !("id" in record)) {
      this.handleNotification(context, record as unknown as JsonRpcNotification);
      return;
    }

    // Response: has `id` but no `method`
    if ("id" in record && !("method" in record)) {
      this.handleResponse(context, record as unknown as JsonRpcResponse);
    }
  }

  private handleResponse(context: CopilotSessionContext, response: JsonRpcResponse): void {
    const pending = context.pending.get(String(response.id));
    if (!pending) {
      return;
    }

    clearTimeout(pending.timeout);
    context.pending.delete(String(response.id));

    if (response.error?.message) {
      pending.reject(new Error(`${pending.method} failed: ${String(response.error.message)}`));
      return;
    }

    pending.resolve(response.result);
  }

  /**
   * Handles `session/update` notifications from the Copilot ACP server.
   *
   * The Copilot ACP uses the same `session/update` notification format as
   * Claude Code ACP, with `sessionUpdate` types:
   *   - agent_message_chunk → item/agentMessage/delta
   *   - agent_thought_chunk → item/reasoning/textDelta
   *   - user_message_chunk  → item/userMessage/delta
   *   - tool_call           → item/started or item/completed
   *   - tool_call_update    → item/started or item/completed
   */
  private handleNotification(
    context: CopilotSessionContext,
    notification: JsonRpcNotification,
  ): void {
    // For non-session/update notifications, emit as-is
    if (notification.method !== "session/update") {
      this.emitEvent({
        id: EventId.makeUnsafe(randomUUID()),
        kind: "notification",
        provider: PROVIDER,
        threadId: context.session.threadId,
        createdAt: new Date().toISOString(),
        method: notification.method,
        payload: notification.params,
      });
      return;
    }

    // Handle session/update notifications
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
            id: EventId.makeUnsafe(randomUUID()),
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
            id: EventId.makeUnsafe(randomUUID()),
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
            id: EventId.makeUnsafe(randomUUID()),
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
        const itemId = toolCallId ? ProviderItemId.makeUnsafe(toolCallId) : undefined;

        const canonicalItemKind =
          kind === "read" || kind === "search"
            ? "fileRead"
            : kind === "edit" || kind === "delete" || kind === "move"
              ? "fileChange"
              : "commandExecution";

        if (status === "in_progress" || status === "pending") {
          this.emitEvent({
            id: EventId.makeUnsafe(randomUUID()),
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
            id: EventId.makeUnsafe(randomUUID()),
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
        const itemId = toolCallId ? ProviderItemId.makeUnsafe(toolCallId) : undefined;

        this.emitEvent({
          id: EventId.makeUnsafe(randomUUID()),
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
          id: EventId.makeUnsafe(randomUUID()),
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

  private handleServerRequest(context: CopilotSessionContext, request: JsonRpcRequest): void {
    if (request.method === "session/request_permission") {
      this.handleRequestPermission(context, request);
      return;
    }

    if (request.method === "item/tool/requestUserInput") {
      this.handleRequestUserInput(context, request);
      return;
    }

    // Older-style approval methods (may still be used by Copilot)
    const requestKind = this.requestKindForMethod(request.method);
    if (requestKind) {
      this.handleLegacyApprovalRequest(context, request, requestKind);
      return;
    }

    // Unknown server requests: respond with unsupported error
    this.writeMessage(context, {
      id: request.id,
      error: {
        code: -32601,
        message: `Unsupported server request: ${request.method}`,
      },
    });
  }

  private handleRequestPermission(context: CopilotSessionContext, request: JsonRpcRequest): void {
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

    const requestId = ApprovalRequestId.makeUnsafe(randomUUID());
    const requestKind = acpToolKindToRequestKind(toolKind);
    const approvalMethod = acpToolKindToApprovalMethod(toolKind);
    const turnId = context.session.activeTurnId;
    const itemId = toolCallId ? ProviderItemId.makeUnsafe(toolCallId) : undefined;

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
        id: EventId.makeUnsafe(randomUUID()),
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
      method: approvalMethod as PendingApprovalRequest["method"],
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
      id: EventId.makeUnsafe(randomUUID()),
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

  private handleRequestUserInput(context: CopilotSessionContext, request: JsonRpcRequest): void {
    const params = asObject(request.params);
    const turnId = context.session.activeTurnId;
    const itemIdRaw = asString(params?.itemId);
    const itemId = itemIdRaw ? ProviderItemId.makeUnsafe(itemIdRaw) : undefined;

    const requestId = ApprovalRequestId.makeUnsafe(randomUUID());
    context.pendingApprovals.set(requestId, {
      requestId,
      jsonRpcId: request.id,
      method: "item/commandExecution/requestApproval",
      requestKind: "command",
      threadId: context.session.threadId,
      ...(turnId ? { turnId } : {}),
      ...(itemId ? { itemId } : {}),
      options: [],
    });

    this.emitEvent({
      id: EventId.makeUnsafe(randomUUID()),
      kind: "request",
      provider: PROVIDER,
      threadId: context.session.threadId,
      createdAt: new Date().toISOString(),
      method: "item/tool/requestUserInput",
      ...(turnId ? { turnId } : {}),
      ...(itemId ? { itemId } : {}),
      requestId,
      requestKind: "command",
      payload: request.params,
    });
  }

  private handleLegacyApprovalRequest(
    context: CopilotSessionContext,
    request: JsonRpcRequest,
    requestKind: ProviderRequestKind,
  ): void {
    const route = this.readRouteFields(request.params);
    const requestId = ApprovalRequestId.makeUnsafe(randomUUID());

    const pendingRequest: PendingApprovalRequest = {
      requestId,
      jsonRpcId: request.id,
      method:
        requestKind === "command"
          ? "item/commandExecution/requestApproval"
          : requestKind === "file-read"
            ? "item/fileRead/requestApproval"
            : "item/fileChange/requestApproval",
      requestKind,
      threadId: context.session.threadId,
      ...(route.turnId ? { turnId: route.turnId } : {}),
      ...(route.itemId ? { itemId: route.itemId } : {}),
      options: [],
    };
    context.pendingApprovals.set(requestId, pendingRequest);

    this.emitEvent({
      id: EventId.makeUnsafe(randomUUID()),
      kind: "request",
      provider: PROVIDER,
      threadId: context.session.threadId,
      createdAt: new Date().toISOString(),
      method: request.method,
      ...(route.turnId ? { turnId: route.turnId } : {}),
      ...(route.itemId ? { itemId: route.itemId } : {}),
      requestId,
      requestKind,
      payload: request.params,
    });
  }

  private requestKindForMethod(method: string): ProviderRequestKind | undefined {
    if (method === "item/commandExecution/requestApproval") {
      return "command";
    }
    if (method === "item/fileRead/requestApproval") {
      return "file-read";
    }
    if (method === "item/fileChange/requestApproval") {
      return "file-change";
    }
    return undefined;
  }

  private readRouteFields(params: unknown): {
    turnId?: TurnId;
    itemId?: ProviderItemId;
  } {
    const route: { turnId?: TurnId; itemId?: ProviderItemId } = {};
    const obj = asObject(params);
    const turnIdRaw = asString(obj?.turnId) ?? asString(asObject(obj?.turn)?.id);
    const itemIdRaw = asString(obj?.itemId) ?? asString(asObject(obj?.item)?.id);

    if (turnIdRaw) {
      route.turnId = TurnId.makeUnsafe(turnIdRaw);
    }
    if (itemIdRaw) {
      route.itemId = ProviderItemId.makeUnsafe(itemIdRaw);
    }
    return route;
  }

  private updateSession(context: CopilotSessionContext, updates: Partial<ProviderSession>): void {
    context.session = {
      ...context.session,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  private emitLifecycleEvent(
    context: CopilotSessionContext,
    method: string,
    message: string,
  ): void {
    this.emitEvent({
      id: EventId.makeUnsafe(randomUUID()),
      kind: "session",
      provider: PROVIDER,
      threadId: context.session.threadId,
      createdAt: new Date().toISOString(),
      method,
      message,
    });
  }

  private emitErrorEvent(context: CopilotSessionContext, method: string, message: string): void {
    this.emitEvent({
      id: EventId.makeUnsafe(randomUUID()),
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
}

export function createCopilotAppServerManager(binaryPath?: string): CopilotAppServerManager {
  return new CopilotAppServerManager(binaryPath);
}
