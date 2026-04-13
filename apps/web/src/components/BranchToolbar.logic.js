import { Schema } from "effect";
export {
  dedupeRemoteBranchesWithLocalMatches,
  deriveLocalBranchNameFromRemoteRef,
} from "@t3tools/shared/git";
export const EnvMode = Schema.Literals(["local", "worktree"]);
const GENERIC_LOCAL_ENVIRONMENT_LABELS = new Set(["local", "local environment"]);
function normalizeDisplayLabel(value) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}
export function resolveEnvironmentOptionLabel(input) {
  const runtimeLabel = normalizeDisplayLabel(input.runtimeLabel);
  const savedLabel = normalizeDisplayLabel(input.savedLabel);
  if (input.isPrimary) {
    const preferredLocalLabel = [runtimeLabel, savedLabel].find((label) => {
      if (!label) return false;
      return !GENERIC_LOCAL_ENVIRONMENT_LABELS.has(label.toLowerCase());
    });
    return preferredLocalLabel ?? "This device";
  }
  return runtimeLabel ?? savedLabel ?? input.environmentId;
}
export function resolveEnvModeLabel(mode) {
  return mode === "worktree" ? "New worktree" : "Current checkout";
}
export function resolveCurrentWorkspaceLabel(activeWorktreePath) {
  return activeWorktreePath ? "Current worktree" : resolveEnvModeLabel("local");
}
export function resolveLockedWorkspaceLabel(activeWorktreePath) {
  return activeWorktreePath ? "Worktree" : "Local checkout";
}
export function resolveEffectiveEnvMode(input) {
  const { activeWorktreePath, hasServerThread, draftThreadEnvMode } = input;
  if (!hasServerThread) {
    if (activeWorktreePath) {
      return "local";
    }
    return draftThreadEnvMode === "worktree" ? "worktree" : "local";
  }
  return activeWorktreePath ? "worktree" : "local";
}
export function resolveDraftEnvModeAfterBranchChange(input) {
  const { nextWorktreePath, currentWorktreePath, effectiveEnvMode } = input;
  if (nextWorktreePath) {
    return "worktree";
  }
  if (effectiveEnvMode === "worktree" && !currentWorktreePath) {
    return "worktree";
  }
  return "local";
}
export function resolveBranchToolbarValue(input) {
  const { envMode, activeWorktreePath, activeThreadBranch, currentGitBranch } = input;
  if (envMode === "worktree" && !activeWorktreePath) {
    return activeThreadBranch ?? currentGitBranch;
  }
  return currentGitBranch ?? activeThreadBranch;
}
export function resolveBranchSelectionTarget(input) {
  const { activeProjectCwd, activeWorktreePath, branch } = input;
  if (branch.worktreePath) {
    return {
      checkoutCwd: branch.worktreePath,
      nextWorktreePath: branch.worktreePath === activeProjectCwd ? null : branch.worktreePath,
      reuseExistingWorktree: true,
    };
  }
  const nextWorktreePath =
    activeWorktreePath !== null && branch.isDefault ? null : activeWorktreePath;
  return {
    checkoutCwd: nextWorktreePath ?? activeProjectCwd,
    nextWorktreePath,
    reuseExistingWorktree: false,
  };
}
export function shouldIncludeBranchPickerItem(input) {
  const { itemValue, normalizedQuery, createBranchItemValue, checkoutPullRequestItemValue } = input;
  if (normalizedQuery.length === 0) {
    return true;
  }
  if (createBranchItemValue && itemValue === createBranchItemValue) {
    return true;
  }
  if (checkoutPullRequestItemValue && itemValue === checkoutPullRequestItemValue) {
    return true;
  }
  return itemValue.toLowerCase().includes(normalizedQuery);
}
