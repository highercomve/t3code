/**
 * DrainableWorker - A queue-based worker with deterministic `drain()`.
 *
 * Tracks outstanding work in STM so `drain()` resolves only when no items
 * are queued or in flight. Useful in tests instead of timing-based waits.
 *
 * @module DrainableWorker
 */
import { Effect, TxQueue, TxRef } from "effect";
/**
 * Create a drainable worker that processes items from an unbounded queue.
 *
 * The worker is forked into the current scope and will be interrupted when
 * the scope closes. A finalizer shuts down the queue.
 *
 * @param process - The effect to run for each queued item.
 * @returns A `DrainableWorker` with `queue` and `drain`.
 */
export const makeDrainableWorker = (process) =>
  Effect.gen(function* () {
    const ref = yield* TxRef.make(0);
    const queue = yield* Effect.acquireRelease(TxQueue.unbounded(), (queue) =>
      TxQueue.shutdown(queue),
    );
    const takeItem = Effect.tx(
      Effect.gen(function* () {
        const item = yield* TxQueue.take(queue);
        yield* TxRef.update(ref, (n) => n + 1);
        return item;
      }),
    );
    yield* takeItem.pipe(
      Effect.flatMap((item) =>
        process(item).pipe(Effect.ensuring(TxRef.update(ref, (n) => n - 1))),
      ),
      Effect.forever,
      Effect.forkScoped,
    );
    const drain = Effect.tx(
      Effect.gen(function* () {
        const inFlight = yield* TxRef.get(ref);
        const isEmpty = yield* TxQueue.isEmpty(queue);
        if (inFlight > 0 || !isEmpty) {
          return yield* Effect.txRetry;
        }
      }),
    );
    return {
      enqueue: (item) => TxQueue.offer(queue, item),
      drain,
    };
  });
