import type {
  ModelCapabilities,
  OpencodeSettings,
  ServerProvider,
  ServerProviderModel,
} from "@t3tools/contracts";
import { Effect, Equal, FileSystem, Layer, Option, Path, Result, Stream } from "effect";
import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process";

import {
  buildServerProvider,
  DEFAULT_TIMEOUT_MS,
  detailFromResult,
  isCommandMissingCause,
  parseGenericCliVersion,
  providerModelsFromSettings,
  spawnAndCollect,
} from "../providerSnapshot";
import { makeManagedServerProvider } from "../makeManagedServerProvider";
import { OpencodeProvider } from "../Services/OpencodeProvider";
import { ServerSettingsError } from "@t3tools/contracts";
import { ServerSettingsService } from "../../serverSettings";

const DEFAULT_OPENCODE_MODEL_CAPABILITIES: ModelCapabilities = {
  reasoningEffortLevels: [],
  supportsFastMode: false,
  supportsThinkingToggle: false,
  contextWindowOptions: [],
  promptInjectedEffortLevels: [],
};

const PROVIDER = "opencode" as const;

const OPENCODE_MODEL_CAPABILITIES: ServerProviderModel["capabilities"] = {
  reasoningEffortLevels: [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium", isDefault: true },
    { value: "high", label: "High" },
    { value: "xhigh", label: "Extra High" },
  ],
  supportsFastMode: false,
  supportsThinkingToggle: false,
  contextWindowOptions: [],
  promptInjectedEffortLevels: [],
};

const BUILT_IN_MODELS: ReadonlyArray<ServerProviderModel> = [
  {
    slug: "opencode/big-pickle",
    name: "Big Pickle",
    isCustom: false,
    capabilities: OPENCODE_MODEL_CAPABILITIES,
  },
  {
    slug: "opencode/gpt-5-nano",
    name: "GPT-5 Nano",
    isCustom: false,
    capabilities: OPENCODE_MODEL_CAPABILITIES,
  },
  {
    slug: "opencode/minimax-m2.5-free",
    name: "MiniMax M2.5 Free",
    isCustom: false,
    capabilities: OPENCODE_MODEL_CAPABILITIES,
  },
  {
    slug: "opencode/nemotron-3-super-free",
    name: "Nemotron 3 Super Free",
    isCustom: false,
    capabilities: OPENCODE_MODEL_CAPABILITIES,
  },
  {
    slug: "opencode-go/glm-5",
    name: "GLM-5 (Go)",
    isCustom: false,
    capabilities: OPENCODE_MODEL_CAPABILITIES,
  },
  {
    slug: "opencode-go/glm-5.1",
    name: "GLM-5.1 (Go)",
    isCustom: false,
    capabilities: OPENCODE_MODEL_CAPABILITIES,
  },
  {
    slug: "opencode-go/kimi-k2.5",
    name: "Kimi K2.5 (Go)",
    isCustom: false,
    capabilities: OPENCODE_MODEL_CAPABILITIES,
  },
  {
    slug: "opencode-go/mimo-v2-omni",
    name: "MiMo V2 Omni (Go)",
    isCustom: false,
    capabilities: OPENCODE_MODEL_CAPABILITIES,
  },
  {
    slug: "opencode-go/mimo-v2-pro",
    name: "MiMo V2 Pro (Go)",
    isCustom: false,
    capabilities: OPENCODE_MODEL_CAPABILITIES,
  },
  {
    slug: "opencode-go/minimax-m2.5",
    name: "MiniMax M2.5 (Go)",
    isCustom: false,
    capabilities: OPENCODE_MODEL_CAPABILITIES,
  },
  {
    slug: "opencode-go/minimax-m2.7",
    name: "MiniMax M2.7 (Go)",
    isCustom: false,
    capabilities: OPENCODE_MODEL_CAPABILITIES,
  },
  {
    slug: "ollama/gemma4",
    name: "Gemma 4 (Ollama Cloud)",
    isCustom: false,
    capabilities: OPENCODE_MODEL_CAPABILITIES,
  },
  {
    slug: "ollama/gemma4:31b-cloud",
    name: "Gemma 4 31B (Ollama Cloud)",
    isCustom: false,
    capabilities: OPENCODE_MODEL_CAPABILITIES,
  },
  {
    slug: "ollama/nemotron-3-super",
    name: "Nemotron 3 Super (Ollama Cloud)",
    isCustom: false,
    capabilities: OPENCODE_MODEL_CAPABILITIES,
  },
];

/**
 * Count the number of credential lines in the output of `opencode auth list`.
 * Each credential is marked by a `●` character.
 */
function countCredentials(output: string): number {
  const lines = output.split("\n");
  return lines.filter((line) => line.includes("\u25CF")).length;
}

/**
 * Parse `opencode models` output into ServerProviderModel entries.
 * Each line is a model slug like "opencode/big-pickle" or "local_ollama/qwen3:8b".
 */
function parseDiscoveredModels(output: string): ReadonlyArray<ServerProviderModel> {
  return output
    .split("\n")
    .map((line) => line.trim())
    .filter((slug) => slug.length > 0)
    .map((slug) => ({
      slug,
      name: slugToDisplayName(slug),
      isCustom: false,
      capabilities: OPENCODE_MODEL_CAPABILITIES,
    }));
}

function slugToDisplayName(slug: string): string {
  const slashIndex = slug.indexOf("/");
  const modelPart = slashIndex >= 0 ? slug.slice(slashIndex + 1) : slug;
  const prefix = slashIndex >= 0 ? slug.slice(0, slashIndex) : "";
  const name = modelPart
    .split(/[-_]/)
    .map((word) => (word.length > 0 ? word[0]!.toUpperCase() + word.slice(1) : word))
    .join(" ");
  if (prefix && prefix !== "opencode") {
    const providerLabel = prefix
      .split(/[-_]/)
      .map((w) => (w.length > 0 ? w[0]!.toUpperCase() + w.slice(1) : w))
      .join(" ");
    return `${name} (${providerLabel})`;
  }
  return name;
}

/**
 * Discover available models by running `opencode models`.
 * Returns discovered models merged with built-in models (discovered take priority).
 */
const discoverOpencodeModels = Effect.gen(function* () {
  const result = yield* runOpencodeCommand(["models"]).pipe(
    Effect.timeoutOption(DEFAULT_TIMEOUT_MS),
    Effect.result,
  );

  if (Result.isFailure(result) || Option.isNone(result.success)) {
    return null;
  }

  const commandResult = result.success.value;
  if (commandResult.code !== 0) {
    return null;
  }

  return parseDiscoveredModels(commandResult.stdout);
});

const runOpencodeCommand = (args: ReadonlyArray<string>) =>
  Effect.gen(function* () {
    const settingsService = yield* ServerSettingsService;
    const opencodeSettings = yield* settingsService.getSettings.pipe(
      Effect.map((settings) => settings.providers.opencode),
    );
    const command = ChildProcess.make(opencodeSettings.binaryPath, [...args], {
      shell: process.platform === "win32",
      env: process.env,
    });
    return yield* spawnAndCollect(opencodeSettings.binaryPath, command);
  });

export const checkOpencodeProviderStatus = Effect.fn("checkOpencodeProviderStatus")(
  function* (): Effect.fn.Return<
    ServerProvider,
    ServerSettingsError,
    | ChildProcessSpawner.ChildProcessSpawner
    | FileSystem.FileSystem
    | Path.Path
    | ServerSettingsService
  > {
    const opencodeSettings = yield* Effect.service(ServerSettingsService).pipe(
      Effect.flatMap((service) => service.getSettings),
      Effect.map((settings) => settings.providers.opencode),
    );
    const checkedAt = new Date().toISOString();
    const models = providerModelsFromSettings(
      BUILT_IN_MODELS,
      PROVIDER,
      opencodeSettings.customModels,
      DEFAULT_OPENCODE_MODEL_CAPABILITIES,
    );

    if (!opencodeSettings.enabled) {
      return buildServerProvider({
        provider: PROVIDER,
        enabled: false,
        checkedAt,
        models,
        probe: {
          installed: false,
          version: null,
          status: "warning",
          auth: { status: "unknown" },
          message: "OpenCode is disabled in T3 Code settings.",
        },
      });
    }

    // ── Version check ────────────────────────────────────────────────

    const versionProbe = yield* runOpencodeCommand(["--version"]).pipe(
      Effect.timeoutOption(DEFAULT_TIMEOUT_MS),
      Effect.result,
    );

    if (Result.isFailure(versionProbe)) {
      const error = versionProbe.failure;
      return buildServerProvider({
        provider: PROVIDER,
        enabled: opencodeSettings.enabled,
        checkedAt,
        models,
        probe: {
          installed: !isCommandMissingCause(error),
          version: null,
          status: "error",
          auth: { status: "unknown" },
          message: isCommandMissingCause(error)
            ? "OpenCode CLI (`opencode`) is not installed or not on PATH."
            : `Failed to execute OpenCode CLI health check: ${error instanceof Error ? error.message : String(error)}.`,
        },
      });
    }

    if (Option.isNone(versionProbe.success)) {
      return buildServerProvider({
        provider: PROVIDER,
        enabled: opencodeSettings.enabled,
        checkedAt,
        models,
        probe: {
          installed: true,
          version: null,
          status: "error",
          auth: { status: "unknown" },
          message: "OpenCode CLI is installed but failed to run. Timed out while running command.",
        },
      });
    }

    const version = versionProbe.success.value;
    const parsedVersion = parseGenericCliVersion(`${version.stdout}\n${version.stderr}`);
    if (version.code !== 0) {
      const detail = detailFromResult(version);
      return buildServerProvider({
        provider: PROVIDER,
        enabled: opencodeSettings.enabled,
        checkedAt,
        models,
        probe: {
          installed: true,
          version: parsedVersion,
          status: "error",
          auth: { status: "unknown" },
          message: detail
            ? `OpenCode CLI is installed but failed to run. ${detail}`
            : "OpenCode CLI is installed but failed to run.",
        },
      });
    }

    // ── Auth check ───────────────────────────────────────────────────

    const authProbe = yield* runOpencodeCommand(["auth", "list"]).pipe(
      Effect.timeoutOption(DEFAULT_TIMEOUT_MS),
      Effect.result,
    );

    let authAuthenticated = false;
    let authLabel: string | undefined;

    if (Result.isSuccess(authProbe) && Option.isSome(authProbe.success)) {
      const authResult = authProbe.success.value;
      if (authResult.code === 0) {
        const credentialCount = countCredentials(authResult.stdout);
        if (credentialCount > 0) {
          authAuthenticated = true;
          authLabel = `${credentialCount} credential${credentialCount === 1 ? "" : "s"} configured`;
        }
      }
    }

    // Fallback: check if an API key is configured in settings
    if (!authAuthenticated && opencodeSettings.apiKey.trim().length > 0) {
      authAuthenticated = true;
      authLabel = "API Key";
    }

    // ── Dynamic model discovery ──────────────────────────────────────
    const discoveredModels = yield* discoverOpencodeModels;
    let finalModels = models;
    if (discoveredModels && discoveredModels.length > 0) {
      // Built-in models are authoritative for known prefixes (opencode/, opencode-go/, ollama/).
      // Only append discovered models from prefixes NOT covered by the built-in list
      // (e.g. local_ollama/ or other user-specific providers).
      const builtInPrefixes = new Set(BUILT_IN_MODELS.map((m) => m.slug.split("/")[0]!));
      const newDiscovered = discoveredModels.filter((m) => {
        const prefix = m.slug.split("/")[0]!;
        return !builtInPrefixes.has(prefix);
      });
      finalModels = [...models, ...newDiscovered];
    }

    return buildServerProvider({
      provider: PROVIDER,
      enabled: opencodeSettings.enabled,
      checkedAt,
      models: finalModels,
      probe: {
        installed: true,
        version: parsedVersion,
        status: authAuthenticated ? "ready" : "error",
        auth: {
          status: authAuthenticated ? "authenticated" : "unauthenticated",
          ...(authLabel ? { label: authLabel } : {}),
        },
        message: authAuthenticated
          ? "OpenCode CLI is installed and ready."
          : "OpenCode CLI is installed but not authenticated. Run `opencode auth login` or set an API key.",
      },
    });
  },
);

const makePendingOpencodeProvider = (opencodeSettings: OpencodeSettings): ServerProvider => {
  const checkedAt = new Date().toISOString();
  const models = providerModelsFromSettings(
    BUILT_IN_MODELS,
    PROVIDER,
    opencodeSettings.customModels,
    DEFAULT_OPENCODE_MODEL_CAPABILITIES,
  );

  if (!opencodeSettings.enabled) {
    return buildServerProvider({
      provider: PROVIDER,
      enabled: false,
      checkedAt,
      models,
      probe: {
        installed: false,
        version: null,
        status: "warning",
        auth: { status: "unknown" },
        message: "OpenCode is disabled in T3 Code settings.",
      },
    });
  }

  return buildServerProvider({
    provider: PROVIDER,
    enabled: true,
    checkedAt,
    models,
    probe: {
      installed: false,
      version: null,
      status: "warning",
      auth: { status: "unknown" },
      message: "OpenCode provider status has not been checked in this session yet.",
    },
  });
};

export const OpencodeProviderLive = Layer.effect(
  OpencodeProvider,
  Effect.gen(function* () {
    const serverSettings = yield* ServerSettingsService;
    const fileSystem = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const spawner = yield* ChildProcessSpawner.ChildProcessSpawner;

    const checkProvider = checkOpencodeProviderStatus().pipe(
      Effect.provideService(ServerSettingsService, serverSettings),
      Effect.provideService(FileSystem.FileSystem, fileSystem),
      Effect.provideService(Path.Path, path),
      Effect.provideService(ChildProcessSpawner.ChildProcessSpawner, spawner),
    );

    return yield* makeManagedServerProvider<OpencodeSettings>({
      getSettings: serverSettings.getSettings.pipe(
        Effect.map((settings) => settings.providers.opencode),
        Effect.orDie,
      ),
      streamSettings: serverSettings.streamChanges.pipe(
        Stream.map((settings) => settings.providers.opencode),
      ),
      haveSettingsChanged: (previous, next) => !Equal.equals(previous, next),
      initialSnapshot: makePendingOpencodeProvider,
      checkProvider,
    });
  }),
);
