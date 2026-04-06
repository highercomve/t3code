import { useAtomValue } from "@effect/atom-react";
import { Atom } from "effect/unstable/reactivity";
import { appAtomRegistry } from "./atomRegistry";
export const SLOW_RPC_ACK_THRESHOLD_MS = 15_000;
export const MAX_TRACKED_RPC_ACK_REQUESTS = 256;
let slowRpcAckThresholdMs = SLOW_RPC_ACK_THRESHOLD_MS;
const pendingRpcAckRequests = new Map();
const slowRpcAckRequestsAtom = Atom.make([]).pipe(
  Atom.keepAlive,
  Atom.withLabel("slow-rpc-ack-requests"),
);
function setSlowRpcAckRequests(requests) {
  appAtomRegistry.set(slowRpcAckRequestsAtom, [...requests]);
}
function getSlowRpcAckRequestsValue() {
  return appAtomRegistry.get(slowRpcAckRequestsAtom);
}
function shouldTrackRpcAck(tag) {
  return !tag.startsWith("subscribe");
}
export function getSlowRpcAckRequests() {
  return getSlowRpcAckRequestsValue();
}
export function trackRpcRequestSent(requestId, tag) {
  if (!shouldTrackRpcAck(tag)) {
    return;
  }
  clearTrackedRpcRequest(requestId);
  evictOldestPendingRpcRequestIfNeeded();
  const startedAtMs = Date.now();
  const request = {
    requestId,
    startedAt: new Date(startedAtMs).toISOString(),
    startedAtMs,
    tag,
    thresholdMs: slowRpcAckThresholdMs,
  };
  const timeoutId = setTimeout(() => {
    pendingRpcAckRequests.delete(requestId);
    appendSlowRpcAckRequest(request);
  }, slowRpcAckThresholdMs);
  pendingRpcAckRequests.set(requestId, {
    request,
    timeoutId,
  });
}
export function acknowledgeRpcRequest(requestId) {
  clearTrackedRpcRequest(requestId);
  const slowRequests = getSlowRpcAckRequestsValue();
  if (!slowRequests.some((request) => request.requestId === requestId)) {
    return;
  }
  setSlowRpcAckRequests(slowRequests.filter((request) => request.requestId !== requestId));
}
export function clearAllTrackedRpcRequests() {
  for (const pending of pendingRpcAckRequests.values()) {
    clearTimeout(pending.timeoutId);
  }
  pendingRpcAckRequests.clear();
  setSlowRpcAckRequests([]);
}
function clearTrackedRpcRequest(requestId) {
  const pending = pendingRpcAckRequests.get(requestId);
  if (!pending) {
    return;
  }
  clearTimeout(pending.timeoutId);
  pendingRpcAckRequests.delete(requestId);
}
function appendSlowRpcAckRequest(request) {
  const requests = [...getSlowRpcAckRequestsValue(), request];
  if (requests.length <= MAX_TRACKED_RPC_ACK_REQUESTS) {
    setSlowRpcAckRequests(requests);
    return;
  }
  setSlowRpcAckRequests(requests.slice(-MAX_TRACKED_RPC_ACK_REQUESTS));
}
function evictOldestPendingRpcRequestIfNeeded() {
  while (pendingRpcAckRequests.size >= MAX_TRACKED_RPC_ACK_REQUESTS) {
    const oldestRequestId = pendingRpcAckRequests.keys().next().value;
    if (oldestRequestId === undefined) {
      return;
    }
    clearTrackedRpcRequest(oldestRequestId);
  }
}
export function resetRequestLatencyStateForTests() {
  slowRpcAckThresholdMs = SLOW_RPC_ACK_THRESHOLD_MS;
  clearAllTrackedRpcRequests();
}
export function setSlowRpcAckThresholdMsForTests(thresholdMs) {
  slowRpcAckThresholdMs = thresholdMs;
}
export function useSlowRpcAckRequests() {
  return useAtomValue(slowRpcAckRequestsAtom);
}
