import { memo, useState, useMemo } from "react";
import { ChevronRightIcon, EyeIcon, SearchIcon, ListIcon, CheckIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import type { WorkLogEntry } from "../../session-logic";

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

function isContextGatheringTool(entry: WorkLogEntry): boolean {
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

interface ContextToolGroupProps {
  entries: readonly WorkLogEntry[];
  defaultOpen?: boolean;
}

interface ToolSummary {
  read: number;
  search: number;
  list: number;
}

function summarizeTools(entries: readonly WorkLogEntry[]): ToolSummary {
  const summary: ToolSummary = { read: 0, search: 0, list: 0 };

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

function getToolEntryLabel(entry: WorkLogEntry): string {
  if (entry.toolTitle) return entry.toolTitle;
  const label = entry.label;
  const withoutStatus = label.replace(/\s+(start|started|complete|completed)\s*$/i, "").trim();
  return withoutStatus.charAt(0).toUpperCase() + withoutStatus.slice(1);
}

function getToolEntrySubtitle(entry: WorkLogEntry): string | null {
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

function getToolIcon(entry: WorkLogEntry): typeof EyeIcon {
  const label = entry.label.toLowerCase();
  if (label.includes("read ") || entry.requestKind === "file-read") return EyeIcon;
  if (label.includes("glob ") || label.includes("grep ")) return SearchIcon;
  if (label.includes("list ") || label.includes("listing ")) return ListIcon;
  return EyeIcon;
}

export const ContextToolGroup = memo(function ContextToolGroup({
  entries,
  defaultOpen = false,
}: ContextToolGroupProps) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const summary = useMemo(() => summarizeTools(entries), [entries]);
  const isRunning = entries.some((e) => e.tone === "tool");

  const count = entries.length;
  const parts: string[] = [];
  if (summary.read > 0) parts.push(`${summary.read} read${summary.read > 1 ? "s" : ""}`);
  if (summary.search > 0) parts.push(`${summary.search} search${summary.search > 1 ? "es" : ""}`);
  if (summary.list > 0) parts.push(`${summary.list} list${summary.list > 1 ? "s" : ""}`);

  return (
    <div className="rounded-xl border border-border/45 bg-card/25 overflow-hidden">
      <button
        type="button"
        className="w-full px-3 py-2 flex items-center gap-2.5 transition-colors hover:bg-accent/20"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {isRunning ? (
          <span className="flex items-center gap-1.5 text-muted-foreground/60">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-pulse" />
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-pulse [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-pulse [animation-delay:300ms]" />
          </span>
        ) : (
          <span className="flex size-4 items-center justify-center text-muted-foreground/70">
            <CheckIcon className="size-3.5" />
          </span>
        )}
        <p className="text-xs font-medium text-muted-foreground/80">
          {isRunning ? "Gathering context" : "Gathered context"}
          {count > 0 && (
            <span className="ml-1.5 text-muted-foreground/50 font-normal">
              ({parts.join(", ")})
            </span>
          )}
        </p>
        <ChevronRightIcon
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground/50 transition-transform duration-150 ml-auto",
            expanded && "rotate-90",
          )}
        />
      </button>
      {expanded && (
        <div className="border-t border-border/35 bg-background/15 py-1.5">
          {entries.map((entry) => {
            const Icon = getToolIcon(entry);
            const label = getToolEntryLabel(entry);
            const subtitle = getToolEntrySubtitle(entry);

            return (
              <div key={entry.id} className="px-3 py-1.5 flex items-center gap-2 text-[11px]">
                <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground/55">
                  <Icon className="size-3" />
                </span>
                <span className="font-medium text-foreground/75">{label}</span>
                {subtitle && (
                  <span className="text-muted-foreground/50 truncate max-w-[50%]">{subtitle}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export { isContextGatheringTool };
