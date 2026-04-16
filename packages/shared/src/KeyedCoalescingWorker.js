import { Effect, TxQueue, TxRef } from "effect";
export const makeKeyedCoalescingWorker = (options) => Effect.gen(function* () {
    const queue = yield* Effect.acquireRelease(TxQueue.unbounded(), TxQueue.shutdown);
    const stateRef = yield* TxRef.make({
        latestByKey: new Map(),
        queuedKeys: new Set(),
        activeKeys: new Set(),
    });
    const processKey = (key, value) => options.process(key, value).pipe(Effect.flatMap(() => TxRef.modify(stateRef, (state) => {
        const nextValue = state.latestByKey.get(key);
        if (nextValue === undefined) {
            const activeKeys = new Set(state.activeKeys);
            activeKeys.delete(key);
            return [null, { ...state, activeKeys }];
        }
        const latestByKey = new Map(state.latestByKey);
        latestByKey.delete(key);
        return [nextValue, { ...state, latestByKey }];
    }).pipe(Effect.tx)), Effect.flatMap((nextValue) => nextValue === null ? Effect.void : processKey(key, nextValue)));
    const cleanupFailedKey = (key) => TxRef.modify(stateRef, (state) => {
        const activeKeys = new Set(state.activeKeys);
        activeKeys.delete(key);
        if (state.latestByKey.has(key) && !state.queuedKeys.has(key)) {
            const queuedKeys = new Set(state.queuedKeys);
            queuedKeys.add(key);
            return [true, { ...state, activeKeys, queuedKeys }];
        }
        return [false, { ...state, activeKeys }];
    }).pipe(Effect.tx, Effect.flatMap((shouldRequeue) => shouldRequeue ? TxQueue.offer(queue, key) : Effect.void));
    yield* TxQueue.take(queue).pipe(Effect.flatMap((key) => TxRef.modify(stateRef, (state) => {
        const queuedKeys = new Set(state.queuedKeys);
        queuedKeys.delete(key);
        const value = state.latestByKey.get(key);
        if (value === undefined) {
            return [null, { ...state, queuedKeys }];
        }
        const latestByKey = new Map(state.latestByKey);
        latestByKey.delete(key);
        const activeKeys = new Set(state.activeKeys);
        activeKeys.add(key);
        return [
            { key, value },
            { ...state, latestByKey, queuedKeys, activeKeys },
        ];
    }).pipe(Effect.tx)), Effect.flatMap((item) => item === null
        ? Effect.void
        : processKey(item.key, item.value).pipe(Effect.catchCause(() => cleanupFailedKey(item.key)))), Effect.forever, Effect.forkScoped);
    const enqueue = (key, value) => TxRef.modify(stateRef, (state) => {
        const latestByKey = new Map(state.latestByKey);
        const existing = latestByKey.get(key);
        latestByKey.set(key, existing === undefined ? value : options.merge(existing, value));
        if (state.queuedKeys.has(key) || state.activeKeys.has(key)) {
            return [false, { ...state, latestByKey }];
        }
        const queuedKeys = new Set(state.queuedKeys);
        queuedKeys.add(key);
        return [true, { ...state, latestByKey, queuedKeys }];
    }).pipe(Effect.flatMap((shouldOffer) => (shouldOffer ? TxQueue.offer(queue, key) : Effect.void)), Effect.tx, Effect.asVoid);
    const drainKey = (key) => TxRef.get(stateRef).pipe(Effect.tap((state) => state.latestByKey.has(key) || state.queuedKeys.has(key) || state.activeKeys.has(key)
        ? Effect.txRetry
        : Effect.void), Effect.asVoid, Effect.tx);
    return { enqueue, drainKey };
});
