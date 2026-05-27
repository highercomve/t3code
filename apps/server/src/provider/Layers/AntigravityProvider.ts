import type {
  AntigravitySettings,
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
} from "../providerSnapshot.ts";
import { makeManagedServerProvider } from "../makeManagedServerProvider.ts";
import { AntigravityProvider } from "../Services/AntigravityProvider.ts";
import { ServerSettingsError } from "@t3tools/contracts";
import { ServerSettingsService } from "../../serverSettings.ts";

const ANTIGRAVITY_EFFORT_CAPABILITIES: ModelCapabilities = {
  reasoningEffortLevels: [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High", isDefault: true },
    { value: "xhigh", label: "Extra High" },
  ],
  supportsFastMode: false,
  supportsThinkingToggle: false,
  contextWindowOptions: [],
  promptInjectedEffortLevels: [],
};

const DEFAULT_ANTIGRAVITY_MODEL_CAPABILITIES: ModelCapabilities = ANTIGRAVITY_EFFORT_CAPABILITIES;

const PROVIDER = "antigravity" as const;
const ANTIGRAVITY_PRESENTATION = {
  displayName: "Antigravity",
  showInteractionModeToggle: false,
} as const;

const BUILT_IN_MODELS: ReadonlyArray<ServerProviderModel> = [
  {
    slug: "gemini-3.1-pro-high",
    name: "Gemini 3.1 Pro (High)",
    isCustom: false,
    capabilities: ANTIGRAVITY_EFFORT_CAPABILITIES,
  },
  {
    slug: "gemini-3.1-pro-low",
    name: "Gemini 3.1 Pro (Low)",
    isCustom: false,
    capabilities: ANTIGRAVITY_EFFORT_CAPABILITIES,
  },
  {
    slug: "gemini-3.5-flash-high",
    name: "Gemini 3.5 Flash (High)",
    isCustom: false,
    capabilities: ANTIGRAVITY_EFFORT_CAPABILITIES,
  },
  {
    slug: "gemini-3.5-flash-medium",
    name: "Gemini 3.5 Flash (Medium)",
    isCustom: false,
    capabilities: ANTIGRAVITY_EFFORT_CAPABILITIES,
  },
  {
    slug: "gemini-3.5-flash-low",
    name: "Gemini 3.5 Flash (Low)",
    isCustom: false,
    capabilities: ANTIGRAVITY_EFFORT_CAPABILITIES,
  },
  {
    slug: "claude-sonnet-4-6-thinking",
    name: "Claude Sonnet 4.6 (Thinking)",
    isCustom: false,
    capabilities: ANTIGRAVITY_EFFORT_CAPABILITIES,
  },
  {
    slug: "claude-opus-4-6-thinking",
    name: "Claude Opus 4.6 (Thinking)",
    isCustom: false,
    capabilities: ANTIGRAVITY_EFFORT_CAPABILITIES,
  },
  {
    slug: "gpt-oss-120b-medium",
    name: "GPT-OSS 120B (Medium)",
    isCustom: false,
    capabilities: ANTIGRAVITY_EFFORT_CAPABILITIES,
  },
];

const runAntigravityCommand = (args: ReadonlyArray<string>) =>
  Effect.gen(function* () {
    const settingsService = yield* ServerSettingsService;
    const settings = yield* settingsService.getSettings.pipe(
      Effect.map((s) => s.providers.antigravity),
    );
    const command = ChildProcess.make(settings.binaryPath, [...args], {
      shell: process.platform === "win32",
      env: process.env,
    });
    return yield* spawnAndCollect(settings.binaryPath, command);
  });

// agy reuses Gemini's ~/.gemini/ tree, so auth presence is detected via
// google_accounts.json — same shape as the deprecated gemini integration.
function parseGoogleAccountsJson(content: string): boolean {
  const trimmed = content.trim();
  if (!trimmed) return false;
  try {
    const parsed: unknown = JSON.parse(trimmed);
    return !!parsed && typeof parsed === "object" && "active" in (parsed as object);
  } catch {
    return false;
  }
}

const checkAntigravityAuth = Effect.gen(function* () {
  const fileSystem = yield* FileSystem.FileSystem;
  const pathService = yield* Path.Path;
  const home = process.env.HOME ?? "~";
  const accountsFilePath = pathService.join(home, ".gemini", "google_accounts.json");
  const exists = yield* fileSystem.exists(accountsFilePath).pipe(Effect.orElseSucceed(() => false));
  if (!exists) return false;
  const content = yield* fileSystem
    .readFileString(accountsFilePath)
    .pipe(Effect.orElseSucceed(() => ""));
  return parseGoogleAccountsJson(content);
});

export const checkAntigravityProviderStatus = Effect.fn("checkAntigravityProviderStatus")(
  function* (): Effect.fn.Return<
    ServerProvider,
    ServerSettingsError,
    | ChildProcessSpawner.ChildProcessSpawner
    | FileSystem.FileSystem
    | Path.Path
    | ServerSettingsService
  > {
    const settings = yield* Effect.service(ServerSettingsService).pipe(
      Effect.flatMap((service) => service.getSettings),
      Effect.map((s) => s.providers.antigravity),
    );
    const checkedAt = new Date().toISOString();
    const models = providerModelsFromSettings(
      BUILT_IN_MODELS,
      PROVIDER,
      settings.customModels,
      DEFAULT_ANTIGRAVITY_MODEL_CAPABILITIES,
    );

    if (!settings.enabled) {
      return buildServerProvider({
        provider: PROVIDER,
        presentation: ANTIGRAVITY_PRESENTATION,
        enabled: false,
        checkedAt,
        models,
        probe: {
          installed: false,
          version: null,
          status: "warning",
          auth: { status: "unknown" },
          message: "Antigravity is disabled in T3 Code settings.",
        },
      });
    }

    const versionProbe = yield* runAntigravityCommand(["--version"]).pipe(
      Effect.timeoutOption(DEFAULT_TIMEOUT_MS),
      Effect.result,
    );

    if (Result.isFailure(versionProbe)) {
      const error = versionProbe.failure;
      return buildServerProvider({
        provider: PROVIDER,
        presentation: ANTIGRAVITY_PRESENTATION,
        enabled: settings.enabled,
        checkedAt,
        models,
        probe: {
          installed: !isCommandMissingCause(error),
          version: null,
          status: "error",
          auth: { status: "unknown" },
          message: isCommandMissingCause(error)
            ? "Antigravity CLI (`agy`) is not installed or not on PATH."
            : `Failed to execute Antigravity CLI health check: ${error instanceof Error ? error.message : String(error)}.`,
        },
      });
    }

    if (Option.isNone(versionProbe.success)) {
      return buildServerProvider({
        provider: PROVIDER,
        presentation: ANTIGRAVITY_PRESENTATION,
        enabled: settings.enabled,
        checkedAt,
        models,
        probe: {
          installed: true,
          version: null,
          status: "error",
          auth: { status: "unknown" },
          message:
            "Antigravity CLI is installed but failed to run. Timed out while running command.",
        },
      });
    }

    const version = versionProbe.success.value;
    const parsedVersion = parseGenericCliVersion(`${version.stdout}\n${version.stderr}`);
    if (version.code !== 0) {
      const detail = detailFromResult(version);
      return buildServerProvider({
        provider: PROVIDER,
        presentation: ANTIGRAVITY_PRESENTATION,
        enabled: settings.enabled,
        checkedAt,
        models,
        probe: {
          installed: true,
          version: parsedVersion,
          status: "error",
          auth: { status: "unknown" },
          message: detail
            ? `Antigravity CLI is installed but failed to run. ${detail}`
            : "Antigravity CLI is installed but failed to run.",
        },
      });
    }

    const authenticated = yield* checkAntigravityAuth.pipe(Effect.orElseSucceed(() => false));

    if (authenticated) {
      return buildServerProvider({
        provider: PROVIDER,
        presentation: ANTIGRAVITY_PRESENTATION,
        enabled: settings.enabled,
        checkedAt,
        models,
        probe: {
          installed: true,
          version: parsedVersion,
          status: "ready",
          auth: { status: "authenticated", type: "oauth-personal", label: "Google Account" },
          message: "Antigravity CLI is installed and authenticated.",
        },
      });
    }

    return buildServerProvider({
      provider: PROVIDER,
      presentation: ANTIGRAVITY_PRESENTATION,
      enabled: settings.enabled,
      checkedAt,
      models,
      probe: {
        installed: true,
        version: parsedVersion,
        status: "error",
        auth: { status: "unauthenticated" },
        message: "Antigravity CLI is installed but not authenticated. Run `agy` to log in.",
      },
    });
  },
);

const makePendingAntigravityProvider = (settings: AntigravitySettings): ServerProvider => {
  const checkedAt = new Date().toISOString();
  const models = providerModelsFromSettings(
    BUILT_IN_MODELS,
    PROVIDER,
    settings.customModels,
    DEFAULT_ANTIGRAVITY_MODEL_CAPABILITIES,
  );

  if (!settings.enabled) {
    return buildServerProvider({
      provider: PROVIDER,
      presentation: ANTIGRAVITY_PRESENTATION,
      enabled: false,
      checkedAt,
      models,
      probe: {
        installed: false,
        version: null,
        status: "warning",
        auth: { status: "unknown" },
        message: "Antigravity is disabled in T3 Code settings.",
      },
    });
  }

  return buildServerProvider({
    provider: PROVIDER,
    presentation: ANTIGRAVITY_PRESENTATION,
    enabled: true,
    checkedAt,
    models,
    probe: {
      installed: false,
      version: null,
      status: "warning",
      auth: { status: "unknown" },
      message: "Antigravity provider status has not been checked in this session yet.",
    },
  });
};

export const AntigravityProviderLive = Layer.effect(
  AntigravityProvider,
  Effect.gen(function* () {
    const serverSettings = yield* ServerSettingsService;
    const fileSystem = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const spawner = yield* ChildProcessSpawner.ChildProcessSpawner;

    const checkProvider = checkAntigravityProviderStatus().pipe(
      Effect.provideService(ServerSettingsService, serverSettings),
      Effect.provideService(FileSystem.FileSystem, fileSystem),
      Effect.provideService(Path.Path, path),
      Effect.provideService(ChildProcessSpawner.ChildProcessSpawner, spawner),
    );

    return yield* makeManagedServerProvider<AntigravitySettings>({
      getSettings: serverSettings.getSettings.pipe(
        Effect.map((s) => s.providers.antigravity),
        Effect.orDie,
      ),
      streamSettings: serverSettings.streamChanges.pipe(Stream.map((s) => s.providers.antigravity)),
      haveSettingsChanged: (previous, next) => !Equal.equals(previous, next),
      initialSnapshot: makePendingAntigravityProvider,
      checkProvider,
    });
  }),
);
