import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { FolderIcon } from "lucide-react";
import { useState } from "react";
import { resolveServerUrl } from "~/lib/utils";
const loadedProjectFaviconSrcs = new Set();
export function ProjectFavicon({ cwd, className }) {
  const src = resolveServerUrl({
    protocol: "http",
    pathname: "/api/project-favicon",
    searchParams: { cwd },
  });
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
