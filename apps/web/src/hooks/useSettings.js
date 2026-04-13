/**
 * Unified settings hook.
 *
 * Abstracts the split between server-authoritative settings (persisted in
 * `settings.json` on the server, fetched via `server.getConfig`) and
 * client-only settings (persisted in localStorage).
 *
 * Consumers use `useSettings(selector)` to read, and `useUpdateSettings()` to
 * write. The hook transparently routes reads/writes to the correct backing
 * store.
 */
import { useCallback, useMemo, useSyncExternalStore } from "react";
import { ServerSettings } from "@t3tools/contracts";
import { DEFAULT_CLIENT_SETTINGS, DEFAULT_UNIFIED_SETTINGS } from "@t3tools/contracts/settings";
import { ensureLocalApi } from "~/localApi";
import { Struct } from "effect";
import { deepMerge } from "@t3tools/shared/Struct";
import { applySettingsUpdated, getServerConfig, useServerSettings } from "~/rpc/serverState";
const CLIENT_SETTINGS_PERSISTENCE_ERROR_SCOPE = "[CLIENT_SETTINGS]";
const clientSettingsListeners = new Set();
let clientSettingsSnapshot = DEFAULT_CLIENT_SETTINGS;
let clientSettingsHydrated = false;
let clientSettingsHydrationPromise = null;
function emitClientSettingsChange() {
  for (const listener of clientSettingsListeners) {
    listener();
  }
}
function getClientSettingsSnapshot() {
  return clientSettingsSnapshot;
}
function replaceClientSettingsSnapshot(settings) {
  clientSettingsSnapshot = settings;
  emitClientSettingsChange();
}
function subscribeClientSettings(listener) {
  clientSettingsListeners.add(listener);
  void hydrateClientSettings();
  return () => {
    clientSettingsListeners.delete(listener);
  };
}
async function hydrateClientSettings() {
  if (clientSettingsHydrated) {
    return;
  }
  if (clientSettingsHydrationPromise) {
    return clientSettingsHydrationPromise;
  }
  const nextHydration = (async () => {
    try {
      const persistedSettings = await ensureLocalApi().persistence.getClientSettings();
      if (persistedSettings) {
        replaceClientSettingsSnapshot(persistedSettings);
      }
    } catch (error) {
      console.error(`${CLIENT_SETTINGS_PERSISTENCE_ERROR_SCOPE} hydrate failed`, error);
    } finally {
      clientSettingsHydrated = true;
    }
  })();
  const hydrationPromise = nextHydration.finally(() => {
    if (clientSettingsHydrationPromise === hydrationPromise) {
      clientSettingsHydrationPromise = null;
    }
  });
  clientSettingsHydrationPromise = hydrationPromise;
  return clientSettingsHydrationPromise;
}
function persistClientSettings(settings) {
  replaceClientSettingsSnapshot(settings);
  void ensureLocalApi()
    .persistence.setClientSettings(settings)
    .catch((error) => {
      console.error(`${CLIENT_SETTINGS_PERSISTENCE_ERROR_SCOPE} persist failed`, error);
    });
}
// ── Key sets for routing patches ─────────────────────────────────────
const SERVER_SETTINGS_KEYS = new Set(Struct.keys(ServerSettings.fields));
function splitPatch(patch) {
  const serverPatch = {};
  const clientPatch = {};
  for (const [key, value] of Object.entries(patch)) {
    if (SERVER_SETTINGS_KEYS.has(key)) {
      serverPatch[key] = value;
    } else {
      clientPatch[key] = value;
    }
  }
  return {
    serverPatch: serverPatch,
    clientPatch: clientPatch,
  };
}
// ── Hooks ────────────────────────────────────────────────────────────
/**
 * Read merged settings. Selector narrows the subscription so components
 * only re-render when the slice they care about changes.
 */
export function useSettings(selector) {
  const serverSettings = useServerSettings();
  const clientSettings = useSyncExternalStore(
    subscribeClientSettings,
    getClientSettingsSnapshot,
    () => DEFAULT_CLIENT_SETTINGS,
  );
  const merged = useMemo(
    () => ({
      ...serverSettings,
      ...clientSettings,
    }),
    [clientSettings, serverSettings],
  );
  return useMemo(() => (selector ? selector(merged) : merged), [merged, selector]);
}
/**
 * Returns an updater that routes each key to the correct backing store.
 *
 * Server keys are optimistically patched in atom-backed server state, then
 * persisted via RPC. Client keys go through client persistence.
 */
export function useUpdateSettings() {
  const updateSettings = useCallback((patch) => {
    const { serverPatch, clientPatch } = splitPatch(patch);
    if (Object.keys(serverPatch).length > 0) {
      const currentServerConfig = getServerConfig();
      if (currentServerConfig) {
        applySettingsUpdated(deepMerge(currentServerConfig.settings, serverPatch));
      }
      // Fire-and-forget RPC — push will reconcile on success
      void ensureLocalApi().server.updateSettings(serverPatch);
    }
    if (Object.keys(clientPatch).length > 0) {
      persistClientSettings({
        ...getClientSettingsSnapshot(),
        ...clientPatch,
      });
    }
  }, []);
  const resetSettings = useCallback(() => {
    updateSettings(DEFAULT_UNIFIED_SETTINGS);
  }, [updateSettings]);
  return {
    updateSettings,
    resetSettings,
  };
}
export function __resetClientSettingsPersistenceForTests() {
  clientSettingsSnapshot = DEFAULT_CLIENT_SETTINGS;
  clientSettingsHydrated = false;
  clientSettingsHydrationPromise = null;
  clientSettingsListeners.clear();
}
