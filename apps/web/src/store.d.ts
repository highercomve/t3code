import {
  type OrchestrationEvent,
  type ProjectId,
  ThreadId,
  type OrchestrationReadModel,
} from "@t3tools/contracts";
import { type Project, type SidebarThreadSummary, type Thread } from "./types";
export interface AppState {
  projects: Project[];
  threads: Thread[];
  sidebarThreadsById: Record<string, SidebarThreadSummary>;
  threadIdsByProjectId: Record<string, ThreadId[]>;
  bootstrapComplete: boolean;
}
export declare function syncServerReadModel(
  state: AppState,
  readModel: OrchestrationReadModel,
): AppState;
export declare function applyOrchestrationEvent(
  state: AppState,
  event: OrchestrationEvent,
): AppState;
export declare function applyOrchestrationEvents(
  state: AppState,
  events: ReadonlyArray<OrchestrationEvent>,
): AppState;
export declare const selectProjectById: (
  projectId: Project["id"] | null | undefined,
) => (state: AppState) => Project | undefined;
export declare const selectThreadById: (
  threadId: ThreadId | null | undefined,
) => (state: AppState) => Thread | undefined;
export declare const selectSidebarThreadSummaryById: (
  threadId: ThreadId | null | undefined,
) => (state: AppState) => SidebarThreadSummary | undefined;
export declare const selectThreadIdsByProjectId: (
  projectId: ProjectId | null | undefined,
) => (state: AppState) => ThreadId[];
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
  applyOrchestrationEvent: (event: OrchestrationEvent) => void;
  applyOrchestrationEvents: (events: ReadonlyArray<OrchestrationEvent>) => void;
  setError: (threadId: ThreadId, error: string | null) => void;
  setThreadBranch: (threadId: ThreadId, branch: string | null, worktreePath: string | null) => void;
}
export declare const useStore: import("zustand").UseBoundStore<
  import("zustand").StoreApi<AppStore>
>;
export {};
