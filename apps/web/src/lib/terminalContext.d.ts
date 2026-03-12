import { type ThreadId } from "@t3tools/contracts";
export interface TerminalContextSelection {
  terminalId: string;
  terminalLabel: string;
  lineStart: number;
  lineEnd: number;
  text: string;
}
export interface TerminalContextDraft extends TerminalContextSelection {
  id: string;
  threadId: ThreadId;
  createdAt: string;
}
export interface ExtractedTerminalContexts {
  promptText: string;
  contextCount: number;
  previewTitle: string | null;
  contexts: ParsedTerminalContextEntry[];
}
export interface DisplayedUserMessageState {
  visibleText: string;
  copyText: string;
  contextCount: number;
  previewTitle: string | null;
  contexts: ParsedTerminalContextEntry[];
}
export interface ParsedTerminalContextEntry {
  header: string;
  body: string;
}
export declare const INLINE_TERMINAL_CONTEXT_PLACEHOLDER = "\uFFFC";
export declare function normalizeTerminalContextText(text: string): string;
export declare function hasTerminalContextText(context: { text: string }): boolean;
export declare function isTerminalContextExpired(context: { text: string }): boolean;
export declare function filterTerminalContextsWithText<
  T extends {
    text: string;
  },
>(contexts: ReadonlyArray<T>): T[];
export declare function normalizeTerminalContextSelection(
  selection: TerminalContextSelection,
): TerminalContextSelection | null;
export declare function formatTerminalContextRange(selection: {
  lineStart: number;
  lineEnd: number;
}): string;
export declare function formatTerminalContextLabel(selection: {
  terminalLabel: string;
  lineStart: number;
  lineEnd: number;
}): string;
export declare function formatInlineTerminalContextLabel(selection: {
  terminalLabel: string;
  lineStart: number;
  lineEnd: number;
}): string;
export declare function buildTerminalContextPreviewTitle(
  contexts: ReadonlyArray<TerminalContextSelection>,
): string | null;
export declare function buildTerminalContextBlock(
  contexts: ReadonlyArray<TerminalContextSelection>,
): string;
export declare function materializeInlineTerminalContextPrompt(
  prompt: string,
  contexts: ReadonlyArray<{
    terminalLabel: string;
    lineStart: number;
    lineEnd: number;
  }>,
): string;
export declare function appendTerminalContextsToPrompt(
  prompt: string,
  contexts: ReadonlyArray<TerminalContextSelection>,
): string;
export declare function extractTrailingTerminalContexts(prompt: string): ExtractedTerminalContexts;
export declare function deriveDisplayedUserMessageState(prompt: string): DisplayedUserMessageState;
export declare function countInlineTerminalContextPlaceholders(prompt: string): number;
export declare function ensureInlineTerminalContextPlaceholders(
  prompt: string,
  terminalContextCount: number,
): string;
export declare function insertInlineTerminalContextPlaceholder(
  prompt: string,
  cursorInput: number,
): {
  prompt: string;
  cursor: number;
  contextIndex: number;
};
export declare function stripInlineTerminalContextPlaceholders(prompt: string): string;
export declare function removeInlineTerminalContextPlaceholder(
  prompt: string,
  contextIndex: number,
): {
  prompt: string;
  cursor: number;
};
