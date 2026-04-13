import type { EnvironmentId, EnvironmentApi } from "@t3tools/contracts";
import type { WsRpcClient } from "./rpc/wsRpcClient";
export declare function createEnvironmentApi(rpcClient: WsRpcClient): EnvironmentApi;
export declare function readEnvironmentApi(
  environmentId: EnvironmentId,
): EnvironmentApi | undefined;
export declare function ensureEnvironmentApi(environmentId: EnvironmentId): EnvironmentApi;
