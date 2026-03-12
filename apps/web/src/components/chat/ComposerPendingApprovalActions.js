import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from "react";
import { Button } from "../ui/button";
export const ComposerPendingApprovalActions = memo(function ComposerPendingApprovalActions({
  requestId,
  isResponding,
  onRespondToApproval,
}) {
  return _jsxs(_Fragment, {
    children: [
      _jsx(Button, {
        size: "sm",
        variant: "ghost",
        disabled: isResponding,
        onClick: () => void onRespondToApproval(requestId, "cancel"),
        children: "Cancel turn",
      }),
      _jsx(Button, {
        size: "sm",
        variant: "destructive-outline",
        disabled: isResponding,
        onClick: () => void onRespondToApproval(requestId, "decline"),
        children: "Decline",
      }),
      _jsx(Button, {
        size: "sm",
        variant: "outline",
        disabled: isResponding,
        onClick: () => void onRespondToApproval(requestId, "acceptForSession"),
        children: "Always allow this session",
      }),
      _jsx(Button, {
        size: "sm",
        variant: "default",
        disabled: isResponding,
        onClick: () => void onRespondToApproval(requestId, "accept"),
        children: "Approve once",
      }),
    ],
  });
});
