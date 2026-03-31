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
      readonly cwd: string;
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
        readonly status: "disabled" | "error" | "ready" | "warning";
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
        readonly provider: "codex" | "gemini" | "claudeAgent" | "opencode";
        readonly enabled: boolean;
        readonly installed: boolean;
        readonly auth: {
          readonly status: "authenticated" | "unauthenticated" | "unknown";
          readonly type?: string | undefined;
          readonly label?: string | undefined;
        };
        readonly checkedAt: string;
        readonly message?: string | undefined;
        readonly dynamicModels?:
          | readonly {
              readonly name: string;
              readonly id: string;
            }[]
          | undefined;
      }[];
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
        readonly whenAst?: import("@t3tools/contracts").KeybindingWhenNode | undefined;
      }[];
      readonly issues: readonly (
        | {
            readonly message: string;
            readonly kind: "keybindings.malformed-config";
          }
        | {
            readonly message: string;
            readonly kind: "keybindings.invalid-entry";
            readonly index: number;
          }
      )[];
      readonly settings: {
        readonly enableAssistantStreaming: boolean;
        readonly defaultThreadEnvMode: "worktree" | "local";
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
      readonly cwd: string;
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
        readonly status: "disabled" | "error" | "ready" | "warning";
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
        readonly provider: "codex" | "gemini" | "claudeAgent" | "opencode";
        readonly enabled: boolean;
        readonly installed: boolean;
        readonly auth: {
          readonly status: "authenticated" | "unauthenticated" | "unknown";
          readonly type?: string | undefined;
          readonly label?: string | undefined;
        };
        readonly checkedAt: string;
        readonly message?: string | undefined;
        readonly dynamicModels?:
          | readonly {
              readonly name: string;
              readonly id: string;
            }[]
          | undefined;
      }[];
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
        readonly whenAst?: import("@t3tools/contracts").KeybindingWhenNode | undefined;
      }[];
      readonly issues: readonly (
        | {
            readonly message: string;
            readonly kind: "keybindings.malformed-config";
          }
        | {
            readonly message: string;
            readonly kind: "keybindings.invalid-entry";
            readonly index: number;
          }
      )[];
      readonly settings: {
        readonly enableAssistantStreaming: boolean;
        readonly defaultThreadEnvMode: "worktree" | "local";
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
      readonly cwd: string;
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
        readonly status: "disabled" | "error" | "ready" | "warning";
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
        readonly provider: "codex" | "gemini" | "claudeAgent" | "opencode";
        readonly enabled: boolean;
        readonly installed: boolean;
        readonly auth: {
          readonly status: "authenticated" | "unauthenticated" | "unknown";
          readonly type?: string | undefined;
          readonly label?: string | undefined;
        };
        readonly checkedAt: string;
        readonly message?: string | undefined;
        readonly dynamicModels?:
          | readonly {
              readonly name: string;
              readonly id: string;
            }[]
          | undefined;
      }[];
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
        readonly whenAst?: import("@t3tools/contracts").KeybindingWhenNode | undefined;
      }[];
      readonly issues: readonly (
        | {
            readonly message: string;
            readonly kind: "keybindings.malformed-config";
          }
        | {
            readonly message: string;
            readonly kind: "keybindings.invalid-entry";
            readonly index: number;
          }
      )[];
      readonly settings: {
        readonly enableAssistantStreaming: boolean;
        readonly defaultThreadEnvMode: "worktree" | "local";
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
      readonly cwd: string;
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
        readonly status: "disabled" | "error" | "ready" | "warning";
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
        readonly provider: "codex" | "gemini" | "claudeAgent" | "opencode";
        readonly enabled: boolean;
        readonly installed: boolean;
        readonly auth: {
          readonly status: "authenticated" | "unauthenticated" | "unknown";
          readonly type?: string | undefined;
          readonly label?: string | undefined;
        };
        readonly checkedAt: string;
        readonly message?: string | undefined;
        readonly dynamicModels?:
          | readonly {
              readonly name: string;
              readonly id: string;
            }[]
          | undefined;
      }[];
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
        readonly whenAst?: import("@t3tools/contracts").KeybindingWhenNode | undefined;
      }[];
      readonly issues: readonly (
        | {
            readonly message: string;
            readonly kind: "keybindings.malformed-config";
          }
        | {
            readonly message: string;
            readonly kind: "keybindings.invalid-entry";
            readonly index: number;
          }
      )[];
      readonly settings: {
        readonly enableAssistantStreaming: boolean;
        readonly defaultThreadEnvMode: "worktree" | "local";
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
