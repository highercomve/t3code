import { KeybindingRule as KeybindingRuleSchema } from "@t3tools/contracts";
import { Schema } from "effect";
export const PROJECT_SCRIPT_KEYBINDING_INVALID_MESSAGE = "Invalid keybinding.";
function normalizeProjectScriptKeybindingInput(keybinding) {
  const trimmed = keybinding?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}
export function decodeProjectScriptKeybindingRule(input) {
  const normalizedKey = normalizeProjectScriptKeybindingInput(input.keybinding);
  if (!normalizedKey) return null;
  const decoded = Schema.decodeUnknownOption(KeybindingRuleSchema)({
    key: normalizedKey,
    command: input.command,
  });
  if (decoded._tag === "None") {
    throw new Error(PROJECT_SCRIPT_KEYBINDING_INVALID_MESSAGE);
  }
  return decoded.value;
}
export function keybindingValueForCommand(keybindings, command) {
  for (let index = keybindings.length - 1; index >= 0; index -= 1) {
    const binding = keybindings[index];
    if (!binding || binding.command !== command) continue;
    const parts = [];
    if (binding.shortcut.modKey) parts.push("mod");
    if (binding.shortcut.ctrlKey) parts.push("ctrl");
    if (binding.shortcut.metaKey) parts.push("meta");
    if (binding.shortcut.altKey) parts.push("alt");
    if (binding.shortcut.shiftKey) parts.push("shift");
    const keyToken =
      binding.shortcut.key === " "
        ? "space"
        : binding.shortcut.key === "escape"
          ? "esc"
          : binding.shortcut.key;
    parts.push(keyToken);
    return parts.join("+");
  }
  return null;
}
