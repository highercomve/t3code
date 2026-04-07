import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { FolderIcon, GitForkIcon } from "lucide-react";
import { useCallback } from "react";
import { newCommandId } from "../lib/utils";
import { readNativeApi } from "../nativeApi";
import { useComposerDraftStore } from "../composerDraftStore";
import { useStore } from "../store";
import { resolveDraftEnvModeAfterBranchChange, resolveEffectiveEnvMode, } from "./BranchToolbar.logic";
import { BranchToolbarBranchSelector } from "./BranchToolbarBranchSelector";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "./ui/select";
const envModeItems = [
    { value: "local", label: "Local" },
    { value: "worktree", label: "New worktree" },
];
export default function BranchToolbar({ threadId, onEnvModeChange, envLocked, onCheckoutPullRequestRequest, onComposerFocusRequest, }) {
    const threads = useStore((store) => store.threads);
    const projects = useStore((store) => store.projects);
    const setThreadBranchAction = useStore((store) => store.setThreadBranch);
    const draftThread = useComposerDraftStore((store) => store.getDraftThread(threadId));
    const setDraftThreadContext = useComposerDraftStore((store) => store.setDraftThreadContext);
    const serverThread = threads.find((thread) => thread.id === threadId);
    const activeProjectId = serverThread?.projectId ?? draftThread?.projectId ?? null;
    const activeProject = projects.find((project) => project.id === activeProjectId);
    const activeThreadId = serverThread?.id ?? (draftThread ? threadId : undefined);
    const activeThreadBranch = serverThread?.branch ?? draftThread?.branch ?? null;
    const activeWorktreePath = serverThread?.worktreePath ?? draftThread?.worktreePath ?? null;
    const branchCwd = activeWorktreePath ?? activeProject?.cwd ?? null;
    const hasServerThread = serverThread !== undefined;
    const effectiveEnvMode = resolveEffectiveEnvMode({
        activeWorktreePath,
        hasServerThread,
        draftThreadEnvMode: draftThread?.envMode,
    });
    const setThreadBranch = useCallback((branch, worktreePath) => {
        if (!activeThreadId)
            return;
        const api = readNativeApi();
        // If the effective cwd is about to change, stop the running session so the
        // next message creates a new one with the correct cwd.
        if (serverThread?.session && worktreePath !== activeWorktreePath && api) {
            void api.orchestration
                .dispatchCommand({
                type: "thread.session.stop",
                commandId: newCommandId(),
                threadId: activeThreadId,
                createdAt: new Date().toISOString(),
            })
                .catch(() => undefined);
        }
        if (api && hasServerThread) {
            void api.orchestration.dispatchCommand({
                type: "thread.meta.update",
                commandId: newCommandId(),
                threadId: activeThreadId,
                branch,
                worktreePath,
            });
        }
        if (hasServerThread) {
            setThreadBranchAction(activeThreadId, branch, worktreePath);
            return;
        }
        const nextDraftEnvMode = resolveDraftEnvModeAfterBranchChange({
            nextWorktreePath: worktreePath,
            currentWorktreePath: activeWorktreePath,
            effectiveEnvMode,
        });
        setDraftThreadContext(threadId, {
            branch,
            worktreePath,
            envMode: nextDraftEnvMode,
        });
    }, [
        activeThreadId,
        serverThread?.session,
        activeWorktreePath,
        hasServerThread,
        setThreadBranchAction,
        setDraftThreadContext,
        threadId,
        effectiveEnvMode,
    ]);
    if (!activeThreadId || !activeProject)
        return null;
    return (_jsxs("div", { className: "mx-auto flex w-full max-w-3xl items-center justify-between px-5 pb-3 pt-1", children: [envLocked || activeWorktreePath ? (_jsx("span", { className: "inline-flex items-center gap-1 border border-transparent px-[calc(--spacing(3)-1px)] text-sm font-medium text-muted-foreground/70 sm:text-xs", children: activeWorktreePath ? (_jsxs(_Fragment, { children: [_jsx(GitForkIcon, { className: "size-3" }), "Worktree"] })) : (_jsxs(_Fragment, { children: [_jsx(FolderIcon, { className: "size-3" }), "Local"] })) })) : (_jsxs(Select, { value: effectiveEnvMode, onValueChange: (value) => onEnvModeChange(value), items: envModeItems, children: [_jsxs(SelectTrigger, { variant: "ghost", size: "xs", className: "font-medium", children: [effectiveEnvMode === "worktree" ? (_jsx(GitForkIcon, { className: "size-3" })) : (_jsx(FolderIcon, { className: "size-3" })), _jsx(SelectValue, {})] }), _jsxs(SelectPopup, { children: [_jsx(SelectItem, { value: "local", children: _jsxs("span", { className: "inline-flex items-center gap-1.5", children: [_jsx(FolderIcon, { className: "size-3" }), "Local"] }) }), _jsx(SelectItem, { value: "worktree", children: _jsxs("span", { className: "inline-flex items-center gap-1.5", children: [_jsx(GitForkIcon, { className: "size-3" }), "New worktree"] }) })] })] })), _jsx(BranchToolbarBranchSelector, { activeProjectCwd: activeProject.cwd, activeThreadBranch: activeThreadBranch, activeWorktreePath: activeWorktreePath, branchCwd: branchCwd, effectiveEnvMode: effectiveEnvMode, envLocked: envLocked, onSetThreadBranch: setThreadBranch, ...(onCheckoutPullRequestRequest ? { onCheckoutPullRequestRequest } : {}), ...(onComposerFocusRequest ? { onComposerFocusRequest } : {}) })] }));
}
