import { useCallback } from "react";
import { Option, Schema } from "effect";
import { TrimmedNonEmptyString } from "@t3tools/contracts";
import {
  getDefaultModel,
  getModelOptions,
  normalizeModelSlug,
  resolveSelectableModel,
} from "@t3tools/shared/model";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { EnvMode } from "./components/BranchToolbar.logic";
const APP_SETTINGS_STORAGE_KEY = "t3code:app-settings:v1";
const MAX_CUSTOM_MODEL_COUNT = 32;
export const MAX_CUSTOM_MODEL_LENGTH = 256;
export const TimestampFormat = Schema.Literals(["locale", "12-hour", "24-hour"]);
export const DEFAULT_TIMESTAMP_FORMAT = "locale";
const BUILT_IN_MODEL_SLUGS_BY_PROVIDER = {
  codex: new Set(getModelOptions("codex").map((option) => option.slug)),
  gemini: new Set(getModelOptions("gemini").map((option) => option.slug)),
  claudeAgent: new Set(getModelOptions("claudeAgent").map((option) => option.slug)),
  opencode: new Set(getModelOptions("opencode").map((option) => option.slug)),
  copilotAgent: new Set(getModelOptions("copilotAgent").map((option) => option.slug)),
};
const withDefaults = (fallback) => (schema) =>
  schema.pipe(
    Schema.withConstructorDefault(() => Option.some(fallback())),
    Schema.withDecodingDefault(() => fallback()),
  );
export const AppSettingsSchema = Schema.Struct({
  claudeBinaryPath: Schema.String.check(Schema.isMaxLength(4096)).pipe(withDefaults(() => "")),
  codexBinaryPath: Schema.String.check(Schema.isMaxLength(4096)).pipe(withDefaults(() => "")),
  codexHomePath: Schema.String.check(Schema.isMaxLength(4096)).pipe(withDefaults(() => "")),
  copilotBinaryPath: Schema.String.check(Schema.isMaxLength(4096)).pipe(withDefaults(() => "")),
  defaultThreadEnvMode: EnvMode.pipe(withDefaults(() => "local")),
  confirmThreadDelete: Schema.Boolean.pipe(withDefaults(() => true)),
  diffWordWrap: Schema.Boolean.pipe(withDefaults(() => false)),
  enableAssistantStreaming: Schema.Boolean.pipe(withDefaults(() => false)),
  timestampFormat: TimestampFormat.pipe(withDefaults(() => DEFAULT_TIMESTAMP_FORMAT)),
  customCodexModels: Schema.Array(Schema.String).pipe(withDefaults(() => [])),
  customClaudeModels: Schema.Array(Schema.String).pipe(withDefaults(() => [])),
  customGeminiModels: Schema.Array(Schema.String).pipe(withDefaults(() => [])),
  customOpencodeModels: Schema.Array(Schema.String).pipe(withDefaults(() => [])),
  customCopilotModels: Schema.Array(Schema.String).pipe(withDefaults(() => [])),
  geminiApiKey: Schema.String.check(Schema.isMaxLength(4096)).pipe(withDefaults(() => "")),
  textGenerationModel: Schema.optional(TrimmedNonEmptyString),
});
const DEFAULT_APP_SETTINGS = AppSettingsSchema.makeUnsafe({});
const PROVIDER_CUSTOM_MODEL_CONFIG = {
  codex: {
    provider: "codex",
    settingsKey: "customCodexModels",
    defaultSettingsKey: "customCodexModels",
    title: "Codex",
    description: "Save additional Codex model slugs for the picker and `/model` command.",
    placeholder: "your-codex-model-slug",
    example: "gpt-6.7-codex-ultra-preview",
  },
  gemini: {
    provider: "gemini",
    settingsKey: "customGeminiModels",
    defaultSettingsKey: "customGeminiModels",
    title: "Gemini",
    description: "Save additional Gemini model slugs for the picker and `/model` command.",
    placeholder: "your-gemini-model-slug",
    example: "gemini-3.5-ultra-preview",
  },
  claudeAgent: {
    provider: "claudeAgent",
    settingsKey: "customClaudeModels",
    defaultSettingsKey: "customClaudeModels",
    title: "Claude",
    description: "Save additional Claude model slugs for the picker and `/model` command.",
    placeholder: "your-claude-model-slug",
    example: "claude-sonnet-5-0",
  },
  opencode: {
    provider: "opencode",
    settingsKey: "customOpencodeModels",
    defaultSettingsKey: "customOpencodeModels",
    title: "OpenCode",
    description: "Save additional OpenCode model slugs for the picker and `/model` command.",
    placeholder: "provider/model-name",
    example: "anthropic/claude-sonnet-4-6",
  },
  copilotAgent: {
    provider: "copilotAgent",
    settingsKey: "customCopilotModels",
    defaultSettingsKey: "customCopilotModels",
    title: "Copilot",
    description: "Save additional Copilot model slugs for the picker and `/model` command.",
    placeholder: "your-copilot-model-slug",
    example: "claude-sonnet-4.7",
  },
};
export const MODEL_PROVIDER_SETTINGS = Object.values(PROVIDER_CUSTOM_MODEL_CONFIG);
export function normalizeCustomModelSlugs(models, provider = "codex") {
  const normalizedModels = [];
  const seen = new Set();
  const builtInModelSlugs = BUILT_IN_MODEL_SLUGS_BY_PROVIDER[provider];
  for (const candidate of models) {
    const normalized = normalizeModelSlug(candidate, provider);
    if (
      !normalized ||
      normalized.length > MAX_CUSTOM_MODEL_LENGTH ||
      builtInModelSlugs?.has(normalized) ||
      seen.has(normalized)
    ) {
      continue;
    }
    seen.add(normalized);
    normalizedModels.push(normalized);
    if (normalizedModels.length >= MAX_CUSTOM_MODEL_COUNT) {
      break;
    }
  }
  return normalizedModels;
}
function normalizeAppSettings(settings) {
  return {
    ...settings,
    customCodexModels: normalizeCustomModelSlugs(settings.customCodexModels, "codex"),
    customClaudeModels: normalizeCustomModelSlugs(settings.customClaudeModels, "claudeAgent"),
    customGeminiModels: normalizeCustomModelSlugs(settings.customGeminiModels, "gemini"),
    customOpencodeModels: normalizeCustomModelSlugs(settings.customOpencodeModels, "opencode"),
    customCopilotModels: normalizeCustomModelSlugs(settings.customCopilotModels, "copilotAgent"),
  };
}
export function getCustomModelsForProvider(settings, provider) {
  return settings[PROVIDER_CUSTOM_MODEL_CONFIG[provider].settingsKey];
}
export function getDefaultCustomModelsForProvider(defaults, provider) {
  return defaults[PROVIDER_CUSTOM_MODEL_CONFIG[provider].defaultSettingsKey];
}
export function patchCustomModels(provider, models) {
  return {
    [PROVIDER_CUSTOM_MODEL_CONFIG[provider].settingsKey]: models,
  };
}
export function getCustomModelsByProvider(settings) {
  return {
    codex: getCustomModelsForProvider(settings, "codex"),
    gemini: getCustomModelsForProvider(settings, "gemini"),
    claudeAgent: getCustomModelsForProvider(settings, "claudeAgent"),
    opencode: getCustomModelsForProvider(settings, "opencode"),
    copilotAgent: getCustomModelsForProvider(settings, "copilotAgent"),
  };
}
export function getAppModelOptions(provider, customModels, selectedModel, dynamicModels) {
  // If dynamic models are available, use them as the base instead of hardcoded ones
  let options;
  if (dynamicModels && dynamicModels.length > 0) {
    options = dynamicModels.map(({ id, name }) => ({
      slug: id,
      name,
      isCustom: false,
    }));
  } else {
    options = getModelOptions(provider).map(({ slug, name }) => ({
      slug,
      name,
      isCustom: false,
    }));
  }
  const seen = new Set(options.map((option) => option.slug));
  const trimmedSelectedModel = selectedModel?.trim().toLowerCase();
  for (const slug of normalizeCustomModelSlugs(customModels, provider)) {
    if (seen.has(slug)) {
      continue;
    }
    seen.add(slug);
    options.push({
      slug,
      name: slug,
      isCustom: true,
    });
  }
  const normalizedSelectedModel = normalizeModelSlug(selectedModel, provider);
  const selectedModelMatchesExistingName =
    typeof trimmedSelectedModel === "string" &&
    options.some((option) => option.name.toLowerCase() === trimmedSelectedModel);
  if (
    normalizedSelectedModel &&
    !seen.has(normalizedSelectedModel) &&
    !selectedModelMatchesExistingName
  ) {
    options.push({
      slug: normalizedSelectedModel,
      name: normalizedSelectedModel,
      isCustom: true,
    });
  }
  return options;
}
export function resolveAppModelSelection(provider, customModels, selectedModel) {
  const customModelsForProvider = customModels[provider];
  const options = getAppModelOptions(provider, customModelsForProvider, selectedModel);
  return resolveSelectableModel(provider, selectedModel, options) ?? getDefaultModel(provider);
}
export function getCustomModelOptionsByProvider(settings, dynamicModelsByProvider) {
  const customModelsByProvider = getCustomModelsByProvider(settings);
  return {
    codex: getAppModelOptions(
      "codex",
      customModelsByProvider.codex,
      undefined,
      dynamicModelsByProvider?.codex,
    ),
    gemini: getAppModelOptions(
      "gemini",
      customModelsByProvider.gemini,
      undefined,
      dynamicModelsByProvider?.gemini,
    ),
    claudeAgent: getAppModelOptions(
      "claudeAgent",
      customModelsByProvider.claudeAgent,
      undefined,
      dynamicModelsByProvider?.claudeAgent,
    ),
    opencode: getAppModelOptions(
      "opencode",
      customModelsByProvider.opencode,
      undefined,
      dynamicModelsByProvider?.opencode,
    ),
    copilotAgent: getAppModelOptions(
      "copilotAgent",
      customModelsByProvider.copilotAgent,
      undefined,
      dynamicModelsByProvider?.copilotAgent,
    ),
  };
}
export function getProviderStartOptions(settings) {
  const providerOptions = {
    ...(settings.codexBinaryPath || settings.codexHomePath
      ? {
          codex: {
            ...(settings.codexBinaryPath ? { binaryPath: settings.codexBinaryPath } : {}),
            ...(settings.codexHomePath ? { homePath: settings.codexHomePath } : {}),
          },
        }
      : {}),
    ...(settings.claudeBinaryPath
      ? {
          claudeAgent: {
            binaryPath: settings.claudeBinaryPath,
          },
        }
      : {}),
    ...(settings.copilotBinaryPath
      ? {
          copilotAgent: {
            binaryPath: settings.copilotBinaryPath,
          },
        }
      : {}),
  };
  return Object.keys(providerOptions).length > 0 ? providerOptions : undefined;
}
export function useAppSettings() {
  const [settings, setSettings] = useLocalStorage(
    APP_SETTINGS_STORAGE_KEY,
    DEFAULT_APP_SETTINGS,
    AppSettingsSchema,
  );
  const updateSettings = useCallback(
    (patch) => {
      setSettings((prev) => normalizeAppSettings({ ...prev, ...patch }));
    },
    [setSettings],
  );
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_APP_SETTINGS);
  }, [setSettings]);
  return {
    settings,
    updateSettings,
    resetSettings,
    defaults: DEFAULT_APP_SETTINGS,
  };
}
