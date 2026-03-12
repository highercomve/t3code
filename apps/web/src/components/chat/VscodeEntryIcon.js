import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useMemo, useState } from "react";
import { getVscodeIconUrlForEntry } from "../../vscode-icons";
import { FileIcon, FolderIcon } from "lucide-react";
import { cn } from "~/lib/utils";
export const VscodeEntryIcon = memo(function VscodeEntryIcon(props) {
  const [failedIconUrl, setFailedIconUrl] = useState(null);
  const iconUrl = useMemo(
    () => getVscodeIconUrlForEntry(props.pathValue, props.kind, props.theme),
    [props.kind, props.pathValue, props.theme],
  );
  const failed = failedIconUrl === iconUrl;
  if (failed) {
    return props.kind === "directory"
      ? _jsx(FolderIcon, { className: cn("size-4 text-muted-foreground/80", props.className) })
      : _jsx(FileIcon, { className: cn("size-4 text-muted-foreground/80", props.className) });
  }
  return _jsx("img", {
    src: iconUrl,
    alt: "",
    "aria-hidden": "true",
    className: cn("size-4 shrink-0", props.className),
    loading: "lazy",
    onError: () => setFailedIconUrl(iconUrl),
  });
});
