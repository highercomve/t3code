import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createContext, memo, use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LegendList } from "@legendapp/list/react";
import { formatElapsed } from "../../session-logic";
import { summarizeTurnDiffStats } from "../../lib/turnDiffTree";
import ChatMarkdown from "../ChatMarkdown";
import {
  BotIcon,
  CheckIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  EyeIcon,
  GlobeIcon,
  HammerIcon,
  SquarePenIcon,
  TerminalIcon,
  Undo2Icon,
  WrenchIcon,
  ZapIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { buildExpandedImagePreview } from "./ExpandedImagePreview";
import { ProposedPlanCard } from "./ProposedPlanCard";
import { ChangedFilesTree } from "./ChangedFilesTree";
import { DiffStatLabel, hasNonZeroStat } from "./DiffStatLabel";
import { MessageCopyButton } from "./MessageCopyButton";
import {
  computeStableMessagesTimelineRows,
  MAX_VISIBLE_WORK_LOG_ENTRIES,
  deriveMessagesTimelineRows,
  normalizeCompactToolLabel,
  resolveAssistantMessageCopyState,
} from "./MessagesTimeline.logic";
import { TerminalContextInlineChip } from "./TerminalContextInlineChip";
import { Tooltip, TooltipPopup, TooltipTrigger } from "../ui/tooltip";
import { deriveDisplayedUserMessageState } from "~/lib/terminalContext";
import { cn } from "~/lib/utils";
import { useUiStateStore } from "~/uiStateStore";
import { formatTimestamp } from "../../timestampFormat";
import {
  buildInlineTerminalContextText,
  formatInlineTerminalContextLabel,
  textContainsInlineTerminalContextLabels,
} from "./userMessageTerminalContexts";
import { ToolCallBlock, ThinkingBlock } from "./ToolCallBlock";
import { ContextToolGroup, isContextGatheringTool } from "./ContextToolGroup";
const TimelineRowCtx = createContext(null);
// ---------------------------------------------------------------------------
// MessagesTimeline — list owner
// ---------------------------------------------------------------------------
export const MessagesTimeline = memo(function MessagesTimeline({
  isWorking,
  activeTurnInProgress,
  activeTurnId,
  activeTurnStartedAt,
  listRef,
  timelineEntries,
  completionDividerBeforeEntryId,
  completionSummary,
  turnDiffSummaryByAssistantMessageId,
  routeThreadKey,
  onOpenTurnDiff,
  revertTurnCountByUserMessageId,
  onRevertUserMessage,
  isRevertingCheckpoint,
  onImageExpand,
  activeThreadEnvironmentId,
  markdownCwd,
  resolvedTheme,
  timestampFormat,
  workspaceRoot,
  onIsAtEndChange,
}) {
  const rawRows = useMemo(
    () =>
      deriveMessagesTimelineRows({
        timelineEntries,
        completionDividerBeforeEntryId,
        isWorking,
        activeTurnStartedAt,
        turnDiffSummaryByAssistantMessageId,
        revertTurnCountByUserMessageId,
      }),
    [
      timelineEntries,
      completionDividerBeforeEntryId,
      isWorking,
      activeTurnStartedAt,
      turnDiffSummaryByAssistantMessageId,
      revertTurnCountByUserMessageId,
    ],
  );
  const rows = useStableRows(rawRows);
  const handleScroll = useCallback(() => {
    const state = listRef.current?.getState?.();
    if (state) {
      onIsAtEndChange(state.isAtEnd);
    }
  }, [listRef, onIsAtEndChange]);
  const previousRowCountRef = useRef(rows.length);
  useEffect(() => {
    const previousRowCount = previousRowCountRef.current;
    previousRowCountRef.current = rows.length;
    if (previousRowCount > 0 || rows.length === 0) {
      return;
    }
    onIsAtEndChange(true);
    const frameId = window.requestAnimationFrame(() => {
      void listRef.current?.scrollToEnd?.({ animated: false });
    });
    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [listRef, onIsAtEndChange, rows.length]);
  // Memoised context value — only changes on state transitions, NOT on
  // every streaming chunk. Callbacks from ChatView are useCallback-stable.
  const sharedState = useMemo(
    () => ({
      activeTurnInProgress,
      activeTurnId: activeTurnId ?? null,
      isWorking,
      isRevertingCheckpoint,
      completionSummary,
      timestampFormat,
      routeThreadKey,
      markdownCwd,
      resolvedTheme,
      workspaceRoot,
      activeThreadEnvironmentId,
      onRevertUserMessage,
      onImageExpand,
      onOpenTurnDiff,
    }),
    [
      activeTurnInProgress,
      activeTurnId,
      isWorking,
      isRevertingCheckpoint,
      completionSummary,
      timestampFormat,
      routeThreadKey,
      markdownCwd,
      resolvedTheme,
      workspaceRoot,
      activeThreadEnvironmentId,
      onRevertUserMessage,
      onImageExpand,
      onOpenTurnDiff,
    ],
  );
  // Stable renderItem — no closure deps. Row components read shared state
  // from TimelineRowCtx, which propagates through LegendList's memo.
  const renderItem = useCallback(
    ({ item }) =>
      _jsx("div", {
        className: "mx-auto w-full min-w-0 max-w-3xl overflow-x-hidden",
        "data-timeline-root": "true",
        children: _jsx(TimelineRowContent, { row: item }),
      }),
    [],
  );
  if (rows.length === 0 && !isWorking) {
    return _jsx("div", {
      className: "flex h-full items-center justify-center",
      children: _jsx("p", {
        className: "text-sm text-muted-foreground/30",
        children: "Send a message to start the conversation.",
      }),
    });
  }
  return _jsx(TimelineRowCtx.Provider, {
    value: sharedState,
    children: _jsx(LegendList, {
      ref: listRef,
      data: rows,
      keyExtractor: keyExtractor,
      renderItem: renderItem,
      estimatedItemSize: 90,
      initialScrollAtEnd: true,
      maintainScrollAtEnd: true,
      maintainScrollAtEndThreshold: 0.1,
      maintainVisibleContentPosition: true,
      onScroll: handleScroll,
      className: "h-full overflow-x-hidden overscroll-y-contain px-3 sm:px-5",
      ListHeaderComponent: _jsx("div", { className: "h-3 sm:h-4" }),
      ListFooterComponent: _jsx("div", { className: "h-3 sm:h-4" }),
    }),
  });
});
function keyExtractor(item) {
  return item.id;
}
function TimelineRowContent({ row }) {
  const ctx = use(TimelineRowCtx);
  const [expandedWorkGroups, setExpandedWorkGroups] = useState({});
  const onToggleWorkGroup = useCallback((groupId) => {
    setExpandedWorkGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  }, []);
  return _jsxs("div", {
    className: cn(
      "pb-4",
      row.kind === "message" && row.message.role === "assistant" ? "group/assistant" : null,
    ),
    "data-timeline-row-id": row.id,
    "data-timeline-row-kind": row.kind,
    "data-message-id": row.kind === "message" ? row.message.id : undefined,
    "data-message-role": row.kind === "message" ? row.message.role : undefined,
    children: [
      row.kind === "work" &&
        (() => {
          const groupId = row.id;
          const groupedEntries = row.groupedEntries;
          const isExpanded = expandedWorkGroups[groupId] ?? false;
          const thinkingEntries = groupedEntries.filter((entry) => entry.tone === "thinking");
          const toolEntries = groupedEntries.filter((entry) => entry.tone !== "thinking");
          const contextTools = toolEntries.filter(isContextGatheringTool);
          const otherTools = toolEntries.filter((entry) => !isContextGatheringTool(entry));
          const hasOverflow = otherTools.length > MAX_VISIBLE_WORK_LOG_ENTRIES;
          const visibleOtherTools =
            hasOverflow && !isExpanded
              ? otherTools.slice(-MAX_VISIBLE_WORK_LOG_ENTRIES)
              : otherTools;
          const hiddenCount = otherTools.length - visibleOtherTools.length;
          return _jsxs("div", {
            className: "space-y-1.5",
            children: [
              thinkingEntries.length > 0 &&
                _jsx("div", {
                  className: "space-y-1",
                  children: thinkingEntries.map((entry) =>
                    _jsx(ThinkingBlock, { entry: entry }, `thinking:${entry.id}`),
                  ),
                }),
              contextTools.length > 0 &&
                _jsx(ContextToolGroup, {
                  entries: contextTools,
                  defaultOpen: contextTools.length <= 3,
                }),
              otherTools.length > 0 &&
                _jsxs("div", {
                  className: "rounded-xl border border-border/45 bg-card/25 px-2 py-1.5",
                  children: [
                    _jsxs("div", {
                      className: "mb-1.5 flex items-center justify-between gap-2 px-0.5",
                      children: [
                        _jsxs("p", {
                          className:
                            "text-[9px] uppercase tracking-[0.16em] text-muted-foreground/55",
                          children: ["Tool calls (", otherTools.length, ")"],
                        }),
                        hasOverflow &&
                          _jsx("button", {
                            type: "button",
                            className:
                              "text-[9px] uppercase tracking-[0.12em] text-muted-foreground/55 transition-colors duration-150 hover:text-foreground/75",
                            onClick: () => onToggleWorkGroup(groupId),
                            children: isExpanded ? "Show less" : `Show ${hiddenCount} more`,
                          }),
                      ],
                    }),
                    _jsx("div", {
                      className: "space-y-1",
                      children: visibleOtherTools.map((workEntry) =>
                        _jsx(ToolCallBlock, { entry: workEntry }, `tool:${workEntry.id}`),
                      ),
                    }),
                  ],
                }),
            ],
          });
        })(),
      row.kind === "message" &&
        row.message.role === "user" &&
        (() => {
          const userImages = row.message.attachments ?? [];
          const displayedUserMessage = deriveDisplayedUserMessageState(row.message.text);
          const terminalContexts = displayedUserMessage.contexts;
          const canRevertAgentWork = typeof row.revertTurnCount === "number";
          return _jsx("div", {
            className: "flex justify-end",
            children: _jsxs("div", {
              className:
                "group relative max-w-[80%] rounded-2xl rounded-br-sm border border-border bg-secondary px-4 py-3",
              children: [
                userImages.length > 0 &&
                  _jsx("div", {
                    className: "mb-2 grid max-w-[420px] grid-cols-2 gap-2",
                    children: userImages.map((image) =>
                      _jsx(
                        "div",
                        {
                          className:
                            "overflow-hidden rounded-lg border border-border/80 bg-background/70",
                          children: image.previewUrl
                            ? _jsx("button", {
                                type: "button",
                                className: "h-full w-full cursor-zoom-in",
                                "aria-label": `Preview ${image.name}`,
                                onClick: () => {
                                  const preview = buildExpandedImagePreview(userImages, image.id);
                                  if (!preview) return;
                                  ctx.onImageExpand(preview);
                                },
                                children: _jsx("img", {
                                  src: image.previewUrl,
                                  alt: image.name,
                                  className: "block h-auto max-h-[220px] w-full object-cover",
                                }),
                              })
                            : _jsx("div", {
                                className:
                                  "flex min-h-[72px] items-center justify-center px-2 py-3 text-center text-[11px] text-muted-foreground/70",
                                children: image.name,
                              }),
                        },
                        image.id,
                      ),
                    ),
                  }),
                (displayedUserMessage.visibleText.trim().length > 0 ||
                  terminalContexts.length > 0) &&
                  _jsx(UserMessageBody, {
                    text: displayedUserMessage.visibleText,
                    terminalContexts: terminalContexts,
                  }),
                _jsxs("div", {
                  className: "mt-1.5 flex items-center justify-end gap-2",
                  children: [
                    _jsxs("div", {
                      className:
                        "flex items-center gap-1.5 opacity-0 transition-opacity duration-200 focus-within:opacity-100 group-hover:opacity-100",
                      children: [
                        displayedUserMessage.copyText &&
                          _jsx(MessageCopyButton, { text: displayedUserMessage.copyText }),
                        canRevertAgentWork &&
                          _jsx(Button, {
                            type: "button",
                            size: "xs",
                            variant: "outline",
                            disabled: ctx.isRevertingCheckpoint || ctx.isWorking,
                            onClick: () => ctx.onRevertUserMessage(row.message.id),
                            title: "Revert to this message",
                            children: _jsx(Undo2Icon, { className: "size-3" }),
                          }),
                      ],
                    }),
                    _jsx("p", {
                      className: "text-right text-xs text-muted-foreground/50",
                      children: formatTimestamp(row.message.createdAt, ctx.timestampFormat),
                    }),
                  ],
                }),
              ],
            }),
          });
        })(),
      row.kind === "message" &&
        row.message.role === "assistant" &&
        (() => {
          const messageText = row.message.text || (row.message.streaming ? "" : "(empty response)");
          const assistantTurnStillInProgress =
            ctx.activeTurnInProgress &&
            ctx.activeTurnId !== null &&
            ctx.activeTurnId !== undefined &&
            row.message.turnId === ctx.activeTurnId;
          const assistantCopyState = resolveAssistantMessageCopyState({
            text: row.message.text ?? null,
            showCopyButton: row.showAssistantCopyButton,
            streaming: row.message.streaming || assistantTurnStillInProgress,
          });
          return _jsxs(_Fragment, {
            children: [
              row.showCompletionDivider &&
                _jsxs("div", {
                  className: "my-3 flex items-center gap-3",
                  children: [
                    _jsx("span", { className: "h-px flex-1 bg-border" }),
                    _jsx("span", {
                      className:
                        "rounded-full border border-border bg-background px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground/80",
                      children: ctx.completionSummary
                        ? `Response • ${ctx.completionSummary}`
                        : "Response",
                    }),
                    _jsx("span", { className: "h-px flex-1 bg-border" }),
                  ],
                }),
              _jsxs("div", {
                className: "min-w-0 px-1 py-0.5",
                children: [
                  _jsx(ChatMarkdown, {
                    text: messageText,
                    cwd: ctx.markdownCwd,
                    isStreaming: Boolean(row.message.streaming),
                  }),
                  _jsx(AssistantChangedFilesSection, {
                    turnSummary: row.assistantTurnDiffSummary,
                    routeThreadKey: ctx.routeThreadKey,
                    resolvedTheme: ctx.resolvedTheme,
                    onOpenTurnDiff: ctx.onOpenTurnDiff,
                  }),
                  _jsxs("div", {
                    className: "mt-1.5 flex items-center gap-2",
                    children: [
                      _jsx("p", {
                        className: "text-[10px] text-muted-foreground/30",
                        children: row.message.streaming
                          ? _jsx(LiveMessageMeta, {
                              createdAt: row.message.createdAt,
                              durationStart: row.durationStart,
                              timestampFormat: ctx.timestampFormat,
                            })
                          : formatMessageMeta(
                              row.message.createdAt,
                              formatElapsed(row.durationStart, row.message.completedAt),
                              ctx.timestampFormat,
                            ),
                      }),
                      assistantCopyState.visible
                        ? _jsx("div", {
                            className:
                              "flex items-center opacity-0 transition-opacity duration-200  group-hover/assistant:opacity-100",
                            children: _jsx(MessageCopyButton, {
                              text: assistantCopyState.text ?? "",
                              size: "icon-xs",
                              variant: "outline",
                              className:
                                "border-border/50 bg-background/35 text-muted-foreground/45 shadow-none hover:border-border/70 hover:bg-background/55 hover:text-muted-foreground/70",
                            }),
                          })
                        : null,
                    ],
                  }),
                ],
              }),
            ],
          });
        })(),
      row.kind === "proposed-plan" &&
        _jsx("div", {
          className: "min-w-0 px-1 py-0.5",
          children: _jsx(ProposedPlanCard, {
            planMarkdown: row.proposedPlan.planMarkdown,
            environmentId: ctx.activeThreadEnvironmentId,
            cwd: ctx.markdownCwd,
            workspaceRoot: ctx.workspaceRoot,
          }),
        }),
      row.kind === "working" &&
        _jsx("div", {
          className: "py-0.5 pl-1.5",
          children: _jsxs("div", {
            className: "flex items-center gap-2 pt-1 text-[11px] text-muted-foreground/70",
            children: [
              _jsxs("span", {
                className: "inline-flex items-center gap-[3px]",
                children: [
                  _jsx("span", {
                    className: "h-1 w-1 rounded-full bg-muted-foreground/30 animate-pulse",
                  }),
                  _jsx("span", {
                    className:
                      "h-1 w-1 rounded-full bg-muted-foreground/30 animate-pulse [animation-delay:200ms]",
                  }),
                  _jsx("span", {
                    className:
                      "h-1 w-1 rounded-full bg-muted-foreground/30 animate-pulse [animation-delay:400ms]",
                  }),
                ],
              }),
              _jsx("span", {
                children: row.createdAt
                  ? _jsxs(_Fragment, {
                      children: ["Working for ", _jsx(WorkingTimer, { createdAt: row.createdAt })],
                    })
                  : "Working...",
              }),
            ],
          }),
        }),
    ],
  });
}
// ---------------------------------------------------------------------------
// Self-ticking components — bypass LegendList memoisation entirely.
// Each owns a `nowMs` state value consumed in the render output so the
// React Compiler cannot elide the re-render as a no-op.
// ---------------------------------------------------------------------------
/** Live "Working for Xs" label. */
function WorkingTimer({ createdAt }) {
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, [createdAt]);
  return _jsx(_Fragment, {
    children: formatWorkingTimer(createdAt, new Date(nowMs).toISOString()) ?? "0s",
  });
}
/** Live timestamp + elapsed duration for a streaming assistant message. */
function LiveMessageMeta({ createdAt, durationStart, timestampFormat }) {
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, [durationStart]);
  const elapsed = durationStart
    ? formatElapsed(durationStart, new Date(nowMs).toISOString())
    : null;
  return _jsx(_Fragment, { children: formatMessageMeta(createdAt, elapsed, timestampFormat) });
}
// ---------------------------------------------------------------------------
// Extracted row sections — own their state / store subscriptions so changes
// re-render only the affected row, not the entire list.
// ---------------------------------------------------------------------------
/** Owns its own expand/collapse state so toggling re-renders only this row.
 *  State resets on unmount which is fine — work groups start collapsed. */
const WorkGroupSection = memo(function WorkGroupSection({ groupedEntries }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasOverflow = groupedEntries.length > MAX_VISIBLE_WORK_LOG_ENTRIES;
  const visibleEntries =
    hasOverflow && !isExpanded
      ? groupedEntries.slice(-MAX_VISIBLE_WORK_LOG_ENTRIES)
      : groupedEntries;
  const hiddenCount = groupedEntries.length - visibleEntries.length;
  const onlyToolEntries = groupedEntries.every((entry) => entry.tone === "tool");
  const showHeader = hasOverflow || !onlyToolEntries;
  const groupLabel = onlyToolEntries ? "Tool calls" : "Work log";
  return _jsxs("div", {
    className: "rounded-xl border border-border/45 bg-card/25 px-2 py-1.5",
    children: [
      showHeader &&
        _jsxs("div", {
          className: "mb-1.5 flex items-center justify-between gap-2 px-0.5",
          children: [
            _jsxs("p", {
              className: "text-[9px] uppercase tracking-[0.16em] text-muted-foreground/55",
              children: [groupLabel, " (", groupedEntries.length, ")"],
            }),
            hasOverflow &&
              _jsx("button", {
                type: "button",
                className:
                  "text-[9px] uppercase tracking-[0.12em] text-muted-foreground/55 transition-colors duration-150 hover:text-foreground/75",
                onClick: () => setIsExpanded((v) => !v),
                children: isExpanded ? "Show less" : `Show ${hiddenCount} more`,
              }),
          ],
        }),
      _jsx("div", {
        className: "space-y-0.5",
        children: visibleEntries.map((workEntry) =>
          _jsx(SimpleWorkEntryRow, { workEntry: workEntry }, `work-row:${workEntry.id}`),
        ),
      }),
    ],
  });
});
/** Subscribes directly to the UI state store for expand/collapse state,
 *  so toggling re-renders only this component — not the entire list. */
const AssistantChangedFilesSection = memo(function AssistantChangedFilesSection({
  turnSummary,
  routeThreadKey,
  resolvedTheme,
  onOpenTurnDiff,
}) {
  if (!turnSummary) return null;
  const checkpointFiles = turnSummary.files;
  if (checkpointFiles.length === 0) return null;
  return _jsx(AssistantChangedFilesSectionInner, {
    turnSummary: turnSummary,
    checkpointFiles: checkpointFiles,
    routeThreadKey: routeThreadKey,
    resolvedTheme: resolvedTheme,
    onOpenTurnDiff: onOpenTurnDiff,
  });
});
/** Inner component that only mounts when there are actual changed files,
 *  so the store subscription is unconditional (no hooks after early return). */
function AssistantChangedFilesSectionInner({
  turnSummary,
  checkpointFiles,
  routeThreadKey,
  resolvedTheme,
  onOpenTurnDiff,
}) {
  const allDirectoriesExpanded = useUiStateStore(
    (store) => store.threadChangedFilesExpandedById[routeThreadKey]?.[turnSummary.turnId] ?? true,
  );
  const setExpanded = useUiStateStore((store) => store.setThreadChangedFilesExpanded);
  const summaryStat = summarizeTurnDiffStats(checkpointFiles);
  const changedFileCountLabel = String(checkpointFiles.length);
  return _jsxs("div", {
    className: "mt-2 rounded-lg border border-border/80 bg-card/45 p-2.5",
    children: [
      _jsxs("div", {
        className: "mb-1.5 flex items-center justify-between gap-2",
        children: [
          _jsxs("p", {
            className: "text-[10px] uppercase tracking-[0.12em] text-muted-foreground/65",
            children: [
              _jsxs("span", { children: ["Changed files (", changedFileCountLabel, ")"] }),
              hasNonZeroStat(summaryStat) &&
                _jsxs(_Fragment, {
                  children: [
                    _jsx("span", { className: "mx-1", children: "\u2022" }),
                    _jsx(DiffStatLabel, {
                      additions: summaryStat.additions,
                      deletions: summaryStat.deletions,
                    }),
                  ],
                }),
            ],
          }),
          _jsxs("div", {
            className: "flex items-center gap-1.5",
            children: [
              _jsx(Button, {
                type: "button",
                size: "xs",
                variant: "outline",
                "data-scroll-anchor-ignore": true,
                onClick: () =>
                  setExpanded(routeThreadKey, turnSummary.turnId, !allDirectoriesExpanded),
                children: allDirectoriesExpanded ? "Collapse all" : "Expand all",
              }),
              _jsx(Button, {
                type: "button",
                size: "xs",
                variant: "outline",
                onClick: () => onOpenTurnDiff(turnSummary.turnId, checkpointFiles[0]?.path),
                children: "View diff",
              }),
            ],
          }),
        ],
      }),
      _jsx(
        ChangedFilesTree,
        {
          turnId: turnSummary.turnId,
          files: checkpointFiles,
          allDirectoriesExpanded: allDirectoriesExpanded,
          resolvedTheme: resolvedTheme,
          onOpenTurnDiff: onOpenTurnDiff,
        },
        `changed-files-tree:${turnSummary.turnId}`,
      ),
    ],
  });
}
// ---------------------------------------------------------------------------
// Leaf components
// ---------------------------------------------------------------------------
const UserMessageTerminalContextInlineLabel = memo(
  function UserMessageTerminalContextInlineLabel(props) {
    const tooltipText =
      props.context.body.length > 0
        ? `${props.context.header}\n${props.context.body}`
        : props.context.header;
    return _jsx(TerminalContextInlineChip, {
      label: props.context.header,
      tooltipText: tooltipText,
    });
  },
);
const UserMessageBody = memo(function UserMessageBody(props) {
  if (props.terminalContexts.length > 0) {
    const hasEmbeddedInlineLabels = textContainsInlineTerminalContextLabels(
      props.text,
      props.terminalContexts,
    );
    const inlinePrefix = buildInlineTerminalContextText(props.terminalContexts);
    const inlineNodes = [];
    if (hasEmbeddedInlineLabels) {
      let cursor = 0;
      for (const context of props.terminalContexts) {
        const label = formatInlineTerminalContextLabel(context.header);
        const matchIndex = props.text.indexOf(label, cursor);
        if (matchIndex === -1) {
          inlineNodes.length = 0;
          break;
        }
        if (matchIndex > cursor) {
          inlineNodes.push(
            _jsx(
              "span",
              { children: props.text.slice(cursor, matchIndex) },
              `user-terminal-context-inline-before:${context.header}:${cursor}`,
            ),
          );
        }
        inlineNodes.push(
          _jsx(
            UserMessageTerminalContextInlineLabel,
            { context: context },
            `user-terminal-context-inline:${context.header}`,
          ),
        );
        cursor = matchIndex + label.length;
      }
      if (inlineNodes.length > 0) {
        if (cursor < props.text.length) {
          inlineNodes.push(
            _jsx(
              "span",
              { children: props.text.slice(cursor) },
              `user-message-terminal-context-inline-rest:${cursor}`,
            ),
          );
        }
        return _jsx("div", {
          className: "whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-foreground",
          children: inlineNodes,
        });
      }
    }
    for (const context of props.terminalContexts) {
      inlineNodes.push(
        _jsx(
          UserMessageTerminalContextInlineLabel,
          { context: context },
          `user-terminal-context-inline:${context.header}`,
        ),
      );
      inlineNodes.push(
        _jsx(
          "span",
          { "aria-hidden": "true", children: " " },
          `user-terminal-context-inline-space:${context.header}`,
        ),
      );
    }
    if (props.text.length > 0) {
      inlineNodes.push(
        _jsx("span", { children: props.text }, "user-message-terminal-context-inline-text"),
      );
    } else if (inlinePrefix.length === 0) {
      return null;
    }
    return _jsx("div", {
      className: "whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-foreground",
      children: inlineNodes,
    });
  }
  if (props.text.length === 0) {
    return null;
  }
  return _jsx("div", {
    className: "whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-foreground",
    children: props.text,
  });
});
// ---------------------------------------------------------------------------
// Structural sharing — reuse old row references when data hasn't changed
// so LegendList (and React) can skip re-rendering unchanged items.
// ---------------------------------------------------------------------------
/** Returns a structurally-shared copy of `rows`: for each row whose content
 *  hasn't changed since last call, the previous object reference is reused. */
function useStableRows(rows) {
  const prevState = useRef({
    byId: new Map(),
    result: [],
  });
  return useMemo(() => {
    const nextState = computeStableMessagesTimelineRows(rows, prevState.current);
    prevState.current = nextState;
    return nextState.result;
  }, [rows]);
}
// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------
function formatWorkingTimer(startIso, endIso) {
  const startedAtMs = Date.parse(startIso);
  const endedAtMs = Date.parse(endIso);
  if (!Number.isFinite(startedAtMs) || !Number.isFinite(endedAtMs)) {
    return null;
  }
  const elapsedSeconds = Math.max(0, Math.floor((endedAtMs - startedAtMs) / 1000));
  if (elapsedSeconds < 60) {
    return `${elapsedSeconds}s`;
  }
  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
}
function formatMessageMeta(createdAt, duration, timestampFormat) {
  if (!duration) return formatTimestamp(createdAt, timestampFormat);
  return `${formatTimestamp(createdAt, timestampFormat)} • ${duration}`;
}
function workToneIcon(tone) {
  if (tone === "error") {
    return {
      icon: CircleAlertIcon,
      className: "text-foreground/92",
    };
  }
  if (tone === "thinking") {
    return {
      icon: BotIcon,
      className: "text-foreground/92",
    };
  }
  if (tone === "info") {
    return {
      icon: CheckIcon,
      className: "text-foreground/92",
    };
  }
  return {
    icon: ZapIcon,
    className: "text-foreground/92",
  };
}
function workToneClass(tone) {
  if (tone === "error") return "text-rose-300/50 dark:text-rose-300/50";
  if (tone === "tool") return "text-muted-foreground/70";
  if (tone === "thinking") return "text-muted-foreground/50";
  return "text-muted-foreground/40";
}
function workEntryPreview(workEntry) {
  if (
    workEntry.detail &&
    workEntry.itemType === "command_execution" &&
    isGenericCommandLauncher(workEntry.command)
  ) {
    return workEntry.detail;
  }
  if (workEntry.command) return workEntry.command;
  if (workEntry.detail) return workEntry.detail;
  if ((workEntry.changedFiles?.length ?? 0) === 0) return null;
  const [firstPath] = workEntry.changedFiles ?? [];
  if (!firstPath) return null;
  return workEntry.changedFiles.length === 1
    ? firstPath
    : `${firstPath} +${workEntry.changedFiles.length - 1} more`;
}
function isGenericCommandLauncher(command) {
  if (!command) {
    return false;
  }
  const normalized = command.trim().toLowerCase();
  return (
    normalized === "bash" ||
    normalized === "sh" ||
    normalized === "zsh" ||
    normalized === "fish" ||
    normalized === "cmd" ||
    normalized === "cmd.exe" ||
    normalized === "powershell" ||
    normalized === "pwsh"
  );
}
function workEntryRawCommand(workEntry) {
  const rawCommand = workEntry.rawCommand?.trim();
  if (!rawCommand || !workEntry.command) {
    return null;
  }
  return rawCommand === workEntry.command.trim() ? null : rawCommand;
}
function workEntryIcon(workEntry) {
  if (workEntry.requestKind === "command") return TerminalIcon;
  if (workEntry.requestKind === "file-read") return EyeIcon;
  if (workEntry.requestKind === "file-change") return SquarePenIcon;
  if (workEntry.itemType === "command_execution" || workEntry.command) {
    return TerminalIcon;
  }
  if (workEntry.itemType === "file_change" || (workEntry.changedFiles?.length ?? 0) > 0) {
    return SquarePenIcon;
  }
  if (workEntry.itemType === "web_search") return GlobeIcon;
  if (workEntry.itemType === "image_view") return EyeIcon;
  switch (workEntry.itemType) {
    case "mcp_tool_call":
      return WrenchIcon;
    case "dynamic_tool_call":
    case "collab_agent_tool_call":
      return HammerIcon;
  }
  return workToneIcon(workEntry.tone).icon;
}
function capitalizePhrase(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return value;
  }
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
}
function toolWorkEntryHeading(workEntry) {
  if (!workEntry.toolTitle) {
    return capitalizePhrase(normalizeCompactToolLabel(workEntry.label));
  }
  return capitalizePhrase(normalizeCompactToolLabel(workEntry.toolTitle));
}
const SimpleWorkEntryRow = memo(function SimpleWorkEntryRow(props) {
  const { workEntry } = props;
  const [expanded, setExpanded] = useState(false);
  const iconConfig = workToneIcon(workEntry.tone);
  const EntryIcon = workEntryIcon(workEntry);
  const heading = toolWorkEntryHeading(workEntry);
  const preview = workEntryPreview(workEntry);
  const rawCommand = workEntryRawCommand(workEntry);
  const displayText = preview ? `${heading} - ${preview}` : heading;
  const hasChangedFiles = (workEntry.changedFiles?.length ?? 0) > 0;
  const previewIsChangedFiles = hasChangedFiles && !workEntry.command && !workEntry.detail;
  const hasExpandableContent = !!(workEntry.detail || workEntry.command);
  return _jsxs("div", {
    className: cn("rounded-lg px-1 py-1", hasExpandableContent && "cursor-pointer"),
    onClick: hasExpandableContent ? () => setExpanded((prev) => !prev) : undefined,
    children: [
      _jsxs("div", {
        className: "flex items-center gap-2 transition-[opacity,translate] duration-200",
        children: [
          _jsx("span", {
            className: cn("flex size-5 shrink-0 items-center justify-center", iconConfig.className),
            children: _jsx(EntryIcon, { className: "size-3" }),
          }),
          _jsx("div", {
            className: "min-w-0 flex-1 overflow-hidden",
            children: _jsx("div", {
              className: "max-w-full",
              children: _jsxs("p", {
                className: cn(
                  "truncate text-xs leading-5",
                  workToneClass(workEntry.tone),
                  preview ? "text-muted-foreground/70" : "",
                ),
                title: rawCommand ? undefined : displayText,
                children: [
                  _jsx("span", {
                    className: cn("text-foreground/80", workToneClass(workEntry.tone)),
                    children: heading,
                  }),
                  preview &&
                    (rawCommand
                      ? _jsxs(Tooltip, {
                          children: [
                            _jsx(TooltipTrigger, {
                              closeDelay: 0,
                              delay: 75,
                              render: _jsxs("span", {
                                className:
                                  "max-w-full cursor-default text-muted-foreground/55 transition-colors hover:text-muted-foreground/75 focus-visible:text-muted-foreground/75",
                                children: [" ", "- ", preview],
                              }),
                            }),
                            _jsx(TooltipPopup, {
                              align: "start",
                              className: "max-w-[min(56rem,calc(100vw-2rem))] px-0 py-0",
                              side: "top",
                              children: _jsx("div", {
                                className:
                                  "max-w-[min(56rem,calc(100vw-2rem))] overflow-x-auto px-1.5 py-1 font-mono text-[11px] leading-4 whitespace-nowrap",
                                children: rawCommand,
                              }),
                            }),
                          ],
                        })
                      : _jsxs("span", {
                          className: "text-muted-foreground/55",
                          children: [" - ", preview],
                        })),
                ],
              }),
            }),
          }),
          hasExpandableContent &&
            _jsx(ChevronRightIcon, {
              className: cn(
                "size-3 shrink-0 text-muted-foreground/50 transition-transform duration-150",
                expanded && "rotate-90",
              ),
            }),
        ],
      }),
      expanded &&
        hasExpandableContent &&
        _jsxs("pre", {
          className:
            "text-[10px] text-muted-foreground/60 whitespace-pre-wrap break-all max-h-40 overflow-y-auto bg-background/50 rounded px-2 py-1 mt-1 ml-7 font-mono",
          children: [
            workEntry.command && workEntry.command,
            workEntry.command && workEntry.detail && "\n\n",
            workEntry.detail && workEntry.detail,
          ],
        }),
      hasChangedFiles &&
        !previewIsChangedFiles &&
        _jsxs("div", {
          className: "mt-1 flex flex-wrap gap-1 pl-6",
          children: [
            workEntry.changedFiles?.slice(0, 4).map((filePath) =>
              _jsx(
                "span",
                {
                  className:
                    "rounded-md border border-border/55 bg-background/75 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/75",
                  title: filePath,
                  children: filePath,
                },
                `${workEntry.id}:${filePath}`,
              ),
            ),
            (workEntry.changedFiles?.length ?? 0) > 4 &&
              _jsxs("span", {
                className: "px-1 text-[10px] text-muted-foreground/55",
                children: ["+", (workEntry.changedFiles?.length ?? 0) - 4],
              }),
          ],
        }),
    ],
  });
});
