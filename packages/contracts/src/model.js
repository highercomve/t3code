import { Schema } from "effect";
import { TrimmedNonEmptyString } from "./baseSchemas";
export const CODEX_REASONING_EFFORT_OPTIONS = ["xhigh", "high", "medium", "low"];
export const CLAUDE_CODE_EFFORT_OPTIONS = ["low", "medium", "high", "max", "ultrathink"];
export const CodexModelOptions = Schema.Struct({
  reasoningEffort: Schema.optional(Schema.Literals(CODEX_REASONING_EFFORT_OPTIONS)),
  fastMode: Schema.optional(Schema.Boolean),
});
export const GeminiModelOptions = Schema.Struct({
  thinkingBudget: Schema.optional(Schema.Int),
});
export const ClaudeModelOptions = Schema.Struct({
  thinking: Schema.optional(Schema.Boolean),
  effort: Schema.optional(Schema.Literals(CLAUDE_CODE_EFFORT_OPTIONS)),
  fastMode: Schema.optional(Schema.Boolean),
  contextWindow: Schema.optional(Schema.String),
});
export const OpencodeModelOptions = Schema.Struct({
  reasoningEffort: Schema.optional(Schema.Literals(CODEX_REASONING_EFFORT_OPTIONS)),
});
export const ProviderModelOptions = Schema.Struct({
  codex: Schema.optional(CodexModelOptions),
  gemini: Schema.optional(GeminiModelOptions),
  claudeAgent: Schema.optional(ClaudeModelOptions),
  opencode: Schema.optional(OpencodeModelOptions),
});
export const EffortOption = Schema.Struct({
  value: TrimmedNonEmptyString,
  label: TrimmedNonEmptyString,
  isDefault: Schema.optional(Schema.Boolean),
});
export const ContextWindowOption = Schema.Struct({
  value: TrimmedNonEmptyString,
  label: TrimmedNonEmptyString,
  isDefault: Schema.optional(Schema.Boolean),
});
export const MODEL_OPTIONS_BY_PROVIDER = {
  codex: [
    { slug: "gpt-5.4", name: "GPT-5.4" },
    { slug: "gpt-5.4-mini", name: "GPT-5.4 Mini" },
    { slug: "gpt-5.3-codex", name: "GPT-5.3 Codex" },
    { slug: "gpt-5.3-codex-spark", name: "GPT-5.3 Codex Spark" },
    { slug: "gpt-5.2-codex", name: "GPT-5.2 Codex" },
    { slug: "gpt-5.2", name: "GPT-5.2" },
  ],
  gemini: [
    { slug: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro Preview" },
    { slug: "gemini-3-flash-preview", name: "Gemini 3 Flash Preview" },
    { slug: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
    { slug: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
    { slug: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
  ],
  claudeAgent: [
    { slug: "claude-opus-4-6", name: "Claude Opus 4.6" },
    { slug: "claude-sonnet-4-6", name: "Claude Sonnet 4.6" },
    { slug: "claude-haiku-4-5", name: "Claude Haiku 4.5" },
  ],
  opencode: [
    { slug: "opencode/big-pickle", name: "OpenCode Big Pickle" },
    { slug: "opencode/mimo-v2-omni-free", name: "MiMo V2 Omni Free" },
    { slug: "opencode/mimo-v2-pro-free", name: "MiMo V2 Pro Free" },
    { slug: "anthropic/claude-haiku-3-5", name: "Claude Haiku 3.5" },
    { slug: "anthropic/claude-haiku-4-5", name: "Claude Haiku 4.5" },
    { slug: "anthropic/claude-opus-4-1", name: "Claude Opus 4.1" },
    { slug: "anthropic/claude-opus-4-5", name: "Claude Opus 4.5" },
    { slug: "anthropic/claude-opus-4-6", name: "Claude Opus 4.6" },
    { slug: "opencode/claude-sonnet-4", name: "Claude Sonnet 4" },
    { slug: "opencode/claude-sonnet-4-5", name: "Claude Sonnet 4.5" },
    { slug: "opencode/claude-sonnet-4-6", name: "OpenCode Claude Sonnet 4.6" },
    { slug: "anthropic/claude-sonnet-4-6", name: "Anthropic Claude Sonnet 4.6" },
    { slug: "google/gemini-3.1-pro-preview", name: "Google Gemini 3.1 Pro" },
    { slug: "opencode/glm-5", name: "GLM-5" },
  ],
};
export const ModelCapabilities = Schema.Struct({
  reasoningEffortLevels: Schema.Array(EffortOption),
  supportsFastMode: Schema.Boolean,
  supportsThinkingToggle: Schema.Boolean,
  contextWindowOptions: Schema.Array(ContextWindowOption),
  promptInjectedEffortLevels: Schema.Array(TrimmedNonEmptyString),
});
export const DEFAULT_MODEL_BY_PROVIDER = {
  codex: "gpt-5.4",
  gemini: "gemini-3.1-pro-preview",
  claudeAgent: "claude-sonnet-4-6",
  opencode: "opencode/big-pickle",
};
export const MODEL_OPTIONS = MODEL_OPTIONS_BY_PROVIDER.codex;
export const DEFAULT_MODEL = DEFAULT_MODEL_BY_PROVIDER.codex;
/** Per-provider text generation model defaults. */
export const DEFAULT_GIT_TEXT_GENERATION_MODEL_BY_PROVIDER = {
  codex: "gpt-5.4-mini",
  gemini: "gemini-2.5-flash",
  claudeAgent: "claude-haiku-4-5",
  opencode: "opencode/big-pickle",
};
export const DEFAULT_GIT_TEXT_GENERATION_MODEL =
  DEFAULT_GIT_TEXT_GENERATION_MODEL_BY_PROVIDER.codex;
export const MODEL_SLUG_ALIASES_BY_PROVIDER = {
  codex: {
    5.4: "gpt-5.4",
    5.3: "gpt-5.3-codex",
    "gpt-5.3": "gpt-5.3-codex",
    "5.3-spark": "gpt-5.3-codex-spark",
    "gpt-5.3-spark": "gpt-5.3-codex-spark",
  },
  gemini: {
    "3.1-pro": "gemini-3.1-pro-preview",
    pro: "gemini-3.1-pro-preview",
    "3-flash": "gemini-3-flash-preview",
    flash: "gemini-3-flash-preview",
    "2.5-pro": "gemini-2.5-pro",
    "2.5-flash": "gemini-2.5-flash",
    "2.5-flash-lite": "gemini-2.5-flash-lite",
    "flash-lite": "gemini-2.5-flash-lite",
  },
  claudeAgent: {
    opus: "claude-opus-4-6",
    "opus-4.6": "claude-opus-4-6",
    "claude-opus-4.6": "claude-opus-4-6",
    "claude-opus-4-6-20251117": "claude-opus-4-6",
    sonnet: "claude-sonnet-4-6",
    "sonnet-4.6": "claude-sonnet-4-6",
    "claude-sonnet-4.6": "claude-sonnet-4-6",
    "claude-sonnet-4-6-20251117": "claude-sonnet-4-6",
    haiku: "claude-haiku-4-5",
    "haiku-4.5": "claude-haiku-4-5",
    "claude-haiku-4.5": "claude-haiku-4-5",
    "claude-haiku-4-5-20251001": "claude-haiku-4-5",
  },
  opencode: {
    "big-pickle": "opencode/big-pickle",
    "mimo-v2-omni": "opencode/mimo-v2-omni-free",
    "mimo-v2-pro": "opencode/mimo-v2-pro-free",
    haiku: "anthropic/claude-haiku-4-5",
    "haiku-3.5": "anthropic/claude-haiku-3-5",
    "haiku-4.5": "anthropic/claude-haiku-4-5",
    opus: "anthropic/claude-opus-4-6",
    "opus-4.1": "anthropic/claude-opus-4-1",
    "opus-4.5": "anthropic/claude-opus-4-5",
    "opus-4.6": "anthropic/claude-opus-4-6",
    sonnet: "opencode/claude-sonnet-4-6",
    "sonnet-4": "opencode/claude-sonnet-4",
    "sonnet-4.5": "opencode/claude-sonnet-4-5",
    "sonnet-4.6": "opencode/claude-sonnet-4-6",
    "gemini-pro": "google/gemini-3.1-pro-preview",
    "glm-5": "opencode/glm-5",
  },
};
export const PROVIDER_DISPLAY_NAMES = {
  codex: "Codex",
  gemini: "Gemini",
  claudeAgent: "Claude",
  opencode: "OpenCode",
};
export const REASONING_EFFORT_OPTIONS_BY_PROVIDER = {
  codex: CODEX_REASONING_EFFORT_OPTIONS,
  gemini: CODEX_REASONING_EFFORT_OPTIONS,
  claudeAgent: CLAUDE_CODE_EFFORT_OPTIONS,
  opencode: CODEX_REASONING_EFFORT_OPTIONS,
};
export const DEFAULT_REASONING_EFFORT_BY_PROVIDER = {
  codex: "high",
  gemini: "high",
  claudeAgent: "high",
  opencode: "high",
};
