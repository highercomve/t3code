import * as P from "effect/Predicate";
export function deepMerge(current, patch) {
  if (!P.isObject(current) || !P.isObject(patch)) {
    return patch;
  }
  const next = { ...current };
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    const existing = next[key];
    next[key] = P.isObject(existing) && P.isObject(value) ? deepMerge(existing, value) : value;
  }
  return next;
}
