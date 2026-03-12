import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PROVIDER_DISPLAY_NAMES } from "@t3tools/contracts";
import { memo } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CircleAlertIcon } from "lucide-react";
export const ProviderStatusBanner = memo(function ProviderStatusBanner({ status }) {
  if (!status || status.status === "ready" || status.status === "disabled") {
    return null;
  }
  const providerLabel = PROVIDER_DISPLAY_NAMES[status.provider] ?? status.provider;
  const defaultMessage =
    status.status === "error"
      ? `${providerLabel} provider is unavailable.`
      : `${providerLabel} provider has limited availability.`;
  const title = `${providerLabel} provider status`;
  return _jsx("div", {
    className: "pt-3 mx-auto max-w-3xl",
    children: _jsxs(Alert, {
      variant: status.status === "error" ? "error" : "warning",
      children: [
        _jsx(CircleAlertIcon, {}),
        _jsx(AlertTitle, { children: title }),
        _jsx(AlertDescription, {
          className: "line-clamp-3",
          title: status.message ?? defaultMessage,
          children: status.message ?? defaultMessage,
        }),
      ],
    }),
  });
});
