import {
  type KeybindingCommand,
  type KeybindingShortcut,
  type ResolvedKeybindingsConfig,
} from "@t3tools/contracts";
export interface ShortcutEventLike {
  type?: string;
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
export declare function resolveShortcutCommand(
  event: ShortcutEventLike,
  keybindings: ResolvedKeybindingsConfig,
  options?: ShortcutMatchOptions,
): string | null;
export declare function formatShortcutLabel(
  shortcut: KeybindingShortcut,
  platform?: string,
): string;
export declare function shortcutLabelForCommand(
  keybindings: ResolvedKeybindingsConfig,
  command: KeybindingCommand,
  platform?: string,
): string | null;
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
