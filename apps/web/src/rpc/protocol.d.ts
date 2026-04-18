import { Effect, Layer } from "effect";
import { RpcClient } from "effect/unstable/rpc";
export interface WsProtocolLifecycleHandlers {
  readonly onAttempt?: (socketUrl: string) => void;
  readonly onOpen?: () => void;
  readonly onError?: (message: string) => void;
  readonly onClose?: (details: { readonly code: number; readonly reason: string }) => void;
}
export declare const makeWsRpcProtocolClient: Effect.Effect<
  {
    readonly "server.upsertKeybinding": <
      const AsQueue extends boolean = false,
      const Discard = false,
    >(
      input: {
        readonly key: string;
        readonly command:
          | "terminal.toggle"
          | "terminal.split"
          | "terminal.new"
          | "terminal.close"
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
        readonly when?: string | undefined;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly keybindings: readonly {
              readonly command:
                | "terminal.toggle"
                | "terminal.split"
                | "terminal.new"
                | "terminal.close"
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
                    readonly name: string;
                    readonly type: "identifier";
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
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true ? never : import("@t3tools/contracts").KeybindingsConfigError),
      never
    >;
    readonly "server.getConfig": <const AsQueue extends boolean = false, const Discard = false>(
      input: {},
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly auth: {
              readonly bootstrapMethods: readonly ("desktop-bootstrap" | "one-time-token")[];
              readonly sessionMethods: readonly (
                | "browser-session-cookie"
                | "bearer-session-token"
              )[];
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
              readonly status: "ready" | "warning" | "error" | "disabled";
              readonly enabled: boolean;
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
              readonly slashCommands: readonly {
                readonly name: string;
                readonly description?: string | undefined;
                readonly input?:
                  | {
                      readonly hint: string;
                    }
                  | undefined;
              }[];
              readonly skills: readonly {
                readonly name: string;
                readonly path: string;
                readonly enabled: boolean;
                readonly description?: string | undefined;
                readonly scope?: string | undefined;
                readonly displayName?: string | undefined;
                readonly shortDescription?: string | undefined;
              }[];
              readonly provider: "codex" | "gemini" | "claudeAgent" | "opencode" | "copilotAgent";
              readonly installed: boolean;
              readonly auth: {
                readonly status: "authenticated" | "unauthenticated" | "unknown";
                readonly label?: string | undefined;
                readonly type?: string | undefined;
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
              readonly label: string;
              readonly capabilities: {
                readonly repositoryIdentity: boolean;
              };
              readonly environmentId: string & import("effect/Brand").Brand<"EnvironmentId">;
              readonly platform: {
                readonly os: "unknown" | "darwin" | "linux" | "windows";
                readonly arch: "arm64" | "x64" | "other";
              };
              readonly serverVersion: string;
            };
            readonly cwd: string;
            readonly keybindingsConfigPath: string;
            readonly keybindings: readonly {
              readonly command:
                | "terminal.toggle"
                | "terminal.split"
                | "terminal.new"
                | "terminal.close"
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
                    readonly name: string;
                    readonly type: "identifier";
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
            readonly settings: {
              readonly enableAssistantStreaming: boolean;
              readonly defaultThreadEnvMode: "local" | "worktree";
              readonly addProjectBaseDirectory: string;
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
                      readonly reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
                      readonly thinkingBudget?: number | undefined;
                    };
                  }
                | {
                    readonly provider: "claudeAgent";
                    readonly model: string;
                    readonly options?: {
                      readonly fastMode?: boolean | undefined;
                      readonly thinking?: boolean | undefined;
                      readonly effort?:
                        | "xhigh"
                        | "high"
                        | "medium"
                        | "low"
                        | "max"
                        | "ultrathink"
                        | undefined;
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
                  readonly launchArgs: string;
                };
                readonly opencode: {
                  readonly enabled: boolean;
                  readonly customModels: readonly string[];
                  readonly binaryPath: string;
                  readonly apiKey: string;
                };
                readonly copilotAgent: {
                  readonly enabled: boolean;
                  readonly customModels: readonly string[];
                  readonly binaryPath: string;
                };
              };
              readonly observability: {
                readonly otlpTracesUrl: string;
                readonly otlpMetricsUrl: string;
              };
            };
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true
          ? never
          :
              | import("@t3tools/contracts").ServerSettingsError
              | import("@t3tools/contracts").KeybindingsConfigError),
      never
    >;
    readonly "server.refreshProviders": <
      const AsQueue extends boolean = false,
      const Discard = false,
    >(
      input: {},
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly providers: readonly {
              readonly status: "ready" | "warning" | "error" | "disabled";
              readonly enabled: boolean;
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
              readonly slashCommands: readonly {
                readonly name: string;
                readonly description?: string | undefined;
                readonly input?:
                  | {
                      readonly hint: string;
                    }
                  | undefined;
              }[];
              readonly skills: readonly {
                readonly name: string;
                readonly path: string;
                readonly enabled: boolean;
                readonly description?: string | undefined;
                readonly scope?: string | undefined;
                readonly displayName?: string | undefined;
                readonly shortDescription?: string | undefined;
              }[];
              readonly provider: "codex" | "gemini" | "claudeAgent" | "opencode" | "copilotAgent";
              readonly installed: boolean;
              readonly auth: {
                readonly status: "authenticated" | "unauthenticated" | "unknown";
                readonly label?: string | undefined;
                readonly type?: string | undefined;
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
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true ? never : never),
      never
    >;
    readonly "server.getSettings": <const AsQueue extends boolean = false, const Discard = false>(
      input: {},
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly enableAssistantStreaming: boolean;
            readonly defaultThreadEnvMode: "local" | "worktree";
            readonly addProjectBaseDirectory: string;
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
                    readonly reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
                    readonly thinkingBudget?: number | undefined;
                  };
                }
              | {
                  readonly provider: "claudeAgent";
                  readonly model: string;
                  readonly options?: {
                    readonly fastMode?: boolean | undefined;
                    readonly thinking?: boolean | undefined;
                    readonly effort?:
                      | "xhigh"
                      | "high"
                      | "medium"
                      | "low"
                      | "max"
                      | "ultrathink"
                      | undefined;
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
                readonly launchArgs: string;
              };
              readonly opencode: {
                readonly enabled: boolean;
                readonly customModels: readonly string[];
                readonly binaryPath: string;
                readonly apiKey: string;
              };
              readonly copilotAgent: {
                readonly enabled: boolean;
                readonly customModels: readonly string[];
                readonly binaryPath: string;
              };
            };
            readonly observability: {
              readonly otlpTracesUrl: string;
              readonly otlpMetricsUrl: string;
            };
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true ? never : import("@t3tools/contracts").ServerSettingsError),
      never
    >;
    readonly "server.updateSettings": <
      const AsQueue extends boolean = false,
      const Discard = false,
    >(
      input: {
        readonly patch: {
          readonly enableAssistantStreaming?: boolean;
          readonly defaultThreadEnvMode?: "local" | "worktree";
          readonly addProjectBaseDirectory?: string;
          readonly textGenerationModelSelection?:
            | {
                readonly provider?: "codex";
                readonly model?: string;
                readonly options?: {
                  readonly reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
                  readonly fastMode?: boolean | undefined;
                };
              }
            | {
                readonly provider?: "gemini";
                readonly model?: string;
                readonly options?: {
                  readonly thinkingBudget?: number | undefined;
                };
              }
            | {
                readonly provider?: "claudeAgent";
                readonly model?: string;
                readonly options?: {
                  readonly thinking?: boolean | undefined;
                  readonly effort?:
                    | "xhigh"
                    | "high"
                    | "medium"
                    | "low"
                    | "max"
                    | "ultrathink"
                    | undefined;
                  readonly fastMode?: boolean | undefined;
                  readonly contextWindow?: string | undefined;
                };
              }
            | {
                readonly provider?: "opencode";
                readonly model?: string;
                readonly options?: {
                  readonly reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
                };
              }
            | {
                readonly provider?: "copilotAgent";
                readonly model?: string;
                readonly options?: {
                  readonly reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
                };
              };
          readonly observability?: {
            readonly otlpTracesUrl?: string;
            readonly otlpMetricsUrl?: string;
          };
          readonly providers?: {
            readonly codex?: {
              readonly enabled?: boolean;
              readonly binaryPath?: string;
              readonly homePath?: string;
              readonly customModels?: readonly string[];
            };
            readonly gemini?: {
              readonly enabled?: boolean;
              readonly binaryPath?: string;
              readonly homePath?: string;
              readonly customModels?: readonly string[];
            };
            readonly claudeAgent?: {
              readonly enabled?: boolean;
              readonly binaryPath?: string;
              readonly customModels?: readonly string[];
              readonly launchArgs?: string;
            };
            readonly opencode?: {
              readonly enabled?: boolean;
              readonly binaryPath?: string;
              readonly apiKey?: string;
              readonly customModels?: readonly string[];
            };
            readonly copilotAgent?: {
              readonly enabled?: boolean;
              readonly binaryPath?: string;
              readonly customModels?: readonly string[];
            };
          };
        };
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly enableAssistantStreaming: boolean;
            readonly defaultThreadEnvMode: "local" | "worktree";
            readonly addProjectBaseDirectory: string;
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
                    readonly reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
                    readonly thinkingBudget?: number | undefined;
                  };
                }
              | {
                  readonly provider: "claudeAgent";
                  readonly model: string;
                  readonly options?: {
                    readonly fastMode?: boolean | undefined;
                    readonly thinking?: boolean | undefined;
                    readonly effort?:
                      | "xhigh"
                      | "high"
                      | "medium"
                      | "low"
                      | "max"
                      | "ultrathink"
                      | undefined;
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
                readonly launchArgs: string;
              };
              readonly opencode: {
                readonly enabled: boolean;
                readonly customModels: readonly string[];
                readonly binaryPath: string;
                readonly apiKey: string;
              };
              readonly copilotAgent: {
                readonly enabled: boolean;
                readonly customModels: readonly string[];
                readonly binaryPath: string;
              };
            };
            readonly observability: {
              readonly otlpTracesUrl: string;
              readonly otlpMetricsUrl: string;
            };
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true ? never : import("@t3tools/contracts").ServerSettingsError),
      never
    >;
    readonly "projects.searchEntries": <
      const AsQueue extends boolean = false,
      const Discard = false,
    >(
      input: {
        readonly cwd: string;
        readonly query: string;
        readonly limit: number;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly entries: readonly {
              readonly kind: "file" | "directory";
              readonly path: string;
              readonly parentPath?: string | undefined;
            }[];
            readonly truncated: boolean;
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true ? never : import("@t3tools/contracts").ProjectSearchEntriesError),
      never
    >;
    readonly "projects.writeFile": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly cwd: string;
        readonly relativePath: string;
        readonly contents: string;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly relativePath: string;
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true ? never : import("@t3tools/contracts").ProjectWriteFileError),
      never
    >;
    readonly "shell.openInEditor": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly cwd: string;
        readonly editor:
          | "cursor"
          | "trae"
          | "kiro"
          | "vscode"
          | "vscode-insiders"
          | "vscodium"
          | "zed"
          | "antigravity"
          | "idea"
          | "file-manager";
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true ? void : void,
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true ? never : import("@t3tools/contracts").OpenError),
      never
    >;
    readonly "filesystem.browse": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly partialPath: string;
        readonly cwd?: string | undefined;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly entries: readonly {
              readonly name: string;
              readonly fullPath: string;
            }[];
            readonly parentPath: string;
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true ? never : import("@t3tools/contracts").FilesystemBrowseError),
      never
    >;
    readonly subscribeGitStatus: <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly cwd: string;
      },
      options?:
        | {
            readonly asQueue?: AsQueue | undefined;
            readonly streamBufferSize?: number | undefined;
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
          }
        | undefined,
    ) => AsQueue extends true
      ? Effect.Effect<
          import("effect/Queue").Dequeue<
            | {
                readonly local: {
                  readonly branch: string | null;
                  readonly isRepo: boolean;
                  readonly hasOriginRemote: boolean;
                  readonly isDefaultBranch: boolean;
                  readonly hasWorkingTreeChanges: boolean;
                  readonly workingTree: {
                    readonly deletions: number;
                    readonly files: readonly {
                      readonly path: string;
                      readonly deletions: number;
                      readonly insertions: number;
                    }[];
                    readonly insertions: number;
                  };
                  readonly hostingProvider?:
                    | {
                        readonly kind: "unknown" | "github" | "gitlab";
                        readonly name: string;
                        readonly baseUrl: string;
                      }
                    | undefined;
                };
                readonly _tag: "snapshot";
                readonly remote: {
                  readonly pr: {
                    readonly number: number;
                    readonly title: string;
                    readonly state: "open" | "closed" | "merged";
                    readonly baseBranch: string;
                    readonly url: string;
                    readonly headBranch: string;
                  } | null;
                  readonly hasUpstream: boolean;
                  readonly aheadCount: number;
                  readonly behindCount: number;
                } | null;
              }
            | {
                readonly local: {
                  readonly branch: string | null;
                  readonly isRepo: boolean;
                  readonly hasOriginRemote: boolean;
                  readonly isDefaultBranch: boolean;
                  readonly hasWorkingTreeChanges: boolean;
                  readonly workingTree: {
                    readonly deletions: number;
                    readonly files: readonly {
                      readonly path: string;
                      readonly deletions: number;
                      readonly insertions: number;
                    }[];
                    readonly insertions: number;
                  };
                  readonly hostingProvider?:
                    | {
                        readonly kind: "unknown" | "github" | "gitlab";
                        readonly name: string;
                        readonly baseUrl: string;
                      }
                    | undefined;
                };
                readonly _tag: "localUpdated";
              }
            | {
                readonly _tag: "remoteUpdated";
                readonly remote: {
                  readonly pr: {
                    readonly number: number;
                    readonly title: string;
                    readonly state: "open" | "closed" | "merged";
                    readonly baseBranch: string;
                    readonly url: string;
                    readonly headBranch: string;
                  } | null;
                  readonly hasUpstream: boolean;
                  readonly aheadCount: number;
                  readonly behindCount: number;
                } | null;
              },
            | import("@t3tools/contracts").GitCommandError
            | import("@t3tools/contracts").GitHubCliError
            | import("@t3tools/contracts").TextGenerationError
            | import("@t3tools/contracts").GitManagerError
            | import("effect/unstable/rpc/RpcClientError").RpcClientError
            | import("effect/Cause").Done<void>
          >,
          never,
          import("effect/Scope").Scope
        >
      : import("effect/Stream").Stream<
          | {
              readonly local: {
                readonly branch: string | null;
                readonly isRepo: boolean;
                readonly hasOriginRemote: boolean;
                readonly isDefaultBranch: boolean;
                readonly hasWorkingTreeChanges: boolean;
                readonly workingTree: {
                  readonly deletions: number;
                  readonly files: readonly {
                    readonly path: string;
                    readonly deletions: number;
                    readonly insertions: number;
                  }[];
                  readonly insertions: number;
                };
                readonly hostingProvider?:
                  | {
                      readonly kind: "unknown" | "github" | "gitlab";
                      readonly name: string;
                      readonly baseUrl: string;
                    }
                  | undefined;
              };
              readonly _tag: "snapshot";
              readonly remote: {
                readonly pr: {
                  readonly number: number;
                  readonly title: string;
                  readonly state: "open" | "closed" | "merged";
                  readonly baseBranch: string;
                  readonly url: string;
                  readonly headBranch: string;
                } | null;
                readonly hasUpstream: boolean;
                readonly aheadCount: number;
                readonly behindCount: number;
              } | null;
            }
          | {
              readonly local: {
                readonly branch: string | null;
                readonly isRepo: boolean;
                readonly hasOriginRemote: boolean;
                readonly isDefaultBranch: boolean;
                readonly hasWorkingTreeChanges: boolean;
                readonly workingTree: {
                  readonly deletions: number;
                  readonly files: readonly {
                    readonly path: string;
                    readonly deletions: number;
                    readonly insertions: number;
                  }[];
                  readonly insertions: number;
                };
                readonly hostingProvider?:
                  | {
                      readonly kind: "unknown" | "github" | "gitlab";
                      readonly name: string;
                      readonly baseUrl: string;
                    }
                  | undefined;
              };
              readonly _tag: "localUpdated";
            }
          | {
              readonly _tag: "remoteUpdated";
              readonly remote: {
                readonly pr: {
                  readonly number: number;
                  readonly title: string;
                  readonly state: "open" | "closed" | "merged";
                  readonly baseBranch: string;
                  readonly url: string;
                  readonly headBranch: string;
                } | null;
                readonly hasUpstream: boolean;
                readonly aheadCount: number;
                readonly behindCount: number;
              } | null;
            },
          | import("@t3tools/contracts").GitCommandError
          | import("@t3tools/contracts").GitHubCliError
          | import("@t3tools/contracts").TextGenerationError
          | import("@t3tools/contracts").GitManagerError
          | import("effect/unstable/rpc/RpcClientError").RpcClientError,
          never
        >;
    readonly "git.pull": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly cwd: string;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly status: "skipped_up_to_date" | "pulled";
            readonly branch: string;
            readonly upstreamBranch: string | null;
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true ? never : import("@t3tools/contracts").GitCommandError),
      never
    >;
    readonly "git.refreshStatus": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly cwd: string;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly branch: string | null;
            readonly pr: {
              readonly number: number;
              readonly title: string;
              readonly state: "open" | "closed" | "merged";
              readonly baseBranch: string;
              readonly url: string;
              readonly headBranch: string;
            } | null;
            readonly isRepo: boolean;
            readonly hasOriginRemote: boolean;
            readonly isDefaultBranch: boolean;
            readonly hasWorkingTreeChanges: boolean;
            readonly workingTree: {
              readonly deletions: number;
              readonly files: readonly {
                readonly path: string;
                readonly deletions: number;
                readonly insertions: number;
              }[];
              readonly insertions: number;
            };
            readonly hasUpstream: boolean;
            readonly aheadCount: number;
            readonly behindCount: number;
            readonly hostingProvider?:
              | {
                  readonly kind: "unknown" | "github" | "gitlab";
                  readonly name: string;
                  readonly baseUrl: string;
                }
              | undefined;
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true
          ? never
          :
              | import("@t3tools/contracts").GitCommandError
              | import("@t3tools/contracts").GitHubCliError
              | import("@t3tools/contracts").TextGenerationError
              | import("@t3tools/contracts").GitManagerError),
      never
    >;
    readonly "git.runStackedAction": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly actionId: string;
        readonly cwd: string;
        readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
        readonly commitMessage?: string | undefined;
        readonly featureBranch?: boolean | undefined;
        readonly filePaths?: readonly string[] | undefined;
      },
      options?:
        | {
            readonly asQueue?: AsQueue | undefined;
            readonly streamBufferSize?: number | undefined;
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
          }
        | undefined,
    ) => AsQueue extends true
      ? Effect.Effect<
          import("effect/Queue").Dequeue<
            | {
                readonly kind: "action_started";
                readonly cwd: string;
                readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
                readonly actionId: string;
                readonly phases: readonly ("push" | "branch" | "commit" | "pr")[];
              }
            | {
                readonly label: string;
                readonly kind: "phase_started";
                readonly cwd: string;
                readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
                readonly actionId: string;
                readonly phase: "push" | "branch" | "commit" | "pr";
              }
            | {
                readonly kind: "hook_started";
                readonly cwd: string;
                readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
                readonly actionId: string;
                readonly hookName: string;
              }
            | {
                readonly kind: "hook_output";
                readonly cwd: string;
                readonly text: string;
                readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
                readonly actionId: string;
                readonly hookName: string | null;
                readonly stream: "stdout" | "stderr";
              }
            | {
                readonly kind: "hook_finished";
                readonly cwd: string;
                readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
                readonly actionId: string;
                readonly hookName: string;
                readonly exitCode: number | null;
                readonly durationMs: number | null;
              }
            | {
                readonly kind: "action_finished";
                readonly cwd: string;
                readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
                readonly actionId: string;
                readonly result: {
                  readonly push: {
                    readonly status: "skipped_not_requested" | "pushed" | "skipped_up_to_date";
                    readonly branch?: string | undefined;
                    readonly upstreamBranch?: string | undefined;
                    readonly setUpstream?: boolean | undefined;
                  };
                  readonly branch: {
                    readonly status: "created" | "skipped_not_requested";
                    readonly name?: string | undefined;
                  };
                  readonly commit: {
                    readonly status: "created" | "skipped_no_changes" | "skipped_not_requested";
                    readonly subject?: string | undefined;
                    readonly commitSha?: string | undefined;
                  };
                  readonly pr: {
                    readonly status: "created" | "skipped_not_requested" | "opened_existing";
                    readonly number?: number | undefined;
                    readonly title?: string | undefined;
                    readonly baseBranch?: string | undefined;
                    readonly url?: string | undefined;
                    readonly headBranch?: string | undefined;
                  };
                  readonly action:
                    | "push"
                    | "commit"
                    | "create_pr"
                    | "commit_push"
                    | "commit_push_pr";
                  readonly toast: {
                    readonly title: string;
                    readonly cta:
                      | {
                          readonly kind: "none";
                        }
                      | {
                          readonly label: string;
                          readonly kind: "open_pr";
                          readonly url: string;
                        }
                      | {
                          readonly label: string;
                          readonly kind: "run_action";
                          readonly action: {
                            readonly kind:
                              | "push"
                              | "commit"
                              | "create_pr"
                              | "commit_push"
                              | "commit_push_pr";
                          };
                        };
                    readonly description?: string | undefined;
                  };
                };
              }
            | {
                readonly kind: "action_failed";
                readonly message: string;
                readonly cwd: string;
                readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
                readonly actionId: string;
                readonly phase: "push" | "branch" | "commit" | "pr" | null;
              },
            | import("@t3tools/contracts").GitCommandError
            | import("@t3tools/contracts").GitHubCliError
            | import("@t3tools/contracts").TextGenerationError
            | import("@t3tools/contracts").GitManagerError
            | import("effect/unstable/rpc/RpcClientError").RpcClientError
            | import("effect/Cause").Done<void>
          >,
          never,
          import("effect/Scope").Scope
        >
      : import("effect/Stream").Stream<
          | {
              readonly kind: "action_started";
              readonly cwd: string;
              readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
              readonly actionId: string;
              readonly phases: readonly ("push" | "branch" | "commit" | "pr")[];
            }
          | {
              readonly label: string;
              readonly kind: "phase_started";
              readonly cwd: string;
              readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
              readonly actionId: string;
              readonly phase: "push" | "branch" | "commit" | "pr";
            }
          | {
              readonly kind: "hook_started";
              readonly cwd: string;
              readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
              readonly actionId: string;
              readonly hookName: string;
            }
          | {
              readonly kind: "hook_output";
              readonly cwd: string;
              readonly text: string;
              readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
              readonly actionId: string;
              readonly hookName: string | null;
              readonly stream: "stdout" | "stderr";
            }
          | {
              readonly kind: "hook_finished";
              readonly cwd: string;
              readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
              readonly actionId: string;
              readonly hookName: string;
              readonly exitCode: number | null;
              readonly durationMs: number | null;
            }
          | {
              readonly kind: "action_finished";
              readonly cwd: string;
              readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
              readonly actionId: string;
              readonly result: {
                readonly push: {
                  readonly status: "skipped_not_requested" | "pushed" | "skipped_up_to_date";
                  readonly branch?: string | undefined;
                  readonly upstreamBranch?: string | undefined;
                  readonly setUpstream?: boolean | undefined;
                };
                readonly branch: {
                  readonly status: "created" | "skipped_not_requested";
                  readonly name?: string | undefined;
                };
                readonly commit: {
                  readonly status: "created" | "skipped_no_changes" | "skipped_not_requested";
                  readonly subject?: string | undefined;
                  readonly commitSha?: string | undefined;
                };
                readonly pr: {
                  readonly status: "created" | "skipped_not_requested" | "opened_existing";
                  readonly number?: number | undefined;
                  readonly title?: string | undefined;
                  readonly baseBranch?: string | undefined;
                  readonly url?: string | undefined;
                  readonly headBranch?: string | undefined;
                };
                readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
                readonly toast: {
                  readonly title: string;
                  readonly cta:
                    | {
                        readonly kind: "none";
                      }
                    | {
                        readonly label: string;
                        readonly kind: "open_pr";
                        readonly url: string;
                      }
                    | {
                        readonly label: string;
                        readonly kind: "run_action";
                        readonly action: {
                          readonly kind:
                            | "push"
                            | "commit"
                            | "create_pr"
                            | "commit_push"
                            | "commit_push_pr";
                        };
                      };
                  readonly description?: string | undefined;
                };
              };
            }
          | {
              readonly kind: "action_failed";
              readonly message: string;
              readonly cwd: string;
              readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
              readonly actionId: string;
              readonly phase: "push" | "branch" | "commit" | "pr" | null;
            },
          | import("@t3tools/contracts").GitCommandError
          | import("@t3tools/contracts").GitHubCliError
          | import("@t3tools/contracts").TextGenerationError
          | import("@t3tools/contracts").GitManagerError
          | import("effect/unstable/rpc/RpcClientError").RpcClientError,
          never
        >;
    readonly "git.resolvePullRequest": <
      const AsQueue extends boolean = false,
      const Discard = false,
    >(
      input: {
        readonly cwd: string;
        readonly reference: string;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly pullRequest: {
              readonly number: number;
              readonly title: string;
              readonly state: "open" | "closed" | "merged";
              readonly baseBranch: string;
              readonly url: string;
              readonly headBranch: string;
            };
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true
          ? never
          :
              | import("@t3tools/contracts").GitCommandError
              | import("@t3tools/contracts").GitHubCliError
              | import("@t3tools/contracts").TextGenerationError
              | import("@t3tools/contracts").GitManagerError),
      never
    >;
    readonly "git.preparePullRequestThread": <
      const AsQueue extends boolean = false,
      const Discard = false,
    >(
      input: {
        readonly cwd: string;
        readonly reference: string;
        readonly mode: "local" | "worktree";
        readonly threadId?: (string & import("effect/Brand").Brand<"ThreadId">) | undefined;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly branch: string;
            readonly worktreePath: string | null;
            readonly pullRequest: {
              readonly number: number;
              readonly title: string;
              readonly state: "open" | "closed" | "merged";
              readonly baseBranch: string;
              readonly url: string;
              readonly headBranch: string;
            };
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true
          ? never
          :
              | import("@t3tools/contracts").GitCommandError
              | import("@t3tools/contracts").GitHubCliError
              | import("@t3tools/contracts").TextGenerationError
              | import("@t3tools/contracts").GitManagerError),
      never
    >;
    readonly "git.suggestCommitMessage": <
      const AsQueue extends boolean = false,
      const Discard = false,
    >(
      input: {
        readonly cwd: string;
        readonly filePaths?: readonly string[] | undefined;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly subject: string;
            readonly body: string;
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true
          ? never
          :
              | import("@t3tools/contracts").GitCommandError
              | import("@t3tools/contracts").GitHubCliError
              | import("@t3tools/contracts").TextGenerationError
              | import("@t3tools/contracts").GitManagerError),
      never
    >;
    readonly "git.listBranches": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly cwd: string;
        readonly query?: string | undefined;
        readonly cursor?: number | undefined;
        readonly limit?: number | undefined;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly isRepo: boolean;
            readonly hasOriginRemote: boolean;
            readonly branches: readonly {
              readonly isDefault: boolean;
              readonly name: string;
              readonly worktreePath: string | null;
              readonly current: boolean;
              readonly remoteName?: string | undefined;
              readonly isRemote?: boolean | undefined;
            }[];
            readonly nextCursor: number | null;
            readonly totalCount: number;
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true ? never : import("@t3tools/contracts").GitCommandError),
      never
    >;
    readonly "git.createWorktree": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly cwd: string;
        readonly branch: string;
        readonly path: string | null;
        readonly newBranch?: string | undefined;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly worktree: {
              readonly path: string;
              readonly branch: string;
            };
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true ? never : import("@t3tools/contracts").GitCommandError),
      never
    >;
    readonly "git.removeWorktree": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly cwd: string;
        readonly path: string;
        readonly force?: boolean | undefined;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true ? void : void,
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true ? never : import("@t3tools/contracts").GitCommandError),
      never
    >;
    readonly "git.createBranch": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly cwd: string;
        readonly branch: string;
        readonly checkout?: boolean | undefined;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly branch: string;
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true ? never : import("@t3tools/contracts").GitCommandError),
      never
    >;
    readonly "git.checkout": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly cwd: string;
        readonly branch: string;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly branch: string | null;
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true ? never : import("@t3tools/contracts").GitCommandError),
      never
    >;
    readonly "git.init": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly cwd: string;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true ? void : void,
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true ? never : import("@t3tools/contracts").GitCommandError),
      never
    >;
    readonly "terminal.open": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly cwd: string;
        readonly terminalId: string;
        readonly threadId: string;
        readonly worktreePath?: string | null | undefined;
        readonly cols?: number | undefined;
        readonly rows?: number | undefined;
        readonly env?:
          | {
              readonly [x: string]: string;
            }
          | undefined;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly status: "error" | "starting" | "running" | "exited";
            readonly cwd: string;
            readonly updatedAt: string;
            readonly threadId: string;
            readonly worktreePath: string | null;
            readonly exitCode: number | null;
            readonly terminalId: string;
            readonly pid: number | null;
            readonly exitSignal: number | null;
            readonly history: string;
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true
          ? never
          :
              | import("@t3tools/contracts").TerminalCwdError
              | import("@t3tools/contracts").TerminalHistoryError
              | import("@t3tools/contracts").TerminalSessionLookupError
              | import("@t3tools/contracts").TerminalNotRunningError),
      never
    >;
    readonly "terminal.write": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly data: string;
        readonly terminalId: string;
        readonly threadId: string;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true ? void : void,
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true
          ? never
          :
              | import("@t3tools/contracts").TerminalCwdError
              | import("@t3tools/contracts").TerminalHistoryError
              | import("@t3tools/contracts").TerminalSessionLookupError
              | import("@t3tools/contracts").TerminalNotRunningError),
      never
    >;
    readonly "terminal.resize": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly cols: number;
        readonly rows: number;
        readonly terminalId: string;
        readonly threadId: string;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true ? void : void,
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true
          ? never
          :
              | import("@t3tools/contracts").TerminalCwdError
              | import("@t3tools/contracts").TerminalHistoryError
              | import("@t3tools/contracts").TerminalSessionLookupError
              | import("@t3tools/contracts").TerminalNotRunningError),
      never
    >;
    readonly "terminal.clear": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly terminalId: string;
        readonly threadId: string;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true ? void : void,
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true
          ? never
          :
              | import("@t3tools/contracts").TerminalCwdError
              | import("@t3tools/contracts").TerminalHistoryError
              | import("@t3tools/contracts").TerminalSessionLookupError
              | import("@t3tools/contracts").TerminalNotRunningError),
      never
    >;
    readonly "terminal.restart": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly cwd: string;
        readonly cols: number;
        readonly rows: number;
        readonly terminalId: string;
        readonly threadId: string;
        readonly worktreePath?: string | null | undefined;
        readonly env?:
          | {
              readonly [x: string]: string;
            }
          | undefined;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly status: "error" | "starting" | "running" | "exited";
            readonly cwd: string;
            readonly updatedAt: string;
            readonly threadId: string;
            readonly worktreePath: string | null;
            readonly exitCode: number | null;
            readonly terminalId: string;
            readonly pid: number | null;
            readonly exitSignal: number | null;
            readonly history: string;
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true
          ? never
          :
              | import("@t3tools/contracts").TerminalCwdError
              | import("@t3tools/contracts").TerminalHistoryError
              | import("@t3tools/contracts").TerminalSessionLookupError
              | import("@t3tools/contracts").TerminalNotRunningError),
      never
    >;
    readonly "terminal.close": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly threadId: string;
        readonly terminalId?: string | undefined;
        readonly deleteHistory?: boolean | undefined;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true ? void : void,
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true
          ? never
          :
              | import("@t3tools/contracts").TerminalCwdError
              | import("@t3tools/contracts").TerminalHistoryError
              | import("@t3tools/contracts").TerminalSessionLookupError
              | import("@t3tools/contracts").TerminalNotRunningError),
      never
    >;
    readonly "orchestration.dispatchCommand": <
      const AsQueue extends boolean = false,
      const Discard = false,
    >(
      input:
        | {
            readonly type: "project.create";
            readonly commandId: string & import("effect/Brand").Brand<"CommandId">;
            readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
            readonly title: string;
            readonly workspaceRoot: string;
            readonly createdAt: string;
            readonly createWorkspaceRootIfMissing?: boolean | undefined;
            readonly defaultModelSelection?:
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
                    readonly reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
                  };
                }
              | {
                  readonly provider: "claudeAgent";
                  readonly model: string;
                  readonly options?: {
                    readonly thinking?: boolean | undefined;
                    readonly effort?:
                      | "xhigh"
                      | "high"
                      | "medium"
                      | "low"
                      | "max"
                      | "ultrathink"
                      | undefined;
                    readonly fastMode?: boolean | undefined;
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
                }
              | null
              | undefined;
          }
        | {
            readonly type: "project.meta.update";
            readonly commandId: string & import("effect/Brand").Brand<"CommandId">;
            readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
            readonly title?: string | undefined;
            readonly workspaceRoot?: string | undefined;
            readonly defaultModelSelection?:
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
                    readonly reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
                  };
                }
              | {
                  readonly provider: "claudeAgent";
                  readonly model: string;
                  readonly options?: {
                    readonly thinking?: boolean | undefined;
                    readonly effort?:
                      | "xhigh"
                      | "high"
                      | "medium"
                      | "low"
                      | "max"
                      | "ultrathink"
                      | undefined;
                    readonly fastMode?: boolean | undefined;
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
                }
              | null
              | undefined;
            readonly scripts?:
              | readonly {
                  readonly id: string;
                  readonly name: string;
                  readonly command: string;
                  readonly icon: "play" | "test" | "lint" | "configure" | "build" | "debug";
                  readonly runOnWorktreeCreate: boolean;
                }[]
              | undefined;
          }
        | {
            readonly type: "project.delete";
            readonly commandId: string & import("effect/Brand").Brand<"CommandId">;
            readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
          }
        | {
            readonly type: "thread.create";
            readonly commandId: string & import("effect/Brand").Brand<"CommandId">;
            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
            readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
            readonly title: string;
            readonly modelSelection:
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
                    readonly reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
                  };
                }
              | {
                  readonly provider: "claudeAgent";
                  readonly model: string;
                  readonly options?: {
                    readonly thinking?: boolean | undefined;
                    readonly effort?:
                      | "xhigh"
                      | "high"
                      | "medium"
                      | "low"
                      | "max"
                      | "ultrathink"
                      | undefined;
                    readonly fastMode?: boolean | undefined;
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
            readonly runtimeMode: "approval-required" | "auto-accept-edits" | "full-access";
            readonly interactionMode: "default" | "plan";
            readonly branch: string | null;
            readonly worktreePath: string | null;
            readonly createdAt: string;
          }
        | {
            readonly type: "thread.delete";
            readonly commandId: string & import("effect/Brand").Brand<"CommandId">;
            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
          }
        | {
            readonly type: "thread.archive";
            readonly commandId: string & import("effect/Brand").Brand<"CommandId">;
            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
          }
        | {
            readonly type: "thread.unarchive";
            readonly commandId: string & import("effect/Brand").Brand<"CommandId">;
            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
          }
        | {
            readonly type: "thread.meta.update";
            readonly commandId: string & import("effect/Brand").Brand<"CommandId">;
            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
            readonly title?: string | undefined;
            readonly modelSelection?:
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
                    readonly reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
                  };
                }
              | {
                  readonly provider: "claudeAgent";
                  readonly model: string;
                  readonly options?: {
                    readonly thinking?: boolean | undefined;
                    readonly effort?:
                      | "xhigh"
                      | "high"
                      | "medium"
                      | "low"
                      | "max"
                      | "ultrathink"
                      | undefined;
                    readonly fastMode?: boolean | undefined;
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
                }
              | undefined;
            readonly branch?: string | null | undefined;
            readonly worktreePath?: string | null | undefined;
          }
        | {
            readonly type: "thread.runtime-mode.set";
            readonly commandId: string & import("effect/Brand").Brand<"CommandId">;
            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
            readonly runtimeMode: "approval-required" | "auto-accept-edits" | "full-access";
            readonly createdAt: string;
          }
        | {
            readonly type: "thread.interaction-mode.set";
            readonly commandId: string & import("effect/Brand").Brand<"CommandId">;
            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
            readonly interactionMode: "default" | "plan";
            readonly createdAt: string;
          }
        | {
            readonly type: "thread.turn.interrupt";
            readonly commandId: string & import("effect/Brand").Brand<"CommandId">;
            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
            readonly createdAt: string;
            readonly turnId?: (string & import("effect/Brand").Brand<"TurnId">) | undefined;
          }
        | {
            readonly type: "thread.approval.respond";
            readonly commandId: string & import("effect/Brand").Brand<"CommandId">;
            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
            readonly requestId: string & import("effect/Brand").Brand<"ApprovalRequestId">;
            readonly decision: "accept" | "acceptForSession" | "decline" | "cancel";
            readonly createdAt: string;
          }
        | {
            readonly type: "thread.user-input.respond";
            readonly commandId: string & import("effect/Brand").Brand<"CommandId">;
            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
            readonly requestId: string & import("effect/Brand").Brand<"ApprovalRequestId">;
            readonly answers: {
              readonly [x: string]: unknown;
            };
            readonly createdAt: string;
          }
        | {
            readonly type: "thread.checkpoint.revert";
            readonly commandId: string & import("effect/Brand").Brand<"CommandId">;
            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
            readonly turnCount: number;
            readonly createdAt: string;
          }
        | {
            readonly type: "thread.session.stop";
            readonly commandId: string & import("effect/Brand").Brand<"CommandId">;
            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
            readonly createdAt: string;
          }
        | {
            readonly type: "thread.turn.start";
            readonly commandId: string & import("effect/Brand").Brand<"CommandId">;
            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
            readonly message: {
              readonly messageId: string & import("effect/Brand").Brand<"MessageId">;
              readonly role: "user";
              readonly text: string;
              readonly attachments: readonly {
                readonly type: "image";
                readonly name: string;
                readonly mimeType: string;
                readonly sizeBytes: number;
                readonly dataUrl: string;
              }[];
            };
            readonly runtimeMode: "approval-required" | "auto-accept-edits" | "full-access";
            readonly interactionMode: "default" | "plan";
            readonly createdAt: string;
            readonly modelSelection?:
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
                    readonly reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
                  };
                }
              | {
                  readonly provider: "claudeAgent";
                  readonly model: string;
                  readonly options?: {
                    readonly thinking?: boolean | undefined;
                    readonly effort?:
                      | "xhigh"
                      | "high"
                      | "medium"
                      | "low"
                      | "max"
                      | "ultrathink"
                      | undefined;
                    readonly fastMode?: boolean | undefined;
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
                }
              | undefined;
            readonly providerOptions?:
              | {
                  readonly codex?:
                    | {
                        readonly binaryPath?: string | undefined;
                        readonly homePath?: string | undefined;
                      }
                    | undefined;
                  readonly gemini?:
                    | {
                        readonly binaryPath?: string | undefined;
                        readonly homePath?: string | undefined;
                      }
                    | undefined;
                  readonly claudeAgent?:
                    | {
                        readonly binaryPath?: string | undefined;
                        readonly permissionMode?: string | undefined;
                        readonly maxThinkingTokens?: number | undefined;
                      }
                    | undefined;
                  readonly opencode?:
                    | {
                        readonly binaryPath?: string | undefined;
                        readonly apiKey?: string | undefined;
                      }
                    | undefined;
                  readonly copilotAgent?:
                    | {
                        readonly binaryPath?: string | undefined;
                      }
                    | undefined;
                }
              | undefined;
            readonly assistantDeliveryMode?: "buffered" | "streaming" | undefined;
            readonly titleSeed?: string | undefined;
            readonly bootstrap?:
              | {
                  readonly createThread?:
                    | {
                        readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                        readonly title: string;
                        readonly modelSelection:
                          | {
                              readonly provider: "codex";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                                readonly fastMode?: boolean | undefined;
                              };
                            }
                          | {
                              readonly provider: "gemini";
                              readonly model: string;
                              readonly options?: {
                                readonly thinkingBudget?: number | undefined;
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                              };
                            }
                          | {
                              readonly provider: "claudeAgent";
                              readonly model: string;
                              readonly options?: {
                                readonly thinking?: boolean | undefined;
                                readonly effort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | "max"
                                  | "ultrathink"
                                  | undefined;
                                readonly fastMode?: boolean | undefined;
                                readonly contextWindow?: string | undefined;
                              };
                            }
                          | {
                              readonly provider: "opencode";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                              };
                            }
                          | {
                              readonly provider: "copilotAgent";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                              };
                            };
                        readonly runtimeMode:
                          | "approval-required"
                          | "auto-accept-edits"
                          | "full-access";
                        readonly interactionMode: "default" | "plan";
                        readonly branch: string | null;
                        readonly worktreePath: string | null;
                        readonly createdAt: string;
                      }
                    | undefined;
                  readonly prepareWorktree?:
                    | {
                        readonly projectCwd: string;
                        readonly baseBranch: string;
                        readonly branch?: string | undefined;
                      }
                    | undefined;
                  readonly runSetupScript?: boolean | undefined;
                }
              | undefined;
            readonly sourceProposedPlan?:
              | {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly planId: string;
                }
              | undefined;
          },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly sequence: number;
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true
          ? never
          : import("@t3tools/contracts").OrchestrationDispatchCommandError),
      never
    >;
    readonly "orchestration.getTurnDiff": <
      const AsQueue extends boolean = false,
      const Discard = false,
    >(
      input: {
        readonly fromTurnCount: number;
        readonly toTurnCount: number;
        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
            readonly fromTurnCount: number;
            readonly toTurnCount: number;
            readonly diff: string;
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true ? never : import("@t3tools/contracts").OrchestrationGetTurnDiffError),
      never
    >;
    readonly "orchestration.getFullThreadDiff": <
      const AsQueue extends boolean = false,
      const Discard = false,
    >(
      input: {
        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
        readonly toTurnCount: number;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
            readonly fromTurnCount: number;
            readonly toTurnCount: number;
            readonly diff: string;
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true
          ? never
          : import("@t3tools/contracts").OrchestrationGetFullThreadDiffError),
      never
    >;
    readonly "orchestration.replayEvents": <
      const AsQueue extends boolean = false,
      const Discard = false,
    >(
      input: {
        readonly fromSequenceExclusive: number;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : readonly (
            | {
                readonly type: "project.created";
                readonly payload: {
                  readonly defaultModelSelection:
                    | {
                        readonly provider: "codex";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly fastMode?: boolean | undefined;
                        };
                      }
                    | {
                        readonly provider: "gemini";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly thinkingBudget?: number | undefined;
                        };
                      }
                    | {
                        readonly provider: "claudeAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly fastMode?: boolean | undefined;
                          readonly thinking?: boolean | undefined;
                          readonly effort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | "max"
                            | "ultrathink"
                            | undefined;
                          readonly contextWindow?: string | undefined;
                        };
                      }
                    | {
                        readonly provider: "opencode";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      }
                    | {
                        readonly provider: "copilotAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      }
                    | null;
                  readonly scripts: readonly {
                    readonly id: string;
                    readonly name: string;
                    readonly command: string;
                    readonly icon: "play" | "test" | "lint" | "configure" | "build" | "debug";
                    readonly runOnWorktreeCreate: boolean;
                  }[];
                  readonly title: string;
                  readonly workspaceRoot: string;
                  readonly createdAt: string;
                  readonly updatedAt: string;
                  readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                  readonly repositoryIdentity?:
                    | {
                        readonly canonicalKey: string;
                        readonly locator: {
                          readonly source: "git-remote";
                          readonly remoteName: string;
                          readonly remoteUrl: string;
                        };
                        readonly name?: string;
                        readonly displayName?: string;
                        readonly provider?: string;
                        readonly owner?: string;
                      }
                    | null
                    | undefined;
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "project.meta-updated";
                readonly payload: {
                  readonly updatedAt: string;
                  readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                  readonly repositoryIdentity?:
                    | {
                        readonly canonicalKey: string;
                        readonly locator: {
                          readonly source: "git-remote";
                          readonly remoteName: string;
                          readonly remoteUrl: string;
                        };
                        readonly name?: string;
                        readonly displayName?: string;
                        readonly provider?: string;
                        readonly owner?: string;
                      }
                    | null
                    | undefined;
                  readonly defaultModelSelection?:
                    | {
                        readonly provider: "codex";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly fastMode?: boolean | undefined;
                        };
                      }
                    | {
                        readonly provider: "gemini";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly thinkingBudget?: number | undefined;
                        };
                      }
                    | {
                        readonly provider: "claudeAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly fastMode?: boolean | undefined;
                          readonly thinking?: boolean | undefined;
                          readonly effort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | "max"
                            | "ultrathink"
                            | undefined;
                          readonly contextWindow?: string | undefined;
                        };
                      }
                    | {
                        readonly provider: "opencode";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      }
                    | {
                        readonly provider: "copilotAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      }
                    | null
                    | undefined;
                  readonly scripts?:
                    | readonly {
                        readonly id: string;
                        readonly name: string;
                        readonly command: string;
                        readonly icon: "play" | "test" | "lint" | "configure" | "build" | "debug";
                        readonly runOnWorktreeCreate: boolean;
                      }[]
                    | undefined;
                  readonly title?: string | undefined;
                  readonly workspaceRoot?: string | undefined;
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "project.deleted";
                readonly payload: {
                  readonly deletedAt: string;
                  readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "thread.created";
                readonly payload: {
                  readonly title: string;
                  readonly createdAt: string;
                  readonly updatedAt: string;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly runtimeMode: "approval-required" | "auto-accept-edits" | "full-access";
                  readonly interactionMode: "default" | "plan";
                  readonly branch: string | null;
                  readonly worktreePath: string | null;
                  readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                  readonly modelSelection:
                    | {
                        readonly provider: "codex";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly fastMode?: boolean | undefined;
                        };
                      }
                    | {
                        readonly provider: "gemini";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly thinkingBudget?: number | undefined;
                        };
                      }
                    | {
                        readonly provider: "claudeAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly fastMode?: boolean | undefined;
                          readonly thinking?: boolean | undefined;
                          readonly effort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | "max"
                            | "ultrathink"
                            | undefined;
                          readonly contextWindow?: string | undefined;
                        };
                      }
                    | {
                        readonly provider: "opencode";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      }
                    | {
                        readonly provider: "copilotAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      };
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "thread.deleted";
                readonly payload: {
                  readonly deletedAt: string;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "thread.archived";
                readonly payload: {
                  readonly updatedAt: string;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly archivedAt: string;
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "thread.unarchived";
                readonly payload: {
                  readonly updatedAt: string;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "thread.meta-updated";
                readonly payload: {
                  readonly updatedAt: string;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly title?: string | undefined;
                  readonly branch?: string | null | undefined;
                  readonly worktreePath?: string | null | undefined;
                  readonly modelSelection?:
                    | {
                        readonly provider: "codex";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly fastMode?: boolean | undefined;
                        };
                      }
                    | {
                        readonly provider: "gemini";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly thinkingBudget?: number | undefined;
                        };
                      }
                    | {
                        readonly provider: "claudeAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly fastMode?: boolean | undefined;
                          readonly thinking?: boolean | undefined;
                          readonly effort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | "max"
                            | "ultrathink"
                            | undefined;
                          readonly contextWindow?: string | undefined;
                        };
                      }
                    | {
                        readonly provider: "opencode";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      }
                    | {
                        readonly provider: "copilotAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      }
                    | undefined;
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "thread.runtime-mode-set";
                readonly payload: {
                  readonly updatedAt: string;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly runtimeMode: "approval-required" | "auto-accept-edits" | "full-access";
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "thread.interaction-mode-set";
                readonly payload: {
                  readonly updatedAt: string;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly interactionMode: "default" | "plan";
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "thread.message-sent";
                readonly payload: {
                  readonly streaming: boolean;
                  readonly createdAt: string;
                  readonly updatedAt: string;
                  readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                  readonly role: "user" | "assistant" | "system";
                  readonly text: string;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly messageId: string & import("effect/Brand").Brand<"MessageId">;
                  readonly attachments?:
                    | readonly {
                        readonly id: string;
                        readonly name: string;
                        readonly type: "image";
                        readonly mimeType: string;
                        readonly sizeBytes: number;
                      }[]
                    | undefined;
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "thread.turn-start-requested";
                readonly payload: {
                  readonly createdAt: string;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly runtimeMode: "approval-required" | "auto-accept-edits" | "full-access";
                  readonly interactionMode: "default" | "plan";
                  readonly messageId: string & import("effect/Brand").Brand<"MessageId">;
                  readonly sourceProposedPlan?:
                    | {
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                        readonly planId: string;
                      }
                    | undefined;
                  readonly modelSelection?:
                    | {
                        readonly provider: "codex";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly fastMode?: boolean | undefined;
                        };
                      }
                    | {
                        readonly provider: "gemini";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly thinkingBudget?: number | undefined;
                        };
                      }
                    | {
                        readonly provider: "claudeAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly fastMode?: boolean | undefined;
                          readonly thinking?: boolean | undefined;
                          readonly effort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | "max"
                            | "ultrathink"
                            | undefined;
                          readonly contextWindow?: string | undefined;
                        };
                      }
                    | {
                        readonly provider: "opencode";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      }
                    | {
                        readonly provider: "copilotAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      }
                    | undefined;
                  readonly providerOptions?:
                    | {
                        readonly codex?:
                          | {
                              readonly homePath?: string | undefined;
                              readonly binaryPath?: string | undefined;
                            }
                          | undefined;
                        readonly gemini?:
                          | {
                              readonly homePath?: string | undefined;
                              readonly binaryPath?: string | undefined;
                            }
                          | undefined;
                        readonly claudeAgent?:
                          | {
                              readonly binaryPath?: string | undefined;
                              readonly permissionMode?: string | undefined;
                              readonly maxThinkingTokens?: number | undefined;
                            }
                          | undefined;
                        readonly opencode?:
                          | {
                              readonly binaryPath?: string | undefined;
                              readonly apiKey?: string | undefined;
                            }
                          | undefined;
                        readonly copilotAgent?:
                          | {
                              readonly binaryPath?: string | undefined;
                            }
                          | undefined;
                      }
                    | undefined;
                  readonly assistantDeliveryMode?: "buffered" | "streaming" | undefined;
                  readonly titleSeed?: string | undefined;
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "thread.turn-interrupt-requested";
                readonly payload: {
                  readonly createdAt: string;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly turnId?: (string & import("effect/Brand").Brand<"TurnId">) | undefined;
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "thread.approval-response-requested";
                readonly payload: {
                  readonly createdAt: string;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly requestId: string & import("effect/Brand").Brand<"ApprovalRequestId">;
                  readonly decision: "accept" | "acceptForSession" | "decline" | "cancel";
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "thread.user-input-response-requested";
                readonly payload: {
                  readonly createdAt: string;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly requestId: string & import("effect/Brand").Brand<"ApprovalRequestId">;
                  readonly answers: {
                    readonly [x: string]: unknown;
                  };
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "thread.checkpoint-revert-requested";
                readonly payload: {
                  readonly createdAt: string;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly turnCount: number;
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "thread.reverted";
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly turnCount: number;
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "thread.session-stop-requested";
                readonly payload: {
                  readonly createdAt: string;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "thread.session-set";
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly session: {
                    readonly status:
                      | "ready"
                      | "error"
                      | "idle"
                      | "starting"
                      | "running"
                      | "interrupted"
                      | "stopped";
                    readonly updatedAt: string;
                    readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                    readonly providerName: string | null;
                    readonly runtimeMode: "approval-required" | "auto-accept-edits" | "full-access";
                    readonly activeTurnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                    readonly lastError: string | null;
                  };
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "thread.proposed-plan-upserted";
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly proposedPlan: {
                    readonly id: string;
                    readonly createdAt: string;
                    readonly updatedAt: string;
                    readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                    readonly implementedAt: string | null;
                    readonly implementationThreadId:
                      | (string & import("effect/Brand").Brand<"ThreadId">)
                      | null;
                    readonly planMarkdown: string;
                  };
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "thread.turn-diff-completed";
                readonly payload: {
                  readonly status: "ready" | "error" | "missing";
                  readonly turnId: string & import("effect/Brand").Brand<"TurnId">;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly files: readonly {
                    readonly kind: string;
                    readonly path: string;
                    readonly additions: number;
                    readonly deletions: number;
                  }[];
                  readonly assistantMessageId:
                    | (string & import("effect/Brand").Brand<"MessageId">)
                    | null;
                  readonly checkpointTurnCount: number;
                  readonly checkpointRef: string & import("effect/Brand").Brand<"CheckpointRef">;
                  readonly completedAt: string;
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
            | {
                readonly type: "thread.activity-appended";
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly activity: {
                    readonly kind: string;
                    readonly id: string & import("effect/Brand").Brand<"EventId">;
                    readonly payload: unknown;
                    readonly createdAt: string;
                    readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                    readonly tone: "thinking" | "error" | "info" | "tool" | "approval";
                    readonly summary: string;
                    readonly sequence?: number | undefined;
                  };
                };
                readonly sequence: number;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | (string & import("effect/Brand").Brand<"ThreadId">);
                readonly occurredAt: string;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly metadata: {
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly ingestedAt?: string | undefined;
                };
              }
          )[],
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true
          ? never
          : import("@t3tools/contracts").OrchestrationReplayEventsError),
      never
    >;
    readonly "orchestration.subscribeShell": <
      const AsQueue extends boolean = false,
      const Discard = false,
    >(
      input: {},
      options?:
        | {
            readonly asQueue?: AsQueue | undefined;
            readonly streamBufferSize?: number | undefined;
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
          }
        | undefined,
    ) => AsQueue extends true
      ? Effect.Effect<
          import("effect/Queue").Dequeue<
            | {
                readonly kind: "project-upserted";
                readonly sequence: number;
                readonly project: {
                  readonly id: string & import("effect/Brand").Brand<"ProjectId">;
                  readonly defaultModelSelection:
                    | {
                        readonly provider: "codex";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly fastMode?: boolean | undefined;
                        };
                      }
                    | {
                        readonly provider: "gemini";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly thinkingBudget?: number | undefined;
                        };
                      }
                    | {
                        readonly provider: "claudeAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly fastMode?: boolean | undefined;
                          readonly thinking?: boolean | undefined;
                          readonly effort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | "max"
                            | "ultrathink"
                            | undefined;
                          readonly contextWindow?: string | undefined;
                        };
                      }
                    | {
                        readonly provider: "opencode";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      }
                    | {
                        readonly provider: "copilotAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      }
                    | null;
                  readonly scripts: readonly {
                    readonly id: string;
                    readonly name: string;
                    readonly command: string;
                    readonly icon: "play" | "test" | "lint" | "configure" | "build" | "debug";
                    readonly runOnWorktreeCreate: boolean;
                  }[];
                  readonly title: string;
                  readonly workspaceRoot: string;
                  readonly createdAt: string;
                  readonly updatedAt: string;
                  readonly repositoryIdentity?:
                    | {
                        readonly canonicalKey: string;
                        readonly locator: {
                          readonly source: "git-remote";
                          readonly remoteName: string;
                          readonly remoteUrl: string;
                        };
                        readonly name?: string;
                        readonly displayName?: string;
                        readonly provider?: string;
                        readonly owner?: string;
                      }
                    | null
                    | undefined;
                };
              }
            | {
                readonly kind: "project-removed";
                readonly sequence: number;
                readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
              }
            | {
                readonly kind: "thread-upserted";
                readonly sequence: number;
                readonly thread: {
                  readonly id: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly title: string;
                  readonly createdAt: string;
                  readonly updatedAt: string;
                  readonly runtimeMode: "approval-required" | "auto-accept-edits" | "full-access";
                  readonly interactionMode: "default" | "plan";
                  readonly branch: string | null;
                  readonly worktreePath: string | null;
                  readonly latestTurn: {
                    readonly turnId: string & import("effect/Brand").Brand<"TurnId">;
                    readonly assistantMessageId:
                      | (string & import("effect/Brand").Brand<"MessageId">)
                      | null;
                    readonly completedAt: string | null;
                    readonly startedAt: string | null;
                    readonly state: "error" | "running" | "interrupted" | "completed";
                    readonly requestedAt: string;
                    readonly sourceProposedPlan?:
                      | {
                          readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                          readonly planId: string;
                        }
                      | undefined;
                  } | null;
                  readonly archivedAt: string | null;
                  readonly session: {
                    readonly status:
                      | "ready"
                      | "error"
                      | "idle"
                      | "starting"
                      | "running"
                      | "interrupted"
                      | "stopped";
                    readonly updatedAt: string;
                    readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                    readonly providerName: string | null;
                    readonly runtimeMode: "approval-required" | "auto-accept-edits" | "full-access";
                    readonly activeTurnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                    readonly lastError: string | null;
                  } | null;
                  readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                  readonly modelSelection:
                    | {
                        readonly provider: "codex";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly fastMode?: boolean | undefined;
                        };
                      }
                    | {
                        readonly provider: "gemini";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly thinkingBudget?: number | undefined;
                        };
                      }
                    | {
                        readonly provider: "claudeAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly fastMode?: boolean | undefined;
                          readonly thinking?: boolean | undefined;
                          readonly effort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | "max"
                            | "ultrathink"
                            | undefined;
                          readonly contextWindow?: string | undefined;
                        };
                      }
                    | {
                        readonly provider: "opencode";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      }
                    | {
                        readonly provider: "copilotAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      };
                  readonly latestUserMessageAt: string | null;
                  readonly hasPendingApprovals: boolean;
                  readonly hasPendingUserInput: boolean;
                  readonly hasActionableProposedPlan: boolean;
                };
              }
            | {
                readonly kind: "thread-removed";
                readonly sequence: number;
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
              }
            | {
                readonly kind: "snapshot";
                readonly snapshot: {
                  readonly updatedAt: string;
                  readonly projects: readonly {
                    readonly id: string & import("effect/Brand").Brand<"ProjectId">;
                    readonly defaultModelSelection:
                      | {
                          readonly provider: "codex";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
                            readonly fastMode?: boolean | undefined;
                          };
                        }
                      | {
                          readonly provider: "gemini";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
                            readonly thinkingBudget?: number | undefined;
                          };
                        }
                      | {
                          readonly provider: "claudeAgent";
                          readonly model: string;
                          readonly options?: {
                            readonly fastMode?: boolean | undefined;
                            readonly thinking?: boolean | undefined;
                            readonly effort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | "max"
                              | "ultrathink"
                              | undefined;
                            readonly contextWindow?: string | undefined;
                          };
                        }
                      | {
                          readonly provider: "opencode";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
                          };
                        }
                      | {
                          readonly provider: "copilotAgent";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
                          };
                        }
                      | null;
                    readonly scripts: readonly {
                      readonly id: string;
                      readonly name: string;
                      readonly command: string;
                      readonly icon: "play" | "test" | "lint" | "configure" | "build" | "debug";
                      readonly runOnWorktreeCreate: boolean;
                    }[];
                    readonly title: string;
                    readonly workspaceRoot: string;
                    readonly createdAt: string;
                    readonly updatedAt: string;
                    readonly repositoryIdentity?:
                      | {
                          readonly canonicalKey: string;
                          readonly locator: {
                            readonly source: "git-remote";
                            readonly remoteName: string;
                            readonly remoteUrl: string;
                          };
                          readonly name?: string;
                          readonly displayName?: string;
                          readonly provider?: string;
                          readonly owner?: string;
                        }
                      | null
                      | undefined;
                  }[];
                  readonly threads: readonly {
                    readonly id: string & import("effect/Brand").Brand<"ThreadId">;
                    readonly title: string;
                    readonly createdAt: string;
                    readonly updatedAt: string;
                    readonly runtimeMode: "approval-required" | "auto-accept-edits" | "full-access";
                    readonly interactionMode: "default" | "plan";
                    readonly branch: string | null;
                    readonly worktreePath: string | null;
                    readonly latestTurn: {
                      readonly turnId: string & import("effect/Brand").Brand<"TurnId">;
                      readonly assistantMessageId:
                        | (string & import("effect/Brand").Brand<"MessageId">)
                        | null;
                      readonly completedAt: string | null;
                      readonly startedAt: string | null;
                      readonly state: "error" | "running" | "interrupted" | "completed";
                      readonly requestedAt: string;
                      readonly sourceProposedPlan?:
                        | {
                            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                            readonly planId: string;
                          }
                        | undefined;
                    } | null;
                    readonly archivedAt: string | null;
                    readonly session: {
                      readonly status:
                        | "ready"
                        | "error"
                        | "idle"
                        | "starting"
                        | "running"
                        | "interrupted"
                        | "stopped";
                      readonly updatedAt: string;
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      readonly providerName: string | null;
                      readonly runtimeMode:
                        | "approval-required"
                        | "auto-accept-edits"
                        | "full-access";
                      readonly activeTurnId:
                        | (string & import("effect/Brand").Brand<"TurnId">)
                        | null;
                      readonly lastError: string | null;
                    } | null;
                    readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                    readonly modelSelection:
                      | {
                          readonly provider: "codex";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
                            readonly fastMode?: boolean | undefined;
                          };
                        }
                      | {
                          readonly provider: "gemini";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
                            readonly thinkingBudget?: number | undefined;
                          };
                        }
                      | {
                          readonly provider: "claudeAgent";
                          readonly model: string;
                          readonly options?: {
                            readonly fastMode?: boolean | undefined;
                            readonly thinking?: boolean | undefined;
                            readonly effort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | "max"
                              | "ultrathink"
                              | undefined;
                            readonly contextWindow?: string | undefined;
                          };
                        }
                      | {
                          readonly provider: "opencode";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
                          };
                        }
                      | {
                          readonly provider: "copilotAgent";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
                          };
                        };
                    readonly latestUserMessageAt: string | null;
                    readonly hasPendingApprovals: boolean;
                    readonly hasPendingUserInput: boolean;
                    readonly hasActionableProposedPlan: boolean;
                  }[];
                  readonly snapshotSequence: number;
                };
              },
            | import("@t3tools/contracts").OrchestrationGetSnapshotError
            | import("effect/unstable/rpc/RpcClientError").RpcClientError
            | import("effect/Cause").Done<void>
          >,
          never,
          import("effect/Scope").Scope
        >
      : import("effect/Stream").Stream<
          | {
              readonly kind: "project-upserted";
              readonly sequence: number;
              readonly project: {
                readonly id: string & import("effect/Brand").Brand<"ProjectId">;
                readonly defaultModelSelection:
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
                        readonly reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
                        readonly thinkingBudget?: number | undefined;
                      };
                    }
                  | {
                      readonly provider: "claudeAgent";
                      readonly model: string;
                      readonly options?: {
                        readonly fastMode?: boolean | undefined;
                        readonly thinking?: boolean | undefined;
                        readonly effort?:
                          | "xhigh"
                          | "high"
                          | "medium"
                          | "low"
                          | "max"
                          | "ultrathink"
                          | undefined;
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
                    }
                  | null;
                readonly scripts: readonly {
                  readonly id: string;
                  readonly name: string;
                  readonly command: string;
                  readonly icon: "play" | "test" | "lint" | "configure" | "build" | "debug";
                  readonly runOnWorktreeCreate: boolean;
                }[];
                readonly title: string;
                readonly workspaceRoot: string;
                readonly createdAt: string;
                readonly updatedAt: string;
                readonly repositoryIdentity?:
                  | {
                      readonly canonicalKey: string;
                      readonly locator: {
                        readonly source: "git-remote";
                        readonly remoteName: string;
                        readonly remoteUrl: string;
                      };
                      readonly name?: string;
                      readonly displayName?: string;
                      readonly provider?: string;
                      readonly owner?: string;
                    }
                  | null
                  | undefined;
              };
            }
          | {
              readonly kind: "project-removed";
              readonly sequence: number;
              readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
            }
          | {
              readonly kind: "thread-upserted";
              readonly sequence: number;
              readonly thread: {
                readonly id: string & import("effect/Brand").Brand<"ThreadId">;
                readonly title: string;
                readonly createdAt: string;
                readonly updatedAt: string;
                readonly runtimeMode: "approval-required" | "auto-accept-edits" | "full-access";
                readonly interactionMode: "default" | "plan";
                readonly branch: string | null;
                readonly worktreePath: string | null;
                readonly latestTurn: {
                  readonly turnId: string & import("effect/Brand").Brand<"TurnId">;
                  readonly assistantMessageId:
                    | (string & import("effect/Brand").Brand<"MessageId">)
                    | null;
                  readonly completedAt: string | null;
                  readonly startedAt: string | null;
                  readonly state: "error" | "running" | "interrupted" | "completed";
                  readonly requestedAt: string;
                  readonly sourceProposedPlan?:
                    | {
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                        readonly planId: string;
                      }
                    | undefined;
                } | null;
                readonly archivedAt: string | null;
                readonly session: {
                  readonly status:
                    | "ready"
                    | "error"
                    | "idle"
                    | "starting"
                    | "running"
                    | "interrupted"
                    | "stopped";
                  readonly updatedAt: string;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly providerName: string | null;
                  readonly runtimeMode: "approval-required" | "auto-accept-edits" | "full-access";
                  readonly activeTurnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                  readonly lastError: string | null;
                } | null;
                readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                readonly modelSelection:
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
                        readonly reasoningEffort?: "xhigh" | "high" | "medium" | "low" | undefined;
                        readonly thinkingBudget?: number | undefined;
                      };
                    }
                  | {
                      readonly provider: "claudeAgent";
                      readonly model: string;
                      readonly options?: {
                        readonly fastMode?: boolean | undefined;
                        readonly thinking?: boolean | undefined;
                        readonly effort?:
                          | "xhigh"
                          | "high"
                          | "medium"
                          | "low"
                          | "max"
                          | "ultrathink"
                          | undefined;
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
                readonly latestUserMessageAt: string | null;
                readonly hasPendingApprovals: boolean;
                readonly hasPendingUserInput: boolean;
                readonly hasActionableProposedPlan: boolean;
              };
            }
          | {
              readonly kind: "thread-removed";
              readonly sequence: number;
              readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
            }
          | {
              readonly kind: "snapshot";
              readonly snapshot: {
                readonly updatedAt: string;
                readonly projects: readonly {
                  readonly id: string & import("effect/Brand").Brand<"ProjectId">;
                  readonly defaultModelSelection:
                    | {
                        readonly provider: "codex";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly fastMode?: boolean | undefined;
                        };
                      }
                    | {
                        readonly provider: "gemini";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly thinkingBudget?: number | undefined;
                        };
                      }
                    | {
                        readonly provider: "claudeAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly fastMode?: boolean | undefined;
                          readonly thinking?: boolean | undefined;
                          readonly effort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | "max"
                            | "ultrathink"
                            | undefined;
                          readonly contextWindow?: string | undefined;
                        };
                      }
                    | {
                        readonly provider: "opencode";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      }
                    | {
                        readonly provider: "copilotAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      }
                    | null;
                  readonly scripts: readonly {
                    readonly id: string;
                    readonly name: string;
                    readonly command: string;
                    readonly icon: "play" | "test" | "lint" | "configure" | "build" | "debug";
                    readonly runOnWorktreeCreate: boolean;
                  }[];
                  readonly title: string;
                  readonly workspaceRoot: string;
                  readonly createdAt: string;
                  readonly updatedAt: string;
                  readonly repositoryIdentity?:
                    | {
                        readonly canonicalKey: string;
                        readonly locator: {
                          readonly source: "git-remote";
                          readonly remoteName: string;
                          readonly remoteUrl: string;
                        };
                        readonly name?: string;
                        readonly displayName?: string;
                        readonly provider?: string;
                        readonly owner?: string;
                      }
                    | null
                    | undefined;
                }[];
                readonly threads: readonly {
                  readonly id: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly title: string;
                  readonly createdAt: string;
                  readonly updatedAt: string;
                  readonly runtimeMode: "approval-required" | "auto-accept-edits" | "full-access";
                  readonly interactionMode: "default" | "plan";
                  readonly branch: string | null;
                  readonly worktreePath: string | null;
                  readonly latestTurn: {
                    readonly turnId: string & import("effect/Brand").Brand<"TurnId">;
                    readonly assistantMessageId:
                      | (string & import("effect/Brand").Brand<"MessageId">)
                      | null;
                    readonly completedAt: string | null;
                    readonly startedAt: string | null;
                    readonly state: "error" | "running" | "interrupted" | "completed";
                    readonly requestedAt: string;
                    readonly sourceProposedPlan?:
                      | {
                          readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                          readonly planId: string;
                        }
                      | undefined;
                  } | null;
                  readonly archivedAt: string | null;
                  readonly session: {
                    readonly status:
                      | "ready"
                      | "error"
                      | "idle"
                      | "starting"
                      | "running"
                      | "interrupted"
                      | "stopped";
                    readonly updatedAt: string;
                    readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                    readonly providerName: string | null;
                    readonly runtimeMode: "approval-required" | "auto-accept-edits" | "full-access";
                    readonly activeTurnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                    readonly lastError: string | null;
                  } | null;
                  readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                  readonly modelSelection:
                    | {
                        readonly provider: "codex";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly fastMode?: boolean | undefined;
                        };
                      }
                    | {
                        readonly provider: "gemini";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly thinkingBudget?: number | undefined;
                        };
                      }
                    | {
                        readonly provider: "claudeAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly fastMode?: boolean | undefined;
                          readonly thinking?: boolean | undefined;
                          readonly effort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | "max"
                            | "ultrathink"
                            | undefined;
                          readonly contextWindow?: string | undefined;
                        };
                      }
                    | {
                        readonly provider: "opencode";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      }
                    | {
                        readonly provider: "copilotAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      };
                  readonly latestUserMessageAt: string | null;
                  readonly hasPendingApprovals: boolean;
                  readonly hasPendingUserInput: boolean;
                  readonly hasActionableProposedPlan: boolean;
                }[];
                readonly snapshotSequence: number;
              };
            },
          | import("@t3tools/contracts").OrchestrationGetSnapshotError
          | import("effect/unstable/rpc/RpcClientError").RpcClientError,
          never
        >;
    readonly "orchestration.subscribeThread": <
      const AsQueue extends boolean = false,
      const Discard = false,
    >(
      input: {
        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
      },
      options?:
        | {
            readonly asQueue?: AsQueue | undefined;
            readonly streamBufferSize?: number | undefined;
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
          }
        | undefined,
    ) => AsQueue extends true
      ? Effect.Effect<
          import("effect/Queue").Dequeue<
            | {
                readonly kind: "snapshot";
                readonly snapshot: {
                  readonly snapshotSequence: number;
                  readonly thread: {
                    readonly id: string & import("effect/Brand").Brand<"ThreadId">;
                    readonly deletedAt: string | null;
                    readonly title: string;
                    readonly createdAt: string;
                    readonly updatedAt: string;
                    readonly runtimeMode: "approval-required" | "auto-accept-edits" | "full-access";
                    readonly interactionMode: "default" | "plan";
                    readonly branch: string | null;
                    readonly worktreePath: string | null;
                    readonly latestTurn: {
                      readonly turnId: string & import("effect/Brand").Brand<"TurnId">;
                      readonly assistantMessageId:
                        | (string & import("effect/Brand").Brand<"MessageId">)
                        | null;
                      readonly completedAt: string | null;
                      readonly startedAt: string | null;
                      readonly state: "error" | "running" | "interrupted" | "completed";
                      readonly requestedAt: string;
                      readonly sourceProposedPlan?:
                        | {
                            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                            readonly planId: string;
                          }
                        | undefined;
                    } | null;
                    readonly archivedAt: string | null;
                    readonly messages: readonly {
                      readonly id: string & import("effect/Brand").Brand<"MessageId">;
                      readonly streaming: boolean;
                      readonly createdAt: string;
                      readonly updatedAt: string;
                      readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                      readonly role: "user" | "assistant" | "system";
                      readonly text: string;
                      readonly reasoningText?: string | undefined;
                      readonly attachments?:
                        | readonly {
                            readonly id: string;
                            readonly name: string;
                            readonly type: "image";
                            readonly mimeType: string;
                            readonly sizeBytes: number;
                          }[]
                        | undefined;
                    }[];
                    readonly proposedPlans: readonly {
                      readonly id: string;
                      readonly createdAt: string;
                      readonly updatedAt: string;
                      readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                      readonly implementedAt: string | null;
                      readonly implementationThreadId:
                        | (string & import("effect/Brand").Brand<"ThreadId">)
                        | null;
                      readonly planMarkdown: string;
                    }[];
                    readonly activities: readonly {
                      readonly kind: string;
                      readonly id: string & import("effect/Brand").Brand<"EventId">;
                      readonly payload: unknown;
                      readonly createdAt: string;
                      readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                      readonly tone: "thinking" | "error" | "info" | "tool" | "approval";
                      readonly summary: string;
                      readonly sequence?: number | undefined;
                    }[];
                    readonly checkpoints: readonly {
                      readonly status: "ready" | "error" | "missing";
                      readonly turnId: string & import("effect/Brand").Brand<"TurnId">;
                      readonly files: readonly {
                        readonly kind: string;
                        readonly path: string;
                        readonly additions: number;
                        readonly deletions: number;
                      }[];
                      readonly assistantMessageId:
                        | (string & import("effect/Brand").Brand<"MessageId">)
                        | null;
                      readonly checkpointTurnCount: number;
                      readonly checkpointRef: string &
                        import("effect/Brand").Brand<"CheckpointRef">;
                      readonly completedAt: string;
                    }[];
                    readonly session: {
                      readonly status:
                        | "ready"
                        | "error"
                        | "idle"
                        | "starting"
                        | "running"
                        | "interrupted"
                        | "stopped";
                      readonly updatedAt: string;
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      readonly providerName: string | null;
                      readonly runtimeMode:
                        | "approval-required"
                        | "auto-accept-edits"
                        | "full-access";
                      readonly activeTurnId:
                        | (string & import("effect/Brand").Brand<"TurnId">)
                        | null;
                      readonly lastError: string | null;
                    } | null;
                    readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                    readonly modelSelection:
                      | {
                          readonly provider: "codex";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
                            readonly fastMode?: boolean | undefined;
                          };
                        }
                      | {
                          readonly provider: "gemini";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
                            readonly thinkingBudget?: number | undefined;
                          };
                        }
                      | {
                          readonly provider: "claudeAgent";
                          readonly model: string;
                          readonly options?: {
                            readonly fastMode?: boolean | undefined;
                            readonly thinking?: boolean | undefined;
                            readonly effort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | "max"
                              | "ultrathink"
                              | undefined;
                            readonly contextWindow?: string | undefined;
                          };
                        }
                      | {
                          readonly provider: "opencode";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
                          };
                        }
                      | {
                          readonly provider: "copilotAgent";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
                          };
                        };
                  };
                };
              }
            | {
                readonly kind: "event";
                readonly event:
                  | {
                      readonly type: "project.created";
                      readonly payload: {
                        readonly defaultModelSelection:
                          | {
                              readonly provider: "codex";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                                readonly fastMode?: boolean | undefined;
                              };
                            }
                          | {
                              readonly provider: "gemini";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                                readonly thinkingBudget?: number | undefined;
                              };
                            }
                          | {
                              readonly provider: "claudeAgent";
                              readonly model: string;
                              readonly options?: {
                                readonly fastMode?: boolean | undefined;
                                readonly thinking?: boolean | undefined;
                                readonly effort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | "max"
                                  | "ultrathink"
                                  | undefined;
                                readonly contextWindow?: string | undefined;
                              };
                            }
                          | {
                              readonly provider: "opencode";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                              };
                            }
                          | {
                              readonly provider: "copilotAgent";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                              };
                            }
                          | null;
                        readonly scripts: readonly {
                          readonly id: string;
                          readonly name: string;
                          readonly command: string;
                          readonly icon: "play" | "test" | "lint" | "configure" | "build" | "debug";
                          readonly runOnWorktreeCreate: boolean;
                        }[];
                        readonly title: string;
                        readonly workspaceRoot: string;
                        readonly createdAt: string;
                        readonly updatedAt: string;
                        readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                        readonly repositoryIdentity?:
                          | {
                              readonly canonicalKey: string;
                              readonly locator: {
                                readonly source: "git-remote";
                                readonly remoteName: string;
                                readonly remoteUrl: string;
                              };
                              readonly name?: string;
                              readonly displayName?: string;
                              readonly provider?: string;
                              readonly owner?: string;
                            }
                          | null
                          | undefined;
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "project.meta-updated";
                      readonly payload: {
                        readonly updatedAt: string;
                        readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                        readonly repositoryIdentity?:
                          | {
                              readonly canonicalKey: string;
                              readonly locator: {
                                readonly source: "git-remote";
                                readonly remoteName: string;
                                readonly remoteUrl: string;
                              };
                              readonly name?: string;
                              readonly displayName?: string;
                              readonly provider?: string;
                              readonly owner?: string;
                            }
                          | null
                          | undefined;
                        readonly defaultModelSelection?:
                          | {
                              readonly provider: "codex";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                                readonly fastMode?: boolean | undefined;
                              };
                            }
                          | {
                              readonly provider: "gemini";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                                readonly thinkingBudget?: number | undefined;
                              };
                            }
                          | {
                              readonly provider: "claudeAgent";
                              readonly model: string;
                              readonly options?: {
                                readonly fastMode?: boolean | undefined;
                                readonly thinking?: boolean | undefined;
                                readonly effort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | "max"
                                  | "ultrathink"
                                  | undefined;
                                readonly contextWindow?: string | undefined;
                              };
                            }
                          | {
                              readonly provider: "opencode";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                              };
                            }
                          | {
                              readonly provider: "copilotAgent";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                              };
                            }
                          | null
                          | undefined;
                        readonly scripts?:
                          | readonly {
                              readonly id: string;
                              readonly name: string;
                              readonly command: string;
                              readonly icon:
                                | "play"
                                | "test"
                                | "lint"
                                | "configure"
                                | "build"
                                | "debug";
                              readonly runOnWorktreeCreate: boolean;
                            }[]
                          | undefined;
                        readonly title?: string | undefined;
                        readonly workspaceRoot?: string | undefined;
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "project.deleted";
                      readonly payload: {
                        readonly deletedAt: string;
                        readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "thread.created";
                      readonly payload: {
                        readonly title: string;
                        readonly createdAt: string;
                        readonly updatedAt: string;
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                        readonly runtimeMode:
                          | "approval-required"
                          | "auto-accept-edits"
                          | "full-access";
                        readonly interactionMode: "default" | "plan";
                        readonly branch: string | null;
                        readonly worktreePath: string | null;
                        readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                        readonly modelSelection:
                          | {
                              readonly provider: "codex";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                                readonly fastMode?: boolean | undefined;
                              };
                            }
                          | {
                              readonly provider: "gemini";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                                readonly thinkingBudget?: number | undefined;
                              };
                            }
                          | {
                              readonly provider: "claudeAgent";
                              readonly model: string;
                              readonly options?: {
                                readonly fastMode?: boolean | undefined;
                                readonly thinking?: boolean | undefined;
                                readonly effort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | "max"
                                  | "ultrathink"
                                  | undefined;
                                readonly contextWindow?: string | undefined;
                              };
                            }
                          | {
                              readonly provider: "opencode";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                              };
                            }
                          | {
                              readonly provider: "copilotAgent";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                              };
                            };
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "thread.deleted";
                      readonly payload: {
                        readonly deletedAt: string;
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "thread.archived";
                      readonly payload: {
                        readonly updatedAt: string;
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                        readonly archivedAt: string;
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "thread.unarchived";
                      readonly payload: {
                        readonly updatedAt: string;
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "thread.meta-updated";
                      readonly payload: {
                        readonly updatedAt: string;
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                        readonly title?: string | undefined;
                        readonly branch?: string | null | undefined;
                        readonly worktreePath?: string | null | undefined;
                        readonly modelSelection?:
                          | {
                              readonly provider: "codex";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                                readonly fastMode?: boolean | undefined;
                              };
                            }
                          | {
                              readonly provider: "gemini";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                                readonly thinkingBudget?: number | undefined;
                              };
                            }
                          | {
                              readonly provider: "claudeAgent";
                              readonly model: string;
                              readonly options?: {
                                readonly fastMode?: boolean | undefined;
                                readonly thinking?: boolean | undefined;
                                readonly effort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | "max"
                                  | "ultrathink"
                                  | undefined;
                                readonly contextWindow?: string | undefined;
                              };
                            }
                          | {
                              readonly provider: "opencode";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                              };
                            }
                          | {
                              readonly provider: "copilotAgent";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                              };
                            }
                          | undefined;
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "thread.runtime-mode-set";
                      readonly payload: {
                        readonly updatedAt: string;
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                        readonly runtimeMode:
                          | "approval-required"
                          | "auto-accept-edits"
                          | "full-access";
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "thread.interaction-mode-set";
                      readonly payload: {
                        readonly updatedAt: string;
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                        readonly interactionMode: "default" | "plan";
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "thread.message-sent";
                      readonly payload: {
                        readonly streaming: boolean;
                        readonly createdAt: string;
                        readonly updatedAt: string;
                        readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                        readonly role: "user" | "assistant" | "system";
                        readonly text: string;
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                        readonly messageId: string & import("effect/Brand").Brand<"MessageId">;
                        readonly attachments?:
                          | readonly {
                              readonly id: string;
                              readonly name: string;
                              readonly type: "image";
                              readonly mimeType: string;
                              readonly sizeBytes: number;
                            }[]
                          | undefined;
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "thread.turn-start-requested";
                      readonly payload: {
                        readonly createdAt: string;
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                        readonly runtimeMode:
                          | "approval-required"
                          | "auto-accept-edits"
                          | "full-access";
                        readonly interactionMode: "default" | "plan";
                        readonly messageId: string & import("effect/Brand").Brand<"MessageId">;
                        readonly sourceProposedPlan?:
                          | {
                              readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                              readonly planId: string;
                            }
                          | undefined;
                        readonly modelSelection?:
                          | {
                              readonly provider: "codex";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                                readonly fastMode?: boolean | undefined;
                              };
                            }
                          | {
                              readonly provider: "gemini";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                                readonly thinkingBudget?: number | undefined;
                              };
                            }
                          | {
                              readonly provider: "claudeAgent";
                              readonly model: string;
                              readonly options?: {
                                readonly fastMode?: boolean | undefined;
                                readonly thinking?: boolean | undefined;
                                readonly effort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | "max"
                                  | "ultrathink"
                                  | undefined;
                                readonly contextWindow?: string | undefined;
                              };
                            }
                          | {
                              readonly provider: "opencode";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                              };
                            }
                          | {
                              readonly provider: "copilotAgent";
                              readonly model: string;
                              readonly options?: {
                                readonly reasoningEffort?:
                                  | "xhigh"
                                  | "high"
                                  | "medium"
                                  | "low"
                                  | undefined;
                              };
                            }
                          | undefined;
                        readonly providerOptions?:
                          | {
                              readonly codex?:
                                | {
                                    readonly homePath?: string | undefined;
                                    readonly binaryPath?: string | undefined;
                                  }
                                | undefined;
                              readonly gemini?:
                                | {
                                    readonly homePath?: string | undefined;
                                    readonly binaryPath?: string | undefined;
                                  }
                                | undefined;
                              readonly claudeAgent?:
                                | {
                                    readonly binaryPath?: string | undefined;
                                    readonly permissionMode?: string | undefined;
                                    readonly maxThinkingTokens?: number | undefined;
                                  }
                                | undefined;
                              readonly opencode?:
                                | {
                                    readonly binaryPath?: string | undefined;
                                    readonly apiKey?: string | undefined;
                                  }
                                | undefined;
                              readonly copilotAgent?:
                                | {
                                    readonly binaryPath?: string | undefined;
                                  }
                                | undefined;
                            }
                          | undefined;
                        readonly assistantDeliveryMode?: "buffered" | "streaming" | undefined;
                        readonly titleSeed?: string | undefined;
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "thread.turn-interrupt-requested";
                      readonly payload: {
                        readonly createdAt: string;
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                        readonly turnId?:
                          | (string & import("effect/Brand").Brand<"TurnId">)
                          | undefined;
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "thread.approval-response-requested";
                      readonly payload: {
                        readonly createdAt: string;
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                        readonly requestId: string &
                          import("effect/Brand").Brand<"ApprovalRequestId">;
                        readonly decision: "accept" | "acceptForSession" | "decline" | "cancel";
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "thread.user-input-response-requested";
                      readonly payload: {
                        readonly createdAt: string;
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                        readonly requestId: string &
                          import("effect/Brand").Brand<"ApprovalRequestId">;
                        readonly answers: {
                          readonly [x: string]: unknown;
                        };
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "thread.checkpoint-revert-requested";
                      readonly payload: {
                        readonly createdAt: string;
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                        readonly turnCount: number;
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "thread.reverted";
                      readonly payload: {
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                        readonly turnCount: number;
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "thread.session-stop-requested";
                      readonly payload: {
                        readonly createdAt: string;
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "thread.session-set";
                      readonly payload: {
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                        readonly session: {
                          readonly status:
                            | "ready"
                            | "error"
                            | "idle"
                            | "starting"
                            | "running"
                            | "interrupted"
                            | "stopped";
                          readonly updatedAt: string;
                          readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                          readonly providerName: string | null;
                          readonly runtimeMode:
                            | "approval-required"
                            | "auto-accept-edits"
                            | "full-access";
                          readonly activeTurnId:
                            | (string & import("effect/Brand").Brand<"TurnId">)
                            | null;
                          readonly lastError: string | null;
                        };
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "thread.proposed-plan-upserted";
                      readonly payload: {
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                        readonly proposedPlan: {
                          readonly id: string;
                          readonly createdAt: string;
                          readonly updatedAt: string;
                          readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                          readonly implementedAt: string | null;
                          readonly implementationThreadId:
                            | (string & import("effect/Brand").Brand<"ThreadId">)
                            | null;
                          readonly planMarkdown: string;
                        };
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "thread.turn-diff-completed";
                      readonly payload: {
                        readonly status: "ready" | "error" | "missing";
                        readonly turnId: string & import("effect/Brand").Brand<"TurnId">;
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                        readonly files: readonly {
                          readonly kind: string;
                          readonly path: string;
                          readonly additions: number;
                          readonly deletions: number;
                        }[];
                        readonly assistantMessageId:
                          | (string & import("effect/Brand").Brand<"MessageId">)
                          | null;
                        readonly checkpointTurnCount: number;
                        readonly checkpointRef: string &
                          import("effect/Brand").Brand<"CheckpointRef">;
                        readonly completedAt: string;
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    }
                  | {
                      readonly type: "thread.activity-appended";
                      readonly payload: {
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                        readonly activity: {
                          readonly kind: string;
                          readonly id: string & import("effect/Brand").Brand<"EventId">;
                          readonly payload: unknown;
                          readonly createdAt: string;
                          readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                          readonly tone: "thinking" | "error" | "info" | "tool" | "approval";
                          readonly summary: string;
                          readonly sequence?: number | undefined;
                        };
                      };
                      readonly sequence: number;
                      readonly commandId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                      readonly aggregateKind: "project" | "thread";
                      readonly aggregateId:
                        | (string & import("effect/Brand").Brand<"ProjectId">)
                        | (string & import("effect/Brand").Brand<"ThreadId">);
                      readonly occurredAt: string;
                      readonly causationEventId:
                        | (string & import("effect/Brand").Brand<"EventId">)
                        | null;
                      readonly correlationId:
                        | (string & import("effect/Brand").Brand<"CommandId">)
                        | null;
                      readonly metadata: {
                        readonly requestId?:
                          | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                          | undefined;
                        readonly providerTurnId?: string | undefined;
                        readonly providerItemId?:
                          | (string & import("effect/Brand").Brand<"ProviderItemId">)
                          | undefined;
                        readonly adapterKey?: string | undefined;
                        readonly ingestedAt?: string | undefined;
                      };
                    };
              },
            | import("@t3tools/contracts").OrchestrationGetSnapshotError
            | import("effect/unstable/rpc/RpcClientError").RpcClientError
            | import("effect/Cause").Done<void>
          >,
          never,
          import("effect/Scope").Scope
        >
      : import("effect/Stream").Stream<
          | {
              readonly kind: "snapshot";
              readonly snapshot: {
                readonly snapshotSequence: number;
                readonly thread: {
                  readonly id: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly deletedAt: string | null;
                  readonly title: string;
                  readonly createdAt: string;
                  readonly updatedAt: string;
                  readonly runtimeMode: "approval-required" | "auto-accept-edits" | "full-access";
                  readonly interactionMode: "default" | "plan";
                  readonly branch: string | null;
                  readonly worktreePath: string | null;
                  readonly latestTurn: {
                    readonly turnId: string & import("effect/Brand").Brand<"TurnId">;
                    readonly assistantMessageId:
                      | (string & import("effect/Brand").Brand<"MessageId">)
                      | null;
                    readonly completedAt: string | null;
                    readonly startedAt: string | null;
                    readonly state: "error" | "running" | "interrupted" | "completed";
                    readonly requestedAt: string;
                    readonly sourceProposedPlan?:
                      | {
                          readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                          readonly planId: string;
                        }
                      | undefined;
                  } | null;
                  readonly archivedAt: string | null;
                  readonly messages: readonly {
                    readonly id: string & import("effect/Brand").Brand<"MessageId">;
                    readonly streaming: boolean;
                    readonly createdAt: string;
                    readonly updatedAt: string;
                    readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                    readonly role: "user" | "assistant" | "system";
                    readonly text: string;
                    readonly reasoningText?: string | undefined;
                    readonly attachments?:
                      | readonly {
                          readonly id: string;
                          readonly name: string;
                          readonly type: "image";
                          readonly mimeType: string;
                          readonly sizeBytes: number;
                        }[]
                      | undefined;
                  }[];
                  readonly proposedPlans: readonly {
                    readonly id: string;
                    readonly createdAt: string;
                    readonly updatedAt: string;
                    readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                    readonly implementedAt: string | null;
                    readonly implementationThreadId:
                      | (string & import("effect/Brand").Brand<"ThreadId">)
                      | null;
                    readonly planMarkdown: string;
                  }[];
                  readonly activities: readonly {
                    readonly kind: string;
                    readonly id: string & import("effect/Brand").Brand<"EventId">;
                    readonly payload: unknown;
                    readonly createdAt: string;
                    readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                    readonly tone: "thinking" | "error" | "info" | "tool" | "approval";
                    readonly summary: string;
                    readonly sequence?: number | undefined;
                  }[];
                  readonly checkpoints: readonly {
                    readonly status: "ready" | "error" | "missing";
                    readonly turnId: string & import("effect/Brand").Brand<"TurnId">;
                    readonly files: readonly {
                      readonly kind: string;
                      readonly path: string;
                      readonly additions: number;
                      readonly deletions: number;
                    }[];
                    readonly assistantMessageId:
                      | (string & import("effect/Brand").Brand<"MessageId">)
                      | null;
                    readonly checkpointTurnCount: number;
                    readonly checkpointRef: string & import("effect/Brand").Brand<"CheckpointRef">;
                    readonly completedAt: string;
                  }[];
                  readonly session: {
                    readonly status:
                      | "ready"
                      | "error"
                      | "idle"
                      | "starting"
                      | "running"
                      | "interrupted"
                      | "stopped";
                    readonly updatedAt: string;
                    readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                    readonly providerName: string | null;
                    readonly runtimeMode: "approval-required" | "auto-accept-edits" | "full-access";
                    readonly activeTurnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                    readonly lastError: string | null;
                  } | null;
                  readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                  readonly modelSelection:
                    | {
                        readonly provider: "codex";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly fastMode?: boolean | undefined;
                        };
                      }
                    | {
                        readonly provider: "gemini";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly thinkingBudget?: number | undefined;
                        };
                      }
                    | {
                        readonly provider: "claudeAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly fastMode?: boolean | undefined;
                          readonly thinking?: boolean | undefined;
                          readonly effort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | "max"
                            | "ultrathink"
                            | undefined;
                          readonly contextWindow?: string | undefined;
                        };
                      }
                    | {
                        readonly provider: "opencode";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      }
                    | {
                        readonly provider: "copilotAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      };
                };
              };
            }
          | {
              readonly kind: "event";
              readonly event:
                | {
                    readonly type: "project.created";
                    readonly payload: {
                      readonly defaultModelSelection:
                        | {
                            readonly provider: "codex";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                              readonly fastMode?: boolean | undefined;
                            };
                          }
                        | {
                            readonly provider: "gemini";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                              readonly thinkingBudget?: number | undefined;
                            };
                          }
                        | {
                            readonly provider: "claudeAgent";
                            readonly model: string;
                            readonly options?: {
                              readonly fastMode?: boolean | undefined;
                              readonly thinking?: boolean | undefined;
                              readonly effort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | "max"
                                | "ultrathink"
                                | undefined;
                              readonly contextWindow?: string | undefined;
                            };
                          }
                        | {
                            readonly provider: "opencode";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                            };
                          }
                        | {
                            readonly provider: "copilotAgent";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                            };
                          }
                        | null;
                      readonly scripts: readonly {
                        readonly id: string;
                        readonly name: string;
                        readonly command: string;
                        readonly icon: "play" | "test" | "lint" | "configure" | "build" | "debug";
                        readonly runOnWorktreeCreate: boolean;
                      }[];
                      readonly title: string;
                      readonly workspaceRoot: string;
                      readonly createdAt: string;
                      readonly updatedAt: string;
                      readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                      readonly repositoryIdentity?:
                        | {
                            readonly canonicalKey: string;
                            readonly locator: {
                              readonly source: "git-remote";
                              readonly remoteName: string;
                              readonly remoteUrl: string;
                            };
                            readonly name?: string;
                            readonly displayName?: string;
                            readonly provider?: string;
                            readonly owner?: string;
                          }
                        | null
                        | undefined;
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "project.meta-updated";
                    readonly payload: {
                      readonly updatedAt: string;
                      readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                      readonly repositoryIdentity?:
                        | {
                            readonly canonicalKey: string;
                            readonly locator: {
                              readonly source: "git-remote";
                              readonly remoteName: string;
                              readonly remoteUrl: string;
                            };
                            readonly name?: string;
                            readonly displayName?: string;
                            readonly provider?: string;
                            readonly owner?: string;
                          }
                        | null
                        | undefined;
                      readonly defaultModelSelection?:
                        | {
                            readonly provider: "codex";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                              readonly fastMode?: boolean | undefined;
                            };
                          }
                        | {
                            readonly provider: "gemini";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                              readonly thinkingBudget?: number | undefined;
                            };
                          }
                        | {
                            readonly provider: "claudeAgent";
                            readonly model: string;
                            readonly options?: {
                              readonly fastMode?: boolean | undefined;
                              readonly thinking?: boolean | undefined;
                              readonly effort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | "max"
                                | "ultrathink"
                                | undefined;
                              readonly contextWindow?: string | undefined;
                            };
                          }
                        | {
                            readonly provider: "opencode";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                            };
                          }
                        | {
                            readonly provider: "copilotAgent";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                            };
                          }
                        | null
                        | undefined;
                      readonly scripts?:
                        | readonly {
                            readonly id: string;
                            readonly name: string;
                            readonly command: string;
                            readonly icon:
                              | "play"
                              | "test"
                              | "lint"
                              | "configure"
                              | "build"
                              | "debug";
                            readonly runOnWorktreeCreate: boolean;
                          }[]
                        | undefined;
                      readonly title?: string | undefined;
                      readonly workspaceRoot?: string | undefined;
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "project.deleted";
                    readonly payload: {
                      readonly deletedAt: string;
                      readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "thread.created";
                    readonly payload: {
                      readonly title: string;
                      readonly createdAt: string;
                      readonly updatedAt: string;
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      readonly runtimeMode:
                        | "approval-required"
                        | "auto-accept-edits"
                        | "full-access";
                      readonly interactionMode: "default" | "plan";
                      readonly branch: string | null;
                      readonly worktreePath: string | null;
                      readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                      readonly modelSelection:
                        | {
                            readonly provider: "codex";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                              readonly fastMode?: boolean | undefined;
                            };
                          }
                        | {
                            readonly provider: "gemini";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                              readonly thinkingBudget?: number | undefined;
                            };
                          }
                        | {
                            readonly provider: "claudeAgent";
                            readonly model: string;
                            readonly options?: {
                              readonly fastMode?: boolean | undefined;
                              readonly thinking?: boolean | undefined;
                              readonly effort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | "max"
                                | "ultrathink"
                                | undefined;
                              readonly contextWindow?: string | undefined;
                            };
                          }
                        | {
                            readonly provider: "opencode";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                            };
                          }
                        | {
                            readonly provider: "copilotAgent";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                            };
                          };
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "thread.deleted";
                    readonly payload: {
                      readonly deletedAt: string;
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "thread.archived";
                    readonly payload: {
                      readonly updatedAt: string;
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      readonly archivedAt: string;
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "thread.unarchived";
                    readonly payload: {
                      readonly updatedAt: string;
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "thread.meta-updated";
                    readonly payload: {
                      readonly updatedAt: string;
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      readonly title?: string | undefined;
                      readonly branch?: string | null | undefined;
                      readonly worktreePath?: string | null | undefined;
                      readonly modelSelection?:
                        | {
                            readonly provider: "codex";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                              readonly fastMode?: boolean | undefined;
                            };
                          }
                        | {
                            readonly provider: "gemini";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                              readonly thinkingBudget?: number | undefined;
                            };
                          }
                        | {
                            readonly provider: "claudeAgent";
                            readonly model: string;
                            readonly options?: {
                              readonly fastMode?: boolean | undefined;
                              readonly thinking?: boolean | undefined;
                              readonly effort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | "max"
                                | "ultrathink"
                                | undefined;
                              readonly contextWindow?: string | undefined;
                            };
                          }
                        | {
                            readonly provider: "opencode";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                            };
                          }
                        | {
                            readonly provider: "copilotAgent";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                            };
                          }
                        | undefined;
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "thread.runtime-mode-set";
                    readonly payload: {
                      readonly updatedAt: string;
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      readonly runtimeMode:
                        | "approval-required"
                        | "auto-accept-edits"
                        | "full-access";
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "thread.interaction-mode-set";
                    readonly payload: {
                      readonly updatedAt: string;
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      readonly interactionMode: "default" | "plan";
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "thread.message-sent";
                    readonly payload: {
                      readonly streaming: boolean;
                      readonly createdAt: string;
                      readonly updatedAt: string;
                      readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                      readonly role: "user" | "assistant" | "system";
                      readonly text: string;
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      readonly messageId: string & import("effect/Brand").Brand<"MessageId">;
                      readonly attachments?:
                        | readonly {
                            readonly id: string;
                            readonly name: string;
                            readonly type: "image";
                            readonly mimeType: string;
                            readonly sizeBytes: number;
                          }[]
                        | undefined;
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "thread.turn-start-requested";
                    readonly payload: {
                      readonly createdAt: string;
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      readonly runtimeMode:
                        | "approval-required"
                        | "auto-accept-edits"
                        | "full-access";
                      readonly interactionMode: "default" | "plan";
                      readonly messageId: string & import("effect/Brand").Brand<"MessageId">;
                      readonly sourceProposedPlan?:
                        | {
                            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                            readonly planId: string;
                          }
                        | undefined;
                      readonly modelSelection?:
                        | {
                            readonly provider: "codex";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                              readonly fastMode?: boolean | undefined;
                            };
                          }
                        | {
                            readonly provider: "gemini";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                              readonly thinkingBudget?: number | undefined;
                            };
                          }
                        | {
                            readonly provider: "claudeAgent";
                            readonly model: string;
                            readonly options?: {
                              readonly fastMode?: boolean | undefined;
                              readonly thinking?: boolean | undefined;
                              readonly effort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | "max"
                                | "ultrathink"
                                | undefined;
                              readonly contextWindow?: string | undefined;
                            };
                          }
                        | {
                            readonly provider: "opencode";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                            };
                          }
                        | {
                            readonly provider: "copilotAgent";
                            readonly model: string;
                            readonly options?: {
                              readonly reasoningEffort?:
                                | "xhigh"
                                | "high"
                                | "medium"
                                | "low"
                                | undefined;
                            };
                          }
                        | undefined;
                      readonly providerOptions?:
                        | {
                            readonly codex?:
                              | {
                                  readonly homePath?: string | undefined;
                                  readonly binaryPath?: string | undefined;
                                }
                              | undefined;
                            readonly gemini?:
                              | {
                                  readonly homePath?: string | undefined;
                                  readonly binaryPath?: string | undefined;
                                }
                              | undefined;
                            readonly claudeAgent?:
                              | {
                                  readonly binaryPath?: string | undefined;
                                  readonly permissionMode?: string | undefined;
                                  readonly maxThinkingTokens?: number | undefined;
                                }
                              | undefined;
                            readonly opencode?:
                              | {
                                  readonly binaryPath?: string | undefined;
                                  readonly apiKey?: string | undefined;
                                }
                              | undefined;
                            readonly copilotAgent?:
                              | {
                                  readonly binaryPath?: string | undefined;
                                }
                              | undefined;
                          }
                        | undefined;
                      readonly assistantDeliveryMode?: "buffered" | "streaming" | undefined;
                      readonly titleSeed?: string | undefined;
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "thread.turn-interrupt-requested";
                    readonly payload: {
                      readonly createdAt: string;
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      readonly turnId?:
                        | (string & import("effect/Brand").Brand<"TurnId">)
                        | undefined;
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "thread.approval-response-requested";
                    readonly payload: {
                      readonly createdAt: string;
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      readonly requestId: string &
                        import("effect/Brand").Brand<"ApprovalRequestId">;
                      readonly decision: "accept" | "acceptForSession" | "decline" | "cancel";
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "thread.user-input-response-requested";
                    readonly payload: {
                      readonly createdAt: string;
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      readonly requestId: string &
                        import("effect/Brand").Brand<"ApprovalRequestId">;
                      readonly answers: {
                        readonly [x: string]: unknown;
                      };
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "thread.checkpoint-revert-requested";
                    readonly payload: {
                      readonly createdAt: string;
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      readonly turnCount: number;
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "thread.reverted";
                    readonly payload: {
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      readonly turnCount: number;
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "thread.session-stop-requested";
                    readonly payload: {
                      readonly createdAt: string;
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "thread.session-set";
                    readonly payload: {
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      readonly session: {
                        readonly status:
                          | "ready"
                          | "error"
                          | "idle"
                          | "starting"
                          | "running"
                          | "interrupted"
                          | "stopped";
                        readonly updatedAt: string;
                        readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                        readonly providerName: string | null;
                        readonly runtimeMode:
                          | "approval-required"
                          | "auto-accept-edits"
                          | "full-access";
                        readonly activeTurnId:
                          | (string & import("effect/Brand").Brand<"TurnId">)
                          | null;
                        readonly lastError: string | null;
                      };
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "thread.proposed-plan-upserted";
                    readonly payload: {
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      readonly proposedPlan: {
                        readonly id: string;
                        readonly createdAt: string;
                        readonly updatedAt: string;
                        readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                        readonly implementedAt: string | null;
                        readonly implementationThreadId:
                          | (string & import("effect/Brand").Brand<"ThreadId">)
                          | null;
                        readonly planMarkdown: string;
                      };
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "thread.turn-diff-completed";
                    readonly payload: {
                      readonly status: "ready" | "error" | "missing";
                      readonly turnId: string & import("effect/Brand").Brand<"TurnId">;
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      readonly files: readonly {
                        readonly kind: string;
                        readonly path: string;
                        readonly additions: number;
                        readonly deletions: number;
                      }[];
                      readonly assistantMessageId:
                        | (string & import("effect/Brand").Brand<"MessageId">)
                        | null;
                      readonly checkpointTurnCount: number;
                      readonly checkpointRef: string &
                        import("effect/Brand").Brand<"CheckpointRef">;
                      readonly completedAt: string;
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  }
                | {
                    readonly type: "thread.activity-appended";
                    readonly payload: {
                      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                      readonly activity: {
                        readonly kind: string;
                        readonly id: string & import("effect/Brand").Brand<"EventId">;
                        readonly payload: unknown;
                        readonly createdAt: string;
                        readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                        readonly tone: "thinking" | "error" | "info" | "tool" | "approval";
                        readonly summary: string;
                        readonly sequence?: number | undefined;
                      };
                    };
                    readonly sequence: number;
                    readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                    readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                    readonly aggregateKind: "project" | "thread";
                    readonly aggregateId:
                      | (string & import("effect/Brand").Brand<"ProjectId">)
                      | (string & import("effect/Brand").Brand<"ThreadId">);
                    readonly occurredAt: string;
                    readonly causationEventId:
                      | (string & import("effect/Brand").Brand<"EventId">)
                      | null;
                    readonly correlationId:
                      | (string & import("effect/Brand").Brand<"CommandId">)
                      | null;
                    readonly metadata: {
                      readonly requestId?:
                        | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                        | undefined;
                      readonly providerTurnId?: string | undefined;
                      readonly providerItemId?:
                        | (string & import("effect/Brand").Brand<"ProviderItemId">)
                        | undefined;
                      readonly adapterKey?: string | undefined;
                      readonly ingestedAt?: string | undefined;
                    };
                  };
            },
          | import("@t3tools/contracts").OrchestrationGetSnapshotError
          | import("effect/unstable/rpc/RpcClientError").RpcClientError,
          never
        >;
    readonly subscribeTerminalEvents: <
      const AsQueue extends boolean = false,
      const Discard = false,
    >(
      input: {},
      options?:
        | {
            readonly asQueue?: AsQueue | undefined;
            readonly streamBufferSize?: number | undefined;
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
          }
        | undefined,
    ) => AsQueue extends true
      ? Effect.Effect<
          import("effect/Queue").Dequeue<
            | {
                readonly type: "started";
                readonly snapshot: {
                  readonly status: "error" | "starting" | "running" | "exited";
                  readonly cwd: string;
                  readonly updatedAt: string;
                  readonly threadId: string;
                  readonly worktreePath: string | null;
                  readonly exitCode: number | null;
                  readonly terminalId: string;
                  readonly pid: number | null;
                  readonly exitSignal: number | null;
                  readonly history: string;
                };
                readonly createdAt: string;
                readonly threadId: string;
                readonly terminalId: string;
              }
            | {
                readonly type: "output";
                readonly createdAt: string;
                readonly threadId: string;
                readonly terminalId: string;
                readonly data: string;
              }
            | {
                readonly type: "exited";
                readonly createdAt: string;
                readonly threadId: string;
                readonly exitCode: number | null;
                readonly terminalId: string;
                readonly exitSignal: number | null;
              }
            | {
                readonly message: string;
                readonly type: "error";
                readonly createdAt: string;
                readonly threadId: string;
                readonly terminalId: string;
              }
            | {
                readonly type: "cleared";
                readonly createdAt: string;
                readonly threadId: string;
                readonly terminalId: string;
              }
            | {
                readonly type: "restarted";
                readonly snapshot: {
                  readonly status: "error" | "starting" | "running" | "exited";
                  readonly cwd: string;
                  readonly updatedAt: string;
                  readonly threadId: string;
                  readonly worktreePath: string | null;
                  readonly exitCode: number | null;
                  readonly terminalId: string;
                  readonly pid: number | null;
                  readonly exitSignal: number | null;
                  readonly history: string;
                };
                readonly createdAt: string;
                readonly threadId: string;
                readonly terminalId: string;
              }
            | {
                readonly type: "activity";
                readonly createdAt: string;
                readonly threadId: string;
                readonly terminalId: string;
                readonly hasRunningSubprocess: boolean;
              },
            | import("effect/unstable/rpc/RpcClientError").RpcClientError
            | import("effect/Cause").Done<void>
          >,
          never,
          import("effect/Scope").Scope
        >
      : import("effect/Stream").Stream<
          | {
              readonly type: "started";
              readonly snapshot: {
                readonly status: "error" | "starting" | "running" | "exited";
                readonly cwd: string;
                readonly updatedAt: string;
                readonly threadId: string;
                readonly worktreePath: string | null;
                readonly exitCode: number | null;
                readonly terminalId: string;
                readonly pid: number | null;
                readonly exitSignal: number | null;
                readonly history: string;
              };
              readonly createdAt: string;
              readonly threadId: string;
              readonly terminalId: string;
            }
          | {
              readonly type: "output";
              readonly createdAt: string;
              readonly threadId: string;
              readonly terminalId: string;
              readonly data: string;
            }
          | {
              readonly type: "exited";
              readonly createdAt: string;
              readonly threadId: string;
              readonly exitCode: number | null;
              readonly terminalId: string;
              readonly exitSignal: number | null;
            }
          | {
              readonly message: string;
              readonly type: "error";
              readonly createdAt: string;
              readonly threadId: string;
              readonly terminalId: string;
            }
          | {
              readonly type: "cleared";
              readonly createdAt: string;
              readonly threadId: string;
              readonly terminalId: string;
            }
          | {
              readonly type: "restarted";
              readonly snapshot: {
                readonly status: "error" | "starting" | "running" | "exited";
                readonly cwd: string;
                readonly updatedAt: string;
                readonly threadId: string;
                readonly worktreePath: string | null;
                readonly exitCode: number | null;
                readonly terminalId: string;
                readonly pid: number | null;
                readonly exitSignal: number | null;
                readonly history: string;
              };
              readonly createdAt: string;
              readonly threadId: string;
              readonly terminalId: string;
            }
          | {
              readonly type: "activity";
              readonly createdAt: string;
              readonly threadId: string;
              readonly terminalId: string;
              readonly hasRunningSubprocess: boolean;
            },
          import("effect/unstable/rpc/RpcClientError").RpcClientError,
          never
        >;
    readonly subscribeServerConfig: <const AsQueue extends boolean = false, const Discard = false>(
      input: {},
      options?:
        | {
            readonly asQueue?: AsQueue | undefined;
            readonly streamBufferSize?: number | undefined;
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
          }
        | undefined,
    ) => AsQueue extends true
      ? Effect.Effect<
          import("effect/Queue").Dequeue<
            | {
                readonly type: "snapshot";
                readonly version: 1;
                readonly config: {
                  readonly auth: {
                    readonly bootstrapMethods: readonly ("desktop-bootstrap" | "one-time-token")[];
                    readonly sessionMethods: readonly (
                      | "browser-session-cookie"
                      | "bearer-session-token"
                    )[];
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
                    readonly status: "ready" | "warning" | "error" | "disabled";
                    readonly enabled: boolean;
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
                    readonly slashCommands: readonly {
                      readonly name: string;
                      readonly description?: string | undefined;
                      readonly input?:
                        | {
                            readonly hint: string;
                          }
                        | undefined;
                    }[];
                    readonly skills: readonly {
                      readonly name: string;
                      readonly path: string;
                      readonly enabled: boolean;
                      readonly description?: string | undefined;
                      readonly scope?: string | undefined;
                      readonly displayName?: string | undefined;
                      readonly shortDescription?: string | undefined;
                    }[];
                    readonly provider:
                      | "codex"
                      | "gemini"
                      | "claudeAgent"
                      | "opencode"
                      | "copilotAgent";
                    readonly installed: boolean;
                    readonly auth: {
                      readonly status: "authenticated" | "unauthenticated" | "unknown";
                      readonly label?: string | undefined;
                      readonly type?: string | undefined;
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
                    readonly label: string;
                    readonly capabilities: {
                      readonly repositoryIdentity: boolean;
                    };
                    readonly environmentId: string & import("effect/Brand").Brand<"EnvironmentId">;
                    readonly platform: {
                      readonly os: "unknown" | "darwin" | "linux" | "windows";
                      readonly arch: "arm64" | "x64" | "other";
                    };
                    readonly serverVersion: string;
                  };
                  readonly cwd: string;
                  readonly keybindingsConfigPath: string;
                  readonly keybindings: readonly {
                    readonly command:
                      | "terminal.toggle"
                      | "terminal.split"
                      | "terminal.new"
                      | "terminal.close"
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
                          readonly name: string;
                          readonly type: "identifier";
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
                  readonly settings: {
                    readonly enableAssistantStreaming: boolean;
                    readonly defaultThreadEnvMode: "local" | "worktree";
                    readonly addProjectBaseDirectory: string;
                    readonly textGenerationModelSelection:
                      | {
                          readonly provider: "codex";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
                            readonly fastMode?: boolean | undefined;
                          };
                        }
                      | {
                          readonly provider: "gemini";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
                            readonly thinkingBudget?: number | undefined;
                          };
                        }
                      | {
                          readonly provider: "claudeAgent";
                          readonly model: string;
                          readonly options?: {
                            readonly fastMode?: boolean | undefined;
                            readonly thinking?: boolean | undefined;
                            readonly effort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | "max"
                              | "ultrathink"
                              | undefined;
                            readonly contextWindow?: string | undefined;
                          };
                        }
                      | {
                          readonly provider: "opencode";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
                          };
                        }
                      | {
                          readonly provider: "copilotAgent";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
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
                        readonly launchArgs: string;
                      };
                      readonly opencode: {
                        readonly enabled: boolean;
                        readonly customModels: readonly string[];
                        readonly binaryPath: string;
                        readonly apiKey: string;
                      };
                      readonly copilotAgent: {
                        readonly enabled: boolean;
                        readonly customModels: readonly string[];
                        readonly binaryPath: string;
                      };
                    };
                    readonly observability: {
                      readonly otlpTracesUrl: string;
                      readonly otlpMetricsUrl: string;
                    };
                  };
                };
              }
            | {
                readonly type: "keybindingsUpdated";
                readonly version: 1;
                readonly payload: {
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
                };
              }
            | {
                readonly type: "providerStatuses";
                readonly version: 1;
                readonly payload: {
                  readonly providers: readonly {
                    readonly status: "ready" | "warning" | "error" | "disabled";
                    readonly enabled: boolean;
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
                    readonly slashCommands: readonly {
                      readonly name: string;
                      readonly description?: string | undefined;
                      readonly input?:
                        | {
                            readonly hint: string;
                          }
                        | undefined;
                    }[];
                    readonly skills: readonly {
                      readonly name: string;
                      readonly path: string;
                      readonly enabled: boolean;
                      readonly description?: string | undefined;
                      readonly scope?: string | undefined;
                      readonly displayName?: string | undefined;
                      readonly shortDescription?: string | undefined;
                    }[];
                    readonly provider:
                      | "codex"
                      | "gemini"
                      | "claudeAgent"
                      | "opencode"
                      | "copilotAgent";
                    readonly installed: boolean;
                    readonly auth: {
                      readonly status: "authenticated" | "unauthenticated" | "unknown";
                      readonly label?: string | undefined;
                      readonly type?: string | undefined;
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
                };
              }
            | {
                readonly type: "settingsUpdated";
                readonly version: 1;
                readonly payload: {
                  readonly settings: {
                    readonly enableAssistantStreaming: boolean;
                    readonly defaultThreadEnvMode: "local" | "worktree";
                    readonly addProjectBaseDirectory: string;
                    readonly textGenerationModelSelection:
                      | {
                          readonly provider: "codex";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
                            readonly fastMode?: boolean | undefined;
                          };
                        }
                      | {
                          readonly provider: "gemini";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
                            readonly thinkingBudget?: number | undefined;
                          };
                        }
                      | {
                          readonly provider: "claudeAgent";
                          readonly model: string;
                          readonly options?: {
                            readonly fastMode?: boolean | undefined;
                            readonly thinking?: boolean | undefined;
                            readonly effort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | "max"
                              | "ultrathink"
                              | undefined;
                            readonly contextWindow?: string | undefined;
                          };
                        }
                      | {
                          readonly provider: "opencode";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
                          };
                        }
                      | {
                          readonly provider: "copilotAgent";
                          readonly model: string;
                          readonly options?: {
                            readonly reasoningEffort?:
                              | "xhigh"
                              | "high"
                              | "medium"
                              | "low"
                              | undefined;
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
                        readonly launchArgs: string;
                      };
                      readonly opencode: {
                        readonly enabled: boolean;
                        readonly customModels: readonly string[];
                        readonly binaryPath: string;
                        readonly apiKey: string;
                      };
                      readonly copilotAgent: {
                        readonly enabled: boolean;
                        readonly customModels: readonly string[];
                        readonly binaryPath: string;
                      };
                    };
                    readonly observability: {
                      readonly otlpTracesUrl: string;
                      readonly otlpMetricsUrl: string;
                    };
                  };
                };
              },
            | import("@t3tools/contracts").ServerSettingsError
            | import("@t3tools/contracts").KeybindingsConfigError
            | import("effect/unstable/rpc/RpcClientError").RpcClientError
            | import("effect/Cause").Done<void>
          >,
          never,
          import("effect/Scope").Scope
        >
      : import("effect/Stream").Stream<
          | {
              readonly type: "snapshot";
              readonly version: 1;
              readonly config: {
                readonly auth: {
                  readonly bootstrapMethods: readonly ("desktop-bootstrap" | "one-time-token")[];
                  readonly sessionMethods: readonly (
                    | "browser-session-cookie"
                    | "bearer-session-token"
                  )[];
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
                  readonly status: "ready" | "warning" | "error" | "disabled";
                  readonly enabled: boolean;
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
                  readonly slashCommands: readonly {
                    readonly name: string;
                    readonly description?: string | undefined;
                    readonly input?:
                      | {
                          readonly hint: string;
                        }
                      | undefined;
                  }[];
                  readonly skills: readonly {
                    readonly name: string;
                    readonly path: string;
                    readonly enabled: boolean;
                    readonly description?: string | undefined;
                    readonly scope?: string | undefined;
                    readonly displayName?: string | undefined;
                    readonly shortDescription?: string | undefined;
                  }[];
                  readonly provider:
                    | "codex"
                    | "gemini"
                    | "claudeAgent"
                    | "opencode"
                    | "copilotAgent";
                  readonly installed: boolean;
                  readonly auth: {
                    readonly status: "authenticated" | "unauthenticated" | "unknown";
                    readonly label?: string | undefined;
                    readonly type?: string | undefined;
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
                  readonly label: string;
                  readonly capabilities: {
                    readonly repositoryIdentity: boolean;
                  };
                  readonly environmentId: string & import("effect/Brand").Brand<"EnvironmentId">;
                  readonly platform: {
                    readonly os: "unknown" | "darwin" | "linux" | "windows";
                    readonly arch: "arm64" | "x64" | "other";
                  };
                  readonly serverVersion: string;
                };
                readonly cwd: string;
                readonly keybindingsConfigPath: string;
                readonly keybindings: readonly {
                  readonly command:
                    | "terminal.toggle"
                    | "terminal.split"
                    | "terminal.new"
                    | "terminal.close"
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
                        readonly name: string;
                        readonly type: "identifier";
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
                readonly settings: {
                  readonly enableAssistantStreaming: boolean;
                  readonly defaultThreadEnvMode: "local" | "worktree";
                  readonly addProjectBaseDirectory: string;
                  readonly textGenerationModelSelection:
                    | {
                        readonly provider: "codex";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly fastMode?: boolean | undefined;
                        };
                      }
                    | {
                        readonly provider: "gemini";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly thinkingBudget?: number | undefined;
                        };
                      }
                    | {
                        readonly provider: "claudeAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly fastMode?: boolean | undefined;
                          readonly thinking?: boolean | undefined;
                          readonly effort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | "max"
                            | "ultrathink"
                            | undefined;
                          readonly contextWindow?: string | undefined;
                        };
                      }
                    | {
                        readonly provider: "opencode";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      }
                    | {
                        readonly provider: "copilotAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
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
                      readonly launchArgs: string;
                    };
                    readonly opencode: {
                      readonly enabled: boolean;
                      readonly customModels: readonly string[];
                      readonly binaryPath: string;
                      readonly apiKey: string;
                    };
                    readonly copilotAgent: {
                      readonly enabled: boolean;
                      readonly customModels: readonly string[];
                      readonly binaryPath: string;
                    };
                  };
                  readonly observability: {
                    readonly otlpTracesUrl: string;
                    readonly otlpMetricsUrl: string;
                  };
                };
              };
            }
          | {
              readonly type: "keybindingsUpdated";
              readonly version: 1;
              readonly payload: {
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
              };
            }
          | {
              readonly type: "providerStatuses";
              readonly version: 1;
              readonly payload: {
                readonly providers: readonly {
                  readonly status: "ready" | "warning" | "error" | "disabled";
                  readonly enabled: boolean;
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
                  readonly slashCommands: readonly {
                    readonly name: string;
                    readonly description?: string | undefined;
                    readonly input?:
                      | {
                          readonly hint: string;
                        }
                      | undefined;
                  }[];
                  readonly skills: readonly {
                    readonly name: string;
                    readonly path: string;
                    readonly enabled: boolean;
                    readonly description?: string | undefined;
                    readonly scope?: string | undefined;
                    readonly displayName?: string | undefined;
                    readonly shortDescription?: string | undefined;
                  }[];
                  readonly provider:
                    | "codex"
                    | "gemini"
                    | "claudeAgent"
                    | "opencode"
                    | "copilotAgent";
                  readonly installed: boolean;
                  readonly auth: {
                    readonly status: "authenticated" | "unauthenticated" | "unknown";
                    readonly label?: string | undefined;
                    readonly type?: string | undefined;
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
              };
            }
          | {
              readonly type: "settingsUpdated";
              readonly version: 1;
              readonly payload: {
                readonly settings: {
                  readonly enableAssistantStreaming: boolean;
                  readonly defaultThreadEnvMode: "local" | "worktree";
                  readonly addProjectBaseDirectory: string;
                  readonly textGenerationModelSelection:
                    | {
                        readonly provider: "codex";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly fastMode?: boolean | undefined;
                        };
                      }
                    | {
                        readonly provider: "gemini";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                          readonly thinkingBudget?: number | undefined;
                        };
                      }
                    | {
                        readonly provider: "claudeAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly fastMode?: boolean | undefined;
                          readonly thinking?: boolean | undefined;
                          readonly effort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | "max"
                            | "ultrathink"
                            | undefined;
                          readonly contextWindow?: string | undefined;
                        };
                      }
                    | {
                        readonly provider: "opencode";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
                        };
                      }
                    | {
                        readonly provider: "copilotAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly reasoningEffort?:
                            | "xhigh"
                            | "high"
                            | "medium"
                            | "low"
                            | undefined;
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
                      readonly launchArgs: string;
                    };
                    readonly opencode: {
                      readonly enabled: boolean;
                      readonly customModels: readonly string[];
                      readonly binaryPath: string;
                      readonly apiKey: string;
                    };
                    readonly copilotAgent: {
                      readonly enabled: boolean;
                      readonly customModels: readonly string[];
                      readonly binaryPath: string;
                    };
                  };
                  readonly observability: {
                    readonly otlpTracesUrl: string;
                    readonly otlpMetricsUrl: string;
                  };
                };
              };
            },
          | import("@t3tools/contracts").ServerSettingsError
          | import("@t3tools/contracts").KeybindingsConfigError
          | import("effect/unstable/rpc/RpcClientError").RpcClientError,
          never
        >;
    readonly subscribeServerLifecycle: <
      const AsQueue extends boolean = false,
      const Discard = false,
    >(
      input: {},
      options?:
        | {
            readonly asQueue?: AsQueue | undefined;
            readonly streamBufferSize?: number | undefined;
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
          }
        | undefined,
    ) => AsQueue extends true
      ? Effect.Effect<
          import("effect/Queue").Dequeue<
            | {
                readonly type: "welcome";
                readonly version: 1;
                readonly payload: {
                  readonly environment: {
                    readonly label: string;
                    readonly capabilities: {
                      readonly repositoryIdentity: boolean;
                    };
                    readonly environmentId: string & import("effect/Brand").Brand<"EnvironmentId">;
                    readonly platform: {
                      readonly os: "unknown" | "darwin" | "linux" | "windows";
                      readonly arch: "arm64" | "x64" | "other";
                    };
                    readonly serverVersion: string;
                  };
                  readonly cwd: string;
                  readonly projectName: string;
                  readonly bootstrapProjectId?:
                    | (string & import("effect/Brand").Brand<"ProjectId">)
                    | undefined;
                  readonly bootstrapThreadId?:
                    | (string & import("effect/Brand").Brand<"ThreadId">)
                    | undefined;
                };
                readonly sequence: number;
              }
            | {
                readonly type: "ready";
                readonly version: 1;
                readonly payload: {
                  readonly at: string;
                  readonly environment: {
                    readonly label: string;
                    readonly capabilities: {
                      readonly repositoryIdentity: boolean;
                    };
                    readonly environmentId: string & import("effect/Brand").Brand<"EnvironmentId">;
                    readonly platform: {
                      readonly os: "unknown" | "darwin" | "linux" | "windows";
                      readonly arch: "arm64" | "x64" | "other";
                    };
                    readonly serverVersion: string;
                  };
                };
                readonly sequence: number;
              },
            | import("effect/unstable/rpc/RpcClientError").RpcClientError
            | import("effect/Cause").Done<void>
          >,
          never,
          import("effect/Scope").Scope
        >
      : import("effect/Stream").Stream<
          | {
              readonly type: "welcome";
              readonly version: 1;
              readonly payload: {
                readonly environment: {
                  readonly label: string;
                  readonly capabilities: {
                    readonly repositoryIdentity: boolean;
                  };
                  readonly environmentId: string & import("effect/Brand").Brand<"EnvironmentId">;
                  readonly platform: {
                    readonly os: "unknown" | "darwin" | "linux" | "windows";
                    readonly arch: "arm64" | "x64" | "other";
                  };
                  readonly serverVersion: string;
                };
                readonly cwd: string;
                readonly projectName: string;
                readonly bootstrapProjectId?:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | undefined;
                readonly bootstrapThreadId?:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | undefined;
              };
              readonly sequence: number;
            }
          | {
              readonly type: "ready";
              readonly version: 1;
              readonly payload: {
                readonly at: string;
                readonly environment: {
                  readonly label: string;
                  readonly capabilities: {
                    readonly repositoryIdentity: boolean;
                  };
                  readonly environmentId: string & import("effect/Brand").Brand<"EnvironmentId">;
                  readonly platform: {
                    readonly os: "unknown" | "darwin" | "linux" | "windows";
                    readonly arch: "arm64" | "x64" | "other";
                  };
                  readonly serverVersion: string;
                };
              };
              readonly sequence: number;
            },
          import("effect/unstable/rpc/RpcClientError").RpcClientError,
          never
        >;
    readonly subscribeAuthAccess: <const AsQueue extends boolean = false, const Discard = false>(
      input: {},
      options?:
        | {
            readonly asQueue?: AsQueue | undefined;
            readonly streamBufferSize?: number | undefined;
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/Context").Context<never> | undefined;
          }
        | undefined,
    ) => AsQueue extends true
      ? Effect.Effect<
          import("effect/Queue").Dequeue<
            | {
                readonly type: "snapshot";
                readonly version: 1;
                readonly payload: {
                  readonly pairingLinks: readonly {
                    readonly id: string;
                    readonly createdAt: import("effect/DateTime").Utc;
                    readonly role: "owner" | "client";
                    readonly credential: string;
                    readonly expiresAt: import("effect/DateTime").Utc;
                    readonly subject: string;
                    readonly label?: string;
                  }[];
                  readonly clientSessions: readonly {
                    readonly role: "owner" | "client";
                    readonly client: {
                      readonly deviceType: "unknown" | "desktop" | "mobile" | "tablet" | "bot";
                      readonly label?: string;
                      readonly os?: string;
                      readonly ipAddress?: string;
                      readonly userAgent?: string;
                      readonly browser?: string;
                    };
                    readonly expiresAt: import("effect/DateTime").Utc;
                    readonly subject: string;
                    readonly lastConnectedAt: import("effect/DateTime").Utc | null;
                    readonly sessionId: string & import("effect/Brand").Brand<"AuthSessionId">;
                    readonly method: "browser-session-cookie" | "bearer-session-token";
                    readonly issuedAt: import("effect/DateTime").Utc;
                    readonly connected: boolean;
                    readonly current: boolean;
                  }[];
                };
                readonly revision: number;
              }
            | {
                readonly type: "pairingLinkUpserted";
                readonly version: 1;
                readonly payload: {
                  readonly id: string;
                  readonly createdAt: import("effect/DateTime").Utc;
                  readonly role: "owner" | "client";
                  readonly credential: string;
                  readonly expiresAt: import("effect/DateTime").Utc;
                  readonly subject: string;
                  readonly label?: string;
                };
                readonly revision: number;
              }
            | {
                readonly type: "pairingLinkRemoved";
                readonly version: 1;
                readonly payload: {
                  readonly id: string;
                };
                readonly revision: number;
              }
            | {
                readonly type: "clientUpserted";
                readonly version: 1;
                readonly payload: {
                  readonly role: "owner" | "client";
                  readonly client: {
                    readonly deviceType: "unknown" | "desktop" | "mobile" | "tablet" | "bot";
                    readonly label?: string;
                    readonly os?: string;
                    readonly ipAddress?: string;
                    readonly userAgent?: string;
                    readonly browser?: string;
                  };
                  readonly expiresAt: import("effect/DateTime").Utc;
                  readonly subject: string;
                  readonly lastConnectedAt: import("effect/DateTime").Utc | null;
                  readonly sessionId: string & import("effect/Brand").Brand<"AuthSessionId">;
                  readonly method: "browser-session-cookie" | "bearer-session-token";
                  readonly issuedAt: import("effect/DateTime").Utc;
                  readonly connected: boolean;
                  readonly current: boolean;
                };
                readonly revision: number;
              }
            | {
                readonly type: "clientRemoved";
                readonly version: 1;
                readonly payload: {
                  readonly sessionId: string & import("effect/Brand").Brand<"AuthSessionId">;
                };
                readonly revision: number;
              },
            | import("effect/unstable/rpc/RpcClientError").RpcClientError
            | import("effect/Cause").Done<void>
          >,
          never,
          import("effect/Scope").Scope
        >
      : import("effect/Stream").Stream<
          | {
              readonly type: "snapshot";
              readonly version: 1;
              readonly payload: {
                readonly pairingLinks: readonly {
                  readonly id: string;
                  readonly createdAt: import("effect/DateTime").Utc;
                  readonly role: "owner" | "client";
                  readonly credential: string;
                  readonly expiresAt: import("effect/DateTime").Utc;
                  readonly subject: string;
                  readonly label?: string;
                }[];
                readonly clientSessions: readonly {
                  readonly role: "owner" | "client";
                  readonly client: {
                    readonly deviceType: "unknown" | "desktop" | "mobile" | "tablet" | "bot";
                    readonly label?: string;
                    readonly os?: string;
                    readonly ipAddress?: string;
                    readonly userAgent?: string;
                    readonly browser?: string;
                  };
                  readonly expiresAt: import("effect/DateTime").Utc;
                  readonly subject: string;
                  readonly lastConnectedAt: import("effect/DateTime").Utc | null;
                  readonly sessionId: string & import("effect/Brand").Brand<"AuthSessionId">;
                  readonly method: "browser-session-cookie" | "bearer-session-token";
                  readonly issuedAt: import("effect/DateTime").Utc;
                  readonly connected: boolean;
                  readonly current: boolean;
                }[];
              };
              readonly revision: number;
            }
          | {
              readonly type: "pairingLinkUpserted";
              readonly version: 1;
              readonly payload: {
                readonly id: string;
                readonly createdAt: import("effect/DateTime").Utc;
                readonly role: "owner" | "client";
                readonly credential: string;
                readonly expiresAt: import("effect/DateTime").Utc;
                readonly subject: string;
                readonly label?: string;
              };
              readonly revision: number;
            }
          | {
              readonly type: "pairingLinkRemoved";
              readonly version: 1;
              readonly payload: {
                readonly id: string;
              };
              readonly revision: number;
            }
          | {
              readonly type: "clientUpserted";
              readonly version: 1;
              readonly payload: {
                readonly role: "owner" | "client";
                readonly client: {
                  readonly deviceType: "unknown" | "desktop" | "mobile" | "tablet" | "bot";
                  readonly label?: string;
                  readonly os?: string;
                  readonly ipAddress?: string;
                  readonly userAgent?: string;
                  readonly browser?: string;
                };
                readonly expiresAt: import("effect/DateTime").Utc;
                readonly subject: string;
                readonly lastConnectedAt: import("effect/DateTime").Utc | null;
                readonly sessionId: string & import("effect/Brand").Brand<"AuthSessionId">;
                readonly method: "browser-session-cookie" | "bearer-session-token";
                readonly issuedAt: import("effect/DateTime").Utc;
                readonly connected: boolean;
                readonly current: boolean;
              };
              readonly revision: number;
            }
          | {
              readonly type: "clientRemoved";
              readonly version: 1;
              readonly payload: {
                readonly sessionId: string & import("effect/Brand").Brand<"AuthSessionId">;
              };
              readonly revision: number;
            },
          import("effect/unstable/rpc/RpcClientError").RpcClientError,
          never
        >;
  },
  never,
  import("effect/Scope").Scope | RpcClient.Protocol
>;
type RpcClientFactory = typeof makeWsRpcProtocolClient;
export type WsRpcProtocolClient =
  RpcClientFactory extends Effect.Effect<infer Client, any, any> ? Client : never;
export type WsRpcProtocolSocketUrlProvider = string | (() => Promise<string>);
export declare function createWsRpcProtocolLayer(
  url: WsRpcProtocolSocketUrlProvider,
  handlers?: WsProtocolLifecycleHandlers,
): Layer.Layer<RpcClient.Protocol, never, never>;
export {};
