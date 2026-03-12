import * as Schema from "effect/Schema";
export declare const getLocalStorageItem: <T, E>(
  key: string,
  schema: Schema.Codec<T, E>,
) => T | null;
export declare const setLocalStorageItem: <T, E>(
  key: string,
  value: T,
  schema: Schema.Codec<T, E>,
) => void;
export declare const removeLocalStorageItem: (key: string) => void;
export declare function useLocalStorage<T, E>(
  key: string,
  initialValue: T,
  schema: Schema.Codec<T, E>,
): [T, (value: T | ((val: T) => T)) => void];
