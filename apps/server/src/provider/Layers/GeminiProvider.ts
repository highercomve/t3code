import type {
  GeminiSettings,
  ModelCapabilities,
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
import { GeminiProvider } from "../Services/GeminiProvider";
import { ServerSettingsError } from "@t3tools/contracts";
import { ServerSettingsService } from "../../serverSettings";

const DEFAULT_GEMINI_MODEL_CAPABILITIES: ModelCapabilities = {
  reasoningEffortLevels: [],
  supportsFastMode: false,
  supportsThinkingToggle: false,
  contextWindowOptions: [],
  promptInjectedEffortLevels: [],
};

const PROVIDER = "gemini" as const;
const BUILT_IN_MODELS: ReadonlyArray<ServerProviderModel> = [
  {
    slug: "gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro Preview",
    isCustom: false,
    capabilities: null,
  },
  {
    slug: "gemini-3-flash-preview",
    name: "Gemini 3 Flash Preview",
    isCustom: false,
    capabilities: null,
  },
  { slug: "gemini-2.5-pro", name: "Gemini 2.5 Pro", isCustom: false, capabilities: null },
  { slug: "gemini-2.5-flash", name: "Gemini 2.5 Flash", isCustom: false, capabilities: null },
  {
    slug: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash Lite",
    isCustom: false,
    capabilities: null,
  },
];

const runGeminiCommand = (args: ReadonlyArray<string>) =>
  Effect.gen(function* () {
    const settingsService = yield* ServerSettingsService;
    const geminiSettings = yield* settingsService.getSettings.pipe(
      Effect.map((settings) => settings.providers.gemini),
    );
    const command = ChildProcess.make(geminiSettings.binaryPath, [...args], {
      shell: process.platform === "win32",
      env: process.env,
    });
    return yield* spawnAndCollect(geminiSettings.binaryPath, command);
  });

/**
 * Check Gemini authentication by reading the google_accounts.json file
 * from the Gemini home directory.
 *
 * If `homePath` is set in settings, that is used as the base directory;
 * otherwise the default `~/.gemini` is used.
 */
function parseGeminiAccountsJson(content: string): boolean {
  const trimmed = content.trim();
  if (!trimmed) return false;
  try {
    const parsed = JSON.parse(trimmed);
    return parsed && typeof parsed === "object" && "active" in parsed;
  } catch {
    return false;
  }
}

const checkGeminiAuth = (geminiSettings: GeminiSettings) =>
  Effect.gen(function* () {
    const fileSystem = yield* FileSystem.FileSystem;
    const pathService = yield* Path.Path;

    const homeDir =
      geminiSettings.homePath && geminiSettings.homePath.trim().length > 0
        ? geminiSettings.homePath.trim()
        : pathService.join(process.env.HOME ?? "~", ".gemini");

    const accountsFilePath = pathService.join(homeDir, "google_accounts.json");

    const fileExists = yield* fileSystem
      .exists(accountsFilePath)
      .pipe(Effect.orElseSucceed(() => false));
    if (!fileExists) {
      return false;
    }

    const content = yield* fileSystem
      .readFileString(accountsFilePath)
      .pipe(Effect.orElseSucceed(() => ""));

    return parseGeminiAccountsJson(content);
  });

export const checkGeminiProviderStatus = Effect.fn("checkGeminiProviderStatus")(
  function* (): Effect.fn.Return<
    ServerProvider,
    ServerSettingsError,
    | ChildProcessSpawner.ChildProcessSpawner
    | FileSystem.FileSystem
    | Path.Path
    | ServerSettingsService
  > {
    const geminiSettings = yield* Effect.service(ServerSettingsService).pipe(
      Effect.flatMap((service) => service.getSettings),
      Effect.map((settings) => settings.providers.gemini),
    );
    const checkedAt = new Date().toISOString();
    const models = providerModelsFromSettings(
      BUILT_IN_MODELS,
      PROVIDER,
      geminiSettings.customModels,
      DEFAULT_GEMINI_MODEL_CAPABILITIES,
    );

    if (!geminiSettings.enabled) {
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
          message: "Gemini is disabled in T3 Code settings.",
        },
      });
    }

    // ── Version check ────────────────────────────────────────────────────

    const versionProbe = yield* runGeminiCommand(["--version"]).pipe(
      Effect.timeoutOption(DEFAULT_TIMEOUT_MS),
      Effect.result,
    );

    if (Result.isFailure(versionProbe)) {
      const error = versionProbe.failure;
      return buildServerProvider({
        provider: PROVIDER,
        enabled: geminiSettings.enabled,
        checkedAt,
        models,
        probe: {
          installed: !isCommandMissingCause(error),
          version: null,
          status: "error",
          auth: { status: "unknown" },
          message: isCommandMissingCause(error)
            ? "Gemini CLI (`gemini`) is not installed or not on PATH."
            : `Failed to execute Gemini CLI health check: ${error instanceof Error ? error.message : String(error)}.`,
        },
      });
    }

    if (Option.isNone(versionProbe.success)) {
      return buildServerProvider({
        provider: PROVIDER,
        enabled: geminiSettings.enabled,
        checkedAt,
        models,
        probe: {
          installed: true,
          version: null,
          status: "error",
          auth: { status: "unknown" },
          message: "Gemini CLI is installed but failed to run. Timed out while running command.",
        },
      });
    }

    const version = versionProbe.success.value;
    const parsedVersion = parseGenericCliVersion(`${version.stdout}\n${version.stderr}`);
    if (version.code !== 0) {
      const detail = detailFromResult(version);
      return buildServerProvider({
        provider: PROVIDER,
        enabled: geminiSettings.enabled,
        checkedAt,
        models,
        probe: {
          installed: true,
          version: parsedVersion,
          status: "error",
          auth: { status: "unknown" },
          message: detail
            ? `Gemini CLI is installed but failed to run. ${detail}`
            : "Gemini CLI is installed but failed to run.",
        },
      });
    }

    // ── Auth check (file-based) ──────────────────────────────────────────

    const authenticated = yield* checkGeminiAuth(geminiSettings).pipe(
      Effect.orElseSucceed(() => false),
    );

    if (authenticated) {
      return buildServerProvider({
        provider: PROVIDER,
        enabled: geminiSettings.enabled,
        checkedAt,
        models,
        probe: {
          installed: true,
          version: parsedVersion,
          status: "ready",
          auth: { status: "authenticated", type: "oauth-personal", label: "Google Account" },
          message: "Gemini CLI is installed and authenticated.",
        },
      });
    }

    return buildServerProvider({
      provider: PROVIDER,
      enabled: geminiSettings.enabled,
      checkedAt,
      models,
      probe: {
        installed: true,
        version: parsedVersion,
        status: "error",
        auth: { status: "unauthenticated" },
        message: "Gemini CLI is installed but not authenticated. Run `gemini` to log in.",
      },
    });
  },
);

const makePendingGeminiProvider = (geminiSettings: GeminiSettings): ServerProvider => {
  const checkedAt = new Date().toISOString();
  const models = providerModelsFromSettings(
    BUILT_IN_MODELS,
    PROVIDER,
    geminiSettings.customModels,
    DEFAULT_GEMINI_MODEL_CAPABILITIES,
  );

  if (!geminiSettings.enabled) {
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
        message: "Gemini is disabled in T3 Code settings.",
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
      message: "Gemini provider status has not been checked in this session yet.",
    },
  });
};

export const GeminiProviderLive = Layer.effect(
  GeminiProvider,
  Effect.gen(function* () {
    const serverSettings = yield* ServerSettingsService;
    const fileSystem = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const spawner = yield* ChildProcessSpawner.ChildProcessSpawner;

    const checkProvider = checkGeminiProviderStatus().pipe(
      Effect.provideService(ServerSettingsService, serverSettings),
      Effect.provideService(FileSystem.FileSystem, fileSystem),
      Effect.provideService(Path.Path, path),
      Effect.provideService(ChildProcessSpawner.ChildProcessSpawner, spawner),
    );

    return yield* makeManagedServerProvider<GeminiSettings>({
      getSettings: serverSettings.getSettings.pipe(
        Effect.map((settings) => settings.providers.gemini),
        Effect.orDie,
      ),
      streamSettings: serverSettings.streamChanges.pipe(
        Stream.map((settings) => settings.providers.gemini),
      ),
      haveSettingsChanged: (previous, next) => !Equal.equals(previous, next),
      initialSnapshot: makePendingGeminiProvider,
      checkProvider,
    });
  }),
);
