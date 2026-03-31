import { THREAD_JUMP_KEYBINDING_COMMANDS } from "@t3tools/contracts";
import { isMacPlatform } from "./lib/utils";
const TERMINAL_WORD_BACKWARD = "\u001bb";
const TERMINAL_WORD_FORWARD = "\u001bf";
const TERMINAL_LINE_START = "\u0001";
const TERMINAL_LINE_END = "\u0005";
const EVENT_CODE_KEY_ALIASES = {
  BracketLeft: ["["],
  BracketRight: ["]"],
  Digit0: ["0"],
  Digit1: ["1"],
  Digit2: ["2"],
  Digit3: ["3"],
  Digit4: ["4"],
  Digit5: ["5"],
  Digit6: ["6"],
  Digit7: ["7"],
  Digit8: ["8"],
  Digit9: ["9"],
};
function normalizeEventKey(key) {
  const normalized = key.toLowerCase();
  if (normalized === "esc") return "escape";
  return normalized;
}
function resolveEventKeys(event) {
  const keys = new Set([normalizeEventKey(event.key)]);
  const aliases = event.code ? EVENT_CODE_KEY_ALIASES[event.code] : undefined;
  if (!aliases) return keys;
  for (const alias of aliases) {
    keys.add(alias);
  }
  return keys;
}
function matchesShortcutModifiers(event, shortcut, platform = navigator.platform) {
  const useMetaForMod = isMacPlatform(platform);
  const expectedMeta = shortcut.metaKey || (shortcut.modKey && useMetaForMod);
  const expectedCtrl = shortcut.ctrlKey || (shortcut.modKey && !useMetaForMod);
  return (
    event.metaKey === expectedMeta &&
    event.ctrlKey === expectedCtrl &&
    event.shiftKey === shortcut.shiftKey &&
    event.altKey === shortcut.altKey
  );
}
function matchesShortcut(event, shortcut, platform = navigator.platform) {
  if (!matchesShortcutModifiers(event, shortcut, platform)) return false;
  return resolveEventKeys(event).has(shortcut.key);
}
function resolvePlatform(options) {
  return options?.platform ?? navigator.platform;
}
function resolveContext(options) {
  return {
    terminalFocus: false,
    terminalOpen: false,
    ...options?.context,
  };
}
function evaluateWhenNode(node, context) {
  switch (node.type) {
    case "identifier":
      if (node.name === "true") return true;
      if (node.name === "false") return false;
      return Boolean(context[node.name]);
    case "not":
      return !evaluateWhenNode(node.node, context);
    case "and":
      return evaluateWhenNode(node.left, context) && evaluateWhenNode(node.right, context);
    case "or":
      return evaluateWhenNode(node.left, context) || evaluateWhenNode(node.right, context);
  }
}
function matchesWhenClause(whenAst, context) {
  if (!whenAst) return true;
  return evaluateWhenNode(whenAst, context);
}
function shortcutConflictKey(shortcut, platform = navigator.platform) {
  const useMetaForMod = isMacPlatform(platform);
  const metaKey = shortcut.metaKey || (shortcut.modKey && useMetaForMod);
  const ctrlKey = shortcut.ctrlKey || (shortcut.modKey && !useMetaForMod);
  return [
    shortcut.key,
    metaKey ? "meta" : "",
    ctrlKey ? "ctrl" : "",
    shortcut.shiftKey ? "shift" : "",
    shortcut.altKey ? "alt" : "",
  ].join("|");
}
function findEffectiveShortcutForCommand(keybindings, command, options) {
  const platform = resolvePlatform(options);
  const context = resolveContext(options);
  const claimedShortcuts = new Set();
  for (let index = keybindings.length - 1; index >= 0; index -= 1) {
    const binding = keybindings[index];
    if (!binding) continue;
    if (!matchesWhenClause(binding.whenAst, context)) continue;
    const conflictKey = shortcutConflictKey(binding.shortcut, platform);
    if (claimedShortcuts.has(conflictKey)) {
      continue;
    }
    claimedShortcuts.add(conflictKey);
    if (binding.command === command) {
      return binding.shortcut;
    }
  }
  return null;
}
function matchesCommandShortcut(event, keybindings, command, options) {
  return resolveShortcutCommand(event, keybindings, options) === command;
}
export function resolveShortcutCommand(event, keybindings, options) {
  const platform = resolvePlatform(options);
  const context = resolveContext(options);
  for (let index = keybindings.length - 1; index >= 0; index -= 1) {
    const binding = keybindings[index];
    if (!binding) continue;
    if (!matchesWhenClause(binding.whenAst, context)) continue;
    if (!matchesShortcut(event, binding.shortcut, platform)) continue;
    return binding.command;
  }
  return null;
}
function formatShortcutKeyLabel(key) {
  if (key === " ") return "Space";
  if (key.length === 1) return key.toUpperCase();
  if (key === "escape") return "Esc";
  if (key === "arrowup") return "Up";
  if (key === "arrowdown") return "Down";
  if (key === "arrowleft") return "Left";
  if (key === "arrowright") return "Right";
  return key.slice(0, 1).toUpperCase() + key.slice(1);
}
export function formatShortcutLabel(shortcut, platform = navigator.platform) {
  const keyLabel = formatShortcutKeyLabel(shortcut.key);
  const useMetaForMod = isMacPlatform(platform);
  const showMeta = shortcut.metaKey || (shortcut.modKey && useMetaForMod);
  const showCtrl = shortcut.ctrlKey || (shortcut.modKey && !useMetaForMod);
  const showAlt = shortcut.altKey;
  const showShift = shortcut.shiftKey;
  if (useMetaForMod) {
    return `${showCtrl ? "\u2303" : ""}${showAlt ? "\u2325" : ""}${showShift ? "\u21e7" : ""}${showMeta ? "\u2318" : ""}${keyLabel}`;
  }
  const parts = [];
  if (showCtrl) parts.push("Ctrl");
  if (showAlt) parts.push("Alt");
  if (showShift) parts.push("Shift");
  if (showMeta) parts.push("Meta");
  parts.push(keyLabel);
  return parts.join("+");
}
export function shortcutLabelForCommand(keybindings, command, options) {
  const resolvedOptions = typeof options === "string" ? { platform: options } : options;
  const platform = resolvePlatform(resolvedOptions);
  const shortcut = findEffectiveShortcutForCommand(keybindings, command, resolvedOptions);
  return shortcut ? formatShortcutLabel(shortcut, platform) : null;
}
export function threadJumpCommandForIndex(index) {
  return THREAD_JUMP_KEYBINDING_COMMANDS[index] ?? null;
}
export function threadJumpIndexFromCommand(command) {
  const index = THREAD_JUMP_KEYBINDING_COMMANDS.indexOf(command);
  return index === -1 ? null : index;
}
export function threadTraversalDirectionFromCommand(command) {
  if (command === "thread.previous") return "previous";
  if (command === "thread.next") return "next";
  return null;
}
export function shouldShowThreadJumpHints(event, keybindings, options) {
  const platform = resolvePlatform(options);
  for (const command of THREAD_JUMP_KEYBINDING_COMMANDS) {
    const shortcut = findEffectiveShortcutForCommand(keybindings, command, options);
    if (!shortcut) continue;
    if (matchesShortcutModifiers(event, shortcut, platform)) {
      return true;
    }
  }
  return false;
}
export function isTerminalToggleShortcut(event, keybindings, options) {
  return matchesCommandShortcut(event, keybindings, "terminal.toggle", options);
}
export function isTerminalSplitShortcut(event, keybindings, options) {
  return matchesCommandShortcut(event, keybindings, "terminal.split", options);
}
export function isTerminalNewShortcut(event, keybindings, options) {
  return matchesCommandShortcut(event, keybindings, "terminal.new", options);
}
export function isTerminalCloseShortcut(event, keybindings, options) {
  return matchesCommandShortcut(event, keybindings, "terminal.close", options);
}
export function isDiffToggleShortcut(event, keybindings, options) {
  return matchesCommandShortcut(event, keybindings, "diff.toggle", options);
}
export function isChatNewShortcut(event, keybindings, options) {
  return matchesCommandShortcut(event, keybindings, "chat.new", options);
}
export function isChatNewLocalShortcut(event, keybindings, options) {
  return matchesCommandShortcut(event, keybindings, "chat.newLocal", options);
}
export function isOpenFavoriteEditorShortcut(event, keybindings, options) {
  return matchesCommandShortcut(event, keybindings, "editor.openFavorite", options);
}
export function isTerminalClearShortcut(event, platform = navigator.platform) {
  if (event.type !== undefined && event.type !== "keydown") {
    return false;
  }
  const key = event.key.toLowerCase();
  if (key === "l" && event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
    return true;
  }
  return (
    isMacPlatform(platform) &&
    key === "k" &&
    event.metaKey &&
    !event.ctrlKey &&
    !event.altKey &&
    !event.shiftKey
  );
}
export function terminalNavigationShortcutData(event, platform = navigator.platform) {
  if (event.type !== undefined && event.type !== "keydown") {
    return null;
  }
  if (event.shiftKey) return null;
  const key = normalizeEventKey(event.key);
  if (key !== "arrowleft" && key !== "arrowright") {
    return null;
  }
  const moveWord = key === "arrowleft" ? TERMINAL_WORD_BACKWARD : TERMINAL_WORD_FORWARD;
  const moveLine = key === "arrowleft" ? TERMINAL_LINE_START : TERMINAL_LINE_END;
  if (isMacPlatform(platform)) {
    if (event.altKey && !event.metaKey && !event.ctrlKey) {
      return moveWord;
    }
    if (event.metaKey && !event.altKey && !event.ctrlKey) {
      return moveLine;
    }
    return null;
  }
  if (event.ctrlKey && !event.metaKey && !event.altKey) {
    return moveWord;
  }
  if (event.altKey && !event.metaKey && !event.ctrlKey) {
    return moveWord;
  }
  return null;
}
