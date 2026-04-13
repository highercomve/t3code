"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { scopeProjectRef, scopeThreadRef } from "@t3tools/client-runtime";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  MessageSquareIcon,
  SettingsIcon,
  SquarePenIcon,
} from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useCommandPaletteStore } from "../commandPaletteStore";
import { useHandleNewThread } from "../hooks/useHandleNewThread";
import { useSettings } from "../hooks/useSettings";
import {
  startNewThreadInProjectFromContext,
  startNewThreadFromContext,
} from "../lib/chatThreadActions";
import { isTerminalFocused } from "../lib/terminalFocus";
import { getLatestThreadForProject } from "../lib/threadSort";
import { cn } from "../lib/utils";
import {
  selectProjectsAcrossEnvironments,
  selectSidebarThreadsAcrossEnvironments,
  useStore,
} from "../store";
import { selectThreadTerminalState, useTerminalStateStore } from "../terminalStateStore";
import { buildThreadRouteParams, resolveThreadRouteTarget } from "../threadRoutes";
import {
  ADDON_ICON_CLASS,
  buildProjectActionItems,
  buildRootGroups,
  buildThreadActionItems,
  filterCommandPaletteGroups,
  getCommandPaletteInputPlaceholder,
  getCommandPaletteMode,
  ITEM_ICON_CLASS,
  RECENT_THREAD_LIMIT,
} from "./CommandPalette.logic";
import { CommandPaletteResults } from "./CommandPaletteResults";
import { ProjectFavicon } from "./ProjectFavicon";
import { useServerKeybindings } from "../rpc/serverState";
import { resolveShortcutCommand } from "../keybindings";
import {
  Command,
  CommandDialog,
  CommandDialogPopup,
  CommandFooter,
  CommandInput,
  CommandPanel,
} from "./ui/command";
import { Kbd, KbdGroup } from "./ui/kbd";
import { toastManager } from "./ui/toast";
import { ComposerHandleContext, useComposerHandleContext } from "../composerHandleContext";
export function CommandPalette({ children }) {
  const open = useCommandPaletteStore((store) => store.open);
  const setOpen = useCommandPaletteStore((store) => store.setOpen);
  const toggleOpen = useCommandPaletteStore((store) => store.toggleOpen);
  const keybindings = useServerKeybindings();
  const composerHandleRef = useRef(null);
  const routeTarget = useParams({
    strict: false,
    select: (params) => resolveThreadRouteTarget(params),
  });
  const routeThreadRef = routeTarget?.kind === "server" ? routeTarget.threadRef : null;
  const terminalOpen = useTerminalStateStore((state) =>
    routeThreadRef
      ? selectThreadTerminalState(state.terminalStateByThreadKey, routeThreadRef).terminalOpen
      : false,
  );
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.defaultPrevented) return;
      const command = resolveShortcutCommand(event, keybindings, {
        context: {
          terminalFocus: isTerminalFocused(),
          terminalOpen,
        },
      });
      if (command !== "commandPalette.toggle") {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      toggleOpen();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [keybindings, terminalOpen, toggleOpen]);
  return _jsx(ComposerHandleContext.Provider, {
    value: composerHandleRef,
    children: _jsxs(CommandDialog, {
      open: open,
      onOpenChange: setOpen,
      children: [children, _jsx(CommandPaletteDialog, {})],
    }),
  });
}
function CommandPaletteDialog() {
  const open = useCommandPaletteStore((store) => store.open);
  const setOpen = useCommandPaletteStore((store) => store.setOpen);
  useEffect(() => {
    return () => {
      setOpen(false);
    };
  }, [setOpen]);
  if (!open) {
    return null;
  }
  return _jsx(OpenCommandPaletteDialog, {});
}
function OpenCommandPaletteDialog() {
  const navigate = useNavigate();
  const setOpen = useCommandPaletteStore((store) => store.setOpen);
  const composerHandleRef = useComposerHandleContext();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const isActionsOnly = deferredQuery.startsWith(">");
  const settings = useSettings();
  const { activeDraftThread, activeThread, defaultProjectRef, handleNewThread } =
    useHandleNewThread();
  const projects = useStore(useShallow(selectProjectsAcrossEnvironments));
  const threads = useStore(useShallow(selectSidebarThreadsAcrossEnvironments));
  const keybindings = useServerKeybindings();
  const [viewStack, setViewStack] = useState([]);
  const currentView = viewStack.at(-1) ?? null;
  const paletteMode = getCommandPaletteMode({ currentView });
  const projectTitleById = useMemo(
    () => new Map(projects.map((project) => [project.id, project.name])),
    [projects],
  );
  const activeThreadId = activeThread?.id;
  const currentProjectId = activeThread?.projectId ?? activeDraftThread?.projectId ?? null;
  const openProjectFromSearch = useMemo(
    () => async (project) => {
      const latestThread = getLatestThreadForProject(
        threads.filter((thread) => thread.environmentId === project.environmentId),
        project.id,
        settings.sidebarThreadSortOrder,
      );
      if (latestThread) {
        await navigate({
          to: "/$environmentId/$threadId",
          params: buildThreadRouteParams(
            scopeThreadRef(latestThread.environmentId, latestThread.id),
          ),
        });
        return;
      }
      await handleNewThread(scopeProjectRef(project.environmentId, project.id), {
        envMode: settings.defaultThreadEnvMode,
      });
    },
    [
      handleNewThread,
      navigate,
      settings.defaultThreadEnvMode,
      settings.sidebarThreadSortOrder,
      threads,
    ],
  );
  const projectSearchItems = useMemo(
    () =>
      buildProjectActionItems({
        projects,
        valuePrefix: "project",
        icon: (project) =>
          _jsx(ProjectFavicon, {
            environmentId: project.environmentId,
            cwd: project.cwd,
            className: ITEM_ICON_CLASS,
          }),
        runProject: openProjectFromSearch,
      }),
    [openProjectFromSearch, projects],
  );
  const projectThreadItems = useMemo(
    () =>
      buildProjectActionItems({
        projects,
        valuePrefix: "new-thread-in",
        icon: (project) =>
          _jsx(ProjectFavicon, {
            environmentId: project.environmentId,
            cwd: project.cwd,
            className: ITEM_ICON_CLASS,
          }),
        runProject: async (project) => {
          await startNewThreadInProjectFromContext(
            {
              activeDraftThread,
              activeThread,
              defaultProjectRef,
              defaultThreadEnvMode: settings.defaultThreadEnvMode,
              handleNewThread,
            },
            scopeProjectRef(project.environmentId, project.id),
          );
        },
      }),
    [
      activeDraftThread,
      activeThread,
      defaultProjectRef,
      handleNewThread,
      projects,
      settings.defaultThreadEnvMode,
    ],
  );
  const allThreadItems = useMemo(
    () =>
      buildThreadActionItems({
        threads,
        ...(activeThreadId ? { activeThreadId } : {}),
        projectTitleById,
        sortOrder: settings.sidebarThreadSortOrder,
        icon: _jsx(MessageSquareIcon, { className: ITEM_ICON_CLASS }),
        runThread: async (thread) => {
          await navigate({
            to: "/$environmentId/$threadId",
            params: buildThreadRouteParams(scopeThreadRef(thread.environmentId, thread.id)),
          });
        },
      }),
    [activeThreadId, navigate, projectTitleById, settings.sidebarThreadSortOrder, threads],
  );
  const recentThreadItems = allThreadItems.slice(0, RECENT_THREAD_LIMIT);
  function pushView(item) {
    setViewStack((previousViews) => [
      ...previousViews,
      {
        addonIcon: item.addonIcon,
        groups: item.groups,
        ...(item.initialQuery ? { initialQuery: item.initialQuery } : {}),
      },
    ]);
    setQuery(item.initialQuery ?? "");
  }
  function popView() {
    setViewStack((previousViews) => previousViews.slice(0, -1));
    setQuery("");
  }
  function handleQueryChange(nextQuery) {
    setQuery(nextQuery);
    if (nextQuery === "" && currentView?.initialQuery) {
      popView();
    }
  }
  const actionItems = [];
  if (projects.length > 0) {
    const activeProjectTitle = currentProjectId
      ? (projectTitleById.get(currentProjectId) ?? null)
      : null;
    if (activeProjectTitle) {
      actionItems.push({
        kind: "action",
        value: "action:new-thread",
        searchTerms: ["new thread", "chat", "create", "draft"],
        title: _jsxs(_Fragment, {
          children: [
            "New thread in ",
            _jsx("span", { className: "font-semibold", children: activeProjectTitle }),
          ],
        }),
        icon: _jsx(SquarePenIcon, { className: ITEM_ICON_CLASS }),
        shortcutCommand: "chat.new",
        run: async () => {
          await startNewThreadFromContext({
            activeDraftThread,
            activeThread,
            defaultProjectRef,
            defaultThreadEnvMode: settings.defaultThreadEnvMode,
            handleNewThread,
          });
        },
      });
    }
    actionItems.push({
      kind: "submenu",
      value: "action:new-thread-in",
      searchTerms: ["new thread", "project", "pick", "choose", "select"],
      title: "New thread in...",
      icon: _jsx(SquarePenIcon, { className: ITEM_ICON_CLASS }),
      addonIcon: _jsx(SquarePenIcon, { className: ADDON_ICON_CLASS }),
      groups: [{ value: "projects", label: "Projects", items: projectThreadItems }],
    });
  }
  actionItems.push({
    kind: "action",
    value: "action:settings",
    searchTerms: ["settings", "preferences", "configuration", "keybindings"],
    title: "Open settings",
    icon: _jsx(SettingsIcon, { className: ITEM_ICON_CLASS }),
    run: async () => {
      await navigate({ to: "/settings" });
    },
  });
  const rootGroups = buildRootGroups({ actionItems, recentThreadItems });
  const activeGroups = currentView ? currentView.groups : rootGroups;
  const displayedGroups = filterCommandPaletteGroups({
    activeGroups,
    query: deferredQuery,
    isInSubmenu: currentView !== null,
    projectSearchItems: projectSearchItems,
    threadSearchItems: allThreadItems,
  });
  const inputPlaceholder = getCommandPaletteInputPlaceholder(paletteMode);
  const isSubmenu = paletteMode === "submenu";
  function handleKeyDown(event) {
    if (event.key === "Backspace" && query === "" && isSubmenu) {
      event.preventDefault();
      popView();
    }
  }
  function executeItem(item) {
    if (item.kind === "submenu") {
      pushView(item);
      return;
    }
    if (!item.keepOpen) {
      setOpen(false);
    }
    void item.run().catch((error) => {
      toastManager.add({
        type: "error",
        title: "Unable to run command",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      });
    });
  }
  return _jsx(CommandDialogPopup, {
    "aria-label": "Command palette",
    className: "overflow-hidden p-0",
    "data-testid": "command-palette",
    finalFocus: () => {
      composerHandleRef?.current?.focusAtEnd();
      return false;
    },
    children: _jsxs(
      Command,
      {
        "aria-label": "Command palette",
        autoHighlight: "always",
        mode: "none",
        onValueChange: handleQueryChange,
        value: query,
        children: [
          _jsx(CommandInput, {
            placeholder: inputPlaceholder,
            wrapperClassName: isSubmenu
              ? "[&_[data-slot=autocomplete-start-addon]]:pointer-events-auto [&_[data-slot=autocomplete-start-addon]]:cursor-pointer"
              : undefined,
            ...(isSubmenu
              ? {
                  startAddon: _jsx("button", {
                    type: "button",
                    className: "flex cursor-pointer items-center",
                    "aria-label": "Back",
                    onClick: popView,
                    children: _jsx(ArrowLeftIcon, {}),
                  }),
                }
              : {}),
            onKeyDown: handleKeyDown,
          }),
          _jsx(CommandPanel, {
            className: "max-h-[min(28rem,70vh)]",
            children: _jsx(CommandPaletteResults, {
              groups: displayedGroups,
              isActionsOnly: isActionsOnly,
              keybindings: keybindings,
              onExecuteItem: executeItem,
            }),
          }),
          _jsx(CommandFooter, {
            className: "gap-3 max-sm:flex-col max-sm:items-start",
            children: _jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                _jsxs(KbdGroup, {
                  className: "items-center gap-1.5",
                  children: [
                    _jsx(Kbd, { children: _jsx(ArrowUpIcon, {}) }),
                    _jsx(Kbd, { children: _jsx(ArrowDownIcon, {}) }),
                    _jsx("span", {
                      className: cn("text-muted-foreground/80"),
                      children: "Navigate",
                    }),
                  ],
                }),
                _jsxs(KbdGroup, {
                  className: "items-center gap-1.5",
                  children: [
                    _jsx(Kbd, { children: "Enter" }),
                    _jsx("span", { className: cn("text-muted-foreground/80"), children: "Select" }),
                  ],
                }),
                isSubmenu
                  ? _jsxs(KbdGroup, {
                      className: "items-center gap-1.5",
                      children: [
                        _jsx(Kbd, { children: "Backspace" }),
                        _jsx("span", {
                          className: cn("text-muted-foreground/80"),
                          children: "Back",
                        }),
                      ],
                    })
                  : null,
                _jsxs(KbdGroup, {
                  className: "items-center gap-1.5",
                  children: [
                    _jsx(Kbd, { children: "Esc" }),
                    _jsx("span", { className: cn("text-muted-foreground/80"), children: "Close" }),
                  ],
                }),
              ],
            }),
          }),
        ],
      },
      viewStack.length,
    ),
  });
}
