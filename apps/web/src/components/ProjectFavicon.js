import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { FolderIcon } from "lucide-react";
import { useState } from "react";
import { resolveEnvironmentHttpUrl } from "../environments/runtime";
const loadedProjectFaviconSrcs = new Set();
export function ProjectFavicon(input) {
  const src = resolveEnvironmentHttpUrl({
    environmentId: input.environmentId,
    pathname: "/api/project-favicon",
    searchParams: { cwd: input.cwd },
  });
  const [status, setStatus] = useState(() =>
    loadedProjectFaviconSrcs.has(src) ? "loaded" : "loading",
  );
  return _jsxs(_Fragment, {
    children: [
      status !== "loaded"
        ? _jsx(FolderIcon, {
            className: `size-3.5 shrink-0 text-muted-foreground/50 ${input.className ?? ""}`,
          })
        : null,
      _jsx("img", {
        src: src,
        alt: "",
        className: `size-3.5 shrink-0 rounded-sm object-contain ${status === "loaded" ? "" : "hidden"} ${input.className ?? ""}`,
        onLoad: () => {
          loadedProjectFaviconSrcs.add(src);
          setStatus("loaded");
        },
        onError: () => setStatus("error"),
      }),
    ],
  });
}
