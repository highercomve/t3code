export interface WaitForHttpReadyOptions {
  readonly timeoutMs?: number;
  readonly intervalMs?: number;
  readonly requestTimeoutMs?: number;
  readonly fetchImpl?: typeof fetch;
  readonly signal?: AbortSignal;
}
export declare class BackendReadinessAbortedError extends Error {
  constructor();
}
export declare function isBackendReadinessAborted(
  error: unknown,
): error is BackendReadinessAbortedError;
export declare function waitForHttpReady(
  baseUrl: string,
  options?: WaitForHttpReadyOptions,
): Promise<void>;
