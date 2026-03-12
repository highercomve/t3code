import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "~/lib/utils";
function Skeleton({ className, ...props }) {
  return _jsx("div", {
    className: cn(
      "animate-skeleton rounded-sm [--skeleton-highlight:--alpha(var(--color-white)/64%)] [background:linear-gradient(120deg,transparent_40%,var(--skeleton-highlight),transparent_60%)_var(--color-muted)_0_0/200%_100%_fixed] dark:[--skeleton-highlight:--alpha(var(--color-white)/4%)]",
      className,
    ),
    "data-slot": "skeleton",
    ...props,
  });
}
export { Skeleton };
