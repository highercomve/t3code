import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import * as SchemaTransformation from "effect/SchemaTransformation";
import { TrimmedNonEmptyString } from "./baseSchemas.ts";
import { ProviderDriverKind } from "./providerInstance.ts";

export const CODEX_REASONING_EFFORT_OPTIONS = ["xhigh", "high", "medium", "low"] as const;
export type CodexReasoningEffort = (typeof CODEX_REASONING_EFFORT_OPTIONS)[number];
export const CLAUDE_CODE_EFFORT_OPTIONS = [
  "low",
  "medium",
  "high",
  "max",
  "ultrathink",
] as const;
export type ClaudeCodeEffort = (typeof CLAUDE_CODE_EFFORT_OPTIONS)[number];

export const ProviderOptionDescriptorType = Schema.Literals(["select", "boolean"]);
export type ProviderOptionDescriptorType = typeof ProviderOptionDescriptorType.Type;

export const ProviderOptionChoice = Schema.Struct({
  id: TrimmedNonEmptyString,
  label: TrimmedNonEmptyString,
  description: Schema.optional(TrimmedNonEmptyString),
  isDefault: Schema.optional(Schema.Boolean),
});
export type ProviderOptionChoice = typeof ProviderOptionChoice.Type;

const ProviderOptionDescriptorBase = {
  id: TrimmedNonEmptyString,
  label: TrimmedNonEmptyString,
  description: Schema.optional(TrimmedNonEmptyString),
} as const;

export const SelectProviderOptionDescriptor = Schema.Struct({
  ...ProviderOptionDescriptorBase,
  type: Schema.Literal("select"),
  options: Schema.Array(ProviderOptionChoice),
  currentValue: Schema.optional(TrimmedNonEmptyString),
  promptInjectedValues: Schema.optional(Schema.Array(TrimmedNonEmptyString)),
});
export type SelectProviderOptionDescriptor = typeof SelectProviderOptionDescriptor.Type;

export const BooleanProviderOptionDescriptor = Schema.Struct({
  ...ProviderOptionDescriptorBase,
  type: Schema.Literal("boolean"),
  currentValue: Schema.optional(Schema.Boolean),
});
export type BooleanProviderOptionDescriptor = typeof BooleanProviderOptionDescriptor.Type;

export const ProviderOptionDescriptor = Schema.Union([
  SelectProviderOptionDescriptor,
  BooleanProviderOptionDescriptor,
]);
export type ProviderOptionDescriptor = typeof ProviderOptionDescriptor.Type;

export const ProviderOptionSelectionValue = Schema.Union([TrimmedNonEmptyString, Schema.Boolean]);
export type ProviderOptionSelectionValue = typeof ProviderOptionSelectionValue.Type;

export const ProviderOptionSelection = Schema.Struct({
  id: TrimmedNonEmptyString,
  value: ProviderOptionSelectionValue,
});
export type ProviderOptionSelection = typeof ProviderOptionSelection.Type;

/**
 * Legacy on-disk shape for provider option selections, kept readable by the
 * decoder so we can tolerate stored data written before the v3 array shape.
 *
 * Persisted historically as `{ effort: "max", fastMode: true, ... }` inside
 * `modelSelection.options`. Migration 026 rewrites stored rows to the
 * canonical array shape, but we still see the legacy form in:
 *   - `settings.json` files from older client builds,
 *   - SQLite databases that have not yet run migration 026,
 *   - any future regression that re-introduces the legacy shape.
 */
const LegacyProviderOptionSelectionsObject = Schema.Record(Schema.String, Schema.Unknown);

const ProviderOptionSelectionsFromLegacyObject = LegacyProviderOptionSelectionsObject.pipe(
  Schema.decodeTo(
    Schema.Array(ProviderOptionSelection),
    SchemaTransformation.transformOrFail({
      decode: (record) => Effect.succeed(coerceLegacyOptionsObjectToArray(record)),
      encode: (selections) => Effect.succeed(canonicalSelectionsToLegacyObject(selections)),
    }),
  ),
);

/**
 * Schema for the `options` field of every `ModelSelection` variant.
 *
 * Accepts both:
 *   - the canonical array shape `Array<{ id, value }>` (preferred), and
 *   - the legacy object shape `Record<string, string | boolean | …>` from
 *     pre-migration data.
 *
 * Always normalizes to the canonical array on decode and re-encodes as the
 * canonical array, so any legacy storage gets cleaned up the next time the
 * containing record is written back.
 */
export const ProviderOptionSelections = Schema.Union([
  Schema.Array(ProviderOptionSelection),
  ProviderOptionSelectionsFromLegacyObject,
]);
export type ProviderOptionSelections = typeof ProviderOptionSelections.Type;

function coerceLegacyOptionsObjectToArray(
  record: Record<string, unknown>,
): ReadonlyArray<ProviderOptionSelection> {
  const entries: Array<ProviderOptionSelection> = [];
  for (const [rawKey, rawValue] of Object.entries(record)) {
    const id = typeof rawKey === "string" ? rawKey.trim() : "";
    if (id.length === 0) continue;
    if (typeof rawValue === "string") {
      const trimmed = rawValue.trim();
      if (trimmed.length > 0) entries.push({ id, value: trimmed });
    } else if (typeof rawValue === "boolean") {
      entries.push({ id, value: rawValue });
    }
    // Drop anything else (numbers, null, nested objects/arrays) to match the
    // permissive normalization performed by migration 026.
  }
  return entries;
}

function canonicalSelectionsToLegacyObject(
  selections: ReadonlyArray<ProviderOptionSelection>,
): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (const { id, value } of selections) {
    out[id] = value;
  }
  return out;
}

export const ModelCapabilities = Schema.Struct({
  optionDescriptors: Schema.optional(Schema.Array(ProviderOptionDescriptor)),
  reasoningEffortLevels: Schema.optional(
    Schema.Array(
      Schema.Struct({
        value: Schema.String,
        label: Schema.String,
        isDefault: Schema.optional(Schema.Boolean),
      }),
    ),
  ),
  supportsFastMode: Schema.optional(Schema.Boolean),
  supportsThinkingToggle: Schema.optional(Schema.Boolean),
  contextWindowOptions: Schema.optional(
    Schema.Array(
      Schema.Struct({
        value: Schema.String,
        label: Schema.String,
        isDefault: Schema.optional(Schema.Boolean),
      }),
    ),
  ),
  promptInjectedEffortLevels: Schema.optional(Schema.Array(Schema.String)),
});
export type ModelCapabilities = typeof ModelCapabilities.Type;

export const CODEX_DRIVER_KIND = ProviderDriverKind.make("codex");
export const CLAUDE_DRIVER_KIND = ProviderDriverKind.make("claudeAgent");
export const CURSOR_DRIVER_KIND = ProviderDriverKind.make("cursor");
export const OPENCODE_DRIVER_KIND = ProviderDriverKind.make("opencode");
export const ANTIGRAVITY_DRIVER_KIND = ProviderDriverKind.make("antigravity");
export const COPILOT_DRIVER_KIND = ProviderDriverKind.make("copilotAgent");

export const DEFAULT_MODEL = "gpt-5.4";
export const DEFAULT_GIT_TEXT_GENERATION_MODEL = "gpt-5.4-mini";

export const DEFAULT_MODEL_BY_PROVIDER: Partial<Record<ProviderDriverKind, string>> = {
  [CODEX_DRIVER_KIND]: DEFAULT_MODEL,
  [CLAUDE_DRIVER_KIND]: "claude-sonnet-4-6",
  [CURSOR_DRIVER_KIND]: "auto",
  [OPENCODE_DRIVER_KIND]: "openai/gpt-5",
  [ANTIGRAVITY_DRIVER_KIND]: "gemini-3.1-pro-high",
  [COPILOT_DRIVER_KIND]: "claude-sonnet-4.6",
};

/** Per-provider text generation model defaults. */
export const DEFAULT_GIT_TEXT_GENERATION_MODEL_BY_PROVIDER: Partial<
  Record<ProviderDriverKind, string>
> = {
  [CODEX_DRIVER_KIND]: DEFAULT_GIT_TEXT_GENERATION_MODEL,
  [CLAUDE_DRIVER_KIND]: "claude-haiku-4-5",
  [CURSOR_DRIVER_KIND]: "composer-2",
  [OPENCODE_DRIVER_KIND]: "openai/gpt-5",
  [ANTIGRAVITY_DRIVER_KIND]: "gemini-3.5-flash-medium",
  [COPILOT_DRIVER_KIND]: "claude-haiku-4-5",
};

export const MODEL_SLUG_ALIASES_BY_PROVIDER: Partial<
  Record<ProviderDriverKind, Record<string, string>>
> = {
  [CODEX_DRIVER_KIND]: {
    "gpt-5-codex": "gpt-5.4",
    "5.4": "gpt-5.4",
    "5.3": "gpt-5.3-codex",
    "gpt-5.3": "gpt-5.3-codex",
    "5.3-spark": "gpt-5.3-codex-spark",
    "gpt-5.3-spark": "gpt-5.3-codex-spark",
  },
  [CLAUDE_DRIVER_KIND]: {
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
  [CURSOR_DRIVER_KIND]: {
    composer: "composer-2",
    "composer-1.5": "composer-1.5",
    "composer-1": "composer-1.5",
    "opus-4.6-thinking": "claude-opus-4-6",
    "opus-4.6": "claude-opus-4-6",
    "sonnet-4.6-thinking": "claude-sonnet-4-6",
    "sonnet-4.6": "claude-sonnet-4-6",
    "opus-4.5-thinking": "claude-opus-4-5",
    "opus-4.5": "claude-opus-4-5",
  },
  [OPENCODE_DRIVER_KIND]: {},
  [ANTIGRAVITY_DRIVER_KIND]: {
    "gemini-2.5-pro": "gemini-3.1-pro-high",
    "gemini-2.5-flash": "gemini-3.5-flash-medium",
    "gemini-2.5-flash-lite": "gemini-3.5-flash-low",
    "gemini-3.1-pro": "gemini-3.1-pro-high",
    "gemini-3.1-pro-preview": "gemini-3.1-pro-high",
    "gemini-3-flash-preview": "gemini-3.5-flash-medium",
    pro: "gemini-3.1-pro-high",
    flash: "gemini-3.5-flash-medium",
  },
  [COPILOT_DRIVER_KIND]: {
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

// ── Provider display names ────────────────────────────────────────────

export const PROVIDER_DISPLAY_NAMES: Partial<Record<ProviderDriverKind, string>> = {
  [CODEX_DRIVER_KIND]: "Codex",
  [CLAUDE_DRIVER_KIND]: "Claude",
  [CURSOR_DRIVER_KIND]: "Cursor",
  [OPENCODE_DRIVER_KIND]: "OpenCode",
  [ANTIGRAVITY_DRIVER_KIND]: "Antigravity",
  [COPILOT_DRIVER_KIND]: "Copilot",
};

// ── Per-provider model options structs ─────────────────────────────────

export const CodexModelOptions = Schema.Struct({
  reasoningEffort: Schema.optional(Schema.Literals(CODEX_REASONING_EFFORT_OPTIONS)),
  fastMode: Schema.optional(Schema.Boolean),
});
export type CodexModelOptions = typeof CodexModelOptions.Type;

export const ANTIGRAVITY_EFFORT_OPTIONS = ["low", "medium", "high", "xhigh"] as const;
export type AntigravityEffort = (typeof ANTIGRAVITY_EFFORT_OPTIONS)[number];

export const AntigravityModelOptions = Schema.Struct({
  reasoningEffort: Schema.optional(Schema.Literals(ANTIGRAVITY_EFFORT_OPTIONS)),
});
export type AntigravityModelOptions = typeof AntigravityModelOptions.Type;

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

export const CopilotModelOptions = Schema.Struct({
  reasoningEffort: Schema.optional(Schema.Literals(CODEX_REASONING_EFFORT_OPTIONS)),
});
export type CopilotModelOptions = typeof CopilotModelOptions.Type;

export const ProviderModelOptions = Schema.Struct({
  codex: Schema.optional(CodexModelOptions),
  antigravity: Schema.optional(AntigravityModelOptions),
  claudeAgent: Schema.optional(ClaudeModelOptions),
  opencode: Schema.optional(OpencodeModelOptions),
  copilotAgent: Schema.optional(CopilotModelOptions),
});
export type ProviderModelOptions = typeof ProviderModelOptions.Type;

export const TolerantCodexModelOptions = Schema.optional(CodexModelOptions).pipe(
  Schema.withDecodingDefault(Effect.succeed(undefined)),
);
export const TolerantAntigravityModelOptions = Schema.optional(AntigravityModelOptions).pipe(
  Schema.withDecodingDefault(Effect.succeed(undefined)),
);
export const TolerantClaudeModelOptions = Schema.optional(ClaudeModelOptions).pipe(
  Schema.withDecodingDefault(Effect.succeed(undefined)),
);
export const TolerantOpencodeModelOptions = Schema.optional(OpencodeModelOptions).pipe(
  Schema.withDecodingDefault(Effect.succeed(undefined)),
);
export const TolerantCopilotModelOptions = Schema.optional(CopilotModelOptions).pipe(
  Schema.withDecodingDefault(Effect.succeed(undefined)),
);
