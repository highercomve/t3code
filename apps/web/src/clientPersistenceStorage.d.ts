import {
  type ClientSettings,
  type EnvironmentId as EnvironmentIdValue,
  type PersistedSavedEnvironmentRecord,
} from "@t3tools/contracts";
export declare const CLIENT_SETTINGS_STORAGE_KEY = "t3code:client-settings:v1";
export declare const SAVED_ENVIRONMENT_REGISTRY_STORAGE_KEY =
  "t3code:saved-environment-registry:v1";
export declare function readBrowserClientSettings(): ClientSettings | null;
export declare function writeBrowserClientSettings(settings: ClientSettings): void;
export declare function readBrowserSavedEnvironmentRegistry(): ReadonlyArray<PersistedSavedEnvironmentRecord>;
export declare function writeBrowserSavedEnvironmentRegistry(
  records: ReadonlyArray<PersistedSavedEnvironmentRecord>,
): void;
export declare function readBrowserSavedEnvironmentSecret(
  environmentId: EnvironmentIdValue,
): string | null;
export declare function writeBrowserSavedEnvironmentSecret(
  environmentId: EnvironmentIdValue,
  secret: string,
): boolean;
export declare function removeBrowserSavedEnvironmentSecret(
  environmentId: EnvironmentIdValue,
): void;
