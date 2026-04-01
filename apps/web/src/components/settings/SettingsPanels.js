import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import {
  ArchiveIcon,
  ArchiveX,
  ChevronDownIcon,
  InfoIcon,
  LoaderIcon,
  PlusIcon,
  RefreshCwIcon,
  Undo2Icon,
  XIcon,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PROVIDER_DISPLAY_NAMES } from "@t3tools/contracts";
import { DEFAULT_UNIFIED_SETTINGS } from "@t3tools/contracts/settings";
import { normalizeModelSlug } from "@t3tools/shared/model";
import { Equal } from "effect";
import { APP_VERSION } from "../../branding";
import {
  canCheckForUpdate,
  getDesktopUpdateButtonTooltip,
  getDesktopUpdateInstallConfirmationMessage,
  isDesktopUpdateButtonDisabled,
  resolveDesktopUpdateButtonAction,
} from "../../components/desktopUpdate.logic";
import { ProviderModelPicker } from "../chat/ProviderModelPicker";
import { TraitsPicker } from "../chat/TraitsPicker";
import { resolveAndPersistPreferredEditor } from "../../editorPreferences";
import { isElectron } from "../../env";
import { useTheme } from "../../hooks/useTheme";
import { useSettings, useUpdateSettings } from "../../hooks/useSettings";
import { useThreadActions } from "../../hooks/useThreadActions";
import {
  setDesktopUpdateStateQueryData,
  useDesktopUpdateState,
} from "../../lib/desktopUpdateReactQuery";
import { serverConfigQueryOptions, serverQueryKeys } from "../../lib/serverReactQuery";
import {
  MAX_CUSTOM_MODEL_LENGTH,
  buildModelSelection,
  getCustomModelOptionsByProvider,
  resolveAppModelSelectionState,
} from "../../modelSelection";
import { ensureNativeApi, readNativeApi } from "../../nativeApi";
import { useStore } from "../../store";
import { formatRelativeTime, formatRelativeTimeLabel } from "../../timestampFormat";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { Input } from "../ui/input";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { toastManager } from "../ui/toast";
import { Tooltip, TooltipPopup, TooltipTrigger } from "../ui/tooltip";
import { ProjectFavicon } from "../ProjectFavicon";
const THEME_OPTIONS = [
  {
    value: "system",
    label: "System",
  },
  {
    value: "light",
    label: "Light",
  },
  {
    value: "dark",
    label: "Dark",
  },
];
const TIMESTAMP_FORMAT_LABELS = {
  locale: "System default",
  "12-hour": "12-hour",
  "24-hour": "24-hour",
};
const EMPTY_SERVER_PROVIDERS = [];
const PROVIDER_SETTINGS = [
  {
    provider: "codex",
    title: "Codex",
    binaryPlaceholder: "Codex binary path",
    binaryDescription: "Path to the Codex binary",
    homePathKey: "codexHomePath",
    homePlaceholder: "CODEX_HOME",
    homeDescription: "Optional custom Codex home and config directory.",
  },
  {
    provider: "claudeAgent",
    title: "Claude",
    binaryPlaceholder: "Claude binary path",
    binaryDescription: "Path to the Claude binary",
  },
  {
    provider: "gemini",
    title: "Gemini",
    binaryPlaceholder: "Gemini binary path",
    binaryDescription: "Path to the Gemini CLI binary",
  },
  {
    provider: "opencode",
    title: "OpenCode",
    binaryPlaceholder: "OpenCode binary path",
    binaryDescription: "Path to the OpenCode binary",
  },
  {
    provider: "copilotAgent",
    title: "Copilot",
    binaryPlaceholder: "Copilot binary path",
    binaryDescription: "Path to the Copilot binary",
  },
];
const PROVIDER_STATUS_STYLES = {
  disabled: {
    dot: "bg-amber-400",
  },
  error: {
    dot: "bg-destructive",
  },
  ready: {
    dot: "bg-success",
  },
  warning: {
    dot: "bg-warning",
  },
};
function getProviderSummary(provider) {
  if (!provider) {
    return {
      headline: "Checking provider status",
      detail: "Waiting for the server to report installation and authentication details.",
    };
  }
  if (!provider.enabled) {
    return {
      headline: "Disabled",
      detail:
        provider.message ?? "This provider is installed but disabled for new sessions in T3 Code.",
    };
  }
  if (!provider.installed) {
    return {
      headline: "Not found",
      detail: provider.message ?? "CLI not detected on PATH.",
    };
  }
  if (provider.auth.status === "authenticated") {
    const authLabel = provider.auth.label ?? provider.auth.type;
    return {
      headline: authLabel ? `Authenticated · ${authLabel}` : "Authenticated",
      detail: provider.message ?? null,
    };
  }
  if (provider.auth.status === "unauthenticated") {
    return {
      headline: "Not authenticated",
      detail: provider.message ?? null,
    };
  }
  if (provider.status === "warning") {
    return {
      headline: "Needs attention",
      detail:
        provider.message ?? "The provider is installed, but the server could not fully verify it.",
    };
  }
  if (provider.status === "error") {
    return {
      headline: "Unavailable",
      detail: provider.message ?? "The provider failed its startup checks.",
    };
  }
  return {
    headline: "Available",
    detail: provider.message ?? "Installed and ready, but authentication could not be verified.",
  };
}
function getProviderVersionLabel(version) {
  if (!version) return null;
  return version.startsWith("v") ? version : `v${version}`;
}
function useRelativeTimeTick(intervalMs = 1_000) {
  const [tick, setTick] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setTick(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return tick;
}
function ProviderLastChecked({ lastCheckedAt }) {
  useRelativeTimeTick();
  const lastCheckedRelative = lastCheckedAt ? formatRelativeTime(lastCheckedAt) : null;
  if (!lastCheckedRelative) {
    return null;
  }
  return _jsx("span", {
    className: "text-[11px] text-muted-foreground/60",
    children: lastCheckedRelative.suffix
      ? _jsxs(_Fragment, {
          children: [
            "Checked ",
            _jsx("span", {
              className: "font-mono tabular-nums",
              children: lastCheckedRelative.value,
            }),
            " ",
            lastCheckedRelative.suffix,
          ],
        })
      : _jsxs(_Fragment, { children: ["Checked ", lastCheckedRelative.value] }),
  });
}
function SettingsSection({ title, icon, headerAction, children }) {
  return _jsxs("section", {
    className: "space-y-3",
    children: [
      _jsxs("div", {
        className: "flex items-center justify-between",
        children: [
          _jsxs("h2", {
            className:
              "flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground",
            children: [icon, title],
          }),
          headerAction,
        ],
      }),
      _jsx("div", {
        className:
          "relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xs/5 not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        children: children,
      }),
    ],
  });
}
function SettingsRow({ title, description, status, resetAction, control, children }) {
  return _jsxs("div", {
    className: "border-t border-border px-4 py-4 first:border-t-0 sm:px-5",
    children: [
      _jsxs("div", {
        className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        children: [
          _jsxs("div", {
            className: "min-w-0 flex-1 space-y-1",
            children: [
              _jsxs("div", {
                className: "flex min-h-5 items-center gap-1.5",
                children: [
                  _jsx("h3", { className: "text-sm font-medium text-foreground", children: title }),
                  _jsx("span", {
                    className: "inline-flex h-5 w-5 shrink-0 items-center justify-center",
                    children: resetAction,
                  }),
                ],
              }),
              _jsx("p", { className: "text-xs text-muted-foreground", children: description }),
              status
                ? _jsx("div", {
                    className: "pt-1 text-[11px] text-muted-foreground",
                    children: status,
                  })
                : null,
            ],
          }),
          control
            ? _jsx("div", {
                className: "flex w-full shrink-0 items-center gap-2 sm:w-auto sm:justify-end",
                children: control,
              })
            : null,
        ],
      }),
      children,
    ],
  });
}
function SettingResetButton({ label, onClick }) {
  return _jsxs(Tooltip, {
    children: [
      _jsx(TooltipTrigger, {
        render: _jsx(Button, {
          size: "icon-xs",
          variant: "ghost",
          "aria-label": `Reset ${label} to default`,
          className: "size-5 rounded-sm p-0 text-muted-foreground hover:text-foreground",
          onClick: (event) => {
            event.stopPropagation();
            onClick();
          },
          children: _jsx(Undo2Icon, { className: "size-3" }),
        }),
      }),
      _jsx(TooltipPopup, { side: "top", children: "Reset to default" }),
    ],
  });
}
function SettingsPageContainer({ children }) {
  return _jsx("div", {
    className: "flex-1 overflow-y-auto p-6",
    children: _jsx("div", {
      className: "mx-auto flex w-full max-w-4xl flex-col gap-6",
      children: children,
    }),
  });
}
function AboutVersionTitle() {
  return _jsxs("span", {
    className: "inline-flex items-center gap-2",
    children: [
      _jsx("span", { children: "Version" }),
      _jsx("code", {
        className: "text-[11px] font-medium text-muted-foreground",
        children: APP_VERSION,
      }),
    ],
  });
}
function AboutVersionSection() {
  const queryClient = useQueryClient();
  const updateStateQuery = useDesktopUpdateState();
  const updateState = updateStateQuery.data ?? null;
  const handleButtonClick = useCallback(() => {
    const bridge = window.desktopBridge;
    if (!bridge) return;
    const action = updateState ? resolveDesktopUpdateButtonAction(updateState) : "none";
    if (action === "download") {
      void bridge
        .downloadUpdate()
        .then((result) => {
          setDesktopUpdateStateQueryData(queryClient, result.state);
        })
        .catch((error) => {
          toastManager.add({
            type: "error",
            title: "Could not download update",
            description: error instanceof Error ? error.message : "Download failed.",
          });
        });
      return;
    }
    if (action === "install") {
      const confirmed = window.confirm(
        getDesktopUpdateInstallConfirmationMessage(
          updateState ?? { availableVersion: null, downloadedVersion: null },
        ),
      );
      if (!confirmed) return;
      void bridge
        .installUpdate()
        .then((result) => {
          setDesktopUpdateStateQueryData(queryClient, result.state);
        })
        .catch((error) => {
          toastManager.add({
            type: "error",
            title: "Could not install update",
            description: error instanceof Error ? error.message : "Install failed.",
          });
        });
      return;
    }
    if (typeof bridge.checkForUpdate !== "function") return;
    void bridge
      .checkForUpdate()
      .then((result) => {
        setDesktopUpdateStateQueryData(queryClient, result.state);
        if (!result.checked) {
          toastManager.add({
            type: "error",
            title: "Could not check for updates",
            description:
              result.state.message ?? "Automatic updates are not available in this build.",
          });
        }
      })
      .catch((error) => {
        toastManager.add({
          type: "error",
          title: "Could not check for updates",
          description: error instanceof Error ? error.message : "Update check failed.",
        });
      });
  }, [queryClient, updateState]);
  const action = updateState ? resolveDesktopUpdateButtonAction(updateState) : "none";
  const buttonTooltip = updateState ? getDesktopUpdateButtonTooltip(updateState) : null;
  const buttonDisabled =
    action === "none"
      ? !canCheckForUpdate(updateState)
      : isDesktopUpdateButtonDisabled(updateState);
  const actionLabel = { download: "Download", install: "Install" };
  const statusLabel = {
    checking: "Checking…",
    downloading: "Downloading…",
    "up-to-date": "Up to Date",
  };
  const buttonLabel =
    actionLabel[action] ?? statusLabel[updateState?.status ?? ""] ?? "Check for Updates";
  const description =
    action === "download" || action === "install"
      ? "Update available."
      : "Current version of the application.";
  return _jsx(SettingsRow, {
    title: _jsx(AboutVersionTitle, {}),
    description: description,
    control: _jsxs(Tooltip, {
      children: [
        _jsx(TooltipTrigger, {
          render: _jsx(Button, {
            size: "xs",
            variant: action === "install" ? "default" : "outline",
            disabled: buttonDisabled,
            onClick: handleButtonClick,
            children: buttonLabel,
          }),
        }),
        buttonTooltip ? _jsx(TooltipPopup, { children: buttonTooltip }) : null,
      ],
    }),
  });
}
export function useSettingsRestore(onRestored) {
  const { theme, setTheme } = useTheme();
  const settings = useSettings();
  const { resetSettings } = useUpdateSettings();
  const isGitWritingModelDirty = !Equal.equals(
    settings.textGenerationModelSelection ?? null,
    DEFAULT_UNIFIED_SETTINGS.textGenerationModelSelection ?? null,
  );
  const areProviderSettingsDirty = PROVIDER_SETTINGS.some((providerSettings) => {
    const currentSettings = settings.providers[providerSettings.provider];
    const defaultSettings = DEFAULT_UNIFIED_SETTINGS.providers[providerSettings.provider];
    return !Equal.equals(currentSettings, defaultSettings);
  });
  const changedSettingLabels = useMemo(
    () => [
      ...(theme !== "system" ? ["Theme"] : []),
      ...(settings.timestampFormat !== DEFAULT_UNIFIED_SETTINGS.timestampFormat
        ? ["Time format"]
        : []),
      ...(settings.diffWordWrap !== DEFAULT_UNIFIED_SETTINGS.diffWordWrap
        ? ["Diff line wrapping"]
        : []),
      ...(settings.enableAssistantStreaming !== DEFAULT_UNIFIED_SETTINGS.enableAssistantStreaming
        ? ["Assistant output"]
        : []),
      ...(settings.defaultThreadEnvMode !== DEFAULT_UNIFIED_SETTINGS.defaultThreadEnvMode
        ? ["New thread mode"]
        : []),
      ...(settings.confirmThreadArchive !== DEFAULT_UNIFIED_SETTINGS.confirmThreadArchive
        ? ["Archive confirmation"]
        : []),
      ...(settings.confirmThreadDelete !== DEFAULT_UNIFIED_SETTINGS.confirmThreadDelete
        ? ["Delete confirmation"]
        : []),
      ...(isGitWritingModelDirty ? ["Git writing model"] : []),
      ...(areProviderSettingsDirty ? ["Providers"] : []),
    ],
    [
      areProviderSettingsDirty,
      isGitWritingModelDirty,
      settings.confirmThreadArchive,
      settings.confirmThreadDelete,
      settings.defaultThreadEnvMode,
      settings.diffWordWrap,
      settings.enableAssistantStreaming,
      settings.timestampFormat,
      theme,
    ],
  );
  const restoreDefaults = useCallback(async () => {
    if (changedSettingLabels.length === 0) return;
    const api = readNativeApi();
    const confirmed = await (api ?? ensureNativeApi()).dialogs.confirm(
      ["Restore default settings?", `This will reset: ${changedSettingLabels.join(", ")}.`].join(
        "\n",
      ),
    );
    if (!confirmed) return;
    setTheme("system");
    resetSettings();
    onRestored?.();
  }, [changedSettingLabels, onRestored, resetSettings, setTheme]);
  return {
    changedSettingLabels,
    restoreDefaults,
  };
}
export function GeneralSettingsPanel() {
  const { theme, setTheme } = useTheme();
  const settings = useSettings();
  const { updateSettings } = useUpdateSettings();
  const serverConfigQuery = useQuery(serverConfigQueryOptions());
  const [isOpeningKeybindings, setIsOpeningKeybindings] = useState(false);
  const [openKeybindingsError, setOpenKeybindingsError] = useState(null);
  const [openProviderDetails, setOpenProviderDetails] = useState({
    codex: Boolean(
      settings.providers.codex.binaryPath !== DEFAULT_UNIFIED_SETTINGS.providers.codex.binaryPath ||
      settings.providers.codex.homePath !== DEFAULT_UNIFIED_SETTINGS.providers.codex.homePath ||
      settings.providers.codex.customModels.length > 0,
    ),
    claudeAgent: Boolean(
      settings.providers.claudeAgent.binaryPath !==
        DEFAULT_UNIFIED_SETTINGS.providers.claudeAgent.binaryPath ||
      settings.providers.claudeAgent.customModels.length > 0,
    ),
    gemini: Boolean(
      settings.providers.gemini.binaryPath !==
        DEFAULT_UNIFIED_SETTINGS.providers.gemini.binaryPath ||
      settings.providers.gemini.customModels.length > 0,
    ),
    opencode: Boolean(
      settings.providers.opencode.binaryPath !==
        DEFAULT_UNIFIED_SETTINGS.providers.opencode.binaryPath ||
      settings.providers.opencode.customModels.length > 0,
    ),
    copilotAgent: Boolean(
      settings.providers.copilotAgent.binaryPath !==
        DEFAULT_UNIFIED_SETTINGS.providers.copilotAgent.binaryPath ||
      settings.providers.copilotAgent.customModels.length > 0,
    ),
  });
  const [customModelInputByProvider, setCustomModelInputByProvider] = useState({
    codex: "",
    claudeAgent: "",
    gemini: "",
    opencode: "",
    copilotAgent: "",
  });
  const [customModelErrorByProvider, setCustomModelErrorByProvider] = useState({});
  const [isRefreshingProviders, setIsRefreshingProviders] = useState(false);
  const refreshingRef = useRef(false);
  const queryClient = useQueryClient();
  const modelListRefs = useRef({});
  const refreshProviders = useCallback(() => {
    if (refreshingRef.current) return;
    refreshingRef.current = true;
    setIsRefreshingProviders(true);
    void ensureNativeApi()
      .server.refreshProviders()
      .then(() => queryClient.invalidateQueries({ queryKey: serverQueryKeys.config() }))
      .catch((error) => {
        console.warn("Failed to refresh providers", error);
      })
      .finally(() => {
        refreshingRef.current = false;
        setIsRefreshingProviders(false);
      });
  }, [queryClient]);
  const keybindingsConfigPath = serverConfigQuery.data?.keybindingsConfigPath ?? null;
  const availableEditors = serverConfigQuery.data?.availableEditors;
  const serverProviders = serverConfigQuery.data?.providers ?? EMPTY_SERVER_PROVIDERS;
  const codexHomePath = settings.providers.codex.homePath;
  const textGenerationModelSelection = resolveAppModelSelectionState(settings, serverProviders);
  const textGenProvider = textGenerationModelSelection.provider;
  const textGenModel = textGenerationModelSelection.model;
  const textGenModelOptions = textGenerationModelSelection.options;
  const gitModelOptionsByProvider = getCustomModelOptionsByProvider(
    settings,
    serverProviders,
    textGenProvider,
    textGenModel,
  );
  const isGitWritingModelDirty = !Equal.equals(
    settings.textGenerationModelSelection ?? null,
    DEFAULT_UNIFIED_SETTINGS.textGenerationModelSelection ?? null,
  );
  const openKeybindingsFile = useCallback(() => {
    if (!keybindingsConfigPath) return;
    setOpenKeybindingsError(null);
    setIsOpeningKeybindings(true);
    const editor = resolveAndPersistPreferredEditor(availableEditors ?? []);
    if (!editor) {
      setOpenKeybindingsError("No available editors found.");
      setIsOpeningKeybindings(false);
      return;
    }
    void ensureNativeApi()
      .shell.openInEditor(keybindingsConfigPath, editor)
      .catch((error) => {
        setOpenKeybindingsError(
          error instanceof Error ? error.message : "Unable to open keybindings file.",
        );
      })
      .finally(() => {
        setIsOpeningKeybindings(false);
      });
  }, [availableEditors, keybindingsConfigPath]);
  const addCustomModel = useCallback(
    (provider) => {
      const customModelInput = customModelInputByProvider[provider];
      const customModels = settings.providers[provider].customModels;
      const normalized = normalizeModelSlug(customModelInput, provider);
      if (!normalized) {
        setCustomModelErrorByProvider((existing) => ({
          ...existing,
          [provider]: "Enter a model slug.",
        }));
        return;
      }
      if (
        serverProviders
          .find((candidate) => candidate.provider === provider)
          ?.models.some((option) => !option.isCustom && option.slug === normalized)
      ) {
        setCustomModelErrorByProvider((existing) => ({
          ...existing,
          [provider]: "That model is already built in.",
        }));
        return;
      }
      if (normalized.length > MAX_CUSTOM_MODEL_LENGTH) {
        setCustomModelErrorByProvider((existing) => ({
          ...existing,
          [provider]: `Model slugs must be ${MAX_CUSTOM_MODEL_LENGTH} characters or less.`,
        }));
        return;
      }
      if (customModels.includes(normalized)) {
        setCustomModelErrorByProvider((existing) => ({
          ...existing,
          [provider]: "That custom model is already saved.",
        }));
        return;
      }
      updateSettings({
        providers: {
          ...settings.providers,
          [provider]: {
            ...settings.providers[provider],
            customModels: [...customModels, normalized],
          },
        },
      });
      setCustomModelInputByProvider((existing) => ({
        ...existing,
        [provider]: "",
      }));
      setCustomModelErrorByProvider((existing) => ({
        ...existing,
        [provider]: null,
      }));
      const el = modelListRefs.current[provider];
      if (!el) return;
      const scrollToEnd = () => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      requestAnimationFrame(scrollToEnd);
      const observer = new MutationObserver(() => {
        scrollToEnd();
        observer.disconnect();
      });
      observer.observe(el, { childList: true, subtree: true });
      setTimeout(() => observer.disconnect(), 2_000);
    },
    [customModelInputByProvider, serverProviders, settings, updateSettings],
  );
  const removeCustomModel = useCallback(
    (provider, slug) => {
      updateSettings({
        providers: {
          ...settings.providers,
          [provider]: {
            ...settings.providers[provider],
            customModels: settings.providers[provider].customModels.filter(
              (model) => model !== slug,
            ),
          },
        },
      });
      setCustomModelErrorByProvider((existing) => ({
        ...existing,
        [provider]: null,
      }));
    },
    [settings, updateSettings],
  );
  const providerCards = PROVIDER_SETTINGS.map((providerSettings) => {
    const liveProvider = serverProviders.find(
      (candidate) => candidate.provider === providerSettings.provider,
    );
    const providerConfig = settings.providers[providerSettings.provider];
    const defaultProviderConfig = DEFAULT_UNIFIED_SETTINGS.providers[providerSettings.provider];
    const statusKey = liveProvider?.status ?? (providerConfig.enabled ? "warning" : "disabled");
    const summary = getProviderSummary(liveProvider);
    const models =
      liveProvider?.models ??
      providerConfig.customModels.map((slug) => ({
        slug,
        name: slug,
        isCustom: true,
        capabilities: null,
      }));
    return {
      provider: providerSettings.provider,
      title: providerSettings.title,
      binaryPlaceholder: providerSettings.binaryPlaceholder,
      binaryDescription: providerSettings.binaryDescription,
      homePathKey: providerSettings.homePathKey,
      homePlaceholder: providerSettings.homePlaceholder,
      homeDescription: providerSettings.homeDescription,
      binaryPathValue: providerConfig.binaryPath,
      isDirty: !Equal.equals(providerConfig, defaultProviderConfig),
      liveProvider,
      models,
      providerConfig,
      statusStyle: PROVIDER_STATUS_STYLES[statusKey],
      summary,
      versionLabel: getProviderVersionLabel(liveProvider?.version),
    };
  });
  const lastCheckedAt =
    serverProviders.length > 0
      ? serverProviders.reduce(
          (latest, provider) => (provider.checkedAt > latest ? provider.checkedAt : latest),
          serverProviders[0].checkedAt,
        )
      : null;
  return _jsxs(SettingsPageContainer, {
    children: [
      _jsxs(SettingsSection, {
        title: "General",
        children: [
          _jsx(SettingsRow, {
            title: "Theme",
            description: "Choose how T3 Code looks across the app.",
            resetAction:
              theme !== "system"
                ? _jsx(SettingResetButton, { label: "theme", onClick: () => setTheme("system") })
                : null,
            control: _jsxs(Select, {
              value: theme,
              onValueChange: (value) => {
                if (value === "system" || value === "light" || value === "dark") {
                  setTheme(value);
                }
              },
              children: [
                _jsx(SelectTrigger, {
                  className: "w-full sm:w-40",
                  "aria-label": "Theme preference",
                  children: _jsx(SelectValue, {
                    children:
                      THEME_OPTIONS.find((option) => option.value === theme)?.label ?? "System",
                  }),
                }),
                _jsx(SelectPopup, {
                  align: "end",
                  alignItemWithTrigger: false,
                  children: THEME_OPTIONS.map((option) =>
                    _jsx(
                      SelectItem,
                      { hideIndicator: true, value: option.value, children: option.label },
                      option.value,
                    ),
                  ),
                }),
              ],
            }),
          }),
          _jsx(SettingsRow, {
            title: "Time format",
            description: "System default follows your browser or OS clock preference.",
            resetAction:
              settings.timestampFormat !== DEFAULT_UNIFIED_SETTINGS.timestampFormat
                ? _jsx(SettingResetButton, {
                    label: "time format",
                    onClick: () =>
                      updateSettings({
                        timestampFormat: DEFAULT_UNIFIED_SETTINGS.timestampFormat,
                      }),
                  })
                : null,
            control: _jsxs(Select, {
              value: settings.timestampFormat,
              onValueChange: (value) => {
                if (value === "locale" || value === "12-hour" || value === "24-hour") {
                  updateSettings({ timestampFormat: value });
                }
              },
              children: [
                _jsx(SelectTrigger, {
                  className: "w-full sm:w-40",
                  "aria-label": "Timestamp format",
                  children: _jsx(SelectValue, {
                    children: TIMESTAMP_FORMAT_LABELS[settings.timestampFormat],
                  }),
                }),
                _jsxs(SelectPopup, {
                  align: "end",
                  alignItemWithTrigger: false,
                  children: [
                    _jsx(SelectItem, {
                      hideIndicator: true,
                      value: "locale",
                      children: TIMESTAMP_FORMAT_LABELS.locale,
                    }),
                    _jsx(SelectItem, {
                      hideIndicator: true,
                      value: "12-hour",
                      children: TIMESTAMP_FORMAT_LABELS["12-hour"],
                    }),
                    _jsx(SelectItem, {
                      hideIndicator: true,
                      value: "24-hour",
                      children: TIMESTAMP_FORMAT_LABELS["24-hour"],
                    }),
                  ],
                }),
              ],
            }),
          }),
          _jsx(SettingsRow, {
            title: "Diff line wrapping",
            description: "Set the default wrap state when the diff panel opens.",
            resetAction:
              settings.diffWordWrap !== DEFAULT_UNIFIED_SETTINGS.diffWordWrap
                ? _jsx(SettingResetButton, {
                    label: "diff line wrapping",
                    onClick: () =>
                      updateSettings({
                        diffWordWrap: DEFAULT_UNIFIED_SETTINGS.diffWordWrap,
                      }),
                  })
                : null,
            control: _jsx(Switch, {
              checked: settings.diffWordWrap,
              onCheckedChange: (checked) => updateSettings({ diffWordWrap: Boolean(checked) }),
              "aria-label": "Wrap diff lines by default",
            }),
          }),
          _jsx(SettingsRow, {
            title: "Assistant output",
            description: "Show token-by-token output while a response is in progress.",
            resetAction:
              settings.enableAssistantStreaming !==
              DEFAULT_UNIFIED_SETTINGS.enableAssistantStreaming
                ? _jsx(SettingResetButton, {
                    label: "assistant output",
                    onClick: () =>
                      updateSettings({
                        enableAssistantStreaming: DEFAULT_UNIFIED_SETTINGS.enableAssistantStreaming,
                      }),
                  })
                : null,
            control: _jsx(Switch, {
              checked: settings.enableAssistantStreaming,
              onCheckedChange: (checked) =>
                updateSettings({ enableAssistantStreaming: Boolean(checked) }),
              "aria-label": "Stream assistant messages",
            }),
          }),
          _jsx(SettingsRow, {
            title: "New threads",
            description: "Pick the default workspace mode for newly created draft threads.",
            resetAction:
              settings.defaultThreadEnvMode !== DEFAULT_UNIFIED_SETTINGS.defaultThreadEnvMode
                ? _jsx(SettingResetButton, {
                    label: "new threads",
                    onClick: () =>
                      updateSettings({
                        defaultThreadEnvMode: DEFAULT_UNIFIED_SETTINGS.defaultThreadEnvMode,
                      }),
                  })
                : null,
            control: _jsxs(Select, {
              value: settings.defaultThreadEnvMode,
              onValueChange: (value) => {
                if (value === "local" || value === "worktree") {
                  updateSettings({ defaultThreadEnvMode: value });
                }
              },
              children: [
                _jsx(SelectTrigger, {
                  className: "w-full sm:w-44",
                  "aria-label": "Default thread mode",
                  children: _jsx(SelectValue, {
                    children:
                      settings.defaultThreadEnvMode === "worktree" ? "New worktree" : "Local",
                  }),
                }),
                _jsxs(SelectPopup, {
                  align: "end",
                  alignItemWithTrigger: false,
                  children: [
                    _jsx(SelectItem, { hideIndicator: true, value: "local", children: "Local" }),
                    _jsx(SelectItem, {
                      hideIndicator: true,
                      value: "worktree",
                      children: "New worktree",
                    }),
                  ],
                }),
              ],
            }),
          }),
          _jsx(SettingsRow, {
            title: "Archive confirmation",
            description:
              "Require a second click on the inline archive action before a thread is archived.",
            resetAction:
              settings.confirmThreadArchive !== DEFAULT_UNIFIED_SETTINGS.confirmThreadArchive
                ? _jsx(SettingResetButton, {
                    label: "archive confirmation",
                    onClick: () =>
                      updateSettings({
                        confirmThreadArchive: DEFAULT_UNIFIED_SETTINGS.confirmThreadArchive,
                      }),
                  })
                : null,
            control: _jsx(Switch, {
              checked: settings.confirmThreadArchive,
              onCheckedChange: (checked) =>
                updateSettings({ confirmThreadArchive: Boolean(checked) }),
              "aria-label": "Confirm thread archiving",
            }),
          }),
          _jsx(SettingsRow, {
            title: "Delete confirmation",
            description: "Ask before deleting a thread and its chat history.",
            resetAction:
              settings.confirmThreadDelete !== DEFAULT_UNIFIED_SETTINGS.confirmThreadDelete
                ? _jsx(SettingResetButton, {
                    label: "delete confirmation",
                    onClick: () =>
                      updateSettings({
                        confirmThreadDelete: DEFAULT_UNIFIED_SETTINGS.confirmThreadDelete,
                      }),
                  })
                : null,
            control: _jsx(Switch, {
              checked: settings.confirmThreadDelete,
              onCheckedChange: (checked) =>
                updateSettings({ confirmThreadDelete: Boolean(checked) }),
              "aria-label": "Confirm thread deletion",
            }),
          }),
          _jsx(SettingsRow, {
            title: "Text generation model",
            description:
              "Configure the model used for generated commit messages, PR titles, and similar Git text.",
            resetAction: isGitWritingModelDirty
              ? _jsx(SettingResetButton, {
                  label: "text generation model",
                  onClick: () =>
                    updateSettings({
                      textGenerationModelSelection:
                        DEFAULT_UNIFIED_SETTINGS.textGenerationModelSelection,
                    }),
                })
              : null,
            control: _jsxs("div", {
              className: "flex flex-wrap items-center justify-end gap-1.5",
              children: [
                _jsx(ProviderModelPicker, {
                  provider: textGenProvider,
                  model: textGenModel,
                  lockedProvider: null,
                  providers: serverProviders,
                  modelOptionsByProvider: gitModelOptionsByProvider,
                  triggerVariant: "outline",
                  triggerClassName:
                    "min-w-0 max-w-none shrink-0 text-foreground/90 hover:text-foreground",
                  onProviderModelChange: (provider, model) => {
                    updateSettings({
                      textGenerationModelSelection: resolveAppModelSelectionState(
                        {
                          ...settings,
                          textGenerationModelSelection: { provider, model },
                        },
                        serverProviders,
                      ),
                    });
                  },
                }),
                _jsx(TraitsPicker, {
                  provider: textGenProvider,
                  models:
                    serverProviders.find((provider) => provider.provider === textGenProvider)
                      ?.models ?? [],
                  model: textGenModel,
                  prompt: "",
                  onPromptChange: () => {},
                  modelOptions: textGenModelOptions,
                  allowPromptInjectedEffort: false,
                  triggerVariant: "outline",
                  triggerClassName:
                    "min-w-0 max-w-none shrink-0 text-foreground/90 hover:text-foreground",
                  onModelOptionsChange: (nextOptions) => {
                    updateSettings({
                      textGenerationModelSelection: resolveAppModelSelectionState(
                        {
                          ...settings,
                          textGenerationModelSelection: buildModelSelection(
                            textGenProvider,
                            textGenModel,
                            nextOptions ?? undefined,
                          ),
                        },
                        serverProviders,
                      ),
                    });
                  },
                }),
              ],
            }),
          }),
        ],
      }),
      _jsx(SettingsSection, {
        title: "Providers",
        headerAction: _jsxs("div", {
          className: "flex items-center gap-1.5",
          children: [
            _jsx(ProviderLastChecked, { lastCheckedAt: lastCheckedAt }),
            _jsxs(Tooltip, {
              children: [
                _jsx(TooltipTrigger, {
                  render: _jsx(Button, {
                    size: "icon-xs",
                    variant: "ghost",
                    className: "size-5 rounded-sm p-0 text-muted-foreground hover:text-foreground",
                    disabled: isRefreshingProviders,
                    onClick: () => void refreshProviders(),
                    "aria-label": "Refresh provider status",
                    children: isRefreshingProviders
                      ? _jsx(LoaderIcon, { className: "size-3 animate-spin" })
                      : _jsx(RefreshCwIcon, { className: "size-3" }),
                  }),
                }),
                _jsx(TooltipPopup, { side: "top", children: "Refresh provider status" }),
              ],
            }),
          ],
        }),
        children: providerCards.map((providerCard) => {
          const customModelInput = customModelInputByProvider[providerCard.provider];
          const customModelError = customModelErrorByProvider[providerCard.provider] ?? null;
          const providerDisplayName =
            PROVIDER_DISPLAY_NAMES[providerCard.provider] ?? providerCard.title;
          return _jsxs(
            "div",
            {
              className: "border-t border-border first:border-t-0",
              children: [
                _jsx("div", {
                  className: "px-4 py-4 sm:px-5",
                  children: _jsxs("div", {
                    className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
                    children: [
                      _jsxs("div", {
                        className: "min-w-0 flex-1 space-y-1",
                        children: [
                          _jsxs("div", {
                            className: "flex min-h-5 items-center gap-1.5",
                            children: [
                              _jsx("span", {
                                className: cn(
                                  "size-2 shrink-0 rounded-full",
                                  providerCard.statusStyle.dot,
                                ),
                              }),
                              _jsx("h3", {
                                className: "text-sm font-medium text-foreground",
                                children: providerDisplayName,
                              }),
                              providerCard.versionLabel
                                ? _jsx("code", {
                                    className: "text-xs text-muted-foreground",
                                    children: providerCard.versionLabel,
                                  })
                                : null,
                              _jsx("span", {
                                className:
                                  "inline-flex h-5 w-5 shrink-0 items-center justify-center",
                                children: providerCard.isDirty
                                  ? _jsx(SettingResetButton, {
                                      label: `${providerDisplayName} provider settings`,
                                      onClick: () => {
                                        updateSettings({
                                          providers: {
                                            ...settings.providers,
                                            [providerCard.provider]:
                                              DEFAULT_UNIFIED_SETTINGS.providers[
                                                providerCard.provider
                                              ],
                                          },
                                        });
                                        setCustomModelErrorByProvider((existing) => ({
                                          ...existing,
                                          [providerCard.provider]: null,
                                        }));
                                      },
                                    })
                                  : null,
                              }),
                            ],
                          }),
                          _jsxs("p", {
                            className: "text-xs text-muted-foreground",
                            children: [
                              providerCard.summary.headline,
                              providerCard.summary.detail
                                ? ` - ${providerCard.summary.detail}`
                                : null,
                            ],
                          }),
                        ],
                      }),
                      _jsxs("div", {
                        className:
                          "flex w-full shrink-0 items-center gap-2 sm:w-auto sm:justify-end",
                        children: [
                          _jsx(Button, {
                            size: "sm",
                            variant: "ghost",
                            className:
                              "h-7 px-2 text-xs text-muted-foreground hover:text-foreground",
                            onClick: () =>
                              setOpenProviderDetails((existing) => ({
                                ...existing,
                                [providerCard.provider]: !existing[providerCard.provider],
                              })),
                            "aria-label": `Toggle ${providerDisplayName} details`,
                            children: _jsx(ChevronDownIcon, {
                              className: cn(
                                "size-3.5 transition-transform",
                                openProviderDetails[providerCard.provider] && "rotate-180",
                              ),
                            }),
                          }),
                          _jsx(Switch, {
                            checked: providerCard.providerConfig.enabled,
                            onCheckedChange: (checked) => {
                              const isDisabling = !checked;
                              const shouldClearModelSelection =
                                isDisabling && textGenProvider === providerCard.provider;
                              updateSettings({
                                providers: {
                                  ...settings.providers,
                                  [providerCard.provider]: {
                                    ...settings.providers[providerCard.provider],
                                    enabled: Boolean(checked),
                                  },
                                },
                                ...(shouldClearModelSelection
                                  ? {
                                      textGenerationModelSelection:
                                        DEFAULT_UNIFIED_SETTINGS.textGenerationModelSelection,
                                    }
                                  : {}),
                              });
                            },
                            "aria-label": `Enable ${providerDisplayName}`,
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
                _jsx(Collapsible, {
                  open: openProviderDetails[providerCard.provider],
                  onOpenChange: (open) =>
                    setOpenProviderDetails((existing) => ({
                      ...existing,
                      [providerCard.provider]: open,
                    })),
                  children: _jsx(CollapsibleContent, {
                    children: _jsxs("div", {
                      className: "space-y-0",
                      children: [
                        _jsx("div", {
                          className: "border-t border-border/60 px-4 py-3 sm:px-5",
                          children: _jsxs("label", {
                            htmlFor: `provider-install-${providerCard.provider}-binary-path`,
                            className: "block",
                            children: [
                              _jsxs("span", {
                                className: "text-xs font-medium text-foreground",
                                children: [providerDisplayName, " binary path"],
                              }),
                              _jsx(Input, {
                                id: `provider-install-${providerCard.provider}-binary-path`,
                                className: "mt-1.5",
                                value: providerCard.binaryPathValue,
                                onChange: (event) =>
                                  updateSettings({
                                    providers: {
                                      ...settings.providers,
                                      [providerCard.provider]: {
                                        ...settings.providers[providerCard.provider],
                                        binaryPath: event.target.value,
                                      },
                                    },
                                  }),
                                placeholder: providerCard.binaryPlaceholder,
                                spellCheck: false,
                              }),
                              _jsx("span", {
                                className: "mt-1 block text-xs text-muted-foreground",
                                children: providerCard.binaryDescription,
                              }),
                            ],
                          }),
                        }),
                        providerCard.homePathKey
                          ? _jsx("div", {
                              className: "border-t border-border/60 px-4 py-3 sm:px-5",
                              children: _jsxs("label", {
                                htmlFor: `provider-install-${providerCard.homePathKey}`,
                                className: "block",
                                children: [
                                  _jsx("span", {
                                    className: "text-xs font-medium text-foreground",
                                    children: "CODEX_HOME path",
                                  }),
                                  _jsx(Input, {
                                    id: `provider-install-${providerCard.homePathKey}`,
                                    className: "mt-1.5",
                                    value: codexHomePath,
                                    onChange: (event) =>
                                      updateSettings({
                                        providers: {
                                          ...settings.providers,
                                          codex: {
                                            ...settings.providers.codex,
                                            homePath: event.target.value,
                                          },
                                        },
                                      }),
                                    placeholder: providerCard.homePlaceholder,
                                    spellCheck: false,
                                  }),
                                  providerCard.homeDescription
                                    ? _jsx("span", {
                                        className: "mt-1 block text-xs text-muted-foreground",
                                        children: providerCard.homeDescription,
                                      })
                                    : null,
                                ],
                              }),
                            })
                          : null,
                        _jsxs("div", {
                          className: "border-t border-border/60 px-4 py-3 sm:px-5",
                          children: [
                            _jsx("div", {
                              className: "text-xs font-medium text-foreground",
                              children: "Models",
                            }),
                            _jsxs("div", {
                              className: "mt-1 text-xs text-muted-foreground",
                              children: [
                                providerCard.models.length,
                                " model",
                                providerCard.models.length === 1 ? "" : "s",
                                " available.",
                              ],
                            }),
                            _jsx("div", {
                              ref: (el) => {
                                modelListRefs.current[providerCard.provider] = el;
                              },
                              className: "mt-2 max-h-40 overflow-y-auto pb-1",
                              children: providerCard.models.map((model) => {
                                const caps = model.capabilities;
                                const capLabels = [];
                                if (caps?.supportsFastMode) capLabels.push("Fast mode");
                                if (caps?.supportsThinkingToggle) capLabels.push("Thinking");
                                if (
                                  caps?.reasoningEffortLevels &&
                                  caps.reasoningEffortLevels.length > 0
                                ) {
                                  capLabels.push("Reasoning");
                                }
                                const hasDetails =
                                  capLabels.length > 0 || model.name !== model.slug;
                                return _jsxs(
                                  "div",
                                  {
                                    className: "flex items-center gap-2 py-1",
                                    children: [
                                      _jsx("span", {
                                        className: "min-w-0 truncate text-xs text-foreground/90",
                                        children: model.name,
                                      }),
                                      hasDetails
                                        ? _jsxs(Tooltip, {
                                            children: [
                                              _jsx(TooltipTrigger, {
                                                render: _jsx("button", {
                                                  type: "button",
                                                  className:
                                                    "shrink-0 text-muted-foreground/40 transition-colors hover:text-muted-foreground",
                                                  "aria-label": `Details for ${model.name}`,
                                                }),
                                                children: _jsx(InfoIcon, { className: "size-3" }),
                                              }),
                                              _jsx(TooltipPopup, {
                                                side: "top",
                                                className: "max-w-56",
                                                children: _jsxs("div", {
                                                  className: "space-y-1",
                                                  children: [
                                                    _jsx("code", {
                                                      className:
                                                        "block text-[11px] text-foreground",
                                                      children: model.slug,
                                                    }),
                                                    capLabels.length > 0
                                                      ? _jsx("div", {
                                                          className:
                                                            "flex flex-wrap gap-x-2 gap-y-0.5",
                                                          children: capLabels.map((label) =>
                                                            _jsx(
                                                              "span",
                                                              {
                                                                className:
                                                                  "text-[10px] text-muted-foreground",
                                                                children: label,
                                                              },
                                                              label,
                                                            ),
                                                          ),
                                                        })
                                                      : null,
                                                  ],
                                                }),
                                              }),
                                            ],
                                          })
                                        : null,
                                      model.isCustom
                                        ? _jsxs("div", {
                                            className: "ml-auto flex shrink-0 items-center gap-1.5",
                                            children: [
                                              _jsx("span", {
                                                className: "text-[10px] text-muted-foreground",
                                                children: "custom",
                                              }),
                                              _jsx("button", {
                                                type: "button",
                                                className:
                                                  "text-muted-foreground transition-colors hover:text-foreground",
                                                "aria-label": `Remove ${model.slug}`,
                                                onClick: () =>
                                                  removeCustomModel(
                                                    providerCard.provider,
                                                    model.slug,
                                                  ),
                                                children: _jsx(XIcon, { className: "size-3" }),
                                              }),
                                            ],
                                          })
                                        : null,
                                    ],
                                  },
                                  `${providerCard.provider}:${model.slug}`,
                                );
                              }),
                            }),
                            _jsxs("div", {
                              className: "mt-3 flex flex-col gap-2 sm:flex-row",
                              children: [
                                _jsx(Input, {
                                  id: `custom-model-${providerCard.provider}`,
                                  value: customModelInput,
                                  onChange: (event) => {
                                    const value = event.target.value;
                                    setCustomModelInputByProvider((existing) => ({
                                      ...existing,
                                      [providerCard.provider]: value,
                                    }));
                                    if (customModelError) {
                                      setCustomModelErrorByProvider((existing) => ({
                                        ...existing,
                                        [providerCard.provider]: null,
                                      }));
                                    }
                                  },
                                  onKeyDown: (event) => {
                                    if (event.key !== "Enter") return;
                                    event.preventDefault();
                                    addCustomModel(providerCard.provider);
                                  },
                                  placeholder:
                                    providerCard.provider === "codex"
                                      ? "gpt-6.7-codex-ultra-preview"
                                      : "claude-sonnet-5-0",
                                  spellCheck: false,
                                }),
                                _jsxs(Button, {
                                  className: "shrink-0",
                                  variant: "outline",
                                  onClick: () => addCustomModel(providerCard.provider),
                                  children: [_jsx(PlusIcon, { className: "size-3.5" }), "Add"],
                                }),
                              ],
                            }),
                            customModelError
                              ? _jsx("p", {
                                  className: "mt-2 text-xs text-destructive",
                                  children: customModelError,
                                })
                              : null,
                          ],
                        }),
                      ],
                    }),
                  }),
                }),
              ],
            },
            providerCard.provider,
          );
        }),
      }),
      _jsx(SettingsSection, {
        title: "Advanced",
        children: _jsx(SettingsRow, {
          title: "Keybindings",
          description:
            "Open the persisted `keybindings.json` file to edit advanced bindings directly.",
          status: _jsxs(_Fragment, {
            children: [
              _jsx("span", {
                className: "block break-all font-mono text-[11px] text-foreground",
                children: keybindingsConfigPath ?? "Resolving keybindings path...",
              }),
              openKeybindingsError
                ? _jsx("span", {
                    className: "mt-1 block text-destructive",
                    children: openKeybindingsError,
                  })
                : _jsx("span", {
                    className: "mt-1 block",
                    children: "Opens in your preferred editor.",
                  }),
            ],
          }),
          control: _jsx(Button, {
            size: "xs",
            variant: "outline",
            disabled: !keybindingsConfigPath || isOpeningKeybindings,
            onClick: openKeybindingsFile,
            children: isOpeningKeybindings ? "Opening..." : "Open file",
          }),
        }),
      }),
      _jsx(SettingsSection, {
        title: "About",
        children: isElectron
          ? _jsx(AboutVersionSection, {})
          : _jsx(SettingsRow, {
              title: _jsx(AboutVersionTitle, {}),
              description: "Current version of the application.",
            }),
      }),
    ],
  });
}
export function ArchivedThreadsPanel() {
  const projects = useStore((store) => store.projects);
  const threads = useStore((store) => store.threads);
  const { unarchiveThread, confirmAndDeleteThread } = useThreadActions();
  const archivedGroups = useMemo(() => {
    const projectById = new Map(projects.map((project) => [project.id, project]));
    return [...projectById.values()]
      .map((project) => ({
        project,
        threads: threads
          .filter((thread) => thread.projectId === project.id && thread.archivedAt !== null)
          .toSorted((left, right) => {
            const leftKey = left.archivedAt ?? left.createdAt;
            const rightKey = right.archivedAt ?? right.createdAt;
            return rightKey.localeCompare(leftKey) || right.id.localeCompare(left.id);
          }),
      }))
      .filter((group) => group.threads.length > 0);
  }, [projects, threads]);
  const handleArchivedThreadContextMenu = useCallback(
    async (threadId, position) => {
      const api = readNativeApi();
      if (!api) return;
      const clicked = await api.contextMenu.show(
        [
          { id: "unarchive", label: "Unarchive" },
          { id: "delete", label: "Delete", destructive: true },
        ],
        position,
      );
      if (clicked === "unarchive") {
        try {
          await unarchiveThread(threadId);
        } catch (error) {
          toastManager.add({
            type: "error",
            title: "Failed to unarchive thread",
            description: error instanceof Error ? error.message : "An error occurred.",
          });
        }
        return;
      }
      if (clicked === "delete") {
        await confirmAndDeleteThread(threadId);
      }
    },
    [confirmAndDeleteThread, unarchiveThread],
  );
  return _jsx(SettingsPageContainer, {
    children:
      archivedGroups.length === 0
        ? _jsx(SettingsSection, {
            title: "Archived threads",
            children: _jsxs(Empty, {
              className: "min-h-88",
              children: [
                _jsx(EmptyMedia, { variant: "icon", children: _jsx(ArchiveIcon, {}) }),
                _jsxs(EmptyHeader, {
                  children: [
                    _jsx(EmptyTitle, { children: "No archived threads" }),
                    _jsx(EmptyDescription, { children: "Archived threads will appear here." }),
                  ],
                }),
              ],
            }),
          })
        : archivedGroups.map(({ project, threads: projectThreads }) =>
            _jsx(
              SettingsSection,
              {
                title: project.name,
                icon: _jsx(ProjectFavicon, { cwd: project.cwd }),
                children: projectThreads.map((thread) =>
                  _jsxs(
                    "div",
                    {
                      className:
                        "flex items-center justify-between gap-3 border-t border-border px-4 py-3 first:border-t-0 sm:px-5",
                      onContextMenu: (event) => {
                        event.preventDefault();
                        void handleArchivedThreadContextMenu(thread.id, {
                          x: event.clientX,
                          y: event.clientY,
                        });
                      },
                      children: [
                        _jsxs("div", {
                          className: "min-w-0 flex-1",
                          children: [
                            _jsx("h3", {
                              className: "truncate text-sm font-medium text-foreground",
                              children: thread.title,
                            }),
                            _jsxs("p", {
                              className: "text-xs text-muted-foreground",
                              children: [
                                "Archived ",
                                formatRelativeTimeLabel(thread.archivedAt ?? thread.createdAt),
                                " \u00b7 Created ",
                                formatRelativeTimeLabel(thread.createdAt),
                              ],
                            }),
                          ],
                        }),
                        _jsxs(Button, {
                          type: "button",
                          variant: "outline",
                          size: "sm",
                          className: "h-7 shrink-0 cursor-pointer gap-1.5 px-2.5",
                          onClick: () =>
                            void unarchiveThread(thread.id).catch((error) => {
                              toastManager.add({
                                type: "error",
                                title: "Failed to unarchive thread",
                                description:
                                  error instanceof Error ? error.message : "An error occurred.",
                              });
                            }),
                          children: [
                            _jsx(ArchiveX, { className: "size-3.5" }),
                            _jsx("span", { children: "Unarchive" }),
                          ],
                        }),
                      ],
                    },
                    thread.id,
                  ),
                ),
              },
              project.id,
            ),
          ),
  });
}
