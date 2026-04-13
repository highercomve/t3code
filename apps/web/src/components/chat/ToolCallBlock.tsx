import { memo, useState } from "react";
import {
  ChevronRightIcon,
  CircleAlertIcon,
  CircleDashedIcon,
  EyeIcon,
  SquarePenIcon,
  TerminalIcon,
  GlobeIcon,
  WrenchIcon,
  HammerIcon,
  ZapIcon,
  BotIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { WorkLogEntry } from "../../session-logic";

interface ToolCallBlockProps {
  entry: WorkLogEntry;
  defaultOpen?: boolean;
}

function getToolIcon(
  itemType: string | undefined,
  requestKind: string | undefined,
): typeof TerminalIcon {
  if (requestKind === "command") return TerminalIcon;
  if (requestKind === "file-read") return EyeIcon;
  if (requestKind === "file-change") return SquarePenIcon;
  if (itemType === "web_search") return GlobeIcon;
  if (itemType === "mcp_tool_call") return WrenchIcon;
  if (itemType === "dynamic_tool_call" || itemType === "collab_agent_tool_call") return HammerIcon;
  return ZapIcon;
}

function getToolStatus(tone: WorkLogEntry["tone"]): "pending" | "running" | "completed" | "error" {
  if (tone === "error") return "error";
  return "completed";
}

function getToolLabel(entry: WorkLogEntry): string {
  if (entry.toolTitle) return entry.toolTitle;
  return capitalizePhrase(entry.label);
}

function capitalizePhrase(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) return value;
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
}

function getToolSubtitle(entry: WorkLogEntry): string | null {
  if (entry.command) return entry.command;
  if (entry.detail) {
    const firstLine = entry.detail.split("\n")[0];
    if (firstLine && firstLine.length < 80) return firstLine;
  }
  if (entry.changedFiles && entry.changedFiles.length > 0) {
    const first = entry.changedFiles[0];
    if (!first) return null;
    return entry.changedFiles.length === 1
      ? first
      : `${first} +${entry.changedFiles.length - 1} more`;
  }
  return null;
}

export const ToolCallBlock = memo(function ToolCallBlock({
  entry,
  defaultOpen = false,
}: ToolCallBlockProps) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const status = getToolStatus(entry.tone);
  const Icon = getToolIcon(entry.itemType, entry.requestKind);
  const label = getToolLabel(entry);
  const subtitle = getToolSubtitle(entry);
  const hasContent = !!(entry.command || entry.detail);
  const hasChangedFiles = !!(entry.changedFiles && entry.changedFiles.length > 0);

  return (
    <div className="rounded-lg border border-border/55 bg-card/30 overflow-hidden">
      <button
        type="button"
        className={cn(
          "w-full px-2.5 py-2 flex items-center gap-2.5 transition-colors",
          hasContent && "cursor-pointer hover:bg-accent/30",
          !hasContent && "cursor-default",
        )}
        onClick={hasContent ? () => setExpanded((prev) => !prev) : undefined}
        disabled={!hasContent}
      >
        <span
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded",
            status === "completed" && "text-muted-foreground/70",
            status === "error" && "text-rose-400/80",
            status === "running" && "text-muted-foreground/70",
          )}
        >
          {status === "completed" && <Icon className="size-3.5" />}
          {status === "error" && <CircleAlertIcon className="size-3.5" />}
          {status === "running" && <CircleDashedIcon className="size-3.5 animate-spin" />}
          {status === "pending" && <Icon className="size-3.5 opacity-50" />}
        </span>
        <div className="min-w-0 flex-1 text-left">
          <p
            className={cn(
              "text-[11px] leading-5 font-medium",
              status === "completed" && "text-foreground/80",
              status === "error" && "text-rose-400/80",
            )}
          >
            {label}
            {subtitle && (
              <span className="text-muted-foreground/60 font-normal ml-1.5">
                {subtitle.length > 60 ? `${subtitle.slice(0, 60)}...` : subtitle}
              </span>
            )}
          </p>
        </div>
        {hasContent && (
          <ChevronRightIcon
            className={cn(
              "size-3.5 shrink-0 text-muted-foreground/50 transition-transform duration-150",
              expanded && "rotate-90",
            )}
          />
        )}
      </button>
      {expanded && hasContent && (
        <div className="border-t border-border/40 px-2.5 py-2 bg-background/25">
          {entry.command && (
            <div className="mb-1.5">
              <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/50 mb-1">
                Command
              </p>
              <pre className="text-[11px] font-mono text-foreground/80 whitespace-pre-wrap break-all bg-muted/30 rounded px-2 py-1.5 overflow-x-auto max-h-32">
                {entry.command}
              </pre>
            </div>
          )}
          {entry.detail && !entry.command && (
            <pre className="text-[11px] font-mono text-foreground/75 whitespace-pre-wrap break-all overflow-x-auto max-h-48 bg-muted/30 rounded px-2 py-1.5">
              {entry.detail}
            </pre>
          )}
          {hasChangedFiles && (
            <div className="mt-2 flex flex-wrap gap-1">
              {entry.changedFiles!.slice(0, 5).map((filePath) => (
                <span
                  key={`${entry.id}:${filePath}`}
                  className="rounded border border-border/50 bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/70"
                  title={filePath}
                >
                  {filePath.split("/").pop()}
                </span>
              ))}
              {entry.changedFiles!.length > 5 && (
                <span className="text-[10px] text-muted-foreground/50">
                  +{entry.changedFiles!.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export const ThinkingBlock = memo(function ThinkingBlock({
  entry,
  defaultOpen = false,
}: ToolCallBlockProps) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const hasDetail = !!(entry.detail && entry.detail.trim().length > 0);

  return (
    <div className="rounded-lg border border-border/45 bg-card/25 overflow-hidden">
      <button
        type="button"
        className={cn(
          "w-full px-2.5 py-2 flex items-center gap-2.5 transition-colors",
          hasDetail && "cursor-pointer hover:bg-accent/20",
          !hasDetail && "cursor-default",
        )}
        onClick={hasDetail ? () => setExpanded((prev) => !prev) : undefined}
        disabled={!hasDetail}
      >
        <span className="flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground/60">
          <BotIcon className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-[11px] leading-5 text-muted-foreground/70">Thinking</p>
        </div>
        {hasDetail && (
          <ChevronRightIcon
            className={cn(
              "size-3.5 shrink-0 text-muted-foreground/50 transition-transform duration-150",
              expanded && "rotate-90",
            )}
          />
        )}
      </button>
      {expanded && hasDetail && (
        <div className="border-t border-border/35 px-2.5 py-2 bg-background/15">
          <pre className="text-[11px] font-mono text-muted-foreground/65 whitespace-pre-wrap break-words leading-relaxed">
            {entry.detail}
          </pre>
        </div>
      )}
    </div>
  );
});
