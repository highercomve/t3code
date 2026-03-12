import { isMacPlatform } from "./lib/utils";
const TERMINAL_WORD_BACKWARD = "\u001bb";
const TERMINAL_WORD_FORWARD = "\u001bf";
const TERMINAL_LINE_START = "\u0001";
const TERMINAL_LINE_END = "\u0005";
function normalizeEventKey(key) {
  const normalized = key.toLowerCase();
  if (normalized === "esc") return "escape";
  return normalized;
}
function matchesShortcut(event, shortcut, platform = navigator.platform) {
  const key = normalizeEventKey(event.key);
  if (key !== shortcut.key) return false;
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
export function shortcutLabelForCommand(keybindings, command, platform = navigator.platform) {
  for (let index = keybindings.length - 1; index >= 0; index -= 1) {
    const binding = keybindings[index];
    if (!binding || binding.command !== command) continue;
    return formatShortcutLabel(binding.shortcut, platform);
  }
  return null;
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
