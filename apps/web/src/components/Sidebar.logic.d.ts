import type { SidebarProjectSortOrder, SidebarThreadSortOrder } from "@t3tools/contracts/settings";
import type { Thread } from "../types";
export declare const THREAD_SELECTION_SAFE_SELECTOR =
  "[data-thread-item], [data-thread-selection-safe]";
export type SidebarNewThreadEnvMode = "local" | "worktree";
type SidebarProject = {
  id: string;
  name: string;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};
type SidebarThreadSortInput = Pick<Thread, "createdAt" | "updatedAt" | "messages">;
export interface ThreadStatusPill {
  label:
    | "Working"
    | "Connecting"
    | "Completed"
    | "Pending Approval"
    | "Awaiting Input"
    | "Plan Ready";
  colorClass: string;
  dotClass: string;
  pulse: boolean;
}
type ThreadStatusInput = Pick<
  Thread,
  "interactionMode" | "latestTurn" | "lastVisitedAt" | "proposedPlans" | "session"
>;
export declare function hasUnseenCompletion(thread: ThreadStatusInput): boolean;
export declare function shouldClearThreadSelectionOnMouseDown(target: HTMLElement | null): boolean;
export declare function resolveSidebarNewThreadEnvMode(input: {
  requestedEnvMode?: SidebarNewThreadEnvMode;
  defaultEnvMode: SidebarNewThreadEnvMode;
}): SidebarNewThreadEnvMode;
export declare function resolveThreadRowClassName(input: {
  isActive: boolean;
  isSelected: boolean;
}): string;
export declare function resolveThreadStatusPill(input: {
  thread: ThreadStatusInput;
  hasPendingApprovals: boolean;
  hasPendingUserInput: boolean;
}): ThreadStatusPill | null;
export declare function resolveProjectStatusIndicator(
  statuses: ReadonlyArray<ThreadStatusPill | null>,
): ThreadStatusPill | null;
export declare function getVisibleThreadsForProject(input: {
  threads: readonly Thread[];
  activeThreadId: Thread["id"] | undefined;
  isThreadListExpanded: boolean;
  previewLimit: number;
}): {
  hasHiddenThreads: boolean;
  visibleThreads: Thread[];
};
export declare function sortThreadsForSidebar<
  T extends Pick<Thread, "id" | "createdAt" | "updatedAt" | "messages">,
>(threads: readonly T[], sortOrder: SidebarThreadSortOrder): T[];
export declare function getFallbackThreadIdAfterDelete<
  T extends Pick<Thread, "id" | "projectId" | "createdAt" | "updatedAt" | "messages">,
>(input: {
  threads: readonly T[];
  deletedThreadId: T["id"];
  sortOrder: SidebarThreadSortOrder;
  deletedThreadIds?: ReadonlySet<T["id"]>;
}): T["id"] | null;
export declare function getProjectSortTimestamp(
  project: SidebarProject,
  projectThreads: readonly SidebarThreadSortInput[],
  sortOrder: Exclude<SidebarProjectSortOrder, "manual">,
): number;
export declare function sortProjectsForSidebar<
  TProject extends SidebarProject,
  TThread extends Thread,
>(
  projects: readonly TProject[],
  threads: readonly TThread[],
  sortOrder: SidebarProjectSortOrder,
): TProject[];
export {};
