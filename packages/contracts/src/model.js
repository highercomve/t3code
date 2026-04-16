import { Schema } from "effect";
import { TrimmedNonEmptyString } from "./baseSchemas";
export const CODEX_REASONING_EFFORT_OPTIONS = ["xhigh", "high", "medium", "low"];
export const CLAUDE_CODE_EFFORT_OPTIONS = ["low", "medium", "high", "max", "ultrathink"];
export const CodexModelOptions = Schema.Struct({
    reasoningEffort: Schema.optional(Schema.Literals(CODEX_REASONING_EFFORT_OPTIONS)),
    fastMode: Schema.optional(Schema.Boolean),
});
export const GEMINI_EFFORT_OPTIONS = ["low", "medium", "high", "xhigh"];
export const GeminiModelOptions = Schema.Struct({
    thinkingBudget: Schema.optional(Schema.Int),
    reasoningEffort: Schema.optional(Schema.Literals(GEMINI_EFFORT_OPTIONS)),
});
export const GEMINI_EFFORT_TO_THINKING_BUDGET = {
    low: 1024,
    medium: 8192,
    high: 16384,
    xhigh: 24576,
};
export const ClaudeModelOptions = Schema.Struct({
    thinking: Schema.optional(Schema.Boolean),
    effort: Schema.optional(Schema.Literals(CLAUDE_CODE_EFFORT_OPTIONS)),
    fastMode: Schema.optional(Schema.Boolean),
    contextWindow: Schema.optional(Schema.String),
});
export const OpencodeModelOptions = Schema.Struct({
    reasoningEffort: Schema.optional(Schema.Literals(CODEX_REASONING_EFFORT_OPTIONS)),
});
export const CopilotModelOptions = Schema.Struct({
    reasoningEffort: Schema.optional(Schema.Literals(CODEX_REASONING_EFFORT_OPTIONS)),
});
export const ProviderModelOptions = Schema.Struct({
    codex: Schema.optional(CodexModelOptions),
    gemini: Schema.optional(GeminiModelOptions),
    claudeAgent: Schema.optional(ClaudeModelOptions),
    opencode: Schema.optional(OpencodeModelOptions),
    copilotAgent: Schema.optional(CopilotModelOptions),
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
        { slug: "claude-opus-4-7", name: "Claude Opus 4.7" },
        { slug: "claude-opus-4-6", name: "Claude Opus 4.6" },
        { slug: "claude-sonnet-4-6", name: "Claude Sonnet 4.6" },
        { slug: "claude-haiku-4-5", name: "Claude Haiku 4.5" },
    ],
    opencode: [
        { slug: "opencode/big-pickle", name: "Big Pickle" },
        { slug: "opencode/gpt-5-nano", name: "GPT-5 Nano" },
        { slug: "opencode/minimax-m2.5-free", name: "MiniMax M2.5 Free" },
        { slug: "opencode/nemotron-3-super-free", name: "Nemotron 3 Super Free" },
        { slug: "opencode-go/glm-5", name: "GLM-5 (Go)" },
        { slug: "opencode-go/glm-5.1", name: "GLM-5.1 (Go)" },
        { slug: "opencode-go/kimi-k2.5", name: "Kimi K2.5 (Go)" },
        { slug: "opencode-go/mimo-v2-omni", name: "MiMo V2 Omni (Go)" },
        { slug: "opencode-go/mimo-v2-pro", name: "MiMo V2 Pro (Go)" },
        { slug: "opencode-go/minimax-m2.5", name: "MiniMax M2.5 (Go)" },
        { slug: "opencode-go/minimax-m2.7", name: "MiniMax M2.7 (Go)" },
        { slug: "ollama/gemma4", name: "Gemma 4 (Ollama Cloud)" },
        { slug: "ollama/gemma4:31b-cloud", name: "Gemma 4 31B (Ollama Cloud)" },
        { slug: "ollama/nemotron-3-super", name: "Nemotron 3 Super (Ollama Cloud)" },
    ],
    copilotAgent: [
        { slug: "claude-sonnet-4.6", name: "Claude Sonnet 4.6" },
        { slug: "claude-sonnet-4.5", name: "Claude Sonnet 4.5" },
        { slug: "claude-haiku-4.5", name: "Claude Haiku 4.5" },
        { slug: "claude-opus-4.6", name: "Claude Opus 4.6" },
        { slug: "claude-opus-4.6-fast", name: "Claude Opus 4.6 Fast" },
        { slug: "claude-opus-4.5", name: "Claude Opus 4.5" },
        { slug: "claude-sonnet-4", name: "Claude Sonnet 4" },
        { slug: "gemini-3-pro-preview", name: "Gemini 3 Pro Preview" },
        { slug: "gpt-5.4", name: "GPT-5.4" },
        { slug: "gpt-5.3-codex", name: "GPT-5.3 Codex" },
        { slug: "gpt-5.2-codex", name: "GPT-5.2 Codex" },
        { slug: "gpt-5.2", name: "GPT-5.2" },
        { slug: "gpt-5.1-codex-max", name: "GPT-5.1 Codex Max" },
        { slug: "gpt-5.1-codex", name: "GPT-5.1 Codex" },
        { slug: "gpt-5.1", name: "GPT-5.1" },
        { slug: "gpt-5.4-mini", name: "GPT-5.4 Mini" },
        { slug: "gpt-5.1-codex-mini", name: "GPT-5.1 Codex Mini" },
        { slug: "gpt-5-mini", name: "GPT-5 Mini" },
        { slug: "gpt-4.1", name: "GPT-4.1" },
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
    copilotAgent: "claude-sonnet-4.6",
};
export const MODEL_OPTIONS = MODEL_OPTIONS_BY_PROVIDER.codex;
export const DEFAULT_MODEL = DEFAULT_MODEL_BY_PROVIDER.codex;
/** Per-provider text generation model defaults. */
export const DEFAULT_GIT_TEXT_GENERATION_MODEL_BY_PROVIDER = {
    codex: "gpt-5.4-mini",
    gemini: "gemini-2.5-flash",
    claudeAgent: "claude-haiku-4-5",
    opencode: "opencode/big-pickle",
    copilotAgent: "claude-haiku-4.5",
};
export const DEFAULT_GIT_TEXT_GENERATION_MODEL = DEFAULT_GIT_TEXT_GENERATION_MODEL_BY_PROVIDER.codex;
export const MODEL_SLUG_ALIASES_BY_PROVIDER = {
    codex: {
        "gpt-5-codex": "gpt-5.4",
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
        opus: "claude-opus-4-7",
        "opus-4.7": "claude-opus-4-7",
        "claude-opus-4.7": "claude-opus-4-7",
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
        "gpt-5-nano": "opencode/gpt-5-nano",
        nano: "opencode/gpt-5-nano",
        "minimax-m2.5-free": "opencode/minimax-m2.5-free",
        minimax: "opencode/minimax-m2.5-free",
        nemotron: "opencode/nemotron-3-super-free",
        "glm-5": "opencode-go/glm-5",
        "glm-5.1": "opencode-go/glm-5.1",
        kimi: "opencode-go/kimi-k2.5",
        "kimi-k2.5": "opencode-go/kimi-k2.5",
        "mimo-v2-omni": "opencode-go/mimo-v2-omni",
        "mimo-v2-pro": "opencode-go/mimo-v2-pro",
        gemma4: "ollama/gemma4",
    },
    copilotAgent: {
        "claude-sonnet-4.6": "claude-sonnet-4.6",
        "claude-sonnet-4.5": "claude-sonnet-4.5",
        "claude-haiku-4.5": "claude-haiku-4.5",
        "claude-opus-4.6": "claude-opus-4.6",
        "claude-opus-4.6-fast": "claude-opus-4.6-fast",
        opus: "claude-opus-4.6",
        sonnet: "claude-sonnet-4.6",
        haiku: "claude-haiku-4.5",
        "gpt-5.4": "gpt-5.4",
        "gpt-5.3": "gpt-5.3-codex",
        "gpt-5.2": "gpt-5.2",
        "gpt-5.1": "gpt-5.1",
    },
};
export const PROVIDER_DISPLAY_NAMES = {
    codex: "Codex",
    gemini: "Gemini",
    claudeAgent: "Claude",
    opencode: "OpenCode",
    copilotAgent: "Copilot",
};
export const REASONING_EFFORT_OPTIONS_BY_PROVIDER = {
    codex: CODEX_REASONING_EFFORT_OPTIONS,
    gemini: CODEX_REASONING_EFFORT_OPTIONS,
    claudeAgent: CLAUDE_CODE_EFFORT_OPTIONS,
    opencode: CODEX_REASONING_EFFORT_OPTIONS,
    copilotAgent: CODEX_REASONING_EFFORT_OPTIONS,
};
export const DEFAULT_REASONING_EFFORT_BY_PROVIDER = {
    codex: "high",
    gemini: "high",
    claudeAgent: "high",
    opencode: "high",
    copilotAgent: "high",
};
