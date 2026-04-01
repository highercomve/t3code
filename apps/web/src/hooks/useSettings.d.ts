import { type ClientSettings, UnifiedSettings } from "@t3tools/contracts/settings";
import { DeepMutable } from "effect/Types";
/**
 * Read merged settings. Selector narrows the subscription so components
 * only re-render when the slice they care about changes.
 */
export declare function useSettings<T extends UnifiedSettings = UnifiedSettings>(
  selector?: (s: UnifiedSettings) => T,
): T;
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
export declare function buildLegacyServerSettingsMigrationPatch(
  legacySettings: Record<string, unknown>,
): {
  enableAssistantStreaming?: boolean;
  defaultThreadEnvMode?: "local" | "worktree";
  textGenerationModelSelection?:
    | {
        provider?: "codex";
        model?: string;
        options?: {
          reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
          fastMode?: boolean | undefined;
        };
      }
    | {
        provider?: "gemini";
        model?: string;
        options?: {
          thinkingBudget?: number | undefined;
        };
      }
    | {
        provider?: "claudeAgent";
        model?: string;
        options?: {
          effort?: "high" | "medium" | "low" | "max" | "ultrathink" | undefined;
          fastMode?: boolean | undefined;
          thinking?: boolean | undefined;
          contextWindow?: string | undefined;
        };
      }
    | {
        provider?: "opencode";
        model?: string;
        options?: {
          reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
        };
      }
    | {
        provider?: "copilotAgent";
        model?: string;
        options?: {
          reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
        };
      };
  providers?: {
    codex?: {
      binaryPath?: string;
      homePath?: string;
      enabled?: boolean;
      customModels?: string[];
    };
    gemini?: {
      binaryPath?: string;
      homePath?: string;
      enabled?: boolean;
      customModels?: string[];
    };
    claudeAgent?: {
      binaryPath?: string;
      enabled?: boolean;
      customModels?: string[];
    };
    opencode?: {
      binaryPath?: string;
      apiKey?: string;
      enabled?: boolean;
      customModels?: string[];
    };
    copilotAgent?: {
      binaryPath?: string;
      enabled?: boolean;
      customModels?: string[];
    };
  };
};
export declare function buildLegacyClientSettingsMigrationPatch(
  legacySettings: Record<string, unknown>,
): Partial<DeepMutable<ClientSettings>>;
/**
 * Call once on app startup.
 * If the legacy localStorage key exists, migrate its values to the new server
 * and client storage formats, then remove the legacy key so this only runs once.
 */
export declare function migrateLocalSettingsToServer(): void;
