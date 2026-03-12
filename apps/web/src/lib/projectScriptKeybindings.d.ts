import {
  type KeybindingCommand,
  type KeybindingRule,
  type ResolvedKeybindingsConfig,
} from "@t3tools/contracts";
export declare const PROJECT_SCRIPT_KEYBINDING_INVALID_MESSAGE = "Invalid keybinding.";
export declare function decodeProjectScriptKeybindingRule(input: {
  keybinding: string | null | undefined;
  command: KeybindingCommand;
}): KeybindingRule | null;
export declare function keybindingValueForCommand(
  keybindings: ResolvedKeybindingsConfig,
  command: KeybindingCommand,
): string | null;
