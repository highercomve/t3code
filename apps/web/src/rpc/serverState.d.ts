import {
  type EditorId,
  type ServerConfig,
  type ServerConfigStreamEvent,
  type ServerConfigUpdatedPayload,
  type ServerLifecycleWelcomePayload,
  type ServerProvider,
  type ServerProviderUpdatedPayload,
  type ServerSettings,
} from "@t3tools/contracts";
import { Atom } from "effect/unstable/reactivity";
import type { WsRpcClient } from "./wsRpcClient";
export type ServerConfigUpdateSource = ServerConfigStreamEvent["type"];
export interface ServerConfigUpdatedNotification {
  readonly id: number;
  readonly payload: ServerConfigUpdatedPayload;
  readonly source: ServerConfigUpdateSource;
}
type ServerStateClient = Pick<
  WsRpcClient["server"],
  "getConfig" | "subscribeConfig" | "subscribeLifecycle"
>;
export declare const welcomeAtom: Atom.Writable<
  {
    readonly environment: {
      readonly environmentId: string & import("effect/Brand").Brand<"EnvironmentId">;
      readonly label: string;
      readonly platform: {
        readonly os: "darwin" | "linux" | "windows" | "unknown";
        readonly arch: "arm64" | "x64" | "other";
      };
      readonly serverVersion: string;
      readonly capabilities: {
        readonly repositoryIdentity: boolean;
      };
    };
    readonly cwd: string;
    readonly projectName: string;
    readonly bootstrapProjectId?: (string & import("effect/Brand").Brand<"ProjectId">) | undefined;
    readonly bootstrapThreadId?: (string & import("effect/Brand").Brand<"ThreadId">) | undefined;
  } | null,
  {
    readonly environment: {
      readonly environmentId: string & import("effect/Brand").Brand<"EnvironmentId">;
      readonly label: string;
      readonly platform: {
        readonly os: "darwin" | "linux" | "windows" | "unknown";
        readonly arch: "arm64" | "x64" | "other";
      };
      readonly serverVersion: string;
      readonly capabilities: {
        readonly repositoryIdentity: boolean;
      };
    };
    readonly cwd: string;
    readonly projectName: string;
    readonly bootstrapProjectId?: (string & import("effect/Brand").Brand<"ProjectId">) | undefined;
    readonly bootstrapThreadId?: (string & import("effect/Brand").Brand<"ThreadId">) | undefined;
  } | null
>;
export declare const serverConfigAtom: Atom.Writable<
  {
    readonly keybindings: readonly {
      readonly command:
        | "terminal.close"
        | "terminal.toggle"
        | "terminal.split"
        | "terminal.new"
        | "diff.toggle"
        | "commandPalette.toggle"
        | "chat.new"
        | "chat.newLocal"
        | "editor.openFavorite"
        | "thread.previous"
        | "thread.next"
        | "thread.jump.1"
        | "thread.jump.2"
        | "thread.jump.3"
        | "thread.jump.4"
        | "thread.jump.5"
        | "thread.jump.6"
        | "thread.jump.7"
        | "thread.jump.8"
        | "thread.jump.9"
        | `script.${string}.run`;
      readonly shortcut: {
        readonly key: string;
        readonly metaKey: boolean;
        readonly ctrlKey: boolean;
        readonly shiftKey: boolean;
        readonly altKey: boolean;
        readonly modKey: boolean;
      };
      readonly whenAst?:
        | {
            readonly type: "identifier";
            readonly name: string;
          }
        | {
            readonly type: "not";
            readonly node: import("@t3tools/contracts").KeybindingWhenNode;
          }
        | {
            readonly type: "and";
            readonly left: import("@t3tools/contracts").KeybindingWhenNode;
            readonly right: import("@t3tools/contracts").KeybindingWhenNode;
          }
        | {
            readonly type: "or";
            readonly left: import("@t3tools/contracts").KeybindingWhenNode;
            readonly right: import("@t3tools/contracts").KeybindingWhenNode;
          }
        | undefined;
    }[];
    readonly issues: readonly (
      | {
          readonly kind: "keybindings.malformed-config";
          readonly message: string;
        }
      | {
          readonly kind: "keybindings.invalid-entry";
          readonly message: string;
          readonly index: number;
        }
    )[];
    readonly auth: {
      readonly bootstrapMethods: readonly ("desktop-bootstrap" | "one-time-token")[];
      readonly sessionMethods: readonly ("browser-session-cookie" | "bearer-session-token")[];
      readonly policy:
        | "desktop-managed-local"
        | "loopback-browser"
        | "remote-reachable"
        | "unsafe-no-auth";
      readonly sessionCookieName: string;
    };
    readonly availableEditors: readonly (
      | "cursor"
      | "trae"
      | "kiro"
      | "vscode"
      | "vscode-insiders"
      | "vscodium"
      | "zed"
      | "antigravity"
      | "idea"
      | "file-manager"
    )[];
    readonly providers: readonly {
      readonly provider: "codex" | "gemini" | "claudeAgent" | "opencode" | "copilotAgent";
      readonly status: "ready" | "error" | "warning" | "disabled";
      readonly version: string | null;
      readonly models: readonly {
        readonly name: string;
        readonly capabilities: {
          readonly reasoningEffortLevels: readonly {
            readonly label: string;
            readonly value: string;
            readonly isDefault?: boolean | undefined;
          }[];
          readonly contextWindowOptions: readonly {
            readonly label: string;
            readonly value: string;
            readonly isDefault?: boolean | undefined;
          }[];
          readonly promptInjectedEffortLevels: readonly string[];
          readonly supportsFastMode: boolean;
          readonly supportsThinkingToggle: boolean;
        } | null;
        readonly slug: string;
        readonly isCustom: boolean;
      }[];
      readonly slashCommands: readonly {
        readonly name: string;
        readonly description?: string | undefined;
        readonly input?:
          | {
              readonly hint: string;
            }
          | undefined;
      }[];
      readonly enabled: boolean;
      readonly skills: readonly {
        readonly name: string;
        readonly path: string;
        readonly enabled: boolean;
        readonly displayName?: string | undefined;
        readonly description?: string | undefined;
        readonly scope?: string | undefined;
        readonly shortDescription?: string | undefined;
      }[];
      readonly installed: boolean;
      readonly auth: {
        readonly status: "unknown" | "authenticated" | "unauthenticated";
        readonly type?: string | undefined;
        readonly label?: string | undefined;
      };
      readonly checkedAt: string;
      readonly message?: string | undefined;
      readonly dynamicModels?:
        | readonly {
            readonly id: string;
            readonly name: string;
          }[]
        | undefined;
    }[];
    readonly observability: {
      readonly logsDirectoryPath: string;
      readonly localTracingEnabled: boolean;
      readonly otlpTracesEnabled: boolean;
      readonly otlpMetricsEnabled: boolean;
      readonly otlpTracesUrl?: string | undefined;
      readonly otlpMetricsUrl?: string | undefined;
    };
    readonly environment: {
      readonly environmentId: string & import("effect/Brand").Brand<"EnvironmentId">;
      readonly label: string;
      readonly platform: {
        readonly os: "darwin" | "linux" | "windows" | "unknown";
        readonly arch: "arm64" | "x64" | "other";
      };
      readonly serverVersion: string;
      readonly capabilities: {
        readonly repositoryIdentity: boolean;
      };
    };
    readonly cwd: string;
    readonly keybindingsConfigPath: string;
    readonly settings: {
      readonly enableAssistantStreaming: boolean;
      readonly defaultThreadEnvMode: "local" | "worktree";
      readonly textGenerationModelSelection:
        | {
            readonly provider: "codex";
            readonly model: string;
            readonly options?: {
              readonly reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
              readonly fastMode?: boolean | undefined;
            };
          }
        | {
            readonly provider: "gemini";
            readonly model: string;
            readonly options?: {
              readonly thinkingBudget?: number | undefined;
            };
          }
        | {
            readonly provider: "claudeAgent";
            readonly model: string;
            readonly options?: {
              readonly fastMode?: boolean | undefined;
              readonly thinking?: boolean | undefined;
              readonly effort?: "high" | "medium" | "low" | "max" | "ultrathink" | undefined;
              readonly contextWindow?: string | undefined;
            };
          }
        | {
            readonly provider: "opencode";
            readonly model: string;
            readonly options?: {
              readonly reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
            };
          }
        | {
            readonly provider: "copilotAgent";
            readonly model: string;
            readonly options?: {
              readonly reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
            };
          };
      readonly providers: {
        readonly codex: {
          readonly binaryPath: string;
          readonly homePath: string;
          readonly enabled: boolean;
          readonly customModels: readonly string[];
        };
        readonly gemini: {
          readonly binaryPath: string;
          readonly homePath: string;
          readonly enabled: boolean;
          readonly customModels: readonly string[];
        };
        readonly claudeAgent: {
          readonly binaryPath: string;
          readonly enabled: boolean;
          readonly customModels: readonly string[];
        };
        readonly opencode: {
          readonly binaryPath: string;
          readonly apiKey: string;
          readonly enabled: boolean;
          readonly customModels: readonly string[];
        };
        readonly copilotAgent: {
          readonly binaryPath: string;
          readonly enabled: boolean;
          readonly customModels: readonly string[];
        };
      };
      readonly observability: {
        readonly otlpTracesUrl: string;
        readonly otlpMetricsUrl: string;
      };
    };
  } | null,
  {
    readonly keybindings: readonly {
      readonly command:
        | "terminal.close"
        | "terminal.toggle"
        | "terminal.split"
        | "terminal.new"
        | "diff.toggle"
        | "commandPalette.toggle"
        | "chat.new"
        | "chat.newLocal"
        | "editor.openFavorite"
        | "thread.previous"
        | "thread.next"
        | "thread.jump.1"
        | "thread.jump.2"
        | "thread.jump.3"
        | "thread.jump.4"
        | "thread.jump.5"
        | "thread.jump.6"
        | "thread.jump.7"
        | "thread.jump.8"
        | "thread.jump.9"
        | `script.${string}.run`;
      readonly shortcut: {
        readonly key: string;
        readonly metaKey: boolean;
        readonly ctrlKey: boolean;
        readonly shiftKey: boolean;
        readonly altKey: boolean;
        readonly modKey: boolean;
      };
      readonly whenAst?:
        | {
            readonly type: "identifier";
            readonly name: string;
          }
        | {
            readonly type: "not";
            readonly node: import("@t3tools/contracts").KeybindingWhenNode;
          }
        | {
            readonly type: "and";
            readonly left: import("@t3tools/contracts").KeybindingWhenNode;
            readonly right: import("@t3tools/contracts").KeybindingWhenNode;
          }
        | {
            readonly type: "or";
            readonly left: import("@t3tools/contracts").KeybindingWhenNode;
            readonly right: import("@t3tools/contracts").KeybindingWhenNode;
          }
        | undefined;
    }[];
    readonly issues: readonly (
      | {
          readonly kind: "keybindings.malformed-config";
          readonly message: string;
        }
      | {
          readonly kind: "keybindings.invalid-entry";
          readonly message: string;
          readonly index: number;
        }
    )[];
    readonly auth: {
      readonly bootstrapMethods: readonly ("desktop-bootstrap" | "one-time-token")[];
      readonly sessionMethods: readonly ("browser-session-cookie" | "bearer-session-token")[];
      readonly policy:
        | "desktop-managed-local"
        | "loopback-browser"
        | "remote-reachable"
        | "unsafe-no-auth";
      readonly sessionCookieName: string;
    };
    readonly availableEditors: readonly (
      | "cursor"
      | "trae"
      | "kiro"
      | "vscode"
      | "vscode-insiders"
      | "vscodium"
      | "zed"
      | "antigravity"
      | "idea"
      | "file-manager"
    )[];
    readonly providers: readonly {
      readonly provider: "codex" | "gemini" | "claudeAgent" | "opencode" | "copilotAgent";
      readonly status: "ready" | "error" | "warning" | "disabled";
      readonly version: string | null;
      readonly models: readonly {
        readonly name: string;
        readonly capabilities: {
          readonly reasoningEffortLevels: readonly {
            readonly label: string;
            readonly value: string;
            readonly isDefault?: boolean | undefined;
          }[];
          readonly contextWindowOptions: readonly {
            readonly label: string;
            readonly value: string;
            readonly isDefault?: boolean | undefined;
          }[];
          readonly promptInjectedEffortLevels: readonly string[];
          readonly supportsFastMode: boolean;
          readonly supportsThinkingToggle: boolean;
        } | null;
        readonly slug: string;
        readonly isCustom: boolean;
      }[];
      readonly slashCommands: readonly {
        readonly name: string;
        readonly description?: string | undefined;
        readonly input?:
          | {
              readonly hint: string;
            }
          | undefined;
      }[];
      readonly enabled: boolean;
      readonly skills: readonly {
        readonly name: string;
        readonly path: string;
        readonly enabled: boolean;
        readonly displayName?: string | undefined;
        readonly description?: string | undefined;
        readonly scope?: string | undefined;
        readonly shortDescription?: string | undefined;
      }[];
      readonly installed: boolean;
      readonly auth: {
        readonly status: "unknown" | "authenticated" | "unauthenticated";
        readonly type?: string | undefined;
        readonly label?: string | undefined;
      };
      readonly checkedAt: string;
      readonly message?: string | undefined;
      readonly dynamicModels?:
        | readonly {
            readonly id: string;
            readonly name: string;
          }[]
        | undefined;
    }[];
    readonly observability: {
      readonly logsDirectoryPath: string;
      readonly localTracingEnabled: boolean;
      readonly otlpTracesEnabled: boolean;
      readonly otlpMetricsEnabled: boolean;
      readonly otlpTracesUrl?: string | undefined;
      readonly otlpMetricsUrl?: string | undefined;
    };
    readonly environment: {
      readonly environmentId: string & import("effect/Brand").Brand<"EnvironmentId">;
      readonly label: string;
      readonly platform: {
        readonly os: "darwin" | "linux" | "windows" | "unknown";
        readonly arch: "arm64" | "x64" | "other";
      };
      readonly serverVersion: string;
      readonly capabilities: {
        readonly repositoryIdentity: boolean;
      };
    };
    readonly cwd: string;
    readonly keybindingsConfigPath: string;
    readonly settings: {
      readonly enableAssistantStreaming: boolean;
      readonly defaultThreadEnvMode: "local" | "worktree";
      readonly textGenerationModelSelection:
        | {
            readonly provider: "codex";
            readonly model: string;
            readonly options?: {
              readonly reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
              readonly fastMode?: boolean | undefined;
            };
          }
        | {
            readonly provider: "gemini";
            readonly model: string;
            readonly options?: {
              readonly thinkingBudget?: number | undefined;
            };
          }
        | {
            readonly provider: "claudeAgent";
            readonly model: string;
            readonly options?: {
              readonly fastMode?: boolean | undefined;
              readonly thinking?: boolean | undefined;
              readonly effort?: "high" | "medium" | "low" | "max" | "ultrathink" | undefined;
              readonly contextWindow?: string | undefined;
            };
          }
        | {
            readonly provider: "opencode";
            readonly model: string;
            readonly options?: {
              readonly reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
            };
          }
        | {
            readonly provider: "copilotAgent";
            readonly model: string;
            readonly options?: {
              readonly reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
            };
          };
      readonly providers: {
        readonly codex: {
          readonly binaryPath: string;
          readonly homePath: string;
          readonly enabled: boolean;
          readonly customModels: readonly string[];
        };
        readonly gemini: {
          readonly binaryPath: string;
          readonly homePath: string;
          readonly enabled: boolean;
          readonly customModels: readonly string[];
        };
        readonly claudeAgent: {
          readonly binaryPath: string;
          readonly enabled: boolean;
          readonly customModels: readonly string[];
        };
        readonly opencode: {
          readonly binaryPath: string;
          readonly apiKey: string;
          readonly enabled: boolean;
          readonly customModels: readonly string[];
        };
        readonly copilotAgent: {
          readonly binaryPath: string;
          readonly enabled: boolean;
          readonly customModels: readonly string[];
        };
      };
      readonly observability: {
        readonly otlpTracesUrl: string;
        readonly otlpMetricsUrl: string;
      };
    };
  } | null
>;
export declare const serverConfigUpdatedAtom: Atom.Writable<
  ServerConfigUpdatedNotification | null,
  ServerConfigUpdatedNotification | null
>;
export declare const providersUpdatedAtom: Atom.Writable<
  {
    readonly providers: readonly {
      readonly provider: "codex" | "gemini" | "claudeAgent" | "opencode" | "copilotAgent";
      readonly status: "ready" | "error" | "warning" | "disabled";
      readonly version: string | null;
      readonly models: readonly {
        readonly name: string;
        readonly capabilities: {
          readonly reasoningEffortLevels: readonly {
            readonly label: string;
            readonly value: string;
            readonly isDefault?: boolean | undefined;
          }[];
          readonly contextWindowOptions: readonly {
            readonly label: string;
            readonly value: string;
            readonly isDefault?: boolean | undefined;
          }[];
          readonly promptInjectedEffortLevels: readonly string[];
          readonly supportsFastMode: boolean;
          readonly supportsThinkingToggle: boolean;
        } | null;
        readonly slug: string;
        readonly isCustom: boolean;
      }[];
      readonly slashCommands: readonly {
        readonly name: string;
        readonly description?: string | undefined;
        readonly input?:
          | {
              readonly hint: string;
            }
          | undefined;
      }[];
      readonly enabled: boolean;
      readonly skills: readonly {
        readonly name: string;
        readonly path: string;
        readonly enabled: boolean;
        readonly displayName?: string | undefined;
        readonly description?: string | undefined;
        readonly scope?: string | undefined;
        readonly shortDescription?: string | undefined;
      }[];
      readonly installed: boolean;
      readonly auth: {
        readonly status: "unknown" | "authenticated" | "unauthenticated";
        readonly type?: string | undefined;
        readonly label?: string | undefined;
      };
      readonly checkedAt: string;
      readonly message?: string | undefined;
      readonly dynamicModels?:
        | readonly {
            readonly id: string;
            readonly name: string;
          }[]
        | undefined;
    }[];
  } | null,
  {
    readonly providers: readonly {
      readonly provider: "codex" | "gemini" | "claudeAgent" | "opencode" | "copilotAgent";
      readonly status: "ready" | "error" | "warning" | "disabled";
      readonly version: string | null;
      readonly models: readonly {
        readonly name: string;
        readonly capabilities: {
          readonly reasoningEffortLevels: readonly {
            readonly label: string;
            readonly value: string;
            readonly isDefault?: boolean | undefined;
          }[];
          readonly contextWindowOptions: readonly {
            readonly label: string;
            readonly value: string;
            readonly isDefault?: boolean | undefined;
          }[];
          readonly promptInjectedEffortLevels: readonly string[];
          readonly supportsFastMode: boolean;
          readonly supportsThinkingToggle: boolean;
        } | null;
        readonly slug: string;
        readonly isCustom: boolean;
      }[];
      readonly slashCommands: readonly {
        readonly name: string;
        readonly description?: string | undefined;
        readonly input?:
          | {
              readonly hint: string;
            }
          | undefined;
      }[];
      readonly enabled: boolean;
      readonly skills: readonly {
        readonly name: string;
        readonly path: string;
        readonly enabled: boolean;
        readonly displayName?: string | undefined;
        readonly description?: string | undefined;
        readonly scope?: string | undefined;
        readonly shortDescription?: string | undefined;
      }[];
      readonly installed: boolean;
      readonly auth: {
        readonly status: "unknown" | "authenticated" | "unauthenticated";
        readonly type?: string | undefined;
        readonly label?: string | undefined;
      };
      readonly checkedAt: string;
      readonly message?: string | undefined;
      readonly dynamicModels?:
        | readonly {
            readonly id: string;
            readonly name: string;
          }[]
        | undefined;
    }[];
  } | null
>;
export declare function getServerConfig(): ServerConfig | null;
export declare function getServerConfigUpdatedNotification(): ServerConfigUpdatedNotification | null;
export declare function setServerConfigSnapshot(config: ServerConfig): void;
export declare function applyServerConfigEvent(event: ServerConfigStreamEvent): void;
export declare function applyProvidersUpdated(payload: ServerProviderUpdatedPayload): void;
export declare function applySettingsUpdated(settings: ServerSettings): void;
export declare function emitWelcome(payload: ServerLifecycleWelcomePayload): void;
export declare function onWelcome(
  listener: (payload: ServerLifecycleWelcomePayload) => void,
): () => void;
export declare function onServerConfigUpdated(
  listener: (payload: ServerConfigUpdatedPayload, source: ServerConfigUpdateSource) => void,
): () => void;
export declare function onProvidersUpdated(
  listener: (payload: ServerProviderUpdatedPayload) => void,
): () => void;
export declare function startServerStateSync(client: ServerStateClient): () => void;
export declare function resetServerStateForTests(): void;
export declare function useServerConfig(): ServerConfig | null;
export declare function useServerSettings(): ServerSettings;
export declare function useServerProviders(): ReadonlyArray<ServerProvider>;
export declare function useServerKeybindings(): ServerConfig["keybindings"];
export declare function useServerAvailableEditors(): ReadonlyArray<EditorId>;
export declare function useServerKeybindingsConfigPath(): string | null;
export declare function useServerObservability(): ServerConfig["observability"] | null;
export declare function useServerWelcomeSubscription(
  listener: (payload: ServerLifecycleWelcomePayload) => void,
): void;
export declare function useServerConfigUpdatedSubscription(
  listener: (notification: ServerConfigUpdatedNotification) => void,
): void;
export {};
