import { Duration, Effect, Option, Stream } from "effect";
import {
  type WsProtocolLifecycleHandlers,
  type WsRpcProtocolClient,
  type WsRpcProtocolSocketUrlProvider,
} from "./protocol";
interface SubscribeOptions {
  readonly retryDelay?: Duration.Input;
  readonly onResubscribe?: () => void;
}
interface RequestOptions {
  readonly timeout?: Option.Option<Duration.Input>;
}
export declare class WsTransport {
  private readonly url;
  private readonly lifecycleHandlers;
  private disposed;
  private hasReportedTransportDisconnect;
  private reconnectChain;
  private session;
  constructor(url: WsRpcProtocolSocketUrlProvider, lifecycleHandlers?: WsProtocolLifecycleHandlers);
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
