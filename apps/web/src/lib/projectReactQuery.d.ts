import type { EnvironmentId } from "@t3tools/contracts";
export declare const projectQueryKeys: {
  all: readonly ["projects"];
  searchEntries: (
    environmentId: EnvironmentId | null,
    cwd: string | null,
    query: string,
    limit: number,
  ) => readonly [
    "projects",
    "search-entries",
    (string & import("effect/Brand").Brand<"EnvironmentId">) | null,
    string | null,
    string,
    number,
  ];
};
export declare function projectSearchEntriesQueryOptions(input: {
  environmentId: EnvironmentId | null;
  cwd: string | null;
  query: string;
  enabled?: boolean;
  limit?: number;
  staleTime?: number;
}): import("@tanstack/react-query").OmitKeyof<
  import("@tanstack/react-query").UseQueryOptions<
    {
      readonly entries: readonly {
        readonly path: string;
        readonly kind: "file" | "directory";
        readonly parentPath?: string | undefined;
      }[];
      readonly truncated: boolean;
    },
    Error,
    {
      readonly entries: readonly {
        readonly path: string;
        readonly kind: "file" | "directory";
        readonly parentPath?: string | undefined;
      }[];
      readonly truncated: boolean;
    },
    readonly [
      "projects",
      "search-entries",
      (string & import("effect/Brand").Brand<"EnvironmentId">) | null,
      string | null,
      string,
      number,
    ]
  >,
  "queryFn"
> & {
  queryFn?: import("@tanstack/react-query").QueryFunction<
    {
      readonly entries: readonly {
        readonly path: string;
        readonly kind: "file" | "directory";
        readonly parentPath?: string | undefined;
      }[];
      readonly truncated: boolean;
    },
    readonly [
      "projects",
      "search-entries",
      (string & import("effect/Brand").Brand<"EnvironmentId">) | null,
      string | null,
      string,
      number,
    ],
    never
  >;
} & {
  queryKey: readonly [
    "projects",
    "search-entries",
    (string & import("effect/Brand").Brand<"EnvironmentId">) | null,
    string | null,
    string,
    number,
  ] & {
    [dataTagSymbol]: {
      readonly entries: readonly {
        readonly path: string;
        readonly kind: "file" | "directory";
        readonly parentPath?: string | undefined;
      }[];
      readonly truncated: boolean;
    };
    [dataTagErrorSymbol]: Error;
  };
};
