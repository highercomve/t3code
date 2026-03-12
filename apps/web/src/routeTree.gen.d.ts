import { Route as rootRouteImport } from "./routes/__root";
import { Route as ChatRouteImport } from "./routes/_chat";
import { Route as ChatIndexRouteImport } from "./routes/_chat.index";
import { Route as ChatSettingsRouteImport } from "./routes/_chat.settings";
import { Route as ChatThreadIdRouteImport } from "./routes/_chat.$threadId";
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
declare const ChatSettingsRoute: import("@tanstack/router-core").Route<
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
  "/settings",
  "/settings",
  "/_chat/settings",
  "/_chat/settings",
  undefined,
  import("@tanstack/router-core").ResolveParams<"/settings">,
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
  "/$threadId": typeof ChatThreadIdRoute;
  "/settings": typeof ChatSettingsRoute;
}
export interface FileRoutesByTo {
  "/$threadId": typeof ChatThreadIdRoute;
  "/settings": typeof ChatSettingsRoute;
  "/": typeof ChatIndexRoute;
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport;
  "/_chat": typeof ChatRouteWithChildren;
  "/_chat/$threadId": typeof ChatThreadIdRoute;
  "/_chat/settings": typeof ChatSettingsRoute;
  "/_chat/": typeof ChatIndexRoute;
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths: "/" | "/$threadId" | "/settings";
  fileRoutesByTo: FileRoutesByTo;
  to: "/$threadId" | "/settings" | "/";
  id: "__root__" | "/_chat" | "/_chat/$threadId" | "/_chat/settings" | "/_chat/";
  fileRoutesById: FileRoutesById;
}
export interface RootRouteChildren {
  ChatRoute: typeof ChatRouteWithChildren;
}
declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
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
    "/_chat/settings": {
      id: "/_chat/settings";
      path: "/settings";
      fullPath: "/settings";
      preLoaderRoute: typeof ChatSettingsRouteImport;
      parentRoute: typeof ChatRoute;
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
  ChatSettingsRoute: typeof ChatSettingsRoute;
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
