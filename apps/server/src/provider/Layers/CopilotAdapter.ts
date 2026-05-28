/**
 * CopilotAdapter — placeholder adapter for the GitHub Copilot CLI provider.
 *
 * Copilot exposes an ACP-compatible CLI (`copilot acp`). A full ACP
 * implementation lives behind the same shape used by `CursorAdapter` /
 * `OpenCodeAdapter`; this stub keeps the driver wireable end-to-end while
 * the fuller ACP plumbing lands.
 *
 * Session-level operations currently fail with a clear message so the UI
 * surfaces the integration gap instead of silently hanging. The provider
 * still passes status checks, shows up in the picker, and round-trips
 * settings — enough for a re-implementer to iterate.
 *
 * @module provider/Layers/CopilotAdapter
 */
import {
  type CopilotSettings,
  ProviderDriverKind,
  ProviderInstanceId,
  type ProviderRuntimeEvent,
  ThreadId,
} from "@t3tools/contracts";
import * as Effect from "effect/Effect";
import * as Queue from "effect/Queue";
import * as Stream from "effect/Stream";

import type { ProviderAdapterShape } from "../Services/ProviderAdapter.ts";
import {
  ProviderAdapterRequestError,
  ProviderAdapterValidationError,
  type ProviderAdapterError,
} from "../Errors.ts";

const DRIVER_KIND = ProviderDriverKind.make("copilotAgent");

export interface CopilotAdapterLiveOptions {
  readonly instanceId?: ProviderInstanceId;
  readonly environment?: NodeJS.ProcessEnv;
}

const unsupported = (method: string) =>
  Effect.fail(
    new ProviderAdapterRequestError({
      provider: DRIVER_KIND,
      method,
      detail:
        "Copilot ACP integration is not yet wired in this build. Configure Copilot under Settings → Providers; the session loop will land in a follow-up.",
    }),
  );

export const makeCopilotAdapter = Effect.fn("makeCopilotAdapter")(function* (
  _copilotSettings: CopilotSettings,
  _options?: CopilotAdapterLiveOptions,
) {
  const runtimeEventQueue = yield* Queue.unbounded<ProviderRuntimeEvent>();

  yield* Effect.addFinalizer(() => Queue.shutdown(runtimeEventQueue));

  const startSession: ProviderAdapterShape<ProviderAdapterError>["startSession"] = (input) =>
    Effect.fail(
      new ProviderAdapterValidationError({
        provider: DRIVER_KIND,
        operation: "startSession",
        issue: `Copilot ACP session loop is not yet wired in this build (thread ${input.threadId}).`,
      }),
    );

  const sendTurn: ProviderAdapterShape<ProviderAdapterError>["sendTurn"] = (_input) =>
    unsupported("turn/start");

  const interruptTurn: ProviderAdapterShape<ProviderAdapterError>["interruptTurn"] = (_t, _u) =>
    Effect.void;

  const respondToRequest: ProviderAdapterShape<ProviderAdapterError>["respondToRequest"] = (
    _t,
    _r,
    _d,
  ) => unsupported("respondToRequest");

  const respondToUserInput: ProviderAdapterShape<ProviderAdapterError>["respondToUserInput"] = (
    _t,
    _r,
    _a,
  ) => unsupported("respondToUserInput");

  const stopSession: ProviderAdapterShape<ProviderAdapterError>["stopSession"] = (_threadId) =>
    Effect.void;

  const listSessions: ProviderAdapterShape<ProviderAdapterError>["listSessions"] = () =>
    Effect.succeed([] as const);

  const hasSession: ProviderAdapterShape<ProviderAdapterError>["hasSession"] = (_threadId) =>
    Effect.succeed(false);

  const readThread: ProviderAdapterShape<ProviderAdapterError>["readThread"] = (threadId: ThreadId) =>
    Effect.fail(
      new ProviderAdapterRequestError({
        provider: DRIVER_KIND,
        method: "readThread",
        detail: `readThread is not supported by the Copilot provider (thread ${threadId}).`,
      }),
    );

  const rollbackThread: ProviderAdapterShape<ProviderAdapterError>["rollbackThread"] = (
    threadId: ThreadId,
    _n,
  ) =>
    Effect.fail(
      new ProviderAdapterRequestError({
        provider: DRIVER_KIND,
        method: "rollbackThread",
        detail: `rollbackThread is not supported by the Copilot provider (thread ${threadId}).`,
      }),
    );

  const stopAll: ProviderAdapterShape<ProviderAdapterError>["stopAll"] = () => Effect.void;

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
