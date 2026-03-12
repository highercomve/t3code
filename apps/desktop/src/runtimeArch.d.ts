import type { DesktopRuntimeInfo } from "@t3tools/contracts";
interface ResolveDesktopRuntimeInfoInput {
  readonly platform: NodeJS.Platform;
  readonly processArch: string;
  readonly runningUnderArm64Translation: boolean;
}
export declare function resolveDesktopRuntimeInfo(
  input: ResolveDesktopRuntimeInfoInput,
): DesktopRuntimeInfo;
export declare function isArm64HostRunningIntelBuild(runtimeInfo: DesktopRuntimeInfo): boolean;
export {};
