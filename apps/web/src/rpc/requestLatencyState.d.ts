export declare const SLOW_RPC_ACK_THRESHOLD_MS = 15000;
export declare const MAX_TRACKED_RPC_ACK_REQUESTS = 256;
export interface SlowRpcAckRequest {
  readonly requestId: string;
  readonly startedAt: string;
  readonly startedAtMs: number;
  readonly tag: string;
  readonly thresholdMs: number;
}
export declare function getSlowRpcAckRequests(): ReadonlyArray<SlowRpcAckRequest>;
export declare function trackRpcRequestSent(requestId: string, tag: string): void;
export declare function acknowledgeRpcRequest(requestId: string): void;
export declare function clearAllTrackedRpcRequests(): void;
export declare function resetRequestLatencyStateForTests(): void;
export declare function setSlowRpcAckThresholdMsForTests(thresholdMs: number): void;
export declare function useSlowRpcAckRequests(): ReadonlyArray<SlowRpcAckRequest>;
