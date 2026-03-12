"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Form as FormPrimitive } from "@base-ui/react/form";
import { cn } from "~/lib/utils";
function Form({ className, ...props }) {
  return _jsx(FormPrimitive, {
    className: cn("flex w-full flex-col gap-4", className),
    "data-slot": "form",
    ...props,
  });
}
export { Form };
