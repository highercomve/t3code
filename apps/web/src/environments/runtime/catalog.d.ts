import type {
  AuthSessionRole,
  EnvironmentId,
  ExecutionEnvironmentDescriptor,
  ServerConfig,
} from "@t3tools/contracts";
export interface SavedEnvironmentRecord {
  readonly environmentId: EnvironmentId;
  readonly label: string;
  readonly wsBaseUrl: string;
  readonly httpBaseUrl: string;
  readonly createdAt: string;
  readonly lastConnectedAt: string | null;
}
interface SavedEnvironmentRegistryState {
  readonly byId: Record<EnvironmentId, SavedEnvironmentRecord>;
}
interface SavedEnvironmentRegistryStore extends SavedEnvironmentRegistryState {
  readonly upsert: (record: SavedEnvironmentRecord) => void;
  readonly remove: (environmentId: EnvironmentId) => void;
  readonly markConnected: (environmentId: EnvironmentId, connectedAt: string) => void;
  readonly reset: () => void;
}
export declare const useSavedEnvironmentRegistryStore: import("zustand").UseBoundStore<
  import("zustand").StoreApi<SavedEnvironmentRegistryStore>
>;
export declare function hasSavedEnvironmentRegistryHydrated(): boolean;
export declare function waitForSavedEnvironmentRegistryHydration(): Promise<void>;
export declare function listSavedEnvironmentRecords(): ReadonlyArray<SavedEnvironmentRecord>;
export declare function getSavedEnvironmentRecord(
  environmentId: EnvironmentId,
): SavedEnvironmentRecord | null;
export declare function getEnvironmentHttpBaseUrl(environmentId: EnvironmentId): string | null;
export declare function resolveEnvironmentHttpUrl(input: {
  readonly environmentId: EnvironmentId;
  readonly pathname: string;
  readonly searchParams?: Record<string, string>;
}): string;
export declare function resetSavedEnvironmentRegistryStoreForTests(): void;
export declare function persistSavedEnvironmentRecord(
  record: SavedEnvironmentRecord,
): Promise<void>;
export declare function readSavedEnvironmentBearerToken(
  environmentId: EnvironmentId,
): Promise<string | null>;
export declare function writeSavedEnvironmentBearerToken(
  environmentId: EnvironmentId,
  bearerToken: string,
): Promise<boolean>;
export declare function removeSavedEnvironmentBearerToken(
  environmentId: EnvironmentId,
): Promise<void>;
export type SavedEnvironmentConnectionState = "connecting" | "connected" | "disconnected" | "error";
export type SavedEnvironmentAuthState = "authenticated" | "requires-auth" | "unknown";
export interface SavedEnvironmentRuntimeState {
  readonly connectionState: SavedEnvironmentConnectionState;
  readonly authState: SavedEnvironmentAuthState;
  readonly lastError: string | null;
  readonly lastErrorAt: string | null;
  readonly role: AuthSessionRole | null;
  readonly descriptor: ExecutionEnvironmentDescriptor | null;
  readonly serverConfig: ServerConfig | null;
  readonly connectedAt: string | null;
  readonly disconnectedAt: string | null;
}
interface SavedEnvironmentRuntimeStoreState {
  readonly byId: Record<EnvironmentId, SavedEnvironmentRuntimeState>;
  readonly ensure: (environmentId: EnvironmentId) => void;
  readonly patch: (
    environmentId: EnvironmentId,
    patch: Partial<SavedEnvironmentRuntimeState>,
  ) => void;
  readonly clear: (environmentId: EnvironmentId) => void;
  readonly reset: () => void;
}
export declare const useSavedEnvironmentRuntimeStore: import("zustand").UseBoundStore<
  import("zustand").StoreApi<SavedEnvironmentRuntimeStoreState>
>;
export declare function getSavedEnvironmentRuntimeState(
  environmentId: EnvironmentId,
): SavedEnvironmentRuntimeState;
export declare function resetSavedEnvironmentRuntimeStoreForTests(): void;
export {};
