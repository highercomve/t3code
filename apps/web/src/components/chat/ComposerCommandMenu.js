import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from "react";
import { BotIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Badge } from "../ui/badge";
import { Command, CommandItem, CommandList } from "../ui/command";
import { VscodeEntryIcon } from "./VscodeEntryIcon";
export const ComposerCommandMenu = memo(function ComposerCommandMenu(props) {
  return _jsx(Command, {
    mode: "none",
    onItemHighlighted: (highlightedValue) => {
      props.onHighlightedItemChange(typeof highlightedValue === "string" ? highlightedValue : null);
    },
    children: _jsxs("div", {
      className:
        "relative overflow-hidden rounded-xl border border-border/80 bg-popover/96 shadow-lg/8 backdrop-blur-xs",
      children: [
        _jsx(CommandList, {
          className: "max-h-64",
          children: props.items.map((item) =>
            _jsx(
              ComposerCommandMenuItem,
              {
                item: item,
                resolvedTheme: props.resolvedTheme,
                isActive: props.activeItemId === item.id,
                onSelect: props.onSelect,
              },
              item.id,
            ),
          ),
        }),
        props.items.length === 0 &&
          _jsx("p", {
            className: "px-3 py-2 text-muted-foreground/70 text-xs",
            children: props.isLoading
              ? "Searching workspace files..."
              : props.triggerKind === "path"
                ? "No matching files or folders."
                : "No matching command.",
          }),
      ],
    }),
  });
});
const ComposerCommandMenuItem = memo(function ComposerCommandMenuItem(props) {
  return _jsxs(CommandItem, {
    value: props.item.id,
    className: cn(
      "cursor-pointer select-none gap-2",
      props.isActive && "bg-accent text-accent-foreground",
    ),
    onMouseDown: (event) => {
      event.preventDefault();
    },
    onClick: () => {
      props.onSelect(props.item);
    },
    children: [
      props.item.type === "path"
        ? _jsx(VscodeEntryIcon, {
            pathValue: props.item.path,
            kind: props.item.pathKind,
            theme: props.resolvedTheme,
          })
        : null,
      props.item.type === "slash-command"
        ? _jsx(BotIcon, { className: "size-4 text-muted-foreground/80" })
        : null,
      props.item.type === "model"
        ? _jsx(Badge, {
            variant: "outline",
            className: "px-1.5 py-0 text-[10px]",
            children: "model",
          })
        : null,
      _jsx("span", {
        className: "flex min-w-0 items-center gap-1.5 truncate",
        children: _jsx("span", { className: "truncate", children: props.item.label }),
      }),
      _jsx("span", {
        className: "truncate text-muted-foreground/70 text-xs",
        children: props.item.description,
      }),
    ],
  });
});
