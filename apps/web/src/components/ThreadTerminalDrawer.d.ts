import { type TerminalEvent, type ThreadId } from "@t3tools/contracts";
import { type TerminalContextSelection } from "~/lib/terminalContext";
import { type ThreadTerminalGroup } from "../types";
export declare function selectTerminalEventEntriesAfterSnapshot(
  entries: ReadonlyArray<{
    id: number;
    event: TerminalEvent;
  }>,
  snapshotUpdatedAt: string,
): ReadonlyArray<{
  id: number;
  event: TerminalEvent;
}>;
export declare function selectPendingTerminalEventEntries(
  entries: ReadonlyArray<{
    id: number;
    event: TerminalEvent;
  }>,
  lastAppliedTerminalEventId: number,
): ReadonlyArray<{
  id: number;
  event: TerminalEvent;
}>;
export declare function resolveTerminalSelectionActionPosition(options: {
  bounds: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  selectionRect: {
    right: number;
    bottom: number;
  } | null;
  pointer: {
    x: number;
    y: number;
  } | null;
  viewport?: {
    width: number;
    height: number;
  } | null;
}): {
  x: number;
  y: number;
};
export declare function terminalSelectionActionDelayForClickCount(clickCount: number): number;
export declare function shouldHandleTerminalSelectionMouseUp(
  selectionGestureActive: boolean,
  button: number,
): boolean;
interface ThreadTerminalDrawerProps {
  threadId: ThreadId;
  cwd: string;
  worktreePath?: string | null;
  runtimeEnv?: Record<string, string>;
  visible?: boolean;
  height: number;
  terminalIds: string[];
  activeTerminalId: string;
  terminalGroups: ThreadTerminalGroup[];
  activeTerminalGroupId: string;
  focusRequestId: number;
  onSplitTerminal: () => void;
  onNewTerminal: () => void;
  splitShortcutLabel?: string | undefined;
  newShortcutLabel?: string | undefined;
  closeShortcutLabel?: string | undefined;
  onActiveTerminalChange: (terminalId: string) => void;
  onCloseTerminal: (terminalId: string) => void;
  onHeightChange: (height: number) => void;
  onAddTerminalContext: (selection: TerminalContextSelection) => void;
}
export default function ThreadTerminalDrawer({
  threadId,
  cwd,
  worktreePath,
  runtimeEnv,
  visible,
  height,
  terminalIds,
  activeTerminalId,
  terminalGroups,
  activeTerminalGroupId,
  focusRequestId,
  onSplitTerminal,
  onNewTerminal,
  splitShortcutLabel,
  newShortcutLabel,
  closeShortcutLabel,
  onActiveTerminalChange,
  onCloseTerminal,
  onHeightChange,
  onAddTerminalContext,
}: ThreadTerminalDrawerProps): import("react/jsx-runtime").JSX.Element;
export {};
