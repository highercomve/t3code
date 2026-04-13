import { Cause, Duration, Effect, Exit, Layer, ManagedRuntime, Scope, Stream } from "effect";
import { ClientTracingLive } from "../observability/clientTracing";
import { clearAllTrackedRpcRequests } from "./requestLatencyState";
import { createWsRpcProtocolLayer, makeWsRpcProtocolClient } from "./protocol";
import { isTransportConnectionErrorMessage } from "./transportError";
const DEFAULT_SUBSCRIPTION_RETRY_DELAY_MS = Duration.millis(250);
const NOOP = () => undefined;
function formatErrorMessage(error) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return String(error);
}
export class WsTransport {
  url;
  lifecycleHandlers;
  disposed = false;
  hasReportedTransportDisconnect = false;
  reconnectChain = Promise.resolve();
  session;
  constructor(url, lifecycleHandlers) {
    this.url = url;
    this.lifecycleHandlers = lifecycleHandlers;
    this.session = this.createSession();
  }
  async request(execute, _options) {
    if (this.disposed) {
      throw new Error("Transport disposed");
    }
    const session = this.session;
    const client = await session.clientPromise;
    return await session.runtime.runPromise(Effect.suspend(() => execute(client)));
  }
  async requestStream(connect, listener) {
    if (this.disposed) {
      throw new Error("Transport disposed");
    }
    const session = this.session;
    const client = await session.clientPromise;
    await session.runtime.runPromise(
      Stream.runForEach(connect(client), (value) =>
        Effect.sync(() => {
          try {
            listener(value);
          } catch {
            // Swallow listener errors so the stream can finish cleanly.
          }
        }),
      ),
    );
  }
  subscribe(connect, listener, options) {
    if (this.disposed) {
      return () => undefined;
    }
    let active = true;
    let hasReceivedValue = false;
    const retryDelayMs = Duration.toMillis(
      Duration.fromInputUnsafe(options?.retryDelay ?? DEFAULT_SUBSCRIPTION_RETRY_DELAY_MS),
    );
    let cancelCurrentStream = NOOP;
    void (async () => {
      for (;;) {
        if (!active || this.disposed) {
          return;
        }
        const session = this.session;
        try {
          if (hasReceivedValue) {
            try {
              options?.onResubscribe?.();
            } catch {
              // Swallow reconnect hook errors so the stream can recover.
            }
          }
          const runningStream = this.runStreamOnSession(
            session,
            connect,
            listener,
            () => active,
            () => {
              this.hasReportedTransportDisconnect = false;
              hasReceivedValue = true;
            },
          );
          cancelCurrentStream = runningStream.cancel;
          await runningStream.completed;
          cancelCurrentStream = NOOP;
        } catch (error) {
          cancelCurrentStream = NOOP;
          if (!active || this.disposed) {
            return;
          }
          if (session !== this.session) {
            continue;
          }
          const formattedError = formatErrorMessage(error);
          if (!isTransportConnectionErrorMessage(formattedError)) {
            console.warn("WebSocket RPC subscription failed", {
              error: formattedError,
            });
            return;
          }
          if (!this.hasReportedTransportDisconnect) {
            console.warn("WebSocket RPC subscription disconnected", {
              error: formattedError,
            });
          }
          this.hasReportedTransportDisconnect = true;
          await sleep(retryDelayMs);
        }
      }
    })();
    return () => {
      active = false;
      cancelCurrentStream();
    };
  }
  async reconnect() {
    if (this.disposed) {
      throw new Error("Transport disposed");
    }
    const reconnectOperation = this.reconnectChain.then(async () => {
      if (this.disposed) {
        throw new Error("Transport disposed");
      }
      clearAllTrackedRpcRequests();
      const previousSession = this.session;
      this.session = this.createSession();
      await this.closeSession(previousSession);
    });
    this.reconnectChain = reconnectOperation.catch(() => undefined);
    await reconnectOperation;
  }
  async dispose() {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    await this.closeSession(this.session);
  }
  closeSession(session) {
    return session.runtime.runPromise(Scope.close(session.clientScope, Exit.void)).finally(() => {
      session.runtime.dispose();
    });
  }
  createSession() {
    const runtime = ManagedRuntime.make(
      Layer.mergeAll(createWsRpcProtocolLayer(this.url, this.lifecycleHandlers), ClientTracingLive),
    );
    const clientScope = runtime.runSync(Scope.make());
    return {
      runtime,
      clientScope,
      clientPromise: runtime.runPromise(Scope.provide(clientScope)(makeWsRpcProtocolClient)),
    };
  }
  runStreamOnSession(session, connect, listener, isActive, markValueReceived) {
    let resolveCompleted;
    let rejectCompleted;
    const completed = new Promise((resolve, reject) => {
      resolveCompleted = resolve;
      rejectCompleted = reject;
    });
    const cancel = session.runtime.runCallback(
      Effect.promise(() => session.clientPromise).pipe(
        Effect.flatMap((client) =>
          Stream.runForEach(connect(client), (value) =>
            Effect.sync(() => {
              if (!isActive()) {
                return;
              }
              markValueReceived();
              try {
                listener(value);
              } catch {
                // Swallow listener errors so the stream stays live.
              }
            }),
          ),
        ),
      ),
      {
        onExit: (exit) => {
          if (Exit.isSuccess(exit)) {
            resolveCompleted();
            return;
          }
          rejectCompleted(Cause.squash(exit.cause));
        },
      },
    );
    return {
      cancel,
      completed,
    };
  }
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
