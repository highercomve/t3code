import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import {
  ArrowLeftIcon,
  ArrowUpDownIcon,
  ChevronRightIcon,
  FolderIcon,
  GitPullRequestIcon,
  PlusIcon,
  RocketIcon,
  SettingsIcon,
  SquarePenIcon,
  TerminalIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { autoAnimate } from "@formkit/auto-animate";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { isElectron } from "../env";
import { APP_STAGE_LABEL, APP_VERSION } from "../branding";
import { isLinuxPlatform, isMacPlatform, newCommandId, newProjectId } from "../lib/utils";
import { useStore } from "../store";
import { shortcutLabelForCommand } from "../keybindings";
import { derivePendingApprovals, derivePendingUserInputs } from "../session-logic";
import { gitRemoveWorktreeMutationOptions, gitStatusQueryOptions } from "../lib/gitReactQuery";
import { serverConfigQueryOptions } from "../lib/serverReactQuery";
import { readNativeApi } from "../nativeApi";
import { useComposerDraftStore } from "../composerDraftStore";
import { useHandleNewThread } from "../hooks/useHandleNewThread";
import { selectThreadTerminalState, useTerminalStateStore } from "../terminalStateStore";
import { toastManager } from "./ui/toast";
import {
  getArm64IntelBuildWarningDescription,
  getDesktopUpdateActionError,
  getDesktopUpdateButtonTooltip,
  isDesktopUpdateButtonDisabled,
  resolveDesktopUpdateButtonAction,
  shouldShowArm64IntelBuildWarning,
  shouldHighlightDesktopUpdateError,
  shouldShowDesktopUpdateButton,
  shouldToastDesktopUpdateActionResult,
} from "./desktopUpdate.logic";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
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
import { formatWorktreePathForDisplay, getOrphanedWorktreePathForThread } from "../worktreeCleanup";
import { isNonEmpty as isNonEmptyString } from "effect/String";
import {
  getFallbackThreadIdAfterDelete,
  getVisibleThreadsForProject,
  resolveProjectStatusIndicator,
  resolveSidebarNewThreadEnvMode,
  resolveThreadRowClassName,
  resolveThreadStatusPill,
  shouldClearThreadSelectionOnMouseDown,
  sortProjectsForSidebar,
  sortThreadsForSidebar,
} from "./Sidebar.logic";
import { useCopyToClipboard } from "~/hooks/useCopyToClipboard";
import { useSettings, useUpdateSettings } from "~/hooks/useSettings";
const EMPTY_KEYBINDINGS = [];
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
const loadedProjectFaviconSrcs = new Set();
function formatRelativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
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
/**
 * Derives the server's HTTP origin (scheme + host + port) from the same
 * sources WsTransport uses, converting ws(s) to http(s).
 */
function getServerHttpOrigin() {
  const bridgeUrl = window.desktopBridge?.getWsUrl();
  const envUrl = import.meta.env.VITE_WS_URL;
  const wsUrl =
    bridgeUrl && bridgeUrl.length > 0
      ? bridgeUrl
      : envUrl && envUrl.length > 0
        ? envUrl
        : `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.hostname}:${window.location.port}`;
  // Parse to extract just the origin, dropping path/query (e.g. ?token=…)
  const httpUrl = wsUrl.replace(/^wss:/, "https:").replace(/^ws:/, "http:");
  try {
    return new URL(httpUrl).origin;
  } catch {
    return httpUrl;
  }
}
const serverHttpOrigin = getServerHttpOrigin();
function ProjectFavicon({ cwd }) {
  const src = `${serverHttpOrigin}/api/project-favicon?cwd=${encodeURIComponent(cwd)}`;
  const [status, setStatus] = useState(() =>
    loadedProjectFaviconSrcs.has(src) ? "loaded" : "loading",
  );
  if (status === "error") {
    return _jsx(FolderIcon, { className: "size-3.5 shrink-0 text-muted-foreground/50" });
  }
  return _jsx("img", {
    src: src,
    alt: "",
    className: `size-3.5 shrink-0 rounded-sm object-contain ${status === "loading" ? "hidden" : ""}`,
    onLoad: () => {
      loadedProjectFaviconSrcs.add(src);
      setStatus("loaded");
    },
    onError: () => setStatus("error"),
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
  const threads = useStore((store) => store.threads);
  const markThreadUnread = useStore((store) => store.markThreadUnread);
  const toggleProject = useStore((store) => store.toggleProject);
  const reorderProjects = useStore((store) => store.reorderProjects);
  const clearComposerDraftForThread = useComposerDraftStore((store) => store.clearDraftThread);
  const getDraftThreadByProjectId = useComposerDraftStore(
    (store) => store.getDraftThreadByProjectId,
  );
  const terminalStateByThreadId = useTerminalStateStore((state) => state.terminalStateByThreadId);
  const clearTerminalState = useTerminalStateStore((state) => state.clearTerminalState);
  const clearProjectDraftThreadId = useComposerDraftStore(
    (store) => store.clearProjectDraftThreadId,
  );
  const clearProjectDraftThreadById = useComposerDraftStore(
    (store) => store.clearProjectDraftThreadById,
  );
  const navigate = useNavigate();
  const isOnSettings = useLocation({ select: (loc) => loc.pathname === "/settings" });
  const appSettings = useSettings();
  const { updateSettings } = useUpdateSettings();
  const { handleNewThread } = useHandleNewThread();
  const routeThreadId = useParams({
    strict: false,
    select: (params) => (params.threadId ? ThreadId.makeUnsafe(params.threadId) : null),
  });
  const { data: keybindings = EMPTY_KEYBINDINGS } = useQuery({
    ...serverConfigQueryOptions(),
    select: (config) => config.keybindings,
  });
  const queryClient = useQueryClient();
  const removeWorktreeMutation = useMutation(gitRemoveWorktreeMutationOptions({ queryClient }));
  const [addingProject, setAddingProject] = useState(false);
  const [newCwd, setNewCwd] = useState("");
  const [isPickingFolder, setIsPickingFolder] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [addProjectError, setAddProjectError] = useState(null);
  const addProjectInputRef = useRef(null);
  const [renamingThreadId, setRenamingThreadId] = useState(null);
  const [renamingTitle, setRenamingTitle] = useState("");
  const [expandedThreadListsByProject, setExpandedThreadListsByProject] = useState(() => new Set());
  const renamingCommittedRef = useRef(false);
  const renamingInputRef = useRef(null);
  const dragInProgressRef = useRef(false);
  const suppressProjectClickAfterDragRef = useRef(false);
  const [desktopUpdateState, setDesktopUpdateState] = useState(null);
  const selectedThreadIds = useThreadSelectionStore((s) => s.selectedThreadIds);
  const toggleThreadSelection = useThreadSelectionStore((s) => s.toggleThread);
  const rangeSelectTo = useThreadSelectionStore((s) => s.rangeSelectTo);
  const clearSelection = useThreadSelectionStore((s) => s.clearSelection);
  const removeFromSelection = useThreadSelectionStore((s) => s.removeFromSelection);
  const setSelectionAnchor = useThreadSelectionStore((s) => s.setAnchor);
  const isLinuxDesktop = isElectron && isLinuxPlatform(navigator.platform);
  const shouldBrowseForProjectImmediately = isElectron && !isLinuxDesktop;
  const shouldShowProjectPathEntry = addingProject && !shouldBrowseForProjectImmediately;
  const projectCwdById = useMemo(
    () => new Map(projects.map((project) => [project.id, project.cwd])),
    [projects],
  );
  const threadGitTargets = useMemo(
    () =>
      threads.map((thread) => ({
        threadId: thread.id,
        branch: thread.branch,
        cwd: thread.worktreePath ?? projectCwdById.get(thread.projectId) ?? null,
      })),
    [projectCwdById, threads],
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
  const focusMostRecentThreadForProject = useCallback(
    (projectId) => {
      const latestThread = sortThreadsForSidebar(
        threads.filter((thread) => thread.projectId === projectId),
        appSettings.sidebarThreadSortOrder,
      )[0];
      if (!latestThread) return;
      void navigate({
        to: "/$threadId",
        params: { threadId: latestThread.id },
      });
    },
    [appSettings.sidebarThreadSortOrder, navigate, threads],
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
      toastManager.add({ type: "warning", title: "Thread title cannot be empty" });
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
  /**
   * Delete a single thread: stop session, close terminal, dispatch delete,
   * clean up drafts/state, and optionally remove orphaned worktree.
   * Callers handle thread-level confirmation; this still prompts for worktree removal.
   */
  const deleteThread = useCallback(
    async (threadId, opts = {}) => {
      const api = readNativeApi();
      if (!api) return;
      const thread = threads.find((t) => t.id === threadId);
      if (!thread) return;
      const threadProject = projects.find((project) => project.id === thread.projectId);
      // When bulk-deleting, exclude the other threads being deleted so
      // getOrphanedWorktreePathForThread correctly detects that no surviving
      // threads will reference this worktree.
      const deletedIds = opts.deletedThreadIds;
      const survivingThreads =
        deletedIds && deletedIds.size > 0
          ? threads.filter((t) => t.id === threadId || !deletedIds.has(t.id))
          : threads;
      const orphanedWorktreePath = getOrphanedWorktreePathForThread(survivingThreads, threadId);
      const displayWorktreePath = orphanedWorktreePath
        ? formatWorktreePathForDisplay(orphanedWorktreePath)
        : null;
      const canDeleteWorktree = orphanedWorktreePath !== null && threadProject !== undefined;
      const shouldDeleteWorktree =
        canDeleteWorktree &&
        (await api.dialogs.confirm(
          [
            "This thread is the only one linked to this worktree:",
            displayWorktreePath ?? orphanedWorktreePath,
            "",
            "Delete the worktree too?",
          ].join("\n"),
        ));
      if (thread.session && thread.session.status !== "closed") {
        await api.orchestration
          .dispatchCommand({
            type: "thread.session.stop",
            commandId: newCommandId(),
            threadId,
            createdAt: new Date().toISOString(),
          })
          .catch(() => undefined);
      }
      try {
        await api.terminal.close({ threadId, deleteHistory: true });
      } catch {
        // Terminal may already be closed
      }
      const allDeletedIds = deletedIds ?? new Set();
      const shouldNavigateToFallback = routeThreadId === threadId;
      const fallbackThreadId = getFallbackThreadIdAfterDelete({
        threads,
        deletedThreadId: threadId,
        deletedThreadIds: allDeletedIds,
        sortOrder: appSettings.sidebarThreadSortOrder,
      });
      await api.orchestration.dispatchCommand({
        type: "thread.delete",
        commandId: newCommandId(),
        threadId,
      });
      clearComposerDraftForThread(threadId);
      clearProjectDraftThreadById(thread.projectId, thread.id);
      clearTerminalState(threadId);
      if (shouldNavigateToFallback) {
        if (fallbackThreadId) {
          void navigate({
            to: "/$threadId",
            params: { threadId: fallbackThreadId },
            replace: true,
          });
        } else {
          void navigate({ to: "/", replace: true });
        }
      }
      if (!shouldDeleteWorktree || !orphanedWorktreePath || !threadProject) {
        return;
      }
      try {
        await removeWorktreeMutation.mutateAsync({
          cwd: threadProject.cwd,
          path: orphanedWorktreePath,
          force: true,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error removing worktree.";
        console.error("Failed to remove orphaned worktree after thread deletion", {
          threadId,
          projectCwd: threadProject.cwd,
          worktreePath: orphanedWorktreePath,
          error,
        });
        toastManager.add({
          type: "error",
          title: "Thread deleted, but worktree removal failed",
          description: `Could not remove ${displayWorktreePath ?? orphanedWorktreePath}. ${message}`,
        });
      }
    },
    [
      appSettings.sidebarThreadSortOrder,
      clearComposerDraftForThread,
      clearProjectDraftThreadById,
      clearTerminalState,
      navigate,
      projects,
      removeWorktreeMutation,
      routeThreadId,
      threads,
    ],
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
  const handleThreadContextMenu = useCallback(
    async (threadId, position) => {
      const api = readNativeApi();
      if (!api) return;
      const thread = threads.find((t) => t.id === threadId);
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
        markThreadUnread(threadId);
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
      threads,
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
          markThreadUnread(id);
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
  const handleProjectContextMenu = useCallback(
    async (projectId, position) => {
      const api = readNativeApi();
      if (!api) return;
      const clicked = await api.contextMenu.show(
        [{ id: "delete", label: "Remove project", destructive: true }],
        position,
      );
      if (clicked !== "delete") return;
      const project = projects.find((entry) => entry.id === projectId);
      if (!project) return;
      const projectThreads = threads.filter((thread) => thread.projectId === projectId);
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
      getDraftThreadByProjectId,
      projects,
      threads,
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
      const activeProject = projects.find((project) => project.id === active.id);
      const overProject = projects.find((project) => project.id === over.id);
      if (!activeProject || !overProject) return;
      reorderProjects(activeProject.id, overProject.id);
    },
    [appSettings.sidebarProjectSortOrder, projects, reorderProjects],
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
  const handleProjectTitlePointerDownCapture = useCallback(() => {
    suppressProjectClickAfterDragRef.current = false;
  }, []);
  const sortedProjects = useMemo(
    () => sortProjectsForSidebar(projects, threads, appSettings.sidebarProjectSortOrder),
    [appSettings.sidebarProjectSortOrder, projects, threads],
  );
  const isManualProjectSorting = appSettings.sidebarProjectSortOrder === "manual";
  function renderProjectItem(project, dragHandleProps) {
    const projectThreads = sortThreadsForSidebar(
      threads.filter((thread) => thread.projectId === project.id),
      appSettings.sidebarThreadSortOrder,
    );
    const projectStatus = resolveProjectStatusIndicator(
      projectThreads.map((thread) =>
        resolveThreadStatusPill({
          thread,
          hasPendingApprovals: derivePendingApprovals(thread.activities).length > 0,
          hasPendingUserInput: derivePendingUserInputs(thread.activities).length > 0,
        }),
      ),
    );
    const activeThreadId = routeThreadId ?? undefined;
    const isThreadListExpanded = expandedThreadListsByProject.has(project.id);
    const pinnedCollapsedThread =
      !project.expanded && activeThreadId
        ? (projectThreads.find((thread) => thread.id === activeThreadId) ?? null)
        : null;
    const shouldShowThreadPanel = project.expanded || pinnedCollapsedThread !== null;
    const { hasHiddenThreads, visibleThreads } = getVisibleThreadsForProject({
      threads: projectThreads,
      activeThreadId,
      isThreadListExpanded,
      previewLimit: THREAD_PREVIEW_LIMIT,
    });
    const orderedProjectThreadIds = projectThreads.map((thread) => thread.id);
    const renderedThreads = pinnedCollapsedThread ? [pinnedCollapsedThread] : visibleThreads;
    const renderThreadRow = (thread) => {
      const isActive = routeThreadId === thread.id;
      const isSelected = selectedThreadIds.has(thread.id);
      const isHighlighted = isActive || isSelected;
      const threadStatus = resolveThreadStatusPill({
        thread,
        hasPendingApprovals: derivePendingApprovals(thread.activities).length > 0,
        hasPendingUserInput: derivePendingUserInputs(thread.activities).length > 0,
      });
      const prStatus = prStatusIndicator(prByThreadId.get(thread.id) ?? null);
      const terminalStatus = terminalStatusFromRunningIds(
        selectThreadTerminalState(terminalStateByThreadId, thread.id).runningTerminalIds,
      );
      return _jsx(
        SidebarMenuSubItem,
        {
          className: "w-full",
          "data-thread-item": true,
          children: _jsxs(SidebarMenuSubButton, {
            render: _jsx("div", { role: "button", tabIndex: 0 }),
            size: "sm",
            isActive: isActive,
            className: resolveThreadRowClassName({
              isActive,
              isSelected,
            }),
            onClick: (event) => {
              handleThreadClick(event, thread.id, orderedProjectThreadIds);
            },
            onKeyDown: (event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              if (selectedThreadIds.size > 0) {
                clearSelection();
              }
              setSelectionAnchor(thread.id);
              void navigate({
                to: "/$threadId",
                params: { threadId: thread.id },
              });
            },
            onContextMenu: (event) => {
              event.preventDefault();
              if (selectedThreadIds.size > 0 && selectedThreadIds.has(thread.id)) {
                void handleMultiSelectContextMenu({
                  x: event.clientX,
                  y: event.clientY,
                });
              } else {
                if (selectedThreadIds.size > 0) {
                  clearSelection();
                }
                void handleThreadContextMenu(thread.id, {
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
                              openPrLink(event, prStatus.url);
                            },
                            children: _jsx(GitPullRequestIcon, { className: "size-3" }),
                          }),
                        }),
                        _jsx(TooltipPopup, { side: "top", children: prStatus.tooltip }),
                      ],
                    }),
                  threadStatus &&
                    _jsxs("span", {
                      className: `inline-flex items-center gap-1 text-[10px] ${threadStatus.colorClass}`,
                      children: [
                        _jsx("span", {
                          className: `h-1.5 w-1.5 rounded-full ${threadStatus.dotClass} ${threadStatus.pulse ? "animate-pulse" : ""}`,
                        }),
                        _jsx("span", {
                          className: "hidden md:inline",
                          children: threadStatus.label,
                        }),
                      ],
                    }),
                  renamingThreadId === thread.id
                    ? _jsx("input", {
                        ref: (el) => {
                          if (el && renamingInputRef.current !== el) {
                            renamingInputRef.current = el;
                            el.focus();
                            el.select();
                          }
                        },
                        className:
                          "min-w-0 flex-1 truncate text-xs bg-transparent outline-none border border-ring rounded px-0.5",
                        value: renamingTitle,
                        onChange: (e) => setRenamingTitle(e.target.value),
                        onKeyDown: (e) => {
                          e.stopPropagation();
                          if (e.key === "Enter") {
                            e.preventDefault();
                            renamingCommittedRef.current = true;
                            void commitRename(thread.id, renamingTitle, thread.title);
                          } else if (e.key === "Escape") {
                            e.preventDefault();
                            renamingCommittedRef.current = true;
                            cancelRename();
                          }
                        },
                        onBlur: () => {
                          if (!renamingCommittedRef.current) {
                            void commitRename(thread.id, renamingTitle, thread.title);
                          }
                        },
                        onClick: (e) => e.stopPropagation(),
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
                  _jsx("span", {
                    className: `text-[10px] ${
                      isHighlighted
                        ? "text-foreground/72 dark:text-foreground/82"
                        : "text-muted-foreground/40"
                    }`,
                    children: formatRelativeTime(thread.updatedAt ?? thread.createdAt),
                  }),
                ],
              }),
            ],
          }),
        },
        thread.id,
      );
    };
    return _jsxs(Collapsible, {
      className: "group/collapsible",
      open: shouldShowThreadPanel,
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
                      "top-1 right-1 size-5 rounded-md p-0 text-muted-foreground/70 hover:bg-secondary hover:text-foreground",
                    onClick: (event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      void handleNewThread(project.id, {
                        envMode: resolveSidebarNewThreadEnvMode({
                          defaultEnvMode: appSettings.defaultThreadEnvMode,
                        }),
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
        _jsx(CollapsibleContent, {
          children: _jsxs(SidebarMenuSub, {
            ref: attachThreadListAutoAnimateRef,
            className: "mx-1 my-0 w-full translate-x-0 gap-0.5 px-1.5 py-0",
            children: [
              renderedThreads.map((thread) => renderThreadRow(thread)),
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
                    children: _jsx("span", { children: "Show more" }),
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
        }),
      ],
    });
  }
  const handleProjectTitleClick = useCallback(
    (event, projectId) => {
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
  const showDesktopUpdateButton = isElectron && shouldShowDesktopUpdateButton(desktopUpdateState);
  const desktopUpdateTooltip = desktopUpdateState
    ? getDesktopUpdateButtonTooltip(desktopUpdateState)
    : "Update available";
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
  const desktopUpdateButtonInteractivityClasses = desktopUpdateButtonDisabled
    ? "cursor-not-allowed opacity-60"
    : "hover:bg-accent hover:text-foreground";
  const desktopUpdateButtonClasses =
    desktopUpdateState?.status === "downloaded"
      ? "text-emerald-500"
      : desktopUpdateState?.status === "downloading"
        ? "text-sky-400"
        : shouldHighlightDesktopUpdateError(desktopUpdateState)
          ? "text-rose-500 animate-pulse"
          : "text-amber-500 animate-pulse";
  const newThreadShortcutLabel =
    shortcutLabelForCommand(keybindings, "chat.newLocal") ??
    shortcutLabelForCommand(keybindings, "chat.new");
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
            render: _jsxs("div", {
              className: "flex min-w-0 flex-1 items-center gap-1 ml-1 cursor-pointer",
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
        ? _jsx(_Fragment, {
            children: _jsxs(SidebarHeader, {
              className: "drag-region h-[52px] flex-row items-center gap-2 px-4 py-0 pl-[90px]",
              children: [
                wordmark,
                showDesktopUpdateButton &&
                  _jsxs(Tooltip, {
                    children: [
                      _jsx(TooltipTrigger, {
                        render: _jsx("button", {
                          type: "button",
                          "aria-label": desktopUpdateTooltip,
                          "aria-disabled": desktopUpdateButtonDisabled || undefined,
                          disabled: desktopUpdateButtonDisabled,
                          className: `inline-flex size-7 ml-auto mt-1.5 items-center justify-center rounded-md text-muted-foreground transition-colors ${desktopUpdateButtonInteractivityClasses} ${desktopUpdateButtonClasses}`,
                          onClick: handleDesktopUpdateButtonClick,
                          children: _jsx(RocketIcon, { className: "size-3.5" }),
                        }),
                      }),
                      _jsx(TooltipPopup, { side: "bottom", children: desktopUpdateTooltip }),
                    ],
                  }),
              ],
            }),
          })
        : _jsx(SidebarHeader, {
            className: "gap-3 px-3 py-2 sm:gap-2.5 sm:px-4 sm:py-3",
            children: wordmark,
          }),
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
                className: "mb-1 flex items-center justify-between px-2",
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
                    _jsx("div", {
                      className: "mt-1.5 px-0.5",
                      children: _jsx("button", {
                        type: "button",
                        className:
                          "text-[11px] text-muted-foreground/50 transition-colors hover:text-muted-foreground",
                        onClick: () => {
                          setAddingProject(false);
                          setAddProjectError(null);
                        },
                        children: "Cancel",
                      }),
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
                        items: sortedProjects.map((project) => project.id),
                        strategy: verticalListSortingStrategy,
                        children: sortedProjects.map((project) =>
                          _jsx(
                            SortableProjectItem,
                            {
                              projectId: project.id,
                              children: (dragHandleProps) =>
                                renderProjectItem(project, dragHandleProps),
                            },
                            project.id,
                          ),
                        ),
                      }),
                    }),
                  })
                : _jsx(SidebarMenu, {
                    ref: attachProjectListAutoAnimateRef,
                    children: sortedProjects.map((project) =>
                      _jsx(
                        SidebarMenuItem,
                        { className: "rounded-md", children: renderProjectItem(project, null) },
                        project.id,
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
      _jsx(SidebarFooter, {
        className: "p-2",
        children: _jsx(SidebarMenu, {
          children: _jsx(SidebarMenuItem, {
            children: isOnSettings
              ? _jsxs(SidebarMenuButton, {
                  size: "sm",
                  className:
                    "gap-2 px-2 py-1.5 text-muted-foreground/70 hover:bg-accent hover:text-foreground",
                  onClick: () => window.history.back(),
                  children: [
                    _jsx(ArrowLeftIcon, { className: "size-3.5" }),
                    _jsx("span", { className: "text-xs", children: "Back" }),
                  ],
                })
              : _jsxs(SidebarMenuButton, {
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
      }),
    ],
  });
}
