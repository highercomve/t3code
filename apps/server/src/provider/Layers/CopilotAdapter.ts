/**
 * CopilotAdapterLive - Scoped live implementation for the Copilot provider adapter.
 *
 * Wraps Copilot CLI process behind the `CopilotAdapter` service contract and
 * maps manager failures into the shared `ProviderAdapterError` algebra.
 *
 * @module CopilotAdapterLive
 */
import {
  type ProviderEvent,
  type ProviderRuntimeEvent,
  ProviderApprovalDecision,
  ProviderItemId,
  ThreadId,
  TurnId,
  ProviderSendTurnInput,
  type ProviderSession,
  type ProviderTurnStartResult,
} from "@t3tools/contracts";
import { Effect, Layer, Queue, Stream } from "effect";

import { type AcpRawSources, mapAcpEventToRuntimeEvents } from "../acpEventMapper.ts";

import {
  ProviderAdapterProcessError,
  ProviderAdapterRequestError,
  ProviderAdapterSessionClosedError,
  ProviderAdapterSessionNotFoundError,
  ProviderAdapterValidationError,
  type ProviderAdapterError,
} from "../Errors.ts";
import { CopilotAdapter, type CopilotAdapterShape } from "../Services/CopilotAdapter.ts";
import { ServerSettingsService } from "../../serverSettings.ts";
import { CopilotAppServerManager } from "../../copilotAppServerManager.ts";

const PROVIDER = "copilotAgent" as const;

const COPILOT_RAW_SOURCES: AcpRawSources = {
  notification: "copilot.acp.notification",
  request: "copilot.acp.request",
};

function toMessage(cause: unknown, fallback: string): string {
  if (cause instanceof Error && cause.message.length > 0) {
    return cause.message;
  }
  return fallback;
}

function toSessionError(
  threadId: ThreadId,
  cause: unknown,
): ProviderAdapterSessionNotFoundError | ProviderAdapterSessionClosedError | undefined {
  const normalized = toMessage(cause, "").toLowerCase();
  if (normalized.includes("unknown session") || normalized.includes("unknown provider session")) {
    return new ProviderAdapterSessionNotFoundError({
      provider: PROVIDER,
      threadId,
      cause,
    });
  }
  if (normalized.includes("session is closed")) {
    return new ProviderAdapterSessionClosedError({
      provider: PROVIDER,
      threadId,
      cause,
    });
  }
  return undefined;
}

function toRequestError(threadId: ThreadId, method: string, cause: unknown): ProviderAdapterError {
  const sessionError = toSessionError(threadId, cause);
  if (sessionError) {
    return sessionError;
  }
  return new ProviderAdapterRequestError({
    provider: PROVIDER,
    method,
    detail: toMessage(cause, `${method} failed`),
    cause,
  });
}

interface CopilotStartInput {
  threadId: ThreadId;
  cwd?: string;
  model?: string;
  binaryPath?: string;
  runtimeMode?: "approval-required" | "full-access";
}

interface CopilotSendTurnInput {
  threadId: ThreadId;
  input?: string;
  model?: string;
  effort?: string;
  interactionMode?: "default" | "plan";
}

const makeCopilotAdapter = Effect.fn("makeCopilotAdapter")(function* () {
  const serverSettingsService = yield* ServerSettingsService;

  const runtimeEventQueue = yield* Queue.unbounded<ProviderRuntimeEvent>();
  const manager = new CopilotAppServerManager();

  const startSession: CopilotAdapterShape["startSession"] = Effect.fn("startSession")(
    function* (input) {
      if (input.provider !== undefined && input.provider !== PROVIDER) {
        return yield* new ProviderAdapterValidationError({
          provider: PROVIDER,
          operation: "startSession",
          issue: `Expected provider '${PROVIDER}' but received '${input.provider}'.`,
        });
      }

      try {
        const copilotSettings = yield* serverSettingsService.getSettings.pipe(
          Effect.map((settings) => settings.providers.copilotAgent),
          Effect.orDie,
        );

        const session: ProviderSession = yield* Effect.promise(() =>
          manager.startSession({
            threadId: input.threadId,
            cwd: input.cwd,
            model: input.modelSelection?.model,
            binaryPath: copilotSettings.binaryPath || "copilot",
            runtimeMode: input.runtimeMode || "full-access",
          }),
        );

        return session;
      } catch (error) {
        return yield* Effect.fail(toRequestError(input.threadId, "session_start", error));
      }
    },
  );

  const sendTurn: CopilotAdapterShape["sendTurn"] = Effect.fn("sendTurn")(function* (input) {
    try {
      const modelSelection = input.modelSelection as
        | { model?: string; options?: { reasoningEffort?: string } }
        | undefined;
      const result: ProviderTurnStartResult = yield* Effect.promise(() =>
        manager.sendTurn({
          threadId: input.threadId,
          input: input.input,
          model: modelSelection?.model,
          effort: modelSelection?.options?.reasoningEffort,
          interactionMode: input.interactionMode,
        }),
      );
      return result;
    } catch (error) {
      return yield* Effect.fail(toRequestError(input.threadId, "turn_start", error));
    }
  });

  const interruptTurn: CopilotAdapterShape["interruptTurn"] = Effect.fn("interruptTurn")(
    function* (threadId, turnId) {
      try {
        yield* Effect.promise(() => manager.interruptTurn(threadId, turnId!));
      } catch (error) {
        return yield* Effect.fail(toRequestError(threadId, "turn_interrupt", error));
      }
    },
  );

  const readThread: CopilotAdapterShape["readThread"] = Effect.fn("readThread")(
    function* (threadId) {
      return yield* Effect.tryPromise({
        try: () => manager.readThread(threadId),
        catch: (error) => toRequestError(threadId, "thread_read", error),
      }).pipe(
        Effect.map((result) => ({
          threadId: ThreadId.makeUnsafe(result.threadId),
          turns: result.turns,
        })),
      );
    },
  );

  const rollbackThread: CopilotAdapterShape["rollbackThread"] = Effect.fn("rollbackThread")(
    function* (threadId, numTurns) {
      if (!Number.isInteger(numTurns) || numTurns < 1) {
        return yield* new ProviderAdapterValidationError({
          provider: PROVIDER,
          operation: "rollbackThread",
          issue: "numTurns must be an integer >= 1.",
        });
      }

      yield* Effect.tryPromise({
        try: () => manager.rollbackThread(threadId, numTurns),
        catch: (error) => toRequestError(threadId, "thread_rollback", error),
      });

      return yield* Effect.tryPromise({
        try: () => manager.readThread(threadId),
        catch: (error) => toRequestError(threadId, "thread_read", error),
      }).pipe(
        Effect.map((result) => ({
          threadId: ThreadId.makeUnsafe(result.threadId),
          turns: result.turns,
        })),
      );
    },
  );

  const respondToRequest: CopilotAdapterShape["respondToRequest"] = Effect.fn("respondToRequest")(
    function* (threadId, requestId, decision) {
      const copilotDecision =
        decision === "accept" || decision === "acceptForSession" ? "approve" : "deny";
      try {
        yield* Effect.promise(() => manager.respondToRequest(threadId, requestId, copilotDecision));
      } catch (error) {
        return yield* Effect.fail(toRequestError(threadId, "approval_respond", error));
      }
    },
  );

  const respondToUserInput: CopilotAdapterShape["respondToUserInput"] = Effect.fn(
    "respondToUserInput",
  )(function* (threadId, requestId, answers) {
    const answerArray = Object.values(answers)
      .flatMap((v) => (Array.isArray(v) ? v : [v]))
      .filter((v): v is string => typeof v === "string");

    try {
      yield* Effect.promise(() => manager.respondToUserInput(threadId, requestId, answerArray));
    } catch (error) {
      return yield* Effect.fail(toRequestError(threadId, "userInput_respond", error));
    }
  });

  const stopSession: CopilotAdapterShape["stopSession"] = Effect.fn("stopSession")(
    function* (threadId) {
      try {
        yield* Effect.promise(() => manager.stopSession(threadId));
      } catch (error) {
        return yield* Effect.fail(toRequestError(threadId, "session_stop", error));
      }
    },
  );

  const listSessions: CopilotAdapterShape["listSessions"] = () =>
    Effect.sync(() => {
      const threadIds = manager.getActiveSessions();
      return threadIds.map((threadId) => ({
        threadId,
        provider: PROVIDER,
        runtimeMode: "full-access" as const,
        status: "running" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    });

  const hasSession: CopilotAdapterShape["hasSession"] = (threadId) =>
    Effect.sync(() => manager.getActiveSessions().includes(threadId));

  const stopAll: CopilotAdapterShape["stopAll"] = Effect.fn("stopAll")(function* () {
    const sessions = manager.getActiveSessions();
    for (const threadId of sessions) {
      try {
        yield* Effect.promise(() => manager.stopSession(threadId));
      } catch {}
    }
  });

  const registerListener = Effect.fn("registerListener")(function* () {
    const services = yield* Effect.services<never>();
    const listenerEffect = Effect.fn("listener")(function* (event: ProviderEvent) {
      const runtimeEvents = mapAcpEventToRuntimeEvents(event, event.threadId, COPILOT_RAW_SOURCES);
      if (runtimeEvents.length === 0) {
        yield* Effect.logDebug("ignoring unhandled Copilot provider event", {
          method: event.method,
          threadId: event.threadId,
          turnId: event.turnId,
          itemId: event.itemId,
        });
        return;
      }
      yield* Queue.offerAll(runtimeEventQueue, runtimeEvents);
    });
    const listener = (event: ProviderEvent) =>
      listenerEffect(event).pipe(Effect.runPromiseWith(services));
    manager.on("event", listener);
    return listener;
  });

  const unregisterListener = Effect.fn("unregisterListener")(function* (
    listener: (event: ProviderEvent) => Promise<void>,
  ) {
    yield* Effect.sync(() => {
      manager.off("event", listener);
    });
    yield* Queue.shutdown(runtimeEventQueue);
  });

  yield* Effect.acquireRelease(registerListener(), unregisterListener);

  return {
    provider: PROVIDER,
    capabilities: {
      sessionModelSwitch: "in-session",
    },
    startSession,
    sendTurn,
    interruptTurn,
    readThread,
    rollbackThread,
    respondToRequest,
    respondToUserInput,
    stopSession,
    listSessions,
    hasSession,
    stopAll,
    streamEvents: Stream.fromQueue(runtimeEventQueue),
  } satisfies CopilotAdapterShape;
});

export const CopilotAdapterLive = Layer.effect(CopilotAdapter, makeCopilotAdapter());

export function makeCopilotAdapterLive() {
  return Layer.effect(CopilotAdapter, makeCopilotAdapter());
}
