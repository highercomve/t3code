import { type TerminalContextDraft } from "~/lib/terminalContext";
interface ComposerPendingTerminalContextsProps {
  contexts: ReadonlyArray<TerminalContextDraft>;
  className?: string;
}
interface ComposerPendingTerminalContextChipProps {
  context: TerminalContextDraft;
}
export declare function ComposerPendingTerminalContextChip({
  context,
}: ComposerPendingTerminalContextChipProps): import("react/jsx-runtime").JSX.Element;
export declare function ComposerPendingTerminalContexts(
  props: ComposerPendingTerminalContextsProps,
): import("react/jsx-runtime").JSX.Element | null;
export {};
