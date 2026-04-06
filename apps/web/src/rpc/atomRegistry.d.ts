import { AtomRegistry } from "effect/unstable/reactivity";
import type { ReactNode } from "react";
export declare let appAtomRegistry: AtomRegistry.AtomRegistry;
export declare function AppAtomRegistryProvider({
  children,
}: {
  readonly children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function resetAppAtomRegistryForTests(): void;
