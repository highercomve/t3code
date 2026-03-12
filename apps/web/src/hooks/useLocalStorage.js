import * as Schema from "effect/Schema";
import * as Record from "effect/Record";
import { useCallback, useEffect, useRef, useState } from "react";
const isomorphicLocalStorage =
  typeof window !== "undefined"
    ? window.localStorage
    : (function () {
        const store = new Map();
        return {
          clear: () => store.clear(),
          getItem: (_) => store.get(_) ?? null,
          key: (_) => Record.keys(store).at(_) ?? null,
          get length() {
            return store.size;
          },
          removeItem: (_) => store.delete(_),
          setItem: (_, value) => store.set(_, value),
        };
      })();
const decode = (schema, value) => Schema.decodeSync(Schema.fromJsonString(schema))(value);
const encode = (schema, value) => Schema.encodeSync(Schema.fromJsonString(schema))(value);
export const getLocalStorageItem = (key, schema) => {
  const item = isomorphicLocalStorage.getItem(key);
  return item ? decode(schema, item) : null;
};
export const setLocalStorageItem = (key, value, schema) => {
  const valueToSet = encode(schema, value);
  isomorphicLocalStorage.setItem(key, valueToSet);
};
export const removeLocalStorageItem = (key) => {
  isomorphicLocalStorage.removeItem(key);
};
const LOCAL_STORAGE_CHANGE_EVENT = "t3code:local_storage_change";
function dispatchLocalStorageChange(key) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT, {
      detail: { key },
    }),
  );
}
export function useLocalStorage(key, initialValue, schema) {
  // Get the initial value from localStorage or use the provided initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = getLocalStorageItem(key, schema);
      return item ?? initialValue;
    } catch (error) {
      console.error("[LOCALSTORAGE] Error:", error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = typeof value === "function" ? value(prev) : value;
          if (valueToStore === null) {
            removeLocalStorageItem(key);
          } else {
            setLocalStorageItem(key, valueToStore, schema);
          }
          // Dispatch event after state update completes to avoid nested state updates
          queueMicrotask(() => dispatchLocalStorageChange(key));
          return valueToStore;
        });
      } catch (error) {
        console.error("[LOCALSTORAGE] Error:", error);
      }
    },
    [key, schema],
  );
  const prevKeyRef = useRef(key);
  // Re-sync from localStorage when key changes
  useEffect(() => {
    if (prevKeyRef.current !== key) {
      prevKeyRef.current = key;
      try {
        const newValue = getLocalStorageItem(key, schema);
        setStoredValue(newValue ?? initialValue);
      } catch (error) {
        console.error("[LOCALSTORAGE] Error:", error);
      }
    }
  }, [key, initialValue, schema]);
  // Listen for storage events from other tabs AND custom events from the same tab
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const newValue = getLocalStorageItem(key, schema);
        setStoredValue(newValue ?? initialValue);
      } catch (error) {
        console.error("[LOCALSTORAGE] Error:", error);
      }
    };
    const handleStorageChange = (event) => {
      if (event.key === key) {
        syncFromStorage();
      }
    };
    const handleLocalChange = (event) => {
      if (event.detail.key === key) {
        syncFromStorage();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleLocalChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleLocalChange);
    };
  }, [key, initialValue, schema]);
  return [storedValue, setValue];
}
