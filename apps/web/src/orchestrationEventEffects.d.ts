import type { OrchestrationEvent, ThreadId } from "@t3tools/contracts";
export interface OrchestrationBatchEffects {
  clearPromotedDraftThreadIds: ThreadId[];
  clearDeletedThreadIds: ThreadId[];
  removeTerminalStateThreadIds: ThreadId[];
  needsProviderInvalidation: boolean;
}
export declare function deriveOrchestrationBatchEffects(
  events: readonly OrchestrationEvent[],
): OrchestrationBatchEffects;
