"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Toast } from "@base-ui/react/toast";
import { useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { ThreadId } from "@t3tools/contracts";
import {
  CheckIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  CopyIcon,
  InfoIcon,
  LoaderCircleIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import { useCopyToClipboard } from "~/hooks/useCopyToClipboard";
import { buildVisibleToastLayout, shouldHideCollapsedToastContent } from "./toast.logic";
const toastManager = Toast.createToastManager();
const anchoredToastManager = Toast.createToastManager();
const threadToastVisibleTimeoutRemainingMs = new Map();
const TOAST_ICONS = {
  error: CircleAlertIcon,
  info: InfoIcon,
  loading: LoaderCircleIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
};
function CopyErrorButton({ text }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  return _jsx("button", {
    className:
      "shrink-0 cursor-pointer rounded-md p-1 text-muted-foreground opacity-60 transition-opacity hover:opacity-100",
    onClick: () => copyToClipboard(text),
    title: "Copy error",
    type: "button",
    children: isCopied
      ? _jsx(CheckIcon, { className: "size-3.5 text-success" })
      : _jsx(CopyIcon, { className: "size-3.5" }),
  });
}
function shouldRenderForActiveThread(data, activeThreadId) {
  const toastThreadId = data?.threadId;
  if (!toastThreadId) return true;
  return toastThreadId === activeThreadId;
}
function useActiveThreadIdFromRoute() {
  return useParams({
    strict: false,
    select: (params) =>
      typeof params.threadId === "string" ? ThreadId.makeUnsafe(params.threadId) : null,
  });
}
function ThreadToastVisibleAutoDismiss({ toastId, dismissAfterVisibleMs }) {
  useEffect(() => {
    if (!dismissAfterVisibleMs || dismissAfterVisibleMs <= 0) return;
    if (typeof window === "undefined" || typeof document === "undefined") return;
    let remainingMs = threadToastVisibleTimeoutRemainingMs.get(toastId) ?? dismissAfterVisibleMs;
    let startedAtMs = null;
    let timeoutId = null;
    let closed = false;
    const clearTimer = () => {
      if (timeoutId === null) return;
      window.clearTimeout(timeoutId);
      timeoutId = null;
    };
    const closeToast = () => {
      if (closed) return;
      closed = true;
      threadToastVisibleTimeoutRemainingMs.delete(toastId);
      toastManager.close(toastId);
    };
    const pause = () => {
      if (startedAtMs === null) return;
      remainingMs = Math.max(0, remainingMs - (Date.now() - startedAtMs));
      startedAtMs = null;
      clearTimer();
      threadToastVisibleTimeoutRemainingMs.set(toastId, remainingMs);
    };
    const start = () => {
      if (closed || startedAtMs !== null) return;
      if (remainingMs <= 0) {
        closeToast();
        return;
      }
      startedAtMs = Date.now();
      clearTimer();
      timeoutId = window.setTimeout(() => {
        remainingMs = 0;
        startedAtMs = null;
        closeToast();
      }, remainingMs);
    };
    const syncTimer = () => {
      const shouldRun = document.visibilityState === "visible" && document.hasFocus();
      if (shouldRun) {
        start();
        return;
      }
      pause();
    };
    syncTimer();
    document.addEventListener("visibilitychange", syncTimer);
    window.addEventListener("focus", syncTimer);
    window.addEventListener("blur", syncTimer);
    return () => {
      document.removeEventListener("visibilitychange", syncTimer);
      window.removeEventListener("focus", syncTimer);
      window.removeEventListener("blur", syncTimer);
      pause();
      clearTimer();
    };
  }, [dismissAfterVisibleMs, toastId]);
  return null;
}
function ToastProvider({ children, position = "top-right", ...props }) {
  return _jsxs(Toast.Provider, {
    toastManager: toastManager,
    ...props,
    children: [children, _jsx(Toasts, { position: position })],
  });
}
function Toasts({ position = "top-right" }) {
  const { toasts } = Toast.useToastManager();
  const activeThreadId = useActiveThreadIdFromRoute();
  const isTop = position.startsWith("top");
  const visibleToasts = toasts.filter((toast) =>
    shouldRenderForActiveThread(toast.data, activeThreadId),
  );
  const visibleToastLayout = buildVisibleToastLayout(visibleToasts);
  useEffect(() => {
    const activeToastIds = new Set(toasts.map((toast) => toast.id));
    for (const toastId of threadToastVisibleTimeoutRemainingMs.keys()) {
      if (!activeToastIds.has(toastId)) {
        threadToastVisibleTimeoutRemainingMs.delete(toastId);
      }
    }
  }, [toasts]);
  return _jsx(Toast.Portal, {
    "data-slot": "toast-portal",
    children: _jsx(Toast.Viewport, {
      className: cn(
        "fixed z-50 mx-auto flex w-[calc(100%-var(--toast-inset)*2)] max-w-90 [--toast-header-offset:52px] [--toast-inset:--spacing(4)] sm:[--toast-inset:--spacing(8)]",
        // Vertical positioning
        "data-[position*=top]:top-[calc(var(--toast-inset)+var(--toast-header-offset))]",
        "data-[position*=bottom]:bottom-(--toast-inset)",
        // Horizontal positioning
        "data-[position*=left]:left-(--toast-inset)",
        "data-[position*=right]:right-(--toast-inset)",
        "data-[position*=center]:-translate-x-1/2 data-[position*=center]:left-1/2",
      ),
      "data-position": position,
      "data-slot": "toast-viewport",
      style: {
        "--toast-frontmost-height": `${visibleToastLayout.frontmostHeight}px`,
      },
      children: visibleToastLayout.items.map(({ toast, visibleIndex, offsetY }) => {
        const Icon = toast.type ? TOAST_ICONS[toast.type] : null;
        const hideCollapsedContent = shouldHideCollapsedToastContent(
          visibleIndex,
          visibleToastLayout.items.length,
        );
        return _jsxs(
          Toast.Root,
          {
            className: cn(
              "absolute z-[calc(9999-var(--toast-index))] h-(--toast-calc-height) w-full select-none rounded-lg border bg-popover not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 [transition:transform_.5s_cubic-bezier(.22,1,.36,1),opacity_.5s,height_.15s] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
              // Base positioning using data-position
              "data-[position*=right]:right-0 data-[position*=right]:left-auto",
              "data-[position*=left]:right-auto data-[position*=left]:left-0",
              "data-[position*=center]:right-0 data-[position*=center]:left-0",
              "data-[position*=top]:top-0 data-[position*=top]:bottom-auto data-[position*=top]:origin-top",
              "data-[position*=bottom]:top-auto data-[position*=bottom]:bottom-0 data-[position*=bottom]:origin-bottom",
              // Gap fill for hover
              "after:absolute after:left-0 after:h-[calc(var(--toast-gap)+1px)] after:w-full",
              "data-[position*=top]:after:top-full",
              "data-[position*=bottom]:after:bottom-full",
              // Define some variables
              // Base UI exposes a shared front-most height for the collapsed stack.
              // If that shared measurement is briefly stale, long content can render
              // outside the card until hover expands the toast and swaps to its own height.
              "[--toast-calc-height:max(var(--toast-frontmost-height,var(--toast-height)),var(--toast-height))] [--toast-gap:--spacing(3)] [--toast-peek:--spacing(3)] [--toast-scale:calc(max(0,1-(var(--toast-index)*.1)))] [--toast-shrink:calc(1-var(--toast-scale))]",
              // Define offset-y variable
              "data-[position*=top]:[--toast-calc-offset-y:calc(var(--toast-offset-y)+var(--toast-index)*var(--toast-gap)+var(--toast-swipe-movement-y))]",
              "data-[position*=bottom]:[--toast-calc-offset-y:calc(var(--toast-offset-y)*-1+var(--toast-index)*var(--toast-gap)*-1+var(--toast-swipe-movement-y))]",
              // Default state transform
              "data-[position*=top]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--toast-peek))+(var(--toast-shrink)*var(--toast-calc-height))))_scale(var(--toast-scale))]",
              "data-[position*=bottom]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--toast-peek))-(var(--toast-shrink)*var(--toast-calc-height))))_scale(var(--toast-scale))]",
              // Limited state
              "data-limited:opacity-0",
              // Expanded state
              "data-expanded:h-(--toast-height)",
              "data-position:data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--toast-calc-offset-y))]",
              // Starting and ending animations
              "data-[position*=top]:data-starting-style:transform-[translateY(calc(-100%-var(--toast-inset)))]",
              "data-[position*=bottom]:data-starting-style:transform-[translateY(calc(100%+var(--toast-inset)))]",
              "data-[position*=top]:data-[position*=right]:data-starting-style:transform-[translateX(calc(100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
              "data-ending-style:opacity-0",
              // Ending animations (direction-aware)
              "data-ending-style:not-data-limited:not-data-swipe-direction:transform-[translateY(calc(100%+var(--toast-inset)))]",
              "data-[position*=top]:data-[position*=right]:data-ending-style:not-data-limited:not-data-swipe-direction:transform-[translateX(calc(100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
              "data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-100%-var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
              "data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
              "data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-100%-var(--toast-inset)))]",
              "data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))]",
              // Ending animations (expanded)
              "data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-100%-var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
              "data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
              "data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-100%-var(--toast-inset)))]",
              "data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))]",
            ),
            "data-position": position,
            style: {
              "--toast-index": visibleIndex,
              "--toast-offset-y": `${offsetY}px`,
            },
            swipeDirection: position.includes("center")
              ? [isTop ? "up" : "down"]
              : position.includes("left")
                ? ["left", isTop ? "up" : "down"]
                : ["right", isTop ? "up" : "down"],
            toast: toast,
            children: [
              _jsx(ThreadToastVisibleAutoDismiss, {
                dismissAfterVisibleMs: toast.data?.dismissAfterVisibleMs,
                toastId: toast.id,
              }),
              _jsxs(Toast.Content, {
                className: cn(
                  "pointer-events-auto flex items-center justify-between gap-1.5 overflow-hidden px-3.5 py-3 text-sm transition-opacity duration-250 data-expanded:opacity-100",
                  hideCollapsedContent &&
                    "not-data-expanded:pointer-events-none not-data-expanded:opacity-0",
                ),
                children: [
                  _jsxs("div", {
                    className: "flex min-w-0 flex-1 gap-2",
                    children: [
                      Icon &&
                        _jsx("div", {
                          className:
                            "[&>svg]:h-lh [&>svg]:w-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                          "data-slot": "toast-icon",
                          children: _jsx(Icon, {
                            className:
                              "in-data-[type=loading]:animate-spin in-data-[type=error]:text-destructive in-data-[type=info]:text-info in-data-[type=success]:text-success in-data-[type=warning]:text-warning in-data-[type=loading]:opacity-80",
                          }),
                        }),
                      _jsxs("div", {
                        className: "flex min-w-0 flex-1 flex-col gap-0.5",
                        children: [
                          _jsxs("div", {
                            className: "flex items-center justify-between gap-1",
                            children: [
                              _jsx(Toast.Title, {
                                className: "min-w-0 break-words font-medium",
                                "data-slot": "toast-title",
                              }),
                              toast.type === "error" &&
                                typeof toast.description === "string" &&
                                _jsx(CopyErrorButton, { text: toast.description }),
                            ],
                          }),
                          _jsx(Toast.Description, {
                            className: "min-w-0 select-text break-words text-muted-foreground",
                            "data-slot": "toast-description",
                          }),
                        ],
                      }),
                    ],
                  }),
                  toast.actionProps &&
                    _jsx(Toast.Action, {
                      className: cn(buttonVariants({ size: "xs" }), "shrink-0"),
                      "data-slot": "toast-action",
                      children: toast.actionProps.children,
                    }),
                ],
              }),
            ],
          },
          toast.id,
        );
      }),
    }),
  });
}
function AnchoredToastProvider({ children, ...props }) {
  return _jsxs(Toast.Provider, {
    toastManager: anchoredToastManager,
    ...props,
    children: [children, _jsx(AnchoredToasts, {})],
  });
}
function AnchoredToasts() {
  const { toasts } = Toast.useToastManager();
  const activeThreadId = useActiveThreadIdFromRoute();
  return _jsx(Toast.Portal, {
    "data-slot": "toast-portal-anchored",
    children: _jsx(Toast.Viewport, {
      className: "outline-none",
      "data-slot": "toast-viewport-anchored",
      children: toasts
        .filter((toast) => shouldRenderForActiveThread(toast.data, activeThreadId))
        .map((toast) => {
          const Icon = toast.type ? TOAST_ICONS[toast.type] : null;
          const tooltipStyle = toast.data?.tooltipStyle ?? false;
          const positionerProps = toast.positionerProps;
          if (!positionerProps?.anchor) {
            return null;
          }
          return _jsx(
            Toast.Positioner,
            {
              className: "z-50 max-w-[min(--spacing(64),var(--available-width))]",
              "data-slot": "toast-positioner",
              sideOffset: positionerProps.sideOffset ?? 4,
              toast: toast,
              children: _jsx(Toast.Root, {
                className: cn(
                  "relative text-balance border bg-popover not-dark:bg-clip-padding text-popover-foreground text-xs transition-[scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:shadow-[0_1px_--theme(--color-black/4%)] data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
                  tooltipStyle
                    ? "rounded-md shadow-md/5 before:rounded-[calc(var(--radius-md)-1px)]"
                    : "rounded-lg shadow-lg/5 before:rounded-[calc(var(--radius-lg)-1px)]",
                ),
                "data-slot": "toast-popup",
                toast: toast,
                children: tooltipStyle
                  ? _jsx(Toast.Content, {
                      className: "pointer-events-auto px-2 py-1",
                      children: _jsx(Toast.Title, { "data-slot": "toast-title" }),
                    })
                  : _jsxs(Toast.Content, {
                      className:
                        "pointer-events-auto flex items-center justify-between gap-1.5 overflow-hidden px-3.5 py-3 text-sm",
                      children: [
                        _jsxs("div", {
                          className: "flex min-w-0 flex-1 gap-2",
                          children: [
                            Icon &&
                              _jsx("div", {
                                className:
                                  "[&>svg]:h-lh [&>svg]:w-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                                "data-slot": "toast-icon",
                                children: _jsx(Icon, {
                                  className:
                                    "in-data-[type=loading]:animate-spin in-data-[type=error]:text-destructive in-data-[type=info]:text-info in-data-[type=success]:text-success in-data-[type=warning]:text-warning in-data-[type=loading]:opacity-80",
                                }),
                              }),
                            _jsxs("div", {
                              className: "flex min-w-0 flex-1 flex-col gap-0.5",
                              children: [
                                _jsxs("div", {
                                  className: "flex items-center gap-1",
                                  children: [
                                    _jsx(Toast.Title, {
                                      className: "min-w-0 break-words font-medium",
                                      "data-slot": "toast-title",
                                    }),
                                    toast.type === "error" &&
                                      typeof toast.description === "string" &&
                                      _jsx(CopyErrorButton, { text: toast.description }),
                                  ],
                                }),
                                _jsx(Toast.Description, {
                                  className:
                                    "min-w-0 select-text break-words text-muted-foreground",
                                  "data-slot": "toast-description",
                                }),
                              ],
                            }),
                          ],
                        }),
                        toast.actionProps &&
                          _jsx(Toast.Action, {
                            className: cn(buttonVariants({ size: "xs" }), "shrink-0"),
                            "data-slot": "toast-action",
                            children: toast.actionProps.children,
                          }),
                      ],
                    }),
              }),
            },
            toast.id,
          );
        }),
    }),
  });
}
export { ToastProvider, toastManager, AnchoredToastProvider, anchoredToastManager };
