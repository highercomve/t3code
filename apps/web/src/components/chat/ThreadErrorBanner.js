import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from "react";
import { Alert, AlertAction, AlertDescription } from "../ui/alert";
import { CircleAlertIcon, XIcon } from "lucide-react";
export const ThreadErrorBanner = memo(function ThreadErrorBanner({ error, onDismiss }) {
  if (!error) return null;
  return _jsx("div", {
    className: "pt-3 mx-auto max-w-3xl",
    children: _jsxs(Alert, {
      variant: "error",
      children: [
        _jsx(CircleAlertIcon, {}),
        _jsx(AlertDescription, { className: "line-clamp-3", title: error, children: error }),
        onDismiss &&
          _jsx(AlertAction, {
            children: _jsx("button", {
              type: "button",
              "aria-label": "Dismiss error",
              className:
                "inline-flex size-6 items-center justify-center rounded-md text-destructive/60 transition-colors hover:text-destructive",
              onClick: onDismiss,
              children: _jsx(XIcon, { className: "size-3.5" }),
            }),
          }),
      ],
    }),
  });
});
