import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo } from "react";
export function hasNonZeroStat(stat) {
  return stat.additions > 0 || stat.deletions > 0;
}
export const DiffStatLabel = memo(function DiffStatLabel(props) {
  const { additions, deletions, showParentheses = false } = props;
  return _jsxs(_Fragment, {
    children: [
      showParentheses && _jsx("span", { className: "text-muted-foreground/70", children: "(" }),
      _jsxs("span", { className: "text-success", children: ["+", additions] }),
      _jsx("span", { className: "mx-0.5 text-muted-foreground/70", children: "/" }),
      _jsxs("span", { className: "text-destructive", children: ["-", deletions] }),
      showParentheses && _jsx("span", { className: "text-muted-foreground/70", children: ")" }),
    ],
  });
});
