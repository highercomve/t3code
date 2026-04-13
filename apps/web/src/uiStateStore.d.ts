export interface UiProjectState {
  projectExpandedById: Record<string, boolean>;
  projectOrder: string[];
}
export interface UiThreadState {
  threadLastVisitedAtById: Record<string, string>;
  threadChangedFilesExpandedById: Record<string, Record<string, boolean>>;
}
export interface UiState extends UiProjectState, UiThreadState {}
export interface SyncProjectInput {
  key: string;
  cwd: string;
}
export interface SyncThreadInput {
  key: string;
  seedVisitedAt?: string | undefined;
}
export declare function syncProjects(
  state: UiState,
  projects: readonly SyncProjectInput[],
): UiState;
export declare function syncThreads(state: UiState, threads: readonly SyncThreadInput[]): UiState;
export declare function markThreadVisited(
  state: UiState,
  threadId: string,
  visitedAt?: string,
): UiState;
export declare function markThreadUnread(
  state: UiState,
  threadId: string,
  latestTurnCompletedAt: string | null | undefined,
): UiState;
export declare function clearThreadUi(state: UiState, threadId: string): UiState;
export declare function setThreadChangedFilesExpanded(
  state: UiState,
  threadId: string,
  turnId: string,
  expanded: boolean,
): UiState;
export declare function toggleProject(state: UiState, projectId: string): UiState;
export declare function setProjectExpanded(
  state: UiState,
  projectId: string,
  expanded: boolean,
): UiState;
export declare function reorderProjects(
  state: UiState,
  draggedProjectIds: readonly string[],
  targetProjectIds: readonly string[],
): UiState;
interface UiStateStore extends UiState {
  syncProjects: (projects: readonly SyncProjectInput[]) => void;
  syncThreads: (threads: readonly SyncThreadInput[]) => void;
  markThreadVisited: (threadId: string, visitedAt?: string) => void;
  markThreadUnread: (threadId: string, latestTurnCompletedAt: string | null | undefined) => void;
  clearThreadUi: (threadId: string) => void;
  setThreadChangedFilesExpanded: (threadId: string, turnId: string, expanded: boolean) => void;
  toggleProject: (projectId: string) => void;
  setProjectExpanded: (projectId: string, expanded: boolean) => void;
  reorderProjects: (
    draggedProjectIds: readonly string[],
    targetProjectIds: readonly string[],
  ) => void;
}
export declare const useUiStateStore: import("zustand").UseBoundStore<
  import("zustand").StoreApi<UiStateStore>
>;
export {};
