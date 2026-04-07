import { Schema } from "effect";
export { dedupeRemoteBranchesWithLocalMatches, deriveLocalBranchNameFromRemoteRef, } from "@t3tools/shared/git";
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
export function resolveBranchSelectionTarget(input) {
    const { activeProjectCwd, activeWorktreePath, branch } = input;
    if (branch.worktreePath) {
        return {
            checkoutCwd: branch.worktreePath,
            nextWorktreePath: branch.worktreePath === activeProjectCwd ? null : branch.worktreePath,
            reuseExistingWorktree: true,
        };
    }
    const nextWorktreePath = activeWorktreePath !== null && branch.isDefault ? null : activeWorktreePath;
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
