import type { LocalApi } from "@t3tools/contracts";
import { type WsRpcClient } from "./rpc/wsRpcClient";
export declare function createLocalApi(rpcClient: WsRpcClient): LocalApi;
export declare function readLocalApi(): LocalApi | undefined;
export declare function ensureLocalApi(): LocalApi;
export declare function __resetLocalApiForTests(): Promise<void>;
