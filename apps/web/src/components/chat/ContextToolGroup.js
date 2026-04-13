import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useState, useMemo } from "react";
import { ChevronRightIcon, EyeIcon, SearchIcon, ListIcon, CheckIcon } from "lucide-react";
import { cn } from "~/lib/utils";
const CONTEXT_GATHERING_TOOLS = new Set([
  "read",
  "glob",
  "grep",
  "list",
  "fileRead",
  "fileSearch",
  "Read",
  "Glob",
  "Grep",
  "ListFolder",
]);
function isContextGatheringTool(entry) {
  if (entry.requestKind === "file-read") return true;
  if (entry.itemType && CONTEXT_GATHERING_TOOLS.has(entry.itemType)) return true;
  const label = entry.label.toLowerCase();
  if (label.includes("read ") || label.includes("read:")) return true;
  if (label.includes("glob ") || label.includes("glob:")) return true;
  if (label.includes("grep ") || label.includes("grep:")) return true;
  if (label.includes("list ") || label.includes("list:") || label.includes("listing ")) return true;
  const toolTitle = entry.toolTitle?.toLowerCase();
  if (toolTitle) {
    if (
      toolTitle.includes("read") ||
      toolTitle.includes("glob") ||
      toolTitle.includes("grep") ||
      toolTitle.includes("list")
    ) {
      return true;
    }
  }
  return false;
}
function summarizeTools(entries) {
  const summary = { read: 0, search: 0, list: 0 };
  for (const entry of entries) {
    const label = entry.label.toLowerCase();
    const toolTitle = entry.toolTitle?.toLowerCase() ?? "";
    if (
      label.includes("read ") ||
      toolTitle.includes("read") ||
      entry.requestKind === "file-read"
    ) {
      summary.read++;
    } else if (
      label.includes("glob ") ||
      label.includes("grep ") ||
      toolTitle.includes("glob") ||
      toolTitle.includes("grep")
    ) {
      summary.search++;
    } else if (
      label.includes("list ") ||
      label.includes("listing ") ||
      toolTitle.includes("list")
    ) {
      summary.list++;
    } else {
      summary.read++;
    }
  }
  return summary;
}
function getToolEntryLabel(entry) {
  if (entry.toolTitle) return entry.toolTitle;
  const label = entry.label;
  const withoutStatus = label.replace(/\s+(start|started|complete|completed)\s*$/i, "").trim();
  return withoutStatus.charAt(0).toUpperCase() + withoutStatus.slice(1);
}
function getToolEntrySubtitle(entry) {
  if (entry.changedFiles && entry.changedFiles.length > 0) {
    return entry.changedFiles[0] ?? null;
  }
  if (entry.command) {
    const first = entry.command.split("\n")[0];
    if (first && first.length < 80) return first;
  }
  if (entry.detail) {
    const firstLine = entry.detail.split("\n")[0];
    if (firstLine && firstLine.length < 60) return firstLine;
  }
  return null;
}
function getToolIcon(entry) {
  const label = entry.label.toLowerCase();
  if (label.includes("read ") || entry.requestKind === "file-read") return EyeIcon;
  if (label.includes("glob ") || label.includes("grep ")) return SearchIcon;
  if (label.includes("list ") || label.includes("listing ")) return ListIcon;
  return EyeIcon;
}
export const ContextToolGroup = memo(function ContextToolGroup({ entries, defaultOpen = false }) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const summary = useMemo(() => summarizeTools(entries), [entries]);
  const isRunning = entries.some((e) => e.tone === "tool");
  const count = entries.length;
  const parts = [];
  if (summary.read > 0) parts.push(`${summary.read} read${summary.read > 1 ? "s" : ""}`);
  if (summary.search > 0) parts.push(`${summary.search} search${summary.search > 1 ? "es" : ""}`);
  if (summary.list > 0) parts.push(`${summary.list} list${summary.list > 1 ? "s" : ""}`);
  return _jsxs("div", {
    className: "rounded-xl border border-border/45 bg-card/25 overflow-hidden",
    children: [
      _jsxs("button", {
        type: "button",
        className:
          "w-full px-3 py-2 flex items-center gap-2.5 transition-colors hover:bg-accent/20",
        onClick: () => setExpanded((prev) => !prev),
        children: [
          isRunning
            ? _jsxs("span", {
                className: "flex items-center gap-1.5 text-muted-foreground/60",
                children: [
                  _jsx("span", {
                    className: "h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-pulse",
                  }),
                  _jsx("span", {
                    className:
                      "h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-pulse [animation-delay:150ms]",
                  }),
                  _jsx("span", {
                    className:
                      "h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-pulse [animation-delay:300ms]",
                  }),
                ],
              })
            : _jsx("span", {
                className: "flex size-4 items-center justify-center text-muted-foreground/70",
                children: _jsx(CheckIcon, { className: "size-3.5" }),
              }),
          _jsxs("p", {
            className: "text-xs font-medium text-muted-foreground/80",
            children: [
              isRunning ? "Gathering context" : "Gathered context",
              count > 0 &&
                _jsxs("span", {
                  className: "ml-1.5 text-muted-foreground/50 font-normal",
                  children: ["(", parts.join(", "), ")"],
                }),
            ],
          }),
          _jsx(ChevronRightIcon, {
            className: cn(
              "size-3.5 shrink-0 text-muted-foreground/50 transition-transform duration-150 ml-auto",
              expanded && "rotate-90",
            ),
          }),
        ],
      }),
      expanded &&
        _jsx("div", {
          className: "border-t border-border/35 bg-background/15 py-1.5",
          children: entries.map((entry) => {
            const Icon = getToolIcon(entry);
            const label = getToolEntryLabel(entry);
            const subtitle = getToolEntrySubtitle(entry);
            return _jsxs(
              "div",
              {
                className: "px-3 py-1.5 flex items-center gap-2 text-[11px]",
                children: [
                  _jsx("span", {
                    className:
                      "flex size-4 shrink-0 items-center justify-center text-muted-foreground/55",
                    children: _jsx(Icon, { className: "size-3" }),
                  }),
                  _jsx("span", { className: "font-medium text-foreground/75", children: label }),
                  subtitle &&
                    _jsx("span", {
                      className: "text-muted-foreground/50 truncate max-w-[50%]",
                      children: subtitle,
                    }),
                ],
              },
              entry.id,
            );
          }),
        }),
    ],
  });
});
export { isContextGatheringTool };
