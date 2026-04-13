import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import {
  ArchiveIcon,
  ArrowUpDownIcon,
  ChevronRightIcon,
  CloudIcon,
  FolderIcon,
  GitPullRequestIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  SquarePenIcon,
  TerminalIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { ProjectFavicon } from "./ProjectFavicon";
import { autoAnimate } from "@formkit/auto-animate";
import { useCallback, useEffect, memo, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  DndContext,
  PointerSensor,
  closestCorners,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { DEFAULT_MODEL_BY_PROVIDER } from "@t3tools/contracts";
import {
  scopedProjectKey,
  scopedThreadKey,
  scopeProjectRef,
  scopeThreadRef,
} from "@t3tools/client-runtime";
import { Link, useLocation, useNavigate, useParams, useRouter } from "@tanstack/react-router";
import { usePrimaryEnvironmentId } from "../environments/primary";
import { isElectron } from "../env";
import { APP_STAGE_LABEL, APP_VERSION } from "../branding";
import { isTerminalFocused } from "../lib/terminalFocus";
import { isLinuxPlatform, isMacPlatform, newCommandId, newProjectId } from "../lib/utils";
import {
  selectProjectByRef,
  selectProjectsAcrossEnvironments,
  selectSidebarThreadsForProjectRef,
  selectSidebarThreadsForProjectRefs,
  selectSidebarThreadsAcrossEnvironments,
  selectThreadByRef,
  useStore,
} from "../store";
import { selectThreadTerminalState, useTerminalStateStore } from "../terminalStateStore";
import { useUiStateStore } from "../uiStateStore";
import {
  resolveShortcutCommand,
  shortcutLabelForCommand,
  shouldShowThreadJumpHints,
  threadJumpCommandForIndex,
  threadJumpIndexFromCommand,
  threadTraversalDirectionFromCommand,
} from "../keybindings";
import { useGitStatus } from "../lib/gitStatusState";
import { readLocalApi } from "../localApi";
import { useComposerDraftStore } from "../composerDraftStore";
import { useNewThreadHandler } from "../hooks/useHandleNewThread";
import { useThreadActions } from "../hooks/useThreadActions";
import {
  buildThreadRouteParams,
  resolveThreadRouteRef,
  resolveThreadRouteTarget,
} from "../threadRoutes";
import { toastManager } from "./ui/toast";
import { formatRelativeTimeLabel } from "../timestampFormat";
import { SettingsSidebarNav } from "./settings/SettingsSidebarNav";
import { Kbd } from "./ui/kbd";
import {
  getArm64IntelBuildWarningDescription,
  getDesktopUpdateActionError,
  getDesktopUpdateInstallConfirmationMessage,
  isDesktopUpdateButtonDisabled,
  resolveDesktopUpdateButtonAction,
  shouldShowArm64IntelBuildWarning,
  shouldToastDesktopUpdateActionResult,
} from "./desktopUpdate.logic";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Menu, MenuGroup, MenuPopup, MenuRadioGroup, MenuRadioItem, MenuTrigger } from "./ui/menu";
import { Tooltip, TooltipPopup, TooltipTrigger } from "./ui/tooltip";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
} from "./ui/sidebar";
import { useThreadSelectionStore } from "../threadSelectionStore";
import { isNonEmpty as isNonEmptyString } from "effect/String";
import {
  resolveAdjacentThreadId,
  isContextMenuPointerDown,
  resolveProjectStatusIndicator,
  resolveSidebarNewThreadSeedContext,
  resolveSidebarNewThreadEnvMode,
  resolveThreadRowClassName,
  resolveThreadStatusPill,
  orderItemsByPreferredIds,
  shouldClearThreadSelectionOnMouseDown,
  sortProjectsForSidebar,
  useThreadJumpHintVisibility,
} from "./Sidebar.logic";
import { sortThreads } from "../lib/threadSort";
import { SidebarUpdatePill } from "./sidebar/SidebarUpdatePill";
import { useCopyToClipboard } from "~/hooks/useCopyToClipboard";
import { CommandDialogTrigger } from "./ui/command";
import { readEnvironmentApi } from "../environmentApi";
import { useSettings, useUpdateSettings } from "~/hooks/useSettings";
import { useServerKeybindings } from "../rpc/serverState";
import { deriveLogicalProjectKey } from "../logicalProject";
import {
  useSavedEnvironmentRegistryStore,
  useSavedEnvironmentRuntimeStore,
} from "../environments/runtime";
const THREAD_PREVIEW_LIMIT = 6;
const SIDEBAR_SORT_LABELS = {
  updated_at: "Last user message",
  created_at: "Created at",
  manual: "Manual",
};
const SIDEBAR_THREAD_SORT_LABELS = {
  updated_at: "Last user message",
  created_at: "Created at",
};
const SIDEBAR_LIST_ANIMATION_OPTIONS = {
  duration: 180,
  easing: "ease-out",
};
const EMPTY_THREAD_JUMP_LABELS = new Map();
function threadJumpLabelMapsEqual(left, right) {
  if (left === right) {
    return true;
  }
  if (left.size !== right.size) {
    return false;
  }
  for (const [key, value] of left) {
    if (right.get(key) !== value) {
      return false;
    }
  }
  return true;
}
function buildThreadJumpLabelMap(input) {
  if (input.threadJumpCommandByKey.size === 0) {
    return EMPTY_THREAD_JUMP_LABELS;
  }
  const shortcutLabelOptions = {
    platform: input.platform,
    context: {
      terminalFocus: false,
      terminalOpen: input.terminalOpen,
    },
  };
  const mapping = new Map();
  for (const [threadKey, command] of input.threadJumpCommandByKey) {
    const label = shortcutLabelForCommand(input.keybindings, command, shortcutLabelOptions);
    if (label) {
      mapping.set(threadKey, label);
    }
  }
  return mapping.size > 0 ? mapping : EMPTY_THREAD_JUMP_LABELS;
}
function ThreadStatusLabel({ status, compact = false }) {
  if (compact) {
    return _jsxs("span", {
      title: status.label,
      className: `inline-flex size-3.5 shrink-0 items-center justify-center ${status.colorClass}`,
      children: [
        _jsx("span", {
          className: `size-[9px] rounded-full ${status.dotClass} ${status.pulse ? "animate-pulse" : ""}`,
        }),
        _jsx("span", { className: "sr-only", children: status.label }),
      ],
    });
  }
  return _jsxs("span", {
    title: status.label,
    className: `inline-flex items-center gap-1 text-[10px] ${status.colorClass}`,
    children: [
      _jsx("span", {
        className: `h-1.5 w-1.5 rounded-full ${status.dotClass} ${status.pulse ? "animate-pulse" : ""}`,
      }),
      _jsx("span", { className: "hidden md:inline", children: status.label }),
    ],
  });
}
function terminalStatusFromRunningIds(runningTerminalIds) {
  if (runningTerminalIds.length === 0) {
    return null;
  }
  return {
    label: "Terminal process running",
    colorClass: "text-teal-600 dark:text-teal-300/90",
    pulse: true,
  };
}
function prStatusIndicator(pr) {
  if (!pr) return null;
  if (pr.state === "open") {
    return {
      label: "PR open",
      colorClass: "text-emerald-600 dark:text-emerald-300/90",
      tooltip: `#${pr.number} PR open: ${pr.title}`,
      url: pr.url,
    };
  }
  if (pr.state === "closed") {
    return {
      label: "PR closed",
      colorClass: "text-zinc-500 dark:text-zinc-400/80",
      tooltip: `#${pr.number} PR closed: ${pr.title}`,
      url: pr.url,
    };
  }
  if (pr.state === "merged") {
    return {
      label: "PR merged",
      colorClass: "text-violet-600 dark:text-violet-300/90",
      tooltip: `#${pr.number} PR merged: ${pr.title}`,
      url: pr.url,
    };
  }
  return null;
}
function resolveThreadPr(threadBranch, gitStatus) {
  if (threadBranch === null || gitStatus === null || gitStatus.branch !== threadBranch) {
    return null;
  }
  return gitStatus.pr ?? null;
}
const SidebarThreadRow = memo(function SidebarThreadRow(props) {
  const {
    orderedProjectThreadKeys,
    isActive,
    jumpLabel,
    appSettingsConfirmThreadArchive,
    renamingThreadKey,
    renamingTitle,
    setRenamingTitle,
    renamingInputRef,
    renamingCommittedRef,
    confirmingArchiveThreadKey,
    setConfirmingArchiveThreadKey,
    confirmArchiveButtonRefs,
    handleThreadClick,
    navigateToThread,
    handleMultiSelectContextMenu,
    handleThreadContextMenu,
    clearSelection,
    commitRename,
    cancelRename,
    attemptArchiveThread,
    openPrLink,
    thread,
  } = props;
  const threadRef = scopeThreadRef(thread.environmentId, thread.id);
  const threadKey = scopedThreadKey(threadRef);
  const lastVisitedAt = useUiStateStore((state) => state.threadLastVisitedAtById[threadKey]);
  const isSelected = useThreadSelectionStore((state) => state.selectedThreadKeys.has(threadKey));
  const hasSelection = useThreadSelectionStore((state) => state.selectedThreadKeys.size > 0);
  const runningTerminalIds = useTerminalStateStore(
    (state) =>
      selectThreadTerminalState(state.terminalStateByThreadKey, threadRef).runningTerminalIds,
  );
  const primaryEnvironmentId = usePrimaryEnvironmentId();
  const isRemoteThread =
    primaryEnvironmentId !== null && thread.environmentId !== primaryEnvironmentId;
  const remoteEnvLabel = useSavedEnvironmentRuntimeStore(
    (s) => s.byId[thread.environmentId]?.descriptor?.label ?? null,
  );
  const remoteEnvSavedLabel = useSavedEnvironmentRegistryStore(
    (s) => s.byId[thread.environmentId]?.label ?? null,
  );
  const threadEnvironmentLabel = isRemoteThread
    ? (remoteEnvLabel ?? remoteEnvSavedLabel ?? "Remote")
    : null;
  // For grouped projects, the thread may belong to a different environment
  // than the representative project.  Look up the thread's own project cwd
  // so git status (and thus PR detection) queries the correct path.
  const threadProjectCwd = useStore(
    useMemo(
      () => (state) =>
        selectProjectByRef(state, scopeProjectRef(thread.environmentId, thread.projectId))?.cwd ??
        null,
      [thread.environmentId, thread.projectId],
    ),
  );
  const gitCwd = thread.worktreePath ?? threadProjectCwd ?? props.projectCwd;
  const gitStatus = useGitStatus({
    environmentId: thread.environmentId,
    cwd: thread.branch != null ? gitCwd : null,
  });
  const isHighlighted = isActive || isSelected;
  const isThreadRunning =
    thread.session?.status === "running" && thread.session.activeTurnId != null;
  const threadStatus = resolveThreadStatusPill({
    thread: {
      ...thread,
      lastVisitedAt,
    },
  });
  const pr = resolveThreadPr(thread.branch, gitStatus.data);
  const prStatus = prStatusIndicator(pr);
  const terminalStatus = terminalStatusFromRunningIds(runningTerminalIds);
  const isConfirmingArchive = confirmingArchiveThreadKey === threadKey && !isThreadRunning;
  const threadMetaClassName = isConfirmingArchive
    ? "pointer-events-none opacity-0"
    : !isThreadRunning
      ? "pointer-events-none transition-opacity duration-150 group-hover/menu-sub-item:opacity-0 group-focus-within/menu-sub-item:opacity-0"
      : "pointer-events-none";
  const clearConfirmingArchive = useCallback(() => {
    setConfirmingArchiveThreadKey((current) => (current === threadKey ? null : current));
  }, [setConfirmingArchiveThreadKey, threadKey]);
  const handleMouseLeave = useCallback(() => {
    clearConfirmingArchive();
  }, [clearConfirmingArchive]);
  const handleBlurCapture = useCallback(
    (event) => {
      const currentTarget = event.currentTarget;
      requestAnimationFrame(() => {
        if (currentTarget.contains(document.activeElement)) {
          return;
        }
        clearConfirmingArchive();
      });
    },
    [clearConfirmingArchive],
  );
  const handleRowClick = useCallback(
    (event) => {
      handleThreadClick(event, threadRef, orderedProjectThreadKeys);
    },
    [handleThreadClick, orderedProjectThreadKeys, threadRef],
  );
  const handleRowKeyDown = useCallback(
    (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      navigateToThread(threadRef);
    },
    [navigateToThread, threadRef],
  );
  const handleRowContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      if (hasSelection && isSelected) {
        void handleMultiSelectContextMenu({
          x: event.clientX,
          y: event.clientY,
        });
        return;
      }
      if (hasSelection) {
        clearSelection();
      }
      void handleThreadContextMenu(threadRef, {
        x: event.clientX,
        y: event.clientY,
      });
    },
    [
      clearSelection,
      handleMultiSelectContextMenu,
      handleThreadContextMenu,
      hasSelection,
      isSelected,
      threadRef,
    ],
  );
  const handlePrClick = useCallback(
    (event) => {
      if (!prStatus) return;
      openPrLink(event, prStatus.url);
    },
    [openPrLink, prStatus],
  );
  const handleRenameInputRef = useCallback(
    (element) => {
      if (element && renamingInputRef.current !== element) {
        renamingInputRef.current = element;
        element.focus();
        element.select();
      }
    },
    [renamingInputRef],
  );
  const handleRenameInputChange = useCallback(
    (event) => {
      setRenamingTitle(event.target.value);
    },
    [setRenamingTitle],
  );
  const handleRenameInputKeyDown = useCallback(
    (event) => {
      event.stopPropagation();
      if (event.key === "Enter") {
        event.preventDefault();
        renamingCommittedRef.current = true;
        void commitRename(threadRef, renamingTitle, thread.title);
      } else if (event.key === "Escape") {
        event.preventDefault();
        renamingCommittedRef.current = true;
        cancelRename();
      }
    },
    [cancelRename, commitRename, renamingCommittedRef, renamingTitle, thread.title, threadRef],
  );
  const handleRenameInputBlur = useCallback(() => {
    if (!renamingCommittedRef.current) {
      void commitRename(threadRef, renamingTitle, thread.title);
    }
  }, [commitRename, renamingCommittedRef, renamingTitle, thread.title, threadRef]);
  const handleRenameInputClick = useCallback((event) => {
    event.stopPropagation();
  }, []);
  const handleConfirmArchiveRef = useCallback(
    (element) => {
      if (element) {
        confirmArchiveButtonRefs.current.set(threadKey, element);
      } else {
        confirmArchiveButtonRefs.current.delete(threadKey);
      }
    },
    [confirmArchiveButtonRefs, threadKey],
  );
  const stopPropagationOnPointerDown = useCallback((event) => {
    event.stopPropagation();
  }, []);
  const handleConfirmArchiveClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      clearConfirmingArchive();
      void attemptArchiveThread(threadRef);
    },
    [attemptArchiveThread, clearConfirmingArchive, threadRef],
  );
  const handleStartArchiveConfirmation = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      setConfirmingArchiveThreadKey(threadKey);
      requestAnimationFrame(() => {
        confirmArchiveButtonRefs.current.get(threadKey)?.focus();
      });
    },
    [confirmArchiveButtonRefs, setConfirmingArchiveThreadKey, threadKey],
  );
  const handleArchiveImmediateClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      void attemptArchiveThread(threadRef);
    },
    [attemptArchiveThread, threadRef],
  );
  const rowButtonRender = useMemo(() => _jsx("div", { role: "button", tabIndex: 0 }), []);
  return _jsx(SidebarMenuSubItem, {
    className: "w-full",
    "data-thread-item": true,
    onMouseLeave: handleMouseLeave,
    onBlurCapture: handleBlurCapture,
    children: _jsxs(SidebarMenuSubButton, {
      render: rowButtonRender,
      size: "sm",
      isActive: isActive,
      "data-testid": `thread-row-${thread.id}`,
      className: `${resolveThreadRowClassName({
        isActive,
        isSelected,
      })} relative isolate`,
      onClick: handleRowClick,
      onKeyDown: handleRowKeyDown,
      onContextMenu: handleRowContextMenu,
      children: [
        _jsxs("div", {
          className: "flex min-w-0 flex-1 items-center gap-1.5 text-left",
          children: [
            prStatus &&
              _jsxs(Tooltip, {
                children: [
                  _jsx(TooltipTrigger, {
                    render: _jsx("button", {
                      type: "button",
                      "aria-label": prStatus.tooltip,
                      className: `inline-flex items-center justify-center ${prStatus.colorClass} cursor-pointer rounded-sm outline-hidden focus-visible:ring-1 focus-visible:ring-ring`,
                      onClick: handlePrClick,
                      children: _jsx(GitPullRequestIcon, { className: "size-3" }),
                    }),
                  }),
                  _jsx(TooltipPopup, { side: "top", children: prStatus.tooltip }),
                ],
              }),
            threadStatus && _jsx(ThreadStatusLabel, { status: threadStatus }),
            renamingThreadKey === threadKey
              ? _jsx("input", {
                  ref: handleRenameInputRef,
                  className:
                    "min-w-0 flex-1 truncate text-xs bg-transparent outline-none border border-ring rounded px-0.5",
                  value: renamingTitle,
                  onChange: handleRenameInputChange,
                  onKeyDown: handleRenameInputKeyDown,
                  onBlur: handleRenameInputBlur,
                  onClick: handleRenameInputClick,
                })
              : _jsxs(Tooltip, {
                  children: [
                    _jsx(TooltipTrigger, {
                      render: _jsx("span", {
                        className: "min-w-0 flex-1 truncate text-xs",
                        "data-testid": `thread-title-${thread.id}`,
                        children: thread.title,
                      }),
                    }),
                    _jsx(TooltipPopup, {
                      side: "top",
                      className: "max-w-80 whitespace-normal leading-tight",
                      children: thread.title,
                    }),
                  ],
                }),
          ],
        }),
        _jsxs("div", {
          className: "ml-auto flex shrink-0 items-center gap-1.5",
          children: [
            terminalStatus &&
              _jsx("span", {
                role: "img",
                "aria-label": terminalStatus.label,
                title: terminalStatus.label,
                className: `inline-flex items-center justify-center ${terminalStatus.colorClass}`,
                children: _jsx(TerminalIcon, {
                  className: `size-3 ${terminalStatus.pulse ? "animate-pulse" : ""}`,
                }),
              }),
            _jsxs("div", {
              className: "flex min-w-12 justify-end",
              children: [
                isConfirmingArchive
                  ? _jsx("button", {
                      ref: handleConfirmArchiveRef,
                      type: "button",
                      "data-thread-selection-safe": true,
                      "data-testid": `thread-archive-confirm-${thread.id}`,
                      "aria-label": `Confirm archive ${thread.title}`,
                      className:
                        "absolute top-1/2 right-1 inline-flex h-5 -translate-y-1/2 cursor-pointer items-center rounded-full bg-destructive/12 px-2 text-[10px] font-medium text-destructive transition-colors hover:bg-destructive/18 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-destructive/40",
                      onPointerDown: stopPropagationOnPointerDown,
                      onClick: handleConfirmArchiveClick,
                      children: "Confirm",
                    })
                  : !isThreadRunning
                    ? appSettingsConfirmThreadArchive
                      ? _jsx("div", {
                          className:
                            "pointer-events-none absolute top-1/2 right-1 -translate-y-1/2 opacity-0 transition-opacity duration-150 group-hover/menu-sub-item:pointer-events-auto group-hover/menu-sub-item:opacity-100 group-focus-within/menu-sub-item:pointer-events-auto group-focus-within/menu-sub-item:opacity-100",
                          children: _jsx("button", {
                            type: "button",
                            "data-thread-selection-safe": true,
                            "data-testid": `thread-archive-${thread.id}`,
                            "aria-label": `Archive ${thread.title}`,
                            className:
                              "inline-flex size-5 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring",
                            onPointerDown: stopPropagationOnPointerDown,
                            onClick: handleStartArchiveConfirmation,
                            children: _jsx(ArchiveIcon, { className: "size-3.5" }),
                          }),
                        })
                      : _jsxs(Tooltip, {
                          children: [
                            _jsx(TooltipTrigger, {
                              render: _jsx("div", {
                                className:
                                  "pointer-events-none absolute top-1/2 right-1 -translate-y-1/2 opacity-0 transition-opacity duration-150 group-hover/menu-sub-item:pointer-events-auto group-hover/menu-sub-item:opacity-100 group-focus-within/menu-sub-item:pointer-events-auto group-focus-within/menu-sub-item:opacity-100",
                                children: _jsx("button", {
                                  type: "button",
                                  "data-thread-selection-safe": true,
                                  "data-testid": `thread-archive-${thread.id}`,
                                  "aria-label": `Archive ${thread.title}`,
                                  className:
                                    "inline-flex size-5 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring",
                                  onPointerDown: stopPropagationOnPointerDown,
                                  onClick: handleArchiveImmediateClick,
                                  children: _jsx(ArchiveIcon, { className: "size-3.5" }),
                                }),
                              }),
                            }),
                            _jsx(TooltipPopup, { side: "top", children: "Archive" }),
                          ],
                        })
                    : null,
                _jsx("span", {
                  className: threadMetaClassName,
                  children: _jsxs("span", {
                    className: "inline-flex items-center gap-1",
                    children: [
                      isRemoteThread &&
                        _jsxs(Tooltip, {
                          children: [
                            _jsx(TooltipTrigger, {
                              render: _jsx("span", {
                                "aria-label": threadEnvironmentLabel ?? "Remote",
                                className: "inline-flex items-center justify-center",
                              }),
                              children: _jsx(CloudIcon, {
                                className: "size-3 text-muted-foreground/40",
                              }),
                            }),
                            _jsx(TooltipPopup, { side: "top", children: threadEnvironmentLabel }),
                          ],
                        }),
                      jumpLabel
                        ? _jsx("span", {
                            className:
                              "inline-flex h-5 items-center rounded-full border border-border/80 bg-background/90 px-1.5 font-mono text-[10px] font-medium tracking-tight text-foreground shadow-sm",
                            title: jumpLabel,
                            children: jumpLabel,
                          })
                        : _jsx("span", {
                            className: `text-[10px] ${
                              isHighlighted
                                ? "text-foreground/72 dark:text-foreground/82"
                                : "text-muted-foreground/40"
                            }`,
                            children: formatRelativeTimeLabel(
                              thread.latestUserMessageAt ?? thread.updatedAt ?? thread.createdAt,
                            ),
                          }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
});
const SidebarProjectThreadList = memo(function SidebarProjectThreadList(props) {
  const {
    projectKey,
    projectExpanded,
    hasOverflowingThreads,
    hiddenThreadStatus,
    orderedProjectThreadKeys,
    renderedThreads,
    showEmptyThreadState,
    shouldShowThreadPanel,
    isThreadListExpanded,
    projectCwd,
    activeRouteThreadKey,
    threadJumpLabelByKey,
    appSettingsConfirmThreadArchive,
    renamingThreadKey,
    renamingTitle,
    setRenamingTitle,
    renamingInputRef,
    renamingCommittedRef,
    confirmingArchiveThreadKey,
    setConfirmingArchiveThreadKey,
    confirmArchiveButtonRefs,
    attachThreadListAutoAnimateRef,
    handleThreadClick,
    navigateToThread,
    handleMultiSelectContextMenu,
    handleThreadContextMenu,
    clearSelection,
    commitRename,
    cancelRename,
    attemptArchiveThread,
    openPrLink,
    expandThreadListForProject,
    collapseThreadListForProject,
  } = props;
  const showMoreButtonRender = useMemo(() => _jsx("button", { type: "button" }), []);
  const showLessButtonRender = useMemo(() => _jsx("button", { type: "button" }), []);
  return _jsxs(SidebarMenuSub, {
    ref: attachThreadListAutoAnimateRef,
    className: "mx-1 my-0 w-full translate-x-0 gap-0.5 overflow-hidden px-1.5 py-0",
    children: [
      shouldShowThreadPanel && showEmptyThreadState
        ? _jsx(SidebarMenuSubItem, {
            className: "w-full",
            "data-thread-selection-safe": true,
            children: _jsx("div", {
              "data-thread-selection-safe": true,
              className:
                "flex h-6 w-full translate-x-0 items-center px-2 text-left text-[10px] text-muted-foreground/60",
              children: _jsx("span", { children: "No threads yet" }),
            }),
          })
        : null,
      shouldShowThreadPanel &&
        renderedThreads.map((thread) => {
          const threadKey = scopedThreadKey(scopeThreadRef(thread.environmentId, thread.id));
          return _jsx(
            SidebarThreadRow,
            {
              thread: thread,
              projectCwd: projectCwd,
              orderedProjectThreadKeys: orderedProjectThreadKeys,
              isActive: activeRouteThreadKey === threadKey,
              jumpLabel: threadJumpLabelByKey.get(threadKey) ?? null,
              appSettingsConfirmThreadArchive: appSettingsConfirmThreadArchive,
              renamingThreadKey: renamingThreadKey,
              renamingTitle: renamingTitle,
              setRenamingTitle: setRenamingTitle,
              renamingInputRef: renamingInputRef,
              renamingCommittedRef: renamingCommittedRef,
              confirmingArchiveThreadKey: confirmingArchiveThreadKey,
              setConfirmingArchiveThreadKey: setConfirmingArchiveThreadKey,
              confirmArchiveButtonRefs: confirmArchiveButtonRefs,
              handleThreadClick: handleThreadClick,
              navigateToThread: navigateToThread,
              handleMultiSelectContextMenu: handleMultiSelectContextMenu,
              handleThreadContextMenu: handleThreadContextMenu,
              clearSelection: clearSelection,
              commitRename: commitRename,
              cancelRename: cancelRename,
              attemptArchiveThread: attemptArchiveThread,
              openPrLink: openPrLink,
            },
            threadKey,
          );
        }),
      projectExpanded &&
        hasOverflowingThreads &&
        !isThreadListExpanded &&
        _jsx(SidebarMenuSubItem, {
          className: "w-full",
          children: _jsx(SidebarMenuSubButton, {
            render: showMoreButtonRender,
            "data-thread-selection-safe": true,
            size: "sm",
            className:
              "h-6 w-full translate-x-0 justify-start px-2 text-left text-[10px] text-muted-foreground/60 hover:bg-accent hover:text-muted-foreground/80",
            onClick: () => {
              expandThreadListForProject(projectKey);
            },
            children: _jsxs("span", {
              className: "flex min-w-0 flex-1 items-center gap-2",
              children: [
                hiddenThreadStatus &&
                  _jsx(ThreadStatusLabel, { status: hiddenThreadStatus, compact: true }),
                _jsx("span", { children: "Show more" }),
              ],
            }),
          }),
        }),
      projectExpanded &&
        hasOverflowingThreads &&
        isThreadListExpanded &&
        _jsx(SidebarMenuSubItem, {
          className: "w-full",
          children: _jsx(SidebarMenuSubButton, {
            render: showLessButtonRender,
            "data-thread-selection-safe": true,
            size: "sm",
            className:
              "h-6 w-full translate-x-0 justify-start px-2 text-left text-[10px] text-muted-foreground/60 hover:bg-accent hover:text-muted-foreground/80",
            onClick: () => {
              collapseThreadListForProject(projectKey);
            },
            children: _jsx("span", { children: "Show less" }),
          }),
        }),
    ],
  });
});
const SidebarProjectItem = memo(function SidebarProjectItem(props) {
  const {
    project,
    isThreadListExpanded,
    activeRouteThreadKey,
    newThreadShortcutLabel,
    handleNewThread,
    archiveThread,
    deleteThread,
    threadJumpLabelByKey,
    attachThreadListAutoAnimateRef,
    expandThreadListForProject,
    collapseThreadListForProject,
    dragInProgressRef,
    suppressProjectClickAfterDragRef,
    suppressProjectClickForContextMenuRef,
    isManualProjectSorting,
    dragHandleProps,
  } = props;
  const threadSortOrder = useSettings((settings) => settings.sidebarThreadSortOrder);
  const appSettingsConfirmThreadDelete = useSettings((settings) => settings.confirmThreadDelete);
  const appSettingsConfirmThreadArchive = useSettings((settings) => settings.confirmThreadArchive);
  const defaultThreadEnvMode = useSettings((settings) => settings.defaultThreadEnvMode);
  const router = useRouter();
  const markThreadUnread = useUiStateStore((state) => state.markThreadUnread);
  const toggleProject = useUiStateStore((state) => state.toggleProject);
  const toggleThreadSelection = useThreadSelectionStore((state) => state.toggleThread);
  const rangeSelectTo = useThreadSelectionStore((state) => state.rangeSelectTo);
  const clearSelection = useThreadSelectionStore((state) => state.clearSelection);
  const removeFromSelection = useThreadSelectionStore((state) => state.removeFromSelection);
  const setSelectionAnchor = useThreadSelectionStore((state) => state.setAnchor);
  const selectedThreadCount = useThreadSelectionStore((state) => state.selectedThreadKeys.size);
  const clearComposerDraftForThread = useComposerDraftStore((state) => state.clearDraftThread);
  const getDraftThreadByProjectRef = useComposerDraftStore(
    (state) => state.getDraftThreadByProjectRef,
  );
  const clearProjectDraftThreadId = useComposerDraftStore(
    (state) => state.clearProjectDraftThreadId,
  );
  const { copyToClipboard: copyThreadIdToClipboard } = useCopyToClipboard({
    onCopy: (ctx) => {
      toastManager.add({
        type: "success",
        title: "Thread ID copied",
        description: ctx.threadId,
      });
    },
    onError: (error) => {
      toastManager.add({
        type: "error",
        title: "Failed to copy thread ID",
        description: error instanceof Error ? error.message : "An error occurred.",
      });
    },
  });
  const { copyToClipboard: copyPathToClipboard } = useCopyToClipboard({
    onCopy: (ctx) => {
      toastManager.add({
        type: "success",
        title: "Path copied",
        description: ctx.path,
      });
    },
    onError: (error) => {
      toastManager.add({
        type: "error",
        title: "Failed to copy path",
        description: error instanceof Error ? error.message : "An error occurred.",
      });
    },
  });
  const openPrLink = useCallback((event, prUrl) => {
    event.preventDefault();
    event.stopPropagation();
    const api = readLocalApi();
    if (!api) {
      toastManager.add({
        type: "error",
        title: "Link opening is unavailable.",
      });
      return;
    }
    void api.shell.openExternal(prUrl).catch((error) => {
      toastManager.add({
        type: "error",
        title: "Unable to open PR link",
        description: error instanceof Error ? error.message : "An error occurred.",
      });
    });
  }, []);
  const sidebarThreads = useStore(
    useShallow(
      useMemo(
        () => (state) =>
          selectSidebarThreadsForProjectRef(
            state,
            scopeProjectRef(project.environmentId, project.id),
          ),
        [project.environmentId, project.id],
      ),
    ),
  );
  // For grouped projects that span multiple environments, also fetch
  // threads from the other member project refs.
  const otherMemberRefs = useMemo(
    () =>
      project.memberProjectRefs.filter(
        (ref) => ref.environmentId !== project.environmentId || ref.projectId !== project.id,
      ),
    [project.memberProjectRefs, project.environmentId, project.id],
  );
  const otherMemberThreads = useStore(
    useShallow(
      useMemo(
        () =>
          otherMemberRefs.length === 0
            ? () => []
            : (state) => selectSidebarThreadsForProjectRefs(state, otherMemberRefs),
        [otherMemberRefs],
      ),
    ),
  );
  const allSidebarThreads = useMemo(
    () =>
      otherMemberThreads.length === 0 ? sidebarThreads : [...sidebarThreads, ...otherMemberThreads],
    [sidebarThreads, otherMemberThreads],
  );
  const sidebarThreadByKey = useMemo(
    () =>
      new Map(
        allSidebarThreads.map((thread) => [
          scopedThreadKey(scopeThreadRef(thread.environmentId, thread.id)),
          thread,
        ]),
      ),
    [allSidebarThreads],
  );
  // Keep a ref so callbacks can read the latest map without appearing in
  // dependency arrays (avoids invalidating every thread-row memo on each
  // thread-list change).
  const sidebarThreadByKeyRef = useRef(sidebarThreadByKey);
  sidebarThreadByKeyRef.current = sidebarThreadByKey;
  // All threads from the representative + other member environments are
  // already fetched into allSidebarThreads, so we can use them directly.
  const projectThreads = allSidebarThreads;
  const projectExpanded = useUiStateStore(
    (state) => state.projectExpandedById[project.projectKey] ?? true,
  );
  const threadLastVisitedAts = useUiStateStore(
    useShallow((state) =>
      projectThreads.map(
        (thread) =>
          state.threadLastVisitedAtById[
            scopedThreadKey(scopeThreadRef(thread.environmentId, thread.id))
          ] ?? null,
      ),
    ),
  );
  const [renamingThreadKey, setRenamingThreadKey] = useState(null);
  const [renamingTitle, setRenamingTitle] = useState("");
  const [confirmingArchiveThreadKey, setConfirmingArchiveThreadKey] = useState(null);
  const renamingCommittedRef = useRef(false);
  const renamingInputRef = useRef(null);
  const confirmArchiveButtonRefs = useRef(new Map());
  const { projectStatus, visibleProjectThreads, orderedProjectThreadKeys } = useMemo(() => {
    const lastVisitedAtByThreadKey = new Map(
      projectThreads.map((thread, index) => [
        scopedThreadKey(scopeThreadRef(thread.environmentId, thread.id)),
        threadLastVisitedAts[index] ?? null,
      ]),
    );
    const resolveProjectThreadStatus = (thread) => {
      const lastVisitedAt = lastVisitedAtByThreadKey.get(
        scopedThreadKey(scopeThreadRef(thread.environmentId, thread.id)),
      );
      return resolveThreadStatusPill({
        thread: {
          ...thread,
          ...(lastVisitedAt !== null && lastVisitedAt !== undefined ? { lastVisitedAt } : {}),
        },
      });
    };
    const visibleProjectThreads = sortThreads(
      projectThreads.filter((thread) => thread.archivedAt === null),
      threadSortOrder,
    );
    const projectStatus = resolveProjectStatusIndicator(
      visibleProjectThreads.map((thread) => resolveProjectThreadStatus(thread)),
    );
    return {
      orderedProjectThreadKeys: visibleProjectThreads.map((thread) =>
        scopedThreadKey(scopeThreadRef(thread.environmentId, thread.id)),
      ),
      projectStatus,
      visibleProjectThreads,
    };
  }, [projectThreads, threadLastVisitedAts, threadSortOrder]);
  const pinnedCollapsedThread = useMemo(() => {
    const activeThreadKey = activeRouteThreadKey ?? undefined;
    if (!activeThreadKey || projectExpanded) {
      return null;
    }
    return (
      visibleProjectThreads.find(
        (thread) =>
          scopedThreadKey(scopeThreadRef(thread.environmentId, thread.id)) === activeThreadKey,
      ) ?? null
    );
  }, [activeRouteThreadKey, projectExpanded, visibleProjectThreads]);
  const {
    hasOverflowingThreads,
    hiddenThreadStatus,
    renderedThreads,
    showEmptyThreadState,
    shouldShowThreadPanel,
  } = useMemo(() => {
    const lastVisitedAtByThreadKey = new Map(
      projectThreads.map((thread, index) => [
        scopedThreadKey(scopeThreadRef(thread.environmentId, thread.id)),
        threadLastVisitedAts[index] ?? null,
      ]),
    );
    const resolveProjectThreadStatus = (thread) => {
      const lastVisitedAt = lastVisitedAtByThreadKey.get(
        scopedThreadKey(scopeThreadRef(thread.environmentId, thread.id)),
      );
      return resolveThreadStatusPill({
        thread: {
          ...thread,
          ...(lastVisitedAt !== null && lastVisitedAt !== undefined ? { lastVisitedAt } : {}),
        },
      });
    };
    const hasOverflowingThreads = visibleProjectThreads.length > THREAD_PREVIEW_LIMIT;
    const previewThreads =
      isThreadListExpanded || !hasOverflowingThreads
        ? visibleProjectThreads
        : visibleProjectThreads.slice(0, THREAD_PREVIEW_LIMIT);
    const visibleThreadKeys = new Set(
      [...previewThreads, ...(pinnedCollapsedThread ? [pinnedCollapsedThread] : [])].map((thread) =>
        scopedThreadKey(scopeThreadRef(thread.environmentId, thread.id)),
      ),
    );
    const renderedThreads = pinnedCollapsedThread
      ? [pinnedCollapsedThread]
      : visibleProjectThreads.filter((thread) =>
          visibleThreadKeys.has(scopedThreadKey(scopeThreadRef(thread.environmentId, thread.id))),
        );
    const hiddenThreads = visibleProjectThreads.filter(
      (thread) =>
        !visibleThreadKeys.has(scopedThreadKey(scopeThreadRef(thread.environmentId, thread.id))),
    );
    return {
      hasOverflowingThreads,
      hiddenThreadStatus: resolveProjectStatusIndicator(
        hiddenThreads.map((thread) => resolveProjectThreadStatus(thread)),
      ),
      renderedThreads,
      showEmptyThreadState: projectExpanded && visibleProjectThreads.length === 0,
      shouldShowThreadPanel: projectExpanded || pinnedCollapsedThread !== null,
    };
  }, [
    isThreadListExpanded,
    pinnedCollapsedThread,
    projectExpanded,
    projectThreads,
    threadLastVisitedAts,
    visibleProjectThreads,
  ]);
  const handleProjectButtonClick = useCallback(
    (event) => {
      if (suppressProjectClickForContextMenuRef.current) {
        suppressProjectClickForContextMenuRef.current = false;
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (dragInProgressRef.current) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (suppressProjectClickAfterDragRef.current) {
        suppressProjectClickAfterDragRef.current = false;
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (selectedThreadCount > 0) {
        clearSelection();
      }
      toggleProject(project.projectKey);
    },
    [
      clearSelection,
      dragInProgressRef,
      project.projectKey,
      selectedThreadCount,
      suppressProjectClickAfterDragRef,
      suppressProjectClickForContextMenuRef,
      toggleProject,
    ],
  );
  const handleProjectButtonKeyDown = useCallback(
    (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      if (dragInProgressRef.current) {
        return;
      }
      toggleProject(project.projectKey);
    },
    [dragInProgressRef, project.projectKey, toggleProject],
  );
  const handleProjectButtonPointerDownCapture = useCallback(
    (event) => {
      suppressProjectClickForContextMenuRef.current = false;
      if (
        isContextMenuPointerDown({
          button: event.button,
          ctrlKey: event.ctrlKey,
          isMac: isMacPlatform(navigator.platform),
        })
      ) {
        event.stopPropagation();
      }
      suppressProjectClickAfterDragRef.current = false;
    },
    [suppressProjectClickAfterDragRef, suppressProjectClickForContextMenuRef],
  );
  const handleProjectButtonContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      suppressProjectClickForContextMenuRef.current = true;
      void (async () => {
        const api = readLocalApi();
        if (!api) return;
        const clicked = await api.contextMenu.show(
          [
            { id: "copy-path", label: "Copy Project Path" },
            { id: "delete", label: "Remove project", destructive: true },
          ],
          {
            x: event.clientX,
            y: event.clientY,
          },
        );
        if (clicked === "copy-path") {
          copyPathToClipboard(project.cwd, { path: project.cwd });
          return;
        }
        if (clicked !== "delete") return;
        if (projectThreads.length > 0) {
          toastManager.add({
            type: "warning",
            title: "Project is not empty",
            description: "Delete all threads in this project before removing it.",
          });
          return;
        }
        const confirmed = await api.dialogs.confirm(`Remove project "${project.name}"?`);
        if (!confirmed) return;
        try {
          const projectDraftThread = getDraftThreadByProjectRef(
            scopeProjectRef(project.environmentId, project.id),
          );
          if (projectDraftThread) {
            clearComposerDraftForThread(projectDraftThread.draftId);
          }
          clearProjectDraftThreadId(scopeProjectRef(project.environmentId, project.id));
          const projectApi = readEnvironmentApi(project.environmentId);
          if (!projectApi) {
            throw new Error("Project API unavailable.");
          }
          await projectApi.orchestration.dispatchCommand({
            type: "project.delete",
            commandId: newCommandId(),
            projectId: project.id,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown error removing project.";
          console.error("Failed to remove project", { projectId: project.id, error });
          toastManager.add({
            type: "error",
            title: `Failed to remove "${project.name}"`,
            description: message,
          });
        }
      })();
    },
    [
      clearComposerDraftForThread,
      clearProjectDraftThreadId,
      copyPathToClipboard,
      getDraftThreadByProjectRef,
      project.cwd,
      project.environmentId,
      project.id,
      project.name,
      projectThreads.length,
      suppressProjectClickForContextMenuRef,
    ],
  );
  const navigateToThread = useCallback(
    (threadRef) => {
      if (useThreadSelectionStore.getState().selectedThreadKeys.size > 0) {
        clearSelection();
      }
      setSelectionAnchor(scopedThreadKey(threadRef));
      void router.navigate({
        to: "/$environmentId/$threadId",
        params: buildThreadRouteParams(threadRef),
      });
    },
    [clearSelection, router, setSelectionAnchor],
  );
  const handleThreadClick = useCallback(
    (event, threadRef, orderedProjectThreadKeys) => {
      const isMac = isMacPlatform(navigator.platform);
      const isModClick = isMac ? event.metaKey : event.ctrlKey;
      const isShiftClick = event.shiftKey;
      const threadKey = scopedThreadKey(threadRef);
      const currentSelectionCount = useThreadSelectionStore.getState().selectedThreadKeys.size;
      if (isModClick) {
        event.preventDefault();
        toggleThreadSelection(threadKey);
        return;
      }
      if (isShiftClick) {
        event.preventDefault();
        rangeSelectTo(threadKey, orderedProjectThreadKeys);
        return;
      }
      if (currentSelectionCount > 0) {
        clearSelection();
      }
      setSelectionAnchor(threadKey);
      void router.navigate({
        to: "/$environmentId/$threadId",
        params: buildThreadRouteParams(threadRef),
      });
    },
    [clearSelection, rangeSelectTo, router, setSelectionAnchor, toggleThreadSelection],
  );
  const handleMultiSelectContextMenu = useCallback(
    async (position) => {
      const api = readLocalApi();
      if (!api) return;
      const threadKeys = [...useThreadSelectionStore.getState().selectedThreadKeys];
      if (threadKeys.length === 0) return;
      const count = threadKeys.length;
      const clicked = await api.contextMenu.show(
        [
          { id: "mark-unread", label: `Mark unread (${count})` },
          { id: "delete", label: `Delete (${count})`, destructive: true },
        ],
        position,
      );
      if (clicked === "mark-unread") {
        for (const threadKey of threadKeys) {
          const thread = sidebarThreadByKeyRef.current.get(threadKey);
          markThreadUnread(threadKey, thread?.latestTurn?.completedAt);
        }
        clearSelection();
        return;
      }
      if (clicked !== "delete") return;
      if (appSettingsConfirmThreadDelete) {
        const confirmed = await api.dialogs.confirm(
          [
            `Delete ${count} thread${count === 1 ? "" : "s"}?`,
            "This permanently clears conversation history for these threads.",
          ].join("\n"),
        );
        if (!confirmed) return;
      }
      const deletedThreadKeys = new Set(threadKeys);
      for (const threadKey of threadKeys) {
        const thread = sidebarThreadByKeyRef.current.get(threadKey);
        if (!thread) continue;
        await deleteThread(scopeThreadRef(thread.environmentId, thread.id), {
          deletedThreadKeys,
        });
      }
      removeFromSelection(threadKeys);
    },
    [
      appSettingsConfirmThreadDelete,
      clearSelection,
      deleteThread,
      markThreadUnread,
      removeFromSelection,
    ],
  );
  const handleCreateThreadClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const currentRouteParams =
        router.state.matches[router.state.matches.length - 1]?.params ?? {};
      const currentRouteTarget = resolveThreadRouteTarget(currentRouteParams);
      const currentActiveThread =
        currentRouteTarget?.kind === "server"
          ? (selectThreadByRef(useStore.getState(), currentRouteTarget.threadRef) ?? null)
          : null;
      const draftStore = useComposerDraftStore.getState();
      const currentActiveDraftThread =
        currentRouteTarget?.kind === "server"
          ? (draftStore.getDraftThread(currentRouteTarget.threadRef) ?? null)
          : currentRouteTarget?.kind === "draft"
            ? (draftStore.getDraftSession(currentRouteTarget.draftId) ?? null)
            : null;
      const seedContext = resolveSidebarNewThreadSeedContext({
        projectId: project.id,
        defaultEnvMode: resolveSidebarNewThreadEnvMode({
          defaultEnvMode: defaultThreadEnvMode,
        }),
        activeThread:
          currentActiveThread && currentActiveThread.projectId === project.id
            ? {
                projectId: currentActiveThread.projectId,
                branch: currentActiveThread.branch,
                worktreePath: currentActiveThread.worktreePath,
              }
            : null,
        activeDraftThread:
          currentActiveDraftThread && currentActiveDraftThread.projectId === project.id
            ? {
                projectId: currentActiveDraftThread.projectId,
                branch: currentActiveDraftThread.branch,
                worktreePath: currentActiveDraftThread.worktreePath,
                envMode: currentActiveDraftThread.envMode,
              }
            : null,
      });
      void handleNewThread(scopeProjectRef(project.environmentId, project.id), {
        ...(seedContext.branch !== undefined ? { branch: seedContext.branch } : {}),
        ...(seedContext.worktreePath !== undefined
          ? { worktreePath: seedContext.worktreePath }
          : {}),
        envMode: seedContext.envMode,
      });
    },
    [defaultThreadEnvMode, handleNewThread, project.environmentId, project.id, router],
  );
  const attemptArchiveThread = useCallback(
    async (threadRef) => {
      try {
        await archiveThread(threadRef);
      } catch (error) {
        toastManager.add({
          type: "error",
          title: "Failed to archive thread",
          description: error instanceof Error ? error.message : "An error occurred.",
        });
      }
    },
    [archiveThread],
  );
  const cancelRename = useCallback(() => {
    setRenamingThreadKey(null);
    renamingInputRef.current = null;
  }, []);
  const commitRename = useCallback(async (threadRef, newTitle, originalTitle) => {
    const threadKey = scopedThreadKey(threadRef);
    const finishRename = () => {
      setRenamingThreadKey((current) => {
        if (current !== threadKey) return current;
        renamingInputRef.current = null;
        return null;
      });
    };
    const trimmed = newTitle.trim();
    if (trimmed.length === 0) {
      toastManager.add({
        type: "warning",
        title: "Thread title cannot be empty",
      });
      finishRename();
      return;
    }
    if (trimmed === originalTitle) {
      finishRename();
      return;
    }
    const api = readEnvironmentApi(threadRef.environmentId);
    if (!api) {
      finishRename();
      return;
    }
    try {
      await api.orchestration.dispatchCommand({
        type: "thread.meta.update",
        commandId: newCommandId(),
        threadId: threadRef.threadId,
        title: trimmed,
      });
    } catch (error) {
      toastManager.add({
        type: "error",
        title: "Failed to rename thread",
        description: error instanceof Error ? error.message : "An error occurred.",
      });
    }
    finishRename();
  }, []);
  const handleThreadContextMenu = useCallback(
    async (threadRef, position) => {
      const api = readLocalApi();
      if (!api) return;
      const threadKey = scopedThreadKey(threadRef);
      const thread = sidebarThreadByKeyRef.current.get(threadKey) ?? null;
      if (!thread) return;
      const threadWorkspacePath = thread.worktreePath ?? project.cwd ?? null;
      const clicked = await api.contextMenu.show(
        [
          { id: "rename", label: "Rename thread" },
          { id: "mark-unread", label: "Mark unread" },
          { id: "copy-path", label: "Copy Path" },
          { id: "copy-thread-id", label: "Copy Thread ID" },
          { id: "delete", label: "Delete", destructive: true },
        ],
        position,
      );
      if (clicked === "rename") {
        setRenamingThreadKey(threadKey);
        setRenamingTitle(thread.title);
        renamingCommittedRef.current = false;
        return;
      }
      if (clicked === "mark-unread") {
        markThreadUnread(threadKey, thread.latestTurn?.completedAt);
        return;
      }
      if (clicked === "copy-path") {
        if (!threadWorkspacePath) {
          toastManager.add({
            type: "error",
            title: "Path unavailable",
            description: "This thread does not have a workspace path to copy.",
          });
          return;
        }
        copyPathToClipboard(threadWorkspacePath, { path: threadWorkspacePath });
        return;
      }
      if (clicked === "copy-thread-id") {
        copyThreadIdToClipboard(thread.id, { threadId: thread.id });
        return;
      }
      if (clicked !== "delete") return;
      if (appSettingsConfirmThreadDelete) {
        const confirmed = await api.dialogs.confirm(
          [
            `Delete thread "${thread.title}"?`,
            "This permanently clears conversation history for this thread.",
          ].join("\n"),
        );
        if (!confirmed) {
          return;
        }
      }
      await deleteThread(threadRef);
    },
    [
      appSettingsConfirmThreadDelete,
      copyPathToClipboard,
      copyThreadIdToClipboard,
      deleteThread,
      markThreadUnread,
      project.cwd,
    ],
  );
  return _jsxs(_Fragment, {
    children: [
      _jsxs("div", {
        className: "group/project-header relative",
        children: [
          _jsxs(SidebarMenuButton, {
            ref: isManualProjectSorting ? dragHandleProps?.setActivatorNodeRef : undefined,
            size: "sm",
            className: `gap-2 px-2 py-1.5 text-left hover:bg-accent group-hover/project-header:bg-accent group-hover/project-header:text-sidebar-accent-foreground ${isManualProjectSorting ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`,
            ...(isManualProjectSorting && dragHandleProps ? dragHandleProps.attributes : {}),
            ...(isManualProjectSorting && dragHandleProps ? dragHandleProps.listeners : {}),
            onPointerDownCapture: handleProjectButtonPointerDownCapture,
            onClick: handleProjectButtonClick,
            onKeyDown: handleProjectButtonKeyDown,
            onContextMenu: handleProjectButtonContextMenu,
            children: [
              !projectExpanded && projectStatus
                ? _jsxs("span", {
                    "aria-hidden": "true",
                    title: projectStatus.label,
                    className: `-ml-0.5 relative inline-flex size-3.5 shrink-0 items-center justify-center ${projectStatus.colorClass}`,
                    children: [
                      _jsx("span", {
                        className:
                          "absolute inset-0 flex items-center justify-center transition-opacity duration-150 group-hover/project-header:opacity-0",
                        children: _jsx("span", {
                          className: `size-[9px] rounded-full ${projectStatus.dotClass} ${projectStatus.pulse ? "animate-pulse" : ""}`,
                        }),
                      }),
                      _jsx(ChevronRightIcon, {
                        className:
                          "absolute inset-0 m-auto size-3.5 text-muted-foreground/70 opacity-0 transition-opacity duration-150 group-hover/project-header:opacity-100",
                      }),
                    ],
                  })
                : _jsx(ChevronRightIcon, {
                    className: `-ml-0.5 size-3.5 shrink-0 text-muted-foreground/70 transition-transform duration-150 ${projectExpanded ? "rotate-90" : ""}`,
                  }),
              _jsx(ProjectFavicon, { environmentId: project.environmentId, cwd: project.cwd }),
              _jsx("span", {
                className: "flex-1 truncate text-xs font-medium text-foreground/90",
                children: project.name,
              }),
            ],
          }),
          project.environmentPresence === "remote-only" &&
            _jsxs(Tooltip, {
              children: [
                _jsx(TooltipTrigger, {
                  render: _jsx("span", {
                    "aria-label":
                      project.environmentPresence === "remote-only"
                        ? "Remote project"
                        : "Available in multiple environments",
                    className:
                      "pointer-events-none absolute top-1 right-1.5 inline-flex size-5 items-center justify-center rounded-md text-muted-foreground/50 transition-opacity duration-150 group-hover/project-header:opacity-0 group-focus-within/project-header:opacity-0",
                  }),
                  children: _jsx(CloudIcon, { className: "size-3" }),
                }),
                _jsxs(TooltipPopup, {
                  side: "top",
                  children: ["Remote environment: ", project.remoteEnvironmentLabels.join(", ")],
                }),
              ],
            }),
          _jsxs(Tooltip, {
            children: [
              _jsx(TooltipTrigger, {
                render: _jsx("div", {
                  className:
                    "pointer-events-none absolute top-1 right-1.5 opacity-0 transition-opacity duration-150 group-hover/project-header:pointer-events-auto group-hover/project-header:opacity-100 group-focus-within/project-header:pointer-events-auto group-focus-within/project-header:opacity-100",
                  children: _jsx("button", {
                    type: "button",
                    "aria-label": `Create new thread in ${project.name}`,
                    "data-testid": "new-thread-button",
                    className:
                      "inline-flex size-5 cursor-pointer items-center justify-center rounded-md text-muted-foreground/70 hover:bg-secondary hover:text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring",
                    onClick: handleCreateThreadClick,
                    children: _jsx(SquarePenIcon, { className: "size-3.5" }),
                  }),
                }),
              }),
              _jsx(TooltipPopup, {
                side: "top",
                children: newThreadShortcutLabel
                  ? `New thread (${newThreadShortcutLabel})`
                  : "New thread",
              }),
            ],
          }),
        ],
      }),
      _jsx(SidebarProjectThreadList, {
        projectKey: project.projectKey,
        projectExpanded: projectExpanded,
        hasOverflowingThreads: hasOverflowingThreads,
        hiddenThreadStatus: hiddenThreadStatus,
        orderedProjectThreadKeys: orderedProjectThreadKeys,
        renderedThreads: renderedThreads,
        showEmptyThreadState: showEmptyThreadState,
        shouldShowThreadPanel: shouldShowThreadPanel,
        isThreadListExpanded: isThreadListExpanded,
        projectCwd: project.cwd,
        activeRouteThreadKey: activeRouteThreadKey,
        threadJumpLabelByKey: threadJumpLabelByKey,
        appSettingsConfirmThreadArchive: appSettingsConfirmThreadArchive,
        renamingThreadKey: renamingThreadKey,
        renamingTitle: renamingTitle,
        setRenamingTitle: setRenamingTitle,
        renamingInputRef: renamingInputRef,
        renamingCommittedRef: renamingCommittedRef,
        confirmingArchiveThreadKey: confirmingArchiveThreadKey,
        setConfirmingArchiveThreadKey: setConfirmingArchiveThreadKey,
        confirmArchiveButtonRefs: confirmArchiveButtonRefs,
        attachThreadListAutoAnimateRef: attachThreadListAutoAnimateRef,
        handleThreadClick: handleThreadClick,
        navigateToThread: navigateToThread,
        handleMultiSelectContextMenu: handleMultiSelectContextMenu,
        handleThreadContextMenu: handleThreadContextMenu,
        clearSelection: clearSelection,
        commitRename: commitRename,
        cancelRename: cancelRename,
        attemptArchiveThread: attemptArchiveThread,
        openPrLink: openPrLink,
        expandThreadListForProject: expandThreadListForProject,
        collapseThreadListForProject: collapseThreadListForProject,
      }),
    ],
  });
});
const SidebarProjectListRow = memo(function SidebarProjectListRow(props) {
  return _jsx(SidebarMenuItem, {
    className: "rounded-md",
    children: _jsx(SidebarProjectItem, { ...props }),
  });
});
function T3Wordmark() {
  return _jsx("svg", {
    "aria-label": "T3",
    className: "h-2.5 w-auto shrink-0 text-foreground",
    viewBox: "15.5309 37 94.3941 56.96",
    xmlns: "http://www.w3.org/2000/svg",
    children: _jsx("path", {
      d: "M33.4509 93V47.56H15.5309V37H64.3309V47.56H46.4109V93H33.4509ZM86.7253 93.96C82.832 93.96 78.9653 93.4533 75.1253 92.44C71.2853 91.3733 68.032 89.88 65.3653 87.96L70.4053 78.04C72.5386 79.5867 75.0186 80.8133 77.8453 81.72C80.672 82.6267 83.5253 83.08 86.4053 83.08C89.6586 83.08 92.2186 82.44 94.0853 81.16C95.952 79.88 96.8853 78.12 96.8853 75.88C96.8853 73.7467 96.0586 72.0667 94.4053 70.84C92.752 69.6133 90.0853 69 86.4053 69H80.4853V60.44L96.0853 42.76L97.5253 47.4H68.1653V37H107.365V45.4L91.8453 63.08L85.2853 59.32H89.0453C95.9253 59.32 101.125 60.8667 104.645 63.96C108.165 67.0533 109.925 71.0267 109.925 75.88C109.925 79.0267 109.099 81.9867 107.445 84.76C105.792 87.48 103.259 89.6933 99.8453 91.4C96.432 93.1067 92.0586 93.96 86.7253 93.96Z",
      fill: "currentColor",
    }),
  });
}
function ProjectSortMenu({
  projectSortOrder,
  threadSortOrder,
  onProjectSortOrderChange,
  onThreadSortOrderChange,
}) {
  return _jsxs(Menu, {
    children: [
      _jsxs(Tooltip, {
        children: [
          _jsx(TooltipTrigger, {
            render: _jsx(MenuTrigger, {
              className:
                "inline-flex size-5 cursor-pointer items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-accent hover:text-foreground",
            }),
            children: _jsx(ArrowUpDownIcon, { className: "size-3.5" }),
          }),
          _jsx(TooltipPopup, { side: "right", children: "Sort projects" }),
        ],
      }),
      _jsxs(MenuPopup, {
        align: "end",
        side: "bottom",
        className: "min-w-44",
        children: [
          _jsxs(MenuGroup, {
            children: [
              _jsx("div", {
                className: "px-2 py-1 sm:text-xs font-medium text-muted-foreground",
                children: "Sort projects",
              }),
              _jsx(MenuRadioGroup, {
                value: projectSortOrder,
                onValueChange: (value) => {
                  onProjectSortOrderChange(value);
                },
                children: Object.entries(SIDEBAR_SORT_LABELS).map(([value, label]) =>
                  _jsx(
                    MenuRadioItem,
                    { value: value, className: "min-h-7 py-1 sm:text-xs", children: label },
                    value,
                  ),
                ),
              }),
            ],
          }),
          _jsxs(MenuGroup, {
            children: [
              _jsx("div", {
                className: "px-2 pt-2 pb-1 sm:text-xs font-medium text-muted-foreground",
                children: "Sort threads",
              }),
              _jsx(MenuRadioGroup, {
                value: threadSortOrder,
                onValueChange: (value) => {
                  onThreadSortOrderChange(value);
                },
                children: Object.entries(SIDEBAR_THREAD_SORT_LABELS).map(([value, label]) =>
                  _jsx(
                    MenuRadioItem,
                    { value: value, className: "min-h-7 py-1 sm:text-xs", children: label },
                    value,
                  ),
                ),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function SortableProjectItem({ projectId, disabled = false, children }) {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: projectId, disabled });
  return _jsx("li", {
    ref: setNodeRef,
    style: {
      transform: CSS.Translate.toString(transform),
      transition,
    },
    className: `group/menu-item relative rounded-md ${isDragging ? "z-20 opacity-80" : ""} ${isOver && !isDragging ? "ring-1 ring-primary/40" : ""}`,
    "data-sidebar": "menu-item",
    "data-slot": "sidebar-menu-item",
    children: children({ attributes, listeners, setActivatorNodeRef }),
  });
}
const SidebarChromeHeader = memo(function SidebarChromeHeader({ isElectron }) {
  const wordmark = _jsxs("div", {
    className: "flex items-center gap-2",
    children: [
      _jsx(SidebarTrigger, { className: "shrink-0 md:hidden" }),
      _jsxs(Tooltip, {
        children: [
          _jsx(TooltipTrigger, {
            render: _jsxs(Link, {
              "aria-label": "Go to threads",
              className:
                "ml-1 flex min-w-0 flex-1 cursor-pointer items-center gap-1 rounded-md outline-hidden ring-ring transition-colors hover:text-foreground focus-visible:ring-2",
              to: "/",
              children: [
                _jsx(T3Wordmark, {}),
                _jsx("span", {
                  className: "truncate text-sm font-medium tracking-tight text-muted-foreground",
                  children: "Code",
                }),
                _jsx("span", {
                  className:
                    "rounded-full bg-muted/50 px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-[0.18em] text-muted-foreground/60",
                  children: APP_STAGE_LABEL,
                }),
              ],
            }),
          }),
          _jsxs(TooltipPopup, {
            side: "bottom",
            sideOffset: 2,
            children: ["Version ", APP_VERSION],
          }),
        ],
      }),
    ],
  });
  return isElectron
    ? _jsx(SidebarHeader, {
        className:
          "drag-region h-[52px] flex-row items-center gap-2 px-4 py-0 pl-[90px] wco:h-[env(titlebar-area-height)] wco:pl-[calc(env(titlebar-area-x)+1em)]",
        children: wordmark,
      })
    : _jsx(SidebarHeader, {
        className: "gap-3 px-3 py-2 sm:gap-2.5 sm:px-4 sm:py-3",
        children: wordmark,
      });
});
const SidebarChromeFooter = memo(function SidebarChromeFooter() {
  const navigate = useNavigate();
  const handleSettingsClick = useCallback(() => {
    void navigate({ to: "/settings" });
  }, [navigate]);
  return _jsxs(SidebarFooter, {
    className: "p-2",
    children: [
      _jsx(SidebarUpdatePill, {}),
      _jsx(SidebarMenu, {
        children: _jsx(SidebarMenuItem, {
          children: _jsxs(SidebarMenuButton, {
            size: "sm",
            className:
              "gap-2 px-2 py-1.5 text-muted-foreground/70 hover:bg-accent hover:text-foreground",
            onClick: handleSettingsClick,
            children: [
              _jsx(SettingsIcon, { className: "size-3.5" }),
              _jsx("span", { className: "text-xs", children: "Settings" }),
            ],
          }),
        }),
      }),
    ],
  });
});
const SidebarProjectsContent = memo(function SidebarProjectsContent(props) {
  const {
    showArm64IntelBuildWarning,
    arm64IntelBuildWarningDescription,
    desktopUpdateButtonAction,
    desktopUpdateButtonDisabled,
    handleDesktopUpdateButtonClick,
    projectSortOrder,
    threadSortOrder,
    updateSettings,
    shouldShowProjectPathEntry,
    handleStartAddProject,
    isElectron,
    isPickingFolder,
    isAddingProject,
    handlePickFolder,
    addProjectInputRef,
    addProjectError,
    newCwd,
    setNewCwd,
    setAddProjectError,
    handleAddProject,
    setAddingProject,
    canAddProject,
    isManualProjectSorting,
    projectDnDSensors,
    projectCollisionDetection,
    handleProjectDragStart,
    handleProjectDragEnd,
    handleProjectDragCancel,
    handleNewThread,
    archiveThread,
    deleteThread,
    sortedProjects,
    expandedThreadListsByProject,
    activeRouteProjectKey,
    routeThreadKey,
    newThreadShortcutLabel,
    commandPaletteShortcutLabel,
    threadJumpLabelByKey,
    attachThreadListAutoAnimateRef,
    expandThreadListForProject,
    collapseThreadListForProject,
    dragInProgressRef,
    suppressProjectClickAfterDragRef,
    suppressProjectClickForContextMenuRef,
    attachProjectListAutoAnimateRef,
    projectsLength,
  } = props;
  const handleProjectSortOrderChange = useCallback(
    (sortOrder) => {
      updateSettings({ sidebarProjectSortOrder: sortOrder });
    },
    [updateSettings],
  );
  const handleThreadSortOrderChange = useCallback(
    (sortOrder) => {
      updateSettings({ sidebarThreadSortOrder: sortOrder });
    },
    [updateSettings],
  );
  const handleAddProjectInputChange = useCallback(
    (event) => {
      setNewCwd(event.target.value);
      setAddProjectError(null);
    },
    [setAddProjectError, setNewCwd],
  );
  const handleAddProjectInputKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter") handleAddProject();
      if (event.key === "Escape") {
        setAddingProject(false);
        setAddProjectError(null);
      }
    },
    [handleAddProject, setAddProjectError, setAddingProject],
  );
  const handleBrowseForFolderClick = useCallback(() => {
    void handlePickFolder();
  }, [handlePickFolder]);
  return _jsxs(SidebarContent, {
    className: "gap-0",
    children: [
      _jsx(SidebarGroup, {
        className: "px-2 pt-2 pb-1",
        children: _jsx(SidebarMenu, {
          children: _jsx(SidebarMenuItem, {
            children: _jsxs(CommandDialogTrigger, {
              render: _jsx(SidebarMenuButton, {
                size: "sm",
                className:
                  "gap-2 px-2 py-1.5 text-muted-foreground/70 hover:bg-accent hover:text-foreground focus-visible:ring-0",
                "data-testid": "command-palette-trigger",
              }),
              children: [
                _jsx(SearchIcon, { className: "size-3.5" }),
                _jsx("span", {
                  className: "flex-1 truncate text-left text-xs",
                  children: "Search",
                }),
                commandPaletteShortcutLabel
                  ? _jsx(Kbd, {
                      className: "h-4 min-w-0 rounded-sm px-1.5 text-[10px]",
                      children: commandPaletteShortcutLabel,
                    })
                  : null,
              ],
            }),
          }),
        }),
      }),
      showArm64IntelBuildWarning && arm64IntelBuildWarningDescription
        ? _jsx(SidebarGroup, {
            className: "px-2 pt-2 pb-0",
            children: _jsxs(Alert, {
              variant: "warning",
              className: "rounded-2xl border-warning/40 bg-warning/8",
              children: [
                _jsx(TriangleAlertIcon, {}),
                _jsx(AlertTitle, { children: "Intel build on Apple Silicon" }),
                _jsx(AlertDescription, { children: arm64IntelBuildWarningDescription }),
                desktopUpdateButtonAction !== "none"
                  ? _jsx(AlertAction, {
                      children: _jsx(Button, {
                        size: "xs",
                        variant: "outline",
                        disabled: desktopUpdateButtonDisabled,
                        onClick: handleDesktopUpdateButtonClick,
                        children:
                          desktopUpdateButtonAction === "download"
                            ? "Download ARM build"
                            : "Install ARM build",
                      }),
                    })
                  : null,
              ],
            }),
          })
        : null,
      _jsxs(SidebarGroup, {
        className: "px-2 py-2",
        children: [
          _jsxs("div", {
            className: "mb-1 flex items-center justify-between pl-2 pr-1.5",
            children: [
              _jsx("span", {
                className:
                  "text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60",
                children: "Projects",
              }),
              _jsxs("div", {
                className: "flex items-center gap-1",
                children: [
                  _jsx(ProjectSortMenu, {
                    projectSortOrder: projectSortOrder,
                    threadSortOrder: threadSortOrder,
                    onProjectSortOrderChange: handleProjectSortOrderChange,
                    onThreadSortOrderChange: handleThreadSortOrderChange,
                  }),
                  _jsxs(Tooltip, {
                    children: [
                      _jsx(TooltipTrigger, {
                        render: _jsx("button", {
                          type: "button",
                          "aria-label": shouldShowProjectPathEntry
                            ? "Cancel add project"
                            : "Add project",
                          "aria-pressed": shouldShowProjectPathEntry,
                          className:
                            "inline-flex size-5 cursor-pointer items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-accent hover:text-foreground",
                          onClick: handleStartAddProject,
                        }),
                        children: _jsx(PlusIcon, {
                          className: `size-3.5 transition-transform duration-150 ${shouldShowProjectPathEntry ? "rotate-45" : "rotate-0"}`,
                        }),
                      }),
                      _jsx(TooltipPopup, {
                        side: "right",
                        children: shouldShowProjectPathEntry ? "Cancel add project" : "Add project",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          shouldShowProjectPathEntry &&
            _jsxs("div", {
              className: "mb-2 px-1",
              children: [
                isElectron &&
                  _jsxs("button", {
                    type: "button",
                    className:
                      "mb-1.5 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-secondary py-1.5 text-xs text-foreground/80 transition-colors duration-150 hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60",
                    onClick: handleBrowseForFolderClick,
                    disabled: isPickingFolder || isAddingProject,
                    children: [
                      _jsx(FolderIcon, { className: "size-3.5" }),
                      isPickingFolder ? "Picking folder..." : "Browse for folder",
                    ],
                  }),
                _jsxs("div", {
                  className: "flex gap-1.5",
                  children: [
                    _jsx("input", {
                      ref: addProjectInputRef,
                      className: `min-w-0 flex-1 rounded-md border bg-secondary px-2 py-1 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none ${
                        addProjectError
                          ? "border-red-500/70 focus:border-red-500"
                          : "border-border focus:border-ring"
                      }`,
                      placeholder: "/path/to/project",
                      value: newCwd,
                      onChange: handleAddProjectInputChange,
                      onKeyDown: handleAddProjectInputKeyDown,
                      autoFocus: true,
                    }),
                    _jsx("button", {
                      type: "button",
                      className:
                        "shrink-0 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90 disabled:opacity-60",
                      onClick: handleAddProject,
                      disabled: !canAddProject,
                      children: isAddingProject ? "Adding..." : "Add",
                    }),
                  ],
                }),
                addProjectError &&
                  _jsx("p", {
                    className: "mt-1 px-0.5 text-[11px] leading-tight text-red-400",
                    children: addProjectError,
                  }),
              ],
            }),
          isManualProjectSorting
            ? _jsx(DndContext, {
                sensors: projectDnDSensors,
                collisionDetection: projectCollisionDetection,
                modifiers: [restrictToVerticalAxis, restrictToFirstScrollableAncestor],
                onDragStart: handleProjectDragStart,
                onDragEnd: handleProjectDragEnd,
                onDragCancel: handleProjectDragCancel,
                children: _jsx(SidebarMenu, {
                  children: _jsx(SortableContext, {
                    items: sortedProjects.map((project) => project.projectKey),
                    strategy: verticalListSortingStrategy,
                    children: sortedProjects.map((project) =>
                      _jsx(
                        SortableProjectItem,
                        {
                          projectId: project.projectKey,
                          children: (dragHandleProps) =>
                            _jsx(SidebarProjectItem, {
                              project: project,
                              isThreadListExpanded: expandedThreadListsByProject.has(
                                project.projectKey,
                              ),
                              activeRouteThreadKey:
                                activeRouteProjectKey === project.projectKey
                                  ? routeThreadKey
                                  : null,
                              newThreadShortcutLabel: newThreadShortcutLabel,
                              handleNewThread: handleNewThread,
                              archiveThread: archiveThread,
                              deleteThread: deleteThread,
                              threadJumpLabelByKey: threadJumpLabelByKey,
                              attachThreadListAutoAnimateRef: attachThreadListAutoAnimateRef,
                              expandThreadListForProject: expandThreadListForProject,
                              collapseThreadListForProject: collapseThreadListForProject,
                              dragInProgressRef: dragInProgressRef,
                              suppressProjectClickAfterDragRef: suppressProjectClickAfterDragRef,
                              suppressProjectClickForContextMenuRef:
                                suppressProjectClickForContextMenuRef,
                              isManualProjectSorting: isManualProjectSorting,
                              dragHandleProps: dragHandleProps,
                            }),
                        },
                        project.projectKey,
                      ),
                    ),
                  }),
                }),
              })
            : _jsx(SidebarMenu, {
                ref: attachProjectListAutoAnimateRef,
                children: sortedProjects.map((project) =>
                  _jsx(
                    SidebarProjectListRow,
                    {
                      project: project,
                      isThreadListExpanded: expandedThreadListsByProject.has(project.projectKey),
                      activeRouteThreadKey:
                        activeRouteProjectKey === project.projectKey ? routeThreadKey : null,
                      newThreadShortcutLabel: newThreadShortcutLabel,
                      handleNewThread: handleNewThread,
                      archiveThread: archiveThread,
                      deleteThread: deleteThread,
                      threadJumpLabelByKey: threadJumpLabelByKey,
                      attachThreadListAutoAnimateRef: attachThreadListAutoAnimateRef,
                      expandThreadListForProject: expandThreadListForProject,
                      collapseThreadListForProject: collapseThreadListForProject,
                      dragInProgressRef: dragInProgressRef,
                      suppressProjectClickAfterDragRef: suppressProjectClickAfterDragRef,
                      suppressProjectClickForContextMenuRef: suppressProjectClickForContextMenuRef,
                      isManualProjectSorting: isManualProjectSorting,
                      dragHandleProps: null,
                    },
                    project.projectKey,
                  ),
                ),
              }),
          projectsLength === 0 &&
            !shouldShowProjectPathEntry &&
            _jsx("div", {
              className: "px-2 pt-4 text-center text-xs text-muted-foreground/60",
              children: "No projects yet",
            }),
        ],
      }),
    ],
  });
});
export default function Sidebar() {
  const projects = useStore(useShallow(selectProjectsAcrossEnvironments));
  const sidebarThreads = useStore(useShallow(selectSidebarThreadsAcrossEnvironments));
  const activeEnvironmentId = useStore((store) => store.activeEnvironmentId);
  const projectExpandedById = useUiStateStore((store) => store.projectExpandedById);
  const projectOrder = useUiStateStore((store) => store.projectOrder);
  const reorderProjects = useUiStateStore((store) => store.reorderProjects);
  const navigate = useNavigate();
  const pathname = useLocation({ select: (loc) => loc.pathname });
  const isOnSettings = pathname.startsWith("/settings");
  const sidebarThreadSortOrder = useSettings((s) => s.sidebarThreadSortOrder);
  const sidebarProjectSortOrder = useSettings((s) => s.sidebarProjectSortOrder);
  const defaultThreadEnvMode = useSettings((s) => s.defaultThreadEnvMode);
  const { updateSettings } = useUpdateSettings();
  const { handleNewThread } = useNewThreadHandler();
  const { archiveThread, deleteThread } = useThreadActions();
  const routeThreadRef = useParams({
    strict: false,
    select: (params) => resolveThreadRouteRef(params),
  });
  const routeThreadKey = routeThreadRef ? scopedThreadKey(routeThreadRef) : null;
  const keybindings = useServerKeybindings();
  const [addingProject, setAddingProject] = useState(false);
  const [newCwd, setNewCwd] = useState("");
  const [isPickingFolder, setIsPickingFolder] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [addProjectError, setAddProjectError] = useState(null);
  const addProjectInputRef = useRef(null);
  const [expandedThreadListsByProject, setExpandedThreadListsByProject] = useState(() => new Set());
  const { showThreadJumpHints, updateThreadJumpHintsVisibility } = useThreadJumpHintVisibility();
  const dragInProgressRef = useRef(false);
  const suppressProjectClickAfterDragRef = useRef(false);
  const suppressProjectClickForContextMenuRef = useRef(false);
  const [desktopUpdateState, setDesktopUpdateState] = useState(null);
  const selectedThreadCount = useThreadSelectionStore((s) => s.selectedThreadKeys.size);
  const clearSelection = useThreadSelectionStore((s) => s.clearSelection);
  const setSelectionAnchor = useThreadSelectionStore((s) => s.setAnchor);
  const isLinuxDesktop = isElectron && isLinuxPlatform(navigator.platform);
  const platform = navigator.platform;
  const shouldBrowseForProjectImmediately = isElectron && !isLinuxDesktop;
  const shouldShowProjectPathEntry = addingProject && !shouldBrowseForProjectImmediately;
  const primaryEnvironmentId = usePrimaryEnvironmentId();
  const savedEnvironmentRegistry = useSavedEnvironmentRegistryStore((s) => s.byId);
  const savedEnvironmentRuntimeById = useSavedEnvironmentRuntimeStore((s) => s.byId);
  const orderedProjects = useMemo(() => {
    return orderItemsByPreferredIds({
      items: projects,
      preferredIds: projectOrder,
      getId: (project) => scopedProjectKey(scopeProjectRef(project.environmentId, project.id)),
    });
  }, [projectOrder, projects]);
  // Build a mapping from physical project key → logical project key for
  // cross-environment grouping.  Projects that share a repositoryIdentity
  // canonicalKey are treated as one logical project in the sidebar.
  const physicalToLogicalKey = useMemo(() => {
    const mapping = new Map();
    for (const project of orderedProjects) {
      const physicalKey = scopedProjectKey(scopeProjectRef(project.environmentId, project.id));
      mapping.set(physicalKey, deriveLogicalProjectKey(project));
    }
    return mapping;
  }, [orderedProjects]);
  const sidebarProjects = useMemo(() => {
    // Group projects by logical key while preserving insertion order from
    // orderedProjects.
    const groupedMembers = new Map();
    for (const project of orderedProjects) {
      const logicalKey = deriveLogicalProjectKey(project);
      const existing = groupedMembers.get(logicalKey);
      if (existing) {
        existing.push(project);
      } else {
        groupedMembers.set(logicalKey, [project]);
      }
    }
    const result = [];
    const seen = new Set();
    for (const project of orderedProjects) {
      const logicalKey = deriveLogicalProjectKey(project);
      if (seen.has(logicalKey)) continue;
      seen.add(logicalKey);
      const members = groupedMembers.get(logicalKey);
      // Prefer the primary environment's project as the representative.
      const representative =
        (primaryEnvironmentId
          ? members.find((p) => p.environmentId === primaryEnvironmentId)
          : undefined) ?? members[0];
      if (!representative) continue;
      const hasLocal =
        primaryEnvironmentId !== null &&
        members.some((p) => p.environmentId === primaryEnvironmentId);
      const hasRemote =
        primaryEnvironmentId !== null
          ? members.some((p) => p.environmentId !== primaryEnvironmentId)
          : false;
      const refs = members.map((p) => scopeProjectRef(p.environmentId, p.id));
      const remoteLabels = members
        .filter((p) => primaryEnvironmentId !== null && p.environmentId !== primaryEnvironmentId)
        .map((p) => {
          const rt = savedEnvironmentRuntimeById[p.environmentId];
          const saved = savedEnvironmentRegistry[p.environmentId];
          return rt?.descriptor?.label ?? saved?.label ?? p.environmentId;
        });
      const snapshot = {
        id: representative.id,
        environmentId: representative.environmentId,
        name: representative.name,
        cwd: representative.cwd,
        repositoryIdentity: representative.repositoryIdentity ?? null,
        defaultModelSelection: representative.defaultModelSelection,
        createdAt: representative.createdAt,
        updatedAt: representative.updatedAt,
        scripts: representative.scripts,
        projectKey: logicalKey,
        environmentPresence:
          hasLocal && hasRemote ? "mixed" : hasRemote ? "remote-only" : "local-only",
        memberProjectRefs: refs,
        remoteEnvironmentLabels: remoteLabels,
      };
      result.push(snapshot);
    }
    return result;
  }, [
    orderedProjects,
    primaryEnvironmentId,
    savedEnvironmentRegistry,
    savedEnvironmentRuntimeById,
  ]);
  const sidebarProjectByKey = useMemo(
    () => new Map(sidebarProjects.map((project) => [project.projectKey, project])),
    [sidebarProjects],
  );
  const sidebarThreadByKey = useMemo(
    () =>
      new Map(
        sidebarThreads.map((thread) => [
          scopedThreadKey(scopeThreadRef(thread.environmentId, thread.id)),
          thread,
        ]),
      ),
    [sidebarThreads],
  );
  // Resolve the active route's project key to a logical key so it matches the
  // sidebar's grouped project entries.
  const activeRouteProjectKey = useMemo(() => {
    if (!routeThreadKey) {
      return null;
    }
    const activeThread = sidebarThreadByKey.get(routeThreadKey);
    if (!activeThread) return null;
    const physicalKey = scopedProjectKey(
      scopeProjectRef(activeThread.environmentId, activeThread.projectId),
    );
    return physicalToLogicalKey.get(physicalKey) ?? physicalKey;
  }, [routeThreadKey, sidebarThreadByKey, physicalToLogicalKey]);
  // Group threads by logical project key so all threads from grouped projects
  // are displayed together.
  const threadsByProjectKey = useMemo(() => {
    const next = new Map();
    for (const thread of sidebarThreads) {
      const physicalKey = scopedProjectKey(scopeProjectRef(thread.environmentId, thread.projectId));
      const logicalKey = physicalToLogicalKey.get(physicalKey) ?? physicalKey;
      const existing = next.get(logicalKey);
      if (existing) {
        existing.push(thread);
      } else {
        next.set(logicalKey, [thread]);
      }
    }
    return next;
  }, [sidebarThreads, physicalToLogicalKey]);
  const getCurrentSidebarShortcutContext = useCallback(
    () => ({
      terminalFocus: isTerminalFocused(),
      terminalOpen: routeThreadRef
        ? selectThreadTerminalState(
            useTerminalStateStore.getState().terminalStateByThreadKey,
            routeThreadRef,
          ).terminalOpen
        : false,
    }),
    [routeThreadRef],
  );
  const newThreadShortcutLabelOptions = useMemo(
    () => ({
      platform,
      context: {
        terminalFocus: false,
        terminalOpen: false,
      },
    }),
    [platform],
  );
  const newThreadShortcutLabel =
    shortcutLabelForCommand(keybindings, "chat.newLocal", newThreadShortcutLabelOptions) ??
    shortcutLabelForCommand(keybindings, "chat.new", newThreadShortcutLabelOptions);
  const focusMostRecentThreadForProject = useCallback(
    (projectRef) => {
      const physicalKey = scopedProjectKey(
        scopeProjectRef(projectRef.environmentId, projectRef.projectId),
      );
      const logicalKey = physicalToLogicalKey.get(physicalKey) ?? physicalKey;
      const latestThread = sortThreads(
        (threadsByProjectKey.get(logicalKey) ?? []).filter((thread) => thread.archivedAt === null),
        sidebarThreadSortOrder,
      )[0];
      if (!latestThread) return;
      void navigate({
        to: "/$environmentId/$threadId",
        params: buildThreadRouteParams(scopeThreadRef(latestThread.environmentId, latestThread.id)),
      });
    },
    [sidebarThreadSortOrder, navigate, threadsByProjectKey, physicalToLogicalKey],
  );
  const addProjectFromInput = useCallback(
    async (rawCwd) => {
      const cwd = rawCwd.trim();
      if (!cwd || isAddingProject) return;
      const api = activeEnvironmentId ? readEnvironmentApi(activeEnvironmentId) : undefined;
      if (!api) return;
      setIsAddingProject(true);
      const finishAddingProject = () => {
        setIsAddingProject(false);
        setNewCwd("");
        setAddProjectError(null);
        setAddingProject(false);
      };
      const existing = projects.find((project) => project.cwd === cwd);
      if (existing) {
        focusMostRecentThreadForProject({
          environmentId: existing.environmentId,
          projectId: existing.id,
        });
        finishAddingProject();
        return;
      }
      const projectId = newProjectId();
      const title = cwd.split(/[/\\]/).findLast(isNonEmptyString) ?? cwd;
      try {
        await api.orchestration.dispatchCommand({
          type: "project.create",
          commandId: newCommandId(),
          projectId,
          title,
          workspaceRoot: cwd,
          defaultModelSelection: {
            provider: "codex",
            model: DEFAULT_MODEL_BY_PROVIDER.codex,
          },
          createdAt: new Date().toISOString(),
        });
        if (activeEnvironmentId !== null) {
          await handleNewThread(scopeProjectRef(activeEnvironmentId, projectId), {
            envMode: defaultThreadEnvMode,
          }).catch(() => undefined);
        }
      } catch (error) {
        const description =
          error instanceof Error ? error.message : "An error occurred while adding the project.";
        setIsAddingProject(false);
        if (shouldBrowseForProjectImmediately) {
          toastManager.add({
            type: "error",
            title: "Failed to add project",
            description,
          });
        } else {
          setAddProjectError(description);
        }
        return;
      }
      finishAddingProject();
    },
    [
      focusMostRecentThreadForProject,
      activeEnvironmentId,
      handleNewThread,
      isAddingProject,
      projects,
      shouldBrowseForProjectImmediately,
      defaultThreadEnvMode,
    ],
  );
  const handleAddProject = () => {
    void addProjectFromInput(newCwd);
  };
  const canAddProject = newCwd.trim().length > 0 && !isAddingProject;
  const handlePickFolder = async () => {
    const api = readLocalApi();
    if (!api || isPickingFolder) return;
    setIsPickingFolder(true);
    let pickedPath = null;
    try {
      pickedPath = await api.dialogs.pickFolder();
    } catch {
      // Ignore picker failures and leave the current thread selection unchanged.
    }
    if (pickedPath) {
      await addProjectFromInput(pickedPath);
    } else if (!shouldBrowseForProjectImmediately) {
      addProjectInputRef.current?.focus();
    }
    setIsPickingFolder(false);
  };
  const handleStartAddProject = () => {
    setAddProjectError(null);
    if (shouldBrowseForProjectImmediately) {
      void handlePickFolder();
      return;
    }
    setAddingProject((prev) => !prev);
  };
  const navigateToThread = useCallback(
    (threadRef) => {
      if (useThreadSelectionStore.getState().selectedThreadKeys.size > 0) {
        clearSelection();
      }
      setSelectionAnchor(scopedThreadKey(threadRef));
      void navigate({
        to: "/$environmentId/$threadId",
        params: buildThreadRouteParams(threadRef),
      });
    },
    [clearSelection, navigate, setSelectionAnchor],
  );
  const projectDnDSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );
  const projectCollisionDetection = useCallback((args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }
    return closestCorners(args);
  }, []);
  const handleProjectDragEnd = useCallback(
    (event) => {
      if (sidebarProjectSortOrder !== "manual") {
        dragInProgressRef.current = false;
        return;
      }
      dragInProgressRef.current = false;
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const activeProject = sidebarProjects.find((project) => project.projectKey === active.id);
      const overProject = sidebarProjects.find((project) => project.projectKey === over.id);
      if (!activeProject || !overProject) return;
      const activeMemberKeys = activeProject.memberProjectRefs.map(scopedProjectKey);
      const overMemberKeys = overProject.memberProjectRefs.map(scopedProjectKey);
      reorderProjects(activeMemberKeys, overMemberKeys);
    },
    [sidebarProjectSortOrder, reorderProjects, sidebarProjects],
  );
  const handleProjectDragStart = useCallback(
    (_event) => {
      if (sidebarProjectSortOrder !== "manual") {
        return;
      }
      dragInProgressRef.current = true;
      suppressProjectClickAfterDragRef.current = true;
    },
    [sidebarProjectSortOrder],
  );
  const handleProjectDragCancel = useCallback((_event) => {
    dragInProgressRef.current = false;
  }, []);
  const animatedProjectListsRef = useRef(new WeakSet());
  const attachProjectListAutoAnimateRef = useCallback((node) => {
    if (!node || animatedProjectListsRef.current.has(node)) {
      return;
    }
    autoAnimate(node, SIDEBAR_LIST_ANIMATION_OPTIONS);
    animatedProjectListsRef.current.add(node);
  }, []);
  const animatedThreadListsRef = useRef(new WeakSet());
  const attachThreadListAutoAnimateRef = useCallback((node) => {
    if (!node || animatedThreadListsRef.current.has(node)) {
      return;
    }
    autoAnimate(node, SIDEBAR_LIST_ANIMATION_OPTIONS);
    animatedThreadListsRef.current.add(node);
  }, []);
  const visibleThreads = useMemo(
    () => sidebarThreads.filter((thread) => thread.archivedAt === null),
    [sidebarThreads],
  );
  const sortedProjects = useMemo(() => {
    const sortableProjects = sidebarProjects.map((project) => ({
      ...project,
      id: project.projectKey,
    }));
    const sortableThreads = visibleThreads.map((thread) => {
      const physicalKey = scopedProjectKey(scopeProjectRef(thread.environmentId, thread.projectId));
      return {
        ...thread,
        projectId: physicalToLogicalKey.get(physicalKey) ?? physicalKey,
      };
    });
    return sortProjectsForSidebar(
      sortableProjects,
      sortableThreads,
      sidebarProjectSortOrder,
    ).flatMap((project) => {
      const resolvedProject = sidebarProjectByKey.get(project.id);
      return resolvedProject ? [resolvedProject] : [];
    });
  }, [
    sidebarProjectSortOrder,
    physicalToLogicalKey,
    sidebarProjectByKey,
    sidebarProjects,
    visibleThreads,
  ]);
  const isManualProjectSorting = sidebarProjectSortOrder === "manual";
  const visibleSidebarThreadKeys = useMemo(
    () =>
      sortedProjects.flatMap((project) => {
        const projectThreads = sortThreads(
          (threadsByProjectKey.get(project.projectKey) ?? []).filter(
            (thread) => thread.archivedAt === null,
          ),
          sidebarThreadSortOrder,
        );
        const projectExpanded = projectExpandedById[project.projectKey] ?? true;
        const activeThreadKey = routeThreadKey ?? undefined;
        const pinnedCollapsedThread =
          !projectExpanded && activeThreadKey
            ? (projectThreads.find(
                (thread) =>
                  scopedThreadKey(scopeThreadRef(thread.environmentId, thread.id)) ===
                  activeThreadKey,
              ) ?? null)
            : null;
        const shouldShowThreadPanel = projectExpanded || pinnedCollapsedThread !== null;
        if (!shouldShowThreadPanel) {
          return [];
        }
        const isThreadListExpanded = expandedThreadListsByProject.has(project.projectKey);
        const hasOverflowingThreads = projectThreads.length > THREAD_PREVIEW_LIMIT;
        const previewThreads =
          isThreadListExpanded || !hasOverflowingThreads
            ? projectThreads
            : projectThreads.slice(0, THREAD_PREVIEW_LIMIT);
        const renderedThreads = pinnedCollapsedThread ? [pinnedCollapsedThread] : previewThreads;
        return renderedThreads.map((thread) =>
          scopedThreadKey(scopeThreadRef(thread.environmentId, thread.id)),
        );
      }),
    [
      sidebarThreadSortOrder,
      expandedThreadListsByProject,
      projectExpandedById,
      routeThreadKey,
      sortedProjects,
      threadsByProjectKey,
    ],
  );
  const threadJumpCommandByKey = useMemo(() => {
    const mapping = new Map();
    for (const [visibleThreadIndex, threadKey] of visibleSidebarThreadKeys.entries()) {
      const jumpCommand = threadJumpCommandForIndex(visibleThreadIndex);
      if (!jumpCommand) {
        return mapping;
      }
      mapping.set(threadKey, jumpCommand);
    }
    return mapping;
  }, [visibleSidebarThreadKeys]);
  const threadJumpThreadKeys = useMemo(
    () => [...threadJumpCommandByKey.keys()],
    [threadJumpCommandByKey],
  );
  const [threadJumpLabelByKey, setThreadJumpLabelByKey] = useState(EMPTY_THREAD_JUMP_LABELS);
  const threadJumpLabelsRef = useRef(EMPTY_THREAD_JUMP_LABELS);
  threadJumpLabelsRef.current = threadJumpLabelByKey;
  const showThreadJumpHintsRef = useRef(showThreadJumpHints);
  showThreadJumpHintsRef.current = showThreadJumpHints;
  const visibleThreadJumpLabelByKey = showThreadJumpHints
    ? threadJumpLabelByKey
    : EMPTY_THREAD_JUMP_LABELS;
  const orderedSidebarThreadKeys = visibleSidebarThreadKeys;
  useEffect(() => {
    const clearThreadJumpHints = () => {
      setThreadJumpLabelByKey((current) =>
        current === EMPTY_THREAD_JUMP_LABELS ? current : EMPTY_THREAD_JUMP_LABELS,
      );
      updateThreadJumpHintsVisibility(false);
    };
    const shouldIgnoreThreadJumpHintUpdate = (event) =>
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.shiftKey &&
      event.key !== "Meta" &&
      event.key !== "Control" &&
      event.key !== "Alt" &&
      event.key !== "Shift" &&
      !showThreadJumpHintsRef.current &&
      threadJumpLabelsRef.current === EMPTY_THREAD_JUMP_LABELS;
    const onWindowKeyDown = (event) => {
      if (shouldIgnoreThreadJumpHintUpdate(event)) {
        return;
      }
      const shortcutContext = getCurrentSidebarShortcutContext();
      const shouldShowHints = shouldShowThreadJumpHints(event, keybindings, {
        platform,
        context: shortcutContext,
      });
      if (!shouldShowHints) {
        if (
          showThreadJumpHintsRef.current ||
          threadJumpLabelsRef.current !== EMPTY_THREAD_JUMP_LABELS
        ) {
          clearThreadJumpHints();
        }
      } else {
        setThreadJumpLabelByKey((current) => {
          const nextLabelMap = buildThreadJumpLabelMap({
            keybindings,
            platform,
            terminalOpen: shortcutContext.terminalOpen,
            threadJumpCommandByKey,
          });
          return threadJumpLabelMapsEqual(current, nextLabelMap) ? current : nextLabelMap;
        });
        updateThreadJumpHintsVisibility(true);
      }
      if (event.defaultPrevented || event.repeat) {
        return;
      }
      const command = resolveShortcutCommand(event, keybindings, {
        platform,
        context: shortcutContext,
      });
      const traversalDirection = threadTraversalDirectionFromCommand(command);
      if (traversalDirection !== null) {
        const targetThreadKey = resolveAdjacentThreadId({
          threadIds: orderedSidebarThreadKeys,
          currentThreadId: routeThreadKey,
          direction: traversalDirection,
        });
        if (!targetThreadKey) {
          return;
        }
        const targetThread = sidebarThreadByKey.get(targetThreadKey);
        if (!targetThread) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        navigateToThread(scopeThreadRef(targetThread.environmentId, targetThread.id));
        return;
      }
      const jumpIndex = threadJumpIndexFromCommand(command ?? "");
      if (jumpIndex === null) {
        return;
      }
      const targetThreadKey = threadJumpThreadKeys[jumpIndex];
      if (!targetThreadKey) {
        return;
      }
      const targetThread = sidebarThreadByKey.get(targetThreadKey);
      if (!targetThread) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      navigateToThread(scopeThreadRef(targetThread.environmentId, targetThread.id));
    };
    const onWindowKeyUp = (event) => {
      if (shouldIgnoreThreadJumpHintUpdate(event)) {
        return;
      }
      const shortcutContext = getCurrentSidebarShortcutContext();
      const shouldShowHints = shouldShowThreadJumpHints(event, keybindings, {
        platform,
        context: shortcutContext,
      });
      if (!shouldShowHints) {
        clearThreadJumpHints();
        return;
      }
      setThreadJumpLabelByKey((current) => {
        const nextLabelMap = buildThreadJumpLabelMap({
          keybindings,
          platform,
          terminalOpen: shortcutContext.terminalOpen,
          threadJumpCommandByKey,
        });
        return threadJumpLabelMapsEqual(current, nextLabelMap) ? current : nextLabelMap;
      });
      updateThreadJumpHintsVisibility(true);
    };
    const onWindowBlur = () => {
      clearThreadJumpHints();
    };
    window.addEventListener("keydown", onWindowKeyDown);
    window.addEventListener("keyup", onWindowKeyUp);
    window.addEventListener("blur", onWindowBlur);
    return () => {
      window.removeEventListener("keydown", onWindowKeyDown);
      window.removeEventListener("keyup", onWindowKeyUp);
      window.removeEventListener("blur", onWindowBlur);
    };
  }, [
    getCurrentSidebarShortcutContext,
    keybindings,
    navigateToThread,
    orderedSidebarThreadKeys,
    platform,
    routeThreadKey,
    sidebarThreadByKey,
    threadJumpCommandByKey,
    threadJumpThreadKeys,
    updateThreadJumpHintsVisibility,
  ]);
  useEffect(() => {
    const onMouseDown = (event) => {
      if (selectedThreadCount === 0) return;
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (!shouldClearThreadSelectionOnMouseDown(target)) return;
      clearSelection();
    };
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [clearSelection, selectedThreadCount]);
  useEffect(() => {
    if (!isElectron) return;
    const bridge = window.desktopBridge;
    if (
      !bridge ||
      typeof bridge.getUpdateState !== "function" ||
      typeof bridge.onUpdateState !== "function"
    ) {
      return;
    }
    let disposed = false;
    let receivedSubscriptionUpdate = false;
    const unsubscribe = bridge.onUpdateState((nextState) => {
      if (disposed) return;
      receivedSubscriptionUpdate = true;
      setDesktopUpdateState(nextState);
    });
    void bridge
      .getUpdateState()
      .then((nextState) => {
        if (disposed || receivedSubscriptionUpdate) return;
        setDesktopUpdateState(nextState);
      })
      .catch(() => undefined);
    return () => {
      disposed = true;
      unsubscribe();
    };
  }, []);
  const desktopUpdateButtonDisabled = isDesktopUpdateButtonDisabled(desktopUpdateState);
  const desktopUpdateButtonAction = desktopUpdateState
    ? resolveDesktopUpdateButtonAction(desktopUpdateState)
    : "none";
  const showArm64IntelBuildWarning =
    isElectron && shouldShowArm64IntelBuildWarning(desktopUpdateState);
  const arm64IntelBuildWarningDescription =
    desktopUpdateState && showArm64IntelBuildWarning
      ? getArm64IntelBuildWarningDescription(desktopUpdateState)
      : null;
  const commandPaletteShortcutLabel = shortcutLabelForCommand(
    keybindings,
    "commandPalette.toggle",
    newThreadShortcutLabelOptions,
  );
  const handleDesktopUpdateButtonClick = useCallback(() => {
    const bridge = window.desktopBridge;
    if (!bridge || !desktopUpdateState) return;
    if (desktopUpdateButtonDisabled || desktopUpdateButtonAction === "none") return;
    if (desktopUpdateButtonAction === "download") {
      void bridge
        .downloadUpdate()
        .then((result) => {
          if (result.completed) {
            toastManager.add({
              type: "success",
              title: "Update downloaded",
              description: "Restart the app from the update button to install it.",
            });
          }
          if (!shouldToastDesktopUpdateActionResult(result)) return;
          const actionError = getDesktopUpdateActionError(result);
          if (!actionError) return;
          toastManager.add({
            type: "error",
            title: "Could not download update",
            description: actionError,
          });
        })
        .catch((error) => {
          toastManager.add({
            type: "error",
            title: "Could not start update download",
            description: error instanceof Error ? error.message : "An unexpected error occurred.",
          });
        });
      return;
    }
    if (desktopUpdateButtonAction === "install") {
      const confirmed = window.confirm(
        getDesktopUpdateInstallConfirmationMessage(desktopUpdateState),
      );
      if (!confirmed) return;
      void bridge
        .installUpdate()
        .then((result) => {
          if (!shouldToastDesktopUpdateActionResult(result)) return;
          const actionError = getDesktopUpdateActionError(result);
          if (!actionError) return;
          toastManager.add({
            type: "error",
            title: "Could not install update",
            description: actionError,
          });
        })
        .catch((error) => {
          toastManager.add({
            type: "error",
            title: "Could not install update",
            description: error instanceof Error ? error.message : "An unexpected error occurred.",
          });
        });
    }
  }, [desktopUpdateButtonAction, desktopUpdateButtonDisabled, desktopUpdateState]);
  const expandThreadListForProject = useCallback((projectKey) => {
    setExpandedThreadListsByProject((current) => {
      if (current.has(projectKey)) return current;
      const next = new Set(current);
      next.add(projectKey);
      return next;
    });
  }, []);
  const collapseThreadListForProject = useCallback((projectKey) => {
    setExpandedThreadListsByProject((current) => {
      if (!current.has(projectKey)) return current;
      const next = new Set(current);
      next.delete(projectKey);
      return next;
    });
  }, []);
  return _jsxs(_Fragment, {
    children: [
      _jsx(SidebarChromeHeader, { isElectron: isElectron }),
      isOnSettings
        ? _jsx(SettingsSidebarNav, { pathname: pathname })
        : _jsxs(_Fragment, {
            children: [
              _jsx(SidebarProjectsContent, {
                showArm64IntelBuildWarning: showArm64IntelBuildWarning,
                arm64IntelBuildWarningDescription: arm64IntelBuildWarningDescription,
                desktopUpdateButtonAction: desktopUpdateButtonAction,
                desktopUpdateButtonDisabled: desktopUpdateButtonDisabled,
                handleDesktopUpdateButtonClick: handleDesktopUpdateButtonClick,
                projectSortOrder: sidebarProjectSortOrder,
                threadSortOrder: sidebarThreadSortOrder,
                updateSettings: updateSettings,
                shouldShowProjectPathEntry: shouldShowProjectPathEntry,
                handleStartAddProject: handleStartAddProject,
                isElectron: isElectron,
                isPickingFolder: isPickingFolder,
                isAddingProject: isAddingProject,
                handlePickFolder: handlePickFolder,
                addProjectInputRef: addProjectInputRef,
                addProjectError: addProjectError,
                newCwd: newCwd,
                setNewCwd: setNewCwd,
                setAddProjectError: setAddProjectError,
                handleAddProject: handleAddProject,
                setAddingProject: setAddingProject,
                canAddProject: canAddProject,
                isManualProjectSorting: isManualProjectSorting,
                projectDnDSensors: projectDnDSensors,
                projectCollisionDetection: projectCollisionDetection,
                handleProjectDragStart: handleProjectDragStart,
                handleProjectDragEnd: handleProjectDragEnd,
                handleProjectDragCancel: handleProjectDragCancel,
                handleNewThread: handleNewThread,
                archiveThread: archiveThread,
                deleteThread: deleteThread,
                sortedProjects: sortedProjects,
                expandedThreadListsByProject: expandedThreadListsByProject,
                activeRouteProjectKey: activeRouteProjectKey,
                routeThreadKey: routeThreadKey,
                newThreadShortcutLabel: newThreadShortcutLabel,
                commandPaletteShortcutLabel: commandPaletteShortcutLabel,
                threadJumpLabelByKey: visibleThreadJumpLabelByKey,
                attachThreadListAutoAnimateRef: attachThreadListAutoAnimateRef,
                expandThreadListForProject: expandThreadListForProject,
                collapseThreadListForProject: collapseThreadListForProject,
                dragInProgressRef: dragInProgressRef,
                suppressProjectClickAfterDragRef: suppressProjectClickAfterDragRef,
                suppressProjectClickForContextMenuRef: suppressProjectClickForContextMenuRef,
                attachProjectListAutoAnimateRef: attachProjectListAutoAnimateRef,
                projectsLength: projects.length,
              }),
              _jsx(SidebarSeparator, {}),
              _jsx(SidebarChromeFooter, {}),
            ],
          }),
    ],
  });
}
