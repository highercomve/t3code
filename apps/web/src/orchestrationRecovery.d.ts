export type OrchestrationRecoveryReason =
  | "bootstrap"
  | "sequence-gap"
  | "resubscribe"
  | "replay-failed";
export interface OrchestrationRecoveryPhase {
  kind: "snapshot" | "replay";
  reason: OrchestrationRecoveryReason;
}
export interface OrchestrationRecoveryState {
  latestSequence: number;
  highestObservedSequence: number;
  bootstrapped: boolean;
  pendingReplay: boolean;
  inFlight: OrchestrationRecoveryPhase | null;
}
export interface ReplayRecoveryCompletion {
  replayMadeProgress: boolean;
  shouldReplay: boolean;
}
export interface ReplayRetryTracker {
  attempts: number;
  latestSequence: number;
  highestObservedSequence: number;
}
export interface ReplayRetryDecision {
  shouldRetry: boolean;
  delayMs: number;
  tracker: ReplayRetryTracker | null;
}
type SequencedEvent = Readonly<{
  sequence: number;
}>;
export declare function deriveReplayRetryDecision(input: {
  previousTracker: ReplayRetryTracker | null;
  completion: ReplayRecoveryCompletion;
  recoveryState: Pick<OrchestrationRecoveryState, "latestSequence" | "highestObservedSequence">;
  baseDelayMs: number;
  maxNoProgressRetries: number;
}): ReplayRetryDecision;
export declare function createOrchestrationRecoveryCoordinator(): {
  getState(): OrchestrationRecoveryState;
  classifyDomainEvent(sequence: number): "ignore" | "defer" | "recover" | "apply";
  markEventBatchApplied<T extends SequencedEvent>(events: ReadonlyArray<T>): ReadonlyArray<T>;
  beginSnapshotRecovery(reason: OrchestrationRecoveryReason): boolean;
  completeSnapshotRecovery(snapshotSequence: number): boolean;
  failSnapshotRecovery(): void;
  beginReplayRecovery(reason: OrchestrationRecoveryReason): boolean;
  completeReplayRecovery(): ReplayRecoveryCompletion;
  failReplayRecovery(): void;
};
export {};
