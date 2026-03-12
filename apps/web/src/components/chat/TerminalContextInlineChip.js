import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TerminalIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  COMPOSER_INLINE_CHIP_CLASS_NAME,
  COMPOSER_INLINE_CHIP_ICON_CLASS_NAME,
  COMPOSER_INLINE_CHIP_LABEL_CLASS_NAME,
} from "../composerInlineChip";
import { Tooltip, TooltipPopup, TooltipTrigger } from "../ui/tooltip";
export function TerminalContextInlineChip(props) {
  const { label, tooltipText, expired = false } = props;
  return _jsxs(Tooltip, {
    children: [
      _jsx(TooltipTrigger, {
        render: _jsxs("span", {
          className: cn(
            COMPOSER_INLINE_CHIP_CLASS_NAME,
            expired && "border-destructive/35 bg-destructive/8 text-destructive",
          ),
          "data-terminal-context-expired": expired ? "true" : undefined,
          children: [
            _jsx(TerminalIcon, {
              className: cn(
                COMPOSER_INLINE_CHIP_ICON_CLASS_NAME,
                "size-3.5",
                expired && "opacity-100",
              ),
            }),
            _jsx("span", { className: COMPOSER_INLINE_CHIP_LABEL_CLASS_NAME, children: label }),
          ],
        }),
      }),
      _jsx(TooltipPopup, {
        side: "top",
        className: "max-w-80 whitespace-pre-wrap leading-tight",
        children: tooltipText,
      }),
    ],
  });
}
