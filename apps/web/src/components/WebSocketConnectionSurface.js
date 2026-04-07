import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertTriangle, CloudOff, LoaderCircle, RotateCw } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { APP_DISPLAY_NAME } from "../branding";
import { useSlowRpcAckRequests } from "../rpc/requestLatencyState";
import { useServerConfig } from "../rpc/serverState";
import { exhaustWsReconnectIfStillWaiting, getWsConnectionStatus, getWsConnectionUiState, setBrowserOnlineStatus, useWsConnectionStatus, WS_RECONNECT_MAX_ATTEMPTS, } from "../rpc/wsConnectionState";
import { Button } from "./ui/button";
import { toastManager } from "./ui/toast";
import { getWsRpcClient } from "~/wsRpcClient";
const FORCED_WS_RECONNECT_DEBOUNCE_MS = 5_000;
const connectionTimeFormatter = new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    second: "2-digit",
});
function formatConnectionMoment(isoDate) {
    if (!isoDate) {
        return null;
    }
    return connectionTimeFormatter.format(new Date(isoDate));
}
function formatRetryCountdown(nextRetryAt, nowMs) {
    const remainingMs = Math.max(0, new Date(nextRetryAt).getTime() - nowMs);
    return `${Math.max(1, Math.ceil(remainingMs / 1000))}s`;
}
function describeOfflineToast() {
    return "WebSocket disconnected. Waiting for network.";
}
function formatReconnectAttemptLabel(status) {
    const reconnectAttempt = Math.max(1, Math.min(status.reconnectAttemptCount, WS_RECONNECT_MAX_ATTEMPTS));
    return `Attempt ${reconnectAttempt}/${status.reconnectMaxAttempts}`;
}
function describeExhaustedToast() {
    return "Retries exhausted trying to reconnect";
}
function buildReconnectTitle(status) {
    if (status.nextRetryAt === null) {
        return "Disconnected from T3 Server";
    }
    return "Disconnected from T3 Server";
}
function describeRecoveredToast(previousDisconnectedAt, connectedAt) {
    const reconnectedAtLabel = formatConnectionMoment(connectedAt);
    const disconnectedAtLabel = formatConnectionMoment(previousDisconnectedAt);
    if (disconnectedAtLabel && reconnectedAtLabel) {
        return `Disconnected at ${disconnectedAtLabel} and reconnected at ${reconnectedAtLabel}.`;
    }
    if (reconnectedAtLabel) {
        return `Connection restored at ${reconnectedAtLabel}.`;
    }
    return "Connection restored.";
}
function describeSlowRpcAckToast(requests) {
    const count = requests.length;
    const thresholdSeconds = Math.round((requests[0]?.thresholdMs ?? 0) / 1000);
    return `${count} request${count === 1 ? "" : "s"} waiting longer than ${thresholdSeconds}s.`;
}
export function shouldAutoReconnect(status, trigger) {
    const uiState = getWsConnectionUiState(status);
    if (trigger === "online") {
        return (uiState === "offline" ||
            uiState === "reconnecting" ||
            uiState === "error" ||
            status.reconnectPhase === "exhausted");
    }
    return (status.online &&
        status.hasConnected &&
        (uiState === "reconnecting" || status.reconnectPhase === "exhausted"));
}
function buildBlockingCopy(uiState, status) {
    if (uiState === "connecting") {
        return {
            description: `Opening the WebSocket connection to the ${APP_DISPLAY_NAME} server and waiting for the initial config snapshot.`,
            eyebrow: "Starting Session",
            title: `Connecting to ${APP_DISPLAY_NAME}`,
        };
    }
    if (uiState === "offline") {
        return {
            description: "Your browser is offline, so the web client cannot reach the T3 server. Reconnect to the network and the app will retry automatically.",
            eyebrow: "Offline",
            title: "WebSocket connection unavailable",
        };
    }
    if (status.lastError?.trim()) {
        return {
            description: `${status.lastError} Verify that the T3 server is running and reachable, then reload the app if needed.`,
            eyebrow: "Connection Error",
            title: "Cannot reach the T3 server",
        };
    }
    return {
        description: "The web client could not complete its initial WebSocket connection to the T3 server. It will keep retrying in the background.",
        eyebrow: "Connection Error",
        title: "Cannot reach the T3 server",
    };
}
function buildConnectionDetails(status, uiState) {
    const details = [
        `state: ${uiState}`,
        `online: ${status.online ? "yes" : "no"}`,
        `attempts: ${status.attemptCount}`,
    ];
    if (status.socketUrl) {
        details.push(`socket: ${status.socketUrl}`);
    }
    if (status.connectedAt) {
        details.push(`connectedAt: ${status.connectedAt}`);
    }
    if (status.disconnectedAt) {
        details.push(`disconnectedAt: ${status.disconnectedAt}`);
    }
    if (status.lastErrorAt) {
        details.push(`lastErrorAt: ${status.lastErrorAt}`);
    }
    if (status.lastError) {
        details.push(`lastError: ${status.lastError}`);
    }
    if (status.closeCode !== null) {
        details.push(`closeCode: ${status.closeCode}`);
    }
    if (status.closeReason) {
        details.push(`closeReason: ${status.closeReason}`);
    }
    return details.join("\n");
}
function WebSocketBlockingState({ status, uiState, }) {
    const copy = buildBlockingCopy(uiState, status);
    const disconnectedAt = formatConnectionMoment(status.disconnectedAt ?? status.lastErrorAt);
    const Icon = uiState === "connecting" ? LoaderCircle : uiState === "offline" ? CloudOff : AlertTriangle;
    return (_jsxs("div", { className: "relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground sm:px-6", children: [_jsxs("div", { className: "pointer-events-none absolute inset-0 opacity-90", children: [_jsx("div", { className: "absolute inset-x-0 top-0 h-56 bg-[radial-gradient(48rem_18rem_at_top,color-mix(in_srgb,var(--color-amber-500)_16%,transparent),transparent)]" }), _jsx("div", { className: "absolute inset-0 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--background)_92%,var(--color-black))_0%,var(--background)_56%)]" })] }), _jsxs("section", { className: "relative w-full max-w-xl rounded-[1.75rem] border border-border/80 bg-card/92 p-6 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-8", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase", children: copy.eyebrow }), _jsx("h1", { className: "mt-3 text-2xl font-semibold tracking-tight sm:text-3xl", children: copy.title })] }), _jsx("div", { className: "rounded-2xl border border-border/70 bg-background/80 p-3 text-foreground shadow-sm", children: _jsx(Icon, { className: uiState === "connecting" ? "size-5 animate-spin" : "size-5" }) })] }), _jsx("p", { className: "mt-3 text-sm leading-relaxed text-muted-foreground", children: copy.description }), _jsxs("div", { className: "mt-5 grid gap-3 rounded-2xl border border-border/70 bg-background/60 p-4 text-sm sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase", children: "Connection" }), _jsx("p", { className: "mt-1 font-medium text-foreground", children: uiState === "connecting"
                                            ? "Opening WebSocket"
                                            : uiState === "offline"
                                                ? "Waiting for network"
                                                : "Retrying server connection" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase", children: "Latest Event" }), _jsx("p", { className: "mt-1 font-medium text-foreground", children: disconnectedAt ?? "Pending" })] })] }), _jsx("div", { className: "mt-5 flex flex-wrap gap-2", children: _jsxs(Button, { size: "sm", onClick: () => window.location.reload(), children: [_jsx(RotateCw, {}), "Reload app"] }) }), _jsxs("details", { className: "group mt-5 overflow-hidden rounded-lg border border-border/70 bg-background/55", children: [_jsxs("summary", { className: "cursor-pointer list-none px-3 py-2 text-xs font-medium text-muted-foreground", children: [_jsx("span", { className: "group-open:hidden", children: "Show connection details" }), _jsx("span", { className: "hidden group-open:inline", children: "Hide connection details" })] }), _jsx("pre", { className: "max-h-56 overflow-auto border-t border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground/85", children: buildConnectionDetails(status, uiState) })] })] })] }));
}
export function WebSocketConnectionCoordinator() {
    const status = useWsConnectionStatus();
    const [nowMs, setNowMs] = useState(() => Date.now());
    const lastForcedReconnectAtRef = useRef(0);
    const toastIdRef = useRef(null);
    const toastResetTimerRef = useRef(null);
    const previousUiStateRef = useRef(getWsConnectionUiState(status));
    const previousDisconnectedAtRef = useRef(status.disconnectedAt);
    const runReconnect = useEffectEvent((showFailureToast) => {
        if (toastResetTimerRef.current !== null) {
            window.clearTimeout(toastResetTimerRef.current);
            toastResetTimerRef.current = null;
        }
        lastForcedReconnectAtRef.current = Date.now();
        void getWsRpcClient()
            .reconnect()
            .catch((error) => {
            if (!showFailureToast) {
                console.warn("Automatic WebSocket reconnect failed", { error });
                return;
            }
            toastManager.add({
                type: "error",
                title: "Reconnect failed",
                description: error instanceof Error ? error.message : "Unable to restart the WebSocket.",
                data: {
                    dismissAfterVisibleMs: 8_000,
                    hideCopyButton: true,
                },
            });
        });
    });
    const syncBrowserOnlineStatus = useEffectEvent(() => {
        setBrowserOnlineStatus(navigator.onLine !== false);
    });
    const triggerManualReconnect = useEffectEvent(() => {
        runReconnect(true);
    });
    const triggerAutoReconnect = useEffectEvent((trigger) => {
        const currentStatus = trigger === "online" ? setBrowserOnlineStatus(true) : getWsConnectionStatus();
        if (!shouldAutoReconnect(currentStatus, trigger)) {
            return;
        }
        if (Date.now() - lastForcedReconnectAtRef.current < FORCED_WS_RECONNECT_DEBOUNCE_MS) {
            return;
        }
        runReconnect(false);
    });
    useEffect(() => {
        const handleOnline = () => {
            triggerAutoReconnect("online");
        };
        const handleFocus = () => {
            triggerAutoReconnect("focus");
        };
        syncBrowserOnlineStatus();
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", syncBrowserOnlineStatus);
        window.addEventListener("focus", handleFocus);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", syncBrowserOnlineStatus);
            window.removeEventListener("focus", handleFocus);
        };
    }, []);
    useEffect(() => {
        if (status.reconnectPhase !== "waiting" || status.nextRetryAt === null) {
            return;
        }
        setNowMs(Date.now());
        const intervalId = window.setInterval(() => {
            setNowMs(Date.now());
        }, 1_000);
        return () => {
            window.clearInterval(intervalId);
        };
    }, [status.nextRetryAt, status.reconnectPhase]);
    useEffect(() => {
        if (status.reconnectPhase !== "waiting" ||
            status.nextRetryAt === null ||
            !status.online ||
            !status.hasConnected) {
            return;
        }
        const nextRetryAt = status.nextRetryAt;
        const timeoutMs = Math.max(0, new Date(nextRetryAt).getTime() - Date.now()) + 1_500;
        const timeoutId = window.setTimeout(() => {
            exhaustWsReconnectIfStillWaiting(nextRetryAt);
        }, timeoutMs);
        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [
        status.hasConnected,
        status.nextRetryAt,
        status.online,
        status.reconnectAttemptCount,
        status.reconnectPhase,
    ]);
    useEffect(() => {
        const uiState = getWsConnectionUiState(status);
        const previousUiState = previousUiStateRef.current;
        const previousDisconnectedAt = previousDisconnectedAtRef.current;
        const shouldShowReconnectToast = status.hasConnected && uiState === "reconnecting";
        const shouldShowOfflineToast = uiState === "offline" && status.disconnectedAt !== null;
        const shouldShowExhaustedToast = status.hasConnected && status.reconnectPhase === "exhausted";
        if (toastResetTimerRef.current !== null &&
            (shouldShowReconnectToast || shouldShowOfflineToast || shouldShowExhaustedToast)) {
            window.clearTimeout(toastResetTimerRef.current);
            toastResetTimerRef.current = null;
        }
        if (shouldShowReconnectToast || shouldShowOfflineToast || shouldShowExhaustedToast) {
            const toastPayload = shouldShowOfflineToast
                ? {
                    description: describeOfflineToast(),
                    timeout: 0,
                    title: "Offline",
                    type: "warning",
                    data: {
                        hideCopyButton: true,
                    },
                }
                : shouldShowExhaustedToast
                    ? {
                        actionProps: {
                            children: "Retry",
                            onClick: triggerManualReconnect,
                        },
                        description: describeExhaustedToast(),
                        timeout: 0,
                        title: "Disconnected from T3 Server",
                        type: "error",
                        data: {
                            hideCopyButton: true,
                        },
                    }
                    : {
                        actionProps: {
                            children: "Retry now",
                            onClick: triggerManualReconnect,
                        },
                        description: status.nextRetryAt === null
                            ? `Reconnecting... ${formatReconnectAttemptLabel(status)}`
                            : `Reconnecting in ${formatRetryCountdown(status.nextRetryAt, nowMs)}... ${formatReconnectAttemptLabel(status)}`,
                        timeout: 0,
                        title: buildReconnectTitle(status),
                        type: "loading",
                        data: {
                            hideCopyButton: true,
                        },
                    };
            if (toastIdRef.current) {
                toastManager.update(toastIdRef.current, toastPayload);
            }
            else {
                toastIdRef.current = toastManager.add(toastPayload);
            }
        }
        else if (toastIdRef.current) {
            toastManager.close(toastIdRef.current);
            toastIdRef.current = null;
        }
        if (uiState === "connected" &&
            (previousUiState === "offline" || previousUiState === "reconnecting") &&
            previousDisconnectedAt !== null) {
            const successToast = {
                description: describeRecoveredToast(previousDisconnectedAt, status.connectedAt),
                title: "Reconnected to T3 Server",
                type: "success",
                timeout: 0,
                data: {
                    dismissAfterVisibleMs: 8_000,
                    hideCopyButton: true,
                },
            };
            if (toastIdRef.current) {
                toastManager.update(toastIdRef.current, successToast);
            }
            else {
                toastIdRef.current = toastManager.add(successToast);
            }
            toastResetTimerRef.current = window.setTimeout(() => {
                toastIdRef.current = null;
                toastResetTimerRef.current = null;
            }, 8_250);
        }
        previousUiStateRef.current = uiState;
        previousDisconnectedAtRef.current = status.disconnectedAt;
    }, [nowMs, status]);
    useEffect(() => {
        return () => {
            if (toastResetTimerRef.current !== null) {
                window.clearTimeout(toastResetTimerRef.current);
            }
        };
    }, []);
    return null;
}
export function SlowRpcAckToastCoordinator() {
    const slowRequests = useSlowRpcAckRequests();
    const status = useWsConnectionStatus();
    const toastIdRef = useRef(null);
    useEffect(() => {
        if (getWsConnectionUiState(status) !== "connected") {
            if (toastIdRef.current) {
                toastManager.close(toastIdRef.current);
                toastIdRef.current = null;
            }
            return;
        }
        if (slowRequests.length === 0) {
            if (toastIdRef.current) {
                toastManager.close(toastIdRef.current);
                toastIdRef.current = null;
            }
            return;
        }
        const nextToast = {
            description: describeSlowRpcAckToast(slowRequests),
            timeout: 0,
            title: "Some requests are slow",
            type: "warning",
        };
        if (toastIdRef.current) {
            toastManager.update(toastIdRef.current, nextToast);
        }
        else {
            toastIdRef.current = toastManager.add(nextToast);
        }
    }, [slowRequests, status]);
    return null;
}
export function WebSocketConnectionSurface({ children }) {
    const serverConfig = useServerConfig();
    const status = useWsConnectionStatus();
    if (serverConfig === null) {
        const uiState = getWsConnectionUiState(status);
        return (_jsx(WebSocketBlockingState, { status: status, uiState: uiState === "connected" ? "connecting" : uiState }));
    }
    return children;
}
