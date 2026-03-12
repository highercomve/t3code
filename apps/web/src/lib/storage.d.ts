export interface StateStorage<R = unknown> {
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => R;
  removeItem: (name: string) => R;
}
export interface DebouncedStorage<R = unknown> extends StateStorage<R> {
  flush: () => void;
}
export declare function createMemoryStorage(): StateStorage;
export declare function createDebouncedStorage(
  baseStorage: StateStorage,
  debounceMs?: number,
): DebouncedStorage;
