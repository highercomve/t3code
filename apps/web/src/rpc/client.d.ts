import { Effect } from "effect";
import { AtomRpc } from "effect/unstable/reactivity";
declare const WsRpcAtomClient_base: AtomRpc.AtomRpcClient<WsRpcAtomClient, "WsRpcAtomClient", import("effect/unstable/rpc/Rpc").Rpc<"server.upsertKeybinding", import("effect/Schema").Struct<{
    readonly key: import("effect/Schema").Trim;
    readonly command: import("effect/Schema").Union<readonly [import("effect/Schema").Literals<readonly ["terminal.toggle", "terminal.split", "terminal.new", "terminal.close", "diff.toggle", "chat.new", "chat.newLocal", "editor.openFavorite", "thread.previous", "thread.next", "thread.jump.1", "thread.jump.2", "thread.jump.3", "thread.jump.4", "thread.jump.5", "thread.jump.6", "thread.jump.7", "thread.jump.8", "thread.jump.9"]>, import("effect/Schema").TemplateLiteral<readonly [import("effect/Schema").Literal<"script.">, import("effect/Schema").String, import("effect/Schema").Literal<".run">]>]>;
    readonly when: import("effect/Schema").optional<import("effect/Schema").Trim>;
}>, import("effect/Schema").Struct<{
    readonly keybindings: import("effect/Schema").$Array<import("effect/Schema").Struct<{
        readonly command: import("effect/Schema").Union<readonly [import("effect/Schema").Literals<readonly ["terminal.toggle", "terminal.split", "terminal.new", "terminal.close", "diff.toggle", "chat.new", "chat.newLocal", "editor.openFavorite", "thread.previous", "thread.next", "thread.jump.1", "thread.jump.2", "thread.jump.3", "thread.jump.4", "thread.jump.5", "thread.jump.6", "thread.jump.7", "thread.jump.8", "thread.jump.9"]>, import("effect/Schema").TemplateLiteral<readonly [import("effect/Schema").Literal<"script.">, import("effect/Schema").String, import("effect/Schema").Literal<".run">]>]>;
        readonly shortcut: import("effect/Schema").Struct<{
            readonly key: import("effect/Schema").Trim;
            readonly metaKey: import("effect/Schema").Boolean;
            readonly ctrlKey: import("effect/Schema").Boolean;
            readonly shiftKey: import("effect/Schema").Boolean;
            readonly altKey: import("effect/Schema").Boolean;
            readonly modKey: import("effect/Schema").Boolean;
        }>;
        readonly whenAst: import("effect/Schema").optional<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly type: import("effect/Schema").Literal<"identifier">;
            readonly name: import("effect/Schema").String;
        }>, import("effect/Schema").Struct<{
            readonly type: import("effect/Schema").Literal<"not">;
            readonly node: import("effect/Schema").suspend<import("effect/Schema").Codec<import("@t3tools/contracts").KeybindingWhenNode, import("@t3tools/contracts").KeybindingWhenNode, never, never>>;
        }>, import("effect/Schema").Struct<{
            readonly type: import("effect/Schema").Literal<"and">;
            readonly left: import("effect/Schema").suspend<import("effect/Schema").Codec<import("@t3tools/contracts").KeybindingWhenNode, import("@t3tools/contracts").KeybindingWhenNode, never, never>>;
            readonly right: import("effect/Schema").suspend<import("effect/Schema").Codec<import("@t3tools/contracts").KeybindingWhenNode, import("@t3tools/contracts").KeybindingWhenNode, never, never>>;
        }>, import("effect/Schema").Struct<{
            readonly type: import("effect/Schema").Literal<"or">;
            readonly left: import("effect/Schema").suspend<import("effect/Schema").Codec<import("@t3tools/contracts").KeybindingWhenNode, import("@t3tools/contracts").KeybindingWhenNode, never, never>>;
            readonly right: import("effect/Schema").suspend<import("effect/Schema").Codec<import("@t3tools/contracts").KeybindingWhenNode, import("@t3tools/contracts").KeybindingWhenNode, never, never>>;
        }>]>>;
    }>>;
    readonly issues: import("effect/Schema").$Array<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
        readonly kind: import("effect/Schema").Literal<"keybindings.malformed-config">;
        readonly message: import("effect/Schema").Trim;
    }>, import("effect/Schema").Struct<{
        readonly kind: import("effect/Schema").Literal<"keybindings.invalid-entry">;
        readonly message: import("effect/Schema").Trim;
        readonly index: import("effect/Schema").Number;
    }>]>>;
}>, typeof import("@t3tools/contracts").KeybindingsConfigError, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"server.getConfig", import("effect/Schema").Struct<{}>, import("effect/Schema").Struct<{
    readonly cwd: import("effect/Schema").Trim;
    readonly keybindingsConfigPath: import("effect/Schema").Trim;
    readonly keybindings: import("effect/Schema").$Array<import("effect/Schema").Struct<{
        readonly command: import("effect/Schema").Union<readonly [import("effect/Schema").Literals<readonly ["terminal.toggle", "terminal.split", "terminal.new", "terminal.close", "diff.toggle", "chat.new", "chat.newLocal", "editor.openFavorite", "thread.previous", "thread.next", "thread.jump.1", "thread.jump.2", "thread.jump.3", "thread.jump.4", "thread.jump.5", "thread.jump.6", "thread.jump.7", "thread.jump.8", "thread.jump.9"]>, import("effect/Schema").TemplateLiteral<readonly [import("effect/Schema").Literal<"script.">, import("effect/Schema").String, import("effect/Schema").Literal<".run">]>]>;
        readonly shortcut: import("effect/Schema").Struct<{
            readonly key: import("effect/Schema").Trim;
            readonly metaKey: import("effect/Schema").Boolean;
            readonly ctrlKey: import("effect/Schema").Boolean;
            readonly shiftKey: import("effect/Schema").Boolean;
            readonly altKey: import("effect/Schema").Boolean;
            readonly modKey: import("effect/Schema").Boolean;
        }>;
        readonly whenAst: import("effect/Schema").optional<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly type: import("effect/Schema").Literal<"identifier">;
            readonly name: import("effect/Schema").String;
        }>, import("effect/Schema").Struct<{
            readonly type: import("effect/Schema").Literal<"not">;
            readonly node: import("effect/Schema").suspend<import("effect/Schema").Codec<import("@t3tools/contracts").KeybindingWhenNode, import("@t3tools/contracts").KeybindingWhenNode, never, never>>;
        }>, import("effect/Schema").Struct<{
            readonly type: import("effect/Schema").Literal<"and">;
            readonly left: import("effect/Schema").suspend<import("effect/Schema").Codec<import("@t3tools/contracts").KeybindingWhenNode, import("@t3tools/contracts").KeybindingWhenNode, never, never>>;
            readonly right: import("effect/Schema").suspend<import("effect/Schema").Codec<import("@t3tools/contracts").KeybindingWhenNode, import("@t3tools/contracts").KeybindingWhenNode, never, never>>;
        }>, import("effect/Schema").Struct<{
            readonly type: import("effect/Schema").Literal<"or">;
            readonly left: import("effect/Schema").suspend<import("effect/Schema").Codec<import("@t3tools/contracts").KeybindingWhenNode, import("@t3tools/contracts").KeybindingWhenNode, never, never>>;
            readonly right: import("effect/Schema").suspend<import("effect/Schema").Codec<import("@t3tools/contracts").KeybindingWhenNode, import("@t3tools/contracts").KeybindingWhenNode, never, never>>;
        }>]>>;
    }>>;
    readonly issues: import("effect/Schema").$Array<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
        readonly kind: import("effect/Schema").Literal<"keybindings.malformed-config">;
        readonly message: import("effect/Schema").Trim;
    }>, import("effect/Schema").Struct<{
        readonly kind: import("effect/Schema").Literal<"keybindings.invalid-entry">;
        readonly message: import("effect/Schema").Trim;
        readonly index: import("effect/Schema").Number;
    }>]>>;
    readonly providers: import("effect/Schema").$Array<import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literals<readonly ["codex", "gemini", "claudeAgent", "opencode", "copilotAgent"]>;
        readonly enabled: import("effect/Schema").Boolean;
        readonly installed: import("effect/Schema").Boolean;
        readonly version: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
        readonly status: import("effect/Schema").Literals<readonly ["ready", "warning", "error", "disabled"]>;
        readonly auth: import("effect/Schema").Struct<{
            readonly status: import("effect/Schema").Literals<readonly ["authenticated", "unauthenticated", "unknown"]>;
            readonly type: import("effect/Schema").optional<import("effect/Schema").Trim>;
            readonly label: import("effect/Schema").optional<import("effect/Schema").Trim>;
        }>;
        readonly checkedAt: import("effect/Schema").String;
        readonly message: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly models: import("effect/Schema").$Array<import("effect/Schema").Struct<{
            readonly slug: import("effect/Schema").Trim;
            readonly name: import("effect/Schema").Trim;
            readonly isCustom: import("effect/Schema").Boolean;
            readonly capabilities: import("effect/Schema").NullOr<import("effect/Schema").Struct<{
                readonly reasoningEffortLevels: import("effect/Schema").$Array<import("effect/Schema").Struct<{
                    readonly value: import("effect/Schema").Trim;
                    readonly label: import("effect/Schema").Trim;
                    readonly isDefault: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                }>>;
                readonly supportsFastMode: import("effect/Schema").Boolean;
                readonly supportsThinkingToggle: import("effect/Schema").Boolean;
                readonly contextWindowOptions: import("effect/Schema").$Array<import("effect/Schema").Struct<{
                    readonly value: import("effect/Schema").Trim;
                    readonly label: import("effect/Schema").Trim;
                    readonly isDefault: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                }>>;
                readonly promptInjectedEffortLevels: import("effect/Schema").$Array<import("effect/Schema").Trim>;
            }>>;
        }>>;
        readonly dynamicModels: import("effect/Schema").optional<import("effect/Schema").$Array<import("effect/Schema").Struct<{
            readonly id: import("effect/Schema").String;
            readonly name: import("effect/Schema").String;
        }>>>;
    }>>;
    readonly availableEditors: import("effect/Schema").$Array<import("effect/Schema").Literals<("cursor" | "trae" | "vscode" | "vscode-insiders" | "vscodium" | "zed" | "antigravity" | "idea" | "file-manager")[]>>;
    readonly observability: import("effect/Schema").Struct<{
        readonly logsDirectoryPath: import("effect/Schema").Trim;
        readonly localTracingEnabled: import("effect/Schema").Boolean;
        readonly otlpTracesUrl: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly otlpTracesEnabled: import("effect/Schema").Boolean;
        readonly otlpMetricsUrl: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly otlpMetricsEnabled: import("effect/Schema").Boolean;
    }>;
    readonly settings: import("effect/Schema").Struct<{
        readonly enableAssistantStreaming: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
        readonly defaultThreadEnvMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["local", "worktree"]>>;
        readonly textGenerationModelSelection: import("effect/Schema").withDecodingDefault<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"codex">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"gemini">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"claudeAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"opencode">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"copilotAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>]>>;
        readonly providers: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
            readonly codex: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
                readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
                readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
                readonly homePath: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
                readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
            }>>;
            readonly gemini: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
                readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
                readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
                readonly homePath: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
                readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
            }>>;
            readonly claudeAgent: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
                readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
                readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
                readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
            }>>;
            readonly opencode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
                readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
                readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
                readonly apiKey: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
                readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
            }>>;
            readonly copilotAgent: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
                readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
                readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
                readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
            }>>;
        }>>;
        readonly observability: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
            readonly otlpTracesUrl: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
            readonly otlpMetricsUrl: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
        }>>;
    }>;
}>, import("effect/Schema").Union<readonly [typeof import("@t3tools/contracts").KeybindingsConfigError, typeof import("@t3tools/contracts").ServerSettingsError]>, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"server.refreshProviders", import("effect/Schema").Struct<{}>, import("effect/Schema").Struct<{
    readonly providers: import("effect/Schema").$Array<import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literals<readonly ["codex", "gemini", "claudeAgent", "opencode", "copilotAgent"]>;
        readonly enabled: import("effect/Schema").Boolean;
        readonly installed: import("effect/Schema").Boolean;
        readonly version: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
        readonly status: import("effect/Schema").Literals<readonly ["ready", "warning", "error", "disabled"]>;
        readonly auth: import("effect/Schema").Struct<{
            readonly status: import("effect/Schema").Literals<readonly ["authenticated", "unauthenticated", "unknown"]>;
            readonly type: import("effect/Schema").optional<import("effect/Schema").Trim>;
            readonly label: import("effect/Schema").optional<import("effect/Schema").Trim>;
        }>;
        readonly checkedAt: import("effect/Schema").String;
        readonly message: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly models: import("effect/Schema").$Array<import("effect/Schema").Struct<{
            readonly slug: import("effect/Schema").Trim;
            readonly name: import("effect/Schema").Trim;
            readonly isCustom: import("effect/Schema").Boolean;
            readonly capabilities: import("effect/Schema").NullOr<import("effect/Schema").Struct<{
                readonly reasoningEffortLevels: import("effect/Schema").$Array<import("effect/Schema").Struct<{
                    readonly value: import("effect/Schema").Trim;
                    readonly label: import("effect/Schema").Trim;
                    readonly isDefault: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                }>>;
                readonly supportsFastMode: import("effect/Schema").Boolean;
                readonly supportsThinkingToggle: import("effect/Schema").Boolean;
                readonly contextWindowOptions: import("effect/Schema").$Array<import("effect/Schema").Struct<{
                    readonly value: import("effect/Schema").Trim;
                    readonly label: import("effect/Schema").Trim;
                    readonly isDefault: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                }>>;
                readonly promptInjectedEffortLevels: import("effect/Schema").$Array<import("effect/Schema").Trim>;
            }>>;
        }>>;
        readonly dynamicModels: import("effect/Schema").optional<import("effect/Schema").$Array<import("effect/Schema").Struct<{
            readonly id: import("effect/Schema").String;
            readonly name: import("effect/Schema").String;
        }>>>;
    }>>;
}>, import("effect/Schema").Never, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"server.getSettings", import("effect/Schema").Struct<{}>, import("effect/Schema").Struct<{
    readonly enableAssistantStreaming: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
    readonly defaultThreadEnvMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["local", "worktree"]>>;
    readonly textGenerationModelSelection: import("effect/Schema").withDecodingDefault<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"codex">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"gemini">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"claudeAgent">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
            readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"opencode">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"copilotAgent">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
        }>>;
    }>]>>;
    readonly providers: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
        readonly codex: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
            readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
            readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
            readonly homePath: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
            readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
        }>>;
        readonly gemini: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
            readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
            readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
            readonly homePath: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
            readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
        }>>;
        readonly claudeAgent: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
            readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
            readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
            readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
        }>>;
        readonly opencode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
            readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
            readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
            readonly apiKey: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
            readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
        }>>;
        readonly copilotAgent: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
            readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
            readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
            readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
        }>>;
    }>>;
    readonly observability: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
        readonly otlpTracesUrl: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
        readonly otlpMetricsUrl: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
    }>>;
}>, typeof import("@t3tools/contracts").ServerSettingsError, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"server.updateSettings", import("effect/Schema").Struct<{
    readonly patch: import("effect/Schema").Struct<{
        readonly enableAssistantStreaming: import("effect/Schema").optionalKey<import("effect/Schema").Boolean>;
        readonly defaultThreadEnvMode: import("effect/Schema").optionalKey<import("effect/Schema").Literals<readonly ["local", "worktree"]>>;
        readonly textGenerationModelSelection: import("effect/Schema").optionalKey<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").optionalKey<import("effect/Schema").Literal<"codex">>;
            readonly model: import("effect/Schema").optionalKey<import("effect/Schema").Trim>;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optionalKey<import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>>;
                readonly fastMode: import("effect/Schema").optionalKey<import("effect/Schema").optional<import("effect/Schema").Boolean>>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").optionalKey<import("effect/Schema").Literal<"gemini">>;
            readonly model: import("effect/Schema").optionalKey<import("effect/Schema").Trim>;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinkingBudget: import("effect/Schema").optionalKey<import("effect/Schema").optional<import("effect/Schema").Int>>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").optionalKey<import("effect/Schema").Literal<"claudeAgent">>;
            readonly model: import("effect/Schema").optionalKey<import("effect/Schema").Trim>;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinking: import("effect/Schema").optionalKey<import("effect/Schema").optional<import("effect/Schema").Boolean>>;
                readonly effort: import("effect/Schema").optionalKey<import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>>;
                readonly fastMode: import("effect/Schema").optionalKey<import("effect/Schema").optional<import("effect/Schema").Boolean>>;
                readonly contextWindow: import("effect/Schema").optionalKey<import("effect/Schema").optional<import("effect/Schema").String>>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").optionalKey<import("effect/Schema").Literal<"opencode">>;
            readonly model: import("effect/Schema").optionalKey<import("effect/Schema").Trim>;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optionalKey<import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").optionalKey<import("effect/Schema").Literal<"copilotAgent">>;
            readonly model: import("effect/Schema").optionalKey<import("effect/Schema").Trim>;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optionalKey<import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>>;
            }>>;
        }>]>>;
        readonly observability: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly otlpTracesUrl: import("effect/Schema").optionalKey<import("effect/Schema").String>;
            readonly otlpMetricsUrl: import("effect/Schema").optionalKey<import("effect/Schema").String>;
        }>>;
        readonly providers: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly codex: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly enabled: import("effect/Schema").optionalKey<import("effect/Schema").Boolean>;
                readonly binaryPath: import("effect/Schema").optionalKey<import("effect/Schema").String>;
                readonly homePath: import("effect/Schema").optionalKey<import("effect/Schema").String>;
                readonly customModels: import("effect/Schema").optionalKey<import("effect/Schema").$Array<import("effect/Schema").String>>;
            }>>;
            readonly gemini: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly enabled: import("effect/Schema").optionalKey<import("effect/Schema").Boolean>;
                readonly binaryPath: import("effect/Schema").optionalKey<import("effect/Schema").String>;
                readonly homePath: import("effect/Schema").optionalKey<import("effect/Schema").String>;
                readonly customModels: import("effect/Schema").optionalKey<import("effect/Schema").$Array<import("effect/Schema").String>>;
            }>>;
            readonly claudeAgent: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly enabled: import("effect/Schema").optionalKey<import("effect/Schema").Boolean>;
                readonly binaryPath: import("effect/Schema").optionalKey<import("effect/Schema").String>;
                readonly customModels: import("effect/Schema").optionalKey<import("effect/Schema").$Array<import("effect/Schema").String>>;
            }>>;
            readonly opencode: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly enabled: import("effect/Schema").optionalKey<import("effect/Schema").Boolean>;
                readonly binaryPath: import("effect/Schema").optionalKey<import("effect/Schema").String>;
                readonly apiKey: import("effect/Schema").optionalKey<import("effect/Schema").String>;
                readonly customModels: import("effect/Schema").optionalKey<import("effect/Schema").$Array<import("effect/Schema").String>>;
            }>>;
            readonly copilotAgent: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly enabled: import("effect/Schema").optionalKey<import("effect/Schema").Boolean>;
                readonly binaryPath: import("effect/Schema").optionalKey<import("effect/Schema").String>;
                readonly customModels: import("effect/Schema").optionalKey<import("effect/Schema").$Array<import("effect/Schema").String>>;
            }>>;
        }>>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly enableAssistantStreaming: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
    readonly defaultThreadEnvMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["local", "worktree"]>>;
    readonly textGenerationModelSelection: import("effect/Schema").withDecodingDefault<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"codex">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"gemini">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"claudeAgent">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
            readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"opencode">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"copilotAgent">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
        }>>;
    }>]>>;
    readonly providers: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
        readonly codex: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
            readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
            readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
            readonly homePath: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
            readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
        }>>;
        readonly gemini: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
            readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
            readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
            readonly homePath: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
            readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
        }>>;
        readonly claudeAgent: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
            readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
            readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
            readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
        }>>;
        readonly opencode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
            readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
            readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
            readonly apiKey: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
            readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
        }>>;
        readonly copilotAgent: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
            readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
            readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
            readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
        }>>;
    }>>;
    readonly observability: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
        readonly otlpTracesUrl: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
        readonly otlpMetricsUrl: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
    }>>;
}>, typeof import("@t3tools/contracts").ServerSettingsError, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"projects.searchEntries", import("effect/Schema").Struct<{
    readonly cwd: import("effect/Schema").Trim;
    readonly query: import("effect/Schema").Trim;
    readonly limit: import("effect/Schema").Int;
}>, import("effect/Schema").Struct<{
    readonly entries: import("effect/Schema").$Array<import("effect/Schema").Struct<{
        readonly path: import("effect/Schema").Trim;
        readonly kind: import("effect/Schema").Literals<readonly ["file", "directory"]>;
        readonly parentPath: import("effect/Schema").optional<import("effect/Schema").Trim>;
    }>>;
    readonly truncated: import("effect/Schema").Boolean;
}>, typeof import("@t3tools/contracts").ProjectSearchEntriesError, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"projects.writeFile", import("effect/Schema").Struct<{
    readonly cwd: import("effect/Schema").Trim;
    readonly relativePath: import("effect/Schema").Trim;
    readonly contents: import("effect/Schema").String;
}>, import("effect/Schema").Struct<{
    readonly relativePath: import("effect/Schema").Trim;
}>, typeof import("@t3tools/contracts").ProjectWriteFileError, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"shell.openInEditor", import("effect/Schema").Struct<{
    readonly cwd: import("effect/Schema").Trim;
    readonly editor: import("effect/Schema").Literals<("cursor" | "trae" | "vscode" | "vscode-insiders" | "vscodium" | "zed" | "antigravity" | "idea" | "file-manager")[]>;
}>, import("effect/Schema").Void, typeof import("@t3tools/contracts").OpenError, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"subscribeGitStatus", import("effect/Schema").Struct<{
    readonly cwd: import("effect/Schema").Trim;
}>, import("effect/unstable/rpc/RpcSchema").Stream<import("effect/Schema").Union<readonly [import("effect/Schema").TaggedStruct<"snapshot", {
    readonly local: import("effect/Schema").Struct<{
        isRepo: import("effect/Schema").Boolean;
        hostingProvider: import("effect/Schema").optional<import("effect/Schema").Struct<{
            readonly kind: import("effect/Schema").Literals<readonly ["github", "gitlab", "unknown"]>;
            readonly name: import("effect/Schema").Trim;
            readonly baseUrl: import("effect/Schema").String;
        }>>;
        hasOriginRemote: import("effect/Schema").Boolean;
        isDefaultBranch: import("effect/Schema").Boolean;
        branch: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
        hasWorkingTreeChanges: import("effect/Schema").Boolean;
        workingTree: import("effect/Schema").Struct<{
            readonly files: import("effect/Schema").$Array<import("effect/Schema").Struct<{
                readonly path: import("effect/Schema").Trim;
                readonly insertions: import("effect/Schema").Int;
                readonly deletions: import("effect/Schema").Int;
            }>>;
            readonly insertions: import("effect/Schema").Int;
            readonly deletions: import("effect/Schema").Int;
        }>;
    }>;
    readonly remote: import("effect/Schema").NullOr<import("effect/Schema").Struct<{
        hasUpstream: import("effect/Schema").Boolean;
        aheadCount: import("effect/Schema").Int;
        behindCount: import("effect/Schema").Int;
        pr: import("effect/Schema").NullOr<import("effect/Schema").Struct<{
            readonly number: import("effect/Schema").Int;
            readonly title: import("effect/Schema").Trim;
            readonly url: import("effect/Schema").String;
            readonly baseBranch: import("effect/Schema").Trim;
            readonly headBranch: import("effect/Schema").Trim;
            readonly state: import("effect/Schema").Literals<readonly ["open", "closed", "merged"]>;
        }>>;
    }>>;
}>, import("effect/Schema").TaggedStruct<"localUpdated", {
    readonly local: import("effect/Schema").Struct<{
        isRepo: import("effect/Schema").Boolean;
        hostingProvider: import("effect/Schema").optional<import("effect/Schema").Struct<{
            readonly kind: import("effect/Schema").Literals<readonly ["github", "gitlab", "unknown"]>;
            readonly name: import("effect/Schema").Trim;
            readonly baseUrl: import("effect/Schema").String;
        }>>;
        hasOriginRemote: import("effect/Schema").Boolean;
        isDefaultBranch: import("effect/Schema").Boolean;
        branch: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
        hasWorkingTreeChanges: import("effect/Schema").Boolean;
        workingTree: import("effect/Schema").Struct<{
            readonly files: import("effect/Schema").$Array<import("effect/Schema").Struct<{
                readonly path: import("effect/Schema").Trim;
                readonly insertions: import("effect/Schema").Int;
                readonly deletions: import("effect/Schema").Int;
            }>>;
            readonly insertions: import("effect/Schema").Int;
            readonly deletions: import("effect/Schema").Int;
        }>;
    }>;
}>, import("effect/Schema").TaggedStruct<"remoteUpdated", {
    readonly remote: import("effect/Schema").NullOr<import("effect/Schema").Struct<{
        hasUpstream: import("effect/Schema").Boolean;
        aheadCount: import("effect/Schema").Int;
        behindCount: import("effect/Schema").Int;
        pr: import("effect/Schema").NullOr<import("effect/Schema").Struct<{
            readonly number: import("effect/Schema").Int;
            readonly title: import("effect/Schema").Trim;
            readonly url: import("effect/Schema").String;
            readonly baseBranch: import("effect/Schema").Trim;
            readonly headBranch: import("effect/Schema").Trim;
            readonly state: import("effect/Schema").Literals<readonly ["open", "closed", "merged"]>;
        }>>;
    }>>;
}>]>, import("effect/Schema").Union<readonly [typeof import("@t3tools/contracts").GitManagerError, typeof import("@t3tools/contracts").GitCommandError, typeof import("@t3tools/contracts").GitHubCliError, typeof import("@t3tools/contracts").TextGenerationError]>>, import("effect/Schema").Never, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"git.pull", import("effect/Schema").Struct<{
    readonly cwd: import("effect/Schema").Trim;
}>, import("effect/Schema").Struct<{
    readonly status: import("effect/Schema").Literals<readonly ["pulled", "skipped_up_to_date"]>;
    readonly branch: import("effect/Schema").Trim;
    readonly upstreamBranch: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
}>, typeof import("@t3tools/contracts").GitCommandError, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"git.refreshStatus", import("effect/Schema").Struct<{
    readonly cwd: import("effect/Schema").Trim;
}>, import("effect/Schema").Struct<{
    readonly hasUpstream: import("effect/Schema").Boolean;
    readonly aheadCount: import("effect/Schema").Int;
    readonly behindCount: import("effect/Schema").Int;
    readonly pr: import("effect/Schema").NullOr<import("effect/Schema").Struct<{
        readonly number: import("effect/Schema").Int;
        readonly title: import("effect/Schema").Trim;
        readonly url: import("effect/Schema").String;
        readonly baseBranch: import("effect/Schema").Trim;
        readonly headBranch: import("effect/Schema").Trim;
        readonly state: import("effect/Schema").Literals<readonly ["open", "closed", "merged"]>;
    }>>;
    readonly isRepo: import("effect/Schema").Boolean;
    readonly hostingProvider: import("effect/Schema").optional<import("effect/Schema").Struct<{
        readonly kind: import("effect/Schema").Literals<readonly ["github", "gitlab", "unknown"]>;
        readonly name: import("effect/Schema").Trim;
        readonly baseUrl: import("effect/Schema").String;
    }>>;
    readonly hasOriginRemote: import("effect/Schema").Boolean;
    readonly isDefaultBranch: import("effect/Schema").Boolean;
    readonly branch: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
    readonly hasWorkingTreeChanges: import("effect/Schema").Boolean;
    readonly workingTree: import("effect/Schema").Struct<{
        readonly files: import("effect/Schema").$Array<import("effect/Schema").Struct<{
            readonly path: import("effect/Schema").Trim;
            readonly insertions: import("effect/Schema").Int;
            readonly deletions: import("effect/Schema").Int;
        }>>;
        readonly insertions: import("effect/Schema").Int;
        readonly deletions: import("effect/Schema").Int;
    }>;
}>, import("effect/Schema").Union<readonly [typeof import("@t3tools/contracts").GitManagerError, typeof import("@t3tools/contracts").GitCommandError, typeof import("@t3tools/contracts").GitHubCliError, typeof import("@t3tools/contracts").TextGenerationError]>, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"git.runStackedAction", import("effect/Schema").Struct<{
    readonly actionId: import("effect/Schema").Trim;
    readonly cwd: import("effect/Schema").Trim;
    readonly action: import("effect/Schema").Literals<readonly ["commit", "push", "create_pr", "commit_push", "commit_push_pr"]>;
    readonly commitMessage: import("effect/Schema").optional<import("effect/Schema").Trim>;
    readonly featureBranch: import("effect/Schema").optional<import("effect/Schema").Boolean>;
    readonly filePaths: import("effect/Schema").optional<import("effect/Schema").$Array<import("effect/Schema").Trim>>;
}>, import("effect/unstable/rpc/RpcSchema").Stream<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
    readonly kind: import("effect/Schema").Literal<"action_started">;
    readonly phases: import("effect/Schema").$Array<import("effect/Schema").Literals<readonly ["branch", "commit", "push", "pr"]>>;
    readonly actionId: import("effect/Schema").Trim;
    readonly cwd: import("effect/Schema").Trim;
    readonly action: import("effect/Schema").Literals<readonly ["commit", "push", "create_pr", "commit_push", "commit_push_pr"]>;
}>, import("effect/Schema").Struct<{
    readonly kind: import("effect/Schema").Literal<"phase_started">;
    readonly phase: import("effect/Schema").Literals<readonly ["branch", "commit", "push", "pr"]>;
    readonly label: import("effect/Schema").Trim;
    readonly actionId: import("effect/Schema").Trim;
    readonly cwd: import("effect/Schema").Trim;
    readonly action: import("effect/Schema").Literals<readonly ["commit", "push", "create_pr", "commit_push", "commit_push_pr"]>;
}>, import("effect/Schema").Struct<{
    readonly kind: import("effect/Schema").Literal<"hook_started">;
    readonly hookName: import("effect/Schema").Trim;
    readonly actionId: import("effect/Schema").Trim;
    readonly cwd: import("effect/Schema").Trim;
    readonly action: import("effect/Schema").Literals<readonly ["commit", "push", "create_pr", "commit_push", "commit_push_pr"]>;
}>, import("effect/Schema").Struct<{
    readonly kind: import("effect/Schema").Literal<"hook_output">;
    readonly hookName: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
    readonly stream: import("effect/Schema").Literals<readonly ["stdout", "stderr"]>;
    readonly text: import("effect/Schema").Trim;
    readonly actionId: import("effect/Schema").Trim;
    readonly cwd: import("effect/Schema").Trim;
    readonly action: import("effect/Schema").Literals<readonly ["commit", "push", "create_pr", "commit_push", "commit_push_pr"]>;
}>, import("effect/Schema").Struct<{
    readonly kind: import("effect/Schema").Literal<"hook_finished">;
    readonly hookName: import("effect/Schema").Trim;
    readonly exitCode: import("effect/Schema").NullOr<import("effect/Schema").Int>;
    readonly durationMs: import("effect/Schema").NullOr<import("effect/Schema").Int>;
    readonly actionId: import("effect/Schema").Trim;
    readonly cwd: import("effect/Schema").Trim;
    readonly action: import("effect/Schema").Literals<readonly ["commit", "push", "create_pr", "commit_push", "commit_push_pr"]>;
}>, import("effect/Schema").Struct<{
    readonly kind: import("effect/Schema").Literal<"action_finished">;
    readonly result: import("effect/Schema").Struct<{
        readonly action: import("effect/Schema").Literals<readonly ["commit", "push", "create_pr", "commit_push", "commit_push_pr"]>;
        readonly branch: import("effect/Schema").Struct<{
            readonly status: import("effect/Schema").Literals<readonly ["created", "skipped_not_requested"]>;
            readonly name: import("effect/Schema").optional<import("effect/Schema").Trim>;
        }>;
        readonly commit: import("effect/Schema").Struct<{
            readonly status: import("effect/Schema").Literals<readonly ["created", "skipped_no_changes", "skipped_not_requested"]>;
            readonly commitSha: import("effect/Schema").optional<import("effect/Schema").Trim>;
            readonly subject: import("effect/Schema").optional<import("effect/Schema").Trim>;
        }>;
        readonly push: import("effect/Schema").Struct<{
            readonly status: import("effect/Schema").Literals<readonly ["pushed", "skipped_not_requested", "skipped_up_to_date"]>;
            readonly branch: import("effect/Schema").optional<import("effect/Schema").Trim>;
            readonly upstreamBranch: import("effect/Schema").optional<import("effect/Schema").Trim>;
            readonly setUpstream: import("effect/Schema").optional<import("effect/Schema").Boolean>;
        }>;
        readonly pr: import("effect/Schema").Struct<{
            readonly status: import("effect/Schema").Literals<readonly ["created", "opened_existing", "skipped_not_requested"]>;
            readonly url: import("effect/Schema").optional<import("effect/Schema").String>;
            readonly number: import("effect/Schema").optional<import("effect/Schema").Int>;
            readonly baseBranch: import("effect/Schema").optional<import("effect/Schema").Trim>;
            readonly headBranch: import("effect/Schema").optional<import("effect/Schema").Trim>;
            readonly title: import("effect/Schema").optional<import("effect/Schema").Trim>;
        }>;
        readonly toast: import("effect/Schema").Struct<{
            readonly title: import("effect/Schema").Trim;
            readonly description: import("effect/Schema").optional<import("effect/Schema").Trim>;
            readonly cta: import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
                readonly kind: import("effect/Schema").Literal<"none">;
            }>, import("effect/Schema").Struct<{
                readonly kind: import("effect/Schema").Literal<"open_pr">;
                readonly label: import("effect/Schema").Trim;
                readonly url: import("effect/Schema").String;
            }>, import("effect/Schema").Struct<{
                readonly kind: import("effect/Schema").Literal<"run_action">;
                readonly label: import("effect/Schema").Trim;
                readonly action: import("effect/Schema").Struct<{
                    readonly kind: import("effect/Schema").Literals<readonly ["commit", "push", "create_pr", "commit_push", "commit_push_pr"]>;
                }>;
            }>]>;
        }>;
    }>;
    readonly actionId: import("effect/Schema").Trim;
    readonly cwd: import("effect/Schema").Trim;
    readonly action: import("effect/Schema").Literals<readonly ["commit", "push", "create_pr", "commit_push", "commit_push_pr"]>;
}>, import("effect/Schema").Struct<{
    readonly kind: import("effect/Schema").Literal<"action_failed">;
    readonly phase: import("effect/Schema").NullOr<import("effect/Schema").Literals<readonly ["branch", "commit", "push", "pr"]>>;
    readonly message: import("effect/Schema").Trim;
    readonly actionId: import("effect/Schema").Trim;
    readonly cwd: import("effect/Schema").Trim;
    readonly action: import("effect/Schema").Literals<readonly ["commit", "push", "create_pr", "commit_push", "commit_push_pr"]>;
}>]>, import("effect/Schema").Union<readonly [typeof import("@t3tools/contracts").GitManagerError, typeof import("@t3tools/contracts").GitCommandError, typeof import("@t3tools/contracts").GitHubCliError, typeof import("@t3tools/contracts").TextGenerationError]>>, import("effect/Schema").Never, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"git.resolvePullRequest", import("effect/Schema").Struct<{
    readonly cwd: import("effect/Schema").Trim;
    readonly reference: import("effect/Schema").Trim;
}>, import("effect/Schema").Struct<{
    readonly pullRequest: import("effect/Schema").Struct<{
        readonly number: import("effect/Schema").Int;
        readonly title: import("effect/Schema").Trim;
        readonly url: import("effect/Schema").String;
        readonly baseBranch: import("effect/Schema").Trim;
        readonly headBranch: import("effect/Schema").Trim;
        readonly state: import("effect/Schema").Literals<readonly ["open", "closed", "merged"]>;
    }>;
}>, import("effect/Schema").Union<readonly [typeof import("@t3tools/contracts").GitManagerError, typeof import("@t3tools/contracts").GitCommandError, typeof import("@t3tools/contracts").GitHubCliError, typeof import("@t3tools/contracts").TextGenerationError]>, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"git.preparePullRequestThread", import("effect/Schema").Struct<{
    readonly cwd: import("effect/Schema").Trim;
    readonly reference: import("effect/Schema").Trim;
    readonly mode: import("effect/Schema").Literals<readonly ["local", "worktree"]>;
    readonly threadId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">>;
}>, import("effect/Schema").Struct<{
    readonly pullRequest: import("effect/Schema").Struct<{
        readonly number: import("effect/Schema").Int;
        readonly title: import("effect/Schema").Trim;
        readonly url: import("effect/Schema").String;
        readonly baseBranch: import("effect/Schema").Trim;
        readonly headBranch: import("effect/Schema").Trim;
        readonly state: import("effect/Schema").Literals<readonly ["open", "closed", "merged"]>;
    }>;
    readonly branch: import("effect/Schema").Trim;
    readonly worktreePath: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
}>, import("effect/Schema").Union<readonly [typeof import("@t3tools/contracts").GitManagerError, typeof import("@t3tools/contracts").GitCommandError, typeof import("@t3tools/contracts").GitHubCliError, typeof import("@t3tools/contracts").TextGenerationError]>, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"git.suggestCommitMessage", import("effect/Schema").Struct<{
    readonly cwd: import("effect/Schema").Trim;
    readonly filePaths: import("effect/Schema").optional<import("effect/Schema").$Array<import("effect/Schema").Trim>>;
}>, import("effect/Schema").Struct<{
    readonly subject: import("effect/Schema").String;
    readonly body: import("effect/Schema").String;
}>, import("effect/Schema").Union<readonly [typeof import("@t3tools/contracts").GitManagerError, typeof import("@t3tools/contracts").GitCommandError, typeof import("@t3tools/contracts").GitHubCliError, typeof import("@t3tools/contracts").TextGenerationError]>, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"git.listBranches", import("effect/Schema").Struct<{
    readonly cwd: import("effect/Schema").Trim;
    readonly query: import("effect/Schema").optional<import("effect/Schema").Trim>;
    readonly cursor: import("effect/Schema").optional<import("effect/Schema").Int>;
    readonly limit: import("effect/Schema").optional<import("effect/Schema").Int>;
}>, import("effect/Schema").Struct<{
    readonly branches: import("effect/Schema").$Array<import("effect/Schema").Struct<{
        readonly name: import("effect/Schema").Trim;
        readonly isRemote: import("effect/Schema").optional<import("effect/Schema").Boolean>;
        readonly remoteName: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly current: import("effect/Schema").Boolean;
        readonly isDefault: import("effect/Schema").Boolean;
        readonly worktreePath: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
    }>>;
    readonly isRepo: import("effect/Schema").Boolean;
    readonly hasOriginRemote: import("effect/Schema").Boolean;
    readonly nextCursor: import("effect/Schema").NullOr<import("effect/Schema").Int>;
    readonly totalCount: import("effect/Schema").Int;
}>, typeof import("@t3tools/contracts").GitCommandError, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"git.createWorktree", import("effect/Schema").Struct<{
    readonly cwd: import("effect/Schema").Trim;
    readonly branch: import("effect/Schema").Trim;
    readonly newBranch: import("effect/Schema").optional<import("effect/Schema").Trim>;
    readonly path: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
}>, import("effect/Schema").Struct<{
    readonly worktree: import("effect/Schema").Struct<{
        readonly path: import("effect/Schema").Trim;
        readonly branch: import("effect/Schema").Trim;
    }>;
}>, typeof import("@t3tools/contracts").GitCommandError, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"git.removeWorktree", import("effect/Schema").Struct<{
    readonly cwd: import("effect/Schema").Trim;
    readonly path: import("effect/Schema").Trim;
    readonly force: import("effect/Schema").optional<import("effect/Schema").Boolean>;
}>, import("effect/Schema").Void, typeof import("@t3tools/contracts").GitCommandError, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"git.createBranch", import("effect/Schema").Struct<{
    readonly cwd: import("effect/Schema").Trim;
    readonly branch: import("effect/Schema").Trim;
    readonly checkout: import("effect/Schema").optional<import("effect/Schema").Boolean>;
}>, import("effect/Schema").Struct<{
    readonly branch: import("effect/Schema").Trim;
}>, typeof import("@t3tools/contracts").GitCommandError, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"git.checkout", import("effect/Schema").Struct<{
    readonly cwd: import("effect/Schema").Trim;
    readonly branch: import("effect/Schema").Trim;
}>, import("effect/Schema").Struct<{
    readonly branch: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
}>, typeof import("@t3tools/contracts").GitCommandError, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"git.init", import("effect/Schema").Struct<{
    readonly cwd: import("effect/Schema").Trim;
}>, import("effect/Schema").Void, typeof import("@t3tools/contracts").GitCommandError, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"terminal.open", import("effect/Schema").Struct<{
    readonly cwd: import("effect/Schema").Trim;
    readonly worktreePath: import("effect/Schema").optional<import("effect/Schema").NullOr<import("effect/Schema").Trim>>;
    readonly cols: import("effect/Schema").optional<import("effect/Schema").Int>;
    readonly rows: import("effect/Schema").optional<import("effect/Schema").Int>;
    readonly env: import("effect/Schema").optional<import("effect/Schema").$Record<import("effect/Schema").String, import("effect/Schema").String>>;
    readonly terminalId: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
    readonly threadId: import("effect/Schema").Trim;
}>, import("effect/Schema").Struct<{
    readonly threadId: import("effect/Schema").String;
    readonly terminalId: import("effect/Schema").String;
    readonly cwd: import("effect/Schema").String;
    readonly worktreePath: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
    readonly status: import("effect/Schema").Literals<readonly ["starting", "running", "exited", "error"]>;
    readonly pid: import("effect/Schema").NullOr<import("effect/Schema").Int>;
    readonly history: import("effect/Schema").String;
    readonly exitCode: import("effect/Schema").NullOr<import("effect/Schema").Int>;
    readonly exitSignal: import("effect/Schema").NullOr<import("effect/Schema").Int>;
    readonly updatedAt: import("effect/Schema").String;
}>, import("effect/Schema").Union<readonly [typeof import("@t3tools/contracts").TerminalCwdError, typeof import("@t3tools/contracts").TerminalHistoryError, typeof import("@t3tools/contracts").TerminalSessionLookupError, typeof import("@t3tools/contracts").TerminalNotRunningError]>, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"terminal.write", import("effect/Schema").Struct<{
    readonly data: import("effect/Schema").String;
    readonly terminalId: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
    readonly threadId: import("effect/Schema").Trim;
}>, import("effect/Schema").Void, import("effect/Schema").Union<readonly [typeof import("@t3tools/contracts").TerminalCwdError, typeof import("@t3tools/contracts").TerminalHistoryError, typeof import("@t3tools/contracts").TerminalSessionLookupError, typeof import("@t3tools/contracts").TerminalNotRunningError]>, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"terminal.resize", import("effect/Schema").Struct<{
    readonly cols: import("effect/Schema").Int;
    readonly rows: import("effect/Schema").Int;
    readonly terminalId: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
    readonly threadId: import("effect/Schema").Trim;
}>, import("effect/Schema").Void, import("effect/Schema").Union<readonly [typeof import("@t3tools/contracts").TerminalCwdError, typeof import("@t3tools/contracts").TerminalHistoryError, typeof import("@t3tools/contracts").TerminalSessionLookupError, typeof import("@t3tools/contracts").TerminalNotRunningError]>, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"terminal.clear", import("effect/Schema").Struct<{
    readonly terminalId: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
    readonly threadId: import("effect/Schema").Trim;
}>, import("effect/Schema").Void, import("effect/Schema").Union<readonly [typeof import("@t3tools/contracts").TerminalCwdError, typeof import("@t3tools/contracts").TerminalHistoryError, typeof import("@t3tools/contracts").TerminalSessionLookupError, typeof import("@t3tools/contracts").TerminalNotRunningError]>, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"terminal.restart", import("effect/Schema").Struct<{
    readonly cwd: import("effect/Schema").Trim;
    readonly worktreePath: import("effect/Schema").optional<import("effect/Schema").NullOr<import("effect/Schema").Trim>>;
    readonly cols: import("effect/Schema").Int;
    readonly rows: import("effect/Schema").Int;
    readonly env: import("effect/Schema").optional<import("effect/Schema").$Record<import("effect/Schema").String, import("effect/Schema").String>>;
    readonly terminalId: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
    readonly threadId: import("effect/Schema").Trim;
}>, import("effect/Schema").Struct<{
    readonly threadId: import("effect/Schema").String;
    readonly terminalId: import("effect/Schema").String;
    readonly cwd: import("effect/Schema").String;
    readonly worktreePath: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
    readonly status: import("effect/Schema").Literals<readonly ["starting", "running", "exited", "error"]>;
    readonly pid: import("effect/Schema").NullOr<import("effect/Schema").Int>;
    readonly history: import("effect/Schema").String;
    readonly exitCode: import("effect/Schema").NullOr<import("effect/Schema").Int>;
    readonly exitSignal: import("effect/Schema").NullOr<import("effect/Schema").Int>;
    readonly updatedAt: import("effect/Schema").String;
}>, import("effect/Schema").Union<readonly [typeof import("@t3tools/contracts").TerminalCwdError, typeof import("@t3tools/contracts").TerminalHistoryError, typeof import("@t3tools/contracts").TerminalSessionLookupError, typeof import("@t3tools/contracts").TerminalNotRunningError]>, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"terminal.close", import("effect/Schema").Struct<{
    readonly terminalId: import("effect/Schema").optional<import("effect/Schema").Trim>;
    readonly deleteHistory: import("effect/Schema").optional<import("effect/Schema").Boolean>;
    readonly threadId: import("effect/Schema").Trim;
}>, import("effect/Schema").Void, import("effect/Schema").Union<readonly [typeof import("@t3tools/contracts").TerminalCwdError, typeof import("@t3tools/contracts").TerminalHistoryError, typeof import("@t3tools/contracts").TerminalSessionLookupError, typeof import("@t3tools/contracts").TerminalNotRunningError]>, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"orchestration.getSnapshot", import("effect/Schema").Struct<{}>, import("effect/Schema").Struct<{
    readonly snapshotSequence: import("effect/Schema").Int;
    readonly projects: import("effect/Schema").$Array<import("effect/Schema").Struct<{
        readonly id: import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">;
        readonly title: import("effect/Schema").Trim;
        readonly workspaceRoot: import("effect/Schema").Trim;
        readonly defaultModelSelection: import("effect/Schema").NullOr<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"codex">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"gemini">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"claudeAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"opencode">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"copilotAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>]>>;
        readonly scripts: import("effect/Schema").$Array<import("effect/Schema").Struct<{
            readonly id: import("effect/Schema").Trim;
            readonly name: import("effect/Schema").Trim;
            readonly command: import("effect/Schema").Trim;
            readonly icon: import("effect/Schema").Literals<readonly ["play", "test", "lint", "configure", "build", "debug"]>;
            readonly runOnWorktreeCreate: import("effect/Schema").Boolean;
        }>>;
        readonly createdAt: import("effect/Schema").String;
        readonly updatedAt: import("effect/Schema").String;
        readonly deletedAt: import("effect/Schema").NullOr<import("effect/Schema").String>;
    }>>;
    readonly threads: import("effect/Schema").$Array<import("effect/Schema").Struct<{
        readonly id: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly projectId: import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">;
        readonly title: import("effect/Schema").Trim;
        readonly modelSelection: import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"codex">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"gemini">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"claudeAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"opencode">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"copilotAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>]>;
        readonly runtimeMode: import("effect/Schema").Literals<readonly ["approval-required", "full-access"]>;
        readonly interactionMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["default", "plan"]>>;
        readonly branch: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
        readonly worktreePath: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
        readonly latestTurn: import("effect/Schema").NullOr<import("effect/Schema").Struct<{
            readonly turnId: import("effect/Schema").brand<import("effect/Schema").Trim, "TurnId">;
            readonly state: import("effect/Schema").Literals<readonly ["running", "interrupted", "completed", "error"]>;
            readonly requestedAt: import("effect/Schema").String;
            readonly startedAt: import("effect/Schema").NullOr<import("effect/Schema").String>;
            readonly completedAt: import("effect/Schema").NullOr<import("effect/Schema").String>;
            readonly assistantMessageId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "MessageId">>;
            readonly sourceProposedPlan: import("effect/Schema").optional<import("effect/Schema").Struct<{
                readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
                readonly planId: import("effect/Schema").Trim;
            }>>;
        }>>;
        readonly createdAt: import("effect/Schema").String;
        readonly updatedAt: import("effect/Schema").String;
        readonly archivedAt: import("effect/Schema").withDecodingDefault<import("effect/Schema").NullOr<import("effect/Schema").String>>;
        readonly deletedAt: import("effect/Schema").NullOr<import("effect/Schema").String>;
        readonly messages: import("effect/Schema").$Array<import("effect/Schema").Struct<{
            readonly id: import("effect/Schema").brand<import("effect/Schema").Trim, "MessageId">;
            readonly role: import("effect/Schema").Literals<readonly ["user", "assistant", "system"]>;
            readonly text: import("effect/Schema").String;
            readonly attachments: import("effect/Schema").optional<import("effect/Schema").$Array<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
                readonly type: import("effect/Schema").Literal<"image">;
                readonly id: import("effect/Schema").Trim;
                readonly name: import("effect/Schema").Trim;
                readonly mimeType: import("effect/Schema").Trim;
                readonly sizeBytes: import("effect/Schema").Int;
            }>]>>>;
            readonly turnId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "TurnId">>;
            readonly streaming: import("effect/Schema").Boolean;
            readonly createdAt: import("effect/Schema").String;
            readonly updatedAt: import("effect/Schema").String;
        }>>;
        readonly proposedPlans: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").Struct<{
            readonly id: import("effect/Schema").Trim;
            readonly turnId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "TurnId">>;
            readonly planMarkdown: import("effect/Schema").Trim;
            readonly implementedAt: import("effect/Schema").withDecodingDefault<import("effect/Schema").NullOr<import("effect/Schema").String>>;
            readonly implementationThreadId: import("effect/Schema").withDecodingDefault<import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">>>;
            readonly createdAt: import("effect/Schema").String;
            readonly updatedAt: import("effect/Schema").String;
        }>>>;
        readonly activities: import("effect/Schema").$Array<import("effect/Schema").Struct<{
            readonly id: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
            readonly tone: import("effect/Schema").Literals<readonly ["info", "tool", "approval", "error"]>;
            readonly kind: import("effect/Schema").Trim;
            readonly summary: import("effect/Schema").Trim;
            readonly payload: import("effect/Schema").Unknown;
            readonly turnId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "TurnId">>;
            readonly sequence: import("effect/Schema").optional<import("effect/Schema").Int>;
            readonly createdAt: import("effect/Schema").String;
        }>>;
        readonly checkpoints: import("effect/Schema").$Array<import("effect/Schema").Struct<{
            readonly turnId: import("effect/Schema").brand<import("effect/Schema").Trim, "TurnId">;
            readonly checkpointTurnCount: import("effect/Schema").Int;
            readonly checkpointRef: import("effect/Schema").brand<import("effect/Schema").Trim, "CheckpointRef">;
            readonly status: import("effect/Schema").Literals<readonly ["ready", "missing", "error"]>;
            readonly files: import("effect/Schema").$Array<import("effect/Schema").Struct<{
                readonly path: import("effect/Schema").Trim;
                readonly kind: import("effect/Schema").Trim;
                readonly additions: import("effect/Schema").Int;
                readonly deletions: import("effect/Schema").Int;
            }>>;
            readonly assistantMessageId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "MessageId">>;
            readonly completedAt: import("effect/Schema").String;
        }>>;
        readonly session: import("effect/Schema").NullOr<import("effect/Schema").Struct<{
            readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
            readonly status: import("effect/Schema").Literals<readonly ["idle", "starting", "running", "ready", "interrupted", "stopped", "error"]>;
            readonly providerName: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
            readonly runtimeMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["approval-required", "full-access"]>>;
            readonly activeTurnId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "TurnId">>;
            readonly lastError: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
            readonly updatedAt: import("effect/Schema").String;
        }>>;
    }>>;
    readonly updatedAt: import("effect/Schema").String;
}>, typeof import("@t3tools/contracts").OrchestrationGetSnapshotError, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"orchestration.dispatchCommand", import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"project.create">;
    readonly commandId: import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">;
    readonly projectId: import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">;
    readonly title: import("effect/Schema").Trim;
    readonly workspaceRoot: import("effect/Schema").Trim;
    readonly defaultModelSelection: import("effect/Schema").optional<import("effect/Schema").NullOr<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"codex">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"gemini">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"claudeAgent">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
            readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"opencode">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"copilotAgent">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
        }>>;
    }>]>>>;
    readonly createdAt: import("effect/Schema").String;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"project.meta.update">;
    readonly commandId: import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">;
    readonly projectId: import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">;
    readonly title: import("effect/Schema").optional<import("effect/Schema").Trim>;
    readonly workspaceRoot: import("effect/Schema").optional<import("effect/Schema").Trim>;
    readonly defaultModelSelection: import("effect/Schema").optional<import("effect/Schema").NullOr<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"codex">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"gemini">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"claudeAgent">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
            readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"opencode">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"copilotAgent">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
        }>>;
    }>]>>>;
    readonly scripts: import("effect/Schema").optional<import("effect/Schema").$Array<import("effect/Schema").Struct<{
        readonly id: import("effect/Schema").Trim;
        readonly name: import("effect/Schema").Trim;
        readonly command: import("effect/Schema").Trim;
        readonly icon: import("effect/Schema").Literals<readonly ["play", "test", "lint", "configure", "build", "debug"]>;
        readonly runOnWorktreeCreate: import("effect/Schema").Boolean;
    }>>>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"project.delete">;
    readonly commandId: import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">;
    readonly projectId: import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.create">;
    readonly commandId: import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">;
    readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
    readonly projectId: import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">;
    readonly title: import("effect/Schema").Trim;
    readonly modelSelection: import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"codex">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"gemini">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"claudeAgent">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
            readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"opencode">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"copilotAgent">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
        }>>;
    }>]>;
    readonly runtimeMode: import("effect/Schema").Literals<readonly ["approval-required", "full-access"]>;
    readonly interactionMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["default", "plan"]>>;
    readonly branch: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
    readonly worktreePath: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
    readonly createdAt: import("effect/Schema").String;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.delete">;
    readonly commandId: import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">;
    readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.archive">;
    readonly commandId: import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">;
    readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.unarchive">;
    readonly commandId: import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">;
    readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.meta.update">;
    readonly commandId: import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">;
    readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
    readonly title: import("effect/Schema").optional<import("effect/Schema").Trim>;
    readonly modelSelection: import("effect/Schema").optional<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"codex">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"gemini">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"claudeAgent">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
            readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"opencode">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"copilotAgent">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
        }>>;
    }>]>>;
    readonly branch: import("effect/Schema").optional<import("effect/Schema").NullOr<import("effect/Schema").Trim>>;
    readonly worktreePath: import("effect/Schema").optional<import("effect/Schema").NullOr<import("effect/Schema").Trim>>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.runtime-mode.set">;
    readonly commandId: import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">;
    readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
    readonly runtimeMode: import("effect/Schema").Literals<readonly ["approval-required", "full-access"]>;
    readonly createdAt: import("effect/Schema").String;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.interaction-mode.set">;
    readonly commandId: import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">;
    readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
    readonly interactionMode: import("effect/Schema").Literals<readonly ["default", "plan"]>;
    readonly createdAt: import("effect/Schema").String;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.turn.start">;
    readonly commandId: import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">;
    readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
    readonly message: import("effect/Schema").Struct<{
        readonly messageId: import("effect/Schema").brand<import("effect/Schema").Trim, "MessageId">;
        readonly role: import("effect/Schema").Literal<"user">;
        readonly text: import("effect/Schema").String;
        readonly attachments: import("effect/Schema").$Array<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly type: import("effect/Schema").Literal<"image">;
            readonly name: import("effect/Schema").Trim;
            readonly mimeType: import("effect/Schema").Trim;
            readonly sizeBytes: import("effect/Schema").Int;
            readonly dataUrl: import("effect/Schema").Trim;
        }>]>>;
    }>;
    readonly modelSelection: import("effect/Schema").optional<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"codex">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"gemini">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"claudeAgent">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
            readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"opencode">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
        }>>;
    }>, import("effect/Schema").Struct<{
        readonly provider: import("effect/Schema").Literal<"copilotAgent">;
        readonly model: import("effect/Schema").Trim;
        readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
            readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
        }>>;
    }>]>>;
    readonly providerOptions: import("effect/Schema").optional<import("effect/Schema").Struct<{
        readonly codex: import("effect/Schema").optional<import("effect/Schema").Struct<{
            readonly binaryPath: import("effect/Schema").optional<import("effect/Schema").Trim>;
            readonly homePath: import("effect/Schema").optional<import("effect/Schema").Trim>;
        }>>;
        readonly gemini: import("effect/Schema").optional<import("effect/Schema").Struct<{
            readonly binaryPath: import("effect/Schema").optional<import("effect/Schema").Trim>;
            readonly homePath: import("effect/Schema").optional<import("effect/Schema").Trim>;
        }>>;
        readonly claudeAgent: import("effect/Schema").optional<import("effect/Schema").Struct<{
            readonly binaryPath: import("effect/Schema").optional<import("effect/Schema").Trim>;
            readonly permissionMode: import("effect/Schema").optional<import("effect/Schema").Trim>;
            readonly maxThinkingTokens: import("effect/Schema").optional<import("effect/Schema").Int>;
        }>>;
        readonly opencode: import("effect/Schema").optional<import("effect/Schema").Struct<{
            readonly binaryPath: import("effect/Schema").optional<import("effect/Schema").Trim>;
            readonly apiKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        }>>;
        readonly copilotAgent: import("effect/Schema").optional<import("effect/Schema").Struct<{
            readonly binaryPath: import("effect/Schema").optional<import("effect/Schema").Trim>;
        }>>;
    }>>;
    readonly assistantDeliveryMode: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["buffered", "streaming"]>>;
    readonly titleSeed: import("effect/Schema").optional<import("effect/Schema").Trim>;
    readonly runtimeMode: import("effect/Schema").Literals<readonly ["approval-required", "full-access"]>;
    readonly interactionMode: import("effect/Schema").Literals<readonly ["default", "plan"]>;
    readonly bootstrap: import("effect/Schema").optional<import("effect/Schema").Struct<{
        readonly createThread: import("effect/Schema").optional<import("effect/Schema").Struct<{
            readonly projectId: import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">;
            readonly title: import("effect/Schema").Trim;
            readonly modelSelection: import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
                readonly provider: import("effect/Schema").Literal<"codex">;
                readonly model: import("effect/Schema").Trim;
                readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                    readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                    readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                }>>;
            }>, import("effect/Schema").Struct<{
                readonly provider: import("effect/Schema").Literal<"gemini">;
                readonly model: import("effect/Schema").Trim;
                readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                    readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
                }>>;
            }>, import("effect/Schema").Struct<{
                readonly provider: import("effect/Schema").Literal<"claudeAgent">;
                readonly model: import("effect/Schema").Trim;
                readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                    readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                    readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
                    readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                    readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
                }>>;
            }>, import("effect/Schema").Struct<{
                readonly provider: import("effect/Schema").Literal<"opencode">;
                readonly model: import("effect/Schema").Trim;
                readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                    readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                }>>;
            }>, import("effect/Schema").Struct<{
                readonly provider: import("effect/Schema").Literal<"copilotAgent">;
                readonly model: import("effect/Schema").Trim;
                readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                    readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                }>>;
            }>]>;
            readonly runtimeMode: import("effect/Schema").Literals<readonly ["approval-required", "full-access"]>;
            readonly interactionMode: import("effect/Schema").Literals<readonly ["default", "plan"]>;
            readonly branch: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
            readonly worktreePath: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
            readonly createdAt: import("effect/Schema").String;
        }>>;
        readonly prepareWorktree: import("effect/Schema").optional<import("effect/Schema").Struct<{
            readonly projectCwd: import("effect/Schema").Trim;
            readonly baseBranch: import("effect/Schema").Trim;
            readonly branch: import("effect/Schema").optional<import("effect/Schema").Trim>;
        }>>;
        readonly runSetupScript: import("effect/Schema").optional<import("effect/Schema").Boolean>;
    }>>;
    readonly sourceProposedPlan: import("effect/Schema").optional<import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly planId: import("effect/Schema").Trim;
    }>>;
    readonly createdAt: import("effect/Schema").String;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.turn.interrupt">;
    readonly commandId: import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">;
    readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
    readonly turnId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "TurnId">>;
    readonly createdAt: import("effect/Schema").String;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.approval.respond">;
    readonly commandId: import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">;
    readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
    readonly requestId: import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">;
    readonly decision: import("effect/Schema").Literals<readonly ["accept", "acceptForSession", "decline", "cancel"]>;
    readonly createdAt: import("effect/Schema").String;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.user-input.respond">;
    readonly commandId: import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">;
    readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
    readonly requestId: import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">;
    readonly answers: import("effect/Schema").$Record<import("effect/Schema").String, import("effect/Schema").Unknown>;
    readonly createdAt: import("effect/Schema").String;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.checkpoint.revert">;
    readonly commandId: import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">;
    readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
    readonly turnCount: import("effect/Schema").Int;
    readonly createdAt: import("effect/Schema").String;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.session.stop">;
    readonly commandId: import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">;
    readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
    readonly createdAt: import("effect/Schema").String;
}>]>, import("effect/Schema").Struct<{
    readonly sequence: import("effect/Schema").Int;
}>, typeof import("@t3tools/contracts").OrchestrationDispatchCommandError, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"orchestration.getTurnDiff", import("effect/Schema").Struct<{
    readonly fromTurnCount: import("effect/Schema").Int;
    readonly toTurnCount: import("effect/Schema").Int;
    readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
}>, import("effect/Schema").Struct<{
    readonly fromTurnCount: import("effect/Schema").Int;
    readonly toTurnCount: import("effect/Schema").Int;
    readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
    readonly diff: import("effect/Schema").String;
}>, typeof import("@t3tools/contracts").OrchestrationGetTurnDiffError, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"orchestration.getFullThreadDiff", import("effect/Schema").Struct<{
    readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
    readonly toTurnCount: import("effect/Schema").Int;
}>, import("effect/Schema").Struct<{
    readonly fromTurnCount: import("effect/Schema").Int;
    readonly toTurnCount: import("effect/Schema").Int;
    readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
    readonly diff: import("effect/Schema").String;
}>, typeof import("@t3tools/contracts").OrchestrationGetFullThreadDiffError, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"orchestration.replayEvents", import("effect/Schema").Struct<{
    readonly fromSequenceExclusive: import("effect/Schema").Int;
}>, import("effect/Schema").$Array<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"project.created">;
    readonly payload: import("effect/Schema").Struct<{
        readonly projectId: import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">;
        readonly title: import("effect/Schema").Trim;
        readonly workspaceRoot: import("effect/Schema").Trim;
        readonly defaultModelSelection: import("effect/Schema").NullOr<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"codex">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"gemini">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"claudeAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"opencode">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"copilotAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>]>>;
        readonly scripts: import("effect/Schema").$Array<import("effect/Schema").Struct<{
            readonly id: import("effect/Schema").Trim;
            readonly name: import("effect/Schema").Trim;
            readonly command: import("effect/Schema").Trim;
            readonly icon: import("effect/Schema").Literals<readonly ["play", "test", "lint", "configure", "build", "debug"]>;
            readonly runOnWorktreeCreate: import("effect/Schema").Boolean;
        }>>;
        readonly createdAt: import("effect/Schema").String;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"project.meta-updated">;
    readonly payload: import("effect/Schema").Struct<{
        readonly projectId: import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">;
        readonly title: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly workspaceRoot: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly defaultModelSelection: import("effect/Schema").optional<import("effect/Schema").NullOr<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"codex">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"gemini">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"claudeAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"opencode">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"copilotAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>]>>>;
        readonly scripts: import("effect/Schema").optional<import("effect/Schema").$Array<import("effect/Schema").Struct<{
            readonly id: import("effect/Schema").Trim;
            readonly name: import("effect/Schema").Trim;
            readonly command: import("effect/Schema").Trim;
            readonly icon: import("effect/Schema").Literals<readonly ["play", "test", "lint", "configure", "build", "debug"]>;
            readonly runOnWorktreeCreate: import("effect/Schema").Boolean;
        }>>>;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"project.deleted">;
    readonly payload: import("effect/Schema").Struct<{
        readonly projectId: import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">;
        readonly deletedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.created">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly projectId: import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">;
        readonly title: import("effect/Schema").Trim;
        readonly modelSelection: import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"codex">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"gemini">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"claudeAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"opencode">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"copilotAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>]>;
        readonly runtimeMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["approval-required", "full-access"]>>;
        readonly interactionMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["default", "plan"]>>;
        readonly branch: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
        readonly worktreePath: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
        readonly createdAt: import("effect/Schema").String;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.deleted">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly deletedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.archived">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly archivedAt: import("effect/Schema").String;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.unarchived">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.meta-updated">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly title: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly modelSelection: import("effect/Schema").optional<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"codex">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"gemini">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"claudeAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"opencode">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"copilotAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>]>>;
        readonly branch: import("effect/Schema").optional<import("effect/Schema").NullOr<import("effect/Schema").Trim>>;
        readonly worktreePath: import("effect/Schema").optional<import("effect/Schema").NullOr<import("effect/Schema").Trim>>;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.runtime-mode-set">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly runtimeMode: import("effect/Schema").Literals<readonly ["approval-required", "full-access"]>;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.interaction-mode-set">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly interactionMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["default", "plan"]>>;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.message-sent">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly messageId: import("effect/Schema").brand<import("effect/Schema").Trim, "MessageId">;
        readonly role: import("effect/Schema").Literals<readonly ["user", "assistant", "system"]>;
        readonly text: import("effect/Schema").String;
        readonly attachments: import("effect/Schema").optional<import("effect/Schema").$Array<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly type: import("effect/Schema").Literal<"image">;
            readonly id: import("effect/Schema").Trim;
            readonly name: import("effect/Schema").Trim;
            readonly mimeType: import("effect/Schema").Trim;
            readonly sizeBytes: import("effect/Schema").Int;
        }>]>>>;
        readonly turnId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "TurnId">>;
        readonly streaming: import("effect/Schema").Boolean;
        readonly createdAt: import("effect/Schema").String;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.turn-start-requested">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly messageId: import("effect/Schema").brand<import("effect/Schema").Trim, "MessageId">;
        readonly modelSelection: import("effect/Schema").optional<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"codex">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"gemini">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"claudeAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"opencode">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"copilotAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>]>>;
        readonly providerOptions: import("effect/Schema").optional<import("effect/Schema").Struct<{
            readonly codex: import("effect/Schema").optional<import("effect/Schema").Struct<{
                readonly binaryPath: import("effect/Schema").optional<import("effect/Schema").Trim>;
                readonly homePath: import("effect/Schema").optional<import("effect/Schema").Trim>;
            }>>;
            readonly gemini: import("effect/Schema").optional<import("effect/Schema").Struct<{
                readonly binaryPath: import("effect/Schema").optional<import("effect/Schema").Trim>;
                readonly homePath: import("effect/Schema").optional<import("effect/Schema").Trim>;
            }>>;
            readonly claudeAgent: import("effect/Schema").optional<import("effect/Schema").Struct<{
                readonly binaryPath: import("effect/Schema").optional<import("effect/Schema").Trim>;
                readonly permissionMode: import("effect/Schema").optional<import("effect/Schema").Trim>;
                readonly maxThinkingTokens: import("effect/Schema").optional<import("effect/Schema").Int>;
            }>>;
            readonly opencode: import("effect/Schema").optional<import("effect/Schema").Struct<{
                readonly binaryPath: import("effect/Schema").optional<import("effect/Schema").Trim>;
                readonly apiKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
            }>>;
            readonly copilotAgent: import("effect/Schema").optional<import("effect/Schema").Struct<{
                readonly binaryPath: import("effect/Schema").optional<import("effect/Schema").Trim>;
            }>>;
        }>>;
        readonly assistantDeliveryMode: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["buffered", "streaming"]>>;
        readonly titleSeed: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly runtimeMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["approval-required", "full-access"]>>;
        readonly interactionMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["default", "plan"]>>;
        readonly sourceProposedPlan: import("effect/Schema").optional<import("effect/Schema").Struct<{
            readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
            readonly planId: import("effect/Schema").Trim;
        }>>;
        readonly createdAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.turn-interrupt-requested">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly turnId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "TurnId">>;
        readonly createdAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.approval-response-requested">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly requestId: import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">;
        readonly decision: import("effect/Schema").Literals<readonly ["accept", "acceptForSession", "decline", "cancel"]>;
        readonly createdAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.user-input-response-requested">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly requestId: import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">;
        readonly answers: import("effect/Schema").$Record<import("effect/Schema").String, import("effect/Schema").Unknown>;
        readonly createdAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.checkpoint-revert-requested">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly turnCount: import("effect/Schema").Int;
        readonly createdAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.reverted">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly turnCount: import("effect/Schema").Int;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.session-stop-requested">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly createdAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.session-set">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly session: import("effect/Schema").Struct<{
            readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
            readonly status: import("effect/Schema").Literals<readonly ["idle", "starting", "running", "ready", "interrupted", "stopped", "error"]>;
            readonly providerName: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
            readonly runtimeMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["approval-required", "full-access"]>>;
            readonly activeTurnId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "TurnId">>;
            readonly lastError: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
            readonly updatedAt: import("effect/Schema").String;
        }>;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.proposed-plan-upserted">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly proposedPlan: import("effect/Schema").Struct<{
            readonly id: import("effect/Schema").Trim;
            readonly turnId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "TurnId">>;
            readonly planMarkdown: import("effect/Schema").Trim;
            readonly implementedAt: import("effect/Schema").withDecodingDefault<import("effect/Schema").NullOr<import("effect/Schema").String>>;
            readonly implementationThreadId: import("effect/Schema").withDecodingDefault<import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">>>;
            readonly createdAt: import("effect/Schema").String;
            readonly updatedAt: import("effect/Schema").String;
        }>;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.turn-diff-completed">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly turnId: import("effect/Schema").brand<import("effect/Schema").Trim, "TurnId">;
        readonly checkpointTurnCount: import("effect/Schema").Int;
        readonly checkpointRef: import("effect/Schema").brand<import("effect/Schema").Trim, "CheckpointRef">;
        readonly status: import("effect/Schema").Literals<readonly ["ready", "missing", "error"]>;
        readonly files: import("effect/Schema").$Array<import("effect/Schema").Struct<{
            readonly path: import("effect/Schema").Trim;
            readonly kind: import("effect/Schema").Trim;
            readonly additions: import("effect/Schema").Int;
            readonly deletions: import("effect/Schema").Int;
        }>>;
        readonly assistantMessageId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "MessageId">>;
        readonly completedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.activity-appended">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly activity: import("effect/Schema").Struct<{
            readonly id: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
            readonly tone: import("effect/Schema").Literals<readonly ["info", "tool", "approval", "error"]>;
            readonly kind: import("effect/Schema").Trim;
            readonly summary: import("effect/Schema").Trim;
            readonly payload: import("effect/Schema").Unknown;
            readonly turnId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "TurnId">>;
            readonly sequence: import("effect/Schema").optional<import("effect/Schema").Int>;
            readonly createdAt: import("effect/Schema").String;
        }>;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>]>>, typeof import("@t3tools/contracts").OrchestrationReplayEventsError, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"subscribeOrchestrationDomainEvents", import("effect/Schema").Struct<{}>, import("effect/unstable/rpc/RpcSchema").Stream<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"project.created">;
    readonly payload: import("effect/Schema").Struct<{
        readonly projectId: import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">;
        readonly title: import("effect/Schema").Trim;
        readonly workspaceRoot: import("effect/Schema").Trim;
        readonly defaultModelSelection: import("effect/Schema").NullOr<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"codex">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"gemini">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"claudeAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"opencode">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"copilotAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>]>>;
        readonly scripts: import("effect/Schema").$Array<import("effect/Schema").Struct<{
            readonly id: import("effect/Schema").Trim;
            readonly name: import("effect/Schema").Trim;
            readonly command: import("effect/Schema").Trim;
            readonly icon: import("effect/Schema").Literals<readonly ["play", "test", "lint", "configure", "build", "debug"]>;
            readonly runOnWorktreeCreate: import("effect/Schema").Boolean;
        }>>;
        readonly createdAt: import("effect/Schema").String;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"project.meta-updated">;
    readonly payload: import("effect/Schema").Struct<{
        readonly projectId: import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">;
        readonly title: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly workspaceRoot: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly defaultModelSelection: import("effect/Schema").optional<import("effect/Schema").NullOr<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"codex">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"gemini">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"claudeAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"opencode">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"copilotAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>]>>>;
        readonly scripts: import("effect/Schema").optional<import("effect/Schema").$Array<import("effect/Schema").Struct<{
            readonly id: import("effect/Schema").Trim;
            readonly name: import("effect/Schema").Trim;
            readonly command: import("effect/Schema").Trim;
            readonly icon: import("effect/Schema").Literals<readonly ["play", "test", "lint", "configure", "build", "debug"]>;
            readonly runOnWorktreeCreate: import("effect/Schema").Boolean;
        }>>>;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"project.deleted">;
    readonly payload: import("effect/Schema").Struct<{
        readonly projectId: import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">;
        readonly deletedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.created">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly projectId: import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">;
        readonly title: import("effect/Schema").Trim;
        readonly modelSelection: import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"codex">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"gemini">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"claudeAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"opencode">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"copilotAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>]>;
        readonly runtimeMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["approval-required", "full-access"]>>;
        readonly interactionMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["default", "plan"]>>;
        readonly branch: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
        readonly worktreePath: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
        readonly createdAt: import("effect/Schema").String;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.deleted">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly deletedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.archived">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly archivedAt: import("effect/Schema").String;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.unarchived">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.meta-updated">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly title: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly modelSelection: import("effect/Schema").optional<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"codex">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"gemini">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"claudeAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"opencode">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"copilotAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>]>>;
        readonly branch: import("effect/Schema").optional<import("effect/Schema").NullOr<import("effect/Schema").Trim>>;
        readonly worktreePath: import("effect/Schema").optional<import("effect/Schema").NullOr<import("effect/Schema").Trim>>;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.runtime-mode-set">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly runtimeMode: import("effect/Schema").Literals<readonly ["approval-required", "full-access"]>;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.interaction-mode-set">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly interactionMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["default", "plan"]>>;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.message-sent">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly messageId: import("effect/Schema").brand<import("effect/Schema").Trim, "MessageId">;
        readonly role: import("effect/Schema").Literals<readonly ["user", "assistant", "system"]>;
        readonly text: import("effect/Schema").String;
        readonly attachments: import("effect/Schema").optional<import("effect/Schema").$Array<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly type: import("effect/Schema").Literal<"image">;
            readonly id: import("effect/Schema").Trim;
            readonly name: import("effect/Schema").Trim;
            readonly mimeType: import("effect/Schema").Trim;
            readonly sizeBytes: import("effect/Schema").Int;
        }>]>>>;
        readonly turnId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "TurnId">>;
        readonly streaming: import("effect/Schema").Boolean;
        readonly createdAt: import("effect/Schema").String;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.turn-start-requested">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly messageId: import("effect/Schema").brand<import("effect/Schema").Trim, "MessageId">;
        readonly modelSelection: import("effect/Schema").optional<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"codex">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"gemini">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"claudeAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
                readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"opencode">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>, import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literal<"copilotAgent">;
            readonly model: import("effect/Schema").Trim;
            readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
            }>>;
        }>]>>;
        readonly providerOptions: import("effect/Schema").optional<import("effect/Schema").Struct<{
            readonly codex: import("effect/Schema").optional<import("effect/Schema").Struct<{
                readonly binaryPath: import("effect/Schema").optional<import("effect/Schema").Trim>;
                readonly homePath: import("effect/Schema").optional<import("effect/Schema").Trim>;
            }>>;
            readonly gemini: import("effect/Schema").optional<import("effect/Schema").Struct<{
                readonly binaryPath: import("effect/Schema").optional<import("effect/Schema").Trim>;
                readonly homePath: import("effect/Schema").optional<import("effect/Schema").Trim>;
            }>>;
            readonly claudeAgent: import("effect/Schema").optional<import("effect/Schema").Struct<{
                readonly binaryPath: import("effect/Schema").optional<import("effect/Schema").Trim>;
                readonly permissionMode: import("effect/Schema").optional<import("effect/Schema").Trim>;
                readonly maxThinkingTokens: import("effect/Schema").optional<import("effect/Schema").Int>;
            }>>;
            readonly opencode: import("effect/Schema").optional<import("effect/Schema").Struct<{
                readonly binaryPath: import("effect/Schema").optional<import("effect/Schema").Trim>;
                readonly apiKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
            }>>;
            readonly copilotAgent: import("effect/Schema").optional<import("effect/Schema").Struct<{
                readonly binaryPath: import("effect/Schema").optional<import("effect/Schema").Trim>;
            }>>;
        }>>;
        readonly assistantDeliveryMode: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["buffered", "streaming"]>>;
        readonly titleSeed: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly runtimeMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["approval-required", "full-access"]>>;
        readonly interactionMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["default", "plan"]>>;
        readonly sourceProposedPlan: import("effect/Schema").optional<import("effect/Schema").Struct<{
            readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
            readonly planId: import("effect/Schema").Trim;
        }>>;
        readonly createdAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.turn-interrupt-requested">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly turnId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "TurnId">>;
        readonly createdAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.approval-response-requested">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly requestId: import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">;
        readonly decision: import("effect/Schema").Literals<readonly ["accept", "acceptForSession", "decline", "cancel"]>;
        readonly createdAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.user-input-response-requested">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly requestId: import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">;
        readonly answers: import("effect/Schema").$Record<import("effect/Schema").String, import("effect/Schema").Unknown>;
        readonly createdAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.checkpoint-revert-requested">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly turnCount: import("effect/Schema").Int;
        readonly createdAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.reverted">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly turnCount: import("effect/Schema").Int;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.session-stop-requested">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly createdAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.session-set">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly session: import("effect/Schema").Struct<{
            readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
            readonly status: import("effect/Schema").Literals<readonly ["idle", "starting", "running", "ready", "interrupted", "stopped", "error"]>;
            readonly providerName: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
            readonly runtimeMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["approval-required", "full-access"]>>;
            readonly activeTurnId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "TurnId">>;
            readonly lastError: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
            readonly updatedAt: import("effect/Schema").String;
        }>;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.proposed-plan-upserted">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly proposedPlan: import("effect/Schema").Struct<{
            readonly id: import("effect/Schema").Trim;
            readonly turnId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "TurnId">>;
            readonly planMarkdown: import("effect/Schema").Trim;
            readonly implementedAt: import("effect/Schema").withDecodingDefault<import("effect/Schema").NullOr<import("effect/Schema").String>>;
            readonly implementationThreadId: import("effect/Schema").withDecodingDefault<import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">>>;
            readonly createdAt: import("effect/Schema").String;
            readonly updatedAt: import("effect/Schema").String;
        }>;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.turn-diff-completed">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly turnId: import("effect/Schema").brand<import("effect/Schema").Trim, "TurnId">;
        readonly checkpointTurnCount: import("effect/Schema").Int;
        readonly checkpointRef: import("effect/Schema").brand<import("effect/Schema").Trim, "CheckpointRef">;
        readonly status: import("effect/Schema").Literals<readonly ["ready", "missing", "error"]>;
        readonly files: import("effect/Schema").$Array<import("effect/Schema").Struct<{
            readonly path: import("effect/Schema").Trim;
            readonly kind: import("effect/Schema").Trim;
            readonly additions: import("effect/Schema").Int;
            readonly deletions: import("effect/Schema").Int;
        }>>;
        readonly assistantMessageId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "MessageId">>;
        readonly completedAt: import("effect/Schema").String;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"thread.activity-appended">;
    readonly payload: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">;
        readonly activity: import("effect/Schema").Struct<{
            readonly id: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
            readonly tone: import("effect/Schema").Literals<readonly ["info", "tool", "approval", "error"]>;
            readonly kind: import("effect/Schema").Trim;
            readonly summary: import("effect/Schema").Trim;
            readonly payload: import("effect/Schema").Unknown;
            readonly turnId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "TurnId">>;
            readonly sequence: import("effect/Schema").optional<import("effect/Schema").Int>;
            readonly createdAt: import("effect/Schema").String;
        }>;
    }>;
    readonly sequence: import("effect/Schema").Int;
    readonly eventId: import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">;
    readonly aggregateKind: import("effect/Schema").Literals<readonly ["project", "thread"]>;
    readonly aggregateId: import("effect/Schema").Union<readonly [import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">, import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">]>;
    readonly occurredAt: import("effect/Schema").String;
    readonly commandId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly causationEventId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "EventId">>;
    readonly correlationId: import("effect/Schema").NullOr<import("effect/Schema").brand<import("effect/Schema").Trim, "CommandId">>;
    readonly metadata: import("effect/Schema").Struct<{
        readonly providerTurnId: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly providerItemId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProviderItemId">>;
        readonly adapterKey: import("effect/Schema").optional<import("effect/Schema").Trim>;
        readonly requestId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ApprovalRequestId">>;
        readonly ingestedAt: import("effect/Schema").optional<import("effect/Schema").String>;
    }>;
}>]>, import("effect/Schema").Never>, import("effect/Schema").Never, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"subscribeTerminalEvents", import("effect/Schema").Struct<{}>, import("effect/unstable/rpc/RpcSchema").Stream<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"started">;
    readonly snapshot: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").String;
        readonly terminalId: import("effect/Schema").String;
        readonly cwd: import("effect/Schema").String;
        readonly worktreePath: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
        readonly status: import("effect/Schema").Literals<readonly ["starting", "running", "exited", "error"]>;
        readonly pid: import("effect/Schema").NullOr<import("effect/Schema").Int>;
        readonly history: import("effect/Schema").String;
        readonly exitCode: import("effect/Schema").NullOr<import("effect/Schema").Int>;
        readonly exitSignal: import("effect/Schema").NullOr<import("effect/Schema").Int>;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly threadId: import("effect/Schema").String;
    readonly terminalId: import("effect/Schema").String;
    readonly createdAt: import("effect/Schema").String;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"output">;
    readonly data: import("effect/Schema").String;
    readonly threadId: import("effect/Schema").String;
    readonly terminalId: import("effect/Schema").String;
    readonly createdAt: import("effect/Schema").String;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"exited">;
    readonly exitCode: import("effect/Schema").NullOr<import("effect/Schema").Int>;
    readonly exitSignal: import("effect/Schema").NullOr<import("effect/Schema").Int>;
    readonly threadId: import("effect/Schema").String;
    readonly terminalId: import("effect/Schema").String;
    readonly createdAt: import("effect/Schema").String;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"error">;
    readonly message: import("effect/Schema").String;
    readonly threadId: import("effect/Schema").String;
    readonly terminalId: import("effect/Schema").String;
    readonly createdAt: import("effect/Schema").String;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"cleared">;
    readonly threadId: import("effect/Schema").String;
    readonly terminalId: import("effect/Schema").String;
    readonly createdAt: import("effect/Schema").String;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"restarted">;
    readonly snapshot: import("effect/Schema").Struct<{
        readonly threadId: import("effect/Schema").String;
        readonly terminalId: import("effect/Schema").String;
        readonly cwd: import("effect/Schema").String;
        readonly worktreePath: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
        readonly status: import("effect/Schema").Literals<readonly ["starting", "running", "exited", "error"]>;
        readonly pid: import("effect/Schema").NullOr<import("effect/Schema").Int>;
        readonly history: import("effect/Schema").String;
        readonly exitCode: import("effect/Schema").NullOr<import("effect/Schema").Int>;
        readonly exitSignal: import("effect/Schema").NullOr<import("effect/Schema").Int>;
        readonly updatedAt: import("effect/Schema").String;
    }>;
    readonly threadId: import("effect/Schema").String;
    readonly terminalId: import("effect/Schema").String;
    readonly createdAt: import("effect/Schema").String;
}>, import("effect/Schema").Struct<{
    readonly type: import("effect/Schema").Literal<"activity">;
    readonly hasRunningSubprocess: import("effect/Schema").Boolean;
    readonly threadId: import("effect/Schema").String;
    readonly terminalId: import("effect/Schema").String;
    readonly createdAt: import("effect/Schema").String;
}>]>, import("effect/Schema").Never>, import("effect/Schema").Never, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"subscribeServerConfig", import("effect/Schema").Struct<{}>, import("effect/unstable/rpc/RpcSchema").Stream<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
    readonly version: import("effect/Schema").Literal<1>;
    readonly type: import("effect/Schema").Literal<"snapshot">;
    readonly config: import("effect/Schema").Struct<{
        readonly cwd: import("effect/Schema").Trim;
        readonly keybindingsConfigPath: import("effect/Schema").Trim;
        readonly keybindings: import("effect/Schema").$Array<import("effect/Schema").Struct<{
            readonly command: import("effect/Schema").Union<readonly [import("effect/Schema").Literals<readonly ["terminal.toggle", "terminal.split", "terminal.new", "terminal.close", "diff.toggle", "chat.new", "chat.newLocal", "editor.openFavorite", "thread.previous", "thread.next", "thread.jump.1", "thread.jump.2", "thread.jump.3", "thread.jump.4", "thread.jump.5", "thread.jump.6", "thread.jump.7", "thread.jump.8", "thread.jump.9"]>, import("effect/Schema").TemplateLiteral<readonly [import("effect/Schema").Literal<"script.">, import("effect/Schema").String, import("effect/Schema").Literal<".run">]>]>;
            readonly shortcut: import("effect/Schema").Struct<{
                readonly key: import("effect/Schema").Trim;
                readonly metaKey: import("effect/Schema").Boolean;
                readonly ctrlKey: import("effect/Schema").Boolean;
                readonly shiftKey: import("effect/Schema").Boolean;
                readonly altKey: import("effect/Schema").Boolean;
                readonly modKey: import("effect/Schema").Boolean;
            }>;
            readonly whenAst: import("effect/Schema").optional<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
                readonly type: import("effect/Schema").Literal<"identifier">;
                readonly name: import("effect/Schema").String;
            }>, import("effect/Schema").Struct<{
                readonly type: import("effect/Schema").Literal<"not">;
                readonly node: import("effect/Schema").suspend<import("effect/Schema").Codec<import("@t3tools/contracts").KeybindingWhenNode, import("@t3tools/contracts").KeybindingWhenNode, never, never>>;
            }>, import("effect/Schema").Struct<{
                readonly type: import("effect/Schema").Literal<"and">;
                readonly left: import("effect/Schema").suspend<import("effect/Schema").Codec<import("@t3tools/contracts").KeybindingWhenNode, import("@t3tools/contracts").KeybindingWhenNode, never, never>>;
                readonly right: import("effect/Schema").suspend<import("effect/Schema").Codec<import("@t3tools/contracts").KeybindingWhenNode, import("@t3tools/contracts").KeybindingWhenNode, never, never>>;
            }>, import("effect/Schema").Struct<{
                readonly type: import("effect/Schema").Literal<"or">;
                readonly left: import("effect/Schema").suspend<import("effect/Schema").Codec<import("@t3tools/contracts").KeybindingWhenNode, import("@t3tools/contracts").KeybindingWhenNode, never, never>>;
                readonly right: import("effect/Schema").suspend<import("effect/Schema").Codec<import("@t3tools/contracts").KeybindingWhenNode, import("@t3tools/contracts").KeybindingWhenNode, never, never>>;
            }>]>>;
        }>>;
        readonly issues: import("effect/Schema").$Array<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly kind: import("effect/Schema").Literal<"keybindings.malformed-config">;
            readonly message: import("effect/Schema").Trim;
        }>, import("effect/Schema").Struct<{
            readonly kind: import("effect/Schema").Literal<"keybindings.invalid-entry">;
            readonly message: import("effect/Schema").Trim;
            readonly index: import("effect/Schema").Number;
        }>]>>;
        readonly providers: import("effect/Schema").$Array<import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literals<readonly ["codex", "gemini", "claudeAgent", "opencode", "copilotAgent"]>;
            readonly enabled: import("effect/Schema").Boolean;
            readonly installed: import("effect/Schema").Boolean;
            readonly version: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
            readonly status: import("effect/Schema").Literals<readonly ["ready", "warning", "error", "disabled"]>;
            readonly auth: import("effect/Schema").Struct<{
                readonly status: import("effect/Schema").Literals<readonly ["authenticated", "unauthenticated", "unknown"]>;
                readonly type: import("effect/Schema").optional<import("effect/Schema").Trim>;
                readonly label: import("effect/Schema").optional<import("effect/Schema").Trim>;
            }>;
            readonly checkedAt: import("effect/Schema").String;
            readonly message: import("effect/Schema").optional<import("effect/Schema").Trim>;
            readonly models: import("effect/Schema").$Array<import("effect/Schema").Struct<{
                readonly slug: import("effect/Schema").Trim;
                readonly name: import("effect/Schema").Trim;
                readonly isCustom: import("effect/Schema").Boolean;
                readonly capabilities: import("effect/Schema").NullOr<import("effect/Schema").Struct<{
                    readonly reasoningEffortLevels: import("effect/Schema").$Array<import("effect/Schema").Struct<{
                        readonly value: import("effect/Schema").Trim;
                        readonly label: import("effect/Schema").Trim;
                        readonly isDefault: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                    }>>;
                    readonly supportsFastMode: import("effect/Schema").Boolean;
                    readonly supportsThinkingToggle: import("effect/Schema").Boolean;
                    readonly contextWindowOptions: import("effect/Schema").$Array<import("effect/Schema").Struct<{
                        readonly value: import("effect/Schema").Trim;
                        readonly label: import("effect/Schema").Trim;
                        readonly isDefault: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                    }>>;
                    readonly promptInjectedEffortLevels: import("effect/Schema").$Array<import("effect/Schema").Trim>;
                }>>;
            }>>;
            readonly dynamicModels: import("effect/Schema").optional<import("effect/Schema").$Array<import("effect/Schema").Struct<{
                readonly id: import("effect/Schema").String;
                readonly name: import("effect/Schema").String;
            }>>>;
        }>>;
        readonly availableEditors: import("effect/Schema").$Array<import("effect/Schema").Literals<("cursor" | "trae" | "vscode" | "vscode-insiders" | "vscodium" | "zed" | "antigravity" | "idea" | "file-manager")[]>>;
        readonly observability: import("effect/Schema").Struct<{
            readonly logsDirectoryPath: import("effect/Schema").Trim;
            readonly localTracingEnabled: import("effect/Schema").Boolean;
            readonly otlpTracesUrl: import("effect/Schema").optional<import("effect/Schema").Trim>;
            readonly otlpTracesEnabled: import("effect/Schema").Boolean;
            readonly otlpMetricsUrl: import("effect/Schema").optional<import("effect/Schema").Trim>;
            readonly otlpMetricsEnabled: import("effect/Schema").Boolean;
        }>;
        readonly settings: import("effect/Schema").Struct<{
            readonly enableAssistantStreaming: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
            readonly defaultThreadEnvMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["local", "worktree"]>>;
            readonly textGenerationModelSelection: import("effect/Schema").withDecodingDefault<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
                readonly provider: import("effect/Schema").Literal<"codex">;
                readonly model: import("effect/Schema").Trim;
                readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                    readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                    readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                }>>;
            }>, import("effect/Schema").Struct<{
                readonly provider: import("effect/Schema").Literal<"gemini">;
                readonly model: import("effect/Schema").Trim;
                readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                    readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
                }>>;
            }>, import("effect/Schema").Struct<{
                readonly provider: import("effect/Schema").Literal<"claudeAgent">;
                readonly model: import("effect/Schema").Trim;
                readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                    readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                    readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
                    readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                    readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
                }>>;
            }>, import("effect/Schema").Struct<{
                readonly provider: import("effect/Schema").Literal<"opencode">;
                readonly model: import("effect/Schema").Trim;
                readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                    readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                }>>;
            }>, import("effect/Schema").Struct<{
                readonly provider: import("effect/Schema").Literal<"copilotAgent">;
                readonly model: import("effect/Schema").Trim;
                readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                    readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                }>>;
            }>]>>;
            readonly providers: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
                readonly codex: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
                    readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
                    readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
                    readonly homePath: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
                    readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
                }>>;
                readonly gemini: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
                    readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
                    readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
                    readonly homePath: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
                    readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
                }>>;
                readonly claudeAgent: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
                    readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
                    readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
                    readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
                }>>;
                readonly opencode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
                    readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
                    readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
                    readonly apiKey: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
                    readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
                }>>;
                readonly copilotAgent: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
                    readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
                    readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
                    readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
                }>>;
            }>>;
            readonly observability: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
                readonly otlpTracesUrl: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
                readonly otlpMetricsUrl: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
            }>>;
        }>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly version: import("effect/Schema").Literal<1>;
    readonly type: import("effect/Schema").Literal<"keybindingsUpdated">;
    readonly payload: import("effect/Schema").Struct<{
        readonly issues: import("effect/Schema").$Array<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
            readonly kind: import("effect/Schema").Literal<"keybindings.malformed-config">;
            readonly message: import("effect/Schema").Trim;
        }>, import("effect/Schema").Struct<{
            readonly kind: import("effect/Schema").Literal<"keybindings.invalid-entry">;
            readonly message: import("effect/Schema").Trim;
            readonly index: import("effect/Schema").Number;
        }>]>>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly version: import("effect/Schema").Literal<1>;
    readonly type: import("effect/Schema").Literal<"providerStatuses">;
    readonly payload: import("effect/Schema").Struct<{
        readonly providers: import("effect/Schema").$Array<import("effect/Schema").Struct<{
            readonly provider: import("effect/Schema").Literals<readonly ["codex", "gemini", "claudeAgent", "opencode", "copilotAgent"]>;
            readonly enabled: import("effect/Schema").Boolean;
            readonly installed: import("effect/Schema").Boolean;
            readonly version: import("effect/Schema").NullOr<import("effect/Schema").Trim>;
            readonly status: import("effect/Schema").Literals<readonly ["ready", "warning", "error", "disabled"]>;
            readonly auth: import("effect/Schema").Struct<{
                readonly status: import("effect/Schema").Literals<readonly ["authenticated", "unauthenticated", "unknown"]>;
                readonly type: import("effect/Schema").optional<import("effect/Schema").Trim>;
                readonly label: import("effect/Schema").optional<import("effect/Schema").Trim>;
            }>;
            readonly checkedAt: import("effect/Schema").String;
            readonly message: import("effect/Schema").optional<import("effect/Schema").Trim>;
            readonly models: import("effect/Schema").$Array<import("effect/Schema").Struct<{
                readonly slug: import("effect/Schema").Trim;
                readonly name: import("effect/Schema").Trim;
                readonly isCustom: import("effect/Schema").Boolean;
                readonly capabilities: import("effect/Schema").NullOr<import("effect/Schema").Struct<{
                    readonly reasoningEffortLevels: import("effect/Schema").$Array<import("effect/Schema").Struct<{
                        readonly value: import("effect/Schema").Trim;
                        readonly label: import("effect/Schema").Trim;
                        readonly isDefault: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                    }>>;
                    readonly supportsFastMode: import("effect/Schema").Boolean;
                    readonly supportsThinkingToggle: import("effect/Schema").Boolean;
                    readonly contextWindowOptions: import("effect/Schema").$Array<import("effect/Schema").Struct<{
                        readonly value: import("effect/Schema").Trim;
                        readonly label: import("effect/Schema").Trim;
                        readonly isDefault: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                    }>>;
                    readonly promptInjectedEffortLevels: import("effect/Schema").$Array<import("effect/Schema").Trim>;
                }>>;
            }>>;
            readonly dynamicModels: import("effect/Schema").optional<import("effect/Schema").$Array<import("effect/Schema").Struct<{
                readonly id: import("effect/Schema").String;
                readonly name: import("effect/Schema").String;
            }>>>;
        }>>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly version: import("effect/Schema").Literal<1>;
    readonly type: import("effect/Schema").Literal<"settingsUpdated">;
    readonly payload: import("effect/Schema").Struct<{
        readonly settings: import("effect/Schema").Struct<{
            readonly enableAssistantStreaming: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
            readonly defaultThreadEnvMode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Literals<readonly ["local", "worktree"]>>;
            readonly textGenerationModelSelection: import("effect/Schema").withDecodingDefault<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
                readonly provider: import("effect/Schema").Literal<"codex">;
                readonly model: import("effect/Schema").Trim;
                readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                    readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                    readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                }>>;
            }>, import("effect/Schema").Struct<{
                readonly provider: import("effect/Schema").Literal<"gemini">;
                readonly model: import("effect/Schema").Trim;
                readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                    readonly thinkingBudget: import("effect/Schema").optional<import("effect/Schema").Int>;
                }>>;
            }>, import("effect/Schema").Struct<{
                readonly provider: import("effect/Schema").Literal<"claudeAgent">;
                readonly model: import("effect/Schema").Trim;
                readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                    readonly thinking: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                    readonly effort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["low", "medium", "high", "max", "ultrathink"]>>;
                    readonly fastMode: import("effect/Schema").optional<import("effect/Schema").Boolean>;
                    readonly contextWindow: import("effect/Schema").optional<import("effect/Schema").String>;
                }>>;
            }>, import("effect/Schema").Struct<{
                readonly provider: import("effect/Schema").Literal<"opencode">;
                readonly model: import("effect/Schema").Trim;
                readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                    readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                }>>;
            }>, import("effect/Schema").Struct<{
                readonly provider: import("effect/Schema").Literal<"copilotAgent">;
                readonly model: import("effect/Schema").Trim;
                readonly options: import("effect/Schema").optionalKey<import("effect/Schema").Struct<{
                    readonly reasoningEffort: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["xhigh", "high", "medium", "low"]>>;
                }>>;
            }>]>>;
            readonly providers: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
                readonly codex: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
                    readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
                    readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
                    readonly homePath: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
                    readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
                }>>;
                readonly gemini: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
                    readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
                    readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
                    readonly homePath: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
                    readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
                }>>;
                readonly claudeAgent: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
                    readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
                    readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
                    readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
                }>>;
                readonly opencode: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
                    readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
                    readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
                    readonly apiKey: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
                    readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
                }>>;
                readonly copilotAgent: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
                    readonly enabled: import("effect/Schema").withDecodingDefault<import("effect/Schema").Boolean>;
                    readonly binaryPath: import("effect/Schema").withDecodingDefault<import("effect/Schema").decodeTo<import("effect/Schema").String, import("effect/Schema").Trim, never, never>>;
                    readonly customModels: import("effect/Schema").withDecodingDefault<import("effect/Schema").$Array<import("effect/Schema").String>>;
                }>>;
            }>>;
            readonly observability: import("effect/Schema").withDecodingDefault<import("effect/Schema").Struct<{
                readonly otlpTracesUrl: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
                readonly otlpMetricsUrl: import("effect/Schema").withDecodingDefault<import("effect/Schema").Trim>;
            }>>;
        }>;
    }>;
}>]>, import("effect/Schema").Union<readonly [typeof import("@t3tools/contracts").KeybindingsConfigError, typeof import("@t3tools/contracts").ServerSettingsError]>>, import("effect/Schema").Never, never, never> | import("effect/unstable/rpc/Rpc").Rpc<"subscribeServerLifecycle", import("effect/Schema").Struct<{}>, import("effect/unstable/rpc/RpcSchema").Stream<import("effect/Schema").Union<readonly [import("effect/Schema").Struct<{
    readonly version: import("effect/Schema").Literal<1>;
    readonly sequence: import("effect/Schema").Int;
    readonly type: import("effect/Schema").Literal<"welcome">;
    readonly payload: import("effect/Schema").Struct<{
        readonly cwd: import("effect/Schema").Trim;
        readonly projectName: import("effect/Schema").Trim;
        readonly bootstrapProjectId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ProjectId">>;
        readonly bootstrapThreadId: import("effect/Schema").optional<import("effect/Schema").brand<import("effect/Schema").Trim, "ThreadId">>;
    }>;
}>, import("effect/Schema").Struct<{
    readonly version: import("effect/Schema").Literal<1>;
    readonly sequence: import("effect/Schema").Int;
    readonly type: import("effect/Schema").Literal<"ready">;
    readonly payload: import("effect/Schema").Struct<{
        readonly at: import("effect/Schema").String;
    }>;
}>]>, import("effect/Schema").Never>, import("effect/Schema").Never, never, never>>;
export declare class WsRpcAtomClient extends WsRpcAtomClient_base {
}
export declare function runRpc<TSuccess, TError = never>(execute: (client: typeof WsRpcAtomClient.Service) => Effect.Effect<TSuccess, TError, never>): Promise<TSuccess>;
export declare function __resetWsRpcAtomClientForTests(): Promise<void>;
export {};
