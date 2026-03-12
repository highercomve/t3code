import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from "react";
import GitActionsControl from "../GitActionsControl";
import { DiffIcon, TerminalSquareIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipPopup, TooltipTrigger } from "../ui/tooltip";
import ProjectScriptsControl from "../ProjectScriptsControl";
import { Toggle } from "../ui/toggle";
import { SidebarTrigger } from "../ui/sidebar";
import { OpenInPicker } from "./OpenInPicker";
export const ChatHeader = memo(function ChatHeader({
  activeThreadId,
  activeThreadTitle,
  activeProjectName,
  isGitRepo,
  openInCwd,
  activeProjectScripts,
  preferredScriptId,
  keybindings,
  availableEditors,
  terminalAvailable,
  terminalOpen,
  terminalToggleShortcutLabel,
  diffToggleShortcutLabel,
  gitCwd,
  diffOpen,
  onRunProjectScript,
  onAddProjectScript,
  onUpdateProjectScript,
  onDeleteProjectScript,
  onToggleTerminal,
  onToggleDiff,
}) {
  return _jsxs("div", {
    className: "@container/header-actions flex min-w-0 flex-1 items-center gap-2",
    children: [
      _jsxs("div", {
        className: "flex min-w-0 flex-1 items-center gap-2 overflow-hidden sm:gap-3",
        children: [
          _jsx(SidebarTrigger, { className: "size-7 shrink-0 md:hidden" }),
          _jsx("h2", {
            className: "min-w-0 shrink truncate text-sm font-medium text-foreground",
            title: activeThreadTitle,
            children: activeThreadTitle,
          }),
          activeProjectName &&
            _jsx(Badge, {
              variant: "outline",
              className: "min-w-0 shrink overflow-hidden",
              children: _jsx("span", {
                className: "min-w-0 truncate",
                children: activeProjectName,
              }),
            }),
          activeProjectName &&
            !isGitRepo &&
            _jsx(Badge, {
              variant: "outline",
              className: "shrink-0 text-[10px] text-amber-700",
              children: "No Git",
            }),
        ],
      }),
      _jsxs("div", {
        className: "flex shrink-0 items-center justify-end gap-2 @3xl/header-actions:gap-3",
        children: [
          activeProjectScripts &&
            _jsx(ProjectScriptsControl, {
              scripts: activeProjectScripts,
              keybindings: keybindings,
              preferredScriptId: preferredScriptId,
              onRunScript: onRunProjectScript,
              onAddScript: onAddProjectScript,
              onUpdateScript: onUpdateProjectScript,
              onDeleteScript: onDeleteProjectScript,
            }),
          activeProjectName &&
            _jsx(OpenInPicker, {
              keybindings: keybindings,
              availableEditors: availableEditors,
              openInCwd: openInCwd,
            }),
          activeProjectName &&
            _jsx(GitActionsControl, { gitCwd: gitCwd, activeThreadId: activeThreadId }),
          _jsxs(Tooltip, {
            children: [
              _jsx(TooltipTrigger, {
                render: _jsx(Toggle, {
                  className: "shrink-0",
                  pressed: terminalOpen,
                  onPressedChange: onToggleTerminal,
                  "aria-label": "Toggle terminal drawer",
                  variant: "outline",
                  size: "xs",
                  disabled: !terminalAvailable,
                  children: _jsx(TerminalSquareIcon, { className: "size-3" }),
                }),
              }),
              _jsx(TooltipPopup, {
                side: "bottom",
                children: !terminalAvailable
                  ? "Terminal is unavailable until this thread has an active project."
                  : terminalToggleShortcutLabel
                    ? `Toggle terminal drawer (${terminalToggleShortcutLabel})`
                    : "Toggle terminal drawer",
              }),
            ],
          }),
          _jsxs(Tooltip, {
            children: [
              _jsx(TooltipTrigger, {
                render: _jsx(Toggle, {
                  className: "shrink-0",
                  pressed: diffOpen,
                  onPressedChange: onToggleDiff,
                  "aria-label": "Toggle diff panel",
                  variant: "outline",
                  size: "xs",
                  disabled: !isGitRepo,
                  children: _jsx(DiffIcon, { className: "size-3" }),
                }),
              }),
              _jsx(TooltipPopup, {
                side: "bottom",
                children: !isGitRepo
                  ? "Diff panel is unavailable because this project is not a git repository."
                  : diffToggleShortcutLabel
                    ? `Toggle diff panel (${diffToggleShortcutLabel})`
                    : "Toggle diff panel",
              }),
            ],
          }),
        ],
      }),
    ],
  });
});
