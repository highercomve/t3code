import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RotateCcwIcon } from "lucide-react";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSettingsRestore } from "../components/settings/SettingsPanels";
import { Button } from "../components/ui/button";
import { SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import { isElectron } from "../env";
function SettingsContentLayout() {
  const [restoreSignal, setRestoreSignal] = useState(0);
  const { changedSettingLabels, restoreDefaults } = useSettingsRestore(() =>
    setRestoreSignal((value) => value + 1),
  );
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.defaultPrevented) return;
      if (event.key === "Escape") {
        event.preventDefault();
        window.history.back();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
  return _jsx(SidebarInset, {
    className:
      "h-dvh min-h-0 overflow-hidden overscroll-y-none bg-background text-foreground isolate",
    children: _jsxs("div", {
      className: "flex min-h-0 min-w-0 flex-1 flex-col bg-background text-foreground",
      children: [
        !isElectron &&
          _jsx("header", {
            className: "border-b border-border px-3 py-2 sm:px-5",
            children: _jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                _jsx(SidebarTrigger, { className: "size-7 shrink-0 md:hidden" }),
                _jsx("span", {
                  className: "text-sm font-medium text-foreground",
                  children: "Settings",
                }),
                _jsx("div", {
                  className: "ms-auto flex items-center gap-2",
                  children: _jsxs(Button, {
                    size: "xs",
                    variant: "outline",
                    disabled: changedSettingLabels.length === 0,
                    onClick: () => void restoreDefaults(),
                    children: [_jsx(RotateCcwIcon, { className: "size-3.5" }), "Restore defaults"],
                  }),
                }),
              ],
            }),
          }),
        isElectron &&
          _jsxs("div", {
            className:
              "drag-region flex h-[52px] shrink-0 items-center border-b border-border px-5",
            children: [
              _jsx("span", {
                className: "text-xs font-medium tracking-wide text-muted-foreground/70",
                children: "Settings",
              }),
              _jsx("div", {
                className: "ms-auto flex items-center gap-2",
                children: _jsxs(Button, {
                  size: "xs",
                  variant: "outline",
                  disabled: changedSettingLabels.length === 0,
                  onClick: () => void restoreDefaults(),
                  children: [_jsx(RotateCcwIcon, { className: "size-3.5" }), "Restore defaults"],
                }),
              }),
            ],
          }),
        _jsx(
          "div",
          { className: "min-h-0 flex flex-1 flex-col", children: _jsx(Outlet, {}) },
          restoreSignal,
        ),
      ],
    }),
  });
}
function SettingsRouteLayout() {
  return _jsx(SettingsContentLayout, {});
}
export const Route = createFileRoute("/settings")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/settings") {
      throw redirect({ to: "/settings/general", replace: true });
    }
  },
  component: SettingsRouteLayout,
});
