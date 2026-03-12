import { type ModelSelection, type ThreadId } from "@t3tools/contracts";
import { type ChatMessage, type Thread } from "../types";
import { type ComposerImageAttachment, type DraftThreadState } from "../composerDraftStore";
import { Schema } from "effect";
import { type TerminalContextDraft } from "../lib/terminalContext";
export declare const LAST_INVOKED_SCRIPT_BY_PROJECT_KEY = "t3code:last-invoked-script-by-project";
export declare const LastInvokedScriptByProjectSchema: Schema.$Record<
  Schema.brand<Schema.Trim, "ProjectId">,
  Schema.String
>;
export declare function buildLocalDraftThread(
  threadId: ThreadId,
  draftThread: DraftThreadState,
  fallbackModelSelection: ModelSelection,
  error: string | null,
): Thread;
export declare function revokeBlobPreviewUrl(previewUrl: string | undefined): void;
export declare function revokeUserMessagePreviewUrls(message: ChatMessage): void;
export declare function collectUserMessageBlobPreviewUrls(message: ChatMessage): string[];
export type SendPhase = "idle" | "preparing-worktree" | "sending-turn";
export interface PullRequestDialogState {
  initialReference: string | null;
  key: number;
}
export declare function readFileAsDataUrl(file: File): Promise<string>;
export declare function buildTemporaryWorktreeBranchName(): string;
export declare function cloneComposerImageForRetry(
  image: ComposerImageAttachment,
): ComposerImageAttachment;
export declare function deriveComposerSendState(options: {
  prompt: string;
  imageCount: number;
  terminalContexts: ReadonlyArray<TerminalContextDraft>;
}): {
  trimmedPrompt: string;
  sendableTerminalContexts: TerminalContextDraft[];
  expiredTerminalContextCount: number;
  hasSendableContent: boolean;
};
export declare function buildExpiredTerminalContextToastCopy(
  expiredTerminalContextCount: number,
  variant: "omitted" | "empty",
): {
  title: string;
  description: string;
};
