import {
  type GeminiModelSelection,
  type ModelSelection,
  type OpencodeModelSelection,
  type ProviderKind,
  type ServerProvider,
  type ClaudeModelSelection,
  type CodexModelSelection,
} from "@t3tools/contracts";
import { UnifiedSettings } from "@t3tools/contracts/settings";
export declare const MAX_CUSTOM_MODEL_LENGTH = 256;
export type ProviderCustomModelConfig = {
  provider: ProviderKind;
  title: string;
  description: string;
  placeholder: string;
  example: string;
};
export interface AppModelOption {
  slug: string;
  name: string;
  isCustom: boolean;
}
type ModelSelectionByProvider = {
  codex: CodexModelSelection;
  gemini: GeminiModelSelection;
  claudeAgent: ClaudeModelSelection;
  opencode: OpencodeModelSelection;
};
export declare function buildModelSelection<P extends ProviderKind>(
  provider: P,
  model: string,
  options?: ModelSelectionByProvider[P]["options"],
): ModelSelectionByProvider[P];
export declare const MODEL_PROVIDER_SETTINGS: ProviderCustomModelConfig[];
export declare function normalizeCustomModelSlugs(
  models: Iterable<string | null | undefined>,
  builtInModelSlugs: ReadonlySet<string>,
  provider?: ProviderKind,
): string[];
export declare function getAppModelOptions(
  settings: UnifiedSettings,
  providers: ReadonlyArray<ServerProvider>,
  provider: ProviderKind,
  selectedModel?: string | null,
): AppModelOption[];
export declare function resolveAppModelSelection(
  provider: ProviderKind,
  settings: UnifiedSettings,
  providers: ReadonlyArray<ServerProvider>,
  selectedModel: string | null | undefined,
): string;
export declare function getCustomModelOptionsByProvider(
  settings: UnifiedSettings,
  providers: ReadonlyArray<ServerProvider>,
  selectedProvider?: ProviderKind | null,
  selectedModel?: string | null,
): Record<
  ProviderKind,
  ReadonlyArray<{
    slug: string;
    name: string;
  }>
>;
export declare function resolveAppModelSelectionState(
  settings: UnifiedSettings,
  providers: ReadonlyArray<ServerProvider>,
): ModelSelection;
export {};
