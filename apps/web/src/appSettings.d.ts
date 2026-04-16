import { Schema } from "effect";
import { type ProviderKind, type ProviderStartOptions } from "@t3tools/contracts";
export declare const MAX_CUSTOM_MODEL_LENGTH = 256;
export declare const TimestampFormat: Schema.Literals<readonly ["locale", "12-hour", "24-hour"]>;
export type TimestampFormat = typeof TimestampFormat.Type;
export declare const DEFAULT_TIMESTAMP_FORMAT: TimestampFormat;
type CustomModelSettingsKey = "customCodexModels" | "customClaudeModels" | "customGeminiModels" | "customOpencodeModels" | "customCopilotModels";
export type ProviderCustomModelConfig = {
    provider: ProviderKind;
    settingsKey: CustomModelSettingsKey;
    defaultSettingsKey: CustomModelSettingsKey;
    title: string;
    description: string;
    placeholder: string;
    example: string;
};
export declare const AppSettingsSchema: Schema.Struct<{
    readonly claudeBinaryPath: Schema.withDecodingDefault<Schema.withConstructorDefault<Schema.String>>;
    readonly codexBinaryPath: Schema.withDecodingDefault<Schema.withConstructorDefault<Schema.String>>;
    readonly codexHomePath: Schema.withDecodingDefault<Schema.withConstructorDefault<Schema.String>>;
    readonly copilotBinaryPath: Schema.withDecodingDefault<Schema.withConstructorDefault<Schema.String>>;
    readonly defaultThreadEnvMode: Schema.withDecodingDefault<Schema.withConstructorDefault<Schema.Literals<readonly ["local", "worktree"]>>>;
    readonly confirmThreadDelete: Schema.withDecodingDefault<Schema.withConstructorDefault<Schema.Boolean>>;
    readonly diffWordWrap: Schema.withDecodingDefault<Schema.withConstructorDefault<Schema.Boolean>>;
    readonly enableAssistantStreaming: Schema.withDecodingDefault<Schema.withConstructorDefault<Schema.Boolean>>;
    readonly timestampFormat: Schema.withDecodingDefault<Schema.withConstructorDefault<Schema.Literals<readonly ["locale", "12-hour", "24-hour"]>>>;
    readonly customCodexModels: Schema.withDecodingDefault<Schema.withConstructorDefault<Schema.$Array<Schema.String>>>;
    readonly customClaudeModels: Schema.withDecodingDefault<Schema.withConstructorDefault<Schema.$Array<Schema.String>>>;
    readonly customGeminiModels: Schema.withDecodingDefault<Schema.withConstructorDefault<Schema.$Array<Schema.String>>>;
    readonly customOpencodeModels: Schema.withDecodingDefault<Schema.withConstructorDefault<Schema.$Array<Schema.String>>>;
    readonly customCopilotModels: Schema.withDecodingDefault<Schema.withConstructorDefault<Schema.$Array<Schema.String>>>;
    readonly geminiApiKey: Schema.withDecodingDefault<Schema.withConstructorDefault<Schema.String>>;
    readonly textGenerationModel: Schema.optional<Schema.Trim>;
}>;
export type AppSettings = typeof AppSettingsSchema.Type;
export interface AppModelOption {
    slug: string;
    name: string;
    isCustom: boolean;
}
export declare const MODEL_PROVIDER_SETTINGS: ProviderCustomModelConfig[];
export declare function normalizeCustomModelSlugs(models: Iterable<string | null | undefined>, provider?: ProviderKind): string[];
export declare function getCustomModelsForProvider(settings: Pick<AppSettings, CustomModelSettingsKey>, provider: ProviderKind): readonly string[];
export declare function getDefaultCustomModelsForProvider(defaults: Pick<AppSettings, CustomModelSettingsKey>, provider: ProviderKind): readonly string[];
export declare function patchCustomModels(provider: ProviderKind, models: string[]): Partial<Pick<AppSettings, CustomModelSettingsKey>>;
export declare function getCustomModelsByProvider(settings: Pick<AppSettings, CustomModelSettingsKey>): Record<ProviderKind, readonly string[]>;
export declare function getAppModelOptions(provider: ProviderKind, customModels: readonly string[], selectedModel?: string | null, dynamicModels?: ReadonlyArray<{
    id: string;
    name: string;
}>): AppModelOption[];
export declare function resolveAppModelSelection(provider: ProviderKind, customModels: Record<ProviderKind, readonly string[]>, selectedModel: string | null | undefined): string;
export declare function getCustomModelOptionsByProvider(settings: Pick<AppSettings, CustomModelSettingsKey>, dynamicModelsByProvider?: Partial<Record<ProviderKind, ReadonlyArray<{
    id: string;
    name: string;
}>>>): Record<ProviderKind, ReadonlyArray<{
    slug: string;
    name: string;
}>>;
export declare function getProviderStartOptions(settings: Pick<AppSettings, "claudeBinaryPath" | "codexBinaryPath" | "codexHomePath" | "copilotBinaryPath">): ProviderStartOptions | undefined;
export declare function useAppSettings(): {
    readonly settings: {
        readonly enableAssistantStreaming: boolean;
        readonly defaultThreadEnvMode: "local" | "worktree";
        readonly confirmThreadDelete: boolean;
        readonly diffWordWrap: boolean;
        readonly timestampFormat: "locale" | "12-hour" | "24-hour";
        readonly customCodexModels: readonly string[];
        readonly customClaudeModels: readonly string[];
        readonly customGeminiModels: readonly string[];
        readonly customOpencodeModels: readonly string[];
        readonly customCopilotModels: readonly string[];
        readonly claudeBinaryPath: string;
        readonly codexBinaryPath: string;
        readonly codexHomePath: string;
        readonly copilotBinaryPath: string;
        readonly geminiApiKey: string;
        readonly textGenerationModel?: string | undefined;
    };
    readonly updateSettings: (patch: Partial<AppSettings>) => void;
    readonly resetSettings: () => void;
    readonly defaults: {
        readonly enableAssistantStreaming: boolean;
        readonly defaultThreadEnvMode: "local" | "worktree";
        readonly confirmThreadDelete: boolean;
        readonly diffWordWrap: boolean;
        readonly timestampFormat: "locale" | "12-hour" | "24-hour";
        readonly customCodexModels: readonly string[];
        readonly customClaudeModels: readonly string[];
        readonly customGeminiModels: readonly string[];
        readonly customOpencodeModels: readonly string[];
        readonly customCopilotModels: readonly string[];
        readonly claudeBinaryPath: string;
        readonly codexBinaryPath: string;
        readonly codexHomePath: string;
        readonly copilotBinaryPath: string;
        readonly geminiApiKey: string;
        readonly textGenerationModel?: string | undefined;
    };
};
export {};
