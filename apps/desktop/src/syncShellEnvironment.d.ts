import { ShellEnvironmentReader } from "@t3tools/shared/shell";
export declare function syncShellEnvironment(
  env?: NodeJS.ProcessEnv,
  options?: {
    platform?: NodeJS.Platform;
    readEnvironment?: ShellEnvironmentReader;
  },
): void;
