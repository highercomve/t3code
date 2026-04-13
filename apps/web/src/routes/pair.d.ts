export declare const Route: import("@tanstack/router-core").Route<
  import("@tanstack/react-router").Register,
  import("@tanstack/react-router").RootRoute<
    import("@tanstack/react-router").Register,
    undefined,
    {
      queryClient: import("@tanstack/react-query").QueryClient;
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
  >,
  "/pair",
  "/pair",
  "/pair",
  "/pair",
  undefined,
  import("@tanstack/router-core").ResolveParams<"/pair">,
  import("@tanstack/router-core").AnyContext,
  import("@tanstack/router-core").AnyContext,
  ({
    context,
  }: import("@tanstack/router-core").BeforeLoadContextOptions<
    import("@tanstack/react-router").Register,
    import("@tanstack/react-router").RootRoute<
      import("@tanstack/react-router").Register,
      undefined,
      {
        queryClient: import("@tanstack/react-query").QueryClient;
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
    >,
    undefined,
    import("@tanstack/router-core").ResolveParams<"/pair">,
    import("@tanstack/router-core").AnyContext,
    import("@tanstack/router-core").AnyContext,
    "/pair",
    unknown,
    undefined
  >) => Promise<{
    authGateState: {
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
