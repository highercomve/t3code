import {
  DEFAULT_MODEL_BY_PROVIDER,
  MODEL_OPTIONS_BY_PROVIDER,
  MODEL_SLUG_ALIASES_BY_PROVIDER,
} from "@t3tools/contracts";
const MODEL_SLUG_SET_BY_PROVIDER = {
  claudeAgent: new Set(MODEL_OPTIONS_BY_PROVIDER.claudeAgent.map((option) => option.slug)),
  codex: new Set(MODEL_OPTIONS_BY_PROVIDER.codex.map((option) => option.slug)),
  gemini: new Set(MODEL_OPTIONS_BY_PROVIDER.gemini.map((option) => option.slug)),
  opencode: new Set(MODEL_OPTIONS_BY_PROVIDER.opencode.map((option) => option.slug)),
};
export function getModelOptions(provider) {
  return MODEL_OPTIONS_BY_PROVIDER[provider];
}
export function getDefaultModel(provider) {
  return DEFAULT_MODEL_BY_PROVIDER[provider];
}
// ── Effort helpers ────────────────────────────────────────────────────
export function hasEffortLevel(caps, value) {
  return caps.reasoningEffortLevels.some((l) => l.value === value);
}
export function getDefaultEffort(caps) {
  return caps.reasoningEffortLevels.find((l) => l.isDefault)?.value ?? null;
}
export function resolveEffort(caps, raw) {
  const defaultValue = getDefaultEffort(caps);
  const trimmed = typeof raw === "string" ? raw.trim() : null;
  if (
    trimmed &&
    !caps.promptInjectedEffortLevels.includes(trimmed) &&
    hasEffortLevel(caps, trimmed)
  ) {
    return trimmed;
  }
  return defaultValue ?? undefined;
}
// ── Context window helpers ───────────────────────────────────────────
export function hasContextWindowOption(caps, value) {
  return caps.contextWindowOptions.some((o) => o.value === value);
}
export function getDefaultContextWindow(caps) {
  return caps.contextWindowOptions.find((o) => o.isDefault)?.value ?? null;
}
export function resolveContextWindow(caps, raw) {
  const defaultValue = getDefaultContextWindow(caps);
  if (!raw) return defaultValue ?? undefined;
  return hasContextWindowOption(caps, raw) ? raw : (defaultValue ?? undefined);
}
export function normalizeCodexModelOptionsWithCapabilities(caps, modelOptions) {
  const reasoningEffort = resolveEffort(caps, modelOptions?.reasoningEffort);
  const fastMode = caps.supportsFastMode ? modelOptions?.fastMode : undefined;
  const nextOptions = {
    ...(reasoningEffort ? { reasoningEffort: reasoningEffort } : {}),
    ...(fastMode !== undefined ? { fastMode } : {}),
  };
  return Object.keys(nextOptions).length > 0 ? nextOptions : undefined;
}
export function normalizeClaudeModelOptionsWithCapabilities(caps, modelOptions) {
  const effort = resolveEffort(caps, modelOptions?.effort);
  const thinking = caps.supportsThinkingToggle ? modelOptions?.thinking : undefined;
  const fastMode = caps.supportsFastMode ? modelOptions?.fastMode : undefined;
  const contextWindow = resolveContextWindow(caps, modelOptions?.contextWindow);
  const nextOptions = {
    ...(thinking !== undefined ? { thinking } : {}),
    ...(effort ? { effort: effort } : {}),
    ...(fastMode !== undefined ? { fastMode } : {}),
    ...(contextWindow !== undefined ? { contextWindow } : {}),
  };
  return Object.keys(nextOptions).length > 0 ? nextOptions : undefined;
}
export function isClaudeUltrathinkPrompt(text) {
  return typeof text === "string" && /\bultrathink\b/i.test(text);
}
export function normalizeModelSlug(model, provider = "codex") {
  if (typeof model !== "string") {
    return null;
  }
  const trimmed = model.trim();
  if (!trimmed) {
    return null;
  }
  const aliases = MODEL_SLUG_ALIASES_BY_PROVIDER[provider];
  const aliased = Object.prototype.hasOwnProperty.call(aliases, trimmed)
    ? aliases[trimmed]
    : undefined;
  return typeof aliased === "string" ? aliased : trimmed;
}
export function resolveSelectableModel(provider, value, options) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const direct = options.find((option) => option.slug === trimmed);
  if (direct) {
    return direct.slug;
  }
  const byName = options.find((option) => option.name.toLowerCase() === trimmed.toLowerCase());
  if (byName) {
    return byName.slug;
  }
  const normalized = normalizeModelSlug(trimmed, provider);
  if (!normalized) {
    return null;
  }
  const resolved = options.find((option) => option.slug === normalized);
  return resolved ? resolved.slug : null;
}
export function resolveModelSlug(model, provider) {
  const normalized = normalizeModelSlug(model, provider);
  if (!normalized) {
    return DEFAULT_MODEL_BY_PROVIDER[provider];
  }
  return normalized;
}
export function resolveModelSlugForProvider(provider, model) {
  return resolveModelSlug(model, provider);
}
export function trimOrNull(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}
export function inferProviderForModel(model, fallback = "codex") {
  const normalizedClaude = normalizeModelSlug(model, "claudeAgent");
  if (normalizedClaude && MODEL_SLUG_SET_BY_PROVIDER.claudeAgent.has(normalizedClaude)) {
    return "claudeAgent";
  }
  const normalizedCodex = normalizeModelSlug(model, "codex");
  if (normalizedCodex && MODEL_SLUG_SET_BY_PROVIDER.codex.has(normalizedCodex)) {
    return "codex";
  }
  const normalizedGemini = normalizeModelSlug(model, "gemini");
  if (normalizedGemini && MODEL_SLUG_SET_BY_PROVIDER.gemini.has(normalizedGemini)) {
    return "gemini";
  }
  const normalizedOpencode = normalizeModelSlug(model, "opencode");
  if (normalizedOpencode && MODEL_SLUG_SET_BY_PROVIDER.opencode.has(normalizedOpencode)) {
    return "opencode";
  }
  if (typeof model === "string") {
    const trimmed = model.trim();
    if (trimmed.startsWith("claude-")) return "claudeAgent";
    if (trimmed.startsWith("gemini-")) return "gemini";
    if (trimmed.startsWith("opencode/") || trimmed.startsWith("anthropic/")) return "opencode";
  }
  return fallback;
}
export function resolveApiModelId(modelSelection) {
  switch (modelSelection.provider) {
    case "claudeAgent": {
      switch (modelSelection.options?.contextWindow) {
        case "1m":
          return `${modelSelection.model}[1m]`;
        default:
          return modelSelection.model;
      }
    }
    default: {
      return modelSelection.model;
    }
  }
}
export function applyClaudePromptEffortPrefix(text, effort) {
  const trimmed = text.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (effort !== "ultrathink") {
    return trimmed;
  }
  if (trimmed.startsWith("Ultrathink:")) {
    return trimmed;
  }
  return `Ultrathink:\n${trimmed}`;
}
