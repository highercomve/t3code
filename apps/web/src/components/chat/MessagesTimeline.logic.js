import { buildTurnDiffTree } from "../../lib/turnDiffTree";
import { estimateTimelineMessageHeight } from "../timelineHeight";
export const MAX_VISIBLE_WORK_LOG_ENTRIES = 6;
export function computeMessageDurationStart(messages) {
    const result = new Map();
    let lastBoundary = null;
    for (const message of messages) {
        if (message.role === "user") {
            lastBoundary = message.createdAt;
        }
        result.set(message.id, lastBoundary ?? message.createdAt);
        if (message.role === "assistant" && message.completedAt) {
            lastBoundary = message.completedAt;
        }
    }
    return result;
}
export function normalizeCompactToolLabel(value) {
    return value.replace(/\s+(?:start|started|complete|completed)\s*$/i, "").trim();
}
export function deriveMessagesTimelineRows(input) {
    const nextRows = [];
    const durationStartByMessageId = computeMessageDurationStart(input.timelineEntries.flatMap((entry) => (entry.kind === "message" ? [entry.message] : [])));
    for (let index = 0; index < input.timelineEntries.length; index += 1) {
        const timelineEntry = input.timelineEntries[index];
        if (!timelineEntry) {
            continue;
        }
        if (timelineEntry.kind === "work") {
            const groupedEntries = [timelineEntry.entry];
            let cursor = index + 1;
            while (cursor < input.timelineEntries.length) {
                const nextEntry = input.timelineEntries[cursor];
                if (!nextEntry || nextEntry.kind !== "work")
                    break;
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
            durationStart: durationStartByMessageId.get(timelineEntry.message.id) ?? timelineEntry.message.createdAt,
            showCompletionDivider: timelineEntry.message.role === "assistant" &&
                input.completionDividerBeforeEntryId === timelineEntry.id,
        });
    }
    if (input.isWorking) {
        nextRows.push({
            kind: "working",
            id: "working-indicator-row",
            createdAt: input.activeTurnStartedAt,
        });
    }
    return nextRows;
}
export function estimateMessagesTimelineRowHeight(row, input) {
    switch (row.kind) {
        case "work":
            return estimateWorkRowHeight(row, input);
        case "proposed-plan":
            return estimateTimelineProposedPlanHeight(row.proposedPlan);
        case "working":
            return 40;
        case "message": {
            let estimate = estimateTimelineMessageHeight(row.message, {
                timelineWidthPx: input.timelineWidthPx,
            });
            const turnDiffSummary = input.turnDiffSummaryByAssistantMessageId?.get(row.message.id);
            if (turnDiffSummary && turnDiffSummary.files.length > 0) {
                estimate += estimateChangedFilesCardHeight(turnDiffSummary);
            }
            return estimate;
        }
    }
}
function estimateWorkRowHeight(row, input) {
    const isExpanded = input.expandedWorkGroups?.[row.id] ?? false;
    const hasOverflow = row.groupedEntries.length > MAX_VISIBLE_WORK_LOG_ENTRIES;
    const visibleEntries = hasOverflow && !isExpanded ? MAX_VISIBLE_WORK_LOG_ENTRIES : row.groupedEntries.length;
    const onlyToolEntries = row.groupedEntries.every((entry) => entry.tone === "tool");
    const showHeader = hasOverflow || !onlyToolEntries;
    // Card chrome, optional header, and one compact work-entry row per visible entry.
    return 28 + (showHeader ? 26 : 0) + visibleEntries * 32;
}
function estimateTimelineProposedPlanHeight(proposedPlan) {
    const estimatedLines = Math.max(1, Math.ceil(proposedPlan.planMarkdown.length / 72));
    return 120 + Math.min(estimatedLines * 22, 880);
}
function estimateChangedFilesCardHeight(turnDiffSummary) {
    const treeNodes = buildTurnDiffTree(turnDiffSummary.files);
    const visibleNodeCount = countTurnDiffTreeNodes(treeNodes);
    // Card chrome: top/bottom padding, header row, and tree spacing.
    return 60 + visibleNodeCount * 25;
}
function countTurnDiffTreeNodes(nodes) {
    let count = 0;
    for (const node of nodes) {
        count += 1;
        if (node.kind === "directory") {
            count += countTurnDiffTreeNodes(node.children);
        }
    }
    return count;
}
