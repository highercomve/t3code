import { Effect, Layer } from "effect";
import { RpcClient } from "effect/unstable/rpc";
export declare const makeWsRpcProtocolClient: Effect.Effect<
  {
    readonly "server.getConfig": <const AsQueue extends boolean = false, const Discard = false>(
      input: {},
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly providers: readonly {
              readonly provider: "codex" | "gemini" | "claudeAgent" | "opencode" | "copilotAgent";
              readonly enabled: boolean;
              readonly version: string | null;
              readonly status: "error" | "ready" | "warning" | "disabled";
              readonly models: readonly {
                readonly slug: string;
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
                readonly isCustom: boolean;
              }[];
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
            readonly cwd: string;
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
            readonly availableEditors: readonly (
              | "cursor"
              | "trae"
              | "vscode"
              | "vscode-insiders"
              | "vscodium"
              | "zed"
              | "antigravity"
              | "idea"
              | "file-manager"
            )[];
            readonly keybindingsConfigPath: string;
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
                      readonly effort?:
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
              | import("@t3tools/contracts").KeybindingsConfigError
              | import("@t3tools/contracts").ServerSettingsError),
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly providers: readonly {
              readonly provider: "codex" | "gemini" | "claudeAgent" | "opencode" | "copilotAgent";
              readonly enabled: boolean;
              readonly version: string | null;
              readonly status: "error" | "ready" | "warning" | "disabled";
              readonly models: readonly {
                readonly slug: string;
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
                readonly isCustom: boolean;
              }[];
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
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
    readonly "server.getSettings": <const AsQueue extends boolean = false, const Discard = false>(
      input: {},
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
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
                  readonly effort?: "high" | "medium" | "low" | "max" | "ultrathink" | undefined;
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly entries: readonly {
              readonly path: string;
              readonly kind: "file" | "directory";
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true ? void : void,
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true ? never : import("@t3tools/contracts").OpenError),
      never
    >;
    readonly "git.status": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly cwd: string;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly branch: string | null;
            readonly workingTree: {
              readonly files: readonly {
                readonly path: string;
                readonly deletions: number;
                readonly insertions: number;
              }[];
              readonly deletions: number;
              readonly insertions: number;
            };
            readonly pr: {
              readonly number: number;
              readonly title: string;
              readonly state: "open" | "closed" | "merged";
              readonly url: string;
              readonly baseBranch: string;
              readonly headBranch: string;
            } | null;
            readonly isRepo: boolean;
            readonly hasOriginRemote: boolean;
            readonly isDefaultBranch: boolean;
            readonly hasWorkingTreeChanges: boolean;
            readonly hasUpstream: boolean;
            readonly aheadCount: number;
            readonly behindCount: number;
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true
          ? never
          :
              | import("@t3tools/contracts").GitManagerError
              | import("@t3tools/contracts").GitCommandError
              | import("@t3tools/contracts").GitHubCliError
              | import("@t3tools/contracts").TextGenerationError),
      never
    >;
    readonly "git.pull": <const AsQueue extends boolean = false, const Discard = false>(
      input: {
        readonly cwd: string;
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly branch: string;
            readonly status: "skipped_up_to_date" | "pulled";
            readonly upstreamBranch: string | null;
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true ? never : import("@t3tools/contracts").GitCommandError),
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
          }
        | undefined,
    ) => AsQueue extends true
      ? Effect.Effect<
          import("effect/Queue").Dequeue<
            | {
                readonly kind: "action_started";
                readonly cwd: string;
                readonly actionId: string;
                readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
                readonly phases: readonly ("push" | "branch" | "pr" | "commit")[];
              }
            | {
                readonly label: string;
                readonly kind: "phase_started";
                readonly cwd: string;
                readonly actionId: string;
                readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
                readonly phase: "push" | "branch" | "pr" | "commit";
              }
            | {
                readonly kind: "hook_started";
                readonly cwd: string;
                readonly actionId: string;
                readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
                readonly hookName: string;
              }
            | {
                readonly text: string;
                readonly kind: "hook_output";
                readonly cwd: string;
                readonly actionId: string;
                readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
                readonly hookName: string | null;
                readonly stream: "stdout" | "stderr";
              }
            | {
                readonly kind: "hook_finished";
                readonly exitCode: number | null;
                readonly cwd: string;
                readonly actionId: string;
                readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
                readonly hookName: string;
                readonly durationMs: number | null;
              }
            | {
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
                  readonly pr: {
                    readonly status: "created" | "skipped_not_requested" | "opened_existing";
                    readonly number?: number | undefined;
                    readonly title?: string | undefined;
                    readonly url?: string | undefined;
                    readonly baseBranch?: string | undefined;
                    readonly headBranch?: string | undefined;
                  };
                  readonly commit: {
                    readonly status: "created" | "skipped_not_requested" | "skipped_no_changes";
                    readonly commitSha?: string | undefined;
                    readonly subject?: string | undefined;
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
                readonly kind: "action_finished";
                readonly cwd: string;
                readonly actionId: string;
                readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
              }
            | {
                readonly kind: "action_failed";
                readonly cwd: string;
                readonly message: string;
                readonly actionId: string;
                readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
                readonly phase: "push" | "branch" | "pr" | "commit" | null;
              },
            | import("@t3tools/contracts").GitManagerError
            | import("@t3tools/contracts").GitCommandError
            | import("@t3tools/contracts").GitHubCliError
            | import("@t3tools/contracts").TextGenerationError
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
              readonly actionId: string;
              readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
              readonly phases: readonly ("push" | "branch" | "pr" | "commit")[];
            }
          | {
              readonly label: string;
              readonly kind: "phase_started";
              readonly cwd: string;
              readonly actionId: string;
              readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
              readonly phase: "push" | "branch" | "pr" | "commit";
            }
          | {
              readonly kind: "hook_started";
              readonly cwd: string;
              readonly actionId: string;
              readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
              readonly hookName: string;
            }
          | {
              readonly text: string;
              readonly kind: "hook_output";
              readonly cwd: string;
              readonly actionId: string;
              readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
              readonly hookName: string | null;
              readonly stream: "stdout" | "stderr";
            }
          | {
              readonly kind: "hook_finished";
              readonly exitCode: number | null;
              readonly cwd: string;
              readonly actionId: string;
              readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
              readonly hookName: string;
              readonly durationMs: number | null;
            }
          | {
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
                readonly pr: {
                  readonly status: "created" | "skipped_not_requested" | "opened_existing";
                  readonly number?: number | undefined;
                  readonly title?: string | undefined;
                  readonly url?: string | undefined;
                  readonly baseBranch?: string | undefined;
                  readonly headBranch?: string | undefined;
                };
                readonly commit: {
                  readonly status: "created" | "skipped_not_requested" | "skipped_no_changes";
                  readonly commitSha?: string | undefined;
                  readonly subject?: string | undefined;
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
              readonly kind: "action_finished";
              readonly cwd: string;
              readonly actionId: string;
              readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
            }
          | {
              readonly kind: "action_failed";
              readonly cwd: string;
              readonly message: string;
              readonly actionId: string;
              readonly action: "push" | "commit" | "create_pr" | "commit_push" | "commit_push_pr";
              readonly phase: "push" | "branch" | "pr" | "commit" | null;
            },
          | import("@t3tools/contracts").GitManagerError
          | import("@t3tools/contracts").GitCommandError
          | import("@t3tools/contracts").GitHubCliError
          | import("@t3tools/contracts").TextGenerationError
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
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
              readonly url: string;
              readonly baseBranch: string;
              readonly headBranch: string;
            };
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true
          ? never
          :
              | import("@t3tools/contracts").GitManagerError
              | import("@t3tools/contracts").GitCommandError
              | import("@t3tools/contracts").GitHubCliError
              | import("@t3tools/contracts").TextGenerationError),
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
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
              readonly url: string;
              readonly baseBranch: string;
              readonly headBranch: string;
            };
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true
          ? never
          :
              | import("@t3tools/contracts").GitManagerError
              | import("@t3tools/contracts").GitCommandError
              | import("@t3tools/contracts").GitHubCliError
              | import("@t3tools/contracts").TextGenerationError),
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly body: string;
            readonly subject: string;
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true
          ? never
          :
              | import("@t3tools/contracts").GitManagerError
              | import("@t3tools/contracts").GitCommandError
              | import("@t3tools/contracts").GitHubCliError
              | import("@t3tools/contracts").TextGenerationError),
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly branches: readonly {
              readonly name: string;
              readonly worktreePath: string | null;
              readonly current: boolean;
              readonly isDefault: boolean;
              readonly isRemote?: boolean | undefined;
              readonly remoteName?: string | undefined;
            }[];
            readonly isRepo: boolean;
            readonly hasOriginRemote: boolean;
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
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
      },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true ? void : void,
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true ? void : void,
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly history: string;
            readonly threadId: string;
            readonly terminalId: string;
            readonly worktreePath: string | null;
            readonly updatedAt: string;
            readonly status: "running" | "error" | "starting" | "exited";
            readonly pid: number | null;
            readonly exitCode: number | null;
            readonly exitSignal: number | null;
            readonly cwd: string;
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly history: string;
            readonly threadId: string;
            readonly terminalId: string;
            readonly worktreePath: string | null;
            readonly updatedAt: string;
            readonly status: "running" | "error" | "starting" | "exited";
            readonly pid: number | null;
            readonly exitCode: number | null;
            readonly exitSignal: number | null;
            readonly cwd: string;
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
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
    readonly subscribeOrchestrationDomainEvents: <
      const AsQueue extends boolean = false,
      const Discard = false,
    >(
      input: {},
      options?:
        | {
            readonly asQueue?: AsQueue | undefined;
            readonly streamBufferSize?: number | undefined;
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
          }
        | undefined,
    ) => AsQueue extends true
      ? Effect.Effect<
          import("effect/Queue").Dequeue<
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "project.created";
                readonly sequence: number;
                readonly payload: {
                  readonly scripts: readonly {
                    readonly id: string;
                    readonly name: string;
                    readonly command: string;
                    readonly icon: "play" | "test" | "lint" | "configure" | "build" | "debug";
                    readonly runOnWorktreeCreate: boolean;
                  }[];
                  readonly title: string;
                  readonly createdAt: string;
                  readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
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
                  readonly workspaceRoot: string;
                  readonly updatedAt: string;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "project.meta-updated";
                readonly sequence: number;
                readonly payload: {
                  readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                  readonly updatedAt: string;
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
                  readonly workspaceRoot?: string | undefined;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "project.deleted";
                readonly sequence: number;
                readonly payload: {
                  readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                  readonly deletedAt: string;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.created";
                readonly sequence: number;
                readonly payload: {
                  readonly title: string;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly createdAt: string;
                  readonly runtimeMode: "approval-required" | "full-access";
                  readonly interactionMode: "default" | "plan";
                  readonly branch: string | null;
                  readonly worktreePath: string | null;
                  readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                  readonly updatedAt: string;
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
                        };
                      }
                    | {
                        readonly provider: "claudeAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly fastMode?: boolean | undefined;
                          readonly thinking?: boolean | undefined;
                          readonly effort?:
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
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.deleted";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly deletedAt: string;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.archived";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly updatedAt: string;
                  readonly archivedAt: string;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.unarchived";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly updatedAt: string;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.meta-updated";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly updatedAt: string;
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
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.runtime-mode-set";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly runtimeMode: "approval-required" | "full-access";
                  readonly updatedAt: string;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.interaction-mode-set";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly interactionMode: "default" | "plan";
                  readonly updatedAt: string;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.message-sent";
                readonly sequence: number;
                readonly payload: {
                  readonly text: string;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly createdAt: string;
                  readonly updatedAt: string;
                  readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                  readonly role: "system" | "user" | "assistant";
                  readonly streaming: boolean;
                  readonly messageId: string & import("effect/Brand").Brand<"MessageId">;
                  readonly attachments?:
                    | readonly {
                        readonly id: string;
                        readonly name: string;
                        readonly mimeType: string;
                        readonly sizeBytes: number;
                        readonly type: "image";
                      }[]
                    | undefined;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.turn-start-requested";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly createdAt: string;
                  readonly runtimeMode: "approval-required" | "full-access";
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
                  readonly assistantDeliveryMode?: "streaming" | "buffered" | undefined;
                  readonly titleSeed?: string | undefined;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.turn-interrupt-requested";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly createdAt: string;
                  readonly turnId?: (string & import("effect/Brand").Brand<"TurnId">) | undefined;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.approval-response-requested";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly createdAt: string;
                  readonly requestId: string & import("effect/Brand").Brand<"ApprovalRequestId">;
                  readonly decision: "accept" | "acceptForSession" | "decline" | "cancel";
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.user-input-response-requested";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly createdAt: string;
                  readonly requestId: string & import("effect/Brand").Brand<"ApprovalRequestId">;
                  readonly answers: {
                    readonly [x: string]: unknown;
                  };
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.checkpoint-revert-requested";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly createdAt: string;
                  readonly turnCount: number;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.reverted";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly turnCount: number;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.session-stop-requested";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly createdAt: string;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.session-set";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly session: {
                    readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                    readonly runtimeMode: "approval-required" | "full-access";
                    readonly updatedAt: string;
                    readonly status:
                      | "running"
                      | "interrupted"
                      | "error"
                      | "ready"
                      | "idle"
                      | "starting"
                      | "stopped";
                    readonly providerName: string | null;
                    readonly activeTurnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                    readonly lastError: string | null;
                  };
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.proposed-plan-upserted";
                readonly sequence: number;
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
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.turn-diff-completed";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly completedAt: string;
                  readonly assistantMessageId:
                    | (string & import("effect/Brand").Brand<"MessageId">)
                    | null;
                  readonly turnId: string & import("effect/Brand").Brand<"TurnId">;
                  readonly files: readonly {
                    readonly path: string;
                    readonly kind: string;
                    readonly additions: number;
                    readonly deletions: number;
                  }[];
                  readonly checkpointTurnCount: number;
                  readonly checkpointRef: string & import("effect/Brand").Brand<"CheckpointRef">;
                  readonly status: "error" | "ready" | "missing";
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.activity-appended";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly activity: {
                    readonly id: string & import("effect/Brand").Brand<"EventId">;
                    readonly summary: string;
                    readonly createdAt: string;
                    readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                    readonly tone: "error" | "info" | "tool" | "approval";
                    readonly kind: string;
                    readonly payload: unknown;
                    readonly sequence?: number | undefined;
                  };
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              },
            | import("effect/unstable/rpc/RpcClientError").RpcClientError
            | import("effect/Cause").Done<void>
          >,
          never,
          import("effect/Scope").Scope
        >
      : import("effect/Stream").Stream<
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "project.created";
              readonly sequence: number;
              readonly payload: {
                readonly scripts: readonly {
                  readonly id: string;
                  readonly name: string;
                  readonly command: string;
                  readonly icon: "play" | "test" | "lint" | "configure" | "build" | "debug";
                  readonly runOnWorktreeCreate: boolean;
                }[];
                readonly title: string;
                readonly createdAt: string;
                readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
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
                readonly workspaceRoot: string;
                readonly updatedAt: string;
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "project.meta-updated";
              readonly sequence: number;
              readonly payload: {
                readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                readonly updatedAt: string;
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
                      };
                    }
                  | {
                      readonly provider: "claudeAgent";
                      readonly model: string;
                      readonly options?: {
                        readonly fastMode?: boolean | undefined;
                        readonly thinking?: boolean | undefined;
                        readonly effort?:
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
                  | null
                  | undefined;
                readonly workspaceRoot?: string | undefined;
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "project.deleted";
              readonly sequence: number;
              readonly payload: {
                readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                readonly deletedAt: string;
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "thread.created";
              readonly sequence: number;
              readonly payload: {
                readonly title: string;
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                readonly createdAt: string;
                readonly runtimeMode: "approval-required" | "full-access";
                readonly interactionMode: "default" | "plan";
                readonly branch: string | null;
                readonly worktreePath: string | null;
                readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                readonly updatedAt: string;
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
                      };
                    }
                  | {
                      readonly provider: "claudeAgent";
                      readonly model: string;
                      readonly options?: {
                        readonly fastMode?: boolean | undefined;
                        readonly thinking?: boolean | undefined;
                        readonly effort?:
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
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "thread.deleted";
              readonly sequence: number;
              readonly payload: {
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                readonly deletedAt: string;
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "thread.archived";
              readonly sequence: number;
              readonly payload: {
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                readonly updatedAt: string;
                readonly archivedAt: string;
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "thread.unarchived";
              readonly sequence: number;
              readonly payload: {
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                readonly updatedAt: string;
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "thread.meta-updated";
              readonly sequence: number;
              readonly payload: {
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                readonly updatedAt: string;
                readonly title?: string | undefined;
                readonly branch?: string | null | undefined;
                readonly worktreePath?: string | null | undefined;
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
                      };
                    }
                  | {
                      readonly provider: "claudeAgent";
                      readonly model: string;
                      readonly options?: {
                        readonly fastMode?: boolean | undefined;
                        readonly thinking?: boolean | undefined;
                        readonly effort?:
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
                  | undefined;
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "thread.runtime-mode-set";
              readonly sequence: number;
              readonly payload: {
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                readonly runtimeMode: "approval-required" | "full-access";
                readonly updatedAt: string;
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "thread.interaction-mode-set";
              readonly sequence: number;
              readonly payload: {
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                readonly interactionMode: "default" | "plan";
                readonly updatedAt: string;
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "thread.message-sent";
              readonly sequence: number;
              readonly payload: {
                readonly text: string;
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                readonly createdAt: string;
                readonly updatedAt: string;
                readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                readonly role: "system" | "user" | "assistant";
                readonly streaming: boolean;
                readonly messageId: string & import("effect/Brand").Brand<"MessageId">;
                readonly attachments?:
                  | readonly {
                      readonly id: string;
                      readonly name: string;
                      readonly mimeType: string;
                      readonly sizeBytes: number;
                      readonly type: "image";
                    }[]
                  | undefined;
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "thread.turn-start-requested";
              readonly sequence: number;
              readonly payload: {
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                readonly createdAt: string;
                readonly runtimeMode: "approval-required" | "full-access";
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
                        readonly effort?:
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
                readonly assistantDeliveryMode?: "streaming" | "buffered" | undefined;
                readonly titleSeed?: string | undefined;
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "thread.turn-interrupt-requested";
              readonly sequence: number;
              readonly payload: {
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                readonly createdAt: string;
                readonly turnId?: (string & import("effect/Brand").Brand<"TurnId">) | undefined;
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "thread.approval-response-requested";
              readonly sequence: number;
              readonly payload: {
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                readonly createdAt: string;
                readonly requestId: string & import("effect/Brand").Brand<"ApprovalRequestId">;
                readonly decision: "accept" | "acceptForSession" | "decline" | "cancel";
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "thread.user-input-response-requested";
              readonly sequence: number;
              readonly payload: {
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                readonly createdAt: string;
                readonly requestId: string & import("effect/Brand").Brand<"ApprovalRequestId">;
                readonly answers: {
                  readonly [x: string]: unknown;
                };
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "thread.checkpoint-revert-requested";
              readonly sequence: number;
              readonly payload: {
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                readonly createdAt: string;
                readonly turnCount: number;
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "thread.reverted";
              readonly sequence: number;
              readonly payload: {
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                readonly turnCount: number;
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "thread.session-stop-requested";
              readonly sequence: number;
              readonly payload: {
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                readonly createdAt: string;
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "thread.session-set";
              readonly sequence: number;
              readonly payload: {
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                readonly session: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly runtimeMode: "approval-required" | "full-access";
                  readonly updatedAt: string;
                  readonly status:
                    | "running"
                    | "interrupted"
                    | "error"
                    | "ready"
                    | "idle"
                    | "starting"
                    | "stopped";
                  readonly providerName: string | null;
                  readonly activeTurnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                  readonly lastError: string | null;
                };
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "thread.proposed-plan-upserted";
              readonly sequence: number;
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
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "thread.turn-diff-completed";
              readonly sequence: number;
              readonly payload: {
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                readonly completedAt: string;
                readonly assistantMessageId:
                  | (string & import("effect/Brand").Brand<"MessageId">)
                  | null;
                readonly turnId: string & import("effect/Brand").Brand<"TurnId">;
                readonly files: readonly {
                  readonly path: string;
                  readonly kind: string;
                  readonly additions: number;
                  readonly deletions: number;
                }[];
                readonly checkpointTurnCount: number;
                readonly checkpointRef: string & import("effect/Brand").Brand<"CheckpointRef">;
                readonly status: "error" | "ready" | "missing";
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            }
          | {
              readonly metadata: {
                readonly providerTurnId?: string | undefined;
                readonly providerItemId?:
                  | (string & import("effect/Brand").Brand<"ProviderItemId">)
                  | undefined;
                readonly adapterKey?: string | undefined;
                readonly requestId?:
                  | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                  | undefined;
                readonly ingestedAt?: string | undefined;
              };
              readonly type: "thread.activity-appended";
              readonly sequence: number;
              readonly payload: {
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                readonly activity: {
                  readonly id: string & import("effect/Brand").Brand<"EventId">;
                  readonly summary: string;
                  readonly createdAt: string;
                  readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                  readonly tone: "error" | "info" | "tool" | "approval";
                  readonly kind: string;
                  readonly payload: unknown;
                  readonly sequence?: number | undefined;
                };
              };
              readonly eventId: string & import("effect/Brand").Brand<"EventId">;
              readonly aggregateKind: "project" | "thread";
              readonly aggregateId:
                | (string & import("effect/Brand").Brand<"ThreadId">)
                | (string & import("effect/Brand").Brand<"ProjectId">);
              readonly occurredAt: string;
              readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              readonly causationEventId: (string & import("effect/Brand").Brand<"EventId">) | null;
              readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
            },
          import("effect/unstable/rpc/RpcClientError").RpcClientError,
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
          }
        | undefined,
    ) => AsQueue extends true
      ? Effect.Effect<
          import("effect/Queue").Dequeue<
            | {
                readonly threadId: string;
                readonly createdAt: string;
                readonly terminalId: string;
                readonly type: "started";
                readonly snapshot: {
                  readonly history: string;
                  readonly threadId: string;
                  readonly terminalId: string;
                  readonly worktreePath: string | null;
                  readonly updatedAt: string;
                  readonly status: "running" | "error" | "starting" | "exited";
                  readonly pid: number | null;
                  readonly exitCode: number | null;
                  readonly exitSignal: number | null;
                  readonly cwd: string;
                };
              }
            | {
                readonly data: string;
                readonly threadId: string;
                readonly createdAt: string;
                readonly terminalId: string;
                readonly type: "output";
              }
            | {
                readonly threadId: string;
                readonly createdAt: string;
                readonly terminalId: string;
                readonly type: "exited";
                readonly exitCode: number | null;
                readonly exitSignal: number | null;
              }
            | {
                readonly threadId: string;
                readonly createdAt: string;
                readonly terminalId: string;
                readonly type: "error";
                readonly message: string;
              }
            | {
                readonly threadId: string;
                readonly createdAt: string;
                readonly terminalId: string;
                readonly type: "cleared";
              }
            | {
                readonly threadId: string;
                readonly createdAt: string;
                readonly terminalId: string;
                readonly type: "restarted";
                readonly snapshot: {
                  readonly history: string;
                  readonly threadId: string;
                  readonly terminalId: string;
                  readonly worktreePath: string | null;
                  readonly updatedAt: string;
                  readonly status: "running" | "error" | "starting" | "exited";
                  readonly pid: number | null;
                  readonly exitCode: number | null;
                  readonly exitSignal: number | null;
                  readonly cwd: string;
                };
              }
            | {
                readonly threadId: string;
                readonly createdAt: string;
                readonly terminalId: string;
                readonly type: "activity";
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
              readonly threadId: string;
              readonly createdAt: string;
              readonly terminalId: string;
              readonly type: "started";
              readonly snapshot: {
                readonly history: string;
                readonly threadId: string;
                readonly terminalId: string;
                readonly worktreePath: string | null;
                readonly updatedAt: string;
                readonly status: "running" | "error" | "starting" | "exited";
                readonly pid: number | null;
                readonly exitCode: number | null;
                readonly exitSignal: number | null;
                readonly cwd: string;
              };
            }
          | {
              readonly data: string;
              readonly threadId: string;
              readonly createdAt: string;
              readonly terminalId: string;
              readonly type: "output";
            }
          | {
              readonly threadId: string;
              readonly createdAt: string;
              readonly terminalId: string;
              readonly type: "exited";
              readonly exitCode: number | null;
              readonly exitSignal: number | null;
            }
          | {
              readonly threadId: string;
              readonly createdAt: string;
              readonly terminalId: string;
              readonly type: "error";
              readonly message: string;
            }
          | {
              readonly threadId: string;
              readonly createdAt: string;
              readonly terminalId: string;
              readonly type: "cleared";
            }
          | {
              readonly threadId: string;
              readonly createdAt: string;
              readonly terminalId: string;
              readonly type: "restarted";
              readonly snapshot: {
                readonly history: string;
                readonly threadId: string;
                readonly terminalId: string;
                readonly worktreePath: string | null;
                readonly updatedAt: string;
                readonly status: "running" | "error" | "starting" | "exited";
                readonly pid: number | null;
                readonly exitCode: number | null;
                readonly exitSignal: number | null;
                readonly cwd: string;
              };
            }
          | {
              readonly threadId: string;
              readonly createdAt: string;
              readonly terminalId: string;
              readonly type: "activity";
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
          }
        | undefined,
    ) => AsQueue extends true
      ? Effect.Effect<
          import("effect/Queue").Dequeue<
            | {
                readonly version: 1;
                readonly type: "snapshot";
                readonly config: {
                  readonly providers: readonly {
                    readonly provider:
                      | "codex"
                      | "gemini"
                      | "claudeAgent"
                      | "opencode"
                      | "copilotAgent";
                    readonly enabled: boolean;
                    readonly version: string | null;
                    readonly status: "error" | "ready" | "warning" | "disabled";
                    readonly models: readonly {
                      readonly slug: string;
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
                      readonly isCustom: boolean;
                    }[];
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
                  readonly cwd: string;
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
                  readonly availableEditors: readonly (
                    | "cursor"
                    | "trae"
                    | "vscode"
                    | "vscode-insiders"
                    | "vscodium"
                    | "zed"
                    | "antigravity"
                    | "idea"
                    | "file-manager"
                  )[];
                  readonly keybindingsConfigPath: string;
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
                          };
                        }
                      | {
                          readonly provider: "claudeAgent";
                          readonly model: string;
                          readonly options?: {
                            readonly fastMode?: boolean | undefined;
                            readonly thinking?: boolean | undefined;
                            readonly effort?:
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
                readonly version: 1;
                readonly type: "keybindingsUpdated";
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
                readonly version: 1;
                readonly type: "providerStatuses";
                readonly payload: {
                  readonly providers: readonly {
                    readonly provider:
                      | "codex"
                      | "gemini"
                      | "claudeAgent"
                      | "opencode"
                      | "copilotAgent";
                    readonly enabled: boolean;
                    readonly version: string | null;
                    readonly status: "error" | "ready" | "warning" | "disabled";
                    readonly models: readonly {
                      readonly slug: string;
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
                      readonly isCustom: boolean;
                    }[];
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
                readonly version: 1;
                readonly type: "settingsUpdated";
                readonly payload: {
                  readonly settings: {
                    readonly enableAssistantStreaming: boolean;
                    readonly defaultThreadEnvMode: "local" | "worktree";
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
            | import("@t3tools/contracts").KeybindingsConfigError
            | import("@t3tools/contracts").ServerSettingsError
            | import("effect/unstable/rpc/RpcClientError").RpcClientError
            | import("effect/Cause").Done<void>
          >,
          never,
          import("effect/Scope").Scope
        >
      : import("effect/Stream").Stream<
          | {
              readonly version: 1;
              readonly type: "snapshot";
              readonly config: {
                readonly providers: readonly {
                  readonly provider:
                    | "codex"
                    | "gemini"
                    | "claudeAgent"
                    | "opencode"
                    | "copilotAgent";
                  readonly enabled: boolean;
                  readonly version: string | null;
                  readonly status: "error" | "ready" | "warning" | "disabled";
                  readonly models: readonly {
                    readonly slug: string;
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
                    readonly isCustom: boolean;
                  }[];
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
                readonly cwd: string;
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
                readonly availableEditors: readonly (
                  | "cursor"
                  | "trae"
                  | "vscode"
                  | "vscode-insiders"
                  | "vscodium"
                  | "zed"
                  | "antigravity"
                  | "idea"
                  | "file-manager"
                )[];
                readonly keybindingsConfigPath: string;
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
                        };
                      }
                    | {
                        readonly provider: "claudeAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly fastMode?: boolean | undefined;
                          readonly thinking?: boolean | undefined;
                          readonly effort?:
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
              readonly version: 1;
              readonly type: "keybindingsUpdated";
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
              readonly version: 1;
              readonly type: "providerStatuses";
              readonly payload: {
                readonly providers: readonly {
                  readonly provider:
                    | "codex"
                    | "gemini"
                    | "claudeAgent"
                    | "opencode"
                    | "copilotAgent";
                  readonly enabled: boolean;
                  readonly version: string | null;
                  readonly status: "error" | "ready" | "warning" | "disabled";
                  readonly models: readonly {
                    readonly slug: string;
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
                    readonly isCustom: boolean;
                  }[];
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
              readonly version: 1;
              readonly type: "settingsUpdated";
              readonly payload: {
                readonly settings: {
                  readonly enableAssistantStreaming: boolean;
                  readonly defaultThreadEnvMode: "local" | "worktree";
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
          | import("@t3tools/contracts").KeybindingsConfigError
          | import("@t3tools/contracts").ServerSettingsError
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
          }
        | undefined,
    ) => AsQueue extends true
      ? Effect.Effect<
          import("effect/Queue").Dequeue<
            | {
                readonly version: 1;
                readonly type: "welcome";
                readonly sequence: number;
                readonly payload: {
                  readonly cwd: string;
                  readonly projectName: string;
                  readonly bootstrapProjectId?:
                    | (string & import("effect/Brand").Brand<"ProjectId">)
                    | undefined;
                  readonly bootstrapThreadId?:
                    | (string & import("effect/Brand").Brand<"ThreadId">)
                    | undefined;
                };
              }
            | {
                readonly version: 1;
                readonly type: "ready";
                readonly sequence: number;
                readonly payload: {
                  readonly at: string;
                };
              },
            | import("effect/unstable/rpc/RpcClientError").RpcClientError
            | import("effect/Cause").Done<void>
          >,
          never,
          import("effect/Scope").Scope
        >
      : import("effect/Stream").Stream<
          | {
              readonly version: 1;
              readonly type: "welcome";
              readonly sequence: number;
              readonly payload: {
                readonly cwd: string;
                readonly projectName: string;
                readonly bootstrapProjectId?:
                  | (string & import("effect/Brand").Brand<"ProjectId">)
                  | undefined;
                readonly bootstrapThreadId?:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | undefined;
              };
            }
          | {
              readonly version: 1;
              readonly type: "ready";
              readonly sequence: number;
              readonly payload: {
                readonly at: string;
              };
            },
          import("effect/unstable/rpc/RpcClientError").RpcClientError,
          never
        >;
    readonly "orchestration.getSnapshot": <
      const AsQueue extends boolean = false,
      const Discard = false,
    >(
      input: {},
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly projects: readonly {
              readonly id: string & import("effect/Brand").Brand<"ProjectId">;
              readonly scripts: readonly {
                readonly id: string;
                readonly name: string;
                readonly command: string;
                readonly icon: "play" | "test" | "lint" | "configure" | "build" | "debug";
                readonly runOnWorktreeCreate: boolean;
              }[];
              readonly title: string;
              readonly createdAt: string;
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
              readonly deletedAt: string | null;
              readonly workspaceRoot: string;
              readonly updatedAt: string;
            }[];
            readonly updatedAt: string;
            readonly threads: readonly {
              readonly id: string & import("effect/Brand").Brand<"ThreadId">;
              readonly title: string;
              readonly createdAt: string;
              readonly runtimeMode: "approval-required" | "full-access";
              readonly interactionMode: "default" | "plan";
              readonly branch: string | null;
              readonly worktreePath: string | null;
              readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
              readonly deletedAt: string | null;
              readonly updatedAt: string;
              readonly latestTurn: {
                readonly state: "running" | "interrupted" | "completed" | "error";
                readonly startedAt: string | null;
                readonly completedAt: string | null;
                readonly assistantMessageId:
                  | (string & import("effect/Brand").Brand<"MessageId">)
                  | null;
                readonly turnId: string & import("effect/Brand").Brand<"TurnId">;
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
                readonly text: string;
                readonly createdAt: string;
                readonly updatedAt: string;
                readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                readonly role: "system" | "user" | "assistant";
                readonly streaming: boolean;
                readonly attachments?:
                  | readonly {
                      readonly id: string;
                      readonly name: string;
                      readonly mimeType: string;
                      readonly sizeBytes: number;
                      readonly type: "image";
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
                readonly id: string & import("effect/Brand").Brand<"EventId">;
                readonly summary: string;
                readonly createdAt: string;
                readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                readonly tone: "error" | "info" | "tool" | "approval";
                readonly kind: string;
                readonly payload: unknown;
                readonly sequence?: number | undefined;
              }[];
              readonly checkpoints: readonly {
                readonly completedAt: string;
                readonly assistantMessageId:
                  | (string & import("effect/Brand").Brand<"MessageId">)
                  | null;
                readonly turnId: string & import("effect/Brand").Brand<"TurnId">;
                readonly files: readonly {
                  readonly path: string;
                  readonly kind: string;
                  readonly additions: number;
                  readonly deletions: number;
                }[];
                readonly checkpointTurnCount: number;
                readonly checkpointRef: string & import("effect/Brand").Brand<"CheckpointRef">;
                readonly status: "error" | "ready" | "missing";
              }[];
              readonly session: {
                readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                readonly runtimeMode: "approval-required" | "full-access";
                readonly updatedAt: string;
                readonly status:
                  | "running"
                  | "interrupted"
                  | "error"
                  | "ready"
                  | "idle"
                  | "starting"
                  | "stopped";
                readonly providerName: string | null;
                readonly activeTurnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                readonly lastError: string | null;
              } | null;
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
                    };
                  }
                | {
                    readonly provider: "claudeAgent";
                    readonly model: string;
                    readonly options?: {
                      readonly fastMode?: boolean | undefined;
                      readonly thinking?: boolean | undefined;
                      readonly effort?:
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
            }[];
            readonly snapshotSequence: number;
          },
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true ? never : import("@t3tools/contracts").OrchestrationGetSnapshotError),
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
                  };
                }
              | {
                  readonly provider: "claudeAgent";
                  readonly model: string;
                  readonly options?: {
                    readonly thinking?: boolean | undefined;
                    readonly effort?: "high" | "medium" | "low" | "max" | "ultrathink" | undefined;
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
                  };
                }
              | {
                  readonly provider: "claudeAgent";
                  readonly model: string;
                  readonly options?: {
                    readonly thinking?: boolean | undefined;
                    readonly effort?: "high" | "medium" | "low" | "max" | "ultrathink" | undefined;
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
                  };
                }
              | {
                  readonly provider: "claudeAgent";
                  readonly model: string;
                  readonly options?: {
                    readonly thinking?: boolean | undefined;
                    readonly effort?: "high" | "medium" | "low" | "max" | "ultrathink" | undefined;
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
            readonly runtimeMode: "approval-required" | "full-access";
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
                  };
                }
              | {
                  readonly provider: "claudeAgent";
                  readonly model: string;
                  readonly options?: {
                    readonly thinking?: boolean | undefined;
                    readonly effort?: "high" | "medium" | "low" | "max" | "ultrathink" | undefined;
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
            readonly runtimeMode: "approval-required" | "full-access";
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
            readonly runtimeMode: "approval-required" | "full-access";
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
                  };
                }
              | {
                  readonly provider: "claudeAgent";
                  readonly model: string;
                  readonly options?: {
                    readonly thinking?: boolean | undefined;
                    readonly effort?: "high" | "medium" | "low" | "max" | "ultrathink" | undefined;
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
            readonly assistantDeliveryMode?: "streaming" | "buffered" | undefined;
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
                              };
                            }
                          | {
                              readonly provider: "claudeAgent";
                              readonly model: string;
                              readonly options?: {
                                readonly thinking?: boolean | undefined;
                                readonly effort?:
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
                        readonly runtimeMode: "approval-required" | "full-access";
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
          },
      options?:
        | {
            readonly headers?: import("effect/unstable/http/Headers").Input | undefined;
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
            readonly diff: string;
            readonly toTurnCount: number;
            readonly fromTurnCount: number;
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : {
            readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
            readonly diff: string;
            readonly toTurnCount: number;
            readonly fromTurnCount: number;
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
            readonly context?: import("effect/ServiceMap").ServiceMap<never> | undefined;
            readonly discard?: Discard | undefined;
          }
        | undefined,
    ) => Effect.Effect<
      Discard extends true
        ? void
        : readonly (
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "project.created";
                readonly sequence: number;
                readonly payload: {
                  readonly scripts: readonly {
                    readonly id: string;
                    readonly name: string;
                    readonly command: string;
                    readonly icon: "play" | "test" | "lint" | "configure" | "build" | "debug";
                    readonly runOnWorktreeCreate: boolean;
                  }[];
                  readonly title: string;
                  readonly createdAt: string;
                  readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
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
                  readonly workspaceRoot: string;
                  readonly updatedAt: string;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "project.meta-updated";
                readonly sequence: number;
                readonly payload: {
                  readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                  readonly updatedAt: string;
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
                  readonly workspaceRoot?: string | undefined;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "project.deleted";
                readonly sequence: number;
                readonly payload: {
                  readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                  readonly deletedAt: string;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.created";
                readonly sequence: number;
                readonly payload: {
                  readonly title: string;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly createdAt: string;
                  readonly runtimeMode: "approval-required" | "full-access";
                  readonly interactionMode: "default" | "plan";
                  readonly branch: string | null;
                  readonly worktreePath: string | null;
                  readonly projectId: string & import("effect/Brand").Brand<"ProjectId">;
                  readonly updatedAt: string;
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
                        };
                      }
                    | {
                        readonly provider: "claudeAgent";
                        readonly model: string;
                        readonly options?: {
                          readonly fastMode?: boolean | undefined;
                          readonly thinking?: boolean | undefined;
                          readonly effort?:
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
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.deleted";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly deletedAt: string;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.archived";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly updatedAt: string;
                  readonly archivedAt: string;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.unarchived";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly updatedAt: string;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.meta-updated";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly updatedAt: string;
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
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.runtime-mode-set";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly runtimeMode: "approval-required" | "full-access";
                  readonly updatedAt: string;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.interaction-mode-set";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly interactionMode: "default" | "plan";
                  readonly updatedAt: string;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.message-sent";
                readonly sequence: number;
                readonly payload: {
                  readonly text: string;
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly createdAt: string;
                  readonly updatedAt: string;
                  readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                  readonly role: "system" | "user" | "assistant";
                  readonly streaming: boolean;
                  readonly messageId: string & import("effect/Brand").Brand<"MessageId">;
                  readonly attachments?:
                    | readonly {
                        readonly id: string;
                        readonly name: string;
                        readonly mimeType: string;
                        readonly sizeBytes: number;
                        readonly type: "image";
                      }[]
                    | undefined;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.turn-start-requested";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly createdAt: string;
                  readonly runtimeMode: "approval-required" | "full-access";
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
                  readonly assistantDeliveryMode?: "streaming" | "buffered" | undefined;
                  readonly titleSeed?: string | undefined;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.turn-interrupt-requested";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly createdAt: string;
                  readonly turnId?: (string & import("effect/Brand").Brand<"TurnId">) | undefined;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.approval-response-requested";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly createdAt: string;
                  readonly requestId: string & import("effect/Brand").Brand<"ApprovalRequestId">;
                  readonly decision: "accept" | "acceptForSession" | "decline" | "cancel";
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.user-input-response-requested";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly createdAt: string;
                  readonly requestId: string & import("effect/Brand").Brand<"ApprovalRequestId">;
                  readonly answers: {
                    readonly [x: string]: unknown;
                  };
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.checkpoint-revert-requested";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly createdAt: string;
                  readonly turnCount: number;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.reverted";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly turnCount: number;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.session-stop-requested";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly createdAt: string;
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.session-set";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly session: {
                    readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                    readonly runtimeMode: "approval-required" | "full-access";
                    readonly updatedAt: string;
                    readonly status:
                      | "running"
                      | "interrupted"
                      | "error"
                      | "ready"
                      | "idle"
                      | "starting"
                      | "stopped";
                    readonly providerName: string | null;
                    readonly activeTurnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                    readonly lastError: string | null;
                  };
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.proposed-plan-upserted";
                readonly sequence: number;
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
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.turn-diff-completed";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly completedAt: string;
                  readonly assistantMessageId:
                    | (string & import("effect/Brand").Brand<"MessageId">)
                    | null;
                  readonly turnId: string & import("effect/Brand").Brand<"TurnId">;
                  readonly files: readonly {
                    readonly path: string;
                    readonly kind: string;
                    readonly additions: number;
                    readonly deletions: number;
                  }[];
                  readonly checkpointTurnCount: number;
                  readonly checkpointRef: string & import("effect/Brand").Brand<"CheckpointRef">;
                  readonly status: "error" | "ready" | "missing";
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
            | {
                readonly metadata: {
                  readonly providerTurnId?: string | undefined;
                  readonly providerItemId?:
                    | (string & import("effect/Brand").Brand<"ProviderItemId">)
                    | undefined;
                  readonly adapterKey?: string | undefined;
                  readonly requestId?:
                    | (string & import("effect/Brand").Brand<"ApprovalRequestId">)
                    | undefined;
                  readonly ingestedAt?: string | undefined;
                };
                readonly type: "thread.activity-appended";
                readonly sequence: number;
                readonly payload: {
                  readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
                  readonly activity: {
                    readonly id: string & import("effect/Brand").Brand<"EventId">;
                    readonly summary: string;
                    readonly createdAt: string;
                    readonly turnId: (string & import("effect/Brand").Brand<"TurnId">) | null;
                    readonly tone: "error" | "info" | "tool" | "approval";
                    readonly kind: string;
                    readonly payload: unknown;
                    readonly sequence?: number | undefined;
                  };
                };
                readonly eventId: string & import("effect/Brand").Brand<"EventId">;
                readonly aggregateKind: "project" | "thread";
                readonly aggregateId:
                  | (string & import("effect/Brand").Brand<"ThreadId">)
                  | (string & import("effect/Brand").Brand<"ProjectId">);
                readonly occurredAt: string;
                readonly commandId: (string & import("effect/Brand").Brand<"CommandId">) | null;
                readonly causationEventId:
                  | (string & import("effect/Brand").Brand<"EventId">)
                  | null;
                readonly correlationId: (string & import("effect/Brand").Brand<"CommandId">) | null;
              }
          )[],
      | import("effect/unstable/rpc/RpcClientError").RpcClientError
      | (Discard extends true
          ? never
          : import("@t3tools/contracts").OrchestrationReplayEventsError),
      never
    >;
  },
  never,
  import("effect/Scope").Scope | RpcClient.Protocol
>;
type RpcClientFactory = typeof makeWsRpcProtocolClient;
export type WsRpcProtocolClient =
  RpcClientFactory extends Effect.Effect<infer Client, any, any> ? Client : never;
export declare function createWsRpcProtocolLayer(
  url?: string,
): Layer.Layer<RpcClient.Protocol, never, never>;
export {};
