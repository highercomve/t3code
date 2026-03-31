import { type QueryClient } from "@tanstack/react-query";
import type { DesktopUpdateState } from "@t3tools/contracts";
export declare const desktopUpdateQueryKeys: {
  all: readonly ["desktop", "update"];
  state: () => readonly ["desktop", "update", "state"];
};
export declare const setDesktopUpdateStateQueryData: (
  queryClient: QueryClient,
  state: DesktopUpdateState | null,
) => unknown;
export declare function desktopUpdateStateQueryOptions(): import("@tanstack/react-query").OmitKeyof<
  import("@tanstack/react-query").UseQueryOptions<
    DesktopUpdateState | null,
    Error,
    DesktopUpdateState | null,
    readonly ["desktop", "update", "state"]
  >,
  "queryFn"
> & {
  queryFn?: import("@tanstack/react-query").QueryFunction<
    DesktopUpdateState | null,
    readonly ["desktop", "update", "state"],
    never
  >;
} & {
  queryKey: readonly ["desktop", "update", "state"] & {
    [dataTagSymbol]: DesktopUpdateState | null;
    [dataTagErrorSymbol]: Error;
  };
};
export declare function useDesktopUpdateState(): import("@tanstack/react-query").UseQueryResult<
  DesktopUpdateState | null,
  Error
>;
