import {
  type KeybindingCommand,
  type KeybindingShortcut,
  type ResolvedKeybindingsConfig,
  type ThreadJumpKeybindingCommand,
} from "@t3tools/contracts";
export interface ShortcutEventLike {
  type?: string;
  code?: string;
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}
export interface ShortcutMatchContext {
  terminalFocus: boolean;
  terminalOpen: boolean;
  [key: string]: boolean;
}
interface ShortcutMatchOptions {
  platform?: string;
  context?: Partial<ShortcutMatchContext>;
}
interface ResolvedShortcutLabelOptions extends ShortcutMatchOptions {
  platform?: string;
}
export declare function resolveShortcutCommand(
  event: ShortcutEventLike,
  keybindings: ResolvedKeybindingsConfig,
  options?: ShortcutMatchOptions,
): KeybindingCommand | null;
export declare function formatShortcutLabel(
  shortcut: KeybindingShortcut,
  platform?: string,
): string;
export declare function shortcutLabelForCommand(
  keybindings: ResolvedKeybindingsConfig,
  command: KeybindingCommand,
  options?: string | ResolvedShortcutLabelOptions,
): string | null;
export declare function threadJumpCommandForIndex(
  index: number,
): ThreadJumpKeybindingCommand | null;
export declare function threadJumpIndexFromCommand(command: string): number | null;
export declare function threadTraversalDirectionFromCommand(
  command: string | null,
): "previous" | "next" | null;
export declare function shouldShowThreadJumpHints(
  event: ShortcutEventLike,
  keybindings: ResolvedKeybindingsConfig,
  options?: ShortcutMatchOptions,
): boolean;
export declare function isTerminalToggleShortcut(
  event: ShortcutEventLike,
  keybindings: ResolvedKeybindingsConfig,
  options?: ShortcutMatchOptions,
): boolean;
export declare function isTerminalSplitShortcut(
  event: ShortcutEventLike,
  keybindings: ResolvedKeybindingsConfig,
  options?: ShortcutMatchOptions,
): boolean;
export declare function isTerminalNewShortcut(
  event: ShortcutEventLike,
  keybindings: ResolvedKeybindingsConfig,
  options?: ShortcutMatchOptions,
): boolean;
export declare function isTerminalCloseShortcut(
  event: ShortcutEventLike,
  keybindings: ResolvedKeybindingsConfig,
  options?: ShortcutMatchOptions,
): boolean;
export declare function isDiffToggleShortcut(
  event: ShortcutEventLike,
  keybindings: ResolvedKeybindingsConfig,
  options?: ShortcutMatchOptions,
): boolean;
export declare function isChatNewShortcut(
  event: ShortcutEventLike,
  keybindings: ResolvedKeybindingsConfig,
  options?: ShortcutMatchOptions,
): boolean;
export declare function isChatNewLocalShortcut(
  event: ShortcutEventLike,
  keybindings: ResolvedKeybindingsConfig,
  options?: ShortcutMatchOptions,
): boolean;
export declare function isOpenFavoriteEditorShortcut(
  event: ShortcutEventLike,
  keybindings: ResolvedKeybindingsConfig,
  options?: ShortcutMatchOptions,
): boolean;
export declare function isTerminalClearShortcut(
  event: ShortcutEventLike,
  platform?: string,
): boolean;
export declare function terminalNavigationShortcutData(
  event: ShortcutEventLike,
  platform?: string,
): string | null;
export {};
