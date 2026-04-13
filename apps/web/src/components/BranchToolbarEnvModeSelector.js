import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { FolderGit2Icon, FolderGitIcon, FolderIcon } from "lucide-react";
import { memo, useMemo } from "react";
import {
  resolveCurrentWorkspaceLabel,
  resolveEnvModeLabel,
  resolveLockedWorkspaceLabel,
} from "./BranchToolbar.logic";
import {
  Select,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
export const BranchToolbarEnvModeSelector = memo(function BranchToolbarEnvModeSelector({
  envLocked,
  effectiveEnvMode,
  activeWorktreePath,
  onEnvModeChange,
}) {
  const envModeItems = useMemo(
    () => [
      { value: "local", label: resolveCurrentWorkspaceLabel(activeWorktreePath) },
      { value: "worktree", label: resolveEnvModeLabel("worktree") },
    ],
    [activeWorktreePath],
  );
  if (envLocked) {
    return _jsx("span", {
      className:
        "inline-flex items-center gap-1 border border-transparent px-[calc(--spacing(3)-1px)] text-sm font-medium text-muted-foreground/70 sm:text-xs",
      children: activeWorktreePath
        ? _jsxs(_Fragment, {
            children: [
              _jsx(FolderGitIcon, { className: "size-3" }),
              resolveLockedWorkspaceLabel(activeWorktreePath),
            ],
          })
        : _jsxs(_Fragment, {
            children: [
              _jsx(FolderIcon, { className: "size-3" }),
              resolveLockedWorkspaceLabel(activeWorktreePath),
            ],
          }),
    });
  }
  return _jsxs(Select, {
    value: effectiveEnvMode,
    onValueChange: (value) => onEnvModeChange(value),
    items: envModeItems,
    children: [
      _jsxs(SelectTrigger, {
        variant: "ghost",
        size: "xs",
        className: "font-medium",
        "aria-label": "Workspace",
        children: [
          effectiveEnvMode === "worktree"
            ? _jsx(FolderGit2Icon, { className: "size-3" })
            : activeWorktreePath
              ? _jsx(FolderGitIcon, { className: "size-3" })
              : _jsx(FolderIcon, { className: "size-3" }),
          _jsx(SelectValue, {}),
        ],
      }),
      _jsx(SelectPopup, {
        children: _jsxs(SelectGroup, {
          children: [
            _jsx(SelectGroupLabel, { children: "Workspace" }),
            _jsx(SelectItem, {
              value: "local",
              children: _jsxs("span", {
                className: "inline-flex items-center gap-1.5",
                children: [
                  activeWorktreePath
                    ? _jsx(FolderGitIcon, { className: "size-3" })
                    : _jsx(FolderIcon, { className: "size-3" }),
                  resolveCurrentWorkspaceLabel(activeWorktreePath),
                ],
              }),
            }),
            _jsx(SelectItem, {
              value: "worktree",
              children: _jsxs("span", {
                className: "inline-flex items-center gap-1.5",
                children: [
                  _jsx(FolderGit2Icon, { className: "size-3" }),
                  resolveEnvModeLabel("worktree"),
                ],
              }),
            }),
          ],
        }),
      }),
    ],
  });
});
