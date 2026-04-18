import {
  type EnvironmentId,
  type GitActionProgressEvent,
  type GitStackedAction,
  type ThreadId,
} from "@t3tools/contracts";
import { type QueryClient } from "@tanstack/react-query";
export declare const gitQueryKeys: {
  all: readonly ["git"];
  branches: (
    environmentId: EnvironmentId | null,
    cwd: string | null,
  ) => readonly [
    "git",
    "branches",
    (string & import("effect/Brand").Brand<"EnvironmentId">) | null,
    string | null,
  ];
  branchSearch: (
    environmentId: EnvironmentId | null,
    cwd: string | null,
    query: string,
  ) => readonly [
    "git",
    "branches",
    (string & import("effect/Brand").Brand<"EnvironmentId">) | null,
    string | null,
    "search",
    string,
  ];
};
export declare const gitMutationKeys: {
  init: (
    environmentId: EnvironmentId | null,
    cwd: string | null,
  ) => readonly [
    "git",
    "mutation",
    "init",
    (string & import("effect/Brand").Brand<"EnvironmentId">) | null,
    string | null,
  ];
  checkout: (
    environmentId: EnvironmentId | null,
    cwd: string | null,
  ) => readonly [
    "git",
    "mutation",
    "checkout",
    (string & import("effect/Brand").Brand<"EnvironmentId">) | null,
    string | null,
  ];
  runStackedAction: (
    environmentId: EnvironmentId | null,
    cwd: string | null,
  ) => readonly [
    "git",
    "mutation",
    "run-stacked-action",
    (string & import("effect/Brand").Brand<"EnvironmentId">) | null,
    string | null,
  ];
  pull: (
    environmentId: EnvironmentId | null,
    cwd: string | null,
  ) => readonly [
    "git",
    "mutation",
    "pull",
    (string & import("effect/Brand").Brand<"EnvironmentId">) | null,
    string | null,
  ];
  preparePullRequestThread: (
    environmentId: EnvironmentId | null,
    cwd: string | null,
  ) => readonly [
    "git",
    "mutation",
    "prepare-pull-request-thread",
    (string & import("effect/Brand").Brand<"EnvironmentId">) | null,
    string | null,
  ];
  suggestCommitMessage: (
    cwd: string | null,
  ) => readonly ["git", "mutation", "suggest-commit-message", string | null];
};
export declare function invalidateGitQueries(
  queryClient: QueryClient,
  input?: {
    environmentId?: EnvironmentId | null;
    cwd?: string | null;
  },
): Promise<void>;
export declare function gitBranchSearchInfiniteQueryOptions(input: {
  environmentId: EnvironmentId | null;
  cwd: string | null;
  query: string;
  enabled?: boolean;
}): import("@tanstack/react-query").OmitKeyof<
  import("@tanstack/react-query").UseInfiniteQueryOptions<
    {
      readonly isRepo: boolean;
      readonly hasOriginRemote: boolean;
      readonly branches: readonly {
        readonly isDefault: boolean;
        readonly name: string;
        readonly worktreePath: string | null;
        readonly current: boolean;
        readonly remoteName?: string | undefined;
        readonly isRemote?: boolean | undefined;
      }[];
      readonly nextCursor: number | null;
      readonly totalCount: number;
    },
    Error,
    import("@tanstack/react-query").InfiniteData<
      {
        readonly isRepo: boolean;
        readonly hasOriginRemote: boolean;
        readonly branches: readonly {
          readonly isDefault: boolean;
          readonly name: string;
          readonly worktreePath: string | null;
          readonly current: boolean;
          readonly remoteName?: string | undefined;
          readonly isRemote?: boolean | undefined;
        }[];
        readonly nextCursor: number | null;
        readonly totalCount: number;
      },
      unknown
    >,
    readonly [
      "git",
      "branches",
      (string & import("effect/Brand").Brand<"EnvironmentId">) | null,
      string | null,
      "search",
      string,
    ],
    number
  >,
  "queryFn"
> & {
  queryFn?: import("@tanstack/react-query").QueryFunction<
    {
      readonly isRepo: boolean;
      readonly hasOriginRemote: boolean;
      readonly branches: readonly {
        readonly isDefault: boolean;
        readonly name: string;
        readonly worktreePath: string | null;
        readonly current: boolean;
        readonly remoteName?: string | undefined;
        readonly isRemote?: boolean | undefined;
      }[];
      readonly nextCursor: number | null;
      readonly totalCount: number;
    },
    readonly [
      "git",
      "branches",
      (string & import("effect/Brand").Brand<"EnvironmentId">) | null,
      string | null,
      "search",
      string,
    ],
    number
  >;
} & {
  queryKey: readonly [
    "git",
    "branches",
    (string & import("effect/Brand").Brand<"EnvironmentId">) | null,
    string | null,
    "search",
    string,
  ] & {
    [dataTagSymbol]: import("@tanstack/react-query").InfiniteData<
      {
        readonly isRepo: boolean;
        readonly hasOriginRemote: boolean;
        readonly branches: readonly {
          readonly isDefault: boolean;
          readonly name: string;
          readonly worktreePath: string | null;
          readonly current: boolean;
          readonly remoteName?: string | undefined;
          readonly isRemote?: boolean | undefined;
        }[];
        readonly nextCursor: number | null;
        readonly totalCount: number;
      },
      unknown
    >;
    [dataTagErrorSymbol]: Error;
  };
};
export declare function gitResolvePullRequestQueryOptions(input: {
  environmentId: EnvironmentId | null;
  cwd: string | null;
  reference: string | null;
}): import("@tanstack/react-query").OmitKeyof<
  import("@tanstack/react-query").UseQueryOptions<
    {
      readonly pullRequest: {
        readonly number: number;
        readonly title: string;
        readonly state: "open" | "closed" | "merged";
        readonly baseBranch: string;
        readonly url: string;
        readonly headBranch: string;
      };
    },
    Error,
    {
      readonly pullRequest: {
        readonly number: number;
        readonly title: string;
        readonly state: "open" | "closed" | "merged";
        readonly baseBranch: string;
        readonly url: string;
        readonly headBranch: string;
      };
    },
    readonly [
      "git",
      "pull-request",
      (string & import("effect/Brand").Brand<"EnvironmentId">) | null,
      string | null,
      string | null,
    ]
  >,
  "queryFn"
> & {
  queryFn?: import("@tanstack/react-query").QueryFunction<
    {
      readonly pullRequest: {
        readonly number: number;
        readonly title: string;
        readonly state: "open" | "closed" | "merged";
        readonly baseBranch: string;
        readonly url: string;
        readonly headBranch: string;
      };
    },
    readonly [
      "git",
      "pull-request",
      (string & import("effect/Brand").Brand<"EnvironmentId">) | null,
      string | null,
      string | null,
    ],
    never
  >;
} & {
  queryKey: readonly [
    "git",
    "pull-request",
    (string & import("effect/Brand").Brand<"EnvironmentId">) | null,
    string | null,
    string | null,
  ] & {
    [dataTagSymbol]: {
      readonly pullRequest: {
        readonly number: number;
        readonly title: string;
        readonly state: "open" | "closed" | "merged";
        readonly baseBranch: string;
        readonly url: string;
        readonly headBranch: string;
      };
    };
    [dataTagErrorSymbol]: Error;
  };
};
export declare function gitInitMutationOptions(input: {
  environmentId: EnvironmentId | null;
  cwd: string | null;
  queryClient: QueryClient;
}): import("@tanstack/react-query").WithRequired<
  import("@tanstack/react-query").UseMutationOptions<void, Error, void, unknown>,
  "mutationKey"
>;
export declare function gitCheckoutMutationOptions(input: {
  environmentId: EnvironmentId | null;
  cwd: string | null;
  queryClient: QueryClient;
}): import("@tanstack/react-query").WithRequired<
  import("@tanstack/react-query").UseMutationOptions<
    {
      readonly branch: string | null;
    },
    Error,
    string,
    unknown
  >,
  "mutationKey"
>;
export declare function gitRunStackedActionMutationOptions(input: {
  environmentId: EnvironmentId | null;
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
      readonly commit: {
        readonly status: "created" | "skipped_no_changes" | "skipped_not_requested";
        readonly subject?: string | undefined;
        readonly commitSha?: string | undefined;
      };
      readonly pr: {
        readonly status: "created" | "skipped_not_requested" | "opened_existing";
        readonly number?: number | undefined;
        readonly title?: string | undefined;
        readonly baseBranch?: string | undefined;
        readonly url?: string | undefined;
        readonly headBranch?: string | undefined;
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
  environmentId: EnvironmentId | null;
  cwd: string | null;
  queryClient: QueryClient;
}): import("@tanstack/react-query").WithRequired<
  import("@tanstack/react-query").UseMutationOptions<
    {
      readonly status: "skipped_up_to_date" | "pulled";
      readonly branch: string;
      readonly upstreamBranch: string | null;
    },
    Error,
    void,
    unknown
  >,
  "mutationKey"
>;
export declare function gitCreateWorktreeMutationOptions(input: {
  environmentId: EnvironmentId | null;
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
      readonly path: string | null;
      readonly cwd: string;
      readonly branch: string;
      readonly newBranch?: string | undefined;
    },
    unknown
  >,
  "mutationKey"
>;
export declare function gitRemoveWorktreeMutationOptions(input: {
  environmentId: EnvironmentId | null;
  queryClient: QueryClient;
}): import("@tanstack/react-query").WithRequired<
  import("@tanstack/react-query").UseMutationOptions<
    void,
    Error,
    {
      readonly path: string;
      readonly cwd: string;
      readonly force?: boolean | undefined;
    },
    unknown
  >,
  "mutationKey"
>;
export declare function gitSuggestCommitMessageMutationOptions(input: {
  environmentId: EnvironmentId | null;
  cwd: string | null;
}): import("@tanstack/react-query").WithRequired<
  import("@tanstack/react-query").UseMutationOptions<
    {
      readonly subject: string;
      readonly body: string;
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
  environmentId: EnvironmentId | null;
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
        readonly baseBranch: string;
        readonly url: string;
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
