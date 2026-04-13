/**
 * Single Zustand store for terminal UI state keyed by scoped thread identity.
 *
 * Terminal transition helpers are intentionally private to keep the public
 * API constrained to store actions/selectors.
 */
import { type ScopedThreadRef, type TerminalEvent } from "@t3tools/contracts";
import { type ThreadTerminalGroup } from "./types";
interface ThreadTerminalState {
  terminalOpen: boolean;
  terminalHeight: number;
  terminalIds: string[];
  runningTerminalIds: string[];
  activeTerminalId: string;
  terminalGroups: ThreadTerminalGroup[];
  activeTerminalGroupId: string;
}
export interface ThreadTerminalLaunchContext {
  cwd: string;
  worktreePath: string | null;
}
export interface TerminalEventEntry {
  id: number;
  event: TerminalEvent;
}
interface PersistedTerminalStateStoreState {
  terminalStateByThreadKey?: Record<string, ThreadTerminalState>;
}
export declare function migratePersistedTerminalStateStoreState(
  persistedState: unknown,
  version: number,
): PersistedTerminalStateStoreState;
export declare function selectThreadTerminalState(
  terminalStateByThreadKey: Record<string, ThreadTerminalState>,
  threadRef: ScopedThreadRef | null | undefined,
): ThreadTerminalState;
export declare function selectTerminalEventEntries(
  terminalEventEntriesByKey: Record<string, ReadonlyArray<TerminalEventEntry>>,
  threadRef: ScopedThreadRef | null | undefined,
  terminalId: string,
): ReadonlyArray<TerminalEventEntry>;
interface TerminalStateStoreState {
  terminalStateByThreadKey: Record<string, ThreadTerminalState>;
  terminalLaunchContextByThreadKey: Record<string, ThreadTerminalLaunchContext>;
  terminalEventEntriesByKey: Record<string, ReadonlyArray<TerminalEventEntry>>;
  nextTerminalEventId: number;
  setTerminalOpen: (threadRef: ScopedThreadRef, open: boolean) => void;
  setTerminalHeight: (threadRef: ScopedThreadRef, height: number) => void;
  splitTerminal: (threadRef: ScopedThreadRef, terminalId: string) => void;
  newTerminal: (threadRef: ScopedThreadRef, terminalId: string) => void;
  ensureTerminal: (
    threadRef: ScopedThreadRef,
    terminalId: string,
    options?: {
      open?: boolean;
      active?: boolean;
    },
  ) => void;
  setActiveTerminal: (threadRef: ScopedThreadRef, terminalId: string) => void;
  closeTerminal: (threadRef: ScopedThreadRef, terminalId: string) => void;
  setTerminalLaunchContext: (
    threadRef: ScopedThreadRef,
    context: ThreadTerminalLaunchContext,
  ) => void;
  clearTerminalLaunchContext: (threadRef: ScopedThreadRef) => void;
  setTerminalActivity: (
    threadRef: ScopedThreadRef,
    terminalId: string,
    hasRunningSubprocess: boolean,
  ) => void;
  recordTerminalEvent: (threadRef: ScopedThreadRef, event: TerminalEvent) => void;
  applyTerminalEvent: (threadRef: ScopedThreadRef, event: TerminalEvent) => void;
  clearTerminalState: (threadRef: ScopedThreadRef) => void;
  removeTerminalState: (threadRef: ScopedThreadRef) => void;
  removeOrphanedTerminalStates: (activeThreadKeys: Set<string>) => void;
}
export declare const useTerminalStateStore: import("zustand").UseBoundStore<
  Omit<import("zustand").StoreApi<TerminalStateStoreState>, "setState" | "persist"> & {
    setState(
      partial:
        | TerminalStateStoreState
        | Partial<TerminalStateStoreState>
        | ((
            state: TerminalStateStoreState,
          ) => TerminalStateStoreState | Partial<TerminalStateStoreState>),
      replace?: false | undefined,
    ): unknown;
    setState(
      state:
        | TerminalStateStoreState
        | ((state: TerminalStateStoreState) => TerminalStateStoreState),
      replace: true,
    ): unknown;
    persist: {
      setOptions: (
        options: Partial<
          import("zustand/middleware").PersistOptions<TerminalStateStoreState, unknown, unknown>
        >,
      ) => void;
      clearStorage: () => void;
      rehydrate: () => Promise<void> | void;
      hasHydrated: () => boolean;
      onHydrate: (fn: (state: TerminalStateStoreState) => void) => () => void;
      onFinishHydration: (fn: (state: TerminalStateStoreState) => void) => () => void;
      getOptions: () => Partial<
        import("zustand/middleware").PersistOptions<TerminalStateStoreState, unknown, unknown>
      >;
    };
  }
>;
export {};
