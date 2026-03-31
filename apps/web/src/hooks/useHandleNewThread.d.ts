import { type ProjectId } from "@t3tools/contracts";
import { type DraftThreadEnvMode, type DraftThreadState } from "../composerDraftStore";
export declare function useHandleNewThread(): {
  activeDraftThread: DraftThreadState | null;
  activeThread: import("../types").Thread | undefined;
  defaultProjectId: (string & import("effect/Brand").Brand<"ProjectId">) | null;
  handleNewThread: (
    projectId: ProjectId,
    options?: {
      branch?: string | null;
      worktreePath?: string | null;
      envMode?: DraftThreadEnvMode;
    },
  ) => Promise<void>;
  routeThreadId: (string & import("effect/Brand").Brand<"ThreadId">) | null;
};
