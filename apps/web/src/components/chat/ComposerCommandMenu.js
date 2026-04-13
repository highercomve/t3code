import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BotIcon } from "lucide-react";
import { memo, useLayoutEffect, useMemo, useRef } from "react";
import { formatProviderSkillInstallSource } from "~/providerSkillPresentation";
import { cn } from "~/lib/utils";
import { Badge } from "../ui/badge";
import {
  Command,
  CommandGroup,
  CommandGroupLabel,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { VscodeEntryIcon } from "./VscodeEntryIcon";
function SkillGlyph(props) {
  return _jsxs("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.85",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: props.className,
    "aria-hidden": "true",
    children: [
      _jsx("path", {
        d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
      }),
      _jsx("path", { d: "m3.3 7 8.7 5 8.7-5" }),
      _jsx("path", { d: "M12 22V12" }),
    ],
  });
}
function groupCommandItems(items, triggerKind, groupSlashCommandSections) {
  if (triggerKind === "skill") {
    return items.length > 0 ? [{ id: "skills", label: "Skills", items }] : [];
  }
  if (triggerKind !== "slash-command" || !groupSlashCommandSections) {
    return [{ id: "default", label: null, items }];
  }
  const builtInItems = items.filter((item) => item.type === "slash-command");
  const providerItems = items.filter((item) => item.type === "provider-slash-command");
  const groups = [];
  if (builtInItems.length > 0) {
    groups.push({ id: "built-in", label: "Built-in", items: builtInItems });
  }
  if (providerItems.length > 0) {
    groups.push({ id: "provider", label: "Provider", items: providerItems });
  }
  return groups;
}
export const ComposerCommandMenu = memo(function ComposerCommandMenu(props) {
  const listRef = useRef(null);
  const groups = useMemo(
    () =>
      groupCommandItems(props.items, props.triggerKind, props.groupSlashCommandSections ?? true),
    [props.groupSlashCommandSections, props.items, props.triggerKind],
  );
  useLayoutEffect(() => {
    if (!props.activeItemId || !listRef.current) return;
    const el = listRef.current.querySelector(
      `[data-composer-item-id="${CSS.escape(props.activeItemId)}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [props.activeItemId]);
  return _jsx(Command, {
    autoHighlight: false,
    mode: "none",
    onItemHighlighted: (highlightedValue) => {
      props.onHighlightedItemChange(typeof highlightedValue === "string" ? highlightedValue : null);
    },
    children: _jsxs("div", {
      ref: listRef,
      className:
        "relative overflow-hidden rounded-xl border border-border/80 bg-popover/96 shadow-lg/8 backdrop-blur-xs",
      children: [
        _jsx(CommandList, {
          className: "max-h-72",
          children: groups.map((group, groupIndex) =>
            _jsxs(
              "div",
              {
                children: [
                  groupIndex > 0 ? _jsx(CommandSeparator, { className: "my-0.5" }) : null,
                  _jsxs(CommandGroup, {
                    children: [
                      group.label
                        ? _jsx(CommandGroupLabel, {
                            className:
                              "px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/55",
                            children: group.label,
                          })
                        : null,
                      group.items.map((item) =>
                        _jsx(
                          ComposerCommandMenuItem,
                          {
                            item: item,
                            resolvedTheme: props.resolvedTheme,
                            isActive: props.activeItemId === item.id,
                            onHighlight: props.onHighlightedItemChange,
                            onSelect: props.onSelect,
                          },
                          item.id,
                        ),
                      ),
                    ],
                  }),
                ],
              },
              group.id,
            ),
          ),
        }),
        props.items.length === 0
          ? _jsx("div", {
              className: "px-3 py-2",
              children:
                props.triggerKind === "skill"
                  ? _jsxs(CommandGroup, {
                      children: [
                        _jsx(CommandGroupLabel, {
                          className:
                            "px-0 pt-0 pb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/55",
                          children: "Skills",
                        }),
                        _jsx("p", {
                          className: "text-muted-foreground/70 text-xs",
                          children: props.isLoading
                            ? "Searching workspace skills..."
                            : (props.emptyStateText ??
                              "No skills found. Try / to browse provider commands."),
                        }),
                      ],
                    })
                  : _jsx("p", {
                      className: "text-muted-foreground/70 text-xs",
                      children: props.isLoading
                        ? "Searching workspace files..."
                        : (props.emptyStateText ??
                          (props.triggerKind === "path"
                            ? "No matching files or folders."
                            : "No matching command.")),
                    }),
            })
          : null,
      ],
    }),
  });
});
const ComposerCommandMenuItem = memo(function ComposerCommandMenuItem(props) {
  const skillSourceLabel =
    props.item.type === "skill" ? formatProviderSkillInstallSource(props.item.skill) : null;
  return _jsxs(CommandItem, {
    value: props.item.id,
    "data-composer-item-id": props.item.id,
    className: cn(
      "cursor-pointer select-none gap-2 hover:bg-transparent hover:text-inherit data-highlighted:bg-transparent data-highlighted:text-inherit",
      props.isActive && "bg-accent! text-accent-foreground!",
    ),
    onMouseMove: () => {
      if (!props.isActive) props.onHighlight(props.item.id);
    },
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
        ? _jsx(BotIcon, { className: "size-4 shrink-0 text-muted-foreground/80" })
        : null,
      props.item.type === "provider-slash-command"
        ? _jsx("span", {
            className:
              "inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground/80",
            children: _jsx(SkillGlyph, { className: "size-3.5" }),
          })
        : null,
      props.item.type === "skill"
        ? _jsx("span", {
            className:
              "inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground/80",
            children: _jsx(SkillGlyph, { className: "size-3.5" }),
          })
        : null,
      props.item.type === "model"
        ? _jsx(Badge, {
            variant: "outline",
            className: "px-1.5 py-0 text-[10px]",
            children: "model",
          })
        : null,
      _jsxs("span", {
        className: "flex min-w-0 flex-1 items-center gap-2",
        children: [
          _jsx("span", { className: "shrink-0", children: props.item.label }),
          _jsx("span", {
            className: "min-w-0 flex-1 truncate text-muted-foreground/70 text-xs",
            children: props.item.description,
          }),
        ],
      }),
      skillSourceLabel
        ? _jsx("span", {
            className: "shrink-0 pl-2 text-muted-foreground/70 text-xs",
            children: skillSourceLabel,
          })
        : null,
    ],
  });
});
