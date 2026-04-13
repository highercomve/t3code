import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from "react";
import { EllipsisIcon, ListTodoIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator as MenuDivider,
  MenuTrigger,
} from "../ui/menu";
export const CompactComposerControlsMenu = memo(function CompactComposerControlsMenu(props) {
  return _jsxs(Menu, {
    children: [
      _jsx(MenuTrigger, {
        render: _jsx(Button, {
          size: "sm",
          variant: "ghost",
          className: "shrink-0 px-2 text-muted-foreground/70 hover:text-foreground/80",
          "aria-label": "More composer controls",
        }),
        children: _jsx(EllipsisIcon, { "aria-hidden": "true", className: "size-4" }),
      }),
      _jsxs(MenuPopup, {
        align: "start",
        children: [
          props.traitsMenuContent
            ? _jsxs(_Fragment, { children: [props.traitsMenuContent, _jsx(MenuDivider, {})] })
            : null,
          _jsx("div", {
            className: "px-2 py-1.5 font-medium text-muted-foreground text-xs",
            children: "Mode",
          }),
          _jsxs(MenuRadioGroup, {
            value: props.interactionMode,
            onValueChange: (value) => {
              if (!value || value === props.interactionMode) return;
              props.onToggleInteractionMode();
            },
            children: [
              _jsx(MenuRadioItem, { value: "default", children: "Chat" }),
              _jsx(MenuRadioItem, { value: "plan", children: "Plan" }),
            ],
          }),
          _jsx(MenuDivider, {}),
          _jsx("div", {
            className: "px-2 py-1.5 font-medium text-muted-foreground text-xs",
            children: "Access",
          }),
          _jsxs(MenuRadioGroup, {
            value: props.runtimeMode,
            onValueChange: (value) => {
              if (!value || value === props.runtimeMode) return;
              props.onRuntimeModeChange(value);
            },
            children: [
              _jsx(MenuRadioItem, { value: "approval-required", children: "Supervised" }),
              _jsx(MenuRadioItem, { value: "auto-accept-edits", children: "Auto-accept edits" }),
              _jsx(MenuRadioItem, { value: "full-access", children: "Full access" }),
            ],
          }),
          props.activePlan
            ? _jsxs(_Fragment, {
                children: [
                  _jsx(MenuDivider, {}),
                  _jsxs(MenuItem, {
                    onClick: props.onTogglePlanSidebar,
                    children: [
                      _jsx(ListTodoIcon, { className: "size-4 shrink-0" }),
                      props.planSidebarOpen ? "Hide plan sidebar" : "Show plan sidebar",
                    ],
                  }),
                ],
              })
            : null,
        ],
      }),
    ],
  });
});
