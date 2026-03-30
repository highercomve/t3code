import { it } from "@effect/vitest";
import { describe, expect } from "vitest";
import { Deferred, Effect } from "effect";
import { makeDrainableWorker } from "./DrainableWorker";
describe("makeDrainableWorker", () => {
    it.live("waits for work enqueued during active processing before draining", () => Effect.scoped(Effect.gen(function* () {
        const processed = [];
        const firstStarted = yield* Deferred.make();
        const releaseFirst = yield* Deferred.make();
        const secondStarted = yield* Deferred.make();
        const releaseSecond = yield* Deferred.make();
        const worker = yield* makeDrainableWorker((item) => Effect.gen(function* () {
            if (item === "first") {
                yield* Deferred.succeed(firstStarted, undefined).pipe(Effect.orDie);
                yield* Deferred.await(releaseFirst);
            }
            if (item === "second") {
                yield* Deferred.succeed(secondStarted, undefined).pipe(Effect.orDie);
                yield* Deferred.await(releaseSecond);
            }
            processed.push(item);
        }));
        yield* worker.enqueue("first");
        yield* Deferred.await(firstStarted);
        const drained = yield* Deferred.make();
        yield* Effect.forkChild(worker.drain.pipe(Effect.tap(() => Deferred.succeed(drained, undefined).pipe(Effect.orDie))));
        yield* worker.enqueue("second");
        yield* Deferred.succeed(releaseFirst, undefined);
        yield* Deferred.await(secondStarted);
        expect(yield* Deferred.isDone(drained)).toBe(false);
        yield* Deferred.succeed(releaseSecond, undefined);
        yield* Deferred.await(drained);
        expect(processed).toEqual(["first", "second"]);
    })));
});
