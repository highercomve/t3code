import { type EnvironmentId, type OrchestrationEvent, ThreadId } from "@t3tools/contracts";
import { type QueryClient } from "@tanstack/react-query";
import { type SavedEnvironmentRecord } from "./catalog";
import { type EnvironmentConnection } from "./connection";
export declare function retainThreadDetailSubscription(
  environmentId: EnvironmentId,
  threadId: ThreadId,
): () => void;
export declare function shouldApplyTerminalEvent(input: {
  serverThreadArchivedAt: string | null | undefined;
  hasDraftThread: boolean;
}): boolean;
export declare function applyEnvironmentThreadDetailEvent(
  event: OrchestrationEvent,
  environmentId: EnvironmentId,
): void;
export declare function subscribeEnvironmentConnections(listener: () => void): () => void;
export declare function listEnvironmentConnections(): ReadonlyArray<EnvironmentConnection>;
export declare function readEnvironmentConnection(
  environmentId: EnvironmentId,
): EnvironmentConnection | null;
export declare function requireEnvironmentConnection(
  environmentId: EnvironmentId,
): EnvironmentConnection;
export declare function getPrimaryEnvironmentConnection(): EnvironmentConnection;
export declare function disconnectSavedEnvironment(environmentId: EnvironmentId): Promise<void>;
export declare function reconnectSavedEnvironment(environmentId: EnvironmentId): Promise<void>;
export declare function removeSavedEnvironment(environmentId: EnvironmentId): Promise<void>;
export declare function addSavedEnvironment(input: {
  readonly label: string;
  readonly pairingUrl?: string;
  readonly host?: string;
  readonly pairingCode?: string;
}): Promise<SavedEnvironmentRecord>;
export declare function ensureEnvironmentConnectionBootstrapped(
  environmentId: EnvironmentId,
): Promise<void>;
export declare function startEnvironmentConnectionService(queryClient: QueryClient): () => void;
export declare function resetEnvironmentServiceForTests(): Promise<void>;
