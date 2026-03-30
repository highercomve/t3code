export declare const serverQueryKeys: {
  all: readonly ["server"];
  config: () => readonly ["server", "config"];
};
/**
 * Server config query options.
 *
 * `staleTime` is kept short so that push-driven `invalidateQueries` calls in
 * the EventRouter always trigger a refetch, and so the query re-fetches when
 * the component re-mounts (e.g. navigating away from settings and back).
 */
export declare function serverConfigQueryOptions(): import("@tanstack/react-query").OmitKeyof<
  import("@tanstack/react-query").UseQueryOptions<
    {
      readonly availableEditors: readonly (
        | "cursor"
        | "vscode"
        | "vscode-insiders"
        | "vscodium"
        | "zed"
        | "antigravity"
        | "file-manager"
      )[];
      readonly providers: readonly {
        readonly version: string | null;
        readonly models: readonly {
          readonly slug: string;
          readonly name: string;
          readonly capabilities: {
            readonly reasoningEffortLevels: readonly {
              readonly value: string;
              readonly label: string;
              readonly isDefault?: boolean | undefined;
            }[];
            readonly contextWindowOptions: readonly {
              readonly value: string;
              readonly label: string;
              readonly isDefault?: boolean | undefined;
            }[];
            readonly promptInjectedEffortLevels: readonly string[];
            readonly supportsFastMode: boolean;
            readonly supportsThinkingToggle: boolean;
          } | null;
          readonly isCustom: boolean;
        }[];
        readonly provider: "codex" | "gemini" | "claudeAgent" | "opencode";
        readonly enabled: boolean;
        readonly installed: boolean;
        readonly status: "ready" | "warning" | "error" | "disabled";
        readonly authStatus: "authenticated" | "unauthenticated" | "unknown";
        readonly checkedAt: string;
        readonly message?: string | undefined;
        readonly dynamicModels?:
          | readonly {
              readonly id: string;
              readonly name: string;
            }[]
          | undefined;
      }[];
      readonly cwd: string;
      readonly keybindingsConfigPath: string;
      readonly keybindings: readonly {
        readonly command:
          | "terminal.toggle"
          | "terminal.split"
          | "terminal.new"
          | "terminal.close"
          | "diff.toggle"
          | "chat.new"
          | "chat.newLocal"
          | "editor.openFavorite"
          | `script.${string}.run`;
        readonly shortcut: {
          readonly key: string;
          readonly metaKey: boolean;
          readonly ctrlKey: boolean;
          readonly shiftKey: boolean;
          readonly altKey: boolean;
          readonly modKey: boolean;
        };
        readonly whenAst?: import("@t3tools/contracts").KeybindingWhenNode | undefined;
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
            };
        readonly providers: {
          readonly codex: {
            readonly enabled: boolean;
            readonly homePath: string;
            readonly customModels: readonly string[];
            readonly binaryPath: string;
          };
          readonly gemini: {
            readonly enabled: boolean;
            readonly homePath: string;
            readonly customModels: readonly string[];
            readonly binaryPath: string;
          };
          readonly claudeAgent: {
            readonly enabled: boolean;
            readonly customModels: readonly string[];
            readonly binaryPath: string;
          };
          readonly opencode: {
            readonly enabled: boolean;
            readonly customModels: readonly string[];
            readonly binaryPath: string;
            readonly apiKey: string;
          };
        };
      };
    },
    Error,
    {
      readonly availableEditors: readonly (
        | "cursor"
        | "vscode"
        | "vscode-insiders"
        | "vscodium"
        | "zed"
        | "antigravity"
        | "file-manager"
      )[];
      readonly providers: readonly {
        readonly version: string | null;
        readonly models: readonly {
          readonly slug: string;
          readonly name: string;
          readonly capabilities: {
            readonly reasoningEffortLevels: readonly {
              readonly value: string;
              readonly label: string;
              readonly isDefault?: boolean | undefined;
            }[];
            readonly contextWindowOptions: readonly {
              readonly value: string;
              readonly label: string;
              readonly isDefault?: boolean | undefined;
            }[];
            readonly promptInjectedEffortLevels: readonly string[];
            readonly supportsFastMode: boolean;
            readonly supportsThinkingToggle: boolean;
          } | null;
          readonly isCustom: boolean;
        }[];
        readonly provider: "codex" | "gemini" | "claudeAgent" | "opencode";
        readonly enabled: boolean;
        readonly installed: boolean;
        readonly status: "ready" | "warning" | "error" | "disabled";
        readonly authStatus: "authenticated" | "unauthenticated" | "unknown";
        readonly checkedAt: string;
        readonly message?: string | undefined;
        readonly dynamicModels?:
          | readonly {
              readonly id: string;
              readonly name: string;
            }[]
          | undefined;
      }[];
      readonly cwd: string;
      readonly keybindingsConfigPath: string;
      readonly keybindings: readonly {
        readonly command:
          | "terminal.toggle"
          | "terminal.split"
          | "terminal.new"
          | "terminal.close"
          | "diff.toggle"
          | "chat.new"
          | "chat.newLocal"
          | "editor.openFavorite"
          | `script.${string}.run`;
        readonly shortcut: {
          readonly key: string;
          readonly metaKey: boolean;
          readonly ctrlKey: boolean;
          readonly shiftKey: boolean;
          readonly altKey: boolean;
          readonly modKey: boolean;
        };
        readonly whenAst?: import("@t3tools/contracts").KeybindingWhenNode | undefined;
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
            };
        readonly providers: {
          readonly codex: {
            readonly enabled: boolean;
            readonly homePath: string;
            readonly customModels: readonly string[];
            readonly binaryPath: string;
          };
          readonly gemini: {
            readonly enabled: boolean;
            readonly homePath: string;
            readonly customModels: readonly string[];
            readonly binaryPath: string;
          };
          readonly claudeAgent: {
            readonly enabled: boolean;
            readonly customModels: readonly string[];
            readonly binaryPath: string;
          };
          readonly opencode: {
            readonly enabled: boolean;
            readonly customModels: readonly string[];
            readonly binaryPath: string;
            readonly apiKey: string;
          };
        };
      };
    },
    readonly ["server", "config"]
  >,
  "queryFn"
> & {
  queryFn?: import("@tanstack/react-query").QueryFunction<
    {
      readonly availableEditors: readonly (
        | "cursor"
        | "vscode"
        | "vscode-insiders"
        | "vscodium"
        | "zed"
        | "antigravity"
        | "file-manager"
      )[];
      readonly providers: readonly {
        readonly version: string | null;
        readonly models: readonly {
          readonly slug: string;
          readonly name: string;
          readonly capabilities: {
            readonly reasoningEffortLevels: readonly {
              readonly value: string;
              readonly label: string;
              readonly isDefault?: boolean | undefined;
            }[];
            readonly contextWindowOptions: readonly {
              readonly value: string;
              readonly label: string;
              readonly isDefault?: boolean | undefined;
            }[];
            readonly promptInjectedEffortLevels: readonly string[];
            readonly supportsFastMode: boolean;
            readonly supportsThinkingToggle: boolean;
          } | null;
          readonly isCustom: boolean;
        }[];
        readonly provider: "codex" | "gemini" | "claudeAgent" | "opencode";
        readonly enabled: boolean;
        readonly installed: boolean;
        readonly status: "ready" | "warning" | "error" | "disabled";
        readonly authStatus: "authenticated" | "unauthenticated" | "unknown";
        readonly checkedAt: string;
        readonly message?: string | undefined;
        readonly dynamicModels?:
          | readonly {
              readonly id: string;
              readonly name: string;
            }[]
          | undefined;
      }[];
      readonly cwd: string;
      readonly keybindingsConfigPath: string;
      readonly keybindings: readonly {
        readonly command:
          | "terminal.toggle"
          | "terminal.split"
          | "terminal.new"
          | "terminal.close"
          | "diff.toggle"
          | "chat.new"
          | "chat.newLocal"
          | "editor.openFavorite"
          | `script.${string}.run`;
        readonly shortcut: {
          readonly key: string;
          readonly metaKey: boolean;
          readonly ctrlKey: boolean;
          readonly shiftKey: boolean;
          readonly altKey: boolean;
          readonly modKey: boolean;
        };
        readonly whenAst?: import("@t3tools/contracts").KeybindingWhenNode | undefined;
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
            };
        readonly providers: {
          readonly codex: {
            readonly enabled: boolean;
            readonly homePath: string;
            readonly customModels: readonly string[];
            readonly binaryPath: string;
          };
          readonly gemini: {
            readonly enabled: boolean;
            readonly homePath: string;
            readonly customModels: readonly string[];
            readonly binaryPath: string;
          };
          readonly claudeAgent: {
            readonly enabled: boolean;
            readonly customModels: readonly string[];
            readonly binaryPath: string;
          };
          readonly opencode: {
            readonly enabled: boolean;
            readonly customModels: readonly string[];
            readonly binaryPath: string;
            readonly apiKey: string;
          };
        };
      };
    },
    readonly ["server", "config"],
    never
  >;
} & {
  queryKey: readonly ["server", "config"] & {
    [dataTagSymbol]: {
      readonly availableEditors: readonly (
        | "cursor"
        | "vscode"
        | "vscode-insiders"
        | "vscodium"
        | "zed"
        | "antigravity"
        | "file-manager"
      )[];
      readonly providers: readonly {
        readonly version: string | null;
        readonly models: readonly {
          readonly slug: string;
          readonly name: string;
          readonly capabilities: {
            readonly reasoningEffortLevels: readonly {
              readonly value: string;
              readonly label: string;
              readonly isDefault?: boolean | undefined;
            }[];
            readonly contextWindowOptions: readonly {
              readonly value: string;
              readonly label: string;
              readonly isDefault?: boolean | undefined;
            }[];
            readonly promptInjectedEffortLevels: readonly string[];
            readonly supportsFastMode: boolean;
            readonly supportsThinkingToggle: boolean;
          } | null;
          readonly isCustom: boolean;
        }[];
        readonly provider: "codex" | "gemini" | "claudeAgent" | "opencode";
        readonly enabled: boolean;
        readonly installed: boolean;
        readonly status: "ready" | "warning" | "error" | "disabled";
        readonly authStatus: "authenticated" | "unauthenticated" | "unknown";
        readonly checkedAt: string;
        readonly message?: string | undefined;
        readonly dynamicModels?:
          | readonly {
              readonly id: string;
              readonly name: string;
            }[]
          | undefined;
      }[];
      readonly cwd: string;
      readonly keybindingsConfigPath: string;
      readonly keybindings: readonly {
        readonly command:
          | "terminal.toggle"
          | "terminal.split"
          | "terminal.new"
          | "terminal.close"
          | "diff.toggle"
          | "chat.new"
          | "chat.newLocal"
          | "editor.openFavorite"
          | `script.${string}.run`;
        readonly shortcut: {
          readonly key: string;
          readonly metaKey: boolean;
          readonly ctrlKey: boolean;
          readonly shiftKey: boolean;
          readonly altKey: boolean;
          readonly modKey: boolean;
        };
        readonly whenAst?: import("@t3tools/contracts").KeybindingWhenNode | undefined;
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
            };
        readonly providers: {
          readonly codex: {
            readonly enabled: boolean;
            readonly homePath: string;
            readonly customModels: readonly string[];
            readonly binaryPath: string;
          };
          readonly gemini: {
            readonly enabled: boolean;
            readonly homePath: string;
            readonly customModels: readonly string[];
            readonly binaryPath: string;
          };
          readonly claudeAgent: {
            readonly enabled: boolean;
            readonly customModels: readonly string[];
            readonly binaryPath: string;
          };
          readonly opencode: {
            readonly enabled: boolean;
            readonly customModels: readonly string[];
            readonly binaryPath: string;
            readonly apiKey: string;
          };
        };
      };
    };
    [dataTagErrorSymbol]: Error;
  };
};
