import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { Deferred, Effect } from "effect";
import { makeKeyedCoalescingWorker } from "./KeyedCoalescingWorker";
describe("makeKeyedCoalescingWorker", () => {
    it.live("waits for latest work enqueued during active processing before draining the key", () => Effect.scoped(Effect.gen(function* () {
        const processed = [];
        const firstStarted = yield* Deferred.make();
        const releaseFirst = yield* Deferred.make();
        const secondStarted = yield* Deferred.make();
        const releaseSecond = yield* Deferred.make();
        const worker = yield* makeKeyedCoalescingWorker({
            merge: (_current, next) => next,
            process: (key, value) => Effect.gen(function* () {
                processed.push(`${key}:${value}`);
                if (value === "first") {
                    yield* Deferred.succeed(firstStarted, undefined).pipe(Effect.orDie);
                    yield* Deferred.await(releaseFirst);
                }
                if (value === "second") {
                    yield* Deferred.succeed(secondStarted, undefined).pipe(Effect.orDie);
                    yield* Deferred.await(releaseSecond);
                }
            }),
        });
        yield* worker.enqueue("terminal-1", "first");
        yield* Deferred.await(firstStarted);
        const drained = yield* Deferred.make();
        yield* Effect.forkChild(worker
            .drainKey("terminal-1")
            .pipe(Effect.tap(() => Deferred.succeed(drained, undefined).pipe(Effect.orDie))));
        yield* worker.enqueue("terminal-1", "second");
        yield* Deferred.succeed(releaseFirst, undefined);
        yield* Deferred.await(secondStarted);
        expect(yield* Deferred.isDone(drained)).toBe(false);
        yield* Deferred.succeed(releaseSecond, undefined);
        yield* Deferred.await(drained);
        expect(processed).toEqual(["terminal-1:first", "terminal-1:second"]);
    })));
    it.live("requeues pending work for a key after a processor failure and keeps draining", () => Effect.scoped(Effect.gen(function* () {
        const processed = [];
        const firstStarted = yield* Deferred.make();
        const releaseFailure = yield* Deferred.make();
        const secondProcessed = yield* Deferred.make();
        const worker = yield* makeKeyedCoalescingWorker({
            merge: (_current, next) => next,
            process: (key, value) => Effect.gen(function* () {
                processed.push(`${key}:${value}`);
                if (value === "first") {
                    yield* Deferred.succeed(firstStarted, undefined).pipe(Effect.orDie);
                    yield* Deferred.await(releaseFailure);
                    yield* Effect.fail("boom");
                }
                if (value === "second") {
                    yield* Deferred.succeed(secondProcessed, undefined).pipe(Effect.orDie);
                }
            }),
        });
        yield* worker.enqueue("terminal-1", "first");
        yield* Deferred.await(firstStarted);
        yield* worker.enqueue("terminal-1", "second");
        yield* Deferred.succeed(releaseFailure, undefined);
        yield* Deferred.await(secondProcessed);
        yield* worker.drainKey("terminal-1");
        expect(processed).toEqual(["terminal-1:first", "terminal-1:second"]);
    })));
});
