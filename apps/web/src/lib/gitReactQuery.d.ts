import { type GitActionProgressEvent, type GitStackedAction, type ThreadId } from "@t3tools/contracts";
import { type QueryClient } from "@tanstack/react-query";
export declare const gitQueryKeys: {
    all: readonly ["git"];
    branches: (cwd: string | null) => readonly ["git", "branches", string | null];
    branchSearch: (cwd: string | null, query: string) => readonly ["git", "branches", string | null, "search", string];
};
export declare const gitMutationKeys: {
    init: (cwd: string | null) => readonly ["git", "mutation", "init", string | null];
    checkout: (cwd: string | null) => readonly ["git", "mutation", "checkout", string | null];
    runStackedAction: (cwd: string | null) => readonly ["git", "mutation", "run-stacked-action", string | null];
    pull: (cwd: string | null) => readonly ["git", "mutation", "pull", string | null];
    preparePullRequestThread: (cwd: string | null) => readonly ["git", "mutation", "prepare-pull-request-thread", string | null];
    suggestCommitMessage: (cwd: string | null) => readonly ["git", "mutation", "suggest-commit-message", string | null];
};
export declare function invalidateGitQueries(queryClient: QueryClient, input?: {
    cwd?: string | null;
}): Promise<void>;
export declare function gitBranchSearchInfiniteQueryOptions(input: {
    cwd: string | null;
    query: string;
    enabled?: boolean;
}): import("@tanstack/react-query").OmitKeyof<import("@tanstack/react-query").UseInfiniteQueryOptions<{
    readonly isRepo: boolean;
    readonly hasOriginRemote: boolean;
    readonly branches: readonly {
        readonly name: string;
        readonly worktreePath: string | null;
        readonly current: boolean;
        readonly isDefault: boolean;
        readonly isRemote?: boolean | undefined;
        readonly remoteName?: string | undefined;
    }[];
    readonly nextCursor: number | null;
    readonly totalCount: number;
}, Error, import("@tanstack/react-query").InfiniteData<{
    readonly isRepo: boolean;
    readonly hasOriginRemote: boolean;
    readonly branches: readonly {
        readonly name: string;
        readonly worktreePath: string | null;
        readonly current: boolean;
        readonly isDefault: boolean;
        readonly isRemote?: boolean | undefined;
        readonly remoteName?: string | undefined;
    }[];
    readonly nextCursor: number | null;
    readonly totalCount: number;
}, unknown>, readonly ["git", "branches", string | null, "search", string], number>, "queryFn"> & {
    queryFn?: import("@tanstack/react-query").QueryFunction<{
        readonly isRepo: boolean;
        readonly hasOriginRemote: boolean;
        readonly branches: readonly {
            readonly name: string;
            readonly worktreePath: string | null;
            readonly current: boolean;
            readonly isDefault: boolean;
            readonly isRemote?: boolean | undefined;
            readonly remoteName?: string | undefined;
        }[];
        readonly nextCursor: number | null;
        readonly totalCount: number;
    }, readonly ["git", "branches", string | null, "search", string], number>;
} & {
    queryKey: readonly ["git", "branches", string | null, "search", string] & {
        [dataTagSymbol]: import("@tanstack/react-query").InfiniteData<{
            readonly isRepo: boolean;
            readonly hasOriginRemote: boolean;
            readonly branches: readonly {
                readonly name: string;
                readonly worktreePath: string | null;
                readonly current: boolean;
                readonly isDefault: boolean;
                readonly isRemote?: boolean | undefined;
                readonly remoteName?: string | undefined;
            }[];
            readonly nextCursor: number | null;
            readonly totalCount: number;
        }, unknown>;
        [dataTagErrorSymbol]: Error;
    };
};
export declare function gitResolvePullRequestQueryOptions(input: {
    cwd: string | null;
    reference: string | null;
}): import("@tanstack/react-query").OmitKeyof<import("@tanstack/react-query").UseQueryOptions<{
    readonly pullRequest: {
        readonly number: number;
        readonly url: string;
        readonly title: string;
        readonly baseBranch: string;
        readonly headBranch: string;
        readonly state: "open" | "closed" | "merged";
    };
}, Error, {
    readonly pullRequest: {
        readonly number: number;
        readonly url: string;
        readonly title: string;
        readonly baseBranch: string;
        readonly headBranch: string;
        readonly state: "open" | "closed" | "merged";
    };
}, readonly ["git", "pull-request", string | null, string | null]>, "queryFn"> & {
    queryFn?: import("@tanstack/react-query").QueryFunction<{
        readonly pullRequest: {
            readonly number: number;
            readonly url: string;
            readonly title: string;
            readonly baseBranch: string;
            readonly headBranch: string;
            readonly state: "open" | "closed" | "merged";
        };
    }, readonly ["git", "pull-request", string | null, string | null], never>;
} & {
    queryKey: readonly ["git", "pull-request", string | null, string | null] & {
        [dataTagSymbol]: {
            readonly pullRequest: {
                readonly number: number;
                readonly url: string;
                readonly title: string;
                readonly baseBranch: string;
                readonly headBranch: string;
                readonly state: "open" | "closed" | "merged";
            };
        };
        [dataTagErrorSymbol]: Error;
    };
};
export declare function gitInitMutationOptions(input: {
    cwd: string | null;
    queryClient: QueryClient;
}): import("@tanstack/react-query").WithRequired<import("@tanstack/react-query").UseMutationOptions<void, Error, void, unknown>, "mutationKey">;
export declare function gitCheckoutMutationOptions(input: {
    cwd: string | null;
    queryClient: QueryClient;
}): import("@tanstack/react-query").WithRequired<import("@tanstack/react-query").UseMutationOptions<{
    readonly branch: string | null;
}, Error, string, unknown>, "mutationKey">;
export declare function gitRunStackedActionMutationOptions(input: {
    cwd: string | null;
    queryClient: QueryClient;
}): import("@tanstack/react-query").WithRequired<import("@tanstack/react-query").UseMutationOptions<{
    readonly commit: {
        readonly status: "created" | "skipped_no_changes" | "skipped_not_requested";
        readonly subject?: string | undefined;
        readonly commitSha?: string | undefined;
    };
    readonly push: {
        readonly status: "skipped_not_requested" | "pushed" | "skipped_up_to_date";
        readonly branch?: string | undefined;
        readonly upstreamBranch?: string | undefined;
        readonly setUpstream?: boolean | undefined;
    };
    readonly branch: {
        readonly status: "created" | "skipped_not_requested";
        readonly name?: string | undefined;
    };
    readonly pr: {
        readonly status: "created" | "skipped_not_requested" | "opened_existing";
        readonly number?: number | undefined;
        readonly url?: string | undefined;
        readonly title?: string | undefined;
        readonly baseBranch?: string | undefined;
        readonly headBranch?: string | undefined;
    };
    readonly action: "commit" | "push" | "create_pr" | "commit_push" | "commit_push_pr";
    readonly toast: {
        readonly title: string;
        readonly cta: {
            readonly kind: "none";
        } | {
            readonly kind: "open_pr";
            readonly label: string;
            readonly url: string;
        } | {
            readonly kind: "run_action";
            readonly label: string;
            readonly action: {
                readonly kind: "commit" | "push" | "create_pr" | "commit_push" | "commit_push_pr";
            };
        };
        readonly description?: string | undefined;
    };
}, Error, {
    actionId: string;
    action: GitStackedAction;
    commitMessage?: string;
    featureBranch?: boolean;
    filePaths?: string[];
    onProgress?: (event: GitActionProgressEvent) => void;
}, unknown>, "mutationKey">;
export declare function gitPullMutationOptions(input: {
    cwd: string | null;
    queryClient: QueryClient;
}): import("@tanstack/react-query").WithRequired<import("@tanstack/react-query").UseMutationOptions<{
    readonly branch: string;
    readonly status: "skipped_up_to_date" | "pulled";
    readonly upstreamBranch: string | null;
}, Error, void, unknown>, "mutationKey">;
export declare function gitCreateWorktreeMutationOptions(input: {
    queryClient: QueryClient;
}): import("@tanstack/react-query").WithRequired<import("@tanstack/react-query").UseMutationOptions<{
    readonly worktree: {
        readonly branch: string;
        readonly path: string;
    };
}, Error, {
    readonly branch: string;
    readonly path: string | null;
    readonly cwd: string;
    readonly newBranch?: string | undefined;
}, unknown>, "mutationKey">;
export declare function gitRemoveWorktreeMutationOptions(input: {
    queryClient: QueryClient;
}): import("@tanstack/react-query").WithRequired<import("@tanstack/react-query").UseMutationOptions<void, Error, {
    readonly path: string;
    readonly cwd: string;
    readonly force?: boolean | undefined;
}, unknown>, "mutationKey">;
export declare function gitSuggestCommitMessageMutationOptions(input: {
    cwd: string | null;
}): import("@tanstack/react-query").WithRequired<import("@tanstack/react-query").UseMutationOptions<{
    readonly subject: string;
    readonly body: string;
}, Error, {
    filePaths?: string[];
}, unknown>, "mutationKey">;
export declare function gitPreparePullRequestThreadMutationOptions(input: {
    cwd: string | null;
    queryClient: QueryClient;
}): import("@tanstack/react-query").WithRequired<import("@tanstack/react-query").UseMutationOptions<{
    readonly branch: string;
    readonly worktreePath: string | null;
    readonly pullRequest: {
        readonly number: number;
        readonly url: string;
        readonly title: string;
        readonly baseBranch: string;
        readonly headBranch: string;
        readonly state: "open" | "closed" | "merged";
    };
}, Error, {
    reference: string;
    mode: "local" | "worktree";
    threadId?: ThreadId;
}, unknown>, "mutationKey">;
