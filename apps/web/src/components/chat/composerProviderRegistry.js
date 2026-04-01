import { jsx as _jsx } from "react/jsx-runtime";
import {
  isClaudeUltrathinkPrompt,
  normalizeClaudeModelOptionsWithCapabilities,
  normalizeCodexModelOptionsWithCapabilities,
  resolveEffort,
} from "@t3tools/shared/model";
import {
  getProviderModelCapabilities,
  normalizeGeminiModelOptionsWithCapabilities,
  normalizeOpencodeModelOptionsWithCapabilities,
} from "../../providerModels";
import { TraitsMenuContent, TraitsPicker } from "./TraitsPicker";
function getProviderStateFromCapabilities(input) {
  const { provider, model, models, prompt, modelOptions } = input;
  const caps = getProviderModelCapabilities(models, model, provider);
  const providerOptions = modelOptions?.[provider];
  // Resolve effort
  const rawEffort = providerOptions
    ? "effort" in providerOptions
      ? providerOptions.effort
      : "reasoningEffort" in providerOptions
        ? providerOptions.reasoningEffort
        : null
    : null;
  const promptEffort = resolveEffort(caps, rawEffort) ?? null;
  // Normalize options for dispatch
  let normalizedOptions;
  switch (provider) {
    case "codex":
      normalizedOptions = normalizeCodexModelOptionsWithCapabilities(caps, providerOptions);
      break;
    case "gemini":
      normalizedOptions = normalizeGeminiModelOptionsWithCapabilities(caps, providerOptions);
      break;
    case "claudeAgent":
      normalizedOptions = normalizeClaudeModelOptionsWithCapabilities(caps, providerOptions);
      break;
    case "opencode":
      normalizedOptions = normalizeOpencodeModelOptionsWithCapabilities(caps, providerOptions);
      break;
  }
  // Ultrathink styling (driven by capabilities data, not provider identity)
  const ultrathinkActive =
    caps.promptInjectedEffortLevels.length > 0 && isClaudeUltrathinkPrompt(prompt);
  return {
    provider,
    promptEffort,
    modelOptionsForDispatch: normalizedOptions,
    ...(ultrathinkActive ? { composerFrameClassName: "ultrathink-frame" } : {}),
    ...(ultrathinkActive
      ? { composerSurfaceClassName: "shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]" }
      : {}),
    ...(ultrathinkActive ? { modelPickerIconClassName: "ultrathink-chroma" } : {}),
  };
}
function makeCapabilitiesRegistryEntry(provider) {
  return {
    getState: (input) => getProviderStateFromCapabilities(input),
    renderTraitsMenuContent: ({ threadId, model, models, modelOptions, prompt, onPromptChange }) =>
      _jsx(TraitsMenuContent, {
        provider: provider,
        models: models,
        threadId: threadId,
        model: model,
        modelOptions: modelOptions,
        prompt: prompt,
        onPromptChange: onPromptChange,
      }),
    renderTraitsPicker: ({ threadId, model, models, modelOptions, prompt, onPromptChange }) =>
      _jsx(TraitsPicker, {
        provider: provider,
        models: models,
        threadId: threadId,
        model: model,
        modelOptions: modelOptions,
        prompt: prompt,
        onPromptChange: onPromptChange,
      }),
  };
}
const composerProviderRegistry = {
  codex: makeCapabilitiesRegistryEntry("codex"),
  gemini: makeCapabilitiesRegistryEntry("gemini"),
  claudeAgent: makeCapabilitiesRegistryEntry("claudeAgent"),
  opencode: makeCapabilitiesRegistryEntry("opencode"),
  copilotAgent: makeCapabilitiesRegistryEntry("copilotAgent"),
};
export function getComposerProviderState(input) {
  return composerProviderRegistry[input.provider].getState(input);
}
export function renderProviderTraitsMenuContent(input) {
  return composerProviderRegistry[input.provider].renderTraitsMenuContent({
    threadId: input.threadId,
    model: input.model,
    models: input.models,
    modelOptions: input.modelOptions,
    prompt: input.prompt,
    onPromptChange: input.onPromptChange,
  });
}
export function renderProviderTraitsPicker(input) {
  return composerProviderRegistry[input.provider].renderTraitsPicker({
    threadId: input.threadId,
    model: input.model,
    models: input.models,
    modelOptions: input.modelOptions,
    prompt: input.prompt,
    onPromptChange: input.onPromptChange,
  });
}
