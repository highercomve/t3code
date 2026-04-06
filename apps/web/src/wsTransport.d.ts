import { Duration, Effect, Option, Stream } from "effect";
import { type WsRpcProtocolClient } from "./rpc/protocol";
interface SubscribeOptions {
  readonly retryDelay?: Duration.Input;
  readonly onResubscribe?: () => void;
}
interface RequestOptions {
  readonly timeout?: Option.Option<Duration.Input>;
}
export declare class WsTransport {
  private readonly tracingReady;
  private readonly url;
  private disposed;
  private reconnectChain;
  private session;
  constructor(url?: string);
  request<TSuccess>(
    execute: (client: WsRpcProtocolClient) => Effect.Effect<TSuccess, Error, never>,
    _options?: RequestOptions,
  ): Promise<TSuccess>;
  requestStream<TValue>(
    connect: (client: WsRpcProtocolClient) => Stream.Stream<TValue, Error, never>,
    listener: (value: TValue) => void,
  ): Promise<void>;
  subscribe<TValue>(
    connect: (client: WsRpcProtocolClient) => Stream.Stream<TValue, Error, never>,
    listener: (value: TValue) => void,
    options?: SubscribeOptions,
  ): () => void;
  reconnect(): Promise<void>;
  dispose(): Promise<void>;
  private closeSession;
  private createSession;
  private runStreamOnSession;
}
export {};
