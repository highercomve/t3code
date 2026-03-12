import { jsx as _jsx } from "react/jsx-runtime";
import { Loader2Icon } from "lucide-react";
import { cn } from "~/lib/utils";
function Spinner({ className, ...props }) {
  return _jsx(Loader2Icon, {
    "aria-label": "Loading",
    className: cn("animate-spin", className),
    role: "status",
    ...props,
  });
}
export { Spinner };
