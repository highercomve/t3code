import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from "react";
export const ComposerPlanFollowUpBanner = memo(function ComposerPlanFollowUpBanner({ planTitle }) {
  return _jsx("div", {
    className: "px-4 py-3.5 sm:px-5 sm:py-4",
    children: _jsxs("div", {
      className: "flex flex-wrap items-center gap-2",
      children: [
        _jsx("span", { className: "uppercase text-sm tracking-[0.2em]", children: "Plan ready" }),
        planTitle
          ? _jsx("span", {
              className: "min-w-0 flex-1 truncate text-sm font-medium",
              children: planTitle,
            })
          : null,
      ],
    }),
  });
});
