export function deriveOrchestrationBatchEffects(events) {
  const threadLifecycleEffects = new Map();
  let needsProviderInvalidation = false;
  for (const event of events) {
    switch (event.type) {
      case "thread.turn-diff-completed":
      case "thread.reverted": {
        needsProviderInvalidation = true;
        break;
      }
      case "thread.created": {
        threadLifecycleEffects.set(event.payload.threadId, {
          clearPromotedDraft: true,
          clearDeletedThread: false,
          removeTerminalState: false,
        });
        break;
      }
      case "thread.deleted": {
        threadLifecycleEffects.set(event.payload.threadId, {
          clearPromotedDraft: false,
          clearDeletedThread: true,
          removeTerminalState: true,
        });
        break;
      }
      default: {
        break;
      }
    }
  }
  const clearPromotedDraftThreadIds = [];
  const clearDeletedThreadIds = [];
  const removeTerminalStateThreadIds = [];
  for (const [threadId, effect] of threadLifecycleEffects) {
    if (effect.clearPromotedDraft) {
      clearPromotedDraftThreadIds.push(threadId);
    }
    if (effect.clearDeletedThread) {
      clearDeletedThreadIds.push(threadId);
    }
    if (effect.removeTerminalState) {
      removeTerminalStateThreadIds.push(threadId);
    }
  }
  return {
    clearPromotedDraftThreadIds,
    clearDeletedThreadIds,
    removeTerminalStateThreadIds,
    needsProviderInvalidation,
  };
}
