import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from "react";
export const ComposerPendingApprovalPanel = memo(function ComposerPendingApprovalPanel({
  approval,
  pendingCount,
}) {
  const approvalSummary =
    approval.requestKind === "command"
      ? "Command approval requested"
      : approval.requestKind === "file-read"
        ? "File-read approval requested"
        : "File-change approval requested";
  return _jsx("div", {
    className: "px-4 py-3.5 sm:px-5 sm:py-4",
    children: _jsxs("div", {
      className: "flex flex-wrap items-center gap-2",
      children: [
        _jsx("span", {
          className: "uppercase text-sm tracking-[0.2em]",
          children: "PENDING APPROVAL",
        }),
        _jsx("span", { className: "text-sm font-medium", children: approvalSummary }),
        pendingCount > 1
          ? _jsxs("span", {
              className: "text-xs text-muted-foreground",
              children: ["1/", pendingCount],
            })
          : null,
      ],
    }),
  });
});
