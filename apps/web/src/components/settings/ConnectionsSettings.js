import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { PlusIcon, QrCodeIcon } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { DateTime } from "effect";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { cn } from "../../lib/utils";
import { formatElapsedDurationLabel, formatExpiresInLabel } from "../../timestampFormat";
import {
  SettingsPageContainer,
  SettingsRow,
  SettingsSection,
  useRelativeTimeTick,
} from "./settingsLayout";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Popover, PopoverPopup, PopoverTrigger } from "../ui/popover";
import { QRCodeSvg } from "../ui/qr-code";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";
import { toastManager } from "../ui/toast";
import { Tooltip, TooltipPopup, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { setPairingTokenOnUrl } from "../../pairingUrl";
import {
  createServerPairingCredential,
  fetchSessionState,
  revokeOtherServerClientSessions,
  revokeServerClientSession,
  revokeServerPairingLink,
  isLoopbackHostname,
} from "~/environments/primary";
import {
  useSavedEnvironmentRegistryStore,
  useSavedEnvironmentRuntimeStore,
  addSavedEnvironment,
  getPrimaryEnvironmentConnection,
  reconnectSavedEnvironment,
  removeSavedEnvironment,
} from "~/environments/runtime";
const accessTimestampFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});
function formatAccessTimestamp(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return accessTimestampFormatter.format(parsed);
}
function ConnectionStatusDot({ tooltipText, dotClassName, pingClassName }) {
  const dotContent = _jsxs(_Fragment, {
    children: [
      pingClassName
        ? _jsx("span", {
            className: cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full",
              pingClassName,
            ),
          })
        : null,
      _jsx("span", { className: cn("relative inline-flex size-2 rounded-full", dotClassName) }),
    ],
  });
  if (!tooltipText) {
    return _jsx("span", {
      className: "relative flex size-3 shrink-0 items-center justify-center",
      children: dotContent,
    });
  }
  const dot = _jsx("button", {
    type: "button",
    title: tooltipText,
    "aria-label": tooltipText,
    className:
      "relative flex size-3 shrink-0 cursor-help items-center justify-center rounded-full outline-hidden",
    children: dotContent,
  });
  return _jsxs(Tooltip, {
    children: [
      _jsx(TooltipTrigger, { render: dot }),
      _jsx(TooltipPopup, {
        side: "top",
        className: "max-w-80 whitespace-pre-wrap leading-tight",
        children: tooltipText,
      }),
    ],
  });
}
function getSavedBackendStatusTooltip(runtime, record, nowMs) {
  const connectionState = runtime?.connectionState ?? "disconnected";
  if (connectionState === "connected") {
    const connectedAt = runtime?.connectedAt ?? record.lastConnectedAt;
    return connectedAt ? `Connected for ${formatElapsedDurationLabel(connectedAt, nowMs)}` : null;
  }
  if (connectionState === "connecting") {
    return null;
  }
  if (connectionState === "error") {
    return runtime?.lastError ?? "An unknown connection error occurred.";
  }
  return record.lastConnectedAt
    ? `Last connected at ${formatAccessTimestamp(record.lastConnectedAt)}`
    : "Not connected yet.";
}
/** Direct row in the card – same pattern as the Provider / ACP-agent list rows. */
const ITEM_ROW_CLASSNAME = "border-t border-border/60 px-4 py-4 first:border-t-0 sm:px-5";
const ITEM_ROW_INNER_CLASSNAME =
  "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between";
function sortDesktopPairingLinks(links) {
  return [...links].toSorted(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}
function sortDesktopClientSessions(sessions) {
  return [...sessions].toSorted((left, right) => {
    if (left.current !== right.current) {
      return left.current ? -1 : 1;
    }
    if (left.connected !== right.connected) {
      return left.connected ? -1 : 1;
    }
    return new Date(right.issuedAt).getTime() - new Date(left.issuedAt).getTime();
  });
}
function toDesktopPairingLinkRecord(pairingLink) {
  return {
    ...pairingLink,
    createdAt: DateTime.formatIso(pairingLink.createdAt),
    expiresAt: DateTime.formatIso(pairingLink.expiresAt),
  };
}
function toDesktopClientSessionRecord(clientSession) {
  return {
    ...clientSession,
    issuedAt: DateTime.formatIso(clientSession.issuedAt),
    expiresAt: DateTime.formatIso(clientSession.expiresAt),
    lastConnectedAt:
      clientSession.lastConnectedAt === null
        ? null
        : DateTime.formatIso(clientSession.lastConnectedAt),
  };
}
function upsertDesktopPairingLink(current, next) {
  const existingIndex = current.findIndex((pairingLink) => pairingLink.id === next.id);
  if (existingIndex === -1) {
    return sortDesktopPairingLinks([...current, next]);
  }
  const updated = [...current];
  updated[existingIndex] = next;
  return sortDesktopPairingLinks(updated);
}
function removeDesktopPairingLink(current, id) {
  return current.filter((pairingLink) => pairingLink.id !== id);
}
function upsertDesktopClientSession(current, next) {
  const existingIndex = current.findIndex(
    (clientSession) => clientSession.sessionId === next.sessionId,
  );
  if (existingIndex === -1) {
    return sortDesktopClientSessions([...current, next]);
  }
  const updated = [...current];
  updated[existingIndex] = next;
  return sortDesktopClientSessions(updated);
}
function removeDesktopClientSession(current, sessionId) {
  return current.filter((clientSession) => clientSession.sessionId !== sessionId);
}
function resolveDesktopPairingUrl(endpointUrl, credential) {
  const url = new URL(endpointUrl);
  url.pathname = "/pair";
  return setPairingTokenOnUrl(url, credential).toString();
}
function resolveCurrentOriginPairingUrl(credential) {
  const url = new URL("/pair", window.location.href);
  return setPairingTokenOnUrl(url, credential).toString();
}
const PairingLinkListRow = memo(function PairingLinkListRow({
  pairingLink,
  endpointUrl,
  revokingPairingLinkId,
  onRevoke,
}) {
  const nowMs = useRelativeTimeTick(1_000);
  const expiresAtMs = useMemo(
    () => new Date(pairingLink.expiresAt).getTime(),
    [pairingLink.expiresAt],
  );
  const [isRevealDialogOpen, setIsRevealDialogOpen] = useState(false);
  const currentOriginPairingUrl = useMemo(
    () => resolveCurrentOriginPairingUrl(pairingLink.credential),
    [pairingLink.credential],
  );
  const shareablePairingUrl =
    endpointUrl != null && endpointUrl !== ""
      ? resolveDesktopPairingUrl(endpointUrl, pairingLink.credential)
      : isLoopbackHostname(window.location.hostname)
        ? null
        : currentOriginPairingUrl;
  const copyValue = shareablePairingUrl ?? pairingLink.credential;
  const canCopyToClipboard =
    typeof window !== "undefined" &&
    window.isSecureContext &&
    navigator.clipboard?.writeText != null;
  const { copyToClipboard, isCopied } = useCopyToClipboard({
    onCopy: () => {
      toastManager.add({
        type: "success",
        title: shareablePairingUrl ? "Pairing URL copied" : "Pairing token copied",
        description: shareablePairingUrl
          ? "Open it in the client you want to pair to this environment."
          : "Paste it into another client with this backend's reachable host.",
      });
    },
    onError: (error) => {
      setIsRevealDialogOpen(true);
      toastManager.add({
        type: "error",
        title: canCopyToClipboard ? "Could not copy pairing URL" : "Clipboard copy unavailable",
        description: canCopyToClipboard ? error.message : "Showing the full value instead.",
      });
    },
  });
  const handleCopy = useCallback(() => {
    copyToClipboard(copyValue, undefined);
  }, [copyToClipboard, copyValue]);
  const expiresAbsolute = formatAccessTimestamp(pairingLink.expiresAt);
  const roleLabel = pairingLink.role === "owner" ? "Owner" : "Client";
  const primaryLabel = pairingLink.label ?? `${roleLabel} link`;
  if (expiresAtMs <= nowMs) {
    return null;
  }
  return _jsx("div", {
    className: ITEM_ROW_CLASSNAME,
    children: _jsxs("div", {
      className: ITEM_ROW_INNER_CLASSNAME,
      children: [
        _jsxs("div", {
          className: "min-w-0 flex-1 space-y-1",
          children: [
            _jsxs("div", {
              className: "flex min-h-5 items-center gap-1.5",
              children: [
                _jsx(ConnectionStatusDot, {
                  tooltipText: `Link created at ${formatAccessTimestamp(pairingLink.createdAt)}`,
                  dotClassName: "bg-amber-400",
                }),
                _jsx("h3", {
                  className: "text-sm font-medium text-foreground",
                  children: primaryLabel,
                }),
                _jsx(Popover, {
                  children: shareablePairingUrl
                    ? _jsxs(_Fragment, {
                        children: [
                          _jsx(PopoverTrigger, {
                            openOnHover: true,
                            delay: 250,
                            closeDelay: 100,
                            render: _jsx("button", {
                              type: "button",
                              className:
                                "inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground/50 outline-none hover:text-foreground",
                              "aria-label": "Show QR code",
                            }),
                            children: _jsx(QrCodeIcon, {
                              "aria-hidden": true,
                              className: "size-3",
                            }),
                          }),
                          _jsx(PopoverPopup, {
                            side: "top",
                            align: "start",
                            tooltipStyle: true,
                            className: "w-max",
                            children: _jsx(QRCodeSvg, {
                              value: shareablePairingUrl,
                              size: 88,
                              level: "M",
                              marginSize: 2,
                              title: "Pairing link \u2014 scan to open on another device",
                            }),
                          }),
                        ],
                      })
                    : null,
                }),
              ],
            }),
            _jsx("p", {
              className: "text-xs text-muted-foreground",
              title: expiresAbsolute,
              children: [roleLabel, formatExpiresInLabel(pairingLink.expiresAt, nowMs)].join(" · "),
            }),
            shareablePairingUrl === null
              ? _jsx("p", {
                  className: "text-[11px] text-muted-foreground/70",
                  children:
                    "Copy the token and pair from another client using this backend's reachable host.",
                })
              : null,
          ],
        }),
        _jsxs("div", {
          className: "flex w-full shrink-0 items-center gap-2 sm:w-auto sm:justify-end",
          children: [
            _jsxs(Dialog, {
              open: isRevealDialogOpen,
              onOpenChange: setIsRevealDialogOpen,
              children: [
                canCopyToClipboard
                  ? _jsx(Button, {
                      size: "xs",
                      variant: "outline",
                      onClick: handleCopy,
                      children: isCopied ? "Copied" : shareablePairingUrl ? "Copy" : "Copy token",
                    })
                  : _jsx(DialogTrigger, {
                      render: _jsx(Button, { size: "xs", variant: "outline" }),
                      children: shareablePairingUrl ? "Show link" : "Show token",
                    }),
                _jsxs(DialogPopup, {
                  className: "max-w-md",
                  children: [
                    _jsxs(DialogHeader, {
                      children: [
                        _jsx(DialogTitle, {
                          children: shareablePairingUrl ? "Pairing link" : "Pairing token",
                        }),
                        _jsx(DialogDescription, {
                          children: shareablePairingUrl
                            ? "Clipboard copy is unavailable here. Open or manually copy this full pairing URL on the device you want to connect."
                            : "Clipboard copy is unavailable here. Manually copy this token and pair from another client using this backend's reachable host.",
                        }),
                      ],
                    }),
                    _jsxs(DialogPanel, {
                      className: "space-y-4",
                      children: [
                        _jsx(Textarea, {
                          readOnly: true,
                          value: copyValue,
                          rows: shareablePairingUrl ? 4 : 3,
                          className: "text-xs leading-relaxed",
                          onFocus: (event) => event.currentTarget.select(),
                          onClick: (event) => event.currentTarget.select(),
                        }),
                        shareablePairingUrl
                          ? _jsx("div", {
                              className:
                                "flex justify-center rounded-xl border border-border/60 bg-muted/30 p-4",
                              children: _jsx(QRCodeSvg, {
                                value: shareablePairingUrl,
                                size: 132,
                                level: "M",
                                marginSize: 2,
                                title: "Pairing link \u2014 scan to open on another device",
                              }),
                            })
                          : null,
                      ],
                    }),
                    _jsxs(DialogFooter, {
                      variant: "bare",
                      children: [
                        _jsx(Button, {
                          variant: "outline",
                          onClick: () => setIsRevealDialogOpen(false),
                          children: "Done",
                        }),
                        canCopyToClipboard
                          ? _jsx(Button, {
                              variant: "outline",
                              size: "xs",
                              onClick: handleCopy,
                              children: isCopied ? "Copied" : "Copy again",
                            })
                          : null,
                      ],
                    }),
                  ],
                }),
              ],
            }),
            _jsx(Button, {
              size: "xs",
              variant: "destructive-outline",
              disabled: revokingPairingLinkId === pairingLink.id,
              onClick: () => void onRevoke(pairingLink.id),
              children: revokingPairingLinkId === pairingLink.id ? "Revoking…" : "Revoke",
            }),
          ],
        }),
      ],
    }),
  });
});
const ConnectedClientListRow = memo(function ConnectedClientListRow({
  clientSession,
  revokingClientSessionId,
  onRevokeSession,
}) {
  const nowMs = useRelativeTimeTick(1_000);
  const isLive = clientSession.current || clientSession.connected;
  const lastConnectedAt = clientSession.lastConnectedAt;
  const statusTooltip = isLive
    ? lastConnectedAt
      ? `Connected for ${formatElapsedDurationLabel(lastConnectedAt, nowMs)}`
      : "Connected"
    : lastConnectedAt
      ? `Last connected at ${formatAccessTimestamp(lastConnectedAt)}`
      : "Not connected yet.";
  const roleLabel = clientSession.role === "owner" ? "Owner" : "Client";
  const deviceInfoBits = [
    clientSession.client.deviceType !== "unknown"
      ? clientSession.client.deviceType[0]?.toUpperCase() + clientSession.client.deviceType.slice(1)
      : null,
    clientSession.client.os ?? null,
    clientSession.client.browser ?? null,
    clientSession.client.ipAddress ?? null,
  ].filter((value) => value !== null);
  const primaryLabel =
    clientSession.client.label ??
    ([clientSession.client.os, clientSession.client.browser].filter(Boolean).join(" · ") ||
      clientSession.subject);
  return _jsx("div", {
    className: ITEM_ROW_CLASSNAME,
    children: _jsxs("div", {
      className: ITEM_ROW_INNER_CLASSNAME,
      children: [
        _jsxs("div", {
          className: "min-w-0 flex-1 space-y-1",
          children: [
            _jsxs("div", {
              className: "flex min-h-5 items-center gap-1.5",
              children: [
                _jsx(ConnectionStatusDot, {
                  tooltipText: statusTooltip,
                  dotClassName: isLive ? "bg-success" : "bg-muted-foreground/30",
                  pingClassName: isLive ? "bg-success/60 duration-2000" : null,
                }),
                _jsx("h3", {
                  className: "text-sm font-medium text-foreground",
                  children: primaryLabel,
                }),
                clientSession.current
                  ? _jsx("span", {
                      className:
                        "text-[10px] text-muted-foreground/80 rounded-md border border-border/50 bg-muted/50 px-1 py-0.5",
                      children: "This device",
                    })
                  : null,
              ],
            }),
            _jsx("p", {
              className: "text-xs text-muted-foreground",
              children: [roleLabel, ...deviceInfoBits].join(" · "),
            }),
          ],
        }),
        _jsx("div", {
          className: "flex w-full shrink-0 items-center gap-2 sm:w-auto sm:justify-end",
          children: !clientSession.current
            ? _jsx(Button, {
                size: "xs",
                variant: "destructive-outline",
                disabled: revokingClientSessionId === clientSession.sessionId,
                onClick: () => void onRevokeSession(clientSession.sessionId),
                children:
                  revokingClientSessionId === clientSession.sessionId ? "Revoking…" : "Revoke",
              })
            : null,
        }),
      ],
    }),
  });
});
const AuthorizedClientsHeaderAction = memo(function AuthorizedClientsHeaderAction({
  clientSessions,
  isRevokingOtherClients,
  onRevokeOtherClients,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pairingLabel, setPairingLabel] = useState("");
  const [isCreatingPairingLink, setIsCreatingPairingLink] = useState(false);
  const handleCreatePairingLink = useCallback(async () => {
    setIsCreatingPairingLink(true);
    try {
      await createServerPairingCredential(pairingLabel);
      setPairingLabel("");
      setDialogOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create pairing URL.";
      toastManager.add({
        type: "error",
        title: "Could not create pairing URL",
        description: message,
      });
    } finally {
      setIsCreatingPairingLink(false);
    }
  }, [pairingLabel]);
  return _jsxs("div", {
    className: "flex items-center gap-2",
    children: [
      _jsx(Button, {
        size: "xs",
        variant: "destructive-outline",
        disabled:
          isRevokingOtherClients || clientSessions.every((clientSession) => clientSession.current),
        onClick: () => void onRevokeOtherClients(),
        children: isRevokingOtherClients ? "Revoking…" : "Revoke others",
      }),
      _jsxs(Dialog, {
        open: dialogOpen,
        onOpenChange: (open) => {
          setDialogOpen(open);
          if (!open) {
            setPairingLabel("");
          }
        },
        children: [
          _jsx(DialogTrigger, {
            render: _jsxs(Button, {
              size: "xs",
              variant: "default",
              children: [_jsx(PlusIcon, { className: "size-3" }), "Create link"],
            }),
          }),
          _jsxs(DialogPopup, {
            className: "max-w-sm",
            children: [
              _jsxs(DialogHeader, {
                children: [
                  _jsx(DialogTitle, { children: "Create pairing link" }),
                  _jsx(DialogDescription, {
                    children:
                      "Generate a one-time link that another device can use to pair with this backend as an authorized client.",
                  }),
                ],
              }),
              _jsx(DialogPanel, {
                children: _jsxs("label", {
                  className: "block",
                  children: [
                    _jsx("span", {
                      className: "mb-1.5 block text-xs font-medium text-foreground",
                      children: "Client label (optional)",
                    }),
                    _jsx(Input, {
                      value: pairingLabel,
                      onChange: (event) => setPairingLabel(event.target.value),
                      placeholder: "e.g. Living room iPad",
                      disabled: isCreatingPairingLink,
                      autoFocus: true,
                    }),
                  ],
                }),
              }),
              _jsxs(DialogFooter, {
                variant: "bare",
                children: [
                  _jsx(Button, {
                    variant: "outline",
                    disabled: isCreatingPairingLink,
                    onClick: () => setDialogOpen(false),
                    children: "Cancel",
                  }),
                  _jsx(Button, {
                    disabled: isCreatingPairingLink,
                    onClick: () => void handleCreatePairingLink(),
                    children: isCreatingPairingLink ? "Creating…" : "Create link",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
});
const PairingClientsList = memo(function PairingClientsList({
  endpointUrl,
  isLoading,
  pairingLinks,
  clientSessions,
  revokingPairingLinkId,
  revokingClientSessionId,
  onRevokePairingLink,
  onRevokeClientSession,
}) {
  return _jsxs(_Fragment, {
    children: [
      pairingLinks.map((pairingLink) =>
        _jsx(
          PairingLinkListRow,
          {
            pairingLink: pairingLink,
            endpointUrl: endpointUrl,
            revokingPairingLinkId: revokingPairingLinkId,
            onRevoke: onRevokePairingLink,
          },
          pairingLink.id,
        ),
      ),
      clientSessions.map((clientSession) =>
        _jsx(
          ConnectedClientListRow,
          {
            clientSession: clientSession,
            revokingClientSessionId: revokingClientSessionId,
            onRevokeSession: onRevokeClientSession,
          },
          clientSession.sessionId,
        ),
      ),
      pairingLinks.length === 0 && clientSessions.length === 0 && !isLoading
        ? _jsx("div", {
            className: ITEM_ROW_CLASSNAME,
            children: _jsx("p", {
              className: "text-xs text-muted-foreground/60",
              children: "No pairing links or client sessions.",
            }),
          })
        : null,
    ],
  });
});
function SavedBackendListRow({
  environmentId,
  reconnectingEnvironmentId,
  removingEnvironmentId,
  onReconnect,
  onRemove,
}) {
  const nowMs = useRelativeTimeTick(1_000);
  const record = useSavedEnvironmentRegistryStore((state) => state.byId[environmentId] ?? null);
  const runtime = useSavedEnvironmentRuntimeStore((state) => state.byId[environmentId] ?? null);
  if (!record) {
    return null;
  }
  const connectionState = runtime?.connectionState ?? "disconnected";
  const stateDotClassName =
    connectionState === "connected"
      ? "bg-success"
      : connectionState === "connecting"
        ? "bg-warning"
        : connectionState === "error"
          ? "bg-destructive"
          : "bg-muted-foreground/40";
  const roleLabel = runtime?.role ? (runtime.role === "owner" ? "Owner" : "Client") : null;
  const descriptorLabel = runtime?.descriptor?.label ?? null;
  const statusTooltip = getSavedBackendStatusTooltip(runtime, record, nowMs);
  const metadataBits = [
    roleLabel,
    record.lastConnectedAt
      ? `Last connected ${formatAccessTimestamp(record.lastConnectedAt)}`
      : null,
  ].filter((value) => value !== null);
  return _jsx("div", {
    className: ITEM_ROW_CLASSNAME,
    children: _jsxs("div", {
      className: ITEM_ROW_INNER_CLASSNAME,
      children: [
        _jsxs("div", {
          className: "min-w-0 flex-1 space-y-1",
          children: [
            _jsxs("div", {
              className: "flex min-h-5 items-center gap-1.5",
              children: [
                _jsx(ConnectionStatusDot, {
                  tooltipText: statusTooltip,
                  dotClassName: stateDotClassName,
                  pingClassName:
                    connectionState === "connecting" ? "bg-warning/60 duration-2000" : null,
                }),
                _jsx("h3", {
                  className: "text-sm font-medium text-foreground",
                  children: record.label,
                }),
              ],
            }),
            metadataBits.length > 0
              ? _jsx("p", {
                  className: "text-xs text-muted-foreground",
                  children: metadataBits.join(" · "),
                })
              : null,
            descriptorLabel && descriptorLabel !== record.label
              ? _jsxs("p", {
                  className: "text-xs text-muted-foreground",
                  children: ["Server label: ", descriptorLabel],
                })
              : null,
          ],
        }),
        _jsxs("div", {
          className: "flex w-full shrink-0 items-center gap-2 sm:w-auto sm:justify-end",
          children: [
            _jsx(Button, {
              size: "xs",
              variant: "outline",
              disabled: reconnectingEnvironmentId === environmentId,
              onClick: () => void onReconnect(environmentId),
              children: reconnectingEnvironmentId === environmentId ? "Reconnecting…" : "Reconnect",
            }),
            _jsx(Button, {
              size: "xs",
              variant: "destructive-outline",
              disabled: removingEnvironmentId === environmentId,
              onClick: () => void onRemove(environmentId),
              children: removingEnvironmentId === environmentId ? "Removing…" : "Remove",
            }),
          ],
        }),
      ],
    }),
  });
}
export function ConnectionsSettings() {
  const desktopBridge = window.desktopBridge;
  const [currentSessionRole, setCurrentSessionRole] = useState(desktopBridge ? "owner" : null);
  const [currentAuthPolicy, setCurrentAuthPolicy] = useState(desktopBridge ? null : null);
  const savedEnvironmentsById = useSavedEnvironmentRegistryStore((state) => state.byId);
  const savedEnvironmentIds = useMemo(
    () =>
      Object.values(savedEnvironmentsById)
        .toSorted((left, right) => left.label.localeCompare(right.label))
        .map((record) => record.environmentId),
    [savedEnvironmentsById],
  );
  const [desktopServerExposureState, setDesktopServerExposureState] = useState(null);
  const [desktopServerExposureError, setDesktopServerExposureError] = useState(null);
  const [desktopPairingLinks, setDesktopPairingLinks] = useState([]);
  const [desktopClientSessions, setDesktopClientSessions] = useState([]);
  const [desktopAccessManagementError, setDesktopAccessManagementError] = useState(null);
  const [isLoadingDesktopAccessManagement, setIsLoadingDesktopAccessManagement] = useState(false);
  const [revokingDesktopPairingLinkId, setRevokingDesktopPairingLinkId] = useState(null);
  const [revokingDesktopClientSessionId, setRevokingDesktopClientSessionId] = useState(null);
  const [isRevokingOtherDesktopClients, setIsRevokingOtherDesktopClients] = useState(false);
  const [addBackendDialogOpen, setAddBackendDialogOpen] = useState(false);
  const [savedBackendMode, setSavedBackendMode] = useState("pairing-url");
  const [savedBackendLabel, setSavedBackendLabel] = useState("");
  const [savedBackendPairingUrl, setSavedBackendPairingUrl] = useState("");
  const [savedBackendHost, setSavedBackendHost] = useState("");
  const [savedBackendPairingCode, setSavedBackendPairingCode] = useState("");
  const [savedBackendError, setSavedBackendError] = useState(null);
  const [isAddingSavedBackend, setIsAddingSavedBackend] = useState(false);
  const [reconnectingSavedEnvironmentId, setReconnectingSavedEnvironmentId] = useState(null);
  const [removingSavedEnvironmentId, setRemovingSavedEnvironmentId] = useState(null);
  const [isUpdatingDesktopServerExposure, setIsUpdatingDesktopServerExposure] = useState(false);
  const [pendingDesktopServerExposureMode, setPendingDesktopServerExposureMode] = useState(null);
  const canManageLocalBackend = currentSessionRole === "owner";
  const isLocalBackendNetworkAccessible = desktopBridge
    ? desktopServerExposureState?.mode === "network-accessible"
    : currentAuthPolicy === "remote-reachable";
  const handleDesktopServerExposureChange = useCallback(
    async (checked) => {
      if (!desktopBridge) return;
      setIsUpdatingDesktopServerExposure(true);
      setDesktopServerExposureError(null);
      try {
        const nextState = await desktopBridge.setServerExposureMode(
          checked ? "network-accessible" : "local-only",
        );
        setDesktopServerExposureState(nextState);
        setPendingDesktopServerExposureMode(null);
        setIsUpdatingDesktopServerExposure(false);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update network exposure.";
        setPendingDesktopServerExposureMode(null);
        setDesktopServerExposureError(message);
        toastManager.add({
          type: "error",
          title: "Could not update network access",
          description: message,
        });
        setIsUpdatingDesktopServerExposure(false);
      }
    },
    [desktopBridge],
  );
  const handleConfirmDesktopServerExposureChange = useCallback(() => {
    if (pendingDesktopServerExposureMode === null) return;
    const checked = pendingDesktopServerExposureMode === "network-accessible";
    void handleDesktopServerExposureChange(checked);
  }, [handleDesktopServerExposureChange, pendingDesktopServerExposureMode]);
  const handleRevokeDesktopPairingLink = useCallback(async (id) => {
    setRevokingDesktopPairingLinkId(id);
    setDesktopAccessManagementError(null);
    try {
      await revokeServerPairingLink(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to revoke pairing link.";
      setDesktopAccessManagementError(message);
      toastManager.add({
        type: "error",
        title: "Could not revoke pairing link",
        description: message,
      });
    } finally {
      setRevokingDesktopPairingLinkId(null);
    }
  }, []);
  const handleRevokeDesktopClientSession = useCallback(async (sessionId) => {
    setRevokingDesktopClientSessionId(sessionId);
    setDesktopAccessManagementError(null);
    try {
      await revokeServerClientSession(sessionId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to revoke client access.";
      setDesktopAccessManagementError(message);
      toastManager.add({
        type: "error",
        title: "Could not revoke client access",
        description: message,
      });
    } finally {
      setRevokingDesktopClientSessionId(null);
    }
  }, []);
  const handleRevokeOtherDesktopClients = useCallback(async () => {
    setIsRevokingOtherDesktopClients(true);
    setDesktopAccessManagementError(null);
    try {
      const revokedCount = await revokeOtherServerClientSessions();
      toastManager.add({
        type: "success",
        title: revokedCount === 1 ? "Revoked 1 other client" : `Revoked ${revokedCount} clients`,
        description: "Other paired clients will need a new pairing link before reconnecting.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to revoke other clients.";
      setDesktopAccessManagementError(message);
      toastManager.add({
        type: "error",
        title: "Could not revoke other clients",
        description: message,
      });
    } finally {
      setIsRevokingOtherDesktopClients(false);
    }
  }, []);
  const handleAddSavedBackend = useCallback(async () => {
    setIsAddingSavedBackend(true);
    setSavedBackendError(null);
    try {
      const record = await addSavedEnvironment({
        label: savedBackendLabel,
        ...(savedBackendMode === "pairing-url"
          ? { pairingUrl: savedBackendPairingUrl }
          : {
              host: savedBackendHost,
              pairingCode: savedBackendPairingCode,
            }),
      });
      setSavedBackendLabel("");
      setSavedBackendPairingUrl("");
      setSavedBackendHost("");
      setSavedBackendPairingCode("");
      setAddBackendDialogOpen(false);
      toastManager.add({
        type: "success",
        title: "Backend added",
        description: `${record.label} is now saved and will reconnect on app startup.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add backend.";
      setSavedBackendError(message);
      toastManager.add({
        type: "error",
        title: "Could not add backend",
        description: message,
      });
    } finally {
      setIsAddingSavedBackend(false);
    }
  }, [
    savedBackendHost,
    savedBackendLabel,
    savedBackendMode,
    savedBackendPairingCode,
    savedBackendPairingUrl,
  ]);
  const handleReconnectSavedBackend = useCallback(async (environmentId) => {
    setReconnectingSavedEnvironmentId(environmentId);
    setSavedBackendError(null);
    try {
      await reconnectSavedEnvironment(environmentId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to reconnect backend.";
      setSavedBackendError(message);
      toastManager.add({
        type: "error",
        title: "Could not reconnect backend",
        description: message,
      });
    } finally {
      setReconnectingSavedEnvironmentId(null);
    }
  }, []);
  const handleRemoveSavedBackend = useCallback(async (environmentId) => {
    setRemovingSavedEnvironmentId(environmentId);
    setSavedBackendError(null);
    try {
      await removeSavedEnvironment(environmentId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to remove backend.";
      setSavedBackendError(message);
      toastManager.add({
        type: "error",
        title: "Could not remove backend",
        description: message,
      });
    } finally {
      setRemovingSavedEnvironmentId(null);
    }
  }, []);
  useEffect(() => {
    if (desktopBridge) {
      setCurrentSessionRole("owner");
      return;
    }
    let cancelled = false;
    void fetchSessionState()
      .then((session) => {
        if (cancelled) return;
        setCurrentSessionRole(session.authenticated ? (session.role ?? null) : null);
        setCurrentAuthPolicy(session.auth.policy);
      })
      .catch(() => {
        if (cancelled) return;
        setCurrentSessionRole(null);
        setCurrentAuthPolicy(null);
      });
    return () => {
      cancelled = true;
    };
  }, [desktopBridge]);
  useEffect(() => {
    if (!canManageLocalBackend) return;
    let cancelled = false;
    setIsLoadingDesktopAccessManagement(true);
    const unsubscribeAuthAccess =
      getPrimaryEnvironmentConnection().client.server.subscribeAuthAccess(
        (event) => {
          if (cancelled) {
            return;
          }
          switch (event.type) {
            case "snapshot":
              setDesktopPairingLinks(
                sortDesktopPairingLinks(
                  event.payload.pairingLinks.map((pairingLink) =>
                    toDesktopPairingLinkRecord(pairingLink),
                  ),
                ),
              );
              setDesktopClientSessions(
                sortDesktopClientSessions(
                  event.payload.clientSessions.map((clientSession) =>
                    toDesktopClientSessionRecord(clientSession),
                  ),
                ),
              );
              break;
            case "pairingLinkUpserted":
              setDesktopPairingLinks((current) =>
                upsertDesktopPairingLink(current, toDesktopPairingLinkRecord(event.payload)),
              );
              break;
            case "pairingLinkRemoved":
              setDesktopPairingLinks((current) =>
                removeDesktopPairingLink(current, event.payload.id),
              );
              break;
            case "clientUpserted":
              setDesktopClientSessions((current) =>
                upsertDesktopClientSession(current, toDesktopClientSessionRecord(event.payload)),
              );
              break;
            case "clientRemoved":
              setDesktopClientSessions((current) =>
                removeDesktopClientSession(current, event.payload.sessionId),
              );
              break;
          }
          setDesktopAccessManagementError(null);
          setIsLoadingDesktopAccessManagement(false);
        },
        {
          onResubscribe: () => {
            if (!cancelled) {
              setIsLoadingDesktopAccessManagement(true);
            }
          },
        },
      );
    if (desktopBridge) {
      void desktopBridge
        .getServerExposureState()
        .then((state) => {
          if (cancelled) return;
          setDesktopServerExposureState(state);
        })
        .catch((error) => {
          if (cancelled) return;
          const message =
            error instanceof Error ? error.message : "Failed to load network exposure state.";
          setDesktopServerExposureError(message);
        });
    } else {
      setDesktopServerExposureState(null);
      setDesktopServerExposureError(null);
    }
    return () => {
      cancelled = true;
      unsubscribeAuthAccess();
    };
  }, [canManageLocalBackend, desktopBridge]);
  useEffect(() => {
    if (canManageLocalBackend) return;
    setIsLoadingDesktopAccessManagement(false);
    setDesktopPairingLinks([]);
    setDesktopClientSessions([]);
    setDesktopAccessManagementError(null);
    setDesktopServerExposureState(null);
    setDesktopServerExposureError(null);
  }, [canManageLocalBackend]);
  const visibleDesktopPairingLinks = useMemo(
    () => desktopPairingLinks.filter((pairingLink) => pairingLink.role === "client"),
    [desktopPairingLinks],
  );
  return _jsxs(SettingsPageContainer, {
    children: [
      canManageLocalBackend
        ? _jsxs(_Fragment, {
            children: [
              _jsx(SettingsSection, {
                title: "Manage local backend",
                children: desktopBridge
                  ? _jsx(SettingsRow, {
                      title: "Network access",
                      description: desktopServerExposureState?.endpointUrl
                        ? `Reachable at ${desktopServerExposureState.endpointUrl}`
                        : desktopServerExposureState?.mode === "network-accessible"
                          ? desktopServerExposureState.advertisedHost
                            ? `Exposed on all interfaces. Pairing links use ${desktopServerExposureState.advertisedHost}.`
                            : "Exposed on all interfaces."
                          : desktopServerExposureState
                            ? "Limited to this machine."
                            : "Loading…",
                      status: desktopServerExposureError
                        ? _jsx("span", {
                            className: "block text-destructive",
                            children: desktopServerExposureError,
                          })
                        : null,
                      control: _jsxs(AlertDialog, {
                        open: pendingDesktopServerExposureMode !== null,
                        onOpenChange: (open) => {
                          if (isUpdatingDesktopServerExposure) return;
                          if (!open) setPendingDesktopServerExposureMode(null);
                        },
                        children: [
                          _jsx(Switch, {
                            checked: desktopServerExposureState?.mode === "network-accessible",
                            disabled:
                              !desktopServerExposureState || isUpdatingDesktopServerExposure,
                            onCheckedChange: (checked) => {
                              setPendingDesktopServerExposureMode(
                                checked ? "network-accessible" : "local-only",
                              );
                            },
                            "aria-label": "Enable network access",
                          }),
                          _jsxs(AlertDialogPopup, {
                            children: [
                              _jsxs(AlertDialogHeader, {
                                children: [
                                  _jsx(AlertDialogTitle, {
                                    children:
                                      pendingDesktopServerExposureMode === "network-accessible"
                                        ? "Enable network access?"
                                        : "Disable network access?",
                                  }),
                                  _jsx(AlertDialogDescription, {
                                    children:
                                      pendingDesktopServerExposureMode === "network-accessible"
                                        ? "T3 Code will restart to expose this environment over the network."
                                        : "T3 Code will restart and limit this environment back to this machine.",
                                  }),
                                ],
                              }),
                              _jsxs(AlertDialogFooter, {
                                children: [
                                  _jsx(AlertDialogClose, {
                                    disabled: isUpdatingDesktopServerExposure,
                                    render: _jsx(Button, {
                                      variant: "outline",
                                      disabled: isUpdatingDesktopServerExposure,
                                    }),
                                    children: "Cancel",
                                  }),
                                  _jsx(Button, {
                                    onClick: handleConfirmDesktopServerExposureChange,
                                    disabled:
                                      pendingDesktopServerExposureMode === null ||
                                      isUpdatingDesktopServerExposure,
                                    children: isUpdatingDesktopServerExposure
                                      ? _jsxs(_Fragment, {
                                          children: [
                                            _jsx(Spinner, { className: "size-3.5" }),
                                            "Restarting\u2026",
                                          ],
                                        })
                                      : pendingDesktopServerExposureMode === "network-accessible"
                                        ? "Restart and enable"
                                        : "Restart and disable",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    })
                  : _jsx(SettingsRow, {
                      title: "Network access",
                      description:
                        currentAuthPolicy === "remote-reachable"
                          ? "This backend is already configured for remote access. Network exposure changes must be made where the server is launched."
                          : "This backend is only reachable on this machine. Restart it with a non-loopback host to enable remote pairing.",
                      control: _jsxs(Tooltip, {
                        children: [
                          _jsx(TooltipTrigger, {
                            render: _jsx("span", {
                              className: "inline-flex",
                              children: _jsx(Switch, {
                                checked: isLocalBackendNetworkAccessible,
                                disabled: true,
                                "aria-label": "Enable network access",
                              }),
                            }),
                          }),
                          _jsx(TooltipPopup, {
                            side: "top",
                            children:
                              "Network exposure changes restart the backend and must be controlled where the server process is launched.",
                          }),
                        ],
                      }),
                    }),
              }),
              isLocalBackendNetworkAccessible
                ? _jsxs(SettingsSection, {
                    title: "Authorized clients",
                    headerAction: _jsx(AuthorizedClientsHeaderAction, {
                      clientSessions: desktopClientSessions,
                      isRevokingOtherClients: isRevokingOtherDesktopClients,
                      onRevokeOtherClients: handleRevokeOtherDesktopClients,
                    }),
                    children: [
                      desktopAccessManagementError
                        ? _jsx("div", {
                            className: ITEM_ROW_CLASSNAME,
                            children: _jsx("p", {
                              className: "text-xs text-destructive",
                              children: desktopAccessManagementError,
                            }),
                          })
                        : null,
                      _jsx(PairingClientsList, {
                        endpointUrl: desktopServerExposureState?.endpointUrl,
                        isLoading: isLoadingDesktopAccessManagement,
                        pairingLinks: visibleDesktopPairingLinks,
                        clientSessions: desktopClientSessions,
                        revokingPairingLinkId: revokingDesktopPairingLinkId,
                        revokingClientSessionId: revokingDesktopClientSessionId,
                        onRevokePairingLink: handleRevokeDesktopPairingLink,
                        onRevokeClientSession: handleRevokeDesktopClientSession,
                      }),
                    ],
                  })
                : null,
            ],
          })
        : _jsx(SettingsSection, {
            title: "Local backend access",
            children: _jsx(SettingsRow, {
              title: "Owner tools",
              description:
                "Pairing links and client-session management are only available to owner sessions for this backend.",
            }),
          }),
      _jsxs(SettingsSection, {
        title: "Remote environments",
        headerAction: _jsxs(Dialog, {
          open: addBackendDialogOpen,
          onOpenChange: (open) => {
            setAddBackendDialogOpen(open);
            if (!open) {
              setSavedBackendError(null);
            }
          },
          children: [
            _jsx(DialogTrigger, {
              render: _jsxs(Button, {
                size: "xs",
                variant: "outline",
                children: [_jsx(PlusIcon, { className: "size-3" }), "Add environment"],
              }),
            }),
            _jsxs(DialogPopup, {
              children: [
                _jsxs(DialogHeader, {
                  children: [
                    _jsx(DialogTitle, { children: "Add Environment" }),
                    _jsx(DialogDescription, {
                      children: "Pair another environment to this client.",
                    }),
                    _jsxs("div", {
                      className: "flex gap-1 rounded-lg border border-border/60 bg-muted/50 p-1",
                      children: [
                        _jsx("button", {
                          type: "button",
                          className: cn(
                            "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                            savedBackendMode === "pairing-url"
                              ? "bg-background text-foreground shadow-xs"
                              : "text-muted-foreground hover:text-foreground",
                          ),
                          disabled: isAddingSavedBackend,
                          onClick: () => setSavedBackendMode("pairing-url"),
                          children: "Pairing URL",
                        }),
                        _jsx("button", {
                          type: "button",
                          className: cn(
                            "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                            savedBackendMode === "host-code"
                              ? "bg-background text-foreground shadow-xs"
                              : "text-muted-foreground hover:text-foreground",
                          ),
                          disabled: isAddingSavedBackend,
                          onClick: () => setSavedBackendMode("host-code"),
                          children: "Host + code",
                        }),
                      ],
                    }),
                  ],
                }),
                _jsx(DialogPanel, {
                  children: _jsxs("div", {
                    className: "space-y-4",
                    children: [
                      savedBackendMode === "pairing-url"
                        ? _jsx("p", {
                            className: "text-xs text-muted-foreground",
                            children:
                              "Enter the full pairing URL from the environment you want to connect to.",
                          })
                        : _jsx("p", {
                            className: "text-xs text-muted-foreground",
                            children: "Enter the backend host and pairing code separately.",
                          }),
                      _jsxs("div", {
                        className: "space-y-3",
                        children: [
                          _jsxs("label", {
                            className: "block",
                            children: [
                              _jsx("span", {
                                className: "mb-1.5 block text-xs font-medium text-foreground",
                                children: "Label",
                              }),
                              _jsx(Input, {
                                value: savedBackendLabel,
                                onChange: (event) => setSavedBackendLabel(event.target.value),
                                placeholder: "My backend (optional)",
                                disabled: isAddingSavedBackend,
                                spellCheck: false,
                              }),
                            ],
                          }),
                          savedBackendMode === "pairing-url"
                            ? _jsxs("label", {
                                className: "block",
                                children: [
                                  _jsx("span", {
                                    className: "mb-1.5 block text-xs font-medium text-foreground",
                                    children: "Pairing URL",
                                  }),
                                  _jsx(Input, {
                                    value: savedBackendPairingUrl,
                                    onChange: (event) =>
                                      setSavedBackendPairingUrl(event.target.value),
                                    placeholder: "https://backend.example.com/pair#token=...",
                                    disabled: isAddingSavedBackend,
                                    spellCheck: false,
                                  }),
                                  _jsx("span", {
                                    className: "mt-1 block text-[11px] text-muted-foreground",
                                    children: "The full URL including the pairing token.",
                                  }),
                                ],
                              })
                            : _jsxs(_Fragment, {
                                children: [
                                  _jsxs("label", {
                                    className: "block",
                                    children: [
                                      _jsx("span", {
                                        className:
                                          "mb-1.5 block text-xs font-medium text-foreground",
                                        children: "Host",
                                      }),
                                      _jsx(Input, {
                                        value: savedBackendHost,
                                        onChange: (event) =>
                                          setSavedBackendHost(event.target.value),
                                        placeholder: "https://backend.example.com",
                                        disabled: isAddingSavedBackend,
                                        spellCheck: false,
                                      }),
                                    ],
                                  }),
                                  _jsxs("label", {
                                    className: "block",
                                    children: [
                                      _jsx("span", {
                                        className:
                                          "mb-1.5 block text-xs font-medium text-foreground",
                                        children: "Pairing code",
                                      }),
                                      _jsx(Input, {
                                        value: savedBackendPairingCode,
                                        onChange: (event) =>
                                          setSavedBackendPairingCode(event.target.value),
                                        placeholder: "Pairing code",
                                        disabled: isAddingSavedBackend,
                                        spellCheck: false,
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                        ],
                      }),
                      savedBackendError
                        ? _jsx("p", {
                            className: "text-xs text-destructive",
                            children: savedBackendError,
                          })
                        : null,
                      _jsxs(Button, {
                        variant: "outline",
                        className: "w-full",
                        disabled: isAddingSavedBackend,
                        onClick: () => void handleAddSavedBackend(),
                        children: [
                          _jsx(PlusIcon, { className: "size-3.5" }),
                          isAddingSavedBackend ? "Adding…" : "Add Backend",
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        }),
        children: [
          savedEnvironmentIds.map((environmentId) =>
            _jsx(
              SavedBackendListRow,
              {
                environmentId: environmentId,
                reconnectingEnvironmentId: reconnectingSavedEnvironmentId,
                removingEnvironmentId: removingSavedEnvironmentId,
                onReconnect: handleReconnectSavedBackend,
                onRemove: handleRemoveSavedBackend,
              },
              environmentId,
            ),
          ),
          savedEnvironmentIds.length === 0
            ? _jsx("div", {
                className: ITEM_ROW_CLASSNAME,
                children: _jsx("p", {
                  className: "text-xs text-muted-foreground",
                  children:
                    "No remote environments yet. Click \u201CAdd environment\u201D to pair another environment.",
                }),
              })
            : null,
        ],
      }),
    ],
  });
}
