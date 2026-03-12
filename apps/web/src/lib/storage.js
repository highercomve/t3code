import { Debouncer } from "@tanstack/react-pacer";
export function createMemoryStorage() {
  const store = new Map();
  return {
    getItem: (name) => store.get(name) ?? null,
    setItem: (name, value) => {
      store.set(name, value);
    },
    removeItem: (name) => {
      store.delete(name);
    },
  };
}
export function createDebouncedStorage(baseStorage, debounceMs = 300) {
  const debouncedSetItem = new Debouncer(
    (name, value) => {
      baseStorage.setItem(name, value);
    },
    { wait: debounceMs },
  );
  return {
    getItem: (name) => baseStorage.getItem(name),
    setItem: (name, value) => {
      debouncedSetItem.maybeExecute(name, value);
    },
    removeItem: (name) => {
      debouncedSetItem.cancel();
      baseStorage.removeItem(name);
    },
    flush: () => {
      debouncedSetItem.flush();
    },
  };
}
