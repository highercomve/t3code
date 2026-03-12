import { DEFAULT_MODEL_BY_PROVIDER, MODEL_OPTIONS_BY_PROVIDER } from "@t3tools/contracts";
import { normalizeModelSlug, resolveContextWindow, resolveEffort } from "@t3tools/shared/model";
const EMPTY_CAPABILITIES = {
  reasoningEffortLevels: [],
  supportsFastMode: false,
  supportsThinkingToggle: false,
  contextWindowOptions: [],
  promptInjectedEffortLevels: [],
};
export function getProviderModels(providers, provider) {
  const liveModels = providers.find((candidate) => candidate.provider === provider)?.models;
  if (liveModels && liveModels.length > 0) {
    return liveModels;
  }
  return MODEL_OPTIONS_BY_PROVIDER[provider].map((model) => ({
    ...model,
    capabilities: null,
    isCustom: false,
  }));
}
export function getProviderSnapshot(providers, provider) {
  return providers.find((candidate) => candidate.provider === provider);
}
export function isProviderEnabled(providers, provider) {
  return getProviderSnapshot(providers, provider)?.enabled ?? true;
}
export function resolveSelectableProvider(providers, provider) {
  const requested = provider ?? "codex";
  if (isProviderEnabled(providers, requested)) {
    return requested;
  }
  return providers.find((candidate) => candidate.enabled)?.provider ?? requested;
}
export function getProviderModelCapabilities(models, model, provider) {
  const slug = normalizeModelSlug(model, provider);
  return models.find((candidate) => candidate.slug === slug)?.capabilities ?? EMPTY_CAPABILITIES;
}
export function getDefaultServerModel(providers, provider) {
  const models = getProviderModels(providers, provider);
  return (
    models.find((model) => !model.isCustom)?.slug ??
    models[0]?.slug ??
    DEFAULT_MODEL_BY_PROVIDER[provider]
  );
}
export function normalizeCodexModelOptionsWithCapabilities(caps, modelOptions) {
  const reasoningEffort = resolveEffort(caps, modelOptions?.reasoningEffort);
  const fastModeEnabled = modelOptions?.fastMode === true;
  const nextOptions = {
    ...(reasoningEffort ? { reasoningEffort: reasoningEffort } : {}),
    ...(fastModeEnabled ? { fastMode: true } : {}),
  };
  return Object.keys(nextOptions).length > 0 ? nextOptions : undefined;
}
export function normalizeClaudeModelOptionsWithCapabilities(caps, modelOptions) {
  const effort = resolveEffort(caps, modelOptions?.effort);
  const thinking =
    caps.supportsThinkingToggle && modelOptions?.thinking === false ? false : undefined;
  const fastMode = caps.supportsFastMode && modelOptions?.fastMode === true ? true : undefined;
  const contextWindow = resolveContextWindow(caps, modelOptions?.contextWindow);
  const nextOptions = {
    ...(thinking === false ? { thinking: false } : {}),
    ...(effort ? { effort: effort } : {}),
    ...(fastMode ? { fastMode: true } : {}),
    ...(contextWindow ? { contextWindow } : {}),
  };
  return Object.keys(nextOptions).length > 0 ? nextOptions : undefined;
}
export function normalizeGeminiModelOptionsWithCapabilities(_caps, modelOptions) {
  const thinkingBudget =
    typeof modelOptions?.thinkingBudget === "number" &&
    Number.isInteger(modelOptions.thinkingBudget)
      ? modelOptions.thinkingBudget
      : undefined;
  return thinkingBudget !== undefined ? { thinkingBudget } : undefined;
}
export function normalizeOpencodeModelOptionsWithCapabilities(caps, modelOptions) {
  const reasoningEffort = resolveEffort(caps, modelOptions?.reasoningEffort);
  return reasoningEffort ? { reasoningEffort: reasoningEffort } : undefined;
}
