import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "~/lib/utils";
import { formatTerminalContextLabel, isTerminalContextExpired } from "~/lib/terminalContext";
import { TerminalContextInlineChip } from "./TerminalContextInlineChip";
export function ComposerPendingTerminalContextChip({ context }) {
  const label = formatTerminalContextLabel(context);
  const expired = isTerminalContextExpired(context);
  const tooltipText = expired
    ? `Terminal context expired. Remove and re-add ${label} to include it in your message.`
    : context.text;
  return _jsx(TerminalContextInlineChip, {
    label: label,
    tooltipText: tooltipText,
    expired: expired,
  });
}
export function ComposerPendingTerminalContexts(props) {
  const { contexts, className } = props;
  if (contexts.length === 0) {
    return null;
  }
  return _jsx("div", {
    className: cn("flex flex-wrap gap-1.5", className),
    children: contexts.map((context) =>
      _jsx(ComposerPendingTerminalContextChip, { context: context }, context.id),
    ),
  });
}
