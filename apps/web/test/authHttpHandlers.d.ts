import { type ServerAuthDescriptor } from "@t3tools/contracts";
export declare function createAuthenticatedSessionHandlers(
  getAuthDescriptor: () => ServerAuthDescriptor,
): readonly [import("msw").HttpHandler, import("msw").HttpHandler, import("msw").HttpHandler];
