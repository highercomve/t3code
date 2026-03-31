export function createOrchestrationRecoveryCoordinator() {
  let state = {
    latestSequence: 0,
    highestObservedSequence: 0,
    bootstrapped: false,
    pendingReplay: false,
    inFlight: null,
  };
  let replayStartSequence = null;
  const snapshotState = () => ({
    ...state,
    ...(state.inFlight ? { inFlight: { ...state.inFlight } } : {}),
  });
  const observeSequence = (sequence) => {
    state.highestObservedSequence = Math.max(state.highestObservedSequence, sequence);
  };
  const shouldReplayAfterRecovery = () => {
    const shouldReplay =
      state.pendingReplay || state.highestObservedSequence > state.latestSequence;
    state.pendingReplay = false;
    return shouldReplay;
  };
  return {
    getState() {
      return snapshotState();
    },
    classifyDomainEvent(sequence) {
      observeSequence(sequence);
      if (sequence <= state.latestSequence) {
        return "ignore";
      }
      if (!state.bootstrapped || state.inFlight) {
        state.pendingReplay = true;
        return "defer";
      }
      if (sequence !== state.latestSequence + 1) {
        state.pendingReplay = true;
        return "recover";
      }
      return "apply";
    },
    markEventBatchApplied(events) {
      const nextEvents = events
        .filter((event) => event.sequence > state.latestSequence)
        .toSorted((left, right) => left.sequence - right.sequence);
      if (nextEvents.length === 0) {
        return [];
      }
      state.latestSequence = nextEvents.at(-1)?.sequence ?? state.latestSequence;
      state.highestObservedSequence = Math.max(state.highestObservedSequence, state.latestSequence);
      return nextEvents;
    },
    beginSnapshotRecovery(reason) {
      if (state.inFlight?.kind === "snapshot") {
        state.pendingReplay = true;
        return false;
      }
      if (state.inFlight?.kind === "replay") {
        state.pendingReplay = true;
        return false;
      }
      state.inFlight = { kind: "snapshot", reason };
      return true;
    },
    completeSnapshotRecovery(snapshotSequence) {
      state.latestSequence = Math.max(state.latestSequence, snapshotSequence);
      state.highestObservedSequence = Math.max(state.highestObservedSequence, state.latestSequence);
      state.bootstrapped = true;
      state.inFlight = null;
      return shouldReplayAfterRecovery();
    },
    failSnapshotRecovery() {
      state.inFlight = null;
    },
    beginReplayRecovery(reason) {
      if (!state.bootstrapped || state.inFlight?.kind === "snapshot") {
        state.pendingReplay = true;
        return false;
      }
      if (state.inFlight?.kind === "replay") {
        state.pendingReplay = true;
        return false;
      }
      state.pendingReplay = false;
      replayStartSequence = state.latestSequence;
      state.inFlight = { kind: "replay", reason };
      return true;
    },
    completeReplayRecovery() {
      const replayMadeProgress =
        replayStartSequence !== null && state.latestSequence > replayStartSequence;
      replayStartSequence = null;
      state.inFlight = null;
      if (!replayMadeProgress) {
        state.pendingReplay = false;
        return false;
      }
      return shouldReplayAfterRecovery();
    },
    failReplayRecovery() {
      replayStartSequence = null;
      state.bootstrapped = false;
      state.inFlight = null;
    },
  };
}
