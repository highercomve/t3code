import { WebSocketResponse, WsResponse as WsResponseSchema } from "@t3tools/contracts";
import { decodeUnknownJsonResult, formatSchemaError } from "@t3tools/shared/schemaJson";
import { Result, Schema } from "effect";
const REQUEST_TIMEOUT_MS = 60_000;
const RECONNECT_DELAYS_MS = [500, 1_000, 2_000, 4_000, 8_000];
const decodeWsResponse = decodeUnknownJsonResult(WsResponseSchema);
const isWebSocketResponseEnvelope = Schema.is(WebSocketResponse);
const isWsPushMessage = (value) => "type" in value && value.type === "push";
function asError(value, fallback) {
  if (value instanceof Error) {
    return value;
  }
  return new Error(fallback);
}
export class WsTransport {
  ws = null;
  nextId = 1;
  pending = new Map();
  listeners = new Map();
  latestPushByChannel = new Map();
  outboundQueue = [];
  reconnectAttempt = 0;
  reconnectTimer = null;
  disposed = false;
  state = "connecting";
  url;
  constructor(url) {
    const bridgeUrl = window.desktopBridge?.getWsUrl();
    const envUrl = import.meta.env.VITE_WS_URL;
    this.url =
      url ??
      (bridgeUrl && bridgeUrl.length > 0
        ? bridgeUrl
        : envUrl && envUrl.length > 0
          ? envUrl
          : `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.hostname}:${window.location.port}`);
    this.connect();
  }
  async request(method, params, options) {
    if (typeof method !== "string" || method.length === 0) {
      throw new Error("Request method is required");
    }
    const id = String(this.nextId++);
    const body = params != null ? { ...params, _tag: method } : { _tag: method };
    const message = { id, body };
    const encoded = JSON.stringify(message);
    return new Promise((resolve, reject) => {
      const timeoutMs = options?.timeoutMs === undefined ? REQUEST_TIMEOUT_MS : options.timeoutMs;
      const timeout =
        timeoutMs === null
          ? null
          : setTimeout(() => {
              this.pending.delete(id);
              reject(new Error(`Request timed out: ${method}`));
            }, timeoutMs);
      this.pending.set(id, {
        resolve: resolve,
        reject,
        timeout,
      });
      this.send(encoded);
    });
  }
  subscribe(channel, listener, options) {
    let channelListeners = this.listeners.get(channel);
    if (!channelListeners) {
      channelListeners = new Set();
      this.listeners.set(channel, channelListeners);
    }
    const wrappedListener = (message) => {
      listener(message);
    };
    channelListeners.add(wrappedListener);
    if (options?.replayLatest) {
      const latest = this.latestPushByChannel.get(channel);
      if (latest) {
        wrappedListener(latest);
      }
    }
    return () => {
      channelListeners?.delete(wrappedListener);
      if (channelListeners?.size === 0) {
        this.listeners.delete(channel);
      }
    };
  }
  getLatestPush(channel) {
    const latest = this.latestPushByChannel.get(channel);
    return latest ? latest : null;
  }
  getState() {
    return this.state;
  }
  dispose() {
    this.disposed = true;
    this.state = "disposed";
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    for (const pending of this.pending.values()) {
      if (pending.timeout !== null) {
        clearTimeout(pending.timeout);
      }
      pending.reject(new Error("Transport disposed"));
    }
    this.pending.clear();
    this.outboundQueue.length = 0;
    this.ws?.close();
    this.ws = null;
  }
  connect() {
    if (this.disposed) {
      return;
    }
    this.state = this.reconnectAttempt > 0 ? "reconnecting" : "connecting";
    const ws = new WebSocket(this.url);
    ws.addEventListener("open", () => {
      this.ws = ws;
      this.state = "open";
      this.reconnectAttempt = 0;
      this.flushQueue();
    });
    ws.addEventListener("message", (event) => {
      this.handleMessage(event.data);
    });
    ws.addEventListener("close", () => {
      if (this.ws === ws) {
        this.ws = null;
        this.outboundQueue.length = 0;
        for (const [id, pending] of this.pending.entries()) {
          if (pending.timeout !== null) {
            clearTimeout(pending.timeout);
          }
          this.pending.delete(id);
          pending.reject(new Error("WebSocket connection closed."));
        }
      }
      if (this.disposed) {
        this.state = "disposed";
        return;
      }
      this.state = "closed";
      this.scheduleReconnect();
    });
    ws.addEventListener("error", (event) => {
      // Log WebSocket errors for debugging (close event will follow)
      console.warn("WebSocket connection error", { type: event.type, url: this.url });
    });
  }
  handleMessage(raw) {
    const result = decodeWsResponse(raw);
    if (Result.isFailure(result)) {
      console.warn("Dropped inbound WebSocket envelope", formatSchemaError(result.failure));
      return;
    }
    const message = result.success;
    if (isWsPushMessage(message)) {
      this.latestPushByChannel.set(message.channel, message);
      const channelListeners = this.listeners.get(message.channel);
      if (channelListeners) {
        for (const listener of channelListeners) {
          try {
            listener(message);
          } catch {
            // Swallow listener errors
          }
        }
      }
      return;
    }
    if (!isWebSocketResponseEnvelope(message)) {
      return;
    }
    const pending = this.pending.get(message.id);
    if (!pending) {
      return;
    }
    if (pending.timeout !== null) {
      clearTimeout(pending.timeout);
    }
    this.pending.delete(message.id);
    if (message.error) {
      pending.reject(new Error(message.error.message));
      return;
    }
    pending.resolve(message.result);
  }
  send(encodedMessage) {
    if (this.disposed) {
      return;
    }
    this.outboundQueue.push(encodedMessage);
    try {
      this.flushQueue();
    } catch {
      // Swallow: flushQueue has queued the message for retry on reconnect
    }
  }
  flushQueue() {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      return;
    }
    while (this.outboundQueue.length > 0) {
      const message = this.outboundQueue.shift();
      if (!message) {
        continue;
      }
      try {
        this.ws.send(message);
      } catch (error) {
        this.outboundQueue.unshift(message);
        throw asError(error, "Failed to send WebSocket request.");
      }
    }
  }
  scheduleReconnect() {
    if (this.disposed || this.reconnectTimer !== null) {
      return;
    }
    const delay =
      RECONNECT_DELAYS_MS[Math.min(this.reconnectAttempt, RECONNECT_DELAYS_MS.length - 1)] ??
      RECONNECT_DELAYS_MS[0];
    this.reconnectAttempt += 1;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }
}
