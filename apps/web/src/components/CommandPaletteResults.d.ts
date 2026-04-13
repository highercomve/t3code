import { type ResolvedKeybindingsConfig } from "@t3tools/contracts";
import {
  type CommandPaletteActionItem,
  type CommandPaletteGroup,
  type CommandPaletteSubmenuItem,
} from "./CommandPalette.logic";
interface CommandPaletteResultsProps {
  emptyStateMessage?: string;
  groups: ReadonlyArray<CommandPaletteGroup>;
  isActionsOnly: boolean;
  keybindings: ResolvedKeybindingsConfig;
  onExecuteItem: (item: CommandPaletteActionItem | CommandPaletteSubmenuItem) => void;
}
export declare function CommandPaletteResults(
  props: CommandPaletteResultsProps,
): import("react/jsx-runtime").JSX.Element;
export {};
