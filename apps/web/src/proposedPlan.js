export function proposedPlanTitle(planMarkdown) {
  const heading = planMarkdown.match(/^\s{0,3}#{1,6}\s+(.+)$/m)?.[1]?.trim();
  return heading && heading.length > 0 ? heading : null;
}
export function stripDisplayedPlanMarkdown(planMarkdown) {
  const lines = planMarkdown.trimEnd().split(/\r?\n/);
  const sourceLines = lines[0] && /^\s{0,3}#{1,6}\s+/.test(lines[0]) ? lines.slice(1) : [...lines];
  while (sourceLines[0]?.trim().length === 0) {
    sourceLines.shift();
  }
  const firstHeadingMatch = sourceLines[0]?.match(/^\s{0,3}#{1,6}\s+(.+)$/);
  if (firstHeadingMatch?.[1]?.trim().toLowerCase() === "summary") {
    sourceLines.shift();
    while (sourceLines[0]?.trim().length === 0) {
      sourceLines.shift();
    }
  }
  return sourceLines.join("\n");
}
export function buildCollapsedProposedPlanPreviewMarkdown(planMarkdown, options) {
  const maxLines = options?.maxLines ?? 8;
  const lines = stripDisplayedPlanMarkdown(planMarkdown)
    .trimEnd()
    .split(/\r?\n/)
    .map((line) => line.trimEnd());
  const previewLines = [];
  let visibleLineCount = 0;
  let hasMoreContent = false;
  for (const line of lines) {
    const isVisibleLine = line.trim().length > 0;
    if (isVisibleLine && visibleLineCount >= maxLines) {
      hasMoreContent = true;
      break;
    }
    previewLines.push(line);
    if (isVisibleLine) {
      visibleLineCount += 1;
    }
  }
  while (previewLines.length > 0 && previewLines.at(-1)?.trim().length === 0) {
    previewLines.pop();
  }
  if (previewLines.length === 0) {
    return proposedPlanTitle(planMarkdown) ?? "Plan preview unavailable.";
  }
  if (hasMoreContent) {
    previewLines.push("", "...");
  }
  return previewLines.join("\n");
}
function sanitizePlanFileSegment(input) {
  const sanitized = input
    .toLowerCase()
    .replace(/[`'".,!?()[\]{}]+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return sanitized.length > 0 ? sanitized : "plan";
}
export function buildPlanImplementationPrompt(planMarkdown) {
  return `PLEASE IMPLEMENT THIS PLAN:\n${planMarkdown.trim()}`;
}
export function resolvePlanFollowUpSubmission(input) {
  const trimmedDraftText = input.draftText.trim();
  if (trimmedDraftText.length > 0) {
    return {
      text: trimmedDraftText,
      interactionMode: "plan",
    };
  }
  return {
    text: buildPlanImplementationPrompt(input.planMarkdown),
    interactionMode: "default",
  };
}
export function buildPlanImplementationThreadTitle(planMarkdown) {
  const title = proposedPlanTitle(planMarkdown);
  if (!title) {
    return "Implement plan";
  }
  return `Implement ${title}`;
}
export function buildProposedPlanMarkdownFilename(planMarkdown) {
  const title = proposedPlanTitle(planMarkdown);
  return `${sanitizePlanFileSegment(title ?? "plan")}.md`;
}
export function normalizePlanMarkdownForExport(planMarkdown) {
  return `${planMarkdown.trimEnd()}\n`;
}
export function downloadPlanAsTextFile(filename, contents) {
  const blob = new Blob([contents], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}
