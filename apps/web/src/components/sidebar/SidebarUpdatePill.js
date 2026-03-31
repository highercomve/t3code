import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { DownloadIcon, RotateCwIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { isElectron } from "../../env";
import {
  setDesktopUpdateStateQueryData,
  useDesktopUpdateState,
} from "../../lib/desktopUpdateReactQuery";
import { toastManager } from "../ui/toast";
import {
  getArm64IntelBuildWarningDescription,
  getDesktopUpdateActionError,
  getDesktopUpdateButtonTooltip,
  getDesktopUpdateInstallConfirmationMessage,
  isDesktopUpdateButtonDisabled,
  resolveDesktopUpdateButtonAction,
  shouldShowArm64IntelBuildWarning,
  shouldShowDesktopUpdateButton,
  shouldToastDesktopUpdateActionResult,
} from "../desktopUpdate.logic";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Tooltip, TooltipPopup, TooltipTrigger } from "../ui/tooltip";
export function SidebarUpdatePill() {
  const queryClient = useQueryClient();
  const state = useDesktopUpdateState().data ?? null;
  const [dismissed, setDismissed] = useState(false);
  const visible = isElectron && shouldShowDesktopUpdateButton(state) && !dismissed;
  const tooltip = state ? getDesktopUpdateButtonTooltip(state) : "Update available";
  const disabled = isDesktopUpdateButtonDisabled(state);
  const action = state ? resolveDesktopUpdateButtonAction(state) : "none";
  const showArm64Warning = isElectron && shouldShowArm64IntelBuildWarning(state);
  const arm64Description =
    state && showArm64Warning ? getArm64IntelBuildWarningDescription(state) : null;
  const handleAction = useCallback(() => {
    const bridge = window.desktopBridge;
    if (!bridge || !state) return;
    if (disabled || action === "none") return;
    if (action === "download") {
      void bridge
        .downloadUpdate()
        .then((result) => {
          setDesktopUpdateStateQueryData(queryClient, result.state);
          if (result.completed) {
            toastManager.add({
              type: "success",
              title: "Update downloaded",
              description: "Restart the app from the update button to install it.",
            });
          }
          if (!shouldToastDesktopUpdateActionResult(result)) return;
          const actionError = getDesktopUpdateActionError(result);
          if (!actionError) return;
          toastManager.add({
            type: "error",
            title: "Could not download update",
            description: actionError,
          });
        })
        .catch((error) => {
          toastManager.add({
            type: "error",
            title: "Could not start update download",
            description: error instanceof Error ? error.message : "An unexpected error occurred.",
          });
        });
      return;
    }
    if (action === "install") {
      const confirmed = window.confirm(getDesktopUpdateInstallConfirmationMessage(state));
      if (!confirmed) return;
      void bridge
        .installUpdate()
        .then((result) => {
          setDesktopUpdateStateQueryData(queryClient, result.state);
          if (!shouldToastDesktopUpdateActionResult(result)) return;
          const actionError = getDesktopUpdateActionError(result);
          if (!actionError) return;
          toastManager.add({
            type: "error",
            title: "Could not install update",
            description: actionError,
          });
        })
        .catch((error) => {
          toastManager.add({
            type: "error",
            title: "Could not install update",
            description: error instanceof Error ? error.message : "An unexpected error occurred.",
          });
        });
    }
  }, [action, disabled, queryClient, state]);
  if (!visible && !showArm64Warning) return null;
  return _jsxs("div", {
    className: "flex flex-col gap-1",
    children: [
      showArm64Warning &&
        arm64Description &&
        _jsxs(Alert, {
          variant: "warning",
          className: "rounded-2xl border-warning/40 bg-warning/8 text-xs",
          children: [
            _jsx(TriangleAlertIcon, {}),
            _jsx(AlertTitle, { children: "Intel build on Apple Silicon" }),
            _jsx(AlertDescription, { children: arm64Description }),
          ],
        }),
      visible &&
        _jsxs("div", {
          className: `group/update relative flex h-7 w-full items-center rounded-lg bg-primary/15 text-xs font-medium text-primary ${disabled ? " cursor-not-allowed opacity-60" : ""}`,
          children: [
            _jsx("div", {
              className:
                "pointer-events-none absolute inset-0 rounded-lg transition-colors group-has-[button.update-main:hover]/update:bg-primary/22",
            }),
            _jsxs(Tooltip, {
              children: [
                _jsx(TooltipTrigger, {
                  render: _jsx("button", {
                    type: "button",
                    "aria-label": tooltip,
                    "aria-disabled": disabled || undefined,
                    disabled: disabled,
                    className:
                      "update-main relative flex h-full flex-1 items-center gap-2 px-2 enabled:cursor-pointer",
                    onClick: handleAction,
                    children:
                      action === "install"
                        ? _jsxs(_Fragment, {
                            children: [
                              _jsx(RotateCwIcon, { className: "size-3.5" }),
                              _jsx("span", { children: "Restart to update" }),
                            ],
                          })
                        : state?.status === "downloading"
                          ? _jsxs(_Fragment, {
                              children: [
                                _jsx(DownloadIcon, { className: "size-3.5" }),
                                _jsxs("span", {
                                  children: [
                                    "Downloading",
                                    typeof state.downloadPercent === "number"
                                      ? ` (${Math.floor(state.downloadPercent)}%)`
                                      : "…",
                                  ],
                                }),
                              ],
                            })
                          : _jsxs(_Fragment, {
                              children: [
                                _jsx(DownloadIcon, { className: "size-3.5" }),
                                _jsx("span", { children: "Update available" }),
                              ],
                            }),
                  }),
                }),
                _jsx(TooltipPopup, { side: "top", children: tooltip }),
              ],
            }),
            action === "download" &&
              _jsxs(Tooltip, {
                children: [
                  _jsx(TooltipTrigger, {
                    render: _jsx("button", {
                      type: "button",
                      "aria-label": "Dismiss update",
                      className:
                        "mr-1 inline-flex size-5 items-center justify-center rounded-md text-primary/60 transition-colors hover:text-primary",
                      onClick: () => setDismissed(true),
                      children: _jsx(XIcon, { className: "size-3.5" }),
                    }),
                  }),
                  _jsx(TooltipPopup, { side: "top", children: "Dismiss until next launch" }),
                ],
              }),
          ],
        }),
    ],
  });
}
