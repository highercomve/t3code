/**
 * AntigravityAdapterLive - scoped live implementation of the Antigravity
 * provider adapter. Wraps the one-shot `agy --print` driver (no ACP).
 */
import { randomUUID } from "node:crypto";

import {
  EventId,
  ProviderItemId,
  RuntimeItemId,
  ThreadId,
  TurnId,
  type ProviderRuntimeEvent,
  type ProviderSession,
} from "@t3tools/contracts";
import { Effect, Fiber, Layer, Queue, Ref, Stream } from "effect";

import {
  ProviderAdapterProcessError,
  ProviderAdapterRequestError,
  ProviderAdapterSessionNotFoundError,
  ProviderAdapterValidationError,
  type ProviderAdapterError,
} from "../Errors.ts";
import {
  AntigravityAdapter,
  type AntigravityAdapterShape,
} from "../Services/AntigravityAdapter.ts";
import {
  runAntigravityTurn,
  type AntigravityTurnInput,
  AntigravityDriverError,
} from "../../antigravityDriver.ts";
import { ServerSettingsService } from "../../serverSettings.ts";
import { AntigravityConversationStore } from "../../persistence/Services/AntigravityConversationStore.ts";

const PROVIDER = "antigravity" as const;
const DEFAULT_TURN_TIMEOUT_MS = 300_000;

interface ActiveTurn {
  readonly turnId: TurnId;
  readonly fiber: Fiber.Fiber<unknown, unknown>;
}

interface SessionContext {
  session: ProviderSession;
  activeTurn: ActiveTurn | null;
}

function nowIso(): string {
  return new Date().toISOString();
}

function eventBase(
  threadId: ThreadId,
  turnId: TurnId | undefined,
  itemId: RuntimeItemId | undefined,
): {
  eventId: EventId;
  provider: typeof PROVIDER;
  threadId: ThreadId;
  createdAt: string;
  turnId?: TurnId;
  itemId?: RuntimeItemId;
} {
  return {
    eventId: EventId.make(randomUUID()),
    provider: PROVIDER,
    threadId,
    createdAt: nowIso(),
    ...(turnId ? { turnId } : {}),
    ...(itemId ? { itemId } : {}),
  };
}

const makeAntigravityAdapter = Effect.gen(function* () {
  const sessions = new Map<ThreadId, SessionContext>();
  const settingsService = yield* ServerSettingsService;
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

  const startSession: AntigravityAdapterShape["startSession"] = (input) => {
    if (input.provider !== undefined && input.provider !== PROVIDER) {
      return Effect.fail(
        new ProviderAdapterValidationError({
          provider: PROVIDER,
          operation: "startSession",
          issue: `Expected provider '${PROVIDER}' but received '${input.provider}'.`,
        }),
      );
    }
    return Effect.sync(() => {
      const cwd = input.cwd ?? process.cwd();
      const model = input.modelSelection?.model;
      const now = nowIso();
      const session: ProviderSession = {
        provider: PROVIDER,
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
  };

  const requireSession = (threadId: ThreadId) => {
    const ctx = sessions.get(threadId);
    if (!ctx) {
      return Effect.fail(
        new ProviderAdapterSessionNotFoundError({
          provider: PROVIDER,
          threadId,
        }),
      );
    }
    return Effect.succeed(ctx);
  };

  const driverErrorToAdapter = (
    threadId: ThreadId,
    cause: AntigravityDriverError,
  ): ProviderAdapterError =>
    cause.reason === "binary-not-found" || cause.reason === "spawn-failed"
      ? new ProviderAdapterProcessError({
          provider: PROVIDER,
          threadId,
          detail: cause.message,
          cause,
        })
      : new ProviderAdapterRequestError({
          provider: PROVIDER,
          method: "turn/start",
          detail: cause.message,
          cause,
        });

  const sendTurn: AntigravityAdapterShape["sendTurn"] = (input) =>
    Effect.gen(function* () {
      const ctx = yield* requireSession(input.threadId);

      if (input.interactionMode === "plan") {
        yield* offerEvent({
          ...eventBase(input.threadId, undefined, undefined),
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
            provider: PROVIDER,
            operation: "sendTurn",
            issue: "Antigravity requires a non-empty text prompt; attachments are not supported.",
          }),
        );
      }

      const settings = yield* settingsService.getSettings.pipe(
        Effect.map((s) => s.providers.antigravity),
        Effect.mapError(
          (cause) =>
            new ProviderAdapterRequestError({
              provider: PROVIDER,
              method: "turn/start",
              detail: "Failed to read antigravity settings.",
              cause,
            }),
        ),
      );

      const model = input.modelSelection?.model ?? ctx.session.model ?? "";
      const turnId = TurnId.make(randomUUID());
      const itemId = ProviderItemId.make(randomUUID());
      const runtimeItemId = RuntimeItemId.make(itemId);

      const conversationId = yield* conversationStore.get(input.threadId).pipe(
        Effect.mapError(
          (cause) =>
            new ProviderAdapterRequestError({
              provider: PROVIDER,
              method: "turn/start",
              detail: "Failed to load antigravity conversation id.",
              cause,
            }),
        ),
      );

      const driverInput: AntigravityTurnInput = {
        binaryPath: settings.binaryPath,
        cwd: ctx.session.cwd ?? process.cwd(),
        model,
        prompt,
        conversationId,
        dangerouslySkipPermissions: settings.dangerouslySkipPermissions,
        timeoutMs: DEFAULT_TURN_TIMEOUT_MS,
      };

      yield* offerEvent({
        ...eventBase(input.threadId, turnId, undefined),
        type: "turn.started",
        payload: {
          ...(model ? { model } : {}),
        },
      });

      const itemStartedRef = yield* Ref.make(false);

      const onLine = (line: string) =>
        Effect.gen(function* () {
          const started = yield* Ref.getAndSet(itemStartedRef, true);
          if (!started) {
            yield* offerEvent({
              ...eventBase(input.threadId, turnId, runtimeItemId),
              type: "item.started",
              payload: {
                itemType: "assistant_message",
                status: "inProgress",
                title: "Assistant message",
              },
            });
          }
          yield* offerEvent({
            ...eventBase(input.threadId, turnId, runtimeItemId),
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
          yield* offerEvent({
            ...eventBase(input.threadId, turnId, runtimeItemId),
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
        yield* offerEvent({
          ...eventBase(input.threadId, turnId, undefined),
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
            yield* offerEvent({
              ...eventBase(input.threadId, turnId, undefined),
              type: "turn.completed",
              payload: {
                state: "failed",
                errorMessage: error.message,
              },
            });
            yield* offerEvent({
              ...eventBase(input.threadId, turnId, undefined),
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
      ctx.session = {
        ...ctx.session,
        status: "running",
        activeTurnId: turnId,
        updatedAt: nowIso(),
      };

      // When the fiber resolves, clear the active turn reference.
      yield* Effect.forkDetach(
        Fiber.await(fiber).pipe(
          Effect.flatMap(() =>
            Effect.sync(() => {
              if (ctx.activeTurn?.turnId === turnId) {
                ctx.activeTurn = null;
                ctx.session = {
                  ...ctx.session,
                  status: "ready",
                  updatedAt: nowIso(),
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

  const interruptTurn: AntigravityAdapterShape["interruptTurn"] = (threadId, _turnId) =>
    Effect.gen(function* () {
      const ctx = yield* requireSession(threadId);
      if (!ctx.activeTurn) return;
      yield* Fiber.interrupt(ctx.activeTurn.fiber).pipe(Effect.ignore);
    });

  const respondToRequest: AntigravityAdapterShape["respondToRequest"] = (_threadId, _r, _d) =>
    Effect.fail(
      new ProviderAdapterRequestError({
        provider: PROVIDER,
        method: "respondToRequest",
        detail: "Antigravity does not surface per-call approval requests.",
      }),
    );

  const respondToUserInput: AntigravityAdapterShape["respondToUserInput"] = (_threadId, _r, _a) =>
    Effect.fail(
      new ProviderAdapterRequestError({
        provider: PROVIDER,
        method: "respondToUserInput",
        detail: "Antigravity does not surface user-input requests.",
      }),
    );

  const stopSession: AntigravityAdapterShape["stopSession"] = (threadId) =>
    Effect.gen(function* () {
      const ctx = sessions.get(threadId);
      if (!ctx) return;
      if (ctx.activeTurn) {
        yield* Fiber.interrupt(ctx.activeTurn.fiber).pipe(Effect.ignore);
      }
      sessions.delete(threadId);
    });

  const listSessions: AntigravityAdapterShape["listSessions"] = () =>
    Effect.sync(() => Array.from(sessions.values(), ({ session }) => ({ ...session })));

  const hasSession: AntigravityAdapterShape["hasSession"] = (threadId) =>
    Effect.sync(() => sessions.has(threadId));

  const readThread: AntigravityAdapterShape["readThread"] = (threadId) =>
    Effect.fail(
      new ProviderAdapterRequestError({
        provider: PROVIDER,
        method: "readThread",
        detail: `readThread is not supported by the Antigravity provider (thread ${threadId}).`,
      }),
    );

  const rollbackThread: AntigravityAdapterShape["rollbackThread"] = (threadId, _n) =>
    Effect.fail(
      new ProviderAdapterRequestError({
        provider: PROVIDER,
        method: "rollbackThread",
        detail: `rollbackThread is not supported by the Antigravity provider (thread ${threadId}).`,
      }),
    );

  const stopAll: AntigravityAdapterShape["stopAll"] = () =>
    Effect.gen(function* () {
      for (const ctx of sessions.values()) {
        if (ctx.activeTurn) {
          yield* Fiber.interrupt(ctx.activeTurn.fiber).pipe(Effect.ignore);
        }
      }
      sessions.clear();
    });

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
  } satisfies AntigravityAdapterShape;
});

export const AntigravityAdapterLive = Layer.effect(AntigravityAdapter, makeAntigravityAdapter);

export const makeAntigravityAdapterLive = () =>
  Layer.effect(AntigravityAdapter, makeAntigravityAdapter);
