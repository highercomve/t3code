import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { isElectron } from "../env";
import { SidebarTrigger } from "../components/ui/sidebar";
function ChatIndexRouteView() {
  return _jsxs("div", {
    className: "flex min-h-0 min-w-0 flex-1 flex-col bg-background text-muted-foreground/40",
    children: [
      !isElectron &&
        _jsx("header", {
          className: "border-b border-border px-3 py-2 md:hidden",
          children: _jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              _jsx(SidebarTrigger, { className: "size-7 shrink-0" }),
              _jsx("span", {
                className: "text-sm font-medium text-foreground",
                children: "Threads",
              }),
            ],
          }),
        }),
      isElectron &&
        _jsx("div", {
          className: "drag-region flex h-[52px] shrink-0 items-center border-b border-border px-5",
          children: _jsx("span", {
            className: "text-xs text-muted-foreground/50",
            children: "No active thread",
          }),
        }),
      _jsx("div", {
        className: "flex flex-1 items-center justify-center",
        children: _jsx("div", {
          className: "text-center",
          children: _jsx("p", {
            className: "text-sm",
            children: "Select a thread or create a new one to get started.",
          }),
        }),
      }),
    ],
  });
}
export const Route = createFileRoute("/_chat/")({
  component: ChatIndexRouteView,
});
