"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";
import * as React from "react";
import { cn } from "~/lib/utils";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
const ComboboxContext = React.createContext({
  chipsRef: null,
  multiple: false,
});
function Combobox(props) {
  const chipsRef = React.useRef(null);
  const value = React.useMemo(() => ({ chipsRef, multiple: !!props.multiple }), [props.multiple]);
  return _jsx(ComboboxContext.Provider, {
    value: value,
    children: _jsx(ComboboxPrimitive.Root, { ...props }),
  });
}
function ComboboxChipsInput({ className, size, ...props }) {
  const sizeValue = size ?? "default";
  return _jsx(ComboboxPrimitive.Input, {
    className: cn(
      "min-w-12 flex-1 text-base outline-none sm:text-sm [[data-slot=combobox-chip]+&]:ps-0.5",
      sizeValue === "sm" ? "ps-1.5" : "ps-2",
      className,
    ),
    "data-size": typeof sizeValue === "string" ? sizeValue : undefined,
    "data-slot": "combobox-chips-input",
    size: typeof sizeValue === "number" ? sizeValue : undefined,
    ...props,
  });
}
function ComboboxInput({
  className,
  inputClassName,
  showTrigger = true,
  showClear = false,
  startAddon,
  size,
  ...props
}) {
  const sizeValue = size ?? "default";
  return _jsxs("div", {
    className: "relative not-has-[>*.w-full]:w-fit w-full text-foreground has-disabled:opacity-64",
    children: [
      startAddon &&
        _jsx("div", {
          "aria-hidden": "true",
          className:
            "[&_svg]:-mx-0.5 pointer-events-none absolute inset-y-0 start-px z-10 flex items-center ps-[calc(--spacing(3)-1px)] opacity-80 has-[+[data-size=sm]]:ps-[calc(--spacing(2.5)-1px)] [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4",
          "data-slot": "combobox-start-addon",
          children: startAddon,
        }),
      _jsx(ComboboxPrimitive.Input, {
        className: cn(
          startAddon &&
            "data-[size=sm]:*:data-[slot=combobox-input]:ps-[calc(--spacing(7.5)-1px)] *:data-[slot=combobox-input]:ps-[calc(--spacing(8.5)-1px)] sm:data-[size=sm]:*:data-[slot=combobox-input]:ps-[calc(--spacing(7)-1px)] sm:*:data-[slot=combobox-input]:ps-[calc(--spacing(8)-1px)]",
          sizeValue === "sm"
            ? "has-[+[data-slot=combobox-trigger],+[data-slot=combobox-clear]]:*:data-[slot=combobox-input]:pe-6.5"
            : "has-[+[data-slot=combobox-trigger],+[data-slot=combobox-clear]]:*:data-[slot=combobox-input]:pe-7",
          className,
        ),
        "data-slot": "combobox-input",
        render: _jsx(Input, {
          className: cn("has-disabled:opacity-100", inputClassName),
          nativeInput: true,
          size: sizeValue,
        }),
        ...props,
      }),
      showTrigger &&
        _jsx(ComboboxTrigger, {
          className: cn(
            "-translate-y-1/2 absolute top-1/2 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 outline-none transition-opacity pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:opacity-100 has-[+[data-slot=combobox-clear]]:hidden sm:size-7 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
            sizeValue === "sm" ? "end-0" : "end-0.5",
          ),
          children: _jsx(ComboboxPrimitive.Icon, {
            "data-slot": "combobox-icon",
            children: _jsx(ChevronsUpDownIcon, {}),
          }),
        }),
      showClear &&
        _jsx(ComboboxClear, {
          className: cn(
            "-translate-y-1/2 absolute top-1/2 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 outline-none transition-opacity pointer-coarse:after:absolute pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:opacity-100 has-[+[data-slot=combobox-clear]]:hidden sm:size-7 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
            sizeValue === "sm" ? "end-0" : "end-0.5",
          ),
          children: _jsx(XIcon, {}),
        }),
    ],
  });
}
function ComboboxTrigger({ className, children, ...props }) {
  return _jsx(ComboboxPrimitive.Trigger, {
    className: className,
    "data-slot": "combobox-trigger",
    ...props,
    children: children,
  });
}
function ComboboxPopup({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  alignOffset,
  align = "start",
  anchor: anchorProp,
  ...props
}) {
  const { chipsRef } = React.useContext(ComboboxContext);
  const anchor = anchorProp ?? chipsRef;
  return _jsx(ComboboxPrimitive.Portal, {
    children: _jsx(ComboboxPrimitive.Positioner, {
      align: align,
      alignOffset: alignOffset,
      anchor: anchor,
      className: "z-50 select-none",
      "data-slot": "combobox-positioner",
      side: side,
      sideOffset: sideOffset,
      children: _jsx("span", {
        className: cn(
          "relative flex max-h-full min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) rounded-lg border bg-popover not-dark:bg-clip-padding shadow-lg/5 transition-[scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
          className,
        ),
        children: _jsx(ComboboxPrimitive.Popup, {
          className:
            "flex max-h-[min(var(--available-height),23rem)] flex-1 flex-col text-foreground",
          "data-slot": "combobox-popup",
          ...props,
          children: children,
        }),
      }),
    }),
  });
}
function ComboboxItem({ className, children, hideIndicator = false, ...props }) {
  return _jsxs(ComboboxPrimitive.Item, {
    className: cn(
      "grid min-h-8 in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-base outline-none hover:bg-accent data-disabled:pointer-events-none data-selected:bg-accent/50 data-selected:text-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground [&[data-highlighted][data-selected]]:bg-accent [&[data-highlighted][data-selected]]:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className,
    ),
    "data-slot": "combobox-item",
    ...props,
    children: [
      _jsx(ComboboxPrimitive.ItemIndicator, {
        className: cn("col-start-1", hideIndicator && "hidden"),
        children: _jsx(CheckIcon, {}),
      }),
      _jsx("div", {
        className: hideIndicator ? "col-start-1 col-span-full" : "col-start-2",
        children: children,
      }),
    ],
  });
}
function ComboboxSeparator({ className, ...props }) {
  return _jsx(ComboboxPrimitive.Separator, {
    className: cn("mx-2 my-1 h-px bg-border last:hidden", className),
    "data-slot": "combobox-separator",
    ...props,
  });
}
function ComboboxGroup({ className, ...props }) {
  return _jsx(ComboboxPrimitive.Group, {
    className: cn("[[role=group]+&]:mt-1.5", className),
    "data-slot": "combobox-group",
    ...props,
  });
}
function ComboboxGroupLabel({ className, ...props }) {
  return _jsx(ComboboxPrimitive.GroupLabel, {
    className: cn("px-2 py-1.5 font-medium text-muted-foreground text-xs", className),
    "data-slot": "combobox-group-label",
    ...props,
  });
}
function ComboboxEmpty({ className, ...props }) {
  return _jsx(ComboboxPrimitive.Empty, {
    className: cn(
      "not-empty:p-2 text-center text-base text-muted-foreground sm:text-sm",
      className,
    ),
    "data-slot": "combobox-empty",
    ...props,
  });
}
function ComboboxRow({ className, ...props }) {
  return _jsx(ComboboxPrimitive.Row, {
    className: className,
    "data-slot": "combobox-row",
    ...props,
  });
}
function ComboboxValue({ ...props }) {
  return _jsx(ComboboxPrimitive.Value, { "data-slot": "combobox-value", ...props });
}
function ComboboxList({ className, ...props }) {
  return _jsx(ScrollArea, {
    scrollbarGutter: true,
    scrollFade: true,
    children: _jsx(ComboboxPrimitive.List, {
      className: cn(
        "not-empty:scroll-py-1 not-empty:px-1 not-empty:py-1 in-data-has-overflow-y:pe-3",
        className,
      ),
      "data-slot": "combobox-list",
      ...props,
    }),
  });
}
function ComboboxClear({ className, ...props }) {
  return _jsx(ComboboxPrimitive.Clear, {
    className: className,
    "data-slot": "combobox-clear",
    ...props,
  });
}
function ComboboxStatus({ className, ...props }) {
  return _jsx(ComboboxPrimitive.Status, {
    className: cn(
      "px-3 py-2 font-medium text-muted-foreground text-xs empty:m-0 empty:p-0",
      className,
    ),
    "data-slot": "combobox-status",
    ...props,
  });
}
function ComboboxCollection(props) {
  return _jsx(ComboboxPrimitive.Collection, { "data-slot": "combobox-collection", ...props });
}
function ComboboxChips({ className, children, startAddon, ...props }) {
  const { chipsRef } = React.useContext(ComboboxContext);
  return _jsxs(ComboboxPrimitive.Chips, {
    className: cn(
      "relative inline-flex min-h-9 w-full flex-wrap gap-1 rounded-lg border border-input bg-background not-dark:bg-clip-padding p-[calc(--spacing(1)-1px)] text-base shadow-xs/5 outline-none ring-ring/24 transition-shadow *:min-h-7 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-focus-within:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] focus-within:border-ring focus-within:ring-[3px] has-disabled:pointer-events-none has-data-[size=lg]:min-h-10 has-data-[size=sm]:min-h-8 has-aria-invalid:border-destructive/36 has-autofill:bg-foreground/4 has-disabled:opacity-64 has-[:disabled,:focus-within,[aria-invalid]]:shadow-none focus-within:has-aria-invalid:border-destructive/64 focus-within:has-aria-invalid:ring-destructive/16 has-data-[size=lg]:*:min-h-8 has-data-[size=sm]:*:min-h-6 sm:min-h-8 sm:text-sm sm:has-data-[size=lg]:min-h-9 sm:has-data-[size=sm]:min-h-7 sm:*:min-h-6 sm:has-data-[size=lg]:*:min-h-7 sm:has-data-[size=sm]:*:min-h-5 dark:not-has-disabled:bg-input/32 dark:has-autofill:bg-foreground/8 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:not-focus-within:not-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
      className,
    ),
    "data-slot": "combobox-chips",
    ref: chipsRef,
    ...props,
    children: [
      startAddon &&
        _jsx("div", {
          "aria-hidden": "true",
          className:
            "[&_svg]:-ms-0.5 [&_svg]:-me-1.5 flex shrink-0 items-center ps-2 opacity-80 has-[~[data-size=sm]]:has-[+[data-slot=combobox-chip]]:pe-1.5 has-[~[data-size=sm]]:ps-1.5 has-[+[data-slot=combobox-chip]]:pe-2 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
          "data-slot": "combobox-start-addon",
          children: startAddon,
        }),
      children,
    ],
  });
}
function ComboboxChip({ children, ...props }) {
  return _jsxs(ComboboxPrimitive.Chip, {
    className:
      "flex items-center rounded-[calc(var(--radius-md)-1px)] bg-accent ps-2 font-medium text-accent-foreground text-sm outline-none sm:text-xs/(--text-xs--line-height) [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5",
    "data-slot": "combobox-chip",
    ...props,
    children: [children, _jsx(ComboboxChipRemove, {})],
  });
}
function ComboboxChipRemove(props) {
  return _jsx(ComboboxPrimitive.ChipRemove, {
    "aria-label": "Remove",
    className:
      "h-full shrink-0 cursor-pointer px-1.5 opacity-80 hover:opacity-100 [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5",
    "data-slot": "combobox-chip-remove",
    ...props,
    children: _jsx(XIcon, {}),
  });
}
const useComboboxFilter = ComboboxPrimitive.useFilter;
export {
  Combobox,
  ComboboxChipsInput,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxPopup,
  ComboboxItem,
  ComboboxSeparator,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxEmpty,
  ComboboxValue,
  ComboboxList,
  ComboboxClear,
  ComboboxStatus,
  ComboboxRow,
  ComboboxCollection,
  ComboboxChips,
  ComboboxChip,
  useComboboxFilter,
};
