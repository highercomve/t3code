"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";
import { cn } from "~/lib/utils";
function Fieldset({ className, ...props }) {
  return _jsx(FieldsetPrimitive.Root, {
    className: cn("flex w-full max-w-64 flex-col gap-6", className),
    "data-slot": "fieldset",
    ...props,
  });
}
function FieldsetLegend({ className, ...props }) {
  return _jsx(FieldsetPrimitive.Legend, {
    className: cn("font-semibold text-foreground", className),
    "data-slot": "fieldset-legend",
    ...props,
  });
}
export { Fieldset, FieldsetLegend };
