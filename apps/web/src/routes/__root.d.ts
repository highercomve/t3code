import { QueryClient } from "@tanstack/react-query";
export declare const Route: import("@tanstack/react-router").RootRoute<
  import("@tanstack/react-router").Register,
  undefined,
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
  unknown,
  unknown,
  unknown,
  unknown,
  undefined
>;
