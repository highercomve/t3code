export declare const projectQueryKeys: {
  all: readonly ["projects"];
  searchEntries: (
    cwd: string | null,
    query: string,
    limit: number,
  ) => readonly ["projects", "search-entries", string | null, string, number];
};
export declare function projectSearchEntriesQueryOptions(input: {
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
        readonly kind: "directory" | "file";
        readonly parentPath?: string | undefined;
      }[];
      readonly truncated: boolean;
    },
    Error,
    {
      readonly entries: readonly {
        readonly path: string;
        readonly kind: "directory" | "file";
        readonly parentPath?: string | undefined;
      }[];
      readonly truncated: boolean;
    },
    readonly ["projects", "search-entries", string | null, string, number]
  >,
  "queryFn"
> & {
  queryFn?: import("@tanstack/react-query").QueryFunction<
    {
      readonly entries: readonly {
        readonly path: string;
        readonly kind: "directory" | "file";
        readonly parentPath?: string | undefined;
      }[];
      readonly truncated: boolean;
    },
    readonly ["projects", "search-entries", string | null, string, number],
    never
  >;
} & {
  queryKey: readonly ["projects", "search-entries", string | null, string, number] & {
    [dataTagSymbol]: {
      readonly entries: readonly {
        readonly path: string;
        readonly kind: "directory" | "file";
        readonly parentPath?: string | undefined;
      }[];
      readonly truncated: boolean;
    };
    [dataTagErrorSymbol]: Error;
  };
};
