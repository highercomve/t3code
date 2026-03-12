import * as NFS from "node:fs";
import * as Net from "node:net";
import * as readline from "node:readline";
import type { Readable } from "node:stream";

import { Data, Effect, Option, Predicate, Result, Schema } from "effect";
import { decodeJsonResult } from "@t3tools/shared/schemaJson";

class BootstrapError extends Data.TaggedError("BootstrapError")<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

export const readBootstrapEnvelope = Effect.fn("readBootstrapEnvelope")(function* <A, I>(
  schema: Schema.Codec<A, I>,
  fd: number,
  options?: {
    timeoutMs?: number;
  },
): Effect.fn.Return<Option.Option<A>, BootstrapError> {
  const fdStats = yield* getBootstrapFdStats(fd);
  if (Option.isNone(fdStats)) return Option.none();

  const stream = yield* makeBootstrapInputStream(fd, fdStats.value);

  const timeoutMs = options?.timeoutMs ?? 1000;

  return yield* Effect.callback<Option.Option<A>, BootstrapError>((resume) => {
    const input = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    const cleanup = () => {
      stream.removeListener("error", handleError);
      input.removeListener("line", handleLine);
      input.removeListener("close", handleClose);
      input.close();
      stream.destroy();
    };

    const handleError = (error: Error) => {
      if (isUnavailableBootstrapFdError(error)) {
        resume(Effect.succeedNone);
        return;
      }
      resume(
        Effect.fail(
          new BootstrapError({
            message: "Failed to read bootstrap envelope.",
            cause: error,
          }),
        ),
      );
    };

    const handleLine = (line: string) => {
      const parsed = decodeJsonResult(schema)(line);
      if (Result.isSuccess(parsed)) {
        resume(Effect.succeedSome(parsed.success));
      } else {
        resume(
          Effect.fail(
            new BootstrapError({
              message: "Failed to decode bootstrap envelope.",
              cause: parsed.failure,
            }),
          ),
        );
      }
    };

    const handleClose = () => {
      resume(Effect.succeedNone);
    };

    stream.once("error", handleError);
    input.once("line", handleLine);
    input.once("close", handleClose);

    return Effect.sync(cleanup);
  }).pipe(Effect.timeoutOption(timeoutMs), Effect.map(Option.flatten));
});

const isUnavailableBootstrapFdError = Predicate.compose(
  Predicate.hasProperty("code"),
  (_) => _.code === "EBADF" || _.code === "ENOENT",
);

const getBootstrapFdStats = (fd: number) =>
  Effect.try({
    try: () => NFS.fstatSync(fd),
    catch: (error) =>
      new BootstrapError({
        message: "Failed to stat bootstrap fd.",
        cause: error,
      }),
  }).pipe(
    Effect.map(Option.some),
    Effect.catchIf(
      (error) => isUnavailableBootstrapFdError(error.cause),
      () => Effect.succeed(Option.none()),
    ),
  );

const makeBootstrapInputStream = (fd: number, fdStats: NFS.Stats) =>
  Effect.try<Readable, BootstrapError>({
    try: () => {
      const fdPath = resolveFdPath(fd);
      if (fdPath !== undefined && fdStats.isFile()) {
        const streamFd = NFS.openSync(fdPath, "r");
        return NFS.createReadStream("", {
          fd: streamFd,
          encoding: "utf8",
          autoClose: true,
        });
      }

      if (fdStats.isFIFO() || fdStats.isSocket()) {
        const stream = new Net.Socket({
          fd,
          readable: true,
          writable: false,
        });
        stream.setEncoding("utf8");
        return stream;
      }

      return NFS.createReadStream("", {
        fd,
        encoding: "utf8",
        autoClose: false,
      });
    },
    catch: (error) =>
      new BootstrapError({
        message: "Failed to duplicate bootstrap fd.",
        cause: error,
      }),
  });

export function resolveFdPath(
  fd: number,
  platform: NodeJS.Platform = process.platform,
): string | undefined {
  if (platform === "linux") {
    return `/proc/self/fd/${fd}`;
  }
  if (platform === "win32") {
    return undefined;
  }
  return `/dev/fd/${fd}`;
}
