import { Atom } from "effect/unstable/reactivity";
export type WsConnectionUiState = "connected" | "connecting" | "error" | "offline" | "reconnecting";
export type WsReconnectPhase = "attempting" | "exhausted" | "idle" | "waiting";
export declare const WS_RECONNECT_INITIAL_DELAY_MS = 1000;
export declare const WS_RECONNECT_BACKOFF_FACTOR = 2;
export declare const WS_RECONNECT_MAX_DELAY_MS = 64000;
export declare const WS_RECONNECT_MAX_RETRIES = 7;
export declare const WS_RECONNECT_MAX_ATTEMPTS: number;
export interface WsConnectionStatus {
  readonly attemptCount: number;
  readonly closeCode: number | null;
  readonly closeReason: string | null;
  readonly connectedAt: string | null;
  readonly disconnectedAt: string | null;
  readonly hasConnected: boolean;
  readonly lastError: string | null;
  readonly lastErrorAt: string | null;
  readonly nextRetryAt: string | null;
  readonly online: boolean;
  readonly phase: "idle" | "connecting" | "connected" | "disconnected";
  readonly reconnectAttemptCount: number;
  readonly reconnectMaxAttempts: number;
  readonly reconnectPhase: WsReconnectPhase;
  readonly socketUrl: string | null;
}
export declare const wsConnectionStatusAtom: Atom.Writable<
  Readonly<WsConnectionStatus>,
  Readonly<WsConnectionStatus>
>;
export declare function getWsConnectionStatus(): WsConnectionStatus;
export declare function getWsConnectionUiState(status: WsConnectionStatus): WsConnectionUiState;
export declare function recordWsConnectionAttempt(socketUrl: string): WsConnectionStatus;
export declare function recordWsConnectionOpened(): WsConnectionStatus;
export declare function recordWsConnectionErrored(message?: string | null): WsConnectionStatus;
export declare function recordWsConnectionClosed(details?: {
  readonly code?: number;
  readonly reason?: string;
}): WsConnectionStatus;
export declare function setBrowserOnlineStatus(online: boolean): WsConnectionStatus;
export declare function resetWsReconnectBackoff(): WsConnectionStatus;
export declare function resetWsConnectionStateForTests(): void;
export declare function useWsConnectionStatus(): WsConnectionStatus;
export declare function getWsReconnectDelayMsForRetry(retryIndex: number): number | null;
