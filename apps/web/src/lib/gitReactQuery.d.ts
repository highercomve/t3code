import {
  type GitActionProgressEvent,
  type GitStackedAction,
  type ThreadId,
} from "@t3tools/contracts";
import { type QueryClient } from "@tanstack/react-query";
export declare const gitQueryKeys: {
  all: readonly ["git"];
  status: (cwd: string | null) => readonly ["git", "status", string | null];
  branches: (cwd: string | null) => readonly ["git", "branches", string | null];
  branchSearch: (
    cwd: string | null,
    query: string,
  ) => readonly ["git", "branches", string | null, "search", string];
};
export declare const gitMutationKeys: {
  init: (cwd: string | null) => readonly ["git", "mutation", "init", string | null];
  checkout: (cwd: string | null) => readonly ["git", "mutation", "checkout", string | null];
  runStackedAction: (
    cwd: string | null,
  ) => readonly ["git", "mutation", "run-stacked-action", string | null];
  pull: (cwd: string | null) => readonly ["git", "mutation", "pull", string | null];
  preparePullRequestThread: (
    cwd: string | null,
  ) => readonly ["git", "mutation", "prepare-pull-request-thread", string | null];
  suggestCommitMessage: (
    cwd: string | null,
  ) => readonly ["git", "mutation", "suggest-commit-message", string | null];
};
export declare function invalidateGitQueries(
  queryClient: QueryClient,
  input?: {
    cwd?: string | null;
  },
): Promise<void> | Promise<[void, void]>;
export declare function invalidateGitStatusQuery(
  queryClient: QueryClient,
  cwd: string | null,
): Promise<void>;
export declare function gitStatusQueryOptions(
  cwd: string | null,
): import("@tanstack/react-query").OmitKeyof<
  import("@tanstack/react-query").UseQueryOptions<
    {
      readonly branch: string | null;
      readonly workingTree: {
        readonly files: readonly {
          readonly path: string;
          readonly deletions: number;
          readonly insertions: number;
        }[];
        readonly deletions: number;
        readonly insertions: number;
      };
      readonly pr: {
        readonly number: number;
        readonly title: string;
        readonly state: "open" | "closed" | "merged";
        readonly url: string;
        readonly baseBranch: string;
        readonly headBranch: string;
      } | null;
      readonly isRepo: boolean;
      readonly hasOriginRemote: boolean;
      readonly isDefaultBranch: boolean;
      readonly hasWorkingTreeChanges: boolean;
      readonly hasUpstream: boolean;
      readonly aheadCount: number;
      readonly behindCount: number;
    },
    Error,
    {
      readonly branch: string | null;
      readonly workingTree: {
        readonly files: readonly {
          readonly path: string;
          readonly deletions: number;
          readonly insertions: number;
        }[];
        readonly deletions: number;
        readonly insertions: number;
      };
      readonly pr: {
        readonly number: number;
        readonly title: string;
        readonly state: "open" | "closed" | "merged";
        readonly url: string;
        readonly baseBranch: string;
        readonly headBranch: string;
      } | null;
      readonly isRepo: boolean;
      readonly hasOriginRemote: boolean;
      readonly isDefaultBranch: boolean;
      readonly hasWorkingTreeChanges: boolean;
      readonly hasUpstream: boolean;
      readonly aheadCount: number;
      readonly behindCount: number;
    },
    readonly ["git", "status", string | null]
  >,
  "queryFn"
> & {
  queryFn?: import("@tanstack/react-query").QueryFunction<
    {
      readonly branch: string | null;
      readonly workingTree: {
        readonly files: readonly {
          readonly path: string;
          readonly deletions: number;
          readonly insertions: number;
        }[];
        readonly deletions: number;
        readonly insertions: number;
      };
      readonly pr: {
        readonly number: number;
        readonly title: string;
        readonly state: "open" | "closed" | "merged";
        readonly url: string;
        readonly baseBranch: string;
        readonly headBranch: string;
      } | null;
      readonly isRepo: boolean;
      readonly hasOriginRemote: boolean;
      readonly isDefaultBranch: boolean;
      readonly hasWorkingTreeChanges: boolean;
      readonly hasUpstream: boolean;
      readonly aheadCount: number;
      readonly behindCount: number;
    },
    readonly ["git", "status", string | null],
    never
  >;
} & {
  queryKey: readonly ["git", "status", string | null] & {
    [dataTagSymbol]: {
      readonly branch: string | null;
      readonly workingTree: {
        readonly files: readonly {
          readonly path: string;
          readonly deletions: number;
          readonly insertions: number;
        }[];
        readonly deletions: number;
        readonly insertions: number;
      };
      readonly pr: {
        readonly number: number;
        readonly title: string;
        readonly state: "open" | "closed" | "merged";
        readonly url: string;
        readonly baseBranch: string;
        readonly headBranch: string;
      } | null;
      readonly isRepo: boolean;
      readonly hasOriginRemote: boolean;
      readonly isDefaultBranch: boolean;
      readonly hasWorkingTreeChanges: boolean;
      readonly hasUpstream: boolean;
      readonly aheadCount: number;
      readonly behindCount: number;
    };
    [dataTagErrorSymbol]: Error;
  };
};
export declare function gitBranchSearchInfiniteQueryOptions(input: {
  cwd: string | null;
  query: string;
  enabled?: boolean;
}): import("@tanstack/react-query").OmitKeyof<
  import("@tanstack/react-query").UseInfiniteQueryOptions<
    {
      readonly branches: readonly {
        readonly name: string;
        readonly worktreePath: string | null;
        readonly current: boolean;
        readonly isDefault: boolean;
        readonly isRemote?: boolean | undefined;
        readonly remoteName?: string | undefined;
      }[];
      readonly isRepo: boolean;
      readonly hasOriginRemote: boolean;
      readonly nextCursor: number | null;
      readonly totalCount: number;
    },
    Error,
    import("@tanstack/react-query").InfiniteData<
      {
        readonly branches: readonly {
          readonly name: string;
          readonly worktreePath: string | null;
          readonly current: boolean;
          readonly isDefault: boolean;
          readonly isRemote?: boolean | undefined;
          readonly remoteName?: string | undefined;
        }[];
        readonly isRepo: boolean;
        readonly hasOriginRemote: boolean;
        readonly nextCursor: number | null;
        readonly totalCount: number;
      },
      unknown
    >,
    readonly ["git", "branches", string | null, "search", string],
    number
  >,
  "queryFn"
> & {
  queryFn?: import("@tanstack/react-query").QueryFunction<
    {
      readonly branches: readonly {
        readonly name: string;
        readonly worktreePath: string | null;
        readonly current: boolean;
        readonly isDefault: boolean;
        readonly isRemote?: boolean | undefined;
        readonly remoteName?: string | undefined;
      }[];
      readonly isRepo: boolean;
      readonly hasOriginRemote: boolean;
      readonly nextCursor: number | null;
      readonly totalCount: number;
    },
    readonly ["git", "branches", string | null, "search", string],
    number
  >;
} & {
  queryKey: readonly ["git", "branches", string | null, "search", string] & {
    [dataTagSymbol]: import("@tanstack/react-query").InfiniteData<
      {
        readonly branches: readonly {
          readonly name: string;
          readonly worktreePath: string | null;
          readonly current: boolean;
          readonly isDefault: boolean;
          readonly isRemote?: boolean | undefined;
          readonly remoteName?: string | undefined;
        }[];
        readonly isRepo: boolean;
        readonly hasOriginRemote: boolean;
        readonly nextCursor: number | null;
        readonly totalCount: number;
      },
      unknown
    >;
    [dataTagErrorSymbol]: Error;
  };
};
export declare function gitResolvePullRequestQueryOptions(input: {
  cwd: string | null;
  reference: string | null;
}): import("@tanstack/react-query").OmitKeyof<
  import("@tanstack/react-query").UseQueryOptions<
    {
      readonly pullRequest: {
        readonly number: number;
        readonly title: string;
        readonly state: "open" | "closed" | "merged";
        readonly url: string;
        readonly baseBranch: string;
        readonly headBranch: string;
      };
    },
    Error,
    {
      readonly pullRequest: {
        readonly number: number;
        readonly title: string;
        readonly state: "open" | "closed" | "merged";
        readonly url: string;
        readonly baseBranch: string;
        readonly headBranch: string;
      };
    },
    readonly ["git", "pull-request", string | null, string | null]
  >,
  "queryFn"
> & {
  queryFn?: import("@tanstack/react-query").QueryFunction<
    {
      readonly pullRequest: {
        readonly number: number;
        readonly title: string;
        readonly state: "open" | "closed" | "merged";
        readonly url: string;
        readonly baseBranch: string;
        readonly headBranch: string;
      };
    },
    readonly ["git", "pull-request", string | null, string | null],
    never
  >;
} & {
  queryKey: readonly ["git", "pull-request", string | null, string | null] & {
    [dataTagSymbol]: {
      readonly pullRequest: {
        readonly number: number;
        readonly title: string;
        readonly state: "open" | "closed" | "merged";
        readonly url: string;
        readonly baseBranch: string;
        readonly headBranch: string;
      };
    };
    [dataTagErrorSymbol]: Error;
  };
};
export declare function gitInitMutationOptions(input: {
  cwd: string | null;
  queryClient: QueryClient;
}): import("@tanstack/react-query").WithRequired<
  import("@tanstack/react-query").UseMutationOptions<void, Error, void, unknown>,
  "mutationKey"
>;
export declare function gitCheckoutMutationOptions(input: {
  cwd: string | null;
  queryClient: QueryClient;
}): import("@tanstack/react-query").WithRequired<
  import("@tanstack/react-query").UseMutationOptions<void, Error, string, unknown>,
  "mutationKey"
>;
export declare function gitRunStackedActionMutationOptions(input: {
  cwd: string | null;
  queryClient: QueryClient;
}): import("@tanstack/react-query").WithRequired<
  import("@tanstack/react-query").UseMutationOptions<
    {
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
        readonly title?: string | undefined;
        readonly url?: string | undefined;
        readonly baseBranch?: string | undefined;
        readonly headBranch?: string | undefined;
      };
      readonly commit: {
        readonly status: "created" | "skipped_not_requested" | "skipped_no_changes";
        readonly commitSha?: string | undefined;
        readonly subject?: string | undefined;
      };
      readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
      readonly toast: {
        readonly title: string;
        readonly cta:
          | {
              readonly kind: "none";
            }
          | {
              readonly label: string;
              readonly kind: "open_pr";
              readonly url: string;
            }
          | {
              readonly label: string;
              readonly kind: "run_action";
              readonly action: {
                readonly kind: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
              };
            };
        readonly description?: string | undefined;
      };
    },
    Error,
    {
      actionId: string;
      action: GitStackedAction;
      commitMessage?: string;
      featureBranch?: boolean;
      filePaths?: string[];
      onProgress?: (event: GitActionProgressEvent) => void;
    },
    unknown
  >,
  "mutationKey"
>;
export declare function gitPullMutationOptions(input: {
  cwd: string | null;
  queryClient: QueryClient;
}): import("@tanstack/react-query").WithRequired<
  import("@tanstack/react-query").UseMutationOptions<
    {
      readonly branch: string;
      readonly status: "skipped_up_to_date" | "pulled";
      readonly upstreamBranch: string | null;
    },
    Error,
    void,
    unknown
  >,
  "mutationKey"
>;
export declare function gitCreateWorktreeMutationOptions(input: {
  queryClient: QueryClient;
}): import("@tanstack/react-query").WithRequired<
  import("@tanstack/react-query").UseMutationOptions<
    {
      readonly worktree: {
        readonly path: string;
        readonly branch: string;
      };
    },
    Error,
    {
      cwd: string;
      branch: string;
      newBranch: string;
      path?: string | null;
    },
    unknown
  >,
  "mutationKey"
>;
export declare function gitRemoveWorktreeMutationOptions(input: {
  queryClient: QueryClient;
}): import("@tanstack/react-query").WithRequired<
  import("@tanstack/react-query").UseMutationOptions<
    void,
    Error,
    {
      cwd: string;
      path: string;
      force?: boolean;
    },
    unknown
  >,
  "mutationKey"
>;
export declare function gitSuggestCommitMessageMutationOptions(input: {
  cwd: string | null;
}): import("@tanstack/react-query").WithRequired<
  import("@tanstack/react-query").UseMutationOptions<
    {
      readonly body: string;
      readonly subject: string;
    },
    Error,
    {
      filePaths?: string[];
    },
    unknown
  >,
  "mutationKey"
>;
export declare function gitPreparePullRequestThreadMutationOptions(input: {
  cwd: string | null;
  queryClient: QueryClient;
}): import("@tanstack/react-query").WithRequired<
  import("@tanstack/react-query").UseMutationOptions<
    {
      readonly branch: string;
      readonly worktreePath: string | null;
      readonly pullRequest: {
        readonly number: number;
        readonly title: string;
        readonly state: "open" | "closed" | "merged";
        readonly url: string;
        readonly baseBranch: string;
        readonly headBranch: string;
      };
    },
    Error,
    {
      reference: string;
      mode: "local" | "worktree";
      threadId?: ThreadId;
    },
    unknown
  >,
  "mutationKey"
>;
