import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import {
  BugIcon,
  ChevronDownIcon,
  FlaskConicalIcon,
  HammerIcon,
  ListChecksIcon,
  PlayIcon,
  PlusIcon,
  SettingsIcon,
  WrenchIcon,
} from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import {
  keybindingValueForCommand,
  decodeProjectScriptKeybindingRule,
} from "~/lib/projectScriptKeybindings";
import {
  commandForProjectScript,
  nextProjectScriptId,
  primaryProjectScript,
} from "~/projectScripts";
import { shortcutLabelForCommand } from "~/keybindings";
import { isMacPlatform } from "~/lib/utils";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "./ui/dialog";
import { Group, GroupSeparator } from "./ui/group";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Menu, MenuItem, MenuPopup, MenuShortcut, MenuTrigger } from "./ui/menu";
import { Popover, PopoverPopup, PopoverTrigger } from "./ui/popover";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
const SCRIPT_ICONS = [
  { id: "play", label: "Play" },
  { id: "test", label: "Test" },
  { id: "lint", label: "Lint" },
  { id: "configure", label: "Configure" },
  { id: "build", label: "Build" },
  { id: "debug", label: "Debug" },
];
function ScriptIcon({ icon, className = "size-3.5" }) {
  if (icon === "test") return _jsx(FlaskConicalIcon, { className: className });
  if (icon === "lint") return _jsx(ListChecksIcon, { className: className });
  if (icon === "configure") return _jsx(WrenchIcon, { className: className });
  if (icon === "build") return _jsx(HammerIcon, { className: className });
  if (icon === "debug") return _jsx(BugIcon, { className: className });
  return _jsx(PlayIcon, { className: className });
}
function normalizeShortcutKeyToken(key) {
  const normalized = key.toLowerCase();
  if (
    normalized === "meta" ||
    normalized === "control" ||
    normalized === "ctrl" ||
    normalized === "shift" ||
    normalized === "alt" ||
    normalized === "option"
  ) {
    return null;
  }
  if (normalized === " ") return "space";
  if (normalized === "escape") return "esc";
  if (normalized === "arrowup") return "arrowup";
  if (normalized === "arrowdown") return "arrowdown";
  if (normalized === "arrowleft") return "arrowleft";
  if (normalized === "arrowright") return "arrowright";
  if (normalized.length === 1) return normalized;
  if (normalized.startsWith("f") && normalized.length <= 3) return normalized;
  if (normalized === "enter" || normalized === "tab" || normalized === "backspace") {
    return normalized;
  }
  if (normalized === "delete" || normalized === "home" || normalized === "end") {
    return normalized;
  }
  if (normalized === "pageup" || normalized === "pagedown") return normalized;
  return null;
}
function keybindingFromEvent(event) {
  const keyToken = normalizeShortcutKeyToken(event.key);
  if (!keyToken) return null;
  const parts = [];
  if (isMacPlatform(navigator.platform)) {
    if (event.metaKey) parts.push("mod");
    if (event.ctrlKey) parts.push("ctrl");
  } else {
    if (event.ctrlKey) parts.push("mod");
    if (event.metaKey) parts.push("meta");
  }
  if (event.altKey) parts.push("alt");
  if (event.shiftKey) parts.push("shift");
  if (parts.length === 0) {
    return null;
  }
  parts.push(keyToken);
  return parts.join("+");
}
export default function ProjectScriptsControl({
  scripts,
  keybindings,
  preferredScriptId = null,
  onRunScript,
  onAddScript,
  onUpdateScript,
  onDeleteScript,
}) {
  const addScriptFormId = React.useId();
  const [editingScriptId, setEditingScriptId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [command, setCommand] = useState("");
  const [icon, setIcon] = useState("play");
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [runOnWorktreeCreate, setRunOnWorktreeCreate] = useState(false);
  const [keybinding, setKeybinding] = useState("");
  const [validationError, setValidationError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const primaryScript = useMemo(() => {
    if (preferredScriptId) {
      const preferred = scripts.find((script) => script.id === preferredScriptId);
      if (preferred) return preferred;
    }
    return primaryProjectScript(scripts);
  }, [preferredScriptId, scripts]);
  const isEditing = editingScriptId !== null;
  const dropdownItemClassName =
    "data-highlighted:bg-transparent data-highlighted:text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground data-highlighted:hover:bg-accent data-highlighted:hover:text-accent-foreground data-highlighted:focus-visible:bg-accent data-highlighted:focus-visible:text-accent-foreground";
  const captureKeybinding = (event) => {
    if (event.key === "Tab") return;
    event.preventDefault();
    if (event.key === "Backspace" || event.key === "Delete") {
      setKeybinding("");
      return;
    }
    const next = keybindingFromEvent(event);
    if (!next) return;
    setKeybinding(next);
  };
  const submitAddScript = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedCommand = command.trim();
    if (trimmedName.length === 0) {
      setValidationError("Name is required.");
      return;
    }
    if (trimmedCommand.length === 0) {
      setValidationError("Command is required.");
      return;
    }
    setValidationError(null);
    try {
      const scriptIdForValidation =
        editingScriptId ??
        nextProjectScriptId(
          trimmedName,
          scripts.map((script) => script.id),
        );
      const keybindingRule = decodeProjectScriptKeybindingRule({
        keybinding,
        command: commandForProjectScript(scriptIdForValidation),
      });
      const payload = {
        name: trimmedName,
        command: trimmedCommand,
        icon,
        runOnWorktreeCreate,
        keybinding: keybindingRule?.key ?? null,
      };
      if (editingScriptId) {
        await onUpdateScript(editingScriptId, payload);
      } else {
        await onAddScript(payload);
      }
      setDialogOpen(false);
      setIconPickerOpen(false);
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : "Failed to save action.");
    }
  };
  const openAddDialog = () => {
    setEditingScriptId(null);
    setName("");
    setCommand("");
    setIcon("play");
    setIconPickerOpen(false);
    setRunOnWorktreeCreate(false);
    setKeybinding("");
    setValidationError(null);
    setDialogOpen(true);
  };
  const openEditDialog = (script) => {
    setEditingScriptId(script.id);
    setName(script.name);
    setCommand(script.command);
    setIcon(script.icon);
    setIconPickerOpen(false);
    setRunOnWorktreeCreate(script.runOnWorktreeCreate);
    setKeybinding(keybindingValueForCommand(keybindings, commandForProjectScript(script.id)) ?? "");
    setValidationError(null);
    setDialogOpen(true);
  };
  const confirmDeleteScript = useCallback(() => {
    if (!editingScriptId) return;
    setDeleteConfirmOpen(false);
    setDialogOpen(false);
    void onDeleteScript(editingScriptId);
  }, [editingScriptId, onDeleteScript]);
  return _jsxs(_Fragment, {
    children: [
      primaryScript
        ? _jsxs(Group, {
            "aria-label": "Project scripts",
            children: [
              _jsxs(Button, {
                size: "xs",
                variant: "outline",
                onClick: () => onRunScript(primaryScript),
                title: `Run ${primaryScript.name}`,
                children: [
                  _jsx(ScriptIcon, { icon: primaryScript.icon }),
                  _jsx("span", {
                    className: "sr-only @3xl/header-actions:not-sr-only @3xl/header-actions:ml-0.5",
                    children: primaryScript.name,
                  }),
                ],
              }),
              _jsx(GroupSeparator, { className: "hidden @3xl/header-actions:block" }),
              _jsxs(Menu, {
                highlightItemOnHover: false,
                children: [
                  _jsx(MenuTrigger, {
                    render: _jsx(Button, {
                      size: "icon-xs",
                      variant: "outline",
                      "aria-label": "Script actions",
                    }),
                    children: _jsx(ChevronDownIcon, { className: "size-4" }),
                  }),
                  _jsxs(MenuPopup, {
                    align: "end",
                    children: [
                      scripts.map((script) => {
                        const shortcutLabel = shortcutLabelForCommand(
                          keybindings,
                          commandForProjectScript(script.id),
                        );
                        return _jsxs(
                          MenuItem,
                          {
                            className: `group ${dropdownItemClassName}`,
                            onClick: () => onRunScript(script),
                            children: [
                              _jsx(ScriptIcon, { icon: script.icon, className: "size-4" }),
                              _jsx("span", {
                                className: "truncate",
                                children: script.runOnWorktreeCreate
                                  ? `${script.name} (setup)`
                                  : script.name,
                              }),
                              _jsxs("span", {
                                className:
                                  "relative ms-auto flex h-6 min-w-6 items-center justify-end",
                                children: [
                                  shortcutLabel &&
                                    _jsx(MenuShortcut, {
                                      className:
                                        "ms-0 transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0",
                                      children: shortcutLabel,
                                    }),
                                  _jsx(Button, {
                                    type: "button",
                                    variant: "ghost",
                                    size: "icon-xs",
                                    className:
                                      "absolute right-0 top-1/2 size-6 -translate-y-1/2 opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto group-focus-visible:opacity-100 group-focus-visible:pointer-events-auto",
                                    "aria-label": `Edit ${script.name}`,
                                    onPointerDown: (event) => {
                                      event.preventDefault();
                                      event.stopPropagation();
                                    },
                                    onClick: (event) => {
                                      event.preventDefault();
                                      event.stopPropagation();
                                      openEditDialog(script);
                                    },
                                    children: _jsx(SettingsIcon, { className: "size-3.5" }),
                                  }),
                                ],
                              }),
                            ],
                          },
                          script.id,
                        );
                      }),
                      _jsxs(MenuItem, {
                        className: dropdownItemClassName,
                        onClick: openAddDialog,
                        children: [_jsx(PlusIcon, { className: "size-4" }), "Add action"],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        : _jsxs(Button, {
            size: "xs",
            variant: "outline",
            onClick: openAddDialog,
            title: "Add action",
            children: [
              _jsx(PlusIcon, { className: "size-3.5" }),
              _jsx("span", {
                className: "sr-only @3xl/header-actions:not-sr-only @3xl/header-actions:ml-0.5",
                children: "Add action",
              }),
            ],
          }),
      _jsx(Dialog, {
        onOpenChange: (open) => {
          setDialogOpen(open);
          if (!open) {
            setIconPickerOpen(false);
          }
        },
        onOpenChangeComplete: (open) => {
          if (open) return;
          setEditingScriptId(null);
          setName("");
          setCommand("");
          setIcon("play");
          setRunOnWorktreeCreate(false);
          setKeybinding("");
          setValidationError(null);
        },
        open: dialogOpen,
        children: _jsxs(DialogPopup, {
          children: [
            _jsxs(DialogHeader, {
              children: [
                _jsx(DialogTitle, { children: isEditing ? "Edit Action" : "Add Action" }),
                _jsx(DialogDescription, {
                  children:
                    "Actions are project-scoped commands you can run from the top bar or keybindings.",
                }),
              ],
            }),
            _jsx(DialogPanel, {
              children: _jsxs("form", {
                id: addScriptFormId,
                className: "space-y-4",
                onSubmit: submitAddScript,
                children: [
                  _jsxs("div", {
                    className: "space-y-1.5",
                    children: [
                      _jsx(Label, { htmlFor: "script-name", children: "Name" }),
                      _jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          _jsxs(Popover, {
                            onOpenChange: setIconPickerOpen,
                            open: iconPickerOpen,
                            children: [
                              _jsx(PopoverTrigger, {
                                render: _jsx(Button, {
                                  type: "button",
                                  variant: "outline",
                                  className:
                                    "size-9 shrink-0 hover:bg-popover active:bg-popover data-pressed:bg-popover data-pressed:shadow-xs/5 data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)] dark:data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)]",
                                  "aria-label": "Choose icon",
                                }),
                                children: _jsx(ScriptIcon, { icon: icon, className: "size-4.5" }),
                              }),
                              _jsx(PopoverPopup, {
                                align: "start",
                                children: _jsx("div", {
                                  className: "grid grid-cols-3 gap-2",
                                  children: SCRIPT_ICONS.map((entry) => {
                                    const isSelected = entry.id === icon;
                                    return _jsxs(
                                      "button",
                                      {
                                        type: "button",
                                        className: `relative flex flex-col items-center gap-2 rounded-md border px-2 py-2 text-xs ${
                                          isSelected
                                            ? "border-primary/70 bg-primary/10"
                                            : "border-border/70 hover:bg-accent/60"
                                        }`,
                                        onClick: () => {
                                          setIcon(entry.id);
                                          setIconPickerOpen(false);
                                        },
                                        children: [
                                          _jsx(ScriptIcon, { icon: entry.id, className: "size-4" }),
                                          _jsx("span", { children: entry.label }),
                                        ],
                                      },
                                      entry.id,
                                    );
                                  }),
                                }),
                              }),
                            ],
                          }),
                          _jsx(Input, {
                            id: "script-name",
                            autoFocus: true,
                            placeholder: "Test",
                            value: name,
                            onChange: (event) => setName(event.target.value),
                          }),
                        ],
                      }),
                    ],
                  }),
                  _jsxs("div", {
                    className: "space-y-1.5",
                    children: [
                      _jsx(Label, { htmlFor: "script-keybinding", children: "Keybinding" }),
                      _jsx(Input, {
                        id: "script-keybinding",
                        placeholder: "Press shortcut",
                        value: keybinding,
                        readOnly: true,
                        onKeyDown: captureKeybinding,
                      }),
                      _jsxs("p", {
                        className: "text-xs text-muted-foreground",
                        children: [
                          "Press a shortcut. Use ",
                          _jsx("code", { children: "Backspace" }),
                          " to clear.",
                        ],
                      }),
                    ],
                  }),
                  _jsxs("div", {
                    className: "space-y-1.5",
                    children: [
                      _jsx(Label, { htmlFor: "script-command", children: "Command" }),
                      _jsx(Textarea, {
                        id: "script-command",
                        placeholder: "bun test",
                        value: command,
                        onChange: (event) => setCommand(event.target.value),
                      }),
                    ],
                  }),
                  _jsxs("label", {
                    className:
                      "flex items-center justify-between gap-3 rounded-md border border-border/70 px-3 py-2 text-sm",
                    children: [
                      _jsx("span", { children: "Run automatically on worktree creation" }),
                      _jsx(Switch, {
                        checked: runOnWorktreeCreate,
                        onCheckedChange: (checked) => setRunOnWorktreeCreate(Boolean(checked)),
                      }),
                    ],
                  }),
                  validationError &&
                    _jsx("p", { className: "text-sm text-destructive", children: validationError }),
                ],
              }),
            }),
            _jsxs(DialogFooter, {
              children: [
                isEditing &&
                  _jsx(Button, {
                    type: "button",
                    variant: "destructive-outline",
                    className: "mr-auto",
                    onClick: () => setDeleteConfirmOpen(true),
                    children: "Delete",
                  }),
                _jsx(Button, {
                  type: "button",
                  variant: "outline",
                  onClick: () => {
                    setDialogOpen(false);
                  },
                  children: "Cancel",
                }),
                _jsx(Button, {
                  form: addScriptFormId,
                  type: "submit",
                  children: isEditing ? "Save changes" : "Save action",
                }),
              ],
            }),
          ],
        }),
      }),
      _jsx(AlertDialog, {
        open: deleteConfirmOpen,
        onOpenChange: setDeleteConfirmOpen,
        children: _jsxs(AlertDialogPopup, {
          children: [
            _jsxs(AlertDialogHeader, {
              children: [
                _jsxs(AlertDialogTitle, { children: ['Delete action "', name, '"?'] }),
                _jsx(AlertDialogDescription, { children: "This action cannot be undone." }),
              ],
            }),
            _jsxs(AlertDialogFooter, {
              children: [
                _jsx(AlertDialogClose, {
                  render: _jsx(Button, { variant: "outline" }),
                  children: "Cancel",
                }),
                _jsx(Button, {
                  variant: "destructive",
                  onClick: confirmDeleteScript,
                  children: "Delete action",
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
