import { Effect } from "effect";
import * as Schema from "effect/Schema";
import * as SchemaTransformation from "effect/SchemaTransformation";
import { TrimmedNonEmptyString, TrimmedString } from "./baseSchemas";
import { ClaudeModelOptions, CodexModelOptions, CopilotModelOptions, GeminiModelOptions, OpencodeModelOptions, DEFAULT_GIT_TEXT_GENERATION_MODEL_BY_PROVIDER, } from "./model";
import { ModelSelection } from "./orchestration";
// ── Client Settings (local-only) ───────────────────────────────
export const TimestampFormat = Schema.Literals(["locale", "12-hour", "24-hour"]);
export const DEFAULT_TIMESTAMP_FORMAT = "locale";
export const SidebarProjectSortOrder = Schema.Literals(["updated_at", "created_at", "manual"]);
export const DEFAULT_SIDEBAR_PROJECT_SORT_ORDER = "updated_at";
export const SidebarThreadSortOrder = Schema.Literals(["updated_at", "created_at"]);
export const DEFAULT_SIDEBAR_THREAD_SORT_ORDER = "updated_at";
export const ClientSettingsSchema = Schema.Struct({
    confirmThreadArchive: Schema.Boolean.pipe(Schema.withDecodingDefault(Effect.succeed(false))),
    confirmThreadDelete: Schema.Boolean.pipe(Schema.withDecodingDefault(Effect.succeed(true))),
    diffWordWrap: Schema.Boolean.pipe(Schema.withDecodingDefault(Effect.succeed(false))),
    sidebarProjectSortOrder: SidebarProjectSortOrder.pipe(Schema.withDecodingDefault(Effect.succeed(DEFAULT_SIDEBAR_PROJECT_SORT_ORDER))),
    sidebarThreadSortOrder: SidebarThreadSortOrder.pipe(Schema.withDecodingDefault(Effect.succeed(DEFAULT_SIDEBAR_THREAD_SORT_ORDER))),
    timestampFormat: TimestampFormat.pipe(Schema.withDecodingDefault(Effect.succeed(DEFAULT_TIMESTAMP_FORMAT))),
});
export const DEFAULT_CLIENT_SETTINGS = Schema.decodeSync(ClientSettingsSchema)({});
// ── Server Settings (server-authoritative) ────────────────────
export const ThreadEnvMode = Schema.Literals(["local", "worktree"]);
const makeBinaryPathSetting = (fallback) => TrimmedString.pipe(Schema.decodeTo(Schema.String, SchemaTransformation.transformOrFail({
    decode: (value) => Effect.succeed(value || fallback),
    encode: (value) => Effect.succeed(value),
})), Schema.withDecodingDefault(Effect.succeed(fallback)));
export const CodexSettings = Schema.Struct({
    enabled: Schema.Boolean.pipe(Schema.withDecodingDefault(Effect.succeed(true))),
    binaryPath: makeBinaryPathSetting("codex"),
    homePath: TrimmedString.pipe(Schema.withDecodingDefault(Effect.succeed(""))),
    customModels: Schema.Array(Schema.String).pipe(Schema.withDecodingDefault(Effect.succeed([]))),
});
export const ClaudeSettings = Schema.Struct({
    enabled: Schema.Boolean.pipe(Schema.withDecodingDefault(Effect.succeed(true))),
    binaryPath: makeBinaryPathSetting("claude"),
    customModels: Schema.Array(Schema.String).pipe(Schema.withDecodingDefault(Effect.succeed([]))),
    launchArgs: Schema.String.pipe(Schema.withDecodingDefault(Effect.succeed(""))),
});
export const GeminiSettings = Schema.Struct({
    enabled: Schema.Boolean.pipe(Schema.withDecodingDefault(Effect.succeed(true))),
    binaryPath: makeBinaryPathSetting("gemini"),
    homePath: TrimmedString.pipe(Schema.withDecodingDefault(Effect.succeed(""))),
    customModels: Schema.Array(Schema.String).pipe(Schema.withDecodingDefault(Effect.succeed([]))),
});
export const OpencodeSettings = Schema.Struct({
    enabled: Schema.Boolean.pipe(Schema.withDecodingDefault(Effect.succeed(true))),
    binaryPath: makeBinaryPathSetting("opencode"),
    apiKey: TrimmedString.pipe(Schema.withDecodingDefault(Effect.succeed(""))),
    customModels: Schema.Array(Schema.String).pipe(Schema.withDecodingDefault(Effect.succeed([]))),
});
export const CopilotSettings = Schema.Struct({
    enabled: Schema.Boolean.pipe(Schema.withDecodingDefault(Effect.succeed(true))),
    binaryPath: makeBinaryPathSetting("copilot"),
    customModels: Schema.Array(Schema.String).pipe(Schema.withDecodingDefault(Effect.succeed([]))),
});
export const ObservabilitySettings = Schema.Struct({
    otlpTracesUrl: TrimmedString.pipe(Schema.withDecodingDefault(Effect.succeed(""))),
    otlpMetricsUrl: TrimmedString.pipe(Schema.withDecodingDefault(Effect.succeed(""))),
});
export const ServerSettings = Schema.Struct({
    enableAssistantStreaming: Schema.Boolean.pipe(Schema.withDecodingDefault(Effect.succeed(false))),
    defaultThreadEnvMode: ThreadEnvMode.pipe(Schema.withDecodingDefault(Effect.succeed("local"))),
    addProjectBaseDirectory: TrimmedString.pipe(Schema.withDecodingDefault(Effect.succeed(""))),
    textGenerationModelSelection: ModelSelection.pipe(Schema.withDecodingDefault(Effect.succeed({
        provider: "gemini",
        model: DEFAULT_GIT_TEXT_GENERATION_MODEL_BY_PROVIDER.gemini,
    }))),
    // Provider specific settings
    providers: Schema.Struct({
        codex: CodexSettings.pipe(Schema.withDecodingDefault(Effect.succeed({}))),
        gemini: GeminiSettings.pipe(Schema.withDecodingDefault(Effect.succeed({}))),
        claudeAgent: ClaudeSettings.pipe(Schema.withDecodingDefault(Effect.succeed({}))),
        opencode: OpencodeSettings.pipe(Schema.withDecodingDefault(Effect.succeed({}))),
        copilotAgent: CopilotSettings.pipe(Schema.withDecodingDefault(Effect.succeed({}))),
    }).pipe(Schema.withDecodingDefault(Effect.succeed({}))),
    observability: ObservabilitySettings.pipe(Schema.withDecodingDefault(Effect.succeed({}))),
});
export const DEFAULT_SERVER_SETTINGS = Schema.decodeSync(ServerSettings)({});
export class ServerSettingsError extends Schema.TaggedErrorClass()("ServerSettingsError", {
    settingsPath: Schema.String,
    detail: Schema.String,
    cause: Schema.optional(Schema.Defect),
}) {
    get message() {
        return `Server settings error at ${this.settingsPath}: ${this.detail}`;
    }
}
export const DEFAULT_UNIFIED_SETTINGS = {
    ...DEFAULT_SERVER_SETTINGS,
    ...DEFAULT_CLIENT_SETTINGS,
};
// ── Server Settings Patch (replace with a Schema.deepPartial if available) ──────────────────────────────────────────
const CodexModelOptionsPatch = Schema.Struct({
    reasoningEffort: Schema.optionalKey(CodexModelOptions.fields.reasoningEffort),
    fastMode: Schema.optionalKey(CodexModelOptions.fields.fastMode),
});
const ClaudeModelOptionsPatch = Schema.Struct({
    thinking: Schema.optionalKey(ClaudeModelOptions.fields.thinking),
    effort: Schema.optionalKey(ClaudeModelOptions.fields.effort),
    fastMode: Schema.optionalKey(ClaudeModelOptions.fields.fastMode),
    contextWindow: Schema.optionalKey(ClaudeModelOptions.fields.contextWindow),
});
const GeminiModelOptionsPatch = Schema.Struct({
    thinkingBudget: Schema.optionalKey(GeminiModelOptions.fields.thinkingBudget),
});
const OpencodeModelOptionsPatch = Schema.Struct({
    reasoningEffort: Schema.optionalKey(OpencodeModelOptions.fields.reasoningEffort),
});
const CopilotModelOptionsPatch = Schema.Struct({
    reasoningEffort: Schema.optionalKey(CopilotModelOptions.fields.reasoningEffort),
});
const ModelSelectionPatch = Schema.Union([
    Schema.Struct({
        provider: Schema.optionalKey(Schema.Literal("codex")),
        model: Schema.optionalKey(TrimmedNonEmptyString),
        options: Schema.optionalKey(CodexModelOptionsPatch),
    }),
    Schema.Struct({
        provider: Schema.optionalKey(Schema.Literal("gemini")),
        model: Schema.optionalKey(TrimmedNonEmptyString),
        options: Schema.optionalKey(GeminiModelOptionsPatch),
    }),
    Schema.Struct({
        provider: Schema.optionalKey(Schema.Literal("claudeAgent")),
        model: Schema.optionalKey(TrimmedNonEmptyString),
        options: Schema.optionalKey(ClaudeModelOptionsPatch),
    }),
    Schema.Struct({
        provider: Schema.optionalKey(Schema.Literal("opencode")),
        model: Schema.optionalKey(TrimmedNonEmptyString),
        options: Schema.optionalKey(OpencodeModelOptionsPatch),
    }),
    Schema.Struct({
        provider: Schema.optionalKey(Schema.Literal("copilotAgent")),
        model: Schema.optionalKey(TrimmedNonEmptyString),
        options: Schema.optionalKey(CopilotModelOptionsPatch),
    }),
]);
const CodexSettingsPatch = Schema.Struct({
    enabled: Schema.optionalKey(Schema.Boolean),
    binaryPath: Schema.optionalKey(Schema.String),
    homePath: Schema.optionalKey(Schema.String),
    customModels: Schema.optionalKey(Schema.Array(Schema.String)),
});
const ClaudeSettingsPatch = Schema.Struct({
    enabled: Schema.optionalKey(Schema.Boolean),
    binaryPath: Schema.optionalKey(Schema.String),
    customModels: Schema.optionalKey(Schema.Array(Schema.String)),
    launchArgs: Schema.optionalKey(Schema.String),
});
const GeminiSettingsPatch = Schema.Struct({
    enabled: Schema.optionalKey(Schema.Boolean),
    binaryPath: Schema.optionalKey(Schema.String),
    homePath: Schema.optionalKey(Schema.String),
    customModels: Schema.optionalKey(Schema.Array(Schema.String)),
});
const OpencodeSettingsPatch = Schema.Struct({
    enabled: Schema.optionalKey(Schema.Boolean),
    binaryPath: Schema.optionalKey(Schema.String),
    apiKey: Schema.optionalKey(Schema.String),
    customModels: Schema.optionalKey(Schema.Array(Schema.String)),
});
const CopilotSettingsPatch = Schema.Struct({
    enabled: Schema.optionalKey(Schema.Boolean),
    binaryPath: Schema.optionalKey(Schema.String),
    customModels: Schema.optionalKey(Schema.Array(Schema.String)),
});
export const ServerSettingsPatch = Schema.Struct({
    enableAssistantStreaming: Schema.optionalKey(Schema.Boolean),
    defaultThreadEnvMode: Schema.optionalKey(ThreadEnvMode),
    addProjectBaseDirectory: Schema.optionalKey(Schema.String),
    textGenerationModelSelection: Schema.optionalKey(ModelSelectionPatch),
    observability: Schema.optionalKey(Schema.Struct({
        otlpTracesUrl: Schema.optionalKey(Schema.String),
        otlpMetricsUrl: Schema.optionalKey(Schema.String),
    })),
    providers: Schema.optionalKey(Schema.Struct({
        codex: Schema.optionalKey(CodexSettingsPatch),
        gemini: Schema.optionalKey(GeminiSettingsPatch),
        claudeAgent: Schema.optionalKey(ClaudeSettingsPatch),
        opencode: Schema.optionalKey(OpencodeSettingsPatch),
        copilotAgent: Schema.optionalKey(CopilotSettingsPatch),
    })),
});
