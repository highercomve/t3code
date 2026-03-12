import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "~/lib/utils";
import { formatContextWindowTokens } from "~/lib/contextWindow";
import { Popover, PopoverPopup, PopoverTrigger } from "../ui/popover";
function formatPercentage(value) {
  if (value === null || !Number.isFinite(value)) {
    return null;
  }
  if (value < 10) {
    return `${value.toFixed(1).replace(/\.0$/, "")}%`;
  }
  return `${Math.round(value)}%`;
}
export function ContextWindowMeter(props) {
  const { usage } = props;
  const usedPercentage = formatPercentage(usage.usedPercentage);
  const normalizedPercentage = Math.max(0, Math.min(100, usage.usedPercentage ?? 0));
  const radius = 9.75;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (normalizedPercentage / 100) * circumference;
  return _jsxs(Popover, {
    children: [
      _jsx(PopoverTrigger, {
        openOnHover: true,
        delay: 150,
        closeDelay: 0,
        render: _jsx("button", {
          type: "button",
          className:
            "group inline-flex items-center justify-center rounded-full transition-opacity hover:opacity-85",
          "aria-label":
            usage.maxTokens !== null && usedPercentage
              ? `Context window ${usedPercentage} used`
              : `Context window ${formatContextWindowTokens(usage.usedTokens)} tokens used`,
          children: _jsxs("span", {
            className: "relative flex h-6 w-6 items-center justify-center",
            children: [
              _jsxs("svg", {
                viewBox: "0 0 24 24",
                className: "-rotate-90 absolute inset-0 h-full w-full transform-gpu",
                "aria-hidden": "true",
                children: [
                  _jsx("circle", {
                    cx: "12",
                    cy: "12",
                    r: radius,
                    fill: "none",
                    stroke: "color-mix(in oklab, var(--color-muted) 70%, transparent)",
                    strokeWidth: "3",
                  }),
                  _jsx("circle", {
                    cx: "12",
                    cy: "12",
                    r: radius,
                    fill: "none",
                    stroke: "var(--color-muted-foreground)",
                    strokeWidth: "3",
                    strokeLinecap: "round",
                    strokeDasharray: circumference,
                    strokeDashoffset: dashOffset,
                    className:
                      "transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none",
                  }),
                ],
              }),
              _jsx("span", {
                className: cn(
                  "relative flex h-[15px] w-[15px] items-center justify-center rounded-full bg-background text-[8px] font-medium",
                  "text-muted-foreground",
                ),
                children:
                  usage.usedPercentage !== null
                    ? Math.round(usage.usedPercentage)
                    : formatContextWindowTokens(usage.usedTokens),
              }),
            ],
          }),
        }),
      }),
      _jsx(PopoverPopup, {
        tooltipStyle: true,
        side: "top",
        align: "end",
        className: "w-max max-w-none px-3 py-2",
        children: _jsxs("div", {
          className: "space-y-1.5 leading-tight",
          children: [
            _jsx("div", {
              className:
                "text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground",
              children: "Context window",
            }),
            usage.maxTokens !== null && usedPercentage
              ? _jsxs("div", {
                  className: "whitespace-nowrap text-xs font-medium text-foreground",
                  children: [
                    _jsx("span", { children: usedPercentage }),
                    _jsx("span", { className: "mx-1", children: "\u22C5" }),
                    _jsx("span", { children: formatContextWindowTokens(usage.usedTokens) }),
                    _jsx("span", { children: "/" }),
                    _jsxs("span", {
                      children: [
                        formatContextWindowTokens(usage.maxTokens ?? null),
                        " context used",
                      ],
                    }),
                  ],
                })
              : _jsxs("div", {
                  className: "text-sm text-foreground",
                  children: [formatContextWindowTokens(usage.usedTokens), " tokens used so far"],
                }),
            (usage.totalProcessedTokens ?? null) !== null &&
            (usage.totalProcessedTokens ?? 0) > usage.usedTokens
              ? _jsxs("div", {
                  className: "text-xs text-muted-foreground",
                  children: [
                    "Total processed: ",
                    formatContextWindowTokens(usage.totalProcessedTokens ?? null),
                    " ",
                    "tokens",
                  ],
                })
              : null,
            usage.compactsAutomatically
              ? _jsx("div", {
                  className: "text-xs text-muted-foreground",
                  children: "Automatically compacts its context when needed.",
                })
              : null,
          ],
        }),
      }),
    ],
  });
}
