import { DEFAULT_SERVER_SETTINGS, WS_METHODS } from "@t3tools/contracts";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AsyncResult, AtomRegistry } from "effect/unstable/reactivity";
import { configureClientTracing } from "../observability/clientTracing";
import { __resetWsRpcAtomClientForTests, runRpc, WsRpcAtomClient } from "./client";
const sockets = [];
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  readyState = MockWebSocket.CONNECTING;
  sent = [];
  url;
  listeners = new Map();
  constructor(url) {
    this.url = url;
    sockets.push(this);
  }
  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? new Set();
    listeners.add(listener);
    this.listeners.set(type, listeners);
  }
  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }
  send(data) {
    this.sent.push(data);
  }
  close(code = 1000, reason = "") {
    this.readyState = MockWebSocket.CLOSED;
    this.emit("close", { code, reason, type: "close" });
  }
  open() {
    this.readyState = MockWebSocket.OPEN;
    this.emit("open", { type: "open" });
  }
  serverMessage(data) {
    this.emit("message", { data, type: "message" });
  }
  emit(type, event) {
    const listeners = this.listeners.get(type);
    if (!listeners) {
      return;
    }
    for (const listener of listeners) {
      listener(event);
    }
  }
}
const originalWebSocket = globalThis.WebSocket;
const originalFetch = globalThis.fetch;
function getSocket() {
  const socket = sockets.at(-1);
  if (!socket) {
    throw new Error("Expected a websocket instance");
  }
  return socket;
}
async function waitFor(assertion, timeoutMs = 1_000) {
  const startedAt = Date.now();
  for (;;) {
    try {
      assertion();
      return;
    } catch (error) {
      if (Date.now() - startedAt >= timeoutMs) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }
}
beforeEach(() => {
  sockets.length = 0;
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: {
        hostname: "localhost",
        origin: "http://localhost:3020",
        port: "3020",
        protocol: "ws:",
      },
      desktopBridge: undefined,
    },
  });
  globalThis.WebSocket = MockWebSocket;
});
afterEach(() => {
  __resetWsRpcAtomClientForTests();
  globalThis.WebSocket = originalWebSocket;
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});
describe("WsRpcAtomClient", () => {
  it("runs unary requests through the AtomRpc service", async () => {
    const expectedSettings = {
      ...DEFAULT_SERVER_SETTINGS,
      enableAssistantStreaming: true,
      defaultThreadEnvMode: "worktree",
      textGenerationModelSelection: {
        provider: "codex",
        model: "gpt-5.4",
      },
      providers: {
        codex: {
          ...DEFAULT_SERVER_SETTINGS.providers.codex,
          homePath: "/tmp/codex-home",
        },
        claudeAgent: {
          ...DEFAULT_SERVER_SETTINGS.providers.claudeAgent,
          enabled: false,
        },
      },
    };
    const requestPromise = runRpc((client) => client(WS_METHODS.serverGetSettings, {}));
    await waitFor(() => {
      expect(sockets).toHaveLength(1);
    });
    const socket = getSocket();
    socket.open();
    await waitFor(() => {
      expect(socket.sent).toHaveLength(1);
    });
    const requestMessage = JSON.parse(socket.sent[0] ?? "{}");
    expect(requestMessage.tag).toBe(WS_METHODS.serverGetSettings);
    socket.serverMessage(
      JSON.stringify({
        _tag: "Exit",
        requestId: requestMessage.id,
        exit: {
          _tag: "Success",
          value: expectedSettings,
        },
      }),
    );
    await expect(requestPromise).resolves.toEqual(expectedSettings);
  });
  it("exposes atom-backed query state for unary RPC methods", async () => {
    const expectedSettings = {
      ...DEFAULT_SERVER_SETTINGS,
      enableAssistantStreaming: true,
      defaultThreadEnvMode: "worktree",
      textGenerationModelSelection: {
        provider: "codex",
        model: "gpt-5.4",
      },
      providers: {
        codex: {
          ...DEFAULT_SERVER_SETTINGS.providers.codex,
          homePath: "/tmp/codex-home",
        },
        claudeAgent: {
          ...DEFAULT_SERVER_SETTINGS.providers.claudeAgent,
          enabled: false,
        },
      },
    };
    const registry = AtomRegistry.make();
    const query = WsRpcAtomClient.query(WS_METHODS.serverGetSettings, {});
    const release = registry.mount(query);
    await waitFor(() => {
      expect(sockets).toHaveLength(1);
    });
    const socket = getSocket();
    socket.open();
    await waitFor(() => {
      expect(socket.sent).toHaveLength(1);
    });
    const requestMessage = JSON.parse(socket.sent[0] ?? "{}");
    expect(requestMessage.tag).toBe(WS_METHODS.serverGetSettings);
    expect(registry.get(query)._tag).toBe("Initial");
    socket.serverMessage(
      JSON.stringify({
        _tag: "Exit",
        requestId: requestMessage.id,
        exit: {
          _tag: "Success",
          value: expectedSettings,
        },
      }),
    );
    await waitFor(() => {
      const result = registry.get(query);
      expect(AsyncResult.isSuccess(result)).toBe(true);
      if (!AsyncResult.isSuccess(result)) {
        return;
      }
      expect(result.value).toEqual(expectedSettings);
    });
    release();
    registry.dispose();
  });
  it("attaches distributed trace ids when client OTLP tracing is enabled", async () => {
    await configureClientTracing({
      exportIntervalMs: 10,
    });
    const requestPromise = runRpc((client) => client(WS_METHODS.serverGetSettings, {}));
    await waitFor(() => {
      expect(sockets).toHaveLength(1);
    });
    const socket = getSocket();
    socket.open();
    await waitFor(() => {
      expect(socket.sent).toHaveLength(1);
    });
    const requestMessage = JSON.parse(socket.sent[0] ?? "{}");
    expect(requestMessage.tag).toBe(WS_METHODS.serverGetSettings);
    expect(requestMessage.traceId).toMatch(/^[0-9a-f]{32}$/);
    expect(requestMessage.spanId).toMatch(/^[0-9a-f]{16}$/);
    socket.serverMessage(
      JSON.stringify({
        _tag: "Exit",
        requestId: requestMessage.id,
        exit: {
          _tag: "Success",
          value: DEFAULT_SERVER_SETTINGS,
        },
      }),
    );
    await expect(requestPromise).resolves.toEqual(DEFAULT_SERVER_SETTINGS);
  });
});
