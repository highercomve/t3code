import { type ScopedProjectRef } from "@t3tools/contracts";
import { type DraftThreadEnvMode } from "../composerDraftStore";
export declare function useNewThreadHandler(): {
  handleNewThread: (
    projectRef: ScopedProjectRef,
    options?: {
      branch?: string | null;
      worktreePath?: string | null;
      envMode?: DraftThreadEnvMode;
    },
  ) => Promise<void>;
};
export declare function useHandleNewThread(): {
  activeDraftThread: import("../composerDraftStore").DraftSessionState | null;
  activeThread: import("../types").Thread | undefined;
  defaultProjectRef: {
    readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
    readonly environmentId: string & import("effect/Brand").Brand<"EnvironmentId">;
  } | null;
  handleNewThread: (
    projectRef: ScopedProjectRef,
    options?: {
      branch?: string | null;
      worktreePath?: string | null;
      envMode?: DraftThreadEnvMode;
    },
  ) => Promise<void>;
  routeThreadRef: {
    readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
    readonly environmentId: string & import("effect/Brand").Brand<"EnvironmentId">;
  } | null;
};
