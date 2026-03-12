import { type WsPushChannel, type WsPushMessage } from "@t3tools/contracts";
type PushListener<C extends WsPushChannel> = (message: WsPushMessage<C>) => void;
interface SubscribeOptions {
  readonly replayLatest?: boolean;
}
interface RequestOptions {
  readonly timeoutMs?: number | null;
}
type TransportState = "connecting" | "open" | "reconnecting" | "closed" | "disposed";
export declare class WsTransport {
  private ws;
  private nextId;
  private readonly pending;
  private readonly listeners;
  private readonly latestPushByChannel;
  private readonly outboundQueue;
  private reconnectAttempt;
  private reconnectTimer;
  private disposed;
  private state;
  private readonly url;
  constructor(url?: string);
  request<T = unknown>(method: string, params?: unknown, options?: RequestOptions): Promise<T>;
  subscribe<C extends WsPushChannel>(
    channel: C,
    listener: PushListener<C>,
    options?: SubscribeOptions,
  ): () => void;
  getLatestPush<C extends WsPushChannel>(channel: C): WsPushMessage<C> | null;
  getState(): TransportState;
  dispose(): void;
  private connect;
  private handleMessage;
  private send;
  private flushQueue;
  private scheduleReconnect;
}
export {};
