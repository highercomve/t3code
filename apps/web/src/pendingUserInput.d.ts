import type { UserInputQuestion } from "@t3tools/contracts";
export interface PendingUserInputDraftAnswer {
  selectedOptionLabel?: string;
  customAnswer?: string;
}
export interface PendingUserInputProgress {
  questionIndex: number;
  activeQuestion: UserInputQuestion | null;
  activeDraft: PendingUserInputDraftAnswer | undefined;
  selectedOptionLabel: string | undefined;
  customAnswer: string;
  resolvedAnswer: string | null;
  usingCustomAnswer: boolean;
  answeredQuestionCount: number;
  isLastQuestion: boolean;
  isComplete: boolean;
  canAdvance: boolean;
}
export declare function resolvePendingUserInputAnswer(
  draft: PendingUserInputDraftAnswer | undefined,
): string | null;
export declare function setPendingUserInputCustomAnswer(
  draft: PendingUserInputDraftAnswer | undefined,
  customAnswer: string,
): PendingUserInputDraftAnswer;
export declare function buildPendingUserInputAnswers(
  questions: ReadonlyArray<UserInputQuestion>,
  draftAnswers: Record<string, PendingUserInputDraftAnswer>,
): Record<string, string> | null;
export declare function countAnsweredPendingUserInputQuestions(
  questions: ReadonlyArray<UserInputQuestion>,
  draftAnswers: Record<string, PendingUserInputDraftAnswer>,
): number;
export declare function findFirstUnansweredPendingUserInputQuestionIndex(
  questions: ReadonlyArray<UserInputQuestion>,
  draftAnswers: Record<string, PendingUserInputDraftAnswer>,
): number;
export declare function derivePendingUserInputProgress(
  questions: ReadonlyArray<UserInputQuestion>,
  draftAnswers: Record<string, PendingUserInputDraftAnswer>,
  questionIndex: number,
): PendingUserInputProgress;
