/**
 * CopilotProvider — snapshot helpers for the GitHub Copilot CLI provider.
 *
 * Provides `checkCopilotProviderStatus` (live binary + auth probe) and
 * `makePendingCopilotProvider` (synchronous pending snapshot) for use by
 * `CopilotDriver`.
 *
 * The Copilot CLI (`copilot`) is ACP-capable. This module only handles
 * presence + version + auth-token detection — the actual ACP session is
 * driven by `CopilotAdapter`.
 *
 * @module provider/Layers/CopilotProvider
 */
import type {
  CopilotSettings,
  ModelCapabilities,
  ProviderDriverKind,
  ServerProviderModel,
} from "@t3tools/contracts";
import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Option from "effect/Option";
import * as Path from "effect/Path";
import * as Result from "effect/Result";
import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process";

import {
  buildServerProvider,
  DEFAULT_TIMEOUT_MS,
  detailFromResult,
  isCommandMissingCause,
  parseGenericCliVersion,
  providerModelsFromSettings,
  type ServerProviderDraft,
  spawnAndCollect,
} from "../providerSnapshot.ts";

const EMPTY_CAPABILITIES: ModelCapabilities = {
  reasoningEffortLevels: [],
  supportsFastMode: false,
  supportsThinkingToggle: false,
  contextWindowOptions: [],
  promptInjectedEffortLevels: [],
};

const PROVIDER: ProviderDriverKind = "copilotAgent" as ProviderDriverKind;
const COPILOT_PRESENTATION = {
  displayName: "Copilot",
  showInteractionModeToggle: false,
} as const;

const BUILT_IN_MODELS: ReadonlyArray<ServerProviderModel> = [
  {
    slug: "claude-sonnet-4.6",
    name: "Claude Sonnet 4.6",
    isCustom: false,
    capabilities: EMPTY_CAPABILITIES,
  },
  {
    slug: "claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    isCustom: false,
    capabilities: EMPTY_CAPABILITIES,
  },
  {
    slug: "claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    isCustom: false,
    capabilities: EMPTY_CAPABILITIES,
  },
  {
    slug: "claude-opus-4.6",
    name: "Claude Opus 4.6",
    isCustom: false,
    capabilities: EMPTY_CAPABILITIES,
  },
  {
    slug: "gpt-5.4",
    name: "GPT-5.4",
    isCustom: false,
    capabilities: EMPTY_CAPABILITIES,
  },
];

const runCopilotCommand = (
  copilotSettings: CopilotSettings,
  args: ReadonlyArray<string>,
  environment: NodeJS.ProcessEnv,
) =>
  Effect.gen(function* () {
    const command = ChildProcess.make(copilotSettings.binaryPath, [...args], {
      shell: process.platform === "win32",
      env: environment,
    });
    return yield* spawnAndCollect(copilotSettings.binaryPath, command);
  });

// GitHub Copilot CLI persists its device-flow auth token under
// `~/.config/github-copilot/hosts.json` (Linux/macOS) or
// `%APPDATA%\GitHub Copilot\hosts.json` (Windows). Checking for the file's
// presence is a cheap proxy for "user has logged in at least once".
function copilotAuthFileCandidates(environment: NodeJS.ProcessEnv, path: Path.Path): string[] {
  const home = environment["HOME"] ?? environment["USERPROFILE"] ?? "~";
  const xdgConfig = environment["XDG_CONFIG_HOME"];
  const appData = environment["APPDATA"];
  const candidates: string[] = [];
  if (xdgConfig) {
    candidates.push(path.join(xdgConfig, "github-copilot", "hosts.json"));
  }
  candidates.push(path.join(home, ".config", "github-copilot", "hosts.json"));
  if (appData) {
    candidates.push(path.join(appData, "GitHub Copilot", "hosts.json"));
  }
  return candidates;
}

const checkCopilotAuth = (environment: NodeJS.ProcessEnv) =>
  Effect.gen(function* () {
    const fileSystem = yield* FileSystem.FileSystem;
    const pathService = yield* Path.Path;
    for (const candidate of copilotAuthFileCandidates(environment, pathService)) {
      const exists = yield* fileSystem
        .exists(candidate)
        .pipe(Effect.orElseSucceed(() => false));
      if (exists) {
        return true;
      }
    }
    return false;
  });

const nowIso = Effect.map(DateTime.now, DateTime.formatIso);

export const checkCopilotProviderStatus = Effect.fn("checkCopilotProviderStatus")(function* (
  copilotSettings: CopilotSettings,
  environment: NodeJS.ProcessEnv = process.env,
): Effect.fn.Return<
  ServerProviderDraft,
  never,
  ChildProcessSpawner.ChildProcessSpawner | FileSystem.FileSystem | Path.Path
> {
  const checkedAt = yield* nowIso;
  const models = providerModelsFromSettings(
    BUILT_IN_MODELS,
    PROVIDER,
    copilotSettings.customModels,
    EMPTY_CAPABILITIES,
  );

  if (!copilotSettings.enabled) {
    return buildServerProvider({
      presentation: COPILOT_PRESENTATION,
      enabled: false,
      checkedAt,
      models,
      probe: {
        installed: false,
        version: null,
        status: "warning",
        auth: { status: "unknown" },
        message: "Copilot is disabled in T3 Code settings.",
      },
    });
  }

  const versionProbe = yield* runCopilotCommand(copilotSettings, ["--version"], environment).pipe(
    Effect.timeoutOption(DEFAULT_TIMEOUT_MS),
    Effect.result,
  );

  if (Result.isFailure(versionProbe)) {
    const error = versionProbe.failure;
    return buildServerProvider({
      presentation: COPILOT_PRESENTATION,
      enabled: copilotSettings.enabled,
      checkedAt,
      models,
      probe: {
        installed: !isCommandMissingCause(error),
        version: null,
        status: "error",
        auth: { status: "unknown" },
        message: isCommandMissingCause(error)
          ? "GitHub Copilot CLI (`copilot`) is not installed or not on PATH."
          : `Failed to execute Copilot CLI health check: ${error instanceof Error ? error.message : String(error)}.`,
      },
    });
  }

  if (Option.isNone(versionProbe.success)) {
    return buildServerProvider({
      presentation: COPILOT_PRESENTATION,
      enabled: copilotSettings.enabled,
      checkedAt,
      models,
      probe: {
        installed: true,
        version: null,
        status: "error",
        auth: { status: "unknown" },
        message: "Copilot CLI is installed but timed out responding to --version.",
      },
    });
  }

  const version = versionProbe.success.value;
  const parsedVersion = parseGenericCliVersion(`${version.stdout}\n${version.stderr}`);
  if (version.code !== 0) {
    const detail = detailFromResult(version);
    return buildServerProvider({
      presentation: COPILOT_PRESENTATION,
      enabled: copilotSettings.enabled,
      checkedAt,
      models,
      probe: {
        installed: true,
        version: parsedVersion,
        status: "error",
        auth: { status: "unknown" },
        message: detail
          ? `Copilot CLI is installed but failed to run. ${detail}`
          : "Copilot CLI is installed but failed to run.",
      },
    });
  }

  const authenticated = yield* checkCopilotAuth(environment).pipe(
    Effect.orElseSucceed(() => false),
  );

  if (authenticated) {
    return buildServerProvider({
      presentation: COPILOT_PRESENTATION,
      enabled: copilotSettings.enabled,
      checkedAt,
      models,
      probe: {
        installed: true,
        version: parsedVersion,
        status: "ready",
        auth: { status: "authenticated", type: "oauth-personal", label: "GitHub Account" },
        message: "Copilot CLI is installed and authenticated.",
      },
    });
  }

  return buildServerProvider({
    presentation: COPILOT_PRESENTATION,
    enabled: copilotSettings.enabled,
    checkedAt,
    models,
    probe: {
      installed: true,
      version: parsedVersion,
      status: "error",
      auth: { status: "unauthenticated" },
      message:
        "Copilot CLI is installed but not authenticated. Run `copilot auth login` to sign in via GitHub.",
    },
  });
});

export const makePendingCopilotProvider = (
  copilotSettings: CopilotSettings,
): Effect.Effect<ServerProviderDraft> =>
  Effect.gen(function* () {
    const checkedAt = yield* nowIso;
    const models = providerModelsFromSettings(
      BUILT_IN_MODELS,
      PROVIDER,
      copilotSettings.customModels,
      EMPTY_CAPABILITIES,
    );

    if (!copilotSettings.enabled) {
      return buildServerProvider({
        presentation: COPILOT_PRESENTATION,
        enabled: false,
        checkedAt,
        models,
        probe: {
          installed: false,
          version: null,
          status: "warning",
          auth: { status: "unknown" },
          message: "Copilot is disabled in T3 Code settings.",
        },
      });
    }

    return buildServerProvider({
      presentation: COPILOT_PRESENTATION,
      enabled: true,
      checkedAt,
      models,
      probe: {
        installed: false,
        version: null,
        status: "warning",
        auth: { status: "unknown" },
        message: "Copilot provider status has not been checked in this session yet.",
      },
    });
  });
