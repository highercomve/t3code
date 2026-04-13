import type { KnownEnvironment } from "@t3tools/client-runtime";
export interface PrimaryEnvironmentTarget {
  readonly source: KnownEnvironment["source"];
  readonly target: KnownEnvironment["target"];
}
export declare function isLoopbackHostname(hostname: string): boolean;
export declare function resolvePrimaryEnvironmentHttpUrl(
  pathname: string,
  searchParams?: Record<string, string>,
): string;
export declare function readPrimaryEnvironmentTarget(): PrimaryEnvironmentTarget | null;
