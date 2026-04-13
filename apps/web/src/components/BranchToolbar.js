import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { scopeProjectRef, scopeThreadRef } from "@t3tools/client-runtime";
import { memo, useMemo } from "react";
import { useComposerDraftStore } from "../composerDraftStore";
import { useStore } from "../store";
import { createProjectSelectorByRef, createThreadSelectorByRef } from "../storeSelectors";
import { resolveEffectiveEnvMode } from "./BranchToolbar.logic";
import { BranchToolbarBranchSelector } from "./BranchToolbarBranchSelector";
import { BranchToolbarEnvironmentSelector } from "./BranchToolbarEnvironmentSelector";
import { BranchToolbarEnvModeSelector } from "./BranchToolbarEnvModeSelector";
import { Separator } from "./ui/separator";
export const BranchToolbar = memo(function BranchToolbar({
  environmentId,
  threadId,
  draftId,
  onEnvModeChange,
  effectiveEnvModeOverride,
  activeThreadBranchOverride,
  onActiveThreadBranchOverrideChange,
  envLocked,
  onCheckoutPullRequestRequest,
  onComposerFocusRequest,
  availableEnvironments,
  onEnvironmentChange,
}) {
  const threadRef = useMemo(
    () => scopeThreadRef(environmentId, threadId),
    [environmentId, threadId],
  );
  const serverThreadSelector = useMemo(() => createThreadSelectorByRef(threadRef), [threadRef]);
  const serverThread = useStore(serverThreadSelector);
  const draftThread = useComposerDraftStore((store) =>
    draftId ? store.getDraftSession(draftId) : store.getDraftThreadByRef(threadRef),
  );
  const activeProjectRef = serverThread
    ? scopeProjectRef(serverThread.environmentId, serverThread.projectId)
    : draftThread
      ? scopeProjectRef(draftThread.environmentId, draftThread.projectId)
      : null;
  const activeProjectSelector = useMemo(
    () => createProjectSelectorByRef(activeProjectRef),
    [activeProjectRef],
  );
  const activeProject = useStore(activeProjectSelector);
  const hasActiveThread = serverThread !== undefined || draftThread !== null;
  const activeWorktreePath = serverThread?.worktreePath ?? draftThread?.worktreePath ?? null;
  const effectiveEnvMode =
    effectiveEnvModeOverride ??
    resolveEffectiveEnvMode({
      activeWorktreePath,
      hasServerThread: serverThread !== undefined,
      draftThreadEnvMode: draftThread?.envMode,
    });
  const envModeLocked = envLocked || (serverThread !== undefined && activeWorktreePath !== null);
  const showEnvironmentPicker =
    availableEnvironments && availableEnvironments.length > 1 && onEnvironmentChange;
  if (!hasActiveThread || !activeProject) return null;
  return _jsxs("div", {
    className:
      "mx-auto flex w-full max-w-208 items-center justify-between px-2.5 pb-3 pt-1 sm:px-3",
    children: [
      _jsxs("div", {
        className: "flex items-center gap-1",
        children: [
          showEnvironmentPicker &&
            _jsxs(_Fragment, {
              children: [
                _jsx(BranchToolbarEnvironmentSelector, {
                  envLocked: envLocked,
                  environmentId: environmentId,
                  availableEnvironments: availableEnvironments,
                  onEnvironmentChange: onEnvironmentChange,
                }),
                _jsx(Separator, { orientation: "vertical", className: "mx-0.5 h-3.5!" }),
              ],
            }),
          _jsx(BranchToolbarEnvModeSelector, {
            envLocked: envModeLocked,
            effectiveEnvMode: effectiveEnvMode,
            activeWorktreePath: activeWorktreePath,
            onEnvModeChange: onEnvModeChange,
          }),
        ],
      }),
      _jsx(BranchToolbarBranchSelector, {
        environmentId: environmentId,
        threadId: threadId,
        ...(draftId ? { draftId } : {}),
        envLocked: envLocked,
        ...(effectiveEnvModeOverride ? { effectiveEnvModeOverride } : {}),
        ...(activeThreadBranchOverride !== undefined ? { activeThreadBranchOverride } : {}),
        ...(onActiveThreadBranchOverrideChange ? { onActiveThreadBranchOverrideChange } : {}),
        ...(onCheckoutPullRequestRequest ? { onCheckoutPullRequestRequest } : {}),
        ...(onComposerFocusRequest ? { onComposerFocusRequest } : {}),
      }),
    ],
  });
});
