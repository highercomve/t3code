import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ArchiveIcon, ArrowLeftIcon, Settings2Icon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";
export const SETTINGS_NAV_ITEMS = [
  { label: "General", to: "/settings/general", icon: Settings2Icon },
  { label: "Archive", to: "/settings/archived", icon: ArchiveIcon },
];
export function SettingsSidebarNav({ pathname }) {
  const navigate = useNavigate();
  return _jsxs(_Fragment, {
    children: [
      _jsx(SidebarContent, {
        className: "overflow-x-hidden",
        children: _jsx(SidebarGroup, {
          className: "px-2 py-3",
          children: _jsx(SidebarMenu, {
            children: SETTINGS_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.to;
              return _jsx(
                SidebarMenuItem,
                {
                  children: _jsxs(SidebarMenuButton, {
                    size: "sm",
                    isActive: isActive,
                    className: isActive
                      ? "gap-2 px-2 py-2 text-left text-xs text-foreground"
                      : "gap-2 px-2 py-2 text-left text-xs text-muted-foreground hover:text-foreground/80",
                    onClick: () => void navigate({ to: item.to, replace: true }),
                    children: [
                      _jsx(Icon, {
                        className: isActive
                          ? "size-4 shrink-0 text-foreground"
                          : "size-4 shrink-0 text-muted-foreground",
                      }),
                      _jsx("span", { className: "truncate", children: item.label }),
                    ],
                  }),
                },
                item.to,
              );
            }),
          }),
        }),
      }),
      _jsx(SidebarSeparator, {}),
      _jsx(SidebarFooter, {
        className: "p-2",
        children: _jsx(SidebarMenu, {
          children: _jsx(SidebarMenuItem, {
            children: _jsxs(SidebarMenuButton, {
              size: "sm",
              className:
                "gap-2 px-2 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground",
              onClick: () => window.history.back(),
              children: [
                _jsx(ArrowLeftIcon, { className: "size-4" }),
                _jsx("span", { children: "Back" }),
              ],
            }),
          }),
        }),
      }),
    ],
  });
}
