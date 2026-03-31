import { Route as rootRouteImport } from "./routes/__root";
import { Route as SettingsRouteImport } from "./routes/settings";
import { Route as ChatRouteImport } from "./routes/_chat";
import { Route as ChatIndexRouteImport } from "./routes/_chat.index";
import { Route as SettingsGeneralRouteImport } from "./routes/settings.general";
import { Route as SettingsArchivedRouteImport } from "./routes/settings.archived";
import { Route as ChatThreadIdRouteImport } from "./routes/_chat.$threadId";
declare const SettingsRoute: import("@tanstack/router-core").Route<
  Register,
  import("@tanstack/react-router").RootRoute<
    Register,
    undefined,
    {
      queryClient: import("@tanstack/react-query").QueryClient;
    },
    import("@tanstack/router-core").AnyContext,
    import("@tanstack/router-core").AnyContext,
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
    location,
  }: import("@tanstack/router-core").BeforeLoadContextOptions<
    Register,
    import("@tanstack/react-router").RootRoute<
      Register,
      undefined,
      {
        queryClient: import("@tanstack/react-query").QueryClient;
      },
      import("@tanstack/router-core").AnyContext,
      import("@tanstack/router-core").AnyContext,
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
  >) => void,
  {},
  undefined,
  unknown,
  unknown,
  unknown,
  unknown,
  undefined
>;
declare const ChatRoute: import("@tanstack/router-core").Route<
  Register,
  import("@tanstack/react-router").RootRoute<
    Register,
    undefined,
    {
      queryClient: import("@tanstack/react-query").QueryClient;
    },
    import("@tanstack/router-core").AnyContext,
    import("@tanstack/router-core").AnyContext,
    {},
    undefined,
    unknown,
    unknown,
    unknown,
    unknown,
    undefined
  >,
  "",
  "/",
  "/_chat",
  "/_chat",
  undefined,
  import("@tanstack/router-core").ResolveParams<"">,
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
declare const ChatIndexRoute: import("@tanstack/router-core").Route<
  Register,
  import("@tanstack/router-core").Route<
    Register,
    import("@tanstack/react-router").RootRoute<
      Register,
      undefined,
      {
        queryClient: import("@tanstack/react-query").QueryClient;
      },
      import("@tanstack/router-core").AnyContext,
      import("@tanstack/router-core").AnyContext,
      {},
      undefined,
      unknown,
      unknown,
      unknown,
      unknown,
      undefined
    >,
    "",
    "/",
    "/_chat",
    "/_chat",
    undefined,
    import("@tanstack/router-core").ResolveParams<"">,
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
  >,
  "/",
  "/",
  "/_chat/",
  "/_chat/",
  undefined,
  import("@tanstack/router-core").ResolveParams<"/">,
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
declare const SettingsGeneralRoute: import("@tanstack/router-core").Route<
  Register,
  import("@tanstack/router-core").Route<
    Register,
    import("@tanstack/react-router").RootRoute<
      Register,
      undefined,
      {
        queryClient: import("@tanstack/react-query").QueryClient;
      },
      import("@tanstack/router-core").AnyContext,
      import("@tanstack/router-core").AnyContext,
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
      location,
    }: import("@tanstack/router-core").BeforeLoadContextOptions<
      Register,
      import("@tanstack/react-router").RootRoute<
        Register,
        undefined,
        {
          queryClient: import("@tanstack/react-query").QueryClient;
        },
        import("@tanstack/router-core").AnyContext,
        import("@tanstack/router-core").AnyContext,
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
    >) => void,
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
declare const SettingsArchivedRoute: import("@tanstack/router-core").Route<
  Register,
  import("@tanstack/router-core").Route<
    Register,
    import("@tanstack/react-router").RootRoute<
      Register,
      undefined,
      {
        queryClient: import("@tanstack/react-query").QueryClient;
      },
      import("@tanstack/router-core").AnyContext,
      import("@tanstack/router-core").AnyContext,
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
      location,
    }: import("@tanstack/router-core").BeforeLoadContextOptions<
      Register,
      import("@tanstack/react-router").RootRoute<
        Register,
        undefined,
        {
          queryClient: import("@tanstack/react-query").QueryClient;
        },
        import("@tanstack/router-core").AnyContext,
        import("@tanstack/router-core").AnyContext,
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
    >) => void,
    {},
    undefined,
    unknown,
    unknown,
    unknown,
    unknown,
    undefined
  >,
  "/archived",
  "/settings/archived",
  "/settings/archived",
  "/settings/archived",
  undefined,
  import("@tanstack/router-core").ResolveParams<"/archived">,
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
declare const ChatThreadIdRoute: import("@tanstack/router-core").Route<
  Register,
  import("@tanstack/router-core").Route<
    Register,
    import("@tanstack/react-router").RootRoute<
      Register,
      undefined,
      {
        queryClient: import("@tanstack/react-query").QueryClient;
      },
      import("@tanstack/router-core").AnyContext,
      import("@tanstack/router-core").AnyContext,
      {},
      undefined,
      unknown,
      unknown,
      unknown,
      unknown,
      undefined
    >,
    "",
    "/",
    "/_chat",
    "/_chat",
    undefined,
    import("@tanstack/router-core").ResolveParams<"">,
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
  >,
  "/$threadId",
  "/$threadId",
  "/_chat/$threadId",
  "/_chat/$threadId",
  (search: Record<string, unknown>) => import("./diffRouteSearch").DiffRouteSearch,
  import("@tanstack/router-core").ResolveParams<"/$threadId">,
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
export interface FileRoutesByFullPath {
  "/": typeof ChatIndexRoute;
  "/settings": typeof SettingsRouteWithChildren;
  "/$threadId": typeof ChatThreadIdRoute;
  "/settings/archived": typeof SettingsArchivedRoute;
  "/settings/general": typeof SettingsGeneralRoute;
}
export interface FileRoutesByTo {
  "/settings": typeof SettingsRouteWithChildren;
  "/$threadId": typeof ChatThreadIdRoute;
  "/settings/archived": typeof SettingsArchivedRoute;
  "/settings/general": typeof SettingsGeneralRoute;
  "/": typeof ChatIndexRoute;
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport;
  "/_chat": typeof ChatRouteWithChildren;
  "/settings": typeof SettingsRouteWithChildren;
  "/_chat/$threadId": typeof ChatThreadIdRoute;
  "/settings/archived": typeof SettingsArchivedRoute;
  "/settings/general": typeof SettingsGeneralRoute;
  "/_chat/": typeof ChatIndexRoute;
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths: "/" | "/settings" | "/$threadId" | "/settings/archived" | "/settings/general";
  fileRoutesByTo: FileRoutesByTo;
  to: "/settings" | "/$threadId" | "/settings/archived" | "/settings/general" | "/";
  id:
    | "__root__"
    | "/_chat"
    | "/settings"
    | "/_chat/$threadId"
    | "/settings/archived"
    | "/settings/general"
    | "/_chat/";
  fileRoutesById: FileRoutesById;
}
export interface RootRouteChildren {
  ChatRoute: typeof ChatRouteWithChildren;
  SettingsRoute: typeof SettingsRouteWithChildren;
}
declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/settings": {
      id: "/settings";
      path: "/settings";
      fullPath: "/settings";
      preLoaderRoute: typeof SettingsRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/_chat": {
      id: "/_chat";
      path: "";
      fullPath: "/";
      preLoaderRoute: typeof ChatRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/_chat/": {
      id: "/_chat/";
      path: "/";
      fullPath: "/";
      preLoaderRoute: typeof ChatIndexRouteImport;
      parentRoute: typeof ChatRoute;
    };
    "/settings/general": {
      id: "/settings/general";
      path: "/general";
      fullPath: "/settings/general";
      preLoaderRoute: typeof SettingsGeneralRouteImport;
      parentRoute: typeof SettingsRoute;
    };
    "/settings/archived": {
      id: "/settings/archived";
      path: "/archived";
      fullPath: "/settings/archived";
      preLoaderRoute: typeof SettingsArchivedRouteImport;
      parentRoute: typeof SettingsRoute;
    };
    "/_chat/$threadId": {
      id: "/_chat/$threadId";
      path: "/$threadId";
      fullPath: "/$threadId";
      preLoaderRoute: typeof ChatThreadIdRouteImport;
      parentRoute: typeof ChatRoute;
    };
  }
}
interface ChatRouteChildren {
  ChatThreadIdRoute: typeof ChatThreadIdRoute;
  ChatIndexRoute: typeof ChatIndexRoute;
}
declare const ChatRouteChildren: ChatRouteChildren;
declare const ChatRouteWithChildren: import("@tanstack/router-core").Route<
  import("@tanstack/react-router").Register,
  import("@tanstack/react-router").RootRoute<
    import("@tanstack/react-router").Register,
    undefined,
    {
      queryClient: import("@tanstack/react-query").QueryClient;
    },
    import("@tanstack/router-core").AnyContext,
    import("@tanstack/router-core").AnyContext,
    {},
    undefined,
    unknown,
    unknown,
    unknown,
    unknown,
    undefined
  >,
  "",
  "/",
  "/_chat",
  "/_chat",
  undefined,
  import("@tanstack/router-core").ResolveParams<"">,
  import("@tanstack/router-core").AnyContext,
  import("@tanstack/router-core").AnyContext,
  import("@tanstack/router-core").AnyContext,
  {},
  undefined,
  ChatRouteChildren,
  unknown,
  unknown,
  unknown,
  undefined
>;
interface SettingsRouteChildren {
  SettingsArchivedRoute: typeof SettingsArchivedRoute;
  SettingsGeneralRoute: typeof SettingsGeneralRoute;
}
declare const SettingsRouteChildren: SettingsRouteChildren;
declare const SettingsRouteWithChildren: import("@tanstack/router-core").Route<
  import("@tanstack/react-router").Register,
  import("@tanstack/react-router").RootRoute<
    import("@tanstack/react-router").Register,
    undefined,
    {
      queryClient: import("@tanstack/react-query").QueryClient;
    },
    import("@tanstack/router-core").AnyContext,
    import("@tanstack/router-core").AnyContext,
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
      import("@tanstack/router-core").AnyContext,
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
  >) => void,
  {},
  undefined,
  SettingsRouteChildren,
  unknown,
  unknown,
  unknown,
  undefined
>;
export declare const routeTree: import("@tanstack/router-core").Route<
  import("@tanstack/react-router").Register,
  any,
  "/",
  "/",
  string,
  "__root__",
  undefined,
  {},
  {
    queryClient: import("@tanstack/react-query").QueryClient;
  },
  import("@tanstack/router-core").AnyContext,
  import("@tanstack/router-core").AnyContext,
  {},
  undefined,
  RootRouteChildren,
  FileRouteTypes,
  unknown,
  unknown,
  undefined
>;
export {};
