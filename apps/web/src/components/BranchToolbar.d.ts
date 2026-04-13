import type { EnvironmentId, ThreadId } from "@t3tools/contracts";
import { type DraftId } from "../composerDraftStore";
import { type EnvMode, type EnvironmentOption } from "./BranchToolbar.logic";
interface BranchToolbarProps {
  environmentId: EnvironmentId;
  threadId: ThreadId;
  draftId?: DraftId;
  onEnvModeChange: (mode: EnvMode) => void;
  effectiveEnvModeOverride?: EnvMode;
  activeThreadBranchOverride?: string | null;
  onActiveThreadBranchOverrideChange?: (branch: string | null) => void;
  envLocked: boolean;
  onCheckoutPullRequestRequest?: (reference: string) => void;
  onComposerFocusRequest?: () => void;
  availableEnvironments?: readonly EnvironmentOption[];
  onEnvironmentChange?: (environmentId: EnvironmentId) => void;
}
export declare const BranchToolbar: import("react").NamedExoticComponent<BranchToolbarProps>;
export {};
