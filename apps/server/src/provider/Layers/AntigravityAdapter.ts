/**
 * AntigravityAdapter - factory for the Antigravity (`agy`) provider adapter.
 * Uses a one-shot CLI driver instead of ACP.
 *
 * @module provider/Layers/AntigravityAdapter
 */
// @effect-diagnostics nodeBuiltinImport:off cryptoRandomUUID:off
import { randomUUID } from "node:crypto";

import {
  type AntigravitySettings,
  EventId,
  ProviderDriverKind,
  ProviderInstanceId,
  ProviderItemId,
  RuntimeItemId,
  ThreadId,
  TurnId,
  type ProviderRuntimeEvent,
  type ProviderSession,
} from "@t3tools/contracts";
import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import * as Fiber from "effect/Fiber";
import * as Queue from "effect/Queue";
import * as Ref from "effect/Ref";
import * as Stream from "effect/Stream";

import type { ProviderAdapterShape } from "../Services/ProviderAdapter.ts";
import {
  ProviderAdapterProcessError,
  ProviderAdapterRequestError,
  ProviderAdapterSessionNotFoundError,
  ProviderAdapterValidationError,
  type ProviderAdapterError,
} from "../Errors.ts";
import {
  runAntigravityTurn,
  type AntigravityTurnInput,
  AntigravityDriverError,
} from "../../antigravityDriver.ts";
import { AntigravityConversationStore } from "../../persistence/Services/AntigravityConversationStore.ts";

const DRIVER_KIND = ProviderDriverKind.make("antigravity");
const DEFAULT_TURN_TIMEOUT_MS = 300_000;

export interface AntigravityAdapterLiveOptions {
  readonly instanceId?: ProviderInstanceId;
  readonly environment?: NodeJS.ProcessEnv;
}

interface ActiveTurn {
  readonly turnId: TurnId;
  readonly fiber: Fiber.Fiber<unknown, unknown>;
}

interface SessionContext {
  session: ProviderSession;
  activeTurn: ActiveTurn | null;
}

const nowIso = Effect.map(DateTime.now, DateTime.formatIso);

const makeEventBase = (
  threadId: ThreadId,
  turnId: TurnId | undefined,
  itemId: RuntimeItemId | undefined,
) =>
  Effect.gen(function* () {
    const createdAt = yield* nowIso;
    return {
      eventId: EventId.make(randomUUID()),
      provider: DRIVER_KIND,
      threadId,
      createdAt,
      ...(turnId ? { turnId } : {}),
      ...(itemId ? { itemId } : {}),
    } as const;
  });

const driverErrorToAdapter = (
  threadId: ThreadId,
  cause: AntigravityDriverError,
): ProviderAdapterError =>
  cause.reason === "binary-not-found" || cause.reason === "spawn-failed"
    ? new ProviderAdapterProcessError({
        provider: DRIVER_KIND,
        threadId,
        detail: cause.message,
        cause,
      })
    : new ProviderAdapterRequestError({
        provider: DRIVER_KIND,
        method: "turn/start",
        detail: cause.message,
        cause,
      });

export const makeAntigravityAdapter = Effect.fn("makeAntigravityAdapter")(function* (
  antigravitySettings: AntigravitySettings,
  _options?: AntigravityAdapterLiveOptions,
) {
  const sessions = new Map<ThreadId, SessionContext>();
  const conversationStore = yield* AntigravityConversationStore;
  const runtimeEventQueue = yield* Queue.unbounded<ProviderRuntimeEvent>();

  yield* Effect.addFinalizer(() =>
    Effect.gen(function* () {
      for (const ctx of sessions.values()) {
        if (ctx.activeTurn) {
          yield* Fiber.interrupt(ctx.activeTurn.fiber).pipe(Effect.ignore);
        }
      }
      yield* Queue.shutdown(runtimeEventQueue);
    }),
  );

  const offerEvent = (event: ProviderRuntimeEvent) =>
    Queue.offer(runtimeEventQueue, event).pipe(Effect.ignore);

  const startSession: ProviderAdapterShape<ProviderAdapterError>["startSession"] = (input) =>
    Effect.gen(function* () {
      if (input.provider !== undefined && input.provider !== DRIVER_KIND) {
        return yield* Effect.fail(
          new ProviderAdapterValidationError({
            provider: DRIVER_KIND,
            operation: "startSession",
            issue: `Expected provider '${DRIVER_KIND}' but received '${input.provider}'.`,
          }),
        );
      }
      const cwd = input.cwd ?? process.cwd();
      const model = input.modelSelection?.model;
      const now = yield* nowIso;
      const session: ProviderSession = {
        provider: DRIVER_KIND,
        status: "ready",
        runtimeMode: input.runtimeMode,
        ...(model ? { model } : {}),
        cwd,
        threadId: input.threadId,
        createdAt: now,
        updatedAt: now,
      };
      sessions.set(input.threadId, { session, activeTurn: null });
      return { ...session };
    });

  const requireSession = (threadId: ThreadId) => {
    const ctx = sessions.get(threadId);
    if (!ctx) {
      return Effect.fail(
        new ProviderAdapterSessionNotFoundError({
          provider: DRIVER_KIND,
          threadId,
        }),
      );
    }
    return Effect.succeed(ctx);
  };

  const sendTurn: ProviderAdapterShape<ProviderAdapterError>["sendTurn"] = (input) =>
    Effect.gen(function* () {
      const ctx = yield* requireSession(input.threadId);

      if (input.interactionMode === "plan") {
        const base = yield* makeEventBase(input.threadId, undefined, undefined);
        yield* offerEvent({
          ...base,
          type: "runtime.warning",
          payload: {
            message:
              "Antigravity does not support plan mode; downgrading to default interaction mode.",
          },
        });
      }

      const prompt = input.input?.trim();
      if (!prompt) {
        return yield* Effect.fail(
          new ProviderAdapterValidationError({
            provider: DRIVER_KIND,
            operation: "sendTurn",
            issue: "Antigravity requires a non-empty text prompt; attachments are not supported.",
          }),
        );
      }

      const model = input.modelSelection?.model ?? ctx.session.model ?? "";
      const turnId = TurnId.make(randomUUID());
      const itemId = ProviderItemId.make(randomUUID());
      const runtimeItemId = RuntimeItemId.make(itemId);

      const conversationId = yield* conversationStore.get(input.threadId).pipe(
        Effect.mapError(
          (cause) =>
            new ProviderAdapterRequestError({
              provider: DRIVER_KIND,
              method: "turn/start",
              detail: "Failed to load antigravity conversation id.",
              cause,
            }),
        ),
      );

      const driverInput: AntigravityTurnInput = {
        binaryPath: antigravitySettings.binaryPath,
        cwd: ctx.session.cwd ?? process.cwd(),
        model,
        prompt,
        conversationId,
        dangerouslySkipPermissions: antigravitySettings.dangerouslySkipPermissions,
        timeoutMs: DEFAULT_TURN_TIMEOUT_MS,
      };

      {
        const base = yield* makeEventBase(input.threadId, turnId, undefined);
        yield* offerEvent({
          ...base,
          type: "turn.started",
          payload: {
            ...(model ? { model } : {}),
          },
        });
      }

      const itemStartedRef = yield* Ref.make(false);

      const onLine = (line: string) =>
        Effect.gen(function* () {
          const started = yield* Ref.getAndSet(itemStartedRef, true);
          if (!started) {
            const base = yield* makeEventBase(input.threadId, turnId, runtimeItemId);
            yield* offerEvent({
              ...base,
              type: "item.started",
              payload: {
                itemType: "assistant_message",
                status: "inProgress",
                title: "Assistant message",
              },
            });
          }
          const base = yield* makeEventBase(input.threadId, turnId, runtimeItemId);
          yield* offerEvent({
            ...base,
            type: "content.delta",
            payload: {
              streamKind: "assistant_text",
              delta: `${line}\n`,
            },
          });
        });

      const driverEffect = Effect.gen(function* () {
        const result = yield* runAntigravityTurn(driverInput, (ev) => onLine(ev.text)).pipe(
          Effect.mapError((cause) => driverErrorToAdapter(input.threadId, cause)),
        );
        const started = yield* Ref.get(itemStartedRef);
        if (started) {
          const base = yield* makeEventBase(input.threadId, turnId, runtimeItemId);
          yield* offerEvent({
            ...base,
            type: "item.completed",
            payload: {
              itemType: "assistant_message",
              status: result.state === "completed" ? "completed" : "failed",
              title: "Assistant message",
            },
          });
        }
        if (result.mintedConversationId && conversationId === null) {
          yield* conversationStore
            .set(input.threadId, result.mintedConversationId)
            .pipe(
              Effect.catch((cause) =>
                Effect.logError("antigravity: failed to persist minted conversation id").pipe(
                  Effect.annotateLogs({ cause: String(cause) }),
                ),
              ),
            );
        }
        const base = yield* makeEventBase(input.threadId, turnId, undefined);
        yield* offerEvent({
          ...base,
          type: "turn.completed",
          payload: {
            state:
              result.state === "completed"
                ? "completed"
                : result.state === "cancelled"
                  ? "cancelled"
                  : "failed",
            ...(result.errorMessage ? { errorMessage: result.errorMessage } : {}),
          },
        });
        return result;
      }).pipe(
        Effect.catch((error: ProviderAdapterError) =>
          Effect.gen(function* () {
            const baseCompleted = yield* makeEventBase(input.threadId, turnId, undefined);
            yield* offerEvent({
              ...baseCompleted,
              type: "turn.completed",
              payload: {
                state: "failed",
                errorMessage: error.message,
              },
            });
            const baseError = yield* makeEventBase(input.threadId, turnId, undefined);
            yield* offerEvent({
              ...baseError,
              type: "runtime.error",
              payload: {
                message: error.message,
                class: "provider_error",
              },
            });
            return null;
          }),
        ),
      );

      const fiber = yield* Effect.forkDetach(driverEffect);
      ctx.activeTurn = { turnId, fiber };
      const updatedAt = yield* nowIso;
      ctx.session = {
        ...ctx.session,
        status: "running",
        activeTurnId: turnId,
        updatedAt,
      };

      // When the fiber resolves, clear the active turn reference.
      yield* Effect.forkDetach(
        Fiber.await(fiber).pipe(
          Effect.flatMap(() =>
            Effect.gen(function* () {
              if (ctx.activeTurn?.turnId === turnId) {
                ctx.activeTurn = null;
                const nextUpdatedAt = yield* nowIso;
                ctx.session = {
                  ...ctx.session,
                  status: "ready",
                  updatedAt: nextUpdatedAt,
                };
              }
            }),
          ),
        ),
      );

      return {
        threadId: input.threadId,
        turnId,
      };
    });

  const interruptTurn: ProviderAdapterShape<ProviderAdapterError>["interruptTurn"] = (
    threadId,
    _turnId,
  ) =>
    Effect.gen(function* () {
      const ctx = yield* requireSession(threadId);
      if (!ctx.activeTurn) return;
      yield* Fiber.interrupt(ctx.activeTurn.fiber).pipe(Effect.ignore);
    });

  const respondToRequest: ProviderAdapterShape<ProviderAdapterError>["respondToRequest"] = (
    _threadId,
    _r,
    _d,
  ) =>
    Effect.fail(
      new ProviderAdapterRequestError({
        provider: DRIVER_KIND,
        method: "respondToRequest",
        detail: "Antigravity does not surface per-call approval requests.",
      }),
    );

  const respondToUserInput: ProviderAdapterShape<ProviderAdapterError>["respondToUserInput"] = (
    _threadId,
    _r,
    _a,
  ) =>
    Effect.fail(
      new ProviderAdapterRequestError({
        provider: DRIVER_KIND,
        method: "respondToUserInput",
        detail: "Antigravity does not surface user-input requests.",
      }),
    );

  const stopSession: ProviderAdapterShape<ProviderAdapterError>["stopSession"] = (threadId) =>
    Effect.gen(function* () {
      const ctx = sessions.get(threadId);
      if (!ctx) return;
      if (ctx.activeTurn) {
        yield* Fiber.interrupt(ctx.activeTurn.fiber).pipe(Effect.ignore);
      }
      sessions.delete(threadId);
    });

  const listSessions: ProviderAdapterShape<ProviderAdapterError>["listSessions"] = () =>
    Effect.sync(() => Array.from(sessions.values(), ({ session }) => ({ ...session })));

  const hasSession: ProviderAdapterShape<ProviderAdapterError>["hasSession"] = (threadId) =>
    Effect.sync(() => sessions.has(threadId));

  const readThread: ProviderAdapterShape<ProviderAdapterError>["readThread"] = (threadId) =>
    Effect.fail(
      new ProviderAdapterRequestError({
        provider: DRIVER_KIND,
        method: "readThread",
        detail: `readThread is not supported by the Antigravity provider (thread ${threadId}).`,
      }),
    );

  const rollbackThread: ProviderAdapterShape<ProviderAdapterError>["rollbackThread"] = (
    threadId,
    _n,
  ) =>
    Effect.fail(
      new ProviderAdapterRequestError({
        provider: DRIVER_KIND,
        method: "rollbackThread",
        detail: `rollbackThread is not supported by the Antigravity provider (thread ${threadId}).`,
      }),
    );

  const stopAll: ProviderAdapterShape<ProviderAdapterError>["stopAll"] = () =>
    Effect.gen(function* () {
      for (const ctx of sessions.values()) {
        if (ctx.activeTurn) {
          yield* Fiber.interrupt(ctx.activeTurn.fiber).pipe(Effect.ignore);
        }
      }
      sessions.clear();
    });

  return {
    provider: DRIVER_KIND,
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
  } satisfies ProviderAdapterShape<ProviderAdapterError>;
});
