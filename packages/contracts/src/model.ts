import { Schema } from "effect";
import { TrimmedNonEmptyString } from "./baseSchemas";
import type { ProviderKind } from "./orchestration";

export const CODEX_REASONING_EFFORT_OPTIONS = ["xhigh", "high", "medium", "low"] as const;
export type CodexReasoningEffort = (typeof CODEX_REASONING_EFFORT_OPTIONS)[number];
export const CLAUDE_CODE_EFFORT_OPTIONS = ["low", "medium", "high", "max", "ultrathink"] as const;
export type ClaudeCodeEffort = (typeof CLAUDE_CODE_EFFORT_OPTIONS)[number];
export type ProviderReasoningEffort = CodexReasoningEffort | ClaudeCodeEffort;

export const CodexModelOptions = Schema.Struct({
  reasoningEffort: Schema.optional(Schema.Literals(CODEX_REASONING_EFFORT_OPTIONS)),
  fastMode: Schema.optional(Schema.Boolean),
});
export type CodexModelOptions = typeof CodexModelOptions.Type;

export const GeminiModelOptions = Schema.Struct({
  thinkingBudget: Schema.optional(Schema.Int),
});
export type GeminiModelOptions = typeof GeminiModelOptions.Type;

export const ClaudeModelOptions = Schema.Struct({
  thinking: Schema.optional(Schema.Boolean),
  effort: Schema.optional(Schema.Literals(CLAUDE_CODE_EFFORT_OPTIONS)),
  fastMode: Schema.optional(Schema.Boolean),
  contextWindow: Schema.optional(Schema.String),
});
export type ClaudeModelOptions = typeof ClaudeModelOptions.Type;

export const OpencodeModelOptions = Schema.Struct({
  reasoningEffort: Schema.optional(Schema.Literals(CODEX_REASONING_EFFORT_OPTIONS)),
});
export type OpencodeModelOptions = typeof OpencodeModelOptions.Type;

export const ProviderModelOptions = Schema.Struct({
  codex: Schema.optional(CodexModelOptions),
  gemini: Schema.optional(GeminiModelOptions),
  claudeAgent: Schema.optional(ClaudeModelOptions),
  opencode: Schema.optional(OpencodeModelOptions),
});
export type ProviderModelOptions = typeof ProviderModelOptions.Type;

export const EffortOption = Schema.Struct({
  value: TrimmedNonEmptyString,
  label: TrimmedNonEmptyString,
  isDefault: Schema.optional(Schema.Boolean),
});
export type EffortOption = typeof EffortOption.Type;

export const ContextWindowOption = Schema.Struct({
  value: TrimmedNonEmptyString,
  label: TrimmedNonEmptyString,
  isDefault: Schema.optional(Schema.Boolean),
});
export type ContextWindowOption = typeof ContextWindowOption.Type;

type ModelOption = {
  readonly slug: string;
  readonly name: string;
};

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
    { slug: "opencode/gpt-5-nano", name: "GPT-5 Nano" },
    { slug: "opencode/mimo-v2-omni-free", name: "MiMo V2 Omni Free" },
    { slug: "opencode/mimo-v2-pro-free", name: "MiMo V2 Pro Free" },
    { slug: "opencode/minimax-m2.5-free", name: "MiniMax M2.5 Free" },
    { slug: "opencode/nemotron-3-super-free", name: "Nemotron 3 Super Free" },
    { slug: "opencode-go/glm-5", name: "GLM-5" },
    { slug: "opencode-go/kimi-k2.5", name: "Kimi K2.5" },
    { slug: "opencode-go/minimax-m2.5", name: "MiniMax M2.5" },
    { slug: "opencode-go/minimax-m2.7", name: "MiniMax M2.7" },
    { slug: "local_ollama/deepseek-r1:8b", name: "DeepSeek R1 8B (Local Ollama)" },
    { slug: "local_ollama/qwen2.5-coder:7b", name: "Qwen 2.5 Coder 7B (Local Ollama)" },
    { slug: "local_ollama/qwen3-vl:8b", name: "Qwen3 VL 8B (Local Ollama)" },
    { slug: "local_ollama/qwen3:8b", name: "Qwen3 8B (Local Ollama)" },
    { slug: "ollama/nemotron-3-super", name: "Nemotron 3 Super (Ollama)" },
  ],
} as const satisfies Record<ProviderKind, readonly ModelOption[]>;
export type ModelOptionsByProvider = typeof MODEL_OPTIONS_BY_PROVIDER;

type BuiltInModelSlug = (typeof MODEL_OPTIONS_BY_PROVIDER)[ProviderKind][number]["slug"];
export type ModelSlug = BuiltInModelSlug | (string & {});

export const ModelCapabilities = Schema.Struct({
  reasoningEffortLevels: Schema.Array(EffortOption),
  supportsFastMode: Schema.Boolean,
  supportsThinkingToggle: Schema.Boolean,
  contextWindowOptions: Schema.Array(ContextWindowOption),
  promptInjectedEffortLevels: Schema.Array(TrimmedNonEmptyString),
});
export type ModelCapabilities = typeof ModelCapabilities.Type;

export const DEFAULT_MODEL_BY_PROVIDER: Record<ProviderKind, ModelSlug> = {
  codex: "gpt-5.4",
  gemini: "gemini-3.1-pro-preview",
  claudeAgent: "claude-sonnet-4-6",
  opencode: "opencode/big-pickle",
} as const satisfies Record<ProviderKind, ModelSlug>;

export const MODEL_OPTIONS = MODEL_OPTIONS_BY_PROVIDER.codex;
export const DEFAULT_MODEL = DEFAULT_MODEL_BY_PROVIDER.codex;

/** Per-provider text generation model defaults. */
export const DEFAULT_GIT_TEXT_GENERATION_MODEL_BY_PROVIDER: Record<ProviderKind, ModelSlug> = {
  codex: "gpt-5.4-mini",
  gemini: "gemini-2.5-flash",
  claudeAgent: "claude-haiku-4-5",
  opencode: "opencode/big-pickle",
};

export const DEFAULT_GIT_TEXT_GENERATION_MODEL =
  DEFAULT_GIT_TEXT_GENERATION_MODEL_BY_PROVIDER.codex;

export const MODEL_SLUG_ALIASES_BY_PROVIDER: Record<ProviderKind, Record<string, ModelSlug>> = {
  codex: {
    "5.4": "gpt-5.4",
    "5.3": "gpt-5.3-codex",
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
    nano: "opencode/gpt-5-nano",
    "gpt-5-nano": "opencode/gpt-5-nano",
    "mimo-v2-omni": "opencode/mimo-v2-omni-free",
    "mimo-v2-pro": "opencode/mimo-v2-pro-free",
    minimax: "opencode-go/minimax-m2.7",
    "minimax-m2.5-free": "opencode/minimax-m2.5-free",
    "nemotron-3-super-free": "opencode/nemotron-3-super-free",
    kimi: "opencode-go/kimi-k2.5",
    "kimi-2.5": "opencode-go/kimi-k2.5",
    "kimi-k2.5": "opencode-go/kimi-k2.5",
    "glm-5": "opencode-go/glm-5",
    "minimax-m2.5": "opencode-go/minimax-m2.5",
    "minimax-m2.7": "opencode-go/minimax-m2.7",
    deepseek: "local_ollama/deepseek-r1:8b",
    "deepseek-r1": "local_ollama/deepseek-r1:8b",
    qwen: "local_ollama/qwen3:8b",
    "qwen2.5-coder": "local_ollama/qwen2.5-coder:7b",
    "qwen3-vl": "local_ollama/qwen3-vl:8b",
    "qwen3:8b": "local_ollama/qwen3:8b",
    ollama: "ollama/nemotron-3-super",
    "ollama-nemotron": "ollama/nemotron-3-super",
  },
};

export const PROVIDER_DISPLAY_NAMES: Record<ProviderKind, string> = {
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
} as const satisfies Record<ProviderKind, readonly ProviderReasoningEffort[]>;

export const DEFAULT_REASONING_EFFORT_BY_PROVIDER = {
  codex: "high",
  gemini: "high",
  claudeAgent: "high",
  opencode: "high",
} as const satisfies Record<ProviderKind, ProviderReasoningEffort>;
