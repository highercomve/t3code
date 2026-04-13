import { QueryClient } from "@tanstack/react-query";
import { RouterHistory } from "@tanstack/react-router";
export declare function getRouter(
  history: RouterHistory,
): import("@tanstack/router-core").RouterCore<
  import("@tanstack/router-core").Route<
    import("@tanstack/react-router").Register,
    any,
    "/",
    "/",
    string,
    "__root__",
    undefined,
    {},
    {
      queryClient: QueryClient;
    },
    import("@tanstack/router-core").AnyContext,
    () => Promise<{
      authGateState:
        | {
            status: "authenticated";
          }
        | {
            status: "requires-auth";
            auth: import("@t3tools/contracts").AuthSessionState["auth"];
            errorMessage?: string;
          };
    }>,
    {},
    undefined,
    import("./routeTree.gen").RootRouteChildren,
    import("./routeTree.gen").FileRouteTypes,
    unknown,
    unknown,
    undefined
  >,
  "never",
  false,
  RouterHistory,
  Record<string, any>
>;
export type AppRouter = ReturnType<typeof getRouter>;
declare module "@tanstack/react-router" {
  interface Register {
    router: AppRouter;
  }
}
