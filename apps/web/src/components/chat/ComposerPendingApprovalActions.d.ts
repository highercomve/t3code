import { type ApprovalRequestId, type ProviderApprovalDecision } from "@t3tools/contracts";
interface ComposerPendingApprovalActionsProps {
  requestId: ApprovalRequestId;
  isResponding: boolean;
  onRespondToApproval: (
    requestId: ApprovalRequestId,
    decision: ProviderApprovalDecision,
  ) => Promise<void>;
}
export declare const ComposerPendingApprovalActions: import("react").NamedExoticComponent<ComposerPendingApprovalActionsProps>;
export {};
