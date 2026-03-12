/**
 * Single Zustand store for terminal UI state keyed by threadId.
 *
 * Terminal transition helpers are intentionally private to keep the public
 * API constrained to store actions/selectors.
 */
import type { ThreadId } from "@t3tools/contracts";
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
export declare function selectThreadTerminalState(
  terminalStateByThreadId: Record<ThreadId, ThreadTerminalState>,
  threadId: ThreadId,
): ThreadTerminalState;
interface TerminalStateStoreState {
  terminalStateByThreadId: Record<ThreadId, ThreadTerminalState>;
  setTerminalOpen: (threadId: ThreadId, open: boolean) => void;
  setTerminalHeight: (threadId: ThreadId, height: number) => void;
  splitTerminal: (threadId: ThreadId, terminalId: string) => void;
  newTerminal: (threadId: ThreadId, terminalId: string) => void;
  setActiveTerminal: (threadId: ThreadId, terminalId: string) => void;
  closeTerminal: (threadId: ThreadId, terminalId: string) => void;
  setTerminalActivity: (
    threadId: ThreadId,
    terminalId: string,
    hasRunningSubprocess: boolean,
  ) => void;
  clearTerminalState: (threadId: ThreadId) => void;
  removeOrphanedTerminalStates: (activeThreadIds: Set<ThreadId>) => void;
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
