import { infiniteQueryOptions, mutationOptions, queryOptions } from "@tanstack/react-query";
import { ensureEnvironmentApi } from "../environmentApi";
import { requireEnvironmentConnection } from "../environments/runtime";
const GIT_BRANCHES_STALE_TIME_MS = 15_000;
const GIT_BRANCHES_REFETCH_INTERVAL_MS = 60_000;
const GIT_BRANCHES_PAGE_SIZE = 100;
export const gitQueryKeys = {
  all: ["git"],
  branches: (environmentId, cwd) => ["git", "branches", environmentId ?? null, cwd],
  branchSearch: (environmentId, cwd, query) => [
    "git",
    "branches",
    environmentId ?? null,
    cwd,
    "search",
    query,
  ],
};
export const gitMutationKeys = {
  init: (environmentId, cwd) => ["git", "mutation", "init", environmentId ?? null, cwd],
  checkout: (environmentId, cwd) => ["git", "mutation", "checkout", environmentId ?? null, cwd],
  runStackedAction: (environmentId, cwd) => [
    "git",
    "mutation",
    "run-stacked-action",
    environmentId ?? null,
    cwd,
  ],
  pull: (environmentId, cwd) => ["git", "mutation", "pull", environmentId ?? null, cwd],
  preparePullRequestThread: (environmentId, cwd) => [
    "git",
    "mutation",
    "prepare-pull-request-thread",
    environmentId ?? null,
    cwd,
  ],
  suggestCommitMessage: (cwd) => ["git", "mutation", "suggest-commit-message", cwd],
};
export function invalidateGitQueries(queryClient, input) {
  const environmentId = input?.environmentId ?? null;
  const cwd = input?.cwd ?? null;
  if (cwd !== null) {
    return queryClient.invalidateQueries({ queryKey: gitQueryKeys.branches(environmentId, cwd) });
  }
  return queryClient.invalidateQueries({ queryKey: gitQueryKeys.all });
}
function invalidateGitBranchQueries(queryClient, environmentId, cwd) {
  if (cwd === null) {
    return Promise.resolve();
  }
  return queryClient.invalidateQueries({ queryKey: gitQueryKeys.branches(environmentId, cwd) });
}
export function gitBranchSearchInfiniteQueryOptions(input) {
  const normalizedQuery = input.query.trim();
  return infiniteQueryOptions({
    queryKey: gitQueryKeys.branchSearch(input.environmentId, input.cwd, normalizedQuery),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      if (!input.cwd) throw new Error("Git branches are unavailable.");
      if (!input.environmentId) throw new Error("Git branches are unavailable.");
      const api = ensureEnvironmentApi(input.environmentId);
      return api.git.listBranches({
        cwd: input.cwd,
        ...(normalizedQuery.length > 0 ? { query: normalizedQuery } : {}),
        cursor: pageParam,
        limit: GIT_BRANCHES_PAGE_SIZE,
      });
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: input.cwd !== null && (input.enabled ?? true),
    staleTime: GIT_BRANCHES_STALE_TIME_MS,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: GIT_BRANCHES_REFETCH_INTERVAL_MS,
  });
}
export function gitResolvePullRequestQueryOptions(input) {
  return queryOptions({
    queryKey: ["git", "pull-request", input.environmentId ?? null, input.cwd, input.reference],
    queryFn: async () => {
      if (!input.cwd || !input.reference || !input.environmentId) {
        throw new Error("Pull request lookup is unavailable.");
      }
      const api = ensureEnvironmentApi(input.environmentId);
      return api.git.resolvePullRequest({ cwd: input.cwd, reference: input.reference });
    },
    enabled: input.environmentId !== null && input.cwd !== null && input.reference !== null,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
export function gitInitMutationOptions(input) {
  return mutationOptions({
    mutationKey: gitMutationKeys.init(input.environmentId, input.cwd),
    mutationFn: async () => {
      if (!input.cwd || !input.environmentId) throw new Error("Git init is unavailable.");
      const api = ensureEnvironmentApi(input.environmentId);
      return api.git.init({ cwd: input.cwd });
    },
    onSettled: async () => {
      await invalidateGitBranchQueries(input.queryClient, input.environmentId, input.cwd);
    },
  });
}
export function gitCheckoutMutationOptions(input) {
  return mutationOptions({
    mutationKey: gitMutationKeys.checkout(input.environmentId, input.cwd),
    mutationFn: async (branch) => {
      if (!input.cwd || !input.environmentId) throw new Error("Git checkout is unavailable.");
      const api = ensureEnvironmentApi(input.environmentId);
      return api.git.checkout({ cwd: input.cwd, branch });
    },
    onSettled: async () => {
      await invalidateGitBranchQueries(input.queryClient, input.environmentId, input.cwd);
    },
  });
}
export function gitRunStackedActionMutationOptions(input) {
  return mutationOptions({
    mutationKey: gitMutationKeys.runStackedAction(input.environmentId, input.cwd),
    mutationFn: async ({
      actionId,
      action,
      commitMessage,
      featureBranch,
      filePaths,
      onProgress,
    }) => {
      if (!input.cwd || !input.environmentId) throw new Error("Git action is unavailable.");
      return requireEnvironmentConnection(input.environmentId).client.git.runStackedAction(
        {
          action,
          actionId,
          cwd: input.cwd,
          ...(commitMessage ? { commitMessage } : {}),
          ...(featureBranch ? { featureBranch: true } : {}),
          ...(filePaths && filePaths.length > 0 ? { filePaths } : {}),
        },
        ...(onProgress ? [{ onProgress }] : []),
      );
    },
    onSuccess: async () => {
      await invalidateGitBranchQueries(input.queryClient, input.environmentId, input.cwd);
    },
  });
}
export function gitPullMutationOptions(input) {
  return mutationOptions({
    mutationKey: gitMutationKeys.pull(input.environmentId, input.cwd),
    mutationFn: async () => {
      if (!input.cwd || !input.environmentId) throw new Error("Git pull is unavailable.");
      const api = ensureEnvironmentApi(input.environmentId);
      return api.git.pull({ cwd: input.cwd });
    },
    onSuccess: async () => {
      await invalidateGitBranchQueries(input.queryClient, input.environmentId, input.cwd);
    },
  });
}
export function gitCreateWorktreeMutationOptions(input) {
  return mutationOptions({
    mutationKey: ["git", "mutation", "create-worktree", input.environmentId ?? null],
    mutationFn: (args) => {
      if (!input.environmentId) {
        throw new Error("Worktree creation is unavailable.");
      }
      return ensureEnvironmentApi(input.environmentId).git.createWorktree(args);
    },
    onSuccess: async () => {
      await invalidateGitQueries(input.queryClient, { environmentId: input.environmentId });
    },
  });
}
export function gitRemoveWorktreeMutationOptions(input) {
  return mutationOptions({
    mutationKey: ["git", "mutation", "remove-worktree", input.environmentId ?? null],
    mutationFn: (args) => {
      if (!input.environmentId) {
        throw new Error("Worktree removal is unavailable.");
      }
      return ensureEnvironmentApi(input.environmentId).git.removeWorktree(args);
    },
    onSuccess: async () => {
      await invalidateGitQueries(input.queryClient, { environmentId: input.environmentId });
    },
  });
}
export function gitSuggestCommitMessageMutationOptions(input) {
  return mutationOptions({
    mutationKey: gitMutationKeys.suggestCommitMessage(input.cwd),
    mutationFn: async (vars) => {
      if (!input.environmentId || !input.cwd)
        throw new Error("Commit message suggestion is unavailable.");
      const api = ensureEnvironmentApi(input.environmentId);
      return api.git.suggestCommitMessage({
        cwd: input.cwd,
        ...(vars.filePaths ? { filePaths: vars.filePaths } : {}),
      });
    },
  });
}
export function gitPreparePullRequestThreadMutationOptions(input) {
  return mutationOptions({
    mutationKey: gitMutationKeys.preparePullRequestThread(input.environmentId, input.cwd),
    mutationFn: async (args) => {
      if (!input.cwd || !input.environmentId) {
        throw new Error("Pull request thread preparation is unavailable.");
      }
      const api = ensureEnvironmentApi(input.environmentId);
      return api.git.preparePullRequestThread({
        cwd: input.cwd,
        reference: args.reference,
        mode: args.mode,
        ...(args.threadId ? { threadId: args.threadId } : {}),
      });
    },
    onSuccess: async () => {
      await invalidateGitBranchQueries(input.queryClient, input.environmentId, input.cwd);
    },
  });
}
