export type OrchestrationRecoveryReason = "bootstrap" | "sequence-gap" | "replay-failed";
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
type SequencedEvent = Readonly<{
  sequence: number;
}>;
export declare function createOrchestrationRecoveryCoordinator(): {
  getState(): OrchestrationRecoveryState;
  classifyDomainEvent(sequence: number): "ignore" | "defer" | "recover" | "apply";
  markEventBatchApplied<T extends SequencedEvent>(events: ReadonlyArray<T>): ReadonlyArray<T>;
  beginSnapshotRecovery(reason: OrchestrationRecoveryReason): boolean;
  completeSnapshotRecovery(snapshotSequence: number): boolean;
  failSnapshotRecovery(): void;
  beginReplayRecovery(reason: OrchestrationRecoveryReason): boolean;
  completeReplayRecovery(): boolean;
  failReplayRecovery(): void;
};
export {};
