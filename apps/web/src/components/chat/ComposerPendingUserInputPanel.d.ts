import { type ApprovalRequestId } from "@t3tools/contracts";
import { type PendingUserInput } from "../../session-logic";
import { type PendingUserInputDraftAnswer } from "../../pendingUserInput";
interface PendingUserInputPanelProps {
  pendingUserInputs: PendingUserInput[];
  respondingRequestIds: ApprovalRequestId[];
  answers: Record<string, PendingUserInputDraftAnswer>;
  questionIndex: number;
  onToggleOption: (questionId: string, optionLabel: string) => void;
  onAdvance: () => void;
}
export declare const ComposerPendingUserInputPanel: import("react").NamedExoticComponent<PendingUserInputPanelProps>;
export {};
