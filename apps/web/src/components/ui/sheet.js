"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
const Sheet = SheetPrimitive.Root;
const SheetPortal = SheetPrimitive.Portal;
function SheetTrigger(props) {
  return _jsx(SheetPrimitive.Trigger, { "data-slot": "sheet-trigger", ...props });
}
function SheetClose(props) {
  return _jsx(SheetPrimitive.Close, { "data-slot": "sheet-close", ...props });
}
function SheetBackdrop({ className, ...props }) {
  return _jsx(SheetPrimitive.Backdrop, {
    className: cn(
      "fixed inset-0 z-50 bg-black/32 backdrop-blur-sm transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0",
      className,
    ),
    "data-slot": "sheet-backdrop",
    ...props,
  });
}
function SheetViewport({ className, side, variant = "default", ...props }) {
  return _jsx(SheetPrimitive.Viewport, {
    className: cn(
      "fixed inset-0 z-50 grid",
      side === "bottom" && "grid grid-rows-[1fr_auto] pt-12",
      side === "top" && "grid grid-rows-[auto_1fr] pb-12",
      side === "left" && "flex justify-start",
      side === "right" && "flex justify-end",
      variant === "inset" && "sm:p-4",
      className,
    ),
    "data-slot": "sheet-viewport",
    ...props,
  });
}
function SheetPopup({
  className,
  children,
  showCloseButton = true,
  keepMounted = false,
  side = "right",
  variant = "default",
  ...props
}) {
  return _jsxs(SheetPortal, {
    keepMounted: keepMounted,
    children: [
      _jsx(SheetBackdrop, {}),
      _jsx(SheetViewport, {
        side: side,
        variant: variant,
        children: _jsxs(SheetPrimitive.Popup, {
          className: cn(
            "relative flex max-h-full min-h-0 w-full min-w-0 flex-col bg-popover not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 transition-[opacity,translate] duration-200 ease-in-out will-change-transform before:pointer-events-none before:absolute before:inset-0 before:shadow-[0_1px_--theme(--color-black/4%)] data-ending-style:opacity-0 data-starting-style:opacity-0 max-sm:before:hidden dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            side === "bottom" &&
              "row-start-2 border-t data-ending-style:translate-y-8 data-starting-style:translate-y-8",
            side === "top" &&
              "data-ending-style:-translate-y-8 data-starting-style:-translate-y-8 border-b",
            side === "left" &&
              "data-ending-style:-translate-x-8 data-starting-style:-translate-x-8 w-[calc(100%-(--spacing(12)))] max-w-md border-e",
            side === "right" &&
              "col-start-2 w-[calc(100%-(--spacing(12)))] max-w-md border-s data-ending-style:translate-x-8 data-starting-style:translate-x-8",
            variant === "inset" &&
              "before:hidden sm:rounded-2xl sm:border sm:before:rounded-[calc(var(--radius-2xl)-1px)] sm:**:data-[slot=sheet-footer]:rounded-b-[calc(var(--radius-2xl)-1px)]",
            className,
          ),
          "data-slot": "sheet-popup",
          ...props,
          children: [
            children,
            showCloseButton &&
              _jsx(SheetPrimitive.Close, {
                "aria-label": "Close",
                className: "absolute end-2 top-2",
                render: _jsx(Button, { size: "icon", variant: "ghost" }),
                children: _jsx(XIcon, {}),
              }),
          ],
        }),
      }),
    ],
  });
}
function SheetHeader({ className, ...props }) {
  return _jsx("div", {
    className: cn(
      "flex flex-col gap-2 p-6 in-[[data-slot=sheet-popup]:has([data-slot=sheet-panel])]:pb-3 max-sm:pb-4",
      className,
    ),
    "data-slot": "sheet-header",
    ...props,
  });
}
function SheetFooter({ className, variant = "default", ...props }) {
  return _jsx("div", {
    className: cn(
      "flex flex-col-reverse gap-2 px-6 sm:flex-row sm:justify-end",
      variant === "default" && "border-t bg-muted/72 py-4",
      variant === "bare" &&
        "in-[[data-slot=sheet-popup]:has([data-slot=sheet-panel])]:pt-3 pt-4 pb-6",
      className,
    ),
    "data-slot": "sheet-footer",
    ...props,
  });
}
function SheetTitle({ className, ...props }) {
  return _jsx(SheetPrimitive.Title, {
    className: cn("font-heading font-semibold text-xl leading-none", className),
    "data-slot": "sheet-title",
    ...props,
  });
}
function SheetDescription({ className, ...props }) {
  return _jsx(SheetPrimitive.Description, {
    className: cn("text-muted-foreground text-sm", className),
    "data-slot": "sheet-description",
    ...props,
  });
}
function SheetPanel({ className, scrollFade = true, ...props }) {
  return _jsx(ScrollArea, {
    scrollFade: scrollFade,
    children: _jsx("div", {
      className: cn(
        "p-6 in-[[data-slot=sheet-popup]:has([data-slot=sheet-header])]:pt-1 in-[[data-slot=sheet-popup]:has([data-slot=sheet-footer]:not(.border-t))]:pb-1",
        className,
      ),
      "data-slot": "sheet-panel",
      ...props,
    }),
  });
}
export {
  Sheet,
  SheetTrigger,
  SheetPortal,
  SheetClose,
  SheetBackdrop,
  SheetBackdrop as SheetOverlay,
  SheetPopup,
  SheetPopup as SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetPanel,
};
