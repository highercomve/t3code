import type { ThreadId } from "@t3tools/contracts";
import { EnvMode } from "./BranchToolbar.logic";
interface BranchToolbarProps {
  threadId: ThreadId;
  onEnvModeChange: (mode: EnvMode) => void;
  envLocked: boolean;
  onCheckoutPullRequestRequest?: (reference: string) => void;
  onComposerFocusRequest?: () => void;
}
export default function BranchToolbar({
  threadId,
  onEnvModeChange,
  envLocked,
  onCheckoutPullRequestRequest,
  onComposerFocusRequest,
}: BranchToolbarProps): import("react/jsx-runtime").JSX.Element | null;
export {};
