export type ComposerTriggerKind = "path" | "slash-command" | "slash-model" | "skill";
export type ComposerSlashCommand = "model" | "plan" | "default";
export interface ComposerTrigger {
  kind: ComposerTriggerKind;
  query: string;
  rangeStart: number;
  rangeEnd: number;
}
export declare function expandCollapsedComposerCursor(text: string, cursorInput: number): number;
export declare function clampCollapsedComposerCursor(text: string, cursorInput: number): number;
export declare function collapseExpandedComposerCursor(text: string, cursorInput: number): number;
export declare function isCollapsedCursorAdjacentToInlineToken(
  text: string,
  cursorInput: number,
  direction: "left" | "right",
): boolean;
export declare const isCollapsedCursorAdjacentToMention: typeof isCollapsedCursorAdjacentToInlineToken;
export declare function detectComposerTrigger(
  text: string,
  cursorInput: number,
): ComposerTrigger | null;
export declare function parseStandaloneComposerSlashCommand(
  text: string,
): Exclude<ComposerSlashCommand, "model"> | null;
export declare function replaceTextRange(
  text: string,
  rangeStart: number,
  rangeEnd: number,
  replacement: string,
): {
  text: string;
  cursor: number;
};
