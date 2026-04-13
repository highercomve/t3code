import { type KnownEnvironment } from "@t3tools/client-runtime";
import type { EnvironmentId, ExecutionEnvironmentDescriptor } from "@t3tools/contracts";
export declare function readPrimaryEnvironmentDescriptor(): ExecutionEnvironmentDescriptor | null;
export declare function usePrimaryEnvironmentId(): EnvironmentId | null;
export declare function writePrimaryEnvironmentDescriptor(
  descriptor: ExecutionEnvironmentDescriptor | null,
): void;
export declare function getPrimaryKnownEnvironment(): KnownEnvironment | null;
export declare function resolveInitialPrimaryEnvironmentDescriptor(): Promise<ExecutionEnvironmentDescriptor>;
export declare function __resetPrimaryEnvironmentBootstrapForTests(): void;
export declare const resetPrimaryEnvironmentDescriptorForTests: typeof __resetPrimaryEnvironmentBootstrapForTests;
export declare const __resetPrimaryEnvironmentDescriptorBootstrapForTests: typeof __resetPrimaryEnvironmentBootstrapForTests;
