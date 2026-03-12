import { type TerminalContextDraft } from "./lib/terminalContext";
export type ComposerPromptSegment =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "mention";
      path: string;
    }
  | {
      type: "terminal-context";
      context: TerminalContextDraft | null;
    };
export declare function splitPromptIntoComposerSegments(
  prompt: string,
  terminalContexts?: ReadonlyArray<TerminalContextDraft>,
): ComposerPromptSegment[];
