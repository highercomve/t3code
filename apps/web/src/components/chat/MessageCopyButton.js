import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useCopyToClipboard } from "~/hooks/useCopyToClipboard";
export const MessageCopyButton = memo(function MessageCopyButton({ text }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  return _jsx(Button, {
    type: "button",
    size: "xs",
    variant: "outline",
    onClick: () => copyToClipboard(text),
    title: "Copy message",
    children: isCopied
      ? _jsx(CheckIcon, { className: "size-3 text-success" })
      : _jsx(CopyIcon, { className: "size-3" }),
  });
});
