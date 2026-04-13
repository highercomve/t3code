import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { parsePatchFiles } from "@pierre/diffs";
import { FileDiff, Virtualizer } from "@pierre/diffs/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { scopeThreadRef } from "@t3tools/client-runtime";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Columns2Icon,
  Rows3Icon,
  TextWrapIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { openInPreferredEditor } from "../editorPreferences";
import { useGitStatus } from "~/lib/gitStatusState";
import { checkpointDiffQueryOptions } from "~/lib/providerReactQuery";
import { cn } from "~/lib/utils";
import { readLocalApi } from "../localApi";
import { resolvePathLinkTarget } from "../terminal-links";
import { parseDiffRouteSearch, stripDiffSearchParams } from "../diffRouteSearch";
import { useTheme } from "../hooks/useTheme";
import { buildPatchCacheKey } from "../lib/diffRendering";
import { resolveDiffThemeName } from "../lib/diffRendering";
import { useTurnDiffSummaries } from "../hooks/useTurnDiffSummaries";
import { selectProjectByRef, useStore } from "../store";
import { createThreadSelectorByRef } from "../storeSelectors";
import { buildThreadRouteParams, resolveThreadRouteRef } from "../threadRoutes";
import { useSettings } from "../hooks/useSettings";
import { formatShortTimestamp } from "../timestampFormat";
import { DiffPanelLoadingState, DiffPanelShell } from "./DiffPanelShell";
import { ToggleGroup, Toggle } from "./ui/toggle-group";
const DIFF_PANEL_UNSAFE_CSS = `
[data-diffs-header],
[data-diff],
[data-file],
[data-error-wrapper],
[data-virtualizer-buffer] {
  --diffs-bg: color-mix(in srgb, var(--card) 90%, var(--background)) !important;
  --diffs-light-bg: color-mix(in srgb, var(--card) 90%, var(--background)) !important;
  --diffs-dark-bg: color-mix(in srgb, var(--card) 90%, var(--background)) !important;
  --diffs-token-light-bg: transparent;
  --diffs-token-dark-bg: transparent;

  --diffs-bg-context-override: color-mix(in srgb, var(--background) 97%, var(--foreground));
  --diffs-bg-hover-override: color-mix(in srgb, var(--background) 94%, var(--foreground));
  --diffs-bg-separator-override: color-mix(in srgb, var(--background) 95%, var(--foreground));
  --diffs-bg-buffer-override: color-mix(in srgb, var(--background) 90%, var(--foreground));

  --diffs-bg-addition-override: color-mix(in srgb, var(--background) 92%, var(--success));
  --diffs-bg-addition-number-override: color-mix(in srgb, var(--background) 88%, var(--success));
  --diffs-bg-addition-hover-override: color-mix(in srgb, var(--background) 85%, var(--success));
  --diffs-bg-addition-emphasis-override: color-mix(in srgb, var(--background) 80%, var(--success));

  --diffs-bg-deletion-override: color-mix(in srgb, var(--background) 92%, var(--destructive));
  --diffs-bg-deletion-number-override: color-mix(in srgb, var(--background) 88%, var(--destructive));
  --diffs-bg-deletion-hover-override: color-mix(in srgb, var(--background) 85%, var(--destructive));
  --diffs-bg-deletion-emphasis-override: color-mix(
    in srgb,
    var(--background) 80%,
    var(--destructive)
  );

  background-color: var(--diffs-bg) !important;
}

[data-file-info] {
  background-color: color-mix(in srgb, var(--card) 94%, var(--foreground)) !important;
  border-block-color: var(--border) !important;
  color: var(--foreground) !important;
}

[data-diffs-header] {
  position: sticky !important;
  top: 0;
  z-index: 4;
  background-color: color-mix(in srgb, var(--card) 94%, var(--foreground)) !important;
  border-bottom: 1px solid var(--border) !important;
}

[data-title] {
  cursor: pointer;
  transition:
    color 120ms ease,
    text-decoration-color 120ms ease;
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 2px;
}

[data-title]:hover {
  color: color-mix(in srgb, var(--foreground) 84%, var(--primary)) !important;
  text-decoration-color: currentColor;
}
`;
function getRenderablePatch(patch, cacheScope = "diff-panel") {
  if (!patch) return null;
  const normalizedPatch = patch.trim();
  if (normalizedPatch.length === 0) return null;
  try {
    const parsedPatches = parsePatchFiles(
      normalizedPatch,
      buildPatchCacheKey(normalizedPatch, cacheScope),
    );
    const files = parsedPatches.flatMap((parsedPatch) => parsedPatch.files);
    if (files.length > 0) {
      return { kind: "files", files };
    }
    return {
      kind: "raw",
      text: normalizedPatch,
      reason: "Unsupported diff format. Showing raw patch.",
    };
  } catch {
    return {
      kind: "raw",
      text: normalizedPatch,
      reason: "Failed to parse patch. Showing raw patch.",
    };
  }
}
function resolveFileDiffPath(fileDiff) {
  const raw = fileDiff.name ?? fileDiff.prevName ?? "";
  if (raw.startsWith("a/") || raw.startsWith("b/")) {
    return raw.slice(2);
  }
  return raw;
}
function buildFileDiffRenderKey(fileDiff) {
  return fileDiff.cacheKey ?? `${fileDiff.prevName ?? "none"}:${fileDiff.name}`;
}
export { DiffWorkerPoolProvider } from "./DiffWorkerPoolProvider";
export default function DiffPanel({ mode = "inline" }) {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const settings = useSettings();
  const [diffRenderMode, setDiffRenderMode] = useState("stacked");
  const [diffWordWrap, setDiffWordWrap] = useState(settings.diffWordWrap);
  const patchViewportRef = useRef(null);
  const turnStripRef = useRef(null);
  const previousDiffOpenRef = useRef(false);
  const [canScrollTurnStripLeft, setCanScrollTurnStripLeft] = useState(false);
  const [canScrollTurnStripRight, setCanScrollTurnStripRight] = useState(false);
  const routeThreadRef = useParams({
    strict: false,
    select: (params) => resolveThreadRouteRef(params),
  });
  const diffSearch = useSearch({ strict: false, select: (search) => parseDiffRouteSearch(search) });
  const diffOpen = diffSearch.diff === "1";
  const activeThreadId = routeThreadRef?.threadId ?? null;
  const activeThread = useStore(
    useMemo(() => createThreadSelectorByRef(routeThreadRef), [routeThreadRef]),
  );
  const activeProjectId = activeThread?.projectId ?? null;
  const activeProject = useStore((store) =>
    activeThread && activeProjectId
      ? selectProjectByRef(store, {
          environmentId: activeThread.environmentId,
          projectId: activeProjectId,
        })
      : undefined,
  );
  const activeCwd = activeThread?.worktreePath ?? activeProject?.cwd;
  const gitStatusQuery = useGitStatus({
    environmentId: activeThread?.environmentId ?? null,
    cwd: activeCwd ?? null,
  });
  const isGitRepo = gitStatusQuery.data?.isRepo ?? true;
  const { turnDiffSummaries, inferredCheckpointTurnCountByTurnId } =
    useTurnDiffSummaries(activeThread);
  const orderedTurnDiffSummaries = useMemo(
    () =>
      [...turnDiffSummaries].toSorted((left, right) => {
        const leftTurnCount =
          left.checkpointTurnCount ?? inferredCheckpointTurnCountByTurnId[left.turnId] ?? 0;
        const rightTurnCount =
          right.checkpointTurnCount ?? inferredCheckpointTurnCountByTurnId[right.turnId] ?? 0;
        if (leftTurnCount !== rightTurnCount) {
          return rightTurnCount - leftTurnCount;
        }
        return right.completedAt.localeCompare(left.completedAt);
      }),
    [inferredCheckpointTurnCountByTurnId, turnDiffSummaries],
  );
  const selectedTurnId = diffSearch.diffTurnId ?? null;
  const selectedFilePath = selectedTurnId !== null ? (diffSearch.diffFilePath ?? null) : null;
  const selectedTurn =
    selectedTurnId === null
      ? undefined
      : (orderedTurnDiffSummaries.find((summary) => summary.turnId === selectedTurnId) ??
        orderedTurnDiffSummaries[0]);
  const selectedCheckpointTurnCount =
    selectedTurn &&
    (selectedTurn.checkpointTurnCount ?? inferredCheckpointTurnCountByTurnId[selectedTurn.turnId]);
  const selectedCheckpointRange = useMemo(
    () =>
      typeof selectedCheckpointTurnCount === "number"
        ? {
            fromTurnCount: Math.max(0, selectedCheckpointTurnCount - 1),
            toTurnCount: selectedCheckpointTurnCount,
          }
        : null,
    [selectedCheckpointTurnCount],
  );
  const conversationCheckpointTurnCount = useMemo(() => {
    const turnCounts = orderedTurnDiffSummaries
      .map(
        (summary) =>
          summary.checkpointTurnCount ?? inferredCheckpointTurnCountByTurnId[summary.turnId],
      )
      .filter((value) => typeof value === "number");
    if (turnCounts.length === 0) {
      return undefined;
    }
    const latest = Math.max(...turnCounts);
    return latest > 0 ? latest : undefined;
  }, [inferredCheckpointTurnCountByTurnId, orderedTurnDiffSummaries]);
  const conversationCheckpointRange = useMemo(
    () =>
      !selectedTurn && typeof conversationCheckpointTurnCount === "number"
        ? {
            fromTurnCount: 0,
            toTurnCount: conversationCheckpointTurnCount,
          }
        : null,
    [conversationCheckpointTurnCount, selectedTurn],
  );
  const activeCheckpointRange = selectedTurn
    ? selectedCheckpointRange
    : conversationCheckpointRange;
  const conversationCacheScope = useMemo(() => {
    if (selectedTurn || orderedTurnDiffSummaries.length === 0) {
      return null;
    }
    return `conversation:${orderedTurnDiffSummaries.map((summary) => summary.turnId).join(",")}`;
  }, [orderedTurnDiffSummaries, selectedTurn]);
  const activeCheckpointDiffQuery = useQuery(
    checkpointDiffQueryOptions({
      environmentId: activeThread?.environmentId ?? null,
      threadId: activeThreadId,
      fromTurnCount: activeCheckpointRange?.fromTurnCount ?? null,
      toTurnCount: activeCheckpointRange?.toTurnCount ?? null,
      cacheScope: selectedTurn ? `turn:${selectedTurn.turnId}` : conversationCacheScope,
      enabled: isGitRepo,
    }),
  );
  const selectedTurnCheckpointDiff = selectedTurn
    ? activeCheckpointDiffQuery.data?.diff
    : undefined;
  const conversationCheckpointDiff = selectedTurn
    ? undefined
    : activeCheckpointDiffQuery.data?.diff;
  const isLoadingCheckpointDiff = activeCheckpointDiffQuery.isLoading;
  const checkpointDiffError =
    activeCheckpointDiffQuery.error instanceof Error
      ? activeCheckpointDiffQuery.error.message
      : activeCheckpointDiffQuery.error
        ? "Failed to load checkpoint diff."
        : null;
  const selectedPatch = selectedTurn ? selectedTurnCheckpointDiff : conversationCheckpointDiff;
  const hasResolvedPatch = typeof selectedPatch === "string";
  const hasNoNetChanges = hasResolvedPatch && selectedPatch.trim().length === 0;
  const renderablePatch = useMemo(
    () => getRenderablePatch(selectedPatch, `diff-panel:${resolvedTheme}`),
    [resolvedTheme, selectedPatch],
  );
  const renderableFiles = useMemo(() => {
    if (!renderablePatch || renderablePatch.kind !== "files") {
      return [];
    }
    return renderablePatch.files.toSorted((left, right) =>
      resolveFileDiffPath(left).localeCompare(resolveFileDiffPath(right), undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );
  }, [renderablePatch]);
  useEffect(() => {
    if (diffOpen && !previousDiffOpenRef.current) {
      setDiffWordWrap(settings.diffWordWrap);
    }
    previousDiffOpenRef.current = diffOpen;
  }, [diffOpen, settings.diffWordWrap]);
  useEffect(() => {
    if (!selectedFilePath || !patchViewportRef.current) {
      return;
    }
    const target = Array.from(
      patchViewportRef.current.querySelectorAll("[data-diff-file-path]"),
    ).find((element) => element.dataset.diffFilePath === selectedFilePath);
    target?.scrollIntoView({ block: "nearest" });
  }, [selectedFilePath, renderableFiles]);
  const openDiffFileInEditor = useCallback(
    (filePath) => {
      const api = readLocalApi();
      if (!api) return;
      const targetPath = activeCwd ? resolvePathLinkTarget(filePath, activeCwd) : filePath;
      void openInPreferredEditor(api, targetPath).catch((error) => {
        console.warn("Failed to open diff file in editor.", error);
      });
    },
    [activeCwd],
  );
  const selectTurn = (turnId) => {
    if (!activeThread) return;
    void navigate({
      to: "/$environmentId/$threadId",
      params: buildThreadRouteParams(scopeThreadRef(activeThread.environmentId, activeThread.id)),
      search: (previous) => {
        const rest = stripDiffSearchParams(previous);
        return { ...rest, diff: "1", diffTurnId: turnId };
      },
    });
  };
  const selectWholeConversation = () => {
    if (!activeThread) return;
    void navigate({
      to: "/$environmentId/$threadId",
      params: buildThreadRouteParams(scopeThreadRef(activeThread.environmentId, activeThread.id)),
      search: (previous) => {
        const rest = stripDiffSearchParams(previous);
        return { ...rest, diff: "1" };
      },
    });
  };
  const updateTurnStripScrollState = useCallback(() => {
    const element = turnStripRef.current;
    if (!element) {
      setCanScrollTurnStripLeft(false);
      setCanScrollTurnStripRight(false);
      return;
    }
    const maxScrollLeft = Math.max(0, element.scrollWidth - element.clientWidth);
    setCanScrollTurnStripLeft(element.scrollLeft > 4);
    setCanScrollTurnStripRight(element.scrollLeft < maxScrollLeft - 4);
  }, []);
  const scrollTurnStripBy = useCallback((offset) => {
    const element = turnStripRef.current;
    if (!element) return;
    element.scrollBy({ left: offset, behavior: "smooth" });
  }, []);
  const onTurnStripWheel = useCallback((event) => {
    const element = turnStripRef.current;
    if (!element) return;
    if (element.scrollWidth <= element.clientWidth + 1) return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    element.scrollBy({ left: event.deltaY, behavior: "auto" });
  }, []);
  useEffect(() => {
    const element = turnStripRef.current;
    if (!element) return;
    const frameId = window.requestAnimationFrame(() => updateTurnStripScrollState());
    const onScroll = () => updateTurnStripScrollState();
    element.addEventListener("scroll", onScroll, { passive: true });
    const resizeObserver = new ResizeObserver(() => updateTurnStripScrollState());
    resizeObserver.observe(element);
    return () => {
      window.cancelAnimationFrame(frameId);
      element.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
    };
  }, [updateTurnStripScrollState]);
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => updateTurnStripScrollState());
    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [orderedTurnDiffSummaries, selectedTurnId, updateTurnStripScrollState]);
  useEffect(() => {
    const element = turnStripRef.current;
    if (!element) return;
    const selectedChip = element.querySelector("[data-turn-chip-selected='true']");
    selectedChip?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [selectedTurn?.turnId, selectedTurnId]);
  const headerRow = _jsxs(_Fragment, {
    children: [
      _jsxs("div", {
        className: "relative min-w-0 flex-1 [-webkit-app-region:no-drag]",
        children: [
          _jsx("button", {
            type: "button",
            className: cn(
              "absolute left-0 top-1/2 z-20 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md border bg-background/90 text-muted-foreground transition-colors",
              canScrollTurnStripLeft
                ? "border-border/70 hover:border-border hover:text-foreground"
                : "cursor-not-allowed border-border/40 text-muted-foreground/40",
            ),
            onClick: () => scrollTurnStripBy(-180),
            disabled: !canScrollTurnStripLeft,
            "aria-label": "Scroll turn list left",
            children: _jsx(ChevronLeftIcon, { className: "size-3.5" }),
          }),
          _jsx("button", {
            type: "button",
            className: cn(
              "absolute right-0 top-1/2 z-20 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md border bg-background/90 text-muted-foreground transition-colors",
              canScrollTurnStripRight
                ? "border-border/70 hover:border-border hover:text-foreground"
                : "cursor-not-allowed border-border/40 text-muted-foreground/40",
            ),
            onClick: () => scrollTurnStripBy(180),
            disabled: !canScrollTurnStripRight,
            "aria-label": "Scroll turn list right",
            children: _jsx(ChevronRightIcon, { className: "size-3.5" }),
          }),
          _jsxs("div", {
            ref: turnStripRef,
            className: "turn-chip-strip flex gap-1 overflow-x-auto px-8 py-0.5",
            style:
              canScrollTurnStripLeft || canScrollTurnStripRight
                ? {
                    maskImage: `linear-gradient(to right, ${canScrollTurnStripLeft ? "transparent 24px, black 72px" : "black"}, ${canScrollTurnStripRight ? "black calc(100% - 72px), transparent calc(100% - 24px)" : "black"})`,
                  }
                : undefined,
            onWheel: onTurnStripWheel,
            children: [
              _jsx("button", {
                type: "button",
                className: "shrink-0 rounded-md",
                onClick: selectWholeConversation,
                "data-turn-chip-selected": selectedTurnId === null,
                children: _jsx("div", {
                  className: cn(
                    "rounded-md border px-2 py-1 text-left transition-colors",
                    selectedTurnId === null
                      ? "border-border bg-accent text-accent-foreground"
                      : "border-border/70 bg-background/70 text-muted-foreground/80 hover:border-border hover:text-foreground/80",
                  ),
                  children: _jsx("div", {
                    className: "text-[10px] leading-tight font-medium",
                    children: "All turns",
                  }),
                }),
              }),
              orderedTurnDiffSummaries.map((summary) =>
                _jsx(
                  "button",
                  {
                    type: "button",
                    className: "shrink-0 rounded-md",
                    onClick: () => selectTurn(summary.turnId),
                    title: summary.turnId,
                    "data-turn-chip-selected": summary.turnId === selectedTurn?.turnId,
                    children: _jsx("div", {
                      className: cn(
                        "rounded-md border px-2 py-1 text-left transition-colors",
                        summary.turnId === selectedTurn?.turnId
                          ? "border-border bg-accent text-accent-foreground"
                          : "border-border/70 bg-background/70 text-muted-foreground/80 hover:border-border hover:text-foreground/80",
                      ),
                      children: _jsxs("div", {
                        className: "flex items-center gap-1",
                        children: [
                          _jsxs("span", {
                            className: "text-[10px] leading-tight font-medium",
                            children: [
                              "Turn",
                              " ",
                              summary.checkpointTurnCount ??
                                inferredCheckpointTurnCountByTurnId[summary.turnId] ??
                                "?",
                            ],
                          }),
                          _jsx("span", {
                            className: "text-[9px] leading-tight opacity-70",
                            children: formatShortTimestamp(
                              summary.completedAt,
                              settings.timestampFormat,
                            ),
                          }),
                        ],
                      }),
                    }),
                  },
                  summary.turnId,
                ),
              ),
            ],
          }),
        ],
      }),
      _jsxs("div", {
        className: "flex shrink-0 items-center gap-1 [-webkit-app-region:no-drag]",
        children: [
          _jsxs(ToggleGroup, {
            className: "shrink-0",
            variant: "outline",
            size: "xs",
            value: [diffRenderMode],
            onValueChange: (value) => {
              const next = value[0];
              if (next === "stacked" || next === "split") {
                setDiffRenderMode(next);
              }
            },
            children: [
              _jsx(Toggle, {
                "aria-label": "Stacked diff view",
                value: "stacked",
                children: _jsx(Rows3Icon, { className: "size-3" }),
              }),
              _jsx(Toggle, {
                "aria-label": "Split diff view",
                value: "split",
                children: _jsx(Columns2Icon, { className: "size-3" }),
              }),
            ],
          }),
          _jsx(Toggle, {
            "aria-label": diffWordWrap ? "Disable diff line wrapping" : "Enable diff line wrapping",
            title: diffWordWrap ? "Disable line wrapping" : "Enable line wrapping",
            variant: "outline",
            size: "xs",
            pressed: diffWordWrap,
            onPressedChange: (pressed) => {
              setDiffWordWrap(Boolean(pressed));
            },
            children: _jsx(TextWrapIcon, { className: "size-3" }),
          }),
        ],
      }),
    ],
  });
  return _jsx(DiffPanelShell, {
    mode: mode,
    header: headerRow,
    children: !activeThread
      ? _jsx("div", {
          className:
            "flex flex-1 items-center justify-center px-5 text-center text-xs text-muted-foreground/70",
          children: "Select a thread to inspect turn diffs.",
        })
      : !isGitRepo
        ? _jsx("div", {
            className:
              "flex flex-1 items-center justify-center px-5 text-center text-xs text-muted-foreground/70",
            children: "Turn diffs are unavailable because this project is not a git repository.",
          })
        : orderedTurnDiffSummaries.length === 0
          ? _jsx("div", {
              className:
                "flex flex-1 items-center justify-center px-5 text-center text-xs text-muted-foreground/70",
              children: "No completed turns yet.",
            })
          : _jsx(_Fragment, {
              children: _jsxs("div", {
                ref: patchViewportRef,
                className: "diff-panel-viewport min-h-0 min-w-0 flex-1 overflow-hidden",
                children: [
                  checkpointDiffError &&
                    !renderablePatch &&
                    _jsx("div", {
                      className: "px-3",
                      children: _jsx("p", {
                        className: "mb-2 text-[11px] text-red-500/80",
                        children: checkpointDiffError,
                      }),
                    }),
                  !renderablePatch
                    ? isLoadingCheckpointDiff
                      ? _jsx(DiffPanelLoadingState, { label: "Loading checkpoint diff..." })
                      : _jsx("div", {
                          className:
                            "flex h-full items-center justify-center px-3 py-2 text-xs text-muted-foreground/70",
                          children: _jsx("p", {
                            children: hasNoNetChanges
                              ? "No net changes in this selection."
                              : "No patch available for this selection.",
                          }),
                        })
                    : renderablePatch.kind === "files"
                      ? _jsx(Virtualizer, {
                          className: "diff-render-surface h-full min-h-0 overflow-auto px-2 pb-2",
                          config: {
                            overscrollSize: 600,
                            intersectionObserverMargin: 1200,
                          },
                          children: renderableFiles.map((fileDiff) => {
                            const filePath = resolveFileDiffPath(fileDiff);
                            const fileKey = buildFileDiffRenderKey(fileDiff);
                            const themedFileKey = `${fileKey}:${resolvedTheme}`;
                            return _jsx(
                              "div",
                              {
                                "data-diff-file-path": filePath,
                                className: "diff-render-file mb-2 rounded-md first:mt-2 last:mb-0",
                                onClickCapture: (event) => {
                                  const nativeEvent = event.nativeEvent;
                                  const composedPath = nativeEvent.composedPath?.() ?? [];
                                  const clickedHeader = composedPath.some((node) => {
                                    if (!(node instanceof Element)) return false;
                                    return node.hasAttribute("data-title");
                                  });
                                  if (!clickedHeader) return;
                                  openDiffFileInEditor(filePath);
                                },
                                children: _jsx(FileDiff, {
                                  fileDiff: fileDiff,
                                  options: {
                                    diffStyle: diffRenderMode === "split" ? "split" : "unified",
                                    lineDiffType: "none",
                                    overflow: diffWordWrap ? "wrap" : "scroll",
                                    theme: resolveDiffThemeName(resolvedTheme),
                                    themeType: resolvedTheme,
                                    unsafeCSS: DIFF_PANEL_UNSAFE_CSS,
                                  },
                                }),
                              },
                              themedFileKey,
                            );
                          }),
                        })
                      : _jsx("div", {
                          className: "h-full overflow-auto p-2",
                          children: _jsxs("div", {
                            className: "space-y-2",
                            children: [
                              _jsx("p", {
                                className: "text-[11px] text-muted-foreground/75",
                                children: renderablePatch.reason,
                              }),
                              _jsx("pre", {
                                className: cn(
                                  "max-h-[72vh] rounded-md border border-border/70 bg-background/70 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground/90",
                                  diffWordWrap
                                    ? "overflow-auto whitespace-pre-wrap wrap-break-word"
                                    : "overflow-auto",
                                ),
                                children: renderablePatch.text,
                              }),
                            ],
                          }),
                        }),
                ],
              }),
            }),
  });
}
