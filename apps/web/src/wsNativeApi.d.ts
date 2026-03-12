import {
  type NativeApi,
  ServerConfigUpdatedPayload,
  ServerProviderUpdatedPayload,
  type WsWelcomePayload,
} from "@t3tools/contracts";
/**
 * Subscribe to the server welcome message. If a welcome was already received
 * before this call, the listener fires synchronously with the cached payload.
 * This avoids the race between WebSocket connect and React effect registration.
 */
export declare function onServerWelcome(listener: (payload: WsWelcomePayload) => void): () => void;
/**
 * Subscribe to server config update events. Replays the latest update for
 * late subscribers to avoid missing config validation feedback.
 */
export declare function onServerConfigUpdated(
  listener: (payload: ServerConfigUpdatedPayload) => void,
): () => void;
export declare function onServerProvidersUpdated(
  listener: (payload: ServerProviderUpdatedPayload) => void,
): () => void;
export declare function createWsNativeApi(): NativeApi;
