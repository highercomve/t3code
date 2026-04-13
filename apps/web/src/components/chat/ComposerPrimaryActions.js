import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from "react";
import { ChevronDownIcon, ChevronLeftIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "../ui/menu";
export const formatPendingPrimaryActionLabel = (input) => {
  if (input.isResponding) {
    return "Submitting...";
  }
  if (input.compact) {
    return input.isLastQuestion ? "Submit" : "Next";
  }
  if (!input.isLastQuestion) {
    return "Next question";
  }
  return input.questionIndex > 0 ? "Submit answers" : "Submit answer";
};
export const ComposerPrimaryActions = memo(function ComposerPrimaryActions({
  compact,
  pendingAction,
  isRunning,
  showPlanFollowUpPrompt,
  promptHasText,
  isSendBusy,
  isConnecting,
  isPreparingWorktree,
  hasSendableContent,
  onPreviousPendingQuestion,
  onInterrupt,
  onImplementPlanInNewThread,
}) {
  if (pendingAction) {
    return _jsxs("div", {
      className: cn("flex items-center justify-end", compact ? "gap-1.5" : "gap-2"),
      children: [
        pendingAction.questionIndex > 0
          ? compact
            ? _jsx(Button, {
                size: "icon-sm",
                variant: "outline",
                className: "rounded-full",
                onClick: onPreviousPendingQuestion,
                disabled: pendingAction.isResponding,
                "aria-label": "Previous question",
                children: _jsx(ChevronLeftIcon, { className: "size-3.5" }),
              })
            : _jsx(Button, {
                size: "sm",
                variant: "outline",
                className: "rounded-full",
                onClick: onPreviousPendingQuestion,
                disabled: pendingAction.isResponding,
                children: "Previous",
              })
          : null,
        _jsx(Button, {
          type: "submit",
          size: "sm",
          className: cn("rounded-full", compact ? "px-3" : "px-4"),
          disabled:
            pendingAction.isResponding ||
            (pendingAction.isLastQuestion ? !pendingAction.isComplete : !pendingAction.canAdvance),
          children: formatPendingPrimaryActionLabel({
            compact,
            isLastQuestion: pendingAction.isLastQuestion,
            isResponding: pendingAction.isResponding,
            questionIndex: pendingAction.questionIndex,
          }),
        }),
      ],
    });
  }
  if (isRunning) {
    return _jsx("button", {
      type: "button",
      className:
        "flex size-8 cursor-pointer items-center justify-center rounded-full bg-rose-500/90 text-white transition-all duration-150 hover:bg-rose-500 hover:scale-105 sm:h-8 sm:w-8",
      onClick: onInterrupt,
      "aria-label": "Stop generation",
      children: _jsx("svg", {
        width: "12",
        height: "12",
        viewBox: "0 0 12 12",
        fill: "currentColor",
        "aria-hidden": "true",
        children: _jsx("rect", { x: "2", y: "2", width: "8", height: "8", rx: "1.5" }),
      }),
    });
  }
  if (showPlanFollowUpPrompt) {
    if (promptHasText) {
      return _jsx(Button, {
        type: "submit",
        size: "sm",
        className: cn("rounded-full", compact ? "h-9 px-3 sm:h-8" : "h-9 px-4 sm:h-8"),
        disabled: isSendBusy || isConnecting,
        children: isConnecting || isSendBusy ? "Sending..." : "Refine",
      });
    }
    return _jsxs("div", {
      "data-chat-composer-implement-actions": "true",
      className: "flex items-center justify-end",
      children: [
        _jsx(Button, {
          type: "submit",
          size: "sm",
          className: "h-9 rounded-l-full rounded-r-none px-4 sm:h-8",
          disabled: isSendBusy || isConnecting,
          children: isConnecting || isSendBusy ? "Sending..." : "Implement",
        }),
        _jsxs(Menu, {
          children: [
            _jsx(MenuTrigger, {
              render: _jsx(Button, {
                size: "sm",
                variant: "default",
                className: "h-9 rounded-l-none rounded-r-full border-l-white/12 px-2 sm:h-8",
                "aria-label": "Implementation actions",
                disabled: isSendBusy || isConnecting,
              }),
              children: _jsx(ChevronDownIcon, { className: "size-3.5" }),
            }),
            _jsx(MenuPopup, {
              align: "end",
              side: "top",
              children: _jsx(MenuItem, {
                disabled: isSendBusy || isConnecting,
                onClick: () => void onImplementPlanInNewThread(),
                children: "Implement in a new thread",
              }),
            }),
          ],
        }),
      ],
    });
  }
  return _jsx("button", {
    type: "submit",
    className:
      "flex h-9 w-9 enabled:cursor-pointer items-center justify-center rounded-full bg-primary/90 text-primary-foreground transition-all duration-150 hover:bg-primary hover:scale-105 disabled:pointer-events-none disabled:opacity-30 disabled:hover:scale-100 sm:h-8 sm:w-8",
    disabled: isSendBusy || isConnecting || !hasSendableContent,
    "aria-label": isConnecting
      ? "Connecting"
      : isPreparingWorktree
        ? "Preparing worktree"
        : isSendBusy
          ? "Sending"
          : "Send message",
    children:
      isConnecting || isSendBusy
        ? _jsx("svg", {
            width: "14",
            height: "14",
            viewBox: "0 0 14 14",
            fill: "none",
            className: "animate-spin",
            "aria-hidden": "true",
            children: _jsx("circle", {
              cx: "7",
              cy: "7",
              r: "5.5",
              stroke: "currentColor",
              strokeWidth: "1.5",
              strokeLinecap: "round",
              strokeDasharray: "20 12",
            }),
          })
        : _jsx("svg", {
            width: "14",
            height: "14",
            viewBox: "0 0 14 14",
            fill: "none",
            "aria-hidden": "true",
            children: _jsx("path", {
              d: "M7 11.5V2.5M7 2.5L3 6.5M7 2.5L11 6.5",
              stroke: "currentColor",
              strokeWidth: "1.8",
              strokeLinecap: "round",
              strokeLinejoin: "round",
            }),
          }),
  });
});
