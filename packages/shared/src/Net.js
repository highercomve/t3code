import * as Net from "node:net";
import { Data, Effect, Layer, Context } from "effect";
export class NetError extends Data.TaggedError("NetError") {}
function isErrnoExceptionWithCode(cause) {
  return (
    typeof cause === "object" && cause !== null && "code" in cause && typeof cause.code === "string"
  );
}
const closeServer = (server) => {
  try {
    server.close();
  } catch {
    // Ignore close failures during cleanup.
  }
};
const tryReservePort = (port) =>
  Effect.callback((resume) => {
    const server = Net.createServer();
    let settled = false;
    const settle = (effect) => {
      if (settled) return;
      settled = true;
      resume(effect);
    };
    server.unref();
    server.once("error", (cause) => {
      settle(Effect.fail(new NetError({ message: "Could not find an available port.", cause })));
    });
    server.listen(port, () => {
      const address = server.address();
      const resolved = typeof address === "object" && address !== null ? address.port : 0;
      server.close(() => {
        if (resolved > 0) {
          settle(Effect.succeed(resolved));
          return;
        }
        settle(Effect.fail(new NetError({ message: "Could not find an available port." })));
      });
    });
    return Effect.sync(() => {
      closeServer(server);
    });
  });
/**
 * NetService - Service tag for startup networking helpers.
 */
export class NetService extends Context.Service()("@t3tools/shared/Net/NetService") {
  static layer = Layer.sync(NetService, () => {
    /**
     * Returns true when a TCP server can bind to {host, port}.
     * `EADDRNOTAVAIL` is treated as available so IPv6-absent hosts don't fail
     * loopback availability checks.
     */
    const canListenOnHost = (port, host) =>
      Effect.callback((resume) => {
        const server = Net.createServer();
        let settled = false;
        const settle = (value) => {
          if (settled) return;
          settled = true;
          resume(Effect.succeed(value));
        };
        server.unref();
        server.once("error", (cause) => {
          if (isErrnoExceptionWithCode(cause) && cause.code === "EADDRNOTAVAIL") {
            settle(true);
            return;
          }
          settle(false);
        });
        server.once("listening", () => {
          server.close(() => {
            settle(true);
          });
        });
        server.listen({ host, port });
        return Effect.sync(() => {
          closeServer(server);
        });
      });
    /**
     * Reserve an ephemeral loopback port and release it immediately.
     * Returns the reserved port number.
     */
    const reserveLoopbackPort = (host = "127.0.0.1") =>
      Effect.callback((resume) => {
        const probe = Net.createServer();
        let settled = false;
        const settle = (effect) => {
          if (settled) return;
          settled = true;
          resume(effect);
        };
        probe.once("error", (cause) => {
          settle(Effect.fail(new NetError({ message: "Failed to reserve loopback port", cause })));
        });
        probe.listen(0, host, () => {
          const address = probe.address();
          const port = typeof address === "object" && address !== null ? address.port : 0;
          probe.close(() => {
            if (port > 0) {
              settle(Effect.succeed(port));
              return;
            }
            settle(Effect.fail(new NetError({ message: "Failed to reserve loopback port" })));
          });
        });
        return Effect.sync(() => {
          closeServer(probe);
        });
      });
    return {
      canListenOnHost,
      isPortAvailableOnLoopback: (port) =>
        Effect.zipWith(
          canListenOnHost(port, "127.0.0.1"),
          canListenOnHost(port, "::1"),
          (ipv4, ipv6) => ipv4 && ipv6,
        ),
      reserveLoopbackPort,
      findAvailablePort: (preferred) =>
        Effect.catch(tryReservePort(preferred), () => tryReservePort(0)),
    };
  });
}
