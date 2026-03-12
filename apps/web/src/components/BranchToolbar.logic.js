import { Schema } from "effect";
export const EnvMode = Schema.Literals(["local", "worktree"]);
export function resolveEffectiveEnvMode(input) {
  const { activeWorktreePath, hasServerThread, draftThreadEnvMode } = input;
  return activeWorktreePath || (!hasServerThread && draftThreadEnvMode === "worktree")
    ? "worktree"
    : "local";
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
export function deriveLocalBranchNameFromRemoteRef(branchName) {
  const firstSeparatorIndex = branchName.indexOf("/");
  if (firstSeparatorIndex <= 0 || firstSeparatorIndex === branchName.length - 1) {
    return branchName;
  }
  return branchName.slice(firstSeparatorIndex + 1);
}
function deriveLocalBranchNameCandidatesFromRemoteRef(branchName, remoteName) {
  const candidates = new Set();
  const firstSlashCandidate = deriveLocalBranchNameFromRemoteRef(branchName);
  if (firstSlashCandidate.length > 0) {
    candidates.add(firstSlashCandidate);
  }
  if (remoteName) {
    const remotePrefix = `${remoteName}/`;
    if (branchName.startsWith(remotePrefix) && branchName.length > remotePrefix.length) {
      candidates.add(branchName.slice(remotePrefix.length));
    }
  }
  return [...candidates];
}
export function dedupeRemoteBranchesWithLocalMatches(branches) {
  const localBranchNames = new Set(
    branches.filter((branch) => !branch.isRemote).map((branch) => branch.name),
  );
  return branches.filter((branch) => {
    if (!branch.isRemote) {
      return true;
    }
    if (branch.remoteName !== "origin") {
      return true;
    }
    const localBranchCandidates = deriveLocalBranchNameCandidatesFromRemoteRef(
      branch.name,
      branch.remoteName,
    );
    return !localBranchCandidates.some((candidate) => localBranchNames.has(candidate));
  });
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
