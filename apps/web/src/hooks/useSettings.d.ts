import { type ClientSettings, UnifiedSettings } from "@t3tools/contracts/settings";
import { DeepMutable } from "effect/Types";
/**
 * Read merged settings. Selector narrows the subscription so components
 * only re-render when the slice they care about changes.
 */
export declare function useSettings<T extends UnifiedSettings = UnifiedSettings>(selector?: (s: UnifiedSettings) => T): T;
/**
 * Returns an updater that routes each key to the correct backing store.
 *
 * Server keys are optimistically patched in the React Query cache, then
 * persisted via RPC. Client keys go straight to localStorage.
 */
export declare function useUpdateSettings(): {
    updateSettings: (patch: Partial<UnifiedSettings>) => void;
    resetSettings: () => void;
};
export declare function buildLegacyServerSettingsMigrationPatch(legacySettings: Record<string, unknown>): {
    defaultThreadEnvMode?: "local" | "worktree";
    enableAssistantStreaming?: boolean;
    textGenerationModelSelection?: {
        provider?: "codex";
        options?: {
            reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
            fastMode?: boolean | undefined;
        };
        model?: string;
    } | {
        provider?: "gemini";
        options?: {
            thinkingBudget?: number | undefined;
        };
        model?: string;
    } | {
        provider?: "claudeAgent";
        options?: {
            fastMode?: boolean | undefined;
            thinking?: boolean | undefined;
            effort?: "high" | "medium" | "low" | "max" | "ultrathink" | undefined;
            contextWindow?: string | undefined;
        };
        model?: string;
    } | {
        provider?: "opencode";
        options?: {
            reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
        };
        model?: string;
    };
    providers?: {
        codex?: {
            enabled?: boolean;
            homePath?: string;
            customModels?: string[];
            binaryPath?: string;
        };
        gemini?: {
            enabled?: boolean;
            homePath?: string;
            customModels?: string[];
            binaryPath?: string;
        };
        claudeAgent?: {
            enabled?: boolean;
            customModels?: string[];
            binaryPath?: string;
        };
        opencode?: {
            enabled?: boolean;
            customModels?: string[];
            binaryPath?: string;
            apiKey?: string;
        };
    };
};
export declare function buildLegacyClientSettingsMigrationPatch(legacySettings: Record<string, unknown>): Partial<DeepMutable<ClientSettings>>;
/**
 * Call once on app startup.
 * If the legacy localStorage key exists, migrate its values to the new server
 * and client storage formats, then remove the legacy key so this only runs once.
 */
export declare function migrateLocalSettingsToServer(): void;
