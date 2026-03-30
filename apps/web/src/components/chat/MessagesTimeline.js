import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { measureElement as measureVirtualElement, useVirtualizer } from "@tanstack/react-virtual";
import { formatElapsed } from "../../session-logic";
import { AUTO_SCROLL_BOTTOM_THRESHOLD_PX } from "../../chat-scroll";
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
import { clamp } from "effect/Number";
import { estimateTimelineMessageHeight } from "../timelineHeight";
import { buildExpandedImagePreview } from "./ExpandedImagePreview";
import { ProposedPlanCard } from "./ProposedPlanCard";
import { ChangedFilesTree } from "./ChangedFilesTree";
import { DiffStatLabel, hasNonZeroStat } from "./DiffStatLabel";
import { MessageCopyButton } from "./MessageCopyButton";
import { computeMessageDurationStart, normalizeCompactToolLabel } from "./MessagesTimeline.logic";
import { TerminalContextInlineChip } from "./TerminalContextInlineChip";
import { deriveDisplayedUserMessageState } from "~/lib/terminalContext";
import { cn } from "~/lib/utils";
import { formatTimestamp } from "../../timestampFormat";
import {
  buildInlineTerminalContextText,
  formatInlineTerminalContextLabel,
  textContainsInlineTerminalContextLabels,
} from "./userMessageTerminalContexts";
const MAX_VISIBLE_WORK_LOG_ENTRIES = 6;
const ALWAYS_UNVIRTUALIZED_TAIL_ROWS = 8;
export const MessagesTimeline = memo(function MessagesTimeline({
  hasMessages,
  isWorking,
  activeTurnInProgress,
  activeTurnStartedAt,
  scrollContainer,
  timelineEntries,
  completionDividerBeforeEntryId,
  completionSummary,
  turnDiffSummaryByAssistantMessageId,
  nowIso,
  expandedWorkGroups,
  onToggleWorkGroup,
  onOpenTurnDiff,
  revertTurnCountByUserMessageId,
  onRevertUserMessage,
  isRevertingCheckpoint,
  onImageExpand,
  markdownCwd,
  resolvedTheme,
  timestampFormat,
  workspaceRoot,
}) {
  const timelineRootRef = useRef(null);
  const [timelineWidthPx, setTimelineWidthPx] = useState(null);
  useLayoutEffect(() => {
    const timelineRoot = timelineRootRef.current;
    if (!timelineRoot) return;
    const updateWidth = (nextWidth) => {
      setTimelineWidthPx((previousWidth) => {
        if (previousWidth !== null && Math.abs(previousWidth - nextWidth) < 0.5) {
          return previousWidth;
        }
        return nextWidth;
      });
    };
    updateWidth(timelineRoot.getBoundingClientRect().width);
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      updateWidth(timelineRoot.getBoundingClientRect().width);
    });
    observer.observe(timelineRoot);
    return () => {
      observer.disconnect();
    };
  }, [hasMessages, isWorking]);
  const rows = useMemo(() => {
    const nextRows = [];
    const durationStartByMessageId = computeMessageDurationStart(
      timelineEntries.flatMap((entry) => (entry.kind === "message" ? [entry.message] : [])),
    );
    for (let index = 0; index < timelineEntries.length; index += 1) {
      const timelineEntry = timelineEntries[index];
      if (!timelineEntry) {
        continue;
      }
      if (timelineEntry.kind === "work") {
        const groupedEntries = [timelineEntry.entry];
        let cursor = index + 1;
        while (cursor < timelineEntries.length) {
          const nextEntry = timelineEntries[cursor];
          if (!nextEntry || nextEntry.kind !== "work") break;
          groupedEntries.push(nextEntry.entry);
          cursor += 1;
        }
        nextRows.push({
          kind: "work",
          id: timelineEntry.id,
          createdAt: timelineEntry.createdAt,
          groupedEntries,
        });
        index = cursor - 1;
        continue;
      }
      if (timelineEntry.kind === "proposed-plan") {
        nextRows.push({
          kind: "proposed-plan",
          id: timelineEntry.id,
          createdAt: timelineEntry.createdAt,
          proposedPlan: timelineEntry.proposedPlan,
        });
        continue;
      }
      nextRows.push({
        kind: "message",
        id: timelineEntry.id,
        createdAt: timelineEntry.createdAt,
        message: timelineEntry.message,
        durationStart:
          durationStartByMessageId.get(timelineEntry.message.id) ?? timelineEntry.message.createdAt,
        showCompletionDivider:
          timelineEntry.message.role === "assistant" &&
          completionDividerBeforeEntryId === timelineEntry.id,
      });
    }
    if (isWorking) {
      nextRows.push({
        kind: "working",
        id: "working-indicator-row",
        createdAt: activeTurnStartedAt,
      });
    }
    return nextRows;
  }, [timelineEntries, completionDividerBeforeEntryId, isWorking, activeTurnStartedAt]);
  const firstUnvirtualizedRowIndex = useMemo(() => {
    const firstTailRowIndex = Math.max(rows.length - ALWAYS_UNVIRTUALIZED_TAIL_ROWS, 0);
    if (!activeTurnInProgress) return firstTailRowIndex;
    const turnStartedAtMs =
      typeof activeTurnStartedAt === "string" ? Date.parse(activeTurnStartedAt) : Number.NaN;
    let firstCurrentTurnRowIndex = -1;
    if (!Number.isNaN(turnStartedAtMs)) {
      firstCurrentTurnRowIndex = rows.findIndex((row) => {
        if (row.kind === "working") return true;
        if (!row.createdAt) return false;
        const rowCreatedAtMs = Date.parse(row.createdAt);
        return !Number.isNaN(rowCreatedAtMs) && rowCreatedAtMs >= turnStartedAtMs;
      });
    }
    if (firstCurrentTurnRowIndex < 0) {
      firstCurrentTurnRowIndex = rows.findIndex(
        (row) => row.kind === "message" && row.message.streaming,
      );
    }
    if (firstCurrentTurnRowIndex < 0) return firstTailRowIndex;
    for (let index = firstCurrentTurnRowIndex - 1; index >= 0; index -= 1) {
      const previousRow = rows[index];
      if (!previousRow || previousRow.kind !== "message") continue;
      if (previousRow.message.role === "user") {
        return Math.min(index, firstTailRowIndex);
      }
      if (previousRow.message.role === "assistant" && !previousRow.message.streaming) {
        break;
      }
    }
    return Math.min(firstCurrentTurnRowIndex, firstTailRowIndex);
  }, [activeTurnInProgress, activeTurnStartedAt, rows]);
  const virtualizedRowCount = clamp(firstUnvirtualizedRowIndex, {
    minimum: 0,
    maximum: rows.length,
  });
  const rowVirtualizer = useVirtualizer({
    count: virtualizedRowCount,
    getScrollElement: () => scrollContainer,
    // Use stable row ids so virtual measurements do not leak across thread switches.
    getItemKey: (index) => rows[index]?.id ?? index,
    estimateSize: (index) => {
      const row = rows[index];
      if (!row) return 96;
      if (row.kind === "work") return 112;
      if (row.kind === "proposed-plan") return estimateTimelineProposedPlanHeight(row.proposedPlan);
      if (row.kind === "working") return 40;
      return estimateTimelineMessageHeight(row.message, { timelineWidthPx });
    },
    measureElement: measureVirtualElement,
    useAnimationFrameWithResizeObserver: true,
    overscan: 8,
  });
  useEffect(() => {
    if (timelineWidthPx === null) return;
    rowVirtualizer.measure();
  }, [rowVirtualizer, timelineWidthPx]);
  useEffect(() => {
    rowVirtualizer.shouldAdjustScrollPositionOnItemSizeChange = (_item, _delta, instance) => {
      const viewportHeight = instance.scrollRect?.height ?? 0;
      const scrollOffset = instance.scrollOffset ?? 0;
      const remainingDistance = instance.getTotalSize() - (scrollOffset + viewportHeight);
      return remainingDistance > AUTO_SCROLL_BOTTOM_THRESHOLD_PX;
    };
    return () => {
      rowVirtualizer.shouldAdjustScrollPositionOnItemSizeChange = undefined;
    };
  }, [rowVirtualizer]);
  const pendingMeasureFrameRef = useRef(null);
  const onTimelineImageLoad = useCallback(() => {
    if (pendingMeasureFrameRef.current !== null) return;
    pendingMeasureFrameRef.current = window.requestAnimationFrame(() => {
      pendingMeasureFrameRef.current = null;
      rowVirtualizer.measure();
    });
  }, [rowVirtualizer]);
  useEffect(() => {
    return () => {
      const frame = pendingMeasureFrameRef.current;
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);
  const virtualRows = rowVirtualizer.getVirtualItems();
  const nonVirtualizedRows = rows.slice(virtualizedRowCount);
  const [allDirectoriesExpandedByTurnId, setAllDirectoriesExpandedByTurnId] = useState({});
  const onToggleAllDirectories = useCallback((turnId) => {
    setAllDirectoriesExpandedByTurnId((current) => ({
      ...current,
      [turnId]: !(current[turnId] ?? true),
    }));
  }, []);
  const renderRowContent = (row) =>
    _jsxs("div", {
      className: "pb-4",
      "data-timeline-row-kind": row.kind,
      "data-message-id": row.kind === "message" ? row.message.id : undefined,
      "data-message-role": row.kind === "message" ? row.message.role : undefined,
      children: [
        row.kind === "work" &&
          (() => {
            const groupId = row.id;
            const groupedEntries = row.groupedEntries;
            const isExpanded = expandedWorkGroups[groupId] ?? false;
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
                        className:
                          "text-[9px] uppercase tracking-[0.16em] text-muted-foreground/55",
                        children: [groupLabel, " (", groupedEntries.length, ")"],
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
                  className: "space-y-0.5",
                  children: visibleEntries.map((workEntry) =>
                    _jsx(SimpleWorkEntryRow, { workEntry: workEntry }, `work-row:${workEntry.id}`),
                  ),
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
            const canRevertAgentWork = revertTurnCountByUserMessageId.has(row.message.id);
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
                                    onImageExpand(preview);
                                  },
                                  children: _jsx("img", {
                                    src: image.previewUrl,
                                    alt: image.name,
                                    className: "h-full max-h-[220px] w-full object-cover",
                                    onLoad: onTimelineImageLoad,
                                    onError: onTimelineImageLoad,
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
                              disabled: isRevertingCheckpoint || isWorking,
                              onClick: () => onRevertUserMessage(row.message.id),
                              title: "Revert to this message",
                              children: _jsx(Undo2Icon, { className: "size-3" }),
                            }),
                        ],
                      }),
                      _jsx("p", {
                        className: "text-right text-[10px] text-muted-foreground/30",
                        children: formatTimestamp(row.message.createdAt, timestampFormat),
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
            const messageText =
              row.message.text || (row.message.streaming ? "" : "(empty response)");
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
                        children: completionSummary
                          ? `Response • ${completionSummary}`
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
                      cwd: markdownCwd,
                      isStreaming: Boolean(row.message.streaming),
                    }),
                    (() => {
                      const turnSummary = turnDiffSummaryByAssistantMessageId.get(row.message.id);
                      if (!turnSummary) return null;
                      const checkpointFiles = turnSummary.files;
                      if (checkpointFiles.length === 0) return null;
                      const summaryStat = summarizeTurnDiffStats(checkpointFiles);
                      const changedFileCountLabel = String(checkpointFiles.length);
                      const allDirectoriesExpanded =
                        allDirectoriesExpandedByTurnId[turnSummary.turnId] ?? true;
                      return _jsxs("div", {
                        className: "mt-2 rounded-lg border border-border/80 bg-card/45 p-2.5",
                        children: [
                          _jsxs("div", {
                            className: "mb-1.5 flex items-center justify-between gap-2",
                            children: [
                              _jsxs("p", {
                                className:
                                  "text-[10px] uppercase tracking-[0.12em] text-muted-foreground/65",
                                children: [
                                  _jsxs("span", {
                                    children: ["Changed files (", changedFileCountLabel, ")"],
                                  }),
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
                                    onClick: () => onToggleAllDirectories(turnSummary.turnId),
                                    children: allDirectoriesExpanded
                                      ? "Collapse all"
                                      : "Expand all",
                                  }),
                                  _jsx(Button, {
                                    type: "button",
                                    size: "xs",
                                    variant: "outline",
                                    onClick: () =>
                                      onOpenTurnDiff(turnSummary.turnId, checkpointFiles[0]?.path),
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
                    })(),
                    _jsx("p", {
                      className: "mt-1.5 text-[10px] text-muted-foreground/30",
                      children: formatMessageMeta(
                        row.message.createdAt,
                        row.message.streaming
                          ? formatElapsed(row.durationStart, nowIso)
                          : formatElapsed(row.durationStart, row.message.completedAt),
                        timestampFormat,
                      ),
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
              cwd: markdownCwd,
              workspaceRoot: workspaceRoot,
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
                    ? `Working for ${formatWorkingTimer(row.createdAt, nowIso) ?? "0s"}`
                    : "Working...",
                }),
              ],
            }),
          }),
      ],
    });
  if (!hasMessages && !isWorking) {
    return _jsx("div", {
      className: "flex h-full items-center justify-center",
      children: _jsx("p", {
        className: "text-sm text-muted-foreground/30",
        children: "Send a message to start the conversation.",
      }),
    });
  }
  return _jsxs("div", {
    ref: timelineRootRef,
    "data-timeline-root": "true",
    className: "mx-auto w-full min-w-0 max-w-3xl overflow-x-hidden",
    children: [
      virtualizedRowCount > 0 &&
        _jsx("div", {
          className: "relative",
          style: { height: `${rowVirtualizer.getTotalSize()}px` },
          children: virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];
            if (!row) return null;
            return _jsx(
              "div",
              {
                "data-index": virtualRow.index,
                ref: rowVirtualizer.measureElement,
                className: "absolute left-0 top-0 w-full",
                style: { transform: `translateY(${virtualRow.start}px)` },
                children: renderRowContent(row),
              },
              `virtual-row:${row.id}`,
            );
          }),
        }),
      nonVirtualizedRows.map((row) =>
        _jsx("div", { children: renderRowContent(row) }, `non-virtual-row:${row.id}`),
      ),
    ],
  });
});
function estimateTimelineProposedPlanHeight(proposedPlan) {
  const estimatedLines = Math.max(1, Math.ceil(proposedPlan.planMarkdown.length / 72));
  return 120 + Math.min(estimatedLines * 22, 880);
}
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
          className:
            "wrap-break-word whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground",
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
      className:
        "wrap-break-word whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground",
      children: inlineNodes,
    });
  }
  if (props.text.length === 0) {
    return null;
  }
  return _jsx("pre", {
    className:
      "whitespace-pre-wrap wrap-break-word font-mono text-sm leading-relaxed text-foreground",
    children: props.text,
  });
});
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
            children: _jsxs("p", {
              className: cn(
                "truncate text-[11px] leading-5",
                workToneClass(workEntry.tone),
                preview ? "text-muted-foreground/70" : "",
              ),
              title: displayText,
              children: [
                _jsx("span", {
                  className: cn("text-foreground/80", workToneClass(workEntry.tone)),
                  children: heading,
                }),
                preview &&
                  _jsxs("span", {
                    className: "text-muted-foreground/55",
                    children: [" - ", preview],
                  }),
              ],
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
            workEntry.changedFiles
              ?.slice(0, 4)
              .map((filePath) =>
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
