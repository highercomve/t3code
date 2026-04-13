import { type ScopedProjectRef, type ScopedThreadRef, type ThreadId } from "@t3tools/contracts";
import { type AppState } from "./store";
import { type Project, type Thread } from "./types";
export declare function createProjectSelectorByRef(
  ref: ScopedProjectRef | null | undefined,
): (state: AppState) => Project | undefined;
export declare function createThreadSelectorByRef(
  ref: ScopedThreadRef | null | undefined,
): (state: AppState) => Thread | undefined;
export declare function createThreadSelectorAcrossEnvironments(
  threadId: ThreadId | null | undefined,
): (state: AppState) => Thread | undefined;
