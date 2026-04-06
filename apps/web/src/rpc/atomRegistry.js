import { jsx as _jsx } from "react/jsx-runtime";
import { RegistryContext } from "@effect/atom-react";
import { AtomRegistry } from "effect/unstable/reactivity";
export let appAtomRegistry = AtomRegistry.make();
export function AppAtomRegistryProvider({ children }) {
  return _jsx(RegistryContext.Provider, { value: appAtomRegistry, children: children });
}
export function resetAppAtomRegistryForTests() {
  appAtomRegistry.dispose();
  appAtomRegistry = AtomRegistry.make();
}
