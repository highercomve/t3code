import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useRef } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useCopyToClipboard } from "~/hooks/useCopyToClipboard";
import { cn } from "~/lib/utils";
import { anchoredToastManager } from "../ui/toast";
import { Tooltip, TooltipPopup, TooltipTrigger } from "../ui/tooltip";
const ANCHORED_TOAST_TIMEOUT_MS = 1000;
const onCopy = (ref) => {
  if (ref.current) {
    anchoredToastManager.add({
      data: {
        tooltipStyle: true,
      },
      positionerProps: {
        anchor: ref.current,
      },
      timeout: ANCHORED_TOAST_TIMEOUT_MS,
      title: "Copied!",
    });
  }
};
const onCopyError = (ref, error) => {
  if (ref.current) {
    anchoredToastManager.add({
      data: {
        tooltipStyle: true,
      },
      positionerProps: {
        anchor: ref.current,
      },
      timeout: ANCHORED_TOAST_TIMEOUT_MS,
      title: "Failed to copy",
      description: error.message,
    });
  }
};
export const MessageCopyButton = memo(function MessageCopyButton({
  text,
  size = "xs",
  variant = "outline",
  className,
}) {
  const ref = useRef(null);
  const { copyToClipboard, isCopied } = useCopyToClipboard({
    onCopy: () => onCopy(ref),
    onError: (error) => onCopyError(ref, error),
    timeout: ANCHORED_TOAST_TIMEOUT_MS,
  });
  return _jsxs(Tooltip, {
    children: [
      _jsx(TooltipTrigger, {
        render: _jsx(Button, {
          "aria-label": "Copy link",
          disabled: isCopied,
          onClick: () => copyToClipboard(text),
          ref: ref,
          type: "button",
          size: size,
          variant: variant,
          className: cn(className),
        }),
        children: isCopied
          ? _jsx(CheckIcon, { className: "size-3 text-success" })
          : _jsx(CopyIcon, { className: "size-3" }),
      }),
      _jsx(TooltipPopup, { children: _jsx("p", { children: "Copy to clipboard" }) }),
    ],
  });
});
