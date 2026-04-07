import type { NativeApi } from "@t3tools/contracts";
export declare function readNativeApi(): NativeApi | undefined;
export declare function ensureNativeApi(): NativeApi;
export declare function __resetNativeApiForTests(): Promise<void>;
