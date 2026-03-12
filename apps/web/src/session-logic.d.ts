import {
  ApprovalRequestId,
  type OrchestrationLatestTurn,
  type OrchestrationThreadActivity,
  type OrchestrationProposedPlanId,
  type ProviderKind,
  type ToolLifecycleItemType,
  type UserInputQuestion,
  type ThreadId,
  type TurnId,
} from "@t3tools/contracts";
import type {
  ChatMessage,
  ProposedPlan,
  SessionPhase,
  Thread,
  ThreadSession,
  TurnDiffSummary,
} from "./types";
export type ProviderPickerKind = ProviderKind | "cursor";
export declare const PROVIDER_OPTIONS: Array<{
  value: ProviderPickerKind;
  label: string;
  available: boolean;
}>;
export interface WorkLogEntry {
  id: string;
  createdAt: string;
  label: string;
  detail?: string;
  command?: string;
  changedFiles?: ReadonlyArray<string>;
  tone: "thinking" | "tool" | "info" | "error";
  toolTitle?: string;
  itemType?: ToolLifecycleItemType;
  requestKind?: PendingApproval["requestKind"];
}
export interface PendingApproval {
  requestId: ApprovalRequestId;
  requestKind: "command" | "file-read" | "file-change";
  createdAt: string;
  detail?: string;
}
export interface PendingUserInput {
  requestId: ApprovalRequestId;
  createdAt: string;
  questions: ReadonlyArray<UserInputQuestion>;
}
export interface ActivePlanState {
  createdAt: string;
  turnId: TurnId | null;
  explanation?: string | null;
  steps: Array<{
    step: string;
    status: "pending" | "inProgress" | "completed";
  }>;
}
export interface LatestProposedPlanState {
  id: OrchestrationProposedPlanId;
  createdAt: string;
  updatedAt: string;
  turnId: TurnId | null;
  planMarkdown: string;
  implementedAt: string | null;
  implementationThreadId: ThreadId | null;
}
export type TimelineEntry =
  | {
      id: string;
      kind: "message";
      createdAt: string;
      message: ChatMessage;
    }
  | {
      id: string;
      kind: "proposed-plan";
      createdAt: string;
      proposedPlan: ProposedPlan;
    }
  | {
      id: string;
      kind: "work";
      createdAt: string;
      entry: WorkLogEntry;
    };
export declare function formatDuration(durationMs: number): string;
export declare function formatElapsed(startIso: string, endIso: string | undefined): string | null;
type LatestTurnTiming = Pick<OrchestrationLatestTurn, "turnId" | "startedAt" | "completedAt">;
type SessionActivityState = Pick<ThreadSession, "orchestrationStatus" | "activeTurnId">;
export declare function isLatestTurnSettled(
  latestTurn: LatestTurnTiming | null,
  session: SessionActivityState | null,
): boolean;
export declare function deriveActiveWorkStartedAt(
  latestTurn: LatestTurnTiming | null,
  session: SessionActivityState | null,
  sendStartedAt: string | null,
): string | null;
export declare function derivePendingApprovals(
  activities: ReadonlyArray<OrchestrationThreadActivity>,
): PendingApproval[];
export declare function derivePendingUserInputs(
  activities: ReadonlyArray<OrchestrationThreadActivity>,
): PendingUserInput[];
export declare function deriveActivePlanState(
  activities: ReadonlyArray<OrchestrationThreadActivity>,
  latestTurnId: TurnId | undefined,
): ActivePlanState | null;
export declare function findLatestProposedPlan(
  proposedPlans: ReadonlyArray<ProposedPlan>,
  latestTurnId: TurnId | string | null | undefined,
): LatestProposedPlanState | null;
export declare function findSidebarProposedPlan(input: {
  threads: ReadonlyArray<Pick<Thread, "id" | "proposedPlans">>;
  latestTurn: Pick<OrchestrationLatestTurn, "turnId" | "sourceProposedPlan"> | null;
  latestTurnSettled: boolean;
  threadId: ThreadId | string | null | undefined;
}): LatestProposedPlanState | null;
export declare function hasActionableProposedPlan(
  proposedPlan: LatestProposedPlanState | Pick<ProposedPlan, "implementedAt"> | null,
): boolean;
export declare function deriveWorkLogEntries(
  activities: ReadonlyArray<OrchestrationThreadActivity>,
  latestTurnId: TurnId | undefined,
): WorkLogEntry[];
export declare function hasToolActivityForTurn(
  activities: ReadonlyArray<OrchestrationThreadActivity>,
  turnId: TurnId | null | undefined,
): boolean;
export declare function deriveTimelineEntries(
  messages: ChatMessage[],
  proposedPlans: ProposedPlan[],
  workEntries: WorkLogEntry[],
): TimelineEntry[];
export declare function inferCheckpointTurnCountByTurnId(
  summaries: TurnDiffSummary[],
): Record<TurnId, number>;
export declare function derivePhase(session: ThreadSession | null): SessionPhase;
export {};
