import { type ReactNode } from "react";
import { ThreadId, type OrchestrationReadModel } from "@t3tools/contracts";
import { type Project, type Thread } from "./types";
export interface AppState {
  projects: Project[];
  threads: Thread[];
  threadsHydrated: boolean;
}
export declare function syncServerReadModel(
  state: AppState,
  readModel: OrchestrationReadModel,
): AppState;
export declare function markThreadVisited(
  state: AppState,
  threadId: ThreadId,
  visitedAt?: string,
): AppState;
export declare function markThreadUnread(state: AppState, threadId: ThreadId): AppState;
export declare function toggleProject(state: AppState, projectId: Project["id"]): AppState;
export declare function setProjectExpanded(
  state: AppState,
  projectId: Project["id"],
  expanded: boolean,
): AppState;
export declare function reorderProjects(
  state: AppState,
  draggedProjectId: Project["id"],
  targetProjectId: Project["id"],
): AppState;
export declare function setError(
  state: AppState,
  threadId: ThreadId,
  error: string | null,
): AppState;
export declare function setThreadBranch(
  state: AppState,
  threadId: ThreadId,
  branch: string | null,
  worktreePath: string | null,
): AppState;
interface AppStore extends AppState {
  syncServerReadModel: (readModel: OrchestrationReadModel) => void;
  markThreadVisited: (threadId: ThreadId, visitedAt?: string) => void;
  markThreadUnread: (threadId: ThreadId) => void;
  toggleProject: (projectId: Project["id"]) => void;
  setProjectExpanded: (projectId: Project["id"], expanded: boolean) => void;
  reorderProjects: (draggedProjectId: Project["id"], targetProjectId: Project["id"]) => void;
  setError: (threadId: ThreadId, error: string | null) => void;
  setThreadBranch: (threadId: ThreadId, branch: string | null, worktreePath: string | null) => void;
}
export declare const useStore: import("zustand").UseBoundStore<
  import("zustand").StoreApi<AppStore>
>;
export declare function StoreProvider({
  children,
}: {
  children: ReactNode;
}): import("react").FunctionComponentElement<import("react").FragmentProps>;
export {};
