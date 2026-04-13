import { getKnownEnvironmentHttpBaseUrl } from "@t3tools/client-runtime";
import { create } from "zustand";
import { ensureLocalApi } from "../../localApi";
import { getPrimaryKnownEnvironment } from "../primary";
let savedEnvironmentRegistryHydrated = false;
let savedEnvironmentRegistryHydrationPromise = null;
function toPersistedSavedEnvironmentRecord(record) {
  return {
    environmentId: record.environmentId,
    label: record.label,
    httpBaseUrl: record.httpBaseUrl,
    wsBaseUrl: record.wsBaseUrl,
    createdAt: record.createdAt,
    lastConnectedAt: record.lastConnectedAt,
  };
}
function valuesOfSavedEnvironmentRegistry(byId) {
  return Object.values(byId);
}
function persistSavedEnvironmentRegistryState(byId) {
  try {
    void ensureLocalApi()
      .persistence.setSavedEnvironmentRegistry(
        valuesOfSavedEnvironmentRegistry(byId).map((record) =>
          toPersistedSavedEnvironmentRecord(record),
        ),
      )
      .catch((error) => {
        console.error("[SAVED_ENVIRONMENTS] persist failed", error);
      });
  } catch (error) {
    console.error("[SAVED_ENVIRONMENTS] persist failed", error);
  }
}
function replaceSavedEnvironmentRegistryState(records) {
  const currentById = useSavedEnvironmentRegistryStore.getState().byId;
  const hydratedById = Object.fromEntries(records.map((record) => [record.environmentId, record]));
  useSavedEnvironmentRegistryStore.setState({
    byId: {
      ...hydratedById,
      ...currentById,
    },
  });
}
async function hydrateSavedEnvironmentRegistry() {
  if (savedEnvironmentRegistryHydrated) {
    return;
  }
  if (savedEnvironmentRegistryHydrationPromise) {
    return savedEnvironmentRegistryHydrationPromise;
  }
  const nextHydration = (async () => {
    try {
      const persistedRecords = await ensureLocalApi().persistence.getSavedEnvironmentRegistry();
      replaceSavedEnvironmentRegistryState(persistedRecords);
    } catch (error) {
      console.error("[SAVED_ENVIRONMENTS] hydrate failed", error);
    } finally {
      savedEnvironmentRegistryHydrated = true;
    }
  })();
  const hydrationPromise = nextHydration.finally(() => {
    if (savedEnvironmentRegistryHydrationPromise === hydrationPromise) {
      savedEnvironmentRegistryHydrationPromise = null;
    }
  });
  savedEnvironmentRegistryHydrationPromise = hydrationPromise;
  return savedEnvironmentRegistryHydrationPromise;
}
export const useSavedEnvironmentRegistryStore = create()((set) => ({
  byId: {},
  upsert: (record) =>
    set((state) => {
      const byId = {
        ...state.byId,
        [record.environmentId]: record,
      };
      persistSavedEnvironmentRegistryState(byId);
      return { byId };
    }),
  remove: (environmentId) =>
    set((state) => {
      const { [environmentId]: _removed, ...remaining } = state.byId;
      persistSavedEnvironmentRegistryState(remaining);
      return {
        byId: remaining,
      };
    }),
  markConnected: (environmentId, connectedAt) =>
    set((state) => {
      const existing = state.byId[environmentId];
      if (!existing) {
        return state;
      }
      const byId = {
        ...state.byId,
        [environmentId]: {
          ...existing,
          lastConnectedAt: connectedAt,
        },
      };
      persistSavedEnvironmentRegistryState(byId);
      return { byId };
    }),
  reset: () => {
    persistSavedEnvironmentRegistryState({});
    set({
      byId: {},
    });
  },
}));
export function hasSavedEnvironmentRegistryHydrated() {
  return savedEnvironmentRegistryHydrated;
}
export function waitForSavedEnvironmentRegistryHydration() {
  if (hasSavedEnvironmentRegistryHydrated()) {
    return Promise.resolve();
  }
  return hydrateSavedEnvironmentRegistry();
}
export function listSavedEnvironmentRecords() {
  return Object.values(useSavedEnvironmentRegistryStore.getState().byId).toSorted((left, right) =>
    left.label.localeCompare(right.label),
  );
}
export function getSavedEnvironmentRecord(environmentId) {
  return useSavedEnvironmentRegistryStore.getState().byId[environmentId] ?? null;
}
export function getEnvironmentHttpBaseUrl(environmentId) {
  const primaryEnvironment = getPrimaryKnownEnvironment();
  if (primaryEnvironment?.environmentId === environmentId) {
    return getKnownEnvironmentHttpBaseUrl(primaryEnvironment);
  }
  return getSavedEnvironmentRecord(environmentId)?.httpBaseUrl ?? null;
}
export function resolveEnvironmentHttpUrl(input) {
  const httpBaseUrl = getEnvironmentHttpBaseUrl(input.environmentId);
  if (!httpBaseUrl) {
    throw new Error(`Unable to resolve HTTP base URL for environment ${input.environmentId}.`);
  }
  const url = new URL(httpBaseUrl);
  url.pathname = input.pathname;
  if (input.searchParams) {
    url.search = new URLSearchParams(input.searchParams).toString();
  }
  return url.toString();
}
export function resetSavedEnvironmentRegistryStoreForTests() {
  savedEnvironmentRegistryHydrated = false;
  savedEnvironmentRegistryHydrationPromise = null;
  useSavedEnvironmentRegistryStore.setState({ byId: {} });
}
export async function persistSavedEnvironmentRecord(record) {
  const byId = {
    ...useSavedEnvironmentRegistryStore.getState().byId,
    [record.environmentId]: record,
  };
  await ensureLocalApi().persistence.setSavedEnvironmentRegistry(
    valuesOfSavedEnvironmentRegistry(byId).map((entry) => toPersistedSavedEnvironmentRecord(entry)),
  );
}
export async function readSavedEnvironmentBearerToken(environmentId) {
  return ensureLocalApi().persistence.getSavedEnvironmentSecret(environmentId);
}
export async function writeSavedEnvironmentBearerToken(environmentId, bearerToken) {
  return ensureLocalApi().persistence.setSavedEnvironmentSecret(environmentId, bearerToken);
}
export async function removeSavedEnvironmentBearerToken(environmentId) {
  await ensureLocalApi().persistence.removeSavedEnvironmentSecret(environmentId);
}
const DEFAULT_SAVED_ENVIRONMENT_RUNTIME_STATE = Object.freeze({
  connectionState: "disconnected",
  authState: "unknown",
  lastError: null,
  lastErrorAt: null,
  role: null,
  descriptor: null,
  serverConfig: null,
  connectedAt: null,
  disconnectedAt: null,
});
function createDefaultSavedEnvironmentRuntimeState() {
  return {
    ...DEFAULT_SAVED_ENVIRONMENT_RUNTIME_STATE,
  };
}
export const useSavedEnvironmentRuntimeStore = create()((set) => ({
  byId: {},
  ensure: (environmentId) =>
    set((state) => {
      if (state.byId[environmentId]) {
        return state;
      }
      return {
        byId: {
          ...state.byId,
          [environmentId]: createDefaultSavedEnvironmentRuntimeState(),
        },
      };
    }),
  patch: (environmentId, patch) =>
    set((state) => ({
      byId: {
        ...state.byId,
        [environmentId]: {
          ...(state.byId[environmentId] ?? createDefaultSavedEnvironmentRuntimeState()),
          ...patch,
        },
      },
    })),
  clear: (environmentId) =>
    set((state) => {
      const { [environmentId]: _removed, ...remaining } = state.byId;
      return {
        byId: remaining,
      };
    }),
  reset: () =>
    set({
      byId: {},
    }),
}));
export function getSavedEnvironmentRuntimeState(environmentId) {
  return (
    useSavedEnvironmentRuntimeStore.getState().byId[environmentId] ??
    DEFAULT_SAVED_ENVIRONMENT_RUNTIME_STATE
  );
}
export function resetSavedEnvironmentRuntimeStoreForTests() {
  useSavedEnvironmentRuntimeStore.getState().reset();
}
