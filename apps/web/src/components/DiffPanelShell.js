import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { isElectron } from "~/env";
import { cn } from "~/lib/utils";
import { Skeleton } from "./ui/skeleton";
function getDiffPanelHeaderRowClassName(mode) {
  const shouldUseDragRegion = isElectron && mode !== "sheet";
  return cn(
    "flex items-center justify-between gap-2 px-4 wco:pr-[calc(100vw-env(titlebar-area-width)-env(titlebar-area-x)+1em)]",
    shouldUseDragRegion
      ? "drag-region h-[52px] border-b border-border wco:h-[env(titlebar-area-height)]"
      : "h-12 wco:max-h-[env(titlebar-area-height)]",
  );
}
export function DiffPanelShell(props) {
  const shouldUseDragRegion = isElectron && props.mode !== "sheet";
  return _jsxs("div", {
    className: cn(
      "flex h-full min-w-0 flex-col bg-background",
      props.mode === "inline"
        ? "w-[42vw] min-w-[360px] max-w-[560px] shrink-0 border-l border-border"
        : "w-full",
    ),
    children: [
      shouldUseDragRegion
        ? _jsx("div", {
            className: getDiffPanelHeaderRowClassName(props.mode),
            children: props.header,
          })
        : _jsx("div", {
            className: "border-b border-border",
            children: _jsx("div", {
              className: getDiffPanelHeaderRowClassName(props.mode),
              children: props.header,
            }),
          }),
      props.children,
    ],
  });
}
export function DiffPanelHeaderSkeleton() {
  return _jsxs(_Fragment, {
    children: [
      _jsxs("div", {
        className: "relative min-w-0 flex-1",
        children: [
          _jsx(Skeleton, {
            className:
              "absolute left-0 top-1/2 size-6 -translate-y-1/2 rounded-md border border-border/50",
          }),
          _jsx(Skeleton, {
            className:
              "absolute right-0 top-1/2 size-6 -translate-y-1/2 rounded-md border border-border/50",
          }),
          _jsxs("div", {
            className: "flex gap-1 overflow-hidden px-8 py-0.5",
            children: [
              _jsx(Skeleton, { className: "h-6 w-16 shrink-0 rounded-md" }),
              _jsx(Skeleton, { className: "h-6 w-24 shrink-0 rounded-md" }),
              _jsx(Skeleton, { className: "h-6 w-24 shrink-0 rounded-md max-sm:hidden" }),
            ],
          }),
        ],
      }),
      _jsxs("div", {
        className: "flex shrink-0 gap-1",
        children: [
          _jsx(Skeleton, { className: "size-7 rounded-md" }),
          _jsx(Skeleton, { className: "size-7 rounded-md" }),
        ],
      }),
    ],
  });
}
export function DiffPanelLoadingState(props) {
  return _jsx("div", {
    className: "flex min-h-0 flex-1 flex-col p-2",
    children: _jsxs("div", {
      className:
        "flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-border/60 bg-card/25",
      role: "status",
      "aria-live": "polite",
      "aria-label": props.label,
      children: [
        _jsxs("div", {
          className: "flex items-center gap-2 border-b border-border/50 px-3 py-2",
          children: [
            _jsx(Skeleton, { className: "h-4 w-32 rounded-full" }),
            _jsx(Skeleton, { className: "ml-auto h-4 w-20 rounded-full" }),
          ],
        }),
        _jsxs("div", {
          className: "flex min-h-0 flex-1 flex-col gap-4 px-3 py-4",
          children: [
            _jsxs("div", {
              className: "space-y-2",
              children: [
                _jsx(Skeleton, { className: "h-3 w-full rounded-full" }),
                _jsx(Skeleton, { className: "h-3 w-full rounded-full" }),
                _jsx(Skeleton, { className: "h-3 w-10/12 rounded-full" }),
                _jsx(Skeleton, { className: "h-3 w-11/12 rounded-full" }),
                _jsx(Skeleton, { className: "h-3 w-9/12 rounded-full" }),
              ],
            }),
            _jsx("span", { className: "sr-only", children: props.label }),
          ],
        }),
      ],
    }),
  });
}
