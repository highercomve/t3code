/**
 * Single Zustand store for terminal UI state keyed by threadId.
 *
 * Terminal transition helpers are intentionally private to keep the public
 * API constrained to store actions/selectors.
 */
import { ThreadId, type TerminalEvent } from "@t3tools/contracts";
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
export declare function selectThreadTerminalState(
  terminalStateByThreadId: Record<ThreadId, ThreadTerminalState>,
  threadId: ThreadId,
): ThreadTerminalState;
export declare function selectTerminalEventEntries(
  terminalEventEntriesByKey: Record<string, ReadonlyArray<TerminalEventEntry>>,
  threadId: ThreadId,
  terminalId: string,
): ReadonlyArray<TerminalEventEntry>;
interface TerminalStateStoreState {
  terminalStateByThreadId: Record<ThreadId, ThreadTerminalState>;
  terminalLaunchContextByThreadId: Record<ThreadId, ThreadTerminalLaunchContext>;
  terminalEventEntriesByKey: Record<string, ReadonlyArray<TerminalEventEntry>>;
  nextTerminalEventId: number;
  setTerminalOpen: (threadId: ThreadId, open: boolean) => void;
  setTerminalHeight: (threadId: ThreadId, height: number) => void;
  splitTerminal: (threadId: ThreadId, terminalId: string) => void;
  newTerminal: (threadId: ThreadId, terminalId: string) => void;
  ensureTerminal: (
    threadId: ThreadId,
    terminalId: string,
    options?: {
      open?: boolean;
      active?: boolean;
    },
  ) => void;
  setActiveTerminal: (threadId: ThreadId, terminalId: string) => void;
  closeTerminal: (threadId: ThreadId, terminalId: string) => void;
  setTerminalLaunchContext: (threadId: ThreadId, context: ThreadTerminalLaunchContext) => void;
  clearTerminalLaunchContext: (threadId: ThreadId) => void;
  setTerminalActivity: (
    threadId: ThreadId,
    terminalId: string,
    hasRunningSubprocess: boolean,
  ) => void;
  recordTerminalEvent: (event: TerminalEvent) => void;
  applyTerminalEvent: (event: TerminalEvent) => void;
  clearTerminalState: (threadId: ThreadId) => void;
  removeTerminalState: (threadId: ThreadId) => void;
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
