import type { NetworkInterfaceInfo } from "node:os";
import type { DesktopServerExposureMode } from "@t3tools/contracts";
export interface DesktopServerExposure {
  readonly mode: DesktopServerExposureMode;
  readonly bindHost: string;
  readonly localHttpUrl: string;
  readonly localWsUrl: string;
  readonly endpointUrl: string | null;
  readonly advertisedHost: string | null;
}
export declare function resolveLanAdvertisedHost(
  networkInterfaces: NodeJS.Dict<NetworkInterfaceInfo[]>,
  explicitHost: string | undefined,
): string | null;
export declare function resolveDesktopServerExposure(input: {
  readonly mode: DesktopServerExposureMode;
  readonly port: number;
  readonly networkInterfaces: NodeJS.Dict<NetworkInterfaceInfo[]>;
  readonly advertisedHostOverride?: string;
}): DesktopServerExposure;
