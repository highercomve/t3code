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
export function isStateStorage(storage) {
  return (
    storage !== null &&
    storage !== undefined &&
    typeof storage.getItem === "function" &&
    typeof storage.setItem === "function" &&
    typeof storage.removeItem === "function"
  );
}
export function resolveStorage(storage) {
  return isStateStorage(storage) ? storage : createMemoryStorage();
}
export function createDebouncedStorage(baseStorage, debounceMs = 300) {
  const resolvedStorage = resolveStorage(baseStorage);
  const debouncedSetItem = new Debouncer(
    (name, value) => {
      resolvedStorage.setItem(name, value);
    },
    { wait: debounceMs },
  );
  return {
    getItem: (name) => resolvedStorage.getItem(name),
    setItem: (name, value) => {
      debouncedSetItem.maybeExecute(name, value);
    },
    removeItem: (name) => {
      debouncedSetItem.cancel();
      resolvedStorage.removeItem(name);
    },
    flush: () => {
      debouncedSetItem.flush();
    },
  };
}
