import { infiniteQueryOptions, mutationOptions, queryOptions, } from "@tanstack/react-query";
import { ensureNativeApi } from "../nativeApi";
import { getWsRpcClient } from "../wsRpcClient";
const GIT_BRANCHES_STALE_TIME_MS = 15_000;
const GIT_BRANCHES_REFETCH_INTERVAL_MS = 60_000;
const GIT_BRANCHES_PAGE_SIZE = 100;
export const gitQueryKeys = {
    all: ["git"],
    branches: (cwd) => ["git", "branches", cwd],
    branchSearch: (cwd, query) => ["git", "branches", cwd, "search", query],
};
export const gitMutationKeys = {
    init: (cwd) => ["git", "mutation", "init", cwd],
    checkout: (cwd) => ["git", "mutation", "checkout", cwd],
    runStackedAction: (cwd) => ["git", "mutation", "run-stacked-action", cwd],
    pull: (cwd) => ["git", "mutation", "pull", cwd],
    preparePullRequestThread: (cwd) => ["git", "mutation", "prepare-pull-request-thread", cwd],
    suggestCommitMessage: (cwd) => ["git", "mutation", "suggest-commit-message", cwd],
};
export function invalidateGitQueries(queryClient, input) {
    const cwd = input?.cwd ?? null;
    if (cwd !== null) {
        return queryClient.invalidateQueries({ queryKey: gitQueryKeys.branches(cwd) });
    }
    return queryClient.invalidateQueries({ queryKey: gitQueryKeys.all });
}
function invalidateGitBranchQueries(queryClient, cwd) {
    if (cwd === null) {
        return Promise.resolve();
    }
    return queryClient.invalidateQueries({ queryKey: gitQueryKeys.branches(cwd) });
}
export function gitBranchSearchInfiniteQueryOptions(input) {
    const normalizedQuery = input.query.trim();
    return infiniteQueryOptions({
        queryKey: gitQueryKeys.branchSearch(input.cwd, normalizedQuery),
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const api = ensureNativeApi();
            if (!input.cwd)
                throw new Error("Git branches are unavailable.");
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
            if (!input.cwd)
                throw new Error("Git init is unavailable.");
            return api.git.init({ cwd: input.cwd });
        },
        onSettled: async () => {
            await invalidateGitBranchQueries(input.queryClient, input.cwd);
        },
    });
}
export function gitCheckoutMutationOptions(input) {
    return mutationOptions({
        mutationKey: gitMutationKeys.checkout(input.cwd),
        mutationFn: async (branch) => {
            const api = ensureNativeApi();
            if (!input.cwd)
                throw new Error("Git checkout is unavailable.");
            return api.git.checkout({ cwd: input.cwd, branch });
        },
        onSettled: async () => {
            await invalidateGitBranchQueries(input.queryClient, input.cwd);
        },
    });
}
export function gitRunStackedActionMutationOptions(input) {
    return mutationOptions({
        mutationKey: gitMutationKeys.runStackedAction(input.cwd),
        mutationFn: async ({ actionId, action, commitMessage, featureBranch, filePaths, onProgress, }) => {
            if (!input.cwd)
                throw new Error("Git action is unavailable.");
            return getWsRpcClient().git.runStackedAction({
                action,
                actionId,
                cwd: input.cwd,
                ...(commitMessage ? { commitMessage } : {}),
                ...(featureBranch ? { featureBranch: true } : {}),
                ...(filePaths && filePaths.length > 0 ? { filePaths } : {}),
            }, ...(onProgress ? [{ onProgress }] : []));
        },
        onSuccess: async () => {
            await invalidateGitBranchQueries(input.queryClient, input.cwd);
        },
    });
}
export function gitPullMutationOptions(input) {
    return mutationOptions({
        mutationKey: gitMutationKeys.pull(input.cwd),
        mutationFn: async () => {
            const api = ensureNativeApi();
            if (!input.cwd)
                throw new Error("Git pull is unavailable.");
            return api.git.pull({ cwd: input.cwd });
        },
        onSuccess: async () => {
            await invalidateGitBranchQueries(input.queryClient, input.cwd);
        },
    });
}
export function gitCreateWorktreeMutationOptions(input) {
    return mutationOptions({
        mutationKey: ["git", "mutation", "create-worktree"],
        mutationFn: (args) => ensureNativeApi().git.createWorktree(args),
        onSuccess: async () => {
            await invalidateGitQueries(input.queryClient);
        },
    });
}
export function gitRemoveWorktreeMutationOptions(input) {
    return mutationOptions({
        mutationKey: ["git", "mutation", "remove-worktree"],
        mutationFn: (args) => ensureNativeApi().git.removeWorktree(args),
        onSuccess: async () => {
            await invalidateGitQueries(input.queryClient);
        },
    });
}
export function gitSuggestCommitMessageMutationOptions(input) {
    return mutationOptions({
        mutationKey: gitMutationKeys.suggestCommitMessage(input.cwd),
        mutationFn: async (vars) => {
            const api = ensureNativeApi();
            if (!input.cwd)
                throw new Error("Commit message suggestion is unavailable.");
            return api.git.suggestCommitMessage({
                cwd: input.cwd,
                ...(vars.filePaths ? { filePaths: vars.filePaths } : {}),
            });
        },
    });
}
export function gitPreparePullRequestThreadMutationOptions(input) {
    return mutationOptions({
        mutationKey: gitMutationKeys.preparePullRequestThread(input.cwd),
        mutationFn: async (args) => {
            const api = ensureNativeApi();
            if (!input.cwd)
                throw new Error("Pull request thread preparation is unavailable.");
            return api.git.preparePullRequestThread({
                cwd: input.cwd,
                reference: args.reference,
                mode: args.mode,
                ...(args.threadId ? { threadId: args.threadId } : {}),
            });
        },
        onSuccess: async () => {
            await invalidateGitBranchQueries(input.queryClient, input.cwd);
        },
    });
}
