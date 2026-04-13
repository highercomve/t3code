import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronRightIcon } from "lucide-react";
import { shortcutLabelForCommand } from "../keybindings";
import {
  CommandCollection,
  CommandGroup,
  CommandGroupLabel,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "./ui/command";
export function CommandPaletteResults(props) {
  if (props.groups.length === 0) {
    return _jsx("div", {
      className: "py-10 text-center text-sm text-muted-foreground",
      children:
        props.emptyStateMessage ??
        (props.isActionsOnly
          ? "No matching actions."
          : "No matching commands, projects, or threads."),
    });
  }
  return _jsx(CommandList, {
    children: props.groups.map((group) =>
      _jsxs(
        CommandGroup,
        {
          items: group.items,
          children: [
            _jsx(CommandGroupLabel, { children: group.label }),
            _jsx(CommandCollection, {
              children: (item) =>
                _jsx(
                  CommandPaletteResultRow,
                  {
                    item: item,
                    keybindings: props.keybindings,
                    onExecuteItem: props.onExecuteItem,
                  },
                  item.value,
                ),
            }),
          ],
        },
        group.value,
      ),
    ),
  });
}
function CommandPaletteResultRow(props) {
  const shortcutLabel = props.item.shortcutCommand
    ? shortcutLabelForCommand(props.keybindings, props.item.shortcutCommand)
    : null;
  return _jsxs(CommandItem, {
    value: props.item.value,
    className: "cursor-pointer gap-2",
    onMouseDown: (event) => {
      event.preventDefault();
    },
    onClick: () => {
      props.onExecuteItem(props.item);
    },
    children: [
      props.item.icon,
      props.item.description
        ? _jsxs("span", {
            className: "flex min-w-0 flex-1 flex-col",
            children: [
              _jsx("span", {
                className: "truncate text-sm text-foreground",
                children: props.item.title,
              }),
              _jsx("span", {
                className: "truncate text-muted-foreground/70 text-xs",
                children: props.item.description,
              }),
            ],
          })
        : _jsx("span", {
            className: "flex min-w-0 items-center gap-1.5 truncate text-sm text-foreground",
            children: _jsx("span", { className: "truncate", children: props.item.title }),
          }),
      props.item.timestamp
        ? _jsx("span", {
            className:
              "min-w-12 shrink-0 text-right text-[10px] tabular-nums text-muted-foreground/70",
            children: props.item.timestamp,
          })
        : null,
      shortcutLabel ? _jsx(CommandShortcut, { children: shortcutLabel }) : null,
      props.item.kind === "submenu"
        ? _jsx(ChevronRightIcon, { className: "ml-auto size-4 shrink-0 text-muted-foreground/50" })
        : null,
    ],
  });
}
