export interface StateStorage<R = unknown> {
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => R;
  removeItem: (name: string) => R;
}
export interface DebouncedStorage<R = unknown> extends StateStorage<R> {
  flush: () => void;
}
export declare function createMemoryStorage(): StateStorage;
export declare function isStateStorage(
  storage: Partial<StateStorage> | null | undefined,
): storage is StateStorage;
export declare function resolveStorage(
  storage: Partial<StateStorage> | null | undefined,
): StateStorage;
export declare function createDebouncedStorage(
  baseStorage: Partial<StateStorage> | null | undefined,
  debounceMs?: number,
): DebouncedStorage;
