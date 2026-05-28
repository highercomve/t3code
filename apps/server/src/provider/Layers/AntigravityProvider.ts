/**
 * AntigravityProvider — snapshot helpers for the Antigravity (`agy`) provider.
 *
 * Provides `checkAntigravityProviderStatus` (live probe) and
 * `makePendingAntigravityProvider` (synchronous pending snapshot) for use by
 * `AntigravityDriver`.
 *
 * @module provider/Layers/AntigravityProvider
 */
import type {
  AntigravitySettings,
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

const PROVIDER: ProviderDriverKind = "antigravity" as ProviderDriverKind;
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

const runAntigravityCommand = (
  antigravitySettings: AntigravitySettings,
  args: ReadonlyArray<string>,
  environment: NodeJS.ProcessEnv,
) =>
  Effect.gen(function* () {
    const command = ChildProcess.make(antigravitySettings.binaryPath, [...args], {
      shell: process.platform === "win32",
      env: environment,
    });
    return yield* spawnAndCollect(antigravitySettings.binaryPath, command);
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

const checkAntigravityAuth = (environment: NodeJS.ProcessEnv) =>
  Effect.gen(function* () {
    const fileSystem = yield* FileSystem.FileSystem;
    const pathService = yield* Path.Path;
    const home = environment["HOME"] ?? "~";
    const accountsFilePath = pathService.join(home, ".gemini", "google_accounts.json");
    const exists = yield* fileSystem
      .exists(accountsFilePath)
      .pipe(Effect.orElseSucceed(() => false));
    if (!exists) return false;
    const content = yield* fileSystem
      .readFileString(accountsFilePath)
      .pipe(Effect.orElseSucceed(() => ""));
    return parseGoogleAccountsJson(content);
  });

const nowIso = Effect.map(DateTime.now, DateTime.formatIso);

export const checkAntigravityProviderStatus = Effect.fn("checkAntigravityProviderStatus")(function* (
  antigravitySettings: AntigravitySettings,
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
    antigravitySettings.customModels,
    DEFAULT_ANTIGRAVITY_MODEL_CAPABILITIES,
  );

  if (!antigravitySettings.enabled) {
    return buildServerProvider({
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

  const versionProbe = yield* runAntigravityCommand(antigravitySettings, ["--version"], environment).pipe(
    Effect.timeoutOption(DEFAULT_TIMEOUT_MS),
    Effect.result,
  );

  if (Result.isFailure(versionProbe)) {
    const error = versionProbe.failure;
    return buildServerProvider({
      presentation: ANTIGRAVITY_PRESENTATION,
      enabled: antigravitySettings.enabled,
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
      presentation: ANTIGRAVITY_PRESENTATION,
      enabled: antigravitySettings.enabled,
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
      presentation: ANTIGRAVITY_PRESENTATION,
      enabled: antigravitySettings.enabled,
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

  const authenticated = yield* checkAntigravityAuth(environment).pipe(
    Effect.orElseSucceed(() => false),
  );

  if (authenticated) {
    return buildServerProvider({
      presentation: ANTIGRAVITY_PRESENTATION,
      enabled: antigravitySettings.enabled,
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
    presentation: ANTIGRAVITY_PRESENTATION,
    enabled: antigravitySettings.enabled,
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
});

export const makePendingAntigravityProvider = (
  antigravitySettings: AntigravitySettings,
): Effect.Effect<ServerProviderDraft> =>
  Effect.gen(function* () {
    const checkedAt = yield* nowIso;
    const models = providerModelsFromSettings(
      BUILT_IN_MODELS,
      PROVIDER,
      antigravitySettings.customModels,
      DEFAULT_ANTIGRAVITY_MODEL_CAPABILITIES,
    );

    if (!antigravitySettings.enabled) {
      return buildServerProvider({
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
  });
