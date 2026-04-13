import {
  type EnvironmentId,
  type ModelSelection,
  type ProviderKind,
  type ScopedThreadRef,
  type ThreadId,
  type TurnId,
} from "@t3tools/contracts";
import { type ChatMessage, type SessionPhase, type Thread, type ThreadSession } from "../types";
import { type ComposerImageAttachment, type DraftThreadState } from "../composerDraftStore";
import { Schema } from "effect";
import { type TerminalContextDraft } from "../lib/terminalContext";
import type { DraftThreadEnvMode } from "../composerDraftStore";
export declare const LAST_INVOKED_SCRIPT_BY_PROJECT_KEY = "t3code:last-invoked-script-by-project";
export declare const MAX_HIDDEN_MOUNTED_TERMINAL_THREADS = 10;
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
export declare function shouldWriteThreadErrorToCurrentServerThread(input: {
  serverThread:
    | {
        environmentId: EnvironmentId;
        id: ThreadId;
      }
    | null
    | undefined;
  routeThreadRef: ScopedThreadRef;
  targetThreadId: ThreadId;
}): boolean;
export declare function reconcileMountedTerminalThreadIds(input: {
  currentThreadIds: ReadonlyArray<string>;
  openThreadIds: ReadonlyArray<string>;
  activeThreadId: string | null;
  activeThreadTerminalOpen: boolean;
  maxHiddenThreadCount?: number;
}): string[];
export declare function revokeBlobPreviewUrl(previewUrl: string | undefined): void;
export declare function revokeUserMessagePreviewUrls(message: ChatMessage): void;
export declare function collectUserMessageBlobPreviewUrls(message: ChatMessage): string[];
export interface PullRequestDialogState {
  initialReference: string | null;
  key: number;
}
export declare function readFileAsDataUrl(file: File): Promise<string>;
export declare function resolveSendEnvMode(input: {
  requestedEnvMode: DraftThreadEnvMode;
  isGitRepo: boolean;
}): DraftThreadEnvMode;
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
export declare function threadHasStarted(thread: Thread | null | undefined): boolean;
export declare function deriveLockedProvider(input: {
  thread: Thread | null | undefined;
  selectedProvider: ProviderKind | null;
  threadProvider: ProviderKind | null;
}): ProviderKind | null;
export declare function waitForStartedServerThread(
  threadRef: ScopedThreadRef,
  timeoutMs?: number,
): Promise<boolean>;
export interface LocalDispatchSnapshot {
  startedAt: string;
  preparingWorktree: boolean;
  latestTurnTurnId: TurnId | null;
  latestTurnRequestedAt: string | null;
  latestTurnStartedAt: string | null;
  latestTurnCompletedAt: string | null;
  sessionOrchestrationStatus: ThreadSession["orchestrationStatus"] | null;
  sessionUpdatedAt: string | null;
}
export declare function createLocalDispatchSnapshot(
  activeThread: Thread | undefined,
  options?: {
    preparingWorktree?: boolean;
  },
): LocalDispatchSnapshot;
export declare function hasServerAcknowledgedLocalDispatch(input: {
  localDispatch: LocalDispatchSnapshot | null;
  phase: SessionPhase;
  latestTurn: Thread["latestTurn"] | null;
  session: Thread["session"] | null;
  hasPendingApproval: boolean;
  hasPendingUserInput: boolean;
  threadError: string | null | undefined;
}): boolean;
