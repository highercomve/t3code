import { type ProjectId, type ThreadId } from "@t3tools/contracts";
export interface UiProjectState {
  projectExpandedById: Record<string, boolean>;
  projectOrder: ProjectId[];
}
export interface UiThreadState {
  threadLastVisitedAtById: Record<string, string>;
}
export interface UiState extends UiProjectState, UiThreadState {}
export interface SyncProjectInput {
  id: ProjectId;
  cwd: string;
}
export interface SyncThreadInput {
  id: ThreadId;
  seedVisitedAt?: string | undefined;
}
export declare function syncProjects(
  state: UiState,
  projects: readonly SyncProjectInput[],
): UiState;
export declare function syncThreads(state: UiState, threads: readonly SyncThreadInput[]): UiState;
export declare function markThreadVisited(
  state: UiState,
  threadId: ThreadId,
  visitedAt?: string,
): UiState;
export declare function markThreadUnread(
  state: UiState,
  threadId: ThreadId,
  latestTurnCompletedAt: string | null | undefined,
): UiState;
export declare function clearThreadUi(state: UiState, threadId: ThreadId): UiState;
export declare function toggleProject(state: UiState, projectId: ProjectId): UiState;
export declare function setProjectExpanded(
  state: UiState,
  projectId: ProjectId,
  expanded: boolean,
): UiState;
export declare function reorderProjects(
  state: UiState,
  draggedProjectId: ProjectId,
  targetProjectId: ProjectId,
): UiState;
interface UiStateStore extends UiState {
  syncProjects: (projects: readonly SyncProjectInput[]) => void;
  syncThreads: (threads: readonly SyncThreadInput[]) => void;
  markThreadVisited: (threadId: ThreadId, visitedAt?: string) => void;
  markThreadUnread: (threadId: ThreadId, latestTurnCompletedAt: string | null | undefined) => void;
  clearThreadUi: (threadId: ThreadId) => void;
  toggleProject: (projectId: ProjectId) => void;
  setProjectExpanded: (projectId: ProjectId, expanded: boolean) => void;
  reorderProjects: (draggedProjectId: ProjectId, targetProjectId: ProjectId) => void;
}
export declare const useUiStateStore: import("zustand").UseBoundStore<
  import("zustand").StoreApi<UiStateStore>
>;
export {};
