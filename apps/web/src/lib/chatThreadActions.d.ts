import type { EnvironmentId, ProjectId, ScopedProjectRef } from "@t3tools/contracts";
import type { DraftThreadEnvMode } from "../composerDraftStore";
interface ThreadContextLike {
  environmentId: EnvironmentId;
  projectId: ProjectId;
  branch: string | null;
  worktreePath: string | null;
}
interface DraftThreadContextLike extends ThreadContextLike {
  envMode: DraftThreadEnvMode;
}
interface NewThreadHandler {
  (
    projectRef: ScopedProjectRef,
    options?: {
      branch?: string | null;
      worktreePath?: string | null;
      envMode?: DraftThreadEnvMode;
    },
  ): Promise<void>;
}
export interface ChatThreadActionContext {
  readonly activeDraftThread: DraftThreadContextLike | null;
  readonly activeThread: ThreadContextLike | undefined;
  readonly defaultProjectRef: ScopedProjectRef | null;
  readonly defaultThreadEnvMode: DraftThreadEnvMode;
  readonly handleNewThread: NewThreadHandler;
}
export declare function resolveThreadActionProjectRef(
  context: ChatThreadActionContext,
): ScopedProjectRef | null;
export declare function startNewThreadInProjectFromContext(
  context: ChatThreadActionContext,
  projectRef: ScopedProjectRef,
): Promise<void>;
export declare function startNewThreadFromContext(
  context: ChatThreadActionContext,
): Promise<boolean>;
export declare function startNewLocalThreadFromContext(
  context: ChatThreadActionContext,
): Promise<boolean>;
export {};
