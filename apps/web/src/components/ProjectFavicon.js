import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { FolderIcon } from "lucide-react";
import { useState } from "react";
function getServerHttpOrigin() {
  const bridgeUrl = window.desktopBridge?.getWsUrl();
  const envUrl = import.meta.env.VITE_WS_URL;
  const wsUrl =
    bridgeUrl && bridgeUrl.length > 0
      ? bridgeUrl
      : envUrl && envUrl.length > 0
        ? envUrl
        : `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.hostname}:${window.location.port}`;
  // Parse to extract just the origin, dropping path/query (e.g. ?token=…)
  const httpUrl = wsUrl.replace(/^wss:/, "https:").replace(/^ws:/, "http:");
  try {
    return new URL(httpUrl).origin;
  } catch {
    return httpUrl;
  }
}
const serverHttpOrigin = getServerHttpOrigin();
const loadedProjectFaviconSrcs = new Set();
export function ProjectFavicon({ cwd, className }) {
  const src = `${serverHttpOrigin}/api/project-favicon?cwd=${encodeURIComponent(cwd)}`;
  const [status, setStatus] = useState(() =>
    loadedProjectFaviconSrcs.has(src) ? "loaded" : "loading",
  );
  return _jsxs(_Fragment, {
    children: [
      status !== "loaded"
        ? _jsx(FolderIcon, {
            className: `size-3.5 shrink-0 text-muted-foreground/50 ${className ?? ""}`,
          })
        : null,
      _jsx("img", {
        src: src,
        alt: "",
        className: `size-3.5 shrink-0 rounded-sm object-contain ${status === "loaded" ? "" : "hidden"} ${className ?? ""}`,
        onLoad: () => {
          loadedProjectFaviconSrcs.add(src);
          setStatus("loaded");
        },
        onError: () => setStatus("error"),
      }),
    ],
  });
}
