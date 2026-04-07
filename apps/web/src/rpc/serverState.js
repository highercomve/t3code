import { useAtomSubscribe, useAtomValue } from "@effect/atom-react";
import { DEFAULT_SERVER_SETTINGS, } from "@t3tools/contracts";
import { Atom } from "effect/unstable/reactivity";
import { useCallback, useRef } from "react";
import { appAtomRegistry, resetAppAtomRegistryForTests } from "./atomRegistry";
function makeStateAtom(label, initialValue) {
    return Atom.make(initialValue).pipe(Atom.keepAlive, Atom.withLabel(label));
}
function toServerConfigUpdatedPayload(config) {
    return {
        issues: config.issues,
        providers: config.providers,
        settings: config.settings,
    };
}
const EMPTY_AVAILABLE_EDITORS = [];
const EMPTY_KEYBINDINGS = [];
const EMPTY_SERVER_PROVIDERS = [];
const selectAvailableEditors = (config) => config?.availableEditors ?? EMPTY_AVAILABLE_EDITORS;
const selectKeybindings = (config) => config?.keybindings ?? EMPTY_KEYBINDINGS;
const selectKeybindingsConfigPath = (config) => config?.keybindingsConfigPath ?? null;
const selectObservability = (config) => config?.observability ?? null;
const selectProviders = (config) => config?.providers ?? EMPTY_SERVER_PROVIDERS;
const selectSettings = (config) => config?.settings ?? DEFAULT_SERVER_SETTINGS;
export const welcomeAtom = makeStateAtom("server-welcome", null);
export const serverConfigAtom = makeStateAtom("server-config", null);
export const serverConfigUpdatedAtom = makeStateAtom("server-config-updated", null);
export const providersUpdatedAtom = makeStateAtom("server-providers-updated", null);
export function getServerConfig() {
    return appAtomRegistry.get(serverConfigAtom);
}
export function getServerConfigUpdatedNotification() {
    return appAtomRegistry.get(serverConfigUpdatedAtom);
}
export function setServerConfigSnapshot(config) {
    resolveServerConfig(config);
    emitProvidersUpdated({ providers: config.providers });
    emitServerConfigUpdated(toServerConfigUpdatedPayload(config), "snapshot");
}
export function applyServerConfigEvent(event) {
    switch (event.type) {
        case "snapshot": {
            setServerConfigSnapshot(event.config);
            return;
        }
        case "keybindingsUpdated": {
            const latestServerConfig = getServerConfig();
            if (!latestServerConfig) {
                return;
            }
            const nextConfig = {
                ...latestServerConfig,
                issues: event.payload.issues,
            };
            resolveServerConfig(nextConfig);
            emitServerConfigUpdated(toServerConfigUpdatedPayload(nextConfig), event.type);
            return;
        }
        case "providerStatuses": {
            applyProvidersUpdated(event.payload);
            return;
        }
        case "settingsUpdated": {
            applySettingsUpdated(event.payload.settings);
            return;
        }
    }
}
export function applyProvidersUpdated(payload) {
    const latestServerConfig = getServerConfig();
    emitProvidersUpdated(payload);
    if (!latestServerConfig) {
        return;
    }
    const nextConfig = {
        ...latestServerConfig,
        providers: payload.providers,
    };
    resolveServerConfig(nextConfig);
    emitServerConfigUpdated(toServerConfigUpdatedPayload(nextConfig), "providerStatuses");
}
export function applySettingsUpdated(settings) {
    const latestServerConfig = getServerConfig();
    if (!latestServerConfig) {
        return;
    }
    const nextConfig = {
        ...latestServerConfig,
        settings,
    };
    resolveServerConfig(nextConfig);
    emitServerConfigUpdated(toServerConfigUpdatedPayload(nextConfig), "settingsUpdated");
}
export function emitWelcome(payload) {
    appAtomRegistry.set(welcomeAtom, payload);
}
export function onWelcome(listener) {
    return subscribeLatest(welcomeAtom, listener);
}
export function onServerConfigUpdated(listener) {
    return subscribeLatest(serverConfigUpdatedAtom, (notification) => {
        listener(notification.payload, notification.source);
    });
}
export function onProvidersUpdated(listener) {
    return subscribeLatest(providersUpdatedAtom, listener);
}
export function startServerStateSync(client) {
    let disposed = false;
    const cleanups = [
        client.subscribeLifecycle((event) => {
            if (event.type === "welcome") {
                emitWelcome(event.payload);
            }
        }),
        client.subscribeConfig((event) => {
            applyServerConfigEvent(event);
        }),
    ];
    if (getServerConfig() === null) {
        void client
            .getConfig()
            .then((config) => {
            if (disposed || getServerConfig() !== null) {
                return;
            }
            setServerConfigSnapshot(config);
        })
            .catch(() => undefined);
    }
    return () => {
        disposed = true;
        for (const cleanup of cleanups) {
            cleanup();
        }
    };
}
export function resetServerStateForTests() {
    resetAppAtomRegistryForTests();
    nextServerConfigUpdatedNotificationId = 1;
}
let nextServerConfigUpdatedNotificationId = 1;
function resolveServerConfig(config) {
    appAtomRegistry.set(serverConfigAtom, config);
}
function emitProvidersUpdated(payload) {
    appAtomRegistry.set(providersUpdatedAtom, payload);
}
function emitServerConfigUpdated(payload, source) {
    appAtomRegistry.set(serverConfigUpdatedAtom, {
        id: nextServerConfigUpdatedNotificationId++,
        payload,
        source,
    });
}
function subscribeLatest(atom, listener) {
    return appAtomRegistry.subscribe(atom, (value) => {
        if (value === null) {
            return;
        }
        listener(value);
    }, { immediate: true });
}
function useLatestAtomSubscription(atom, listener) {
    const listenerRef = useRef(listener);
    listenerRef.current = listener;
    const stableListener = useCallback((value) => {
        if (value === null) {
            return;
        }
        listenerRef.current(value);
    }, []);
    useAtomSubscribe(atom, stableListener, { immediate: true });
}
export function useServerConfig() {
    return useAtomValue(serverConfigAtom);
}
export function useServerSettings() {
    return useAtomValue(serverConfigAtom, selectSettings);
}
export function useServerProviders() {
    return useAtomValue(serverConfigAtom, selectProviders);
}
export function useServerKeybindings() {
    return useAtomValue(serverConfigAtom, selectKeybindings);
}
export function useServerAvailableEditors() {
    return useAtomValue(serverConfigAtom, selectAvailableEditors);
}
export function useServerKeybindingsConfigPath() {
    return useAtomValue(serverConfigAtom, selectKeybindingsConfigPath);
}
export function useServerObservability() {
    return useAtomValue(serverConfigAtom, selectObservability);
}
export function useServerWelcomeSubscription(listener) {
    useLatestAtomSubscription(welcomeAtom, listener);
}
export function useServerConfigUpdatedSubscription(listener) {
    useLatestAtomSubscription(serverConfigUpdatedAtom, listener);
}
