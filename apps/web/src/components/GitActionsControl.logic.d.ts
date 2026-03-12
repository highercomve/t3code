import type {
  GitRunStackedActionResult,
  GitStackedAction,
  GitStatusResult,
} from "@t3tools/contracts";
export type GitActionIconName = "commit" | "push" | "pr";
export type GitDialogAction = "commit" | "push" | "create_pr";
export interface GitActionMenuItem {
  id: "commit" | "push" | "pr";
  label: string;
  disabled: boolean;
  icon: GitActionIconName;
  kind: "open_dialog" | "open_pr";
  dialogAction?: GitDialogAction;
}
export interface GitQuickAction {
  label: string;
  disabled: boolean;
  kind: "run_action" | "run_pull" | "open_pr" | "show_hint";
  action?: GitStackedAction;
  hint?: string;
}
export interface DefaultBranchActionDialogCopy {
  title: string;
  description: string;
  continueLabel: string;
}
export type DefaultBranchConfirmableAction = "commit_push" | "commit_push_pr";
export declare function buildGitActionProgressStages(input: {
  action: GitStackedAction;
  hasCustomCommitMessage: boolean;
  hasWorkingTreeChanges: boolean;
  forcePushOnly?: boolean;
  pushTarget?: string;
  featureBranch?: boolean;
}): string[];
export declare function summarizeGitResult(result: GitRunStackedActionResult): {
  title: string;
  description?: string;
};
export declare function buildMenuItems(
  gitStatus: GitStatusResult | null,
  isBusy: boolean,
  hasOriginRemote?: boolean,
): GitActionMenuItem[];
export declare function resolveQuickAction(
  gitStatus: GitStatusResult | null,
  isBusy: boolean,
  isDefaultBranch?: boolean,
  hasOriginRemote?: boolean,
): GitQuickAction;
export declare function requiresDefaultBranchConfirmation(
  action: GitStackedAction,
  isDefaultBranch: boolean,
): boolean;
export declare function resolveDefaultBranchActionDialogCopy(input: {
  action: DefaultBranchConfirmableAction;
  branchName: string;
  includesCommit: boolean;
}): DefaultBranchActionDialogCopy;
export { resolveAutoFeatureBranchName } from "@t3tools/shared/git";
