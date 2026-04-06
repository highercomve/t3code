import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import {
  ArchiveIcon,
  ArrowUpDownIcon,
  ChevronRightIcon,
  FolderIcon,
  GitPullRequestIcon,
  PlusIcon,
  SettingsIcon,
  SquarePenIcon,
  TerminalIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { ProjectFavicon } from "./ProjectFavicon";
import { autoAnimate } from "@formkit/auto-animate";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { DEFAULT_MODEL_BY_PROVIDER, ThreadId } from "@t3tools/contracts";
import { useQueries } from "@tanstack/react-query";
import { Link, useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { isElectron } from "../env";
import { APP_STAGE_LABEL, APP_VERSION } from "../branding";
import { isTerminalFocused } from "../lib/terminalFocus";
import { isLinuxPlatform, isMacPlatform, newCommandId, newProjectId } from "../lib/utils";
import { useStore } from "../store";
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
import { gitStatusQueryOptions } from "../lib/gitReactQuery";
import { readNativeApi } from "../nativeApi";
import { useComposerDraftStore } from "../composerDraftStore";
import { useHandleNewThread } from "../hooks/useHandleNewThread";
import { useThreadActions } from "../hooks/useThreadActions";
import { toastManager } from "./ui/toast";
import { formatRelativeTimeLabel } from "../timestampFormat";
import { SettingsSidebarNav } from "./settings/SettingsSidebarNav";
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
  SidebarMenuAction,
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
  getVisibleSidebarThreadIds,
  getVisibleThreadsForProject,
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
  sortThreadsForSidebar,
  useThreadJumpHintVisibility,
} from "./Sidebar.logic";
import { SidebarUpdatePill } from "./sidebar/SidebarUpdatePill";
import { useCopyToClipboard } from "~/hooks/useCopyToClipboard";
import { useSettings, useUpdateSettings } from "~/hooks/useSettings";
import { useServerKeybindings } from "../rpc/serverState";
import { useSidebarThreadSummaryById } from "../storeSelectors";
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
function SidebarThreadRow(props) {
  const thread = useSidebarThreadSummaryById(props.threadId);
  const lastVisitedAt = useUiStateStore((state) => state.threadLastVisitedAtById[props.threadId]);
  const runningTerminalIds = useTerminalStateStore(
    (state) =>
      selectThreadTerminalState(state.terminalStateByThreadId, props.threadId).runningTerminalIds,
  );
  if (!thread) {
    return null;
  }
  const isActive = props.routeThreadId === thread.id;
  const isSelected = props.selectedThreadIds.has(thread.id);
  const isHighlighted = isActive || isSelected;
  const isThreadRunning =
    thread.session?.status === "running" && thread.session.activeTurnId != null;
  const threadStatus = resolveThreadStatusPill({
    thread: {
      ...thread,
      lastVisitedAt,
    },
  });
  const prStatus = prStatusIndicator(props.pr);
  const terminalStatus = terminalStatusFromRunningIds(runningTerminalIds);
  const isConfirmingArchive = props.confirmingArchiveThreadId === thread.id && !isThreadRunning;
  const threadMetaClassName = isConfirmingArchive
    ? "pointer-events-none opacity-0"
    : !isThreadRunning
      ? "pointer-events-none transition-opacity duration-150 group-hover/menu-sub-item:opacity-0 group-focus-within/menu-sub-item:opacity-0"
      : "pointer-events-none";
  return _jsx(SidebarMenuSubItem, {
    className: "w-full",
    "data-thread-item": true,
    onMouseLeave: () => {
      props.setConfirmingArchiveThreadId((current) => (current === thread.id ? null : current));
    },
    onBlurCapture: (event) => {
      const currentTarget = event.currentTarget;
      requestAnimationFrame(() => {
        if (currentTarget.contains(document.activeElement)) {
          return;
        }
        props.setConfirmingArchiveThreadId((current) => (current === thread.id ? null : current));
      });
    },
    children: _jsxs(SidebarMenuSubButton, {
      render: _jsx("div", { role: "button", tabIndex: 0 }),
      size: "sm",
      isActive: isActive,
      "data-testid": `thread-row-${thread.id}`,
      className: `${resolveThreadRowClassName({
        isActive,
        isSelected,
      })} relative isolate`,
      onClick: (event) => {
        props.handleThreadClick(event, thread.id, props.orderedProjectThreadIds);
      },
      onKeyDown: (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        props.navigateToThread(thread.id);
      },
      onContextMenu: (event) => {
        event.preventDefault();
        if (props.selectedThreadIds.size > 0 && props.selectedThreadIds.has(thread.id)) {
          void props.handleMultiSelectContextMenu({
            x: event.clientX,
            y: event.clientY,
          });
        } else {
          if (props.selectedThreadIds.size > 0) {
            props.clearSelection();
          }
          void props.handleThreadContextMenu(thread.id, {
            x: event.clientX,
            y: event.clientY,
          });
        }
      },
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
                      onClick: (event) => {
                        props.openPrLink(event, prStatus.url);
                      },
                      children: _jsx(GitPullRequestIcon, { className: "size-3" }),
                    }),
                  }),
                  _jsx(TooltipPopup, { side: "top", children: prStatus.tooltip }),
                ],
              }),
            threadStatus && _jsx(ThreadStatusLabel, { status: threadStatus }),
            props.renamingThreadId === thread.id
              ? _jsx("input", {
                  ref: (element) => {
                    if (element && props.renamingInputRef.current !== element) {
                      props.renamingInputRef.current = element;
                      element.focus();
                      element.select();
                    }
                  },
                  className:
                    "min-w-0 flex-1 truncate text-xs bg-transparent outline-none border border-ring rounded px-0.5",
                  value: props.renamingTitle,
                  onChange: (event) => props.setRenamingTitle(event.target.value),
                  onKeyDown: (event) => {
                    event.stopPropagation();
                    if (event.key === "Enter") {
                      event.preventDefault();
                      props.renamingCommittedRef.current = true;
                      void props.commitRename(thread.id, props.renamingTitle, thread.title);
                    } else if (event.key === "Escape") {
                      event.preventDefault();
                      props.renamingCommittedRef.current = true;
                      props.cancelRename();
                    }
                  },
                  onBlur: () => {
                    if (!props.renamingCommittedRef.current) {
                      void props.commitRename(thread.id, props.renamingTitle, thread.title);
                    }
                  },
                  onClick: (event) => event.stopPropagation(),
                })
              : _jsx("span", {
                  className: "min-w-0 flex-1 truncate text-xs",
                  children: thread.title,
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
                      ref: (element) => {
                        if (element) {
                          props.confirmArchiveButtonRefs.current.set(thread.id, element);
                        } else {
                          props.confirmArchiveButtonRefs.current.delete(thread.id);
                        }
                      },
                      type: "button",
                      "data-thread-selection-safe": true,
                      "data-testid": `thread-archive-confirm-${thread.id}`,
                      "aria-label": `Confirm archive ${thread.title}`,
                      className:
                        "absolute top-1/2 right-1 inline-flex h-5 -translate-y-1/2 cursor-pointer items-center rounded-full bg-destructive/12 px-2 text-[10px] font-medium text-destructive transition-colors hover:bg-destructive/18 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-destructive/40",
                      onPointerDown: (event) => {
                        event.stopPropagation();
                      },
                      onClick: (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        props.setConfirmingArchiveThreadId((current) =>
                          current === thread.id ? null : current,
                        );
                        void props.attemptArchiveThread(thread.id);
                      },
                      children: "Confirm",
                    })
                  : !isThreadRunning
                    ? props.appSettingsConfirmThreadArchive
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
                            onPointerDown: (event) => {
                              event.stopPropagation();
                            },
                            onClick: (event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              props.setConfirmingArchiveThreadId(thread.id);
                              requestAnimationFrame(() => {
                                props.confirmArchiveButtonRefs.current.get(thread.id)?.focus();
                              });
                            },
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
                                  onPointerDown: (event) => {
                                    event.stopPropagation();
                                  },
                                  onClick: (event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    void props.attemptArchiveThread(thread.id);
                                  },
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
                  children:
                    props.showThreadJumpHints && props.jumpLabel
                      ? _jsx("span", {
                          className:
                            "inline-flex h-5 items-center rounded-full border border-border/80 bg-background/90 px-1.5 font-mono text-[10px] font-medium tracking-tight text-foreground shadow-sm",
                          title: props.jumpLabel,
                          children: props.jumpLabel,
                        })
                      : _jsx("span", {
                          className: `text-[10px] ${
                            isHighlighted
                              ? "text-foreground/72 dark:text-foreground/82"
                              : "text-muted-foreground/40"
                          }`,
                          children: formatRelativeTimeLabel(thread.updatedAt ?? thread.createdAt),
                        }),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
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
export default function Sidebar() {
  const projects = useStore((store) => store.projects);
  const sidebarThreadsById = useStore((store) => store.sidebarThreadsById);
  const threadIdsByProjectId = useStore((store) => store.threadIdsByProjectId);
  const { projectExpandedById, projectOrder, threadLastVisitedAtById } = useUiStateStore(
    useShallow((store) => ({
      projectExpandedById: store.projectExpandedById,
      projectOrder: store.projectOrder,
      threadLastVisitedAtById: store.threadLastVisitedAtById,
    })),
  );
  const markThreadUnread = useUiStateStore((store) => store.markThreadUnread);
  const toggleProject = useUiStateStore((store) => store.toggleProject);
  const reorderProjects = useUiStateStore((store) => store.reorderProjects);
  const clearComposerDraftForThread = useComposerDraftStore((store) => store.clearDraftThread);
  const getDraftThreadByProjectId = useComposerDraftStore(
    (store) => store.getDraftThreadByProjectId,
  );
  const terminalStateByThreadId = useTerminalStateStore((state) => state.terminalStateByThreadId);
  const clearProjectDraftThreadId = useComposerDraftStore(
    (store) => store.clearProjectDraftThreadId,
  );
  const navigate = useNavigate();
  const pathname = useLocation({ select: (loc) => loc.pathname });
  const isOnSettings = pathname.startsWith("/settings");
  const appSettings = useSettings();
  const { updateSettings } = useUpdateSettings();
  const { activeDraftThread, activeThread, handleNewThread } = useHandleNewThread();
  const { archiveThread, deleteThread } = useThreadActions();
  const routeThreadId = useParams({
    strict: false,
    select: (params) => (params.threadId ? ThreadId.makeUnsafe(params.threadId) : null),
  });
  const keybindings = useServerKeybindings();
  const [addingProject, setAddingProject] = useState(false);
  const [newCwd, setNewCwd] = useState("");
  const [isPickingFolder, setIsPickingFolder] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [addProjectError, setAddProjectError] = useState(null);
  const addProjectInputRef = useRef(null);
  const [renamingThreadId, setRenamingThreadId] = useState(null);
  const [renamingTitle, setRenamingTitle] = useState("");
  const [confirmingArchiveThreadId, setConfirmingArchiveThreadId] = useState(null);
  const [expandedThreadListsByProject, setExpandedThreadListsByProject] = useState(() => new Set());
  const { showThreadJumpHints, updateThreadJumpHintsVisibility } = useThreadJumpHintVisibility();
  const renamingCommittedRef = useRef(false);
  const renamingInputRef = useRef(null);
  const confirmArchiveButtonRefs = useRef(new Map());
  const dragInProgressRef = useRef(false);
  const suppressProjectClickAfterDragRef = useRef(false);
  const suppressProjectClickForContextMenuRef = useRef(false);
  const [desktopUpdateState, setDesktopUpdateState] = useState(null);
  const selectedThreadIds = useThreadSelectionStore((s) => s.selectedThreadIds);
  const toggleThreadSelection = useThreadSelectionStore((s) => s.toggleThread);
  const rangeSelectTo = useThreadSelectionStore((s) => s.rangeSelectTo);
  const clearSelection = useThreadSelectionStore((s) => s.clearSelection);
  const removeFromSelection = useThreadSelectionStore((s) => s.removeFromSelection);
  const setSelectionAnchor = useThreadSelectionStore((s) => s.setAnchor);
  const isLinuxDesktop = isElectron && isLinuxPlatform(navigator.platform);
  const platform = navigator.platform;
  const shouldBrowseForProjectImmediately = isElectron && !isLinuxDesktop;
  const shouldShowProjectPathEntry = addingProject && !shouldBrowseForProjectImmediately;
  const orderedProjects = useMemo(() => {
    return orderItemsByPreferredIds({
      items: projects,
      preferredIds: projectOrder,
      getId: (project) => project.id,
    });
  }, [projectOrder, projects]);
  const sidebarProjects = useMemo(
    () =>
      orderedProjects.map((project) => ({
        ...project,
        expanded: projectExpandedById[project.id] ?? true,
      })),
    [orderedProjects, projectExpandedById],
  );
  const sidebarThreads = useMemo(() => Object.values(sidebarThreadsById), [sidebarThreadsById]);
  const projectCwdById = useMemo(
    () => new Map(projects.map((project) => [project.id, project.cwd])),
    [projects],
  );
  const routeTerminalOpen = routeThreadId
    ? selectThreadTerminalState(terminalStateByThreadId, routeThreadId).terminalOpen
    : false;
  const sidebarShortcutLabelOptions = useMemo(
    () => ({
      platform,
      context: {
        terminalFocus: false,
        terminalOpen: routeTerminalOpen,
      },
    }),
    [platform, routeTerminalOpen],
  );
  const threadGitTargets = useMemo(
    () =>
      sidebarThreads.map((thread) => ({
        threadId: thread.id,
        branch: thread.branch,
        cwd: thread.worktreePath ?? projectCwdById.get(thread.projectId) ?? null,
      })),
    [projectCwdById, sidebarThreads],
  );
  const threadGitStatusCwds = useMemo(
    () => [
      ...new Set(
        threadGitTargets
          .filter((target) => target.branch !== null)
          .map((target) => target.cwd)
          .filter((cwd) => cwd !== null),
      ),
    ],
    [threadGitTargets],
  );
  const threadGitStatusQueries = useQueries({
    queries: threadGitStatusCwds.map((cwd) => ({
      ...gitStatusQueryOptions(cwd),
      staleTime: 30_000,
      refetchInterval: 60_000,
    })),
  });
  const prByThreadId = useMemo(() => {
    const statusByCwd = new Map();
    for (let index = 0; index < threadGitStatusCwds.length; index += 1) {
      const cwd = threadGitStatusCwds[index];
      if (!cwd) continue;
      const status = threadGitStatusQueries[index]?.data;
      if (status) {
        statusByCwd.set(cwd, status);
      }
    }
    const map = new Map();
    for (const target of threadGitTargets) {
      const status = target.cwd ? statusByCwd.get(target.cwd) : undefined;
      const branchMatches =
        target.branch !== null && status?.branch !== null && status?.branch === target.branch;
      map.set(target.threadId, branchMatches ? (status?.pr ?? null) : null);
    }
    return map;
  }, [threadGitStatusCwds, threadGitStatusQueries, threadGitTargets]);
  const openPrLink = useCallback((event, prUrl) => {
    event.preventDefault();
    event.stopPropagation();
    const api = readNativeApi();
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
  const attemptArchiveThread = useCallback(
    async (threadId) => {
      try {
        await archiveThread(threadId);
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
  const focusMostRecentThreadForProject = useCallback(
    (projectId) => {
      const latestThread = sortThreadsForSidebar(
        (threadIdsByProjectId[projectId] ?? [])
          .map((threadId) => sidebarThreadsById[threadId])
          .filter((thread) => thread !== undefined)
          .filter((thread) => thread.archivedAt === null),
        appSettings.sidebarThreadSortOrder,
      )[0];
      if (!latestThread) return;
      void navigate({
        to: "/$threadId",
        params: { threadId: latestThread.id },
      });
    },
    [appSettings.sidebarThreadSortOrder, navigate, sidebarThreadsById, threadIdsByProjectId],
  );
  const addProjectFromPath = useCallback(
    async (rawCwd) => {
      const cwd = rawCwd.trim();
      if (!cwd || isAddingProject) return;
      const api = readNativeApi();
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
        focusMostRecentThreadForProject(existing.id);
        finishAddingProject();
        return;
      }
      const projectId = newProjectId();
      const createdAt = new Date().toISOString();
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
          createdAt,
        });
        await handleNewThread(projectId, {
          envMode: appSettings.defaultThreadEnvMode,
        }).catch(() => undefined);
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
      handleNewThread,
      isAddingProject,
      projects,
      shouldBrowseForProjectImmediately,
      appSettings.defaultThreadEnvMode,
    ],
  );
  const handleAddProject = () => {
    void addProjectFromPath(newCwd);
  };
  const canAddProject = newCwd.trim().length > 0 && !isAddingProject;
  const handlePickFolder = async () => {
    const api = readNativeApi();
    if (!api || isPickingFolder) return;
    setIsPickingFolder(true);
    let pickedPath = null;
    try {
      pickedPath = await api.dialogs.pickFolder();
    } catch {
      // Ignore picker failures and leave the current thread selection unchanged.
    }
    if (pickedPath) {
      await addProjectFromPath(pickedPath);
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
  const cancelRename = useCallback(() => {
    setRenamingThreadId(null);
    renamingInputRef.current = null;
  }, []);
  const commitRename = useCallback(async (threadId, newTitle, originalTitle) => {
    const finishRename = () => {
      setRenamingThreadId((current) => {
        if (current !== threadId) return current;
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
    const api = readNativeApi();
    if (!api) {
      finishRename();
      return;
    }
    try {
      await api.orchestration.dispatchCommand({
        type: "thread.meta.update",
        commandId: newCommandId(),
        threadId,
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
  const handleThreadContextMenu = useCallback(
    async (threadId, position) => {
      const api = readNativeApi();
      if (!api) return;
      const thread = sidebarThreadsById[threadId];
      if (!thread) return;
      const threadWorkspacePath =
        thread.worktreePath ?? projectCwdById.get(thread.projectId) ?? null;
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
        setRenamingThreadId(threadId);
        setRenamingTitle(thread.title);
        renamingCommittedRef.current = false;
        return;
      }
      if (clicked === "mark-unread") {
        markThreadUnread(threadId, thread.latestTurn?.completedAt);
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
        copyThreadIdToClipboard(threadId, { threadId });
        return;
      }
      if (clicked !== "delete") return;
      if (appSettings.confirmThreadDelete) {
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
      await deleteThread(threadId);
    },
    [
      appSettings.confirmThreadDelete,
      copyPathToClipboard,
      copyThreadIdToClipboard,
      deleteThread,
      markThreadUnread,
      projectCwdById,
      sidebarThreadsById,
    ],
  );
  const handleMultiSelectContextMenu = useCallback(
    async (position) => {
      const api = readNativeApi();
      if (!api) return;
      const ids = [...selectedThreadIds];
      if (ids.length === 0) return;
      const count = ids.length;
      const clicked = await api.contextMenu.show(
        [
          { id: "mark-unread", label: `Mark unread (${count})` },
          { id: "delete", label: `Delete (${count})`, destructive: true },
        ],
        position,
      );
      if (clicked === "mark-unread") {
        for (const id of ids) {
          const thread = sidebarThreadsById[id];
          markThreadUnread(id, thread?.latestTurn?.completedAt);
        }
        clearSelection();
        return;
      }
      if (clicked !== "delete") return;
      if (appSettings.confirmThreadDelete) {
        const confirmed = await api.dialogs.confirm(
          [
            `Delete ${count} thread${count === 1 ? "" : "s"}?`,
            "This permanently clears conversation history for these threads.",
          ].join("\n"),
        );
        if (!confirmed) return;
      }
      const deletedIds = new Set(ids);
      for (const id of ids) {
        await deleteThread(id, { deletedThreadIds: deletedIds });
      }
      removeFromSelection(ids);
    },
    [
      appSettings.confirmThreadDelete,
      clearSelection,
      deleteThread,
      markThreadUnread,
      removeFromSelection,
      selectedThreadIds,
      sidebarThreadsById,
    ],
  );
  const handleThreadClick = useCallback(
    (event, threadId, orderedProjectThreadIds) => {
      const isMac = isMacPlatform(navigator.platform);
      const isModClick = isMac ? event.metaKey : event.ctrlKey;
      const isShiftClick = event.shiftKey;
      if (isModClick) {
        event.preventDefault();
        toggleThreadSelection(threadId);
        return;
      }
      if (isShiftClick) {
        event.preventDefault();
        rangeSelectTo(threadId, orderedProjectThreadIds);
        return;
      }
      // Plain click — clear selection, set anchor for future shift-clicks, and navigate
      if (selectedThreadIds.size > 0) {
        clearSelection();
      }
      setSelectionAnchor(threadId);
      void navigate({
        to: "/$threadId",
        params: { threadId },
      });
    },
    [
      clearSelection,
      navigate,
      rangeSelectTo,
      selectedThreadIds.size,
      setSelectionAnchor,
      toggleThreadSelection,
    ],
  );
  const navigateToThread = useCallback(
    (threadId) => {
      if (selectedThreadIds.size > 0) {
        clearSelection();
      }
      setSelectionAnchor(threadId);
      void navigate({
        to: "/$threadId",
        params: { threadId },
      });
    },
    [clearSelection, navigate, selectedThreadIds.size, setSelectionAnchor],
  );
  const handleProjectContextMenu = useCallback(
    async (projectId, position) => {
      const api = readNativeApi();
      if (!api) return;
      const project = projects.find((entry) => entry.id === projectId);
      if (!project) return;
      const clicked = await api.contextMenu.show(
        [
          { id: "copy-path", label: "Copy Project Path" },
          { id: "delete", label: "Remove project", destructive: true },
        ],
        position,
      );
      if (clicked === "copy-path") {
        copyPathToClipboard(project.cwd, { path: project.cwd });
        return;
      }
      if (clicked !== "delete") return;
      const projectThreadIds = threadIdsByProjectId[projectId] ?? [];
      if (projectThreadIds.length > 0) {
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
        const projectDraftThread = getDraftThreadByProjectId(projectId);
        if (projectDraftThread) {
          clearComposerDraftForThread(projectDraftThread.threadId);
        }
        clearProjectDraftThreadId(projectId);
        await api.orchestration.dispatchCommand({
          type: "project.delete",
          commandId: newCommandId(),
          projectId,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error removing project.";
        console.error("Failed to remove project", { projectId, error });
        toastManager.add({
          type: "error",
          title: `Failed to remove "${project.name}"`,
          description: message,
        });
      }
    },
    [
      clearComposerDraftForThread,
      clearProjectDraftThreadId,
      copyPathToClipboard,
      getDraftThreadByProjectId,
      projects,
      threadIdsByProjectId,
    ],
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
      if (appSettings.sidebarProjectSortOrder !== "manual") {
        dragInProgressRef.current = false;
        return;
      }
      dragInProgressRef.current = false;
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const activeProject = sidebarProjects.find((project) => project.id === active.id);
      const overProject = sidebarProjects.find((project) => project.id === over.id);
      if (!activeProject || !overProject) return;
      reorderProjects(activeProject.id, overProject.id);
    },
    [appSettings.sidebarProjectSortOrder, reorderProjects, sidebarProjects],
  );
  const handleProjectDragStart = useCallback(
    (_event) => {
      if (appSettings.sidebarProjectSortOrder !== "manual") {
        return;
      }
      dragInProgressRef.current = true;
      suppressProjectClickAfterDragRef.current = true;
    },
    [appSettings.sidebarProjectSortOrder],
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
  const handleProjectTitlePointerDownCapture = useCallback((event) => {
    suppressProjectClickForContextMenuRef.current = false;
    if (
      isContextMenuPointerDown({
        button: event.button,
        ctrlKey: event.ctrlKey,
        isMac: isMacPlatform(navigator.platform),
      })
    ) {
      // Keep context-menu gestures from arming the sortable drag sensor.
      event.stopPropagation();
    }
    suppressProjectClickAfterDragRef.current = false;
  }, []);
  const visibleThreads = useMemo(
    () => sidebarThreads.filter((thread) => thread.archivedAt === null),
    [sidebarThreads],
  );
  const sortedProjects = useMemo(
    () =>
      sortProjectsForSidebar(sidebarProjects, visibleThreads, appSettings.sidebarProjectSortOrder),
    [appSettings.sidebarProjectSortOrder, sidebarProjects, visibleThreads],
  );
  const isManualProjectSorting = appSettings.sidebarProjectSortOrder === "manual";
  const renderedProjects = useMemo(
    () =>
      sortedProjects.map((project) => {
        const resolveProjectThreadStatus = (thread) =>
          resolveThreadStatusPill({
            thread: {
              ...thread,
              lastVisitedAt: threadLastVisitedAtById[thread.id],
            },
          });
        const projectThreads = sortThreadsForSidebar(
          (threadIdsByProjectId[project.id] ?? [])
            .map((threadId) => sidebarThreadsById[threadId])
            .filter((thread) => thread !== undefined)
            .filter((thread) => thread.archivedAt === null),
          appSettings.sidebarThreadSortOrder,
        );
        const projectStatus = resolveProjectStatusIndicator(
          projectThreads.map((thread) => resolveProjectThreadStatus(thread)),
        );
        const activeThreadId = routeThreadId ?? undefined;
        const isThreadListExpanded = expandedThreadListsByProject.has(project.id);
        const pinnedCollapsedThread =
          !project.expanded && activeThreadId
            ? (projectThreads.find((thread) => thread.id === activeThreadId) ?? null)
            : null;
        const shouldShowThreadPanel = project.expanded || pinnedCollapsedThread !== null;
        const {
          hasHiddenThreads,
          hiddenThreads,
          visibleThreads: visibleProjectThreads,
        } = getVisibleThreadsForProject({
          threads: projectThreads,
          activeThreadId,
          isThreadListExpanded,
          previewLimit: THREAD_PREVIEW_LIMIT,
        });
        const hiddenThreadStatus = resolveProjectStatusIndicator(
          hiddenThreads.map((thread) => resolveProjectThreadStatus(thread)),
        );
        const orderedProjectThreadIds = projectThreads.map((thread) => thread.id);
        const renderedThreadIds = pinnedCollapsedThread
          ? [pinnedCollapsedThread.id]
          : visibleProjectThreads.map((thread) => thread.id);
        const showEmptyThreadState = project.expanded && projectThreads.length === 0;
        return {
          hasHiddenThreads,
          hiddenThreadStatus,
          orderedProjectThreadIds,
          project,
          projectStatus,
          renderedThreadIds,
          showEmptyThreadState,
          shouldShowThreadPanel,
          isThreadListExpanded,
        };
      }),
    [
      appSettings.sidebarThreadSortOrder,
      expandedThreadListsByProject,
      routeThreadId,
      sortedProjects,
      sidebarThreadsById,
      threadIdsByProjectId,
      threadLastVisitedAtById,
    ],
  );
  const visibleSidebarThreadIds = useMemo(
    () => getVisibleSidebarThreadIds(renderedProjects),
    [renderedProjects],
  );
  const threadJumpCommandById = useMemo(() => {
    const mapping = new Map();
    for (const [visibleThreadIndex, threadId] of visibleSidebarThreadIds.entries()) {
      const jumpCommand = threadJumpCommandForIndex(visibleThreadIndex);
      if (!jumpCommand) {
        return mapping;
      }
      mapping.set(threadId, jumpCommand);
    }
    return mapping;
  }, [visibleSidebarThreadIds]);
  const threadJumpThreadIds = useMemo(
    () => [...threadJumpCommandById.keys()],
    [threadJumpCommandById],
  );
  const threadJumpLabelById = useMemo(() => {
    const mapping = new Map();
    for (const [threadId, command] of threadJumpCommandById) {
      const label = shortcutLabelForCommand(keybindings, command, sidebarShortcutLabelOptions);
      if (label) {
        mapping.set(threadId, label);
      }
    }
    return mapping;
  }, [keybindings, sidebarShortcutLabelOptions, threadJumpCommandById]);
  const orderedSidebarThreadIds = visibleSidebarThreadIds;
  useEffect(() => {
    const getShortcutContext = () => ({
      terminalFocus: isTerminalFocused(),
      terminalOpen: routeTerminalOpen,
    });
    const onWindowKeyDown = (event) => {
      updateThreadJumpHintsVisibility(
        shouldShowThreadJumpHints(event, keybindings, {
          platform,
          context: getShortcutContext(),
        }),
      );
      if (event.defaultPrevented || event.repeat) {
        return;
      }
      const command = resolveShortcutCommand(event, keybindings, {
        platform,
        context: getShortcutContext(),
      });
      const traversalDirection = threadTraversalDirectionFromCommand(command);
      if (traversalDirection !== null) {
        const targetThreadId = resolveAdjacentThreadId({
          threadIds: orderedSidebarThreadIds,
          currentThreadId: routeThreadId,
          direction: traversalDirection,
        });
        if (!targetThreadId) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        navigateToThread(targetThreadId);
        return;
      }
      const jumpIndex = threadJumpIndexFromCommand(command ?? "");
      if (jumpIndex === null) {
        return;
      }
      const targetThreadId = threadJumpThreadIds[jumpIndex];
      if (!targetThreadId) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      navigateToThread(targetThreadId);
    };
    const onWindowKeyUp = (event) => {
      updateThreadJumpHintsVisibility(
        shouldShowThreadJumpHints(event, keybindings, {
          platform,
          context: getShortcutContext(),
        }),
      );
    };
    const onWindowBlur = () => {
      updateThreadJumpHintsVisibility(false);
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
    keybindings,
    navigateToThread,
    orderedSidebarThreadIds,
    platform,
    routeTerminalOpen,
    routeThreadId,
    threadJumpThreadIds,
    updateThreadJumpHintsVisibility,
  ]);
  function renderProjectItem(renderedProject, dragHandleProps) {
    const {
      hasHiddenThreads,
      hiddenThreadStatus,
      orderedProjectThreadIds,
      project,
      projectStatus,
      renderedThreadIds,
      showEmptyThreadState,
      shouldShowThreadPanel,
      isThreadListExpanded,
    } = renderedProject;
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
              onPointerDownCapture: handleProjectTitlePointerDownCapture,
              onClick: (event) => handleProjectTitleClick(event, project.id),
              onKeyDown: (event) => handleProjectTitleKeyDown(event, project.id),
              onContextMenu: (event) => {
                event.preventDefault();
                suppressProjectClickForContextMenuRef.current = true;
                void handleProjectContextMenu(project.id, {
                  x: event.clientX,
                  y: event.clientY,
                });
              },
              children: [
                !project.expanded && projectStatus
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
                      className: `-ml-0.5 size-3.5 shrink-0 text-muted-foreground/70 transition-transform duration-150 ${project.expanded ? "rotate-90" : ""}`,
                    }),
                _jsx(ProjectFavicon, { cwd: project.cwd }),
                _jsx("span", {
                  className: "flex-1 truncate text-xs font-medium text-foreground/90",
                  children: project.name,
                }),
              ],
            }),
            _jsxs(Tooltip, {
              children: [
                _jsx(TooltipTrigger, {
                  render: _jsx(SidebarMenuAction, {
                    render: _jsx("button", {
                      type: "button",
                      "aria-label": `Create new thread in ${project.name}`,
                      "data-testid": "new-thread-button",
                    }),
                    showOnHover: true,
                    className:
                      "top-1 right-1.5 size-5 rounded-md p-0 text-muted-foreground/70 hover:bg-secondary hover:text-foreground",
                    onClick: (event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      const seedContext = resolveSidebarNewThreadSeedContext({
                        projectId: project.id,
                        defaultEnvMode: resolveSidebarNewThreadEnvMode({
                          defaultEnvMode: appSettings.defaultThreadEnvMode,
                        }),
                        activeThread:
                          activeThread && activeThread.projectId === project.id
                            ? {
                                projectId: activeThread.projectId,
                                branch: activeThread.branch,
                                worktreePath: activeThread.worktreePath,
                              }
                            : null,
                        activeDraftThread:
                          activeDraftThread && activeDraftThread.projectId === project.id
                            ? {
                                projectId: activeDraftThread.projectId,
                                branch: activeDraftThread.branch,
                                worktreePath: activeDraftThread.worktreePath,
                                envMode: activeDraftThread.envMode,
                              }
                            : null,
                      });
                      void handleNewThread(project.id, {
                        ...(seedContext.branch !== undefined ? { branch: seedContext.branch } : {}),
                        ...(seedContext.worktreePath !== undefined
                          ? { worktreePath: seedContext.worktreePath }
                          : {}),
                        envMode: seedContext.envMode,
                      });
                    },
                    children: _jsx(SquarePenIcon, { className: "size-3.5" }),
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
        _jsxs(SidebarMenuSub, {
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
              renderedThreadIds.map((threadId) =>
                _jsx(
                  SidebarThreadRow,
                  {
                    threadId: threadId,
                    orderedProjectThreadIds: orderedProjectThreadIds,
                    routeThreadId: routeThreadId,
                    selectedThreadIds: selectedThreadIds,
                    showThreadJumpHints: showThreadJumpHints,
                    jumpLabel: threadJumpLabelById.get(threadId) ?? null,
                    appSettingsConfirmThreadArchive: appSettings.confirmThreadArchive,
                    renamingThreadId: renamingThreadId,
                    renamingTitle: renamingTitle,
                    setRenamingTitle: setRenamingTitle,
                    renamingInputRef: renamingInputRef,
                    renamingCommittedRef: renamingCommittedRef,
                    confirmingArchiveThreadId: confirmingArchiveThreadId,
                    setConfirmingArchiveThreadId: setConfirmingArchiveThreadId,
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
                    pr: prByThreadId.get(threadId) ?? null,
                  },
                  threadId,
                ),
              ),
            project.expanded &&
              hasHiddenThreads &&
              !isThreadListExpanded &&
              _jsx(SidebarMenuSubItem, {
                className: "w-full",
                children: _jsx(SidebarMenuSubButton, {
                  render: _jsx("button", { type: "button" }),
                  "data-thread-selection-safe": true,
                  size: "sm",
                  className:
                    "h-6 w-full translate-x-0 justify-start px-2 text-left text-[10px] text-muted-foreground/60 hover:bg-accent hover:text-muted-foreground/80",
                  onClick: () => {
                    expandThreadListForProject(project.id);
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
            project.expanded &&
              hasHiddenThreads &&
              isThreadListExpanded &&
              _jsx(SidebarMenuSubItem, {
                className: "w-full",
                children: _jsx(SidebarMenuSubButton, {
                  render: _jsx("button", { type: "button" }),
                  "data-thread-selection-safe": true,
                  size: "sm",
                  className:
                    "h-6 w-full translate-x-0 justify-start px-2 text-left text-[10px] text-muted-foreground/60 hover:bg-accent hover:text-muted-foreground/80",
                  onClick: () => {
                    collapseThreadListForProject(project.id);
                  },
                  children: _jsx("span", { children: "Show less" }),
                }),
              }),
          ],
        }),
      ],
    });
  }
  const handleProjectTitleClick = useCallback(
    (event, projectId) => {
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
        // Consume the synthetic click emitted after a drag release.
        suppressProjectClickAfterDragRef.current = false;
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (selectedThreadIds.size > 0) {
        clearSelection();
      }
      toggleProject(projectId);
    },
    [clearSelection, selectedThreadIds.size, toggleProject],
  );
  const handleProjectTitleKeyDown = useCallback(
    (event, projectId) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      if (dragInProgressRef.current) {
        return;
      }
      toggleProject(projectId);
    },
    [toggleProject],
  );
  useEffect(() => {
    const onMouseDown = (event) => {
      if (selectedThreadIds.size === 0) return;
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (!shouldClearThreadSelectionOnMouseDown(target)) return;
      clearSelection();
    };
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [clearSelection, selectedThreadIds.size]);
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
  const newThreadShortcutLabel =
    shortcutLabelForCommand(keybindings, "chat.newLocal", sidebarShortcutLabelOptions) ??
    shortcutLabelForCommand(keybindings, "chat.new", sidebarShortcutLabelOptions);
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
  const expandThreadListForProject = useCallback((projectId) => {
    setExpandedThreadListsByProject((current) => {
      if (current.has(projectId)) return current;
      const next = new Set(current);
      next.add(projectId);
      return next;
    });
  }, []);
  const collapseThreadListForProject = useCallback((projectId) => {
    setExpandedThreadListsByProject((current) => {
      if (!current.has(projectId)) return current;
      const next = new Set(current);
      next.delete(projectId);
      return next;
    });
  }, []);
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
  return _jsxs(_Fragment, {
    children: [
      isElectron
        ? _jsx(SidebarHeader, {
            className: "drag-region h-[52px] flex-row items-center gap-2 px-4 py-0 pl-[90px]",
            children: wordmark,
          })
        : _jsx(SidebarHeader, {
            className: "gap-3 px-3 py-2 sm:gap-2.5 sm:px-4 sm:py-3",
            children: wordmark,
          }),
      isOnSettings
        ? _jsx(SettingsSidebarNav, { pathname: pathname })
        : _jsxs(_Fragment, {
            children: [
              _jsxs(SidebarContent, {
                className: "gap-0",
                children: [
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
                                projectSortOrder: appSettings.sidebarProjectSortOrder,
                                threadSortOrder: appSettings.sidebarThreadSortOrder,
                                onProjectSortOrderChange: (sortOrder) => {
                                  updateSettings({ sidebarProjectSortOrder: sortOrder });
                                },
                                onThreadSortOrderChange: (sortOrder) => {
                                  updateSettings({ sidebarThreadSortOrder: sortOrder });
                                },
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
                                    children: shouldShowProjectPathEntry
                                      ? "Cancel add project"
                                      : "Add project",
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
                                onClick: () => void handlePickFolder(),
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
                                  onChange: (event) => {
                                    setNewCwd(event.target.value);
                                    setAddProjectError(null);
                                  },
                                  onKeyDown: (event) => {
                                    if (event.key === "Enter") handleAddProject();
                                    if (event.key === "Escape") {
                                      setAddingProject(false);
                                      setAddProjectError(null);
                                    }
                                  },
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
                                items: renderedProjects.map(
                                  (renderedProject) => renderedProject.project.id,
                                ),
                                strategy: verticalListSortingStrategy,
                                children: renderedProjects.map((renderedProject) =>
                                  _jsx(
                                    SortableProjectItem,
                                    {
                                      projectId: renderedProject.project.id,
                                      children: (dragHandleProps) =>
                                        renderProjectItem(renderedProject, dragHandleProps),
                                    },
                                    renderedProject.project.id,
                                  ),
                                ),
                              }),
                            }),
                          })
                        : _jsx(SidebarMenu, {
                            ref: attachProjectListAutoAnimateRef,
                            children: renderedProjects.map((renderedProject) =>
                              _jsx(
                                SidebarMenuItem,
                                {
                                  className: "rounded-md",
                                  children: renderProjectItem(renderedProject, null),
                                },
                                renderedProject.project.id,
                              ),
                            ),
                          }),
                      projects.length === 0 &&
                        !shouldShowProjectPathEntry &&
                        _jsx("div", {
                          className: "px-2 pt-4 text-center text-xs text-muted-foreground/60",
                          children: "No projects yet",
                        }),
                    ],
                  }),
                ],
              }),
              _jsx(SidebarSeparator, {}),
              _jsxs(SidebarFooter, {
                className: "p-2",
                children: [
                  _jsx(SidebarUpdatePill, {}),
                  _jsx(SidebarMenu, {
                    children: _jsx(SidebarMenuItem, {
                      children: _jsxs(SidebarMenuButton, {
                        size: "sm",
                        className:
                          "gap-2 px-2 py-1.5 text-muted-foreground/70 hover:bg-accent hover:text-foreground",
                        onClick: () => void navigate({ to: "/settings" }),
                        children: [
                          _jsx(SettingsIcon, { className: "size-3.5" }),
                          _jsx("span", { className: "text-xs", children: "Settings" }),
                        ],
                      }),
                    }),
                  }),
                ],
              }),
            ],
          }),
    ],
  });
}
