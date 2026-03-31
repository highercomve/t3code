import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { ensureNativeApi } from "../nativeApi";
const GIT_STATUS_STALE_TIME_MS = 5_000;
const GIT_STATUS_REFETCH_INTERVAL_MS = 15_000;
const GIT_BRANCHES_STALE_TIME_MS = 15_000;
const GIT_BRANCHES_REFETCH_INTERVAL_MS = 60_000;
export const gitQueryKeys = {
  all: ["git"],
  status: (cwd) => ["git", "status", cwd],
  branches: (cwd) => ["git", "branches", cwd],
};
export const gitMutationKeys = {
  init: (cwd) => ["git", "mutation", "init", cwd],
  checkout: (cwd) => ["git", "mutation", "checkout", cwd],
  runStackedAction: (cwd) => ["git", "mutation", "run-stacked-action", cwd],
  pull: (cwd) => ["git", "mutation", "pull", cwd],
  preparePullRequestThread: (cwd) => ["git", "mutation", "prepare-pull-request-thread", cwd],
  suggestCommitMessage: (cwd) => ["git", "mutation", "suggest-commit-message", cwd],
};
export function invalidateGitQueries(queryClient) {
  return queryClient.invalidateQueries({ queryKey: gitQueryKeys.all });
}
export function gitStatusQueryOptions(cwd) {
  return queryOptions({
    queryKey: gitQueryKeys.status(cwd),
    queryFn: async () => {
      const api = ensureNativeApi();
      if (!cwd) throw new Error("Git status is unavailable.");
      return api.git.status({ cwd });
    },
    enabled: cwd !== null,
    staleTime: GIT_STATUS_STALE_TIME_MS,
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
    refetchInterval: GIT_STATUS_REFETCH_INTERVAL_MS,
  });
}
export function gitBranchesQueryOptions(cwd) {
  return queryOptions({
    queryKey: gitQueryKeys.branches(cwd),
    queryFn: async () => {
      const api = ensureNativeApi();
      if (!cwd) throw new Error("Git branches are unavailable.");
      return api.git.listBranches({ cwd });
    },
    enabled: cwd !== null,
    staleTime: GIT_BRANCHES_STALE_TIME_MS,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: GIT_BRANCHES_REFETCH_INTERVAL_MS,
  });
}
export function gitResolvePullRequestQueryOptions(input) {
  return queryOptions({
    queryKey: ["git", "pull-request", input.cwd, input.reference],
    queryFn: async () => {
      const api = ensureNativeApi();
      if (!input.cwd || !input.reference) {
        throw new Error("Pull request lookup is unavailable.");
      }
      return api.git.resolvePullRequest({ cwd: input.cwd, reference: input.reference });
    },
    enabled: input.cwd !== null && input.reference !== null,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
export function gitInitMutationOptions(input) {
  return mutationOptions({
    mutationKey: gitMutationKeys.init(input.cwd),
    mutationFn: async () => {
      const api = ensureNativeApi();
      if (!input.cwd) throw new Error("Git init is unavailable.");
      return api.git.init({ cwd: input.cwd });
    },
    onSuccess: async () => {
      await invalidateGitQueries(input.queryClient);
    },
  });
}
export function gitCheckoutMutationOptions(input) {
  return mutationOptions({
    mutationKey: gitMutationKeys.checkout(input.cwd),
    mutationFn: async (branch) => {
      const api = ensureNativeApi();
      if (!input.cwd) throw new Error("Git checkout is unavailable.");
      return api.git.checkout({ cwd: input.cwd, branch });
    },
    onSuccess: async () => {
      await invalidateGitQueries(input.queryClient);
    },
  });
}
export function gitRunStackedActionMutationOptions(input) {
  return mutationOptions({
    mutationKey: gitMutationKeys.runStackedAction(input.cwd),
    mutationFn: async ({ actionId, action, commitMessage, featureBranch, filePaths }) => {
      const api = ensureNativeApi();
      if (!input.cwd) throw new Error("Git action is unavailable.");
      return api.git.runStackedAction({
        actionId,
        cwd: input.cwd,
        action,
        ...(commitMessage ? { commitMessage } : {}),
        ...(featureBranch ? { featureBranch } : {}),
        ...(filePaths ? { filePaths } : {}),
      });
    },
    onSettled: async () => {
      await invalidateGitQueries(input.queryClient);
    },
  });
}
export function gitPullMutationOptions(input) {
  return mutationOptions({
    mutationKey: gitMutationKeys.pull(input.cwd),
    mutationFn: async () => {
      const api = ensureNativeApi();
      if (!input.cwd) throw new Error("Git pull is unavailable.");
      return api.git.pull({ cwd: input.cwd });
    },
    onSettled: async () => {
      await invalidateGitQueries(input.queryClient);
    },
  });
}
export function gitCreateWorktreeMutationOptions(input) {
  return mutationOptions({
    mutationFn: async ({ cwd, branch, newBranch, path }) => {
      const api = ensureNativeApi();
      if (!cwd) throw new Error("Git worktree creation is unavailable.");
      return api.git.createWorktree({ cwd, branch, newBranch, path: path ?? null });
    },
    mutationKey: ["git", "mutation", "create-worktree"],
    onSettled: async () => {
      await invalidateGitQueries(input.queryClient);
    },
  });
}
export function gitRemoveWorktreeMutationOptions(input) {
  return mutationOptions({
    mutationFn: async ({ cwd, path, force }) => {
      const api = ensureNativeApi();
      if (!cwd) throw new Error("Git worktree removal is unavailable.");
      return api.git.removeWorktree({ cwd, path, force });
    },
    mutationKey: ["git", "mutation", "remove-worktree"],
    onSettled: async () => {
      await invalidateGitQueries(input.queryClient);
    },
  });
}
export function gitSuggestCommitMessageMutationOptions(input) {
  return mutationOptions({
    mutationKey: gitMutationKeys.suggestCommitMessage(input.cwd),
    mutationFn: async (vars) => {
      const api = ensureNativeApi();
      if (!input.cwd) throw new Error("Commit message suggestion is unavailable.");
      return api.git.suggestCommitMessage({
        cwd: input.cwd,
        ...(vars.filePaths ? { filePaths: vars.filePaths } : {}),
      });
    },
  });
}
export function gitPreparePullRequestThreadMutationOptions(input) {
  return mutationOptions({
    mutationFn: async ({ reference, mode }) => {
      const api = ensureNativeApi();
      if (!input.cwd) throw new Error("Pull request thread preparation is unavailable.");
      return api.git.preparePullRequestThread({
        cwd: input.cwd,
        reference,
        mode,
      });
    },
    mutationKey: gitMutationKeys.preparePullRequestThread(input.cwd),
    onSettled: async () => {
      await invalidateGitQueries(input.queryClient);
    },
  });
}
