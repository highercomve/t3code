export declare const Route: import("@tanstack/router-core").Route<
  import("@tanstack/react-router").Register,
  import("@tanstack/router-core").Route<
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
    "/settings",
    "/settings",
    "/settings",
    "/settings",
    undefined,
    import("@tanstack/router-core").ResolveParams<"/settings">,
    import("@tanstack/router-core").AnyContext,
    import("@tanstack/router-core").AnyContext,
    ({
      context,
      location,
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
      import("@tanstack/router-core").ResolveParams<"/settings">,
      import("@tanstack/router-core").AnyContext,
      import("@tanstack/router-core").AnyContext,
      "/settings",
      unknown,
      undefined
    >) => Promise<void>,
    {},
    undefined,
    unknown,
    unknown,
    unknown,
    unknown,
    undefined
  >,
  "/general",
  "/settings/general",
  "/settings/general",
  "/settings/general",
  undefined,
  import("@tanstack/router-core").ResolveParams<"/general">,
  import("@tanstack/router-core").AnyContext,
  import("@tanstack/router-core").AnyContext,
  import("@tanstack/router-core").AnyContext,
  {},
  undefined,
  unknown,
  unknown,
  unknown,
  unknown,
  undefined
>;
