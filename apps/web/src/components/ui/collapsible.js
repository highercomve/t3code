"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { cn } from "~/lib/utils";
function Collapsible({ ...props }) {
  return _jsx(CollapsiblePrimitive.Root, { "data-slot": "collapsible", ...props });
}
function CollapsibleTrigger({ className, ...props }) {
  return _jsx(CollapsiblePrimitive.Trigger, {
    className: cn("cursor-pointer", className),
    "data-slot": "collapsible-trigger",
    ...props,
  });
}
function CollapsiblePanel({ className, ...props }) {
  return _jsx(CollapsiblePrimitive.Panel, {
    className: cn(
      "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 data-ending-style:h-0 data-starting-style:h-0 data-open:data-ending-style:[height:var(--collapsible-panel-height)]",
      className,
    ),
    "data-slot": "collapsible-panel",
    ...props,
  });
}
export {
  Collapsible,
  CollapsibleTrigger,
  CollapsiblePanel,
  CollapsiblePanel as CollapsibleContent,
};
