import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
function getToolIcon(itemType, requestKind) {
  if (requestKind === "command") return TerminalIcon;
  if (requestKind === "file-read") return EyeIcon;
  if (requestKind === "file-change") return SquarePenIcon;
  if (itemType === "web_search") return GlobeIcon;
  if (itemType === "mcp_tool_call") return WrenchIcon;
  if (itemType === "dynamic_tool_call" || itemType === "collab_agent_tool_call") return HammerIcon;
  return ZapIcon;
}
function getToolStatus(tone) {
  if (tone === "error") return "error";
  return "completed";
}
function getToolLabel(entry) {
  if (entry.toolTitle) return entry.toolTitle;
  return capitalizePhrase(entry.label);
}
function capitalizePhrase(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) return value;
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
}
function getToolSubtitle(entry) {
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
export const ToolCallBlock = memo(function ToolCallBlock({ entry, defaultOpen = false }) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const status = getToolStatus(entry.tone);
  const Icon = getToolIcon(entry.itemType, entry.requestKind);
  const label = getToolLabel(entry);
  const subtitle = getToolSubtitle(entry);
  const hasContent = !!(entry.command || entry.detail);
  const hasChangedFiles = !!(entry.changedFiles && entry.changedFiles.length > 0);
  return _jsxs("div", {
    className: "rounded-lg border border-border/55 bg-card/30 overflow-hidden",
    children: [
      _jsxs("button", {
        type: "button",
        className: cn(
          "w-full px-2.5 py-2 flex items-center gap-2.5 transition-colors",
          hasContent && "cursor-pointer hover:bg-accent/30",
          !hasContent && "cursor-default",
        ),
        onClick: hasContent ? () => setExpanded((prev) => !prev) : undefined,
        disabled: !hasContent,
        children: [
          _jsxs("span", {
            className: cn(
              "flex size-5 shrink-0 items-center justify-center rounded",
              status === "completed" && "text-muted-foreground/70",
              status === "error" && "text-rose-400/80",
              status === "running" && "text-muted-foreground/70",
            ),
            children: [
              status === "completed" && _jsx(Icon, { className: "size-3.5" }),
              status === "error" && _jsx(CircleAlertIcon, { className: "size-3.5" }),
              status === "running" &&
                _jsx(CircleDashedIcon, { className: "size-3.5 animate-spin" }),
              status === "pending" && _jsx(Icon, { className: "size-3.5 opacity-50" }),
            ],
          }),
          _jsx("div", {
            className: "min-w-0 flex-1 text-left",
            children: _jsxs("p", {
              className: cn(
                "text-[11px] leading-5 font-medium",
                status === "completed" && "text-foreground/80",
                status === "error" && "text-rose-400/80",
              ),
              children: [
                label,
                subtitle &&
                  _jsx("span", {
                    className: "text-muted-foreground/60 font-normal ml-1.5",
                    children: subtitle.length > 60 ? `${subtitle.slice(0, 60)}...` : subtitle,
                  }),
              ],
            }),
          }),
          hasContent &&
            _jsx(ChevronRightIcon, {
              className: cn(
                "size-3.5 shrink-0 text-muted-foreground/50 transition-transform duration-150",
                expanded && "rotate-90",
              ),
            }),
        ],
      }),
      expanded &&
        hasContent &&
        _jsxs("div", {
          className: "border-t border-border/40 px-2.5 py-2 bg-background/25",
          children: [
            entry.command &&
              _jsxs("div", {
                className: "mb-1.5",
                children: [
                  _jsx("p", {
                    className:
                      "text-[10px] uppercase tracking-[0.1em] text-muted-foreground/50 mb-1",
                    children: "Command",
                  }),
                  _jsx("pre", {
                    className:
                      "text-[11px] font-mono text-foreground/80 whitespace-pre-wrap break-all bg-muted/30 rounded px-2 py-1.5 overflow-x-auto max-h-32",
                    children: entry.command,
                  }),
                ],
              }),
            entry.detail &&
              !entry.command &&
              _jsx("pre", {
                className:
                  "text-[11px] font-mono text-foreground/75 whitespace-pre-wrap break-all overflow-x-auto max-h-48 bg-muted/30 rounded px-2 py-1.5",
                children: entry.detail,
              }),
            hasChangedFiles &&
              _jsxs("div", {
                className: "mt-2 flex flex-wrap gap-1",
                children: [
                  entry.changedFiles.slice(0, 5).map((filePath) =>
                    _jsx(
                      "span",
                      {
                        className:
                          "rounded border border-border/50 bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/70",
                        title: filePath,
                        children: filePath.split("/").pop(),
                      },
                      `${entry.id}:${filePath}`,
                    ),
                  ),
                  entry.changedFiles.length > 5 &&
                    _jsxs("span", {
                      className: "text-[10px] text-muted-foreground/50",
                      children: ["+", entry.changedFiles.length - 5, " more"],
                    }),
                ],
              }),
          ],
        }),
    ],
  });
});
export const ThinkingBlock = memo(function ThinkingBlock({ entry, defaultOpen = false }) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const hasDetail = !!(entry.detail && entry.detail.trim().length > 0);
  return _jsxs("div", {
    className: "rounded-lg border border-border/45 bg-card/25 overflow-hidden",
    children: [
      _jsxs("button", {
        type: "button",
        className: cn(
          "w-full px-2.5 py-2 flex items-center gap-2.5 transition-colors",
          hasDetail && "cursor-pointer hover:bg-accent/20",
          !hasDetail && "cursor-default",
        ),
        onClick: hasDetail ? () => setExpanded((prev) => !prev) : undefined,
        disabled: !hasDetail,
        children: [
          _jsx("span", {
            className:
              "flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground/60",
            children: _jsx(BotIcon, { className: "size-3.5" }),
          }),
          _jsx("div", {
            className: "min-w-0 flex-1 text-left",
            children: _jsx("p", {
              className: "text-[11px] leading-5 text-muted-foreground/70",
              children: "Thinking",
            }),
          }),
          hasDetail &&
            _jsx(ChevronRightIcon, {
              className: cn(
                "size-3.5 shrink-0 text-muted-foreground/50 transition-transform duration-150",
                expanded && "rotate-90",
              ),
            }),
        ],
      }),
      expanded &&
        hasDetail &&
        _jsx("div", {
          className: "border-t border-border/35 px-2.5 py-2 bg-background/15",
          children: _jsx("pre", {
            className:
              "text-[11px] font-mono text-muted-foreground/65 whitespace-pre-wrap break-words leading-relaxed",
            children: entry.detail,
          }),
        }),
    ],
  });
});
