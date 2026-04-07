import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useIsMutating, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { ChevronDownIcon, CloudUploadIcon, GitCommitIcon, InfoIcon, SparklesIcon, LoaderIcon, } from "lucide-react";
import { GitHubIcon } from "./Icons";
import { buildGitActionProgressStages, buildMenuItems, requiresDefaultBranchConfirmation, resolveDefaultBranchActionDialogCopy, resolveLiveThreadBranchUpdate, resolveQuickAction, resolveThreadBranchUpdate, } from "./GitActionsControl.logic";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogTitle, } from "~/components/ui/dialog";
import { Group, GroupSeparator } from "~/components/ui/group";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "~/components/ui/menu";
import { Popover, PopoverPopup, PopoverTrigger } from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Textarea } from "~/components/ui/textarea";
import { toastManager } from "~/components/ui/toast";
import { openInPreferredEditor } from "~/editorPreferences";
import { gitInitMutationOptions, gitMutationKeys, gitPullMutationOptions, gitRunStackedActionMutationOptions, gitSuggestCommitMessageMutationOptions, } from "~/lib/gitReactQuery";
import { refreshGitStatus, useGitStatus } from "~/lib/gitStatusState";
import { newCommandId, randomUUID } from "~/lib/utils";
import { resolvePathLinkTarget } from "~/terminal-links";
import { readNativeApi } from "~/nativeApi";
import { useStore } from "~/store";
const GIT_STATUS_WINDOW_REFRESH_DEBOUNCE_MS = 250;
function formatElapsedDescription(startedAtMs) {
    if (startedAtMs === null) {
        return undefined;
    }
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startedAtMs) / 1000));
    if (elapsedSeconds < 60) {
        return `Running for ${elapsedSeconds}s`;
    }
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    return `Running for ${minutes}m ${seconds}s`;
}
function resolveProgressDescription(progress) {
    if (progress.lastOutputLine) {
        return progress.lastOutputLine;
    }
    return formatElapsedDescription(progress.hookStartedAtMs ?? progress.phaseStartedAtMs);
}
function getMenuActionDisabledReason({ item, gitStatus, isBusy, hasOriginRemote, }) {
    if (!item.disabled)
        return null;
    if (isBusy)
        return "Git action in progress.";
    if (!gitStatus)
        return "Git status is unavailable.";
    const hasBranch = gitStatus.branch !== null;
    const hasChanges = gitStatus.hasWorkingTreeChanges;
    const hasOpenPr = gitStatus.pr?.state === "open";
    const isAhead = gitStatus.aheadCount > 0;
    const isBehind = gitStatus.behindCount > 0;
    if (item.id === "commit") {
        if (!hasChanges) {
            return "Worktree is clean. Make changes before committing.";
        }
        return "Commit is currently unavailable.";
    }
    if (item.id === "push") {
        if (!hasBranch) {
            return "Detached HEAD: checkout a branch before pushing.";
        }
        if (hasChanges) {
            return "Commit or stash local changes before pushing.";
        }
        if (isBehind) {
            return "Branch is behind upstream. Pull/rebase before pushing.";
        }
        if (!gitStatus.hasUpstream && !hasOriginRemote) {
            return 'Add an "origin" remote before pushing.';
        }
        if (!isAhead) {
            return "No local commits to push.";
        }
        return "Push is currently unavailable.";
    }
    if (hasOpenPr) {
        return "View PR is currently unavailable.";
    }
    if (!hasBranch) {
        return "Detached HEAD: checkout a branch before creating a PR.";
    }
    if (hasChanges) {
        return "Commit local changes before creating a PR.";
    }
    if (!gitStatus.hasUpstream && !hasOriginRemote) {
        return 'Add an "origin" remote before creating a PR.';
    }
    if (!isAhead) {
        return "No local commits to include in a PR.";
    }
    if (isBehind) {
        return "Branch is behind upstream. Pull/rebase before creating a PR.";
    }
    return "Create PR is currently unavailable.";
}
const COMMIT_DIALOG_TITLE = "Commit changes";
const COMMIT_DIALOG_DESCRIPTION = "Review and confirm your commit. Leave the message blank to auto-generate one.";
function GitActionItemIcon({ icon }) {
    if (icon === "commit")
        return _jsx(GitCommitIcon, {});
    if (icon === "push")
        return _jsx(CloudUploadIcon, {});
    return _jsx(GitHubIcon, {});
}
function GitQuickActionIcon({ quickAction }) {
    const iconClassName = "size-3.5";
    if (quickAction.kind === "open_pr")
        return _jsx(GitHubIcon, { className: iconClassName });
    if (quickAction.kind === "run_pull")
        return _jsx(InfoIcon, { className: iconClassName });
    if (quickAction.kind === "run_action") {
        if (quickAction.action === "commit")
            return _jsx(GitCommitIcon, { className: iconClassName });
        if (quickAction.action === "push" || quickAction.action === "commit_push") {
            return _jsx(CloudUploadIcon, { className: iconClassName });
        }
        return _jsx(GitHubIcon, { className: iconClassName });
    }
    if (quickAction.label === "Commit")
        return _jsx(GitCommitIcon, { className: iconClassName });
    return _jsx(InfoIcon, { className: iconClassName });
}
export default function GitActionsControl({ gitCwd, activeThreadId }) {
    const threadToastData = useMemo(() => (activeThreadId ? { threadId: activeThreadId } : undefined), [activeThreadId]);
    const activeServerThread = useStore((store) => activeThreadId ? store.threads.find((thread) => thread.id === activeThreadId) : undefined);
    const setThreadBranch = useStore((store) => store.setThreadBranch);
    const queryClient = useQueryClient();
    const [isCommitDialogOpen, setIsCommitDialogOpen] = useState(false);
    const [dialogCommitMessage, setDialogCommitMessage] = useState("");
    const [excludedFiles, setExcludedFiles] = useState(new Set());
    const [isEditingFiles, setIsEditingFiles] = useState(false);
    const [pendingDefaultBranchAction, setPendingDefaultBranchAction] = useState(null);
    const activeGitActionProgressRef = useRef(null);
    let runGitActionWithToast;
    const updateActiveProgressToast = useCallback(() => {
        const progress = activeGitActionProgressRef.current;
        if (!progress) {
            return;
        }
        toastManager.update(progress.toastId, {
            type: "loading",
            title: progress.title,
            description: resolveProgressDescription(progress),
            timeout: 0,
            data: progress.toastData,
        });
    }, []);
    const persistThreadBranchSync = useCallback((branch) => {
        if (!activeThreadId || !activeServerThread || activeServerThread.branch === branch) {
            return;
        }
        const worktreePath = activeServerThread.worktreePath;
        const api = readNativeApi();
        if (api) {
            void api.orchestration
                .dispatchCommand({
                type: "thread.meta.update",
                commandId: newCommandId(),
                threadId: activeThreadId,
                branch,
                worktreePath,
            })
                .catch(() => undefined);
        }
        setThreadBranch(activeThreadId, branch, worktreePath);
    }, [activeServerThread, activeThreadId, setThreadBranch]);
    const syncThreadBranchAfterGitAction = useCallback((result) => {
        const branchUpdate = resolveThreadBranchUpdate(result);
        if (!branchUpdate) {
            return;
        }
        persistThreadBranchSync(branchUpdate.branch);
    }, [persistThreadBranchSync]);
    const { data: gitStatus = null, error: gitStatusError } = useGitStatus(gitCwd);
    // Default to true while loading so we don't flash init controls.
    const isRepo = gitStatus?.isRepo ?? true;
    const hasOriginRemote = gitStatus?.hasOriginRemote ?? false;
    const gitStatusForActions = gitStatus;
    const allFiles = gitStatusForActions?.workingTree.files ?? [];
    const selectedFiles = allFiles.filter((f) => !excludedFiles.has(f.path));
    const allSelected = excludedFiles.size === 0;
    const noneSelected = selectedFiles.length === 0;
    const initMutation = useMutation(gitInitMutationOptions({ cwd: gitCwd, queryClient }));
    const runImmediateGitActionMutation = useMutation(gitRunStackedActionMutationOptions({
        cwd: gitCwd,
        queryClient,
    }));
    const pullMutation = useMutation(gitPullMutationOptions({ cwd: gitCwd, queryClient }));
    const suggestCommitMessageMutation = useMutation(gitSuggestCommitMessageMutationOptions({ cwd: gitCwd }));
    const isRunStackedActionRunning = useIsMutating({ mutationKey: gitMutationKeys.runStackedAction(gitCwd) }) > 0;
    const isPullRunning = useIsMutating({ mutationKey: gitMutationKeys.pull(gitCwd) }) > 0;
    const isGitActionRunning = isRunStackedActionRunning || isPullRunning;
    useEffect(() => {
        if (isGitActionRunning) {
            return;
        }
        const branchUpdate = resolveLiveThreadBranchUpdate({
            threadBranch: activeServerThread?.branch ?? null,
            gitStatus: gitStatusForActions,
        });
        if (!branchUpdate) {
            return;
        }
        persistThreadBranchSync(branchUpdate.branch);
    }, [
        activeServerThread?.branch,
        gitStatusForActions,
        isGitActionRunning,
        persistThreadBranchSync,
    ]);
    const isDefaultBranch = useMemo(() => {
        return gitStatusForActions?.isDefaultBranch ?? false;
    }, [gitStatusForActions?.isDefaultBranch]);
    const gitActionMenuItems = useMemo(() => buildMenuItems(gitStatusForActions, isGitActionRunning, hasOriginRemote), [gitStatusForActions, hasOriginRemote, isGitActionRunning]);
    const quickAction = useMemo(() => resolveQuickAction(gitStatusForActions, isGitActionRunning, isDefaultBranch, hasOriginRemote), [gitStatusForActions, hasOriginRemote, isDefaultBranch, isGitActionRunning]);
    const quickActionDisabledReason = quickAction.disabled
        ? (quickAction.hint ?? "This action is currently unavailable.")
        : null;
    const pendingDefaultBranchActionCopy = pendingDefaultBranchAction
        ? resolveDefaultBranchActionDialogCopy({
            action: pendingDefaultBranchAction.action,
            branchName: pendingDefaultBranchAction.branchName,
            includesCommit: pendingDefaultBranchAction.includesCommit,
        })
        : null;
    useEffect(() => {
        const interval = window.setInterval(() => {
            if (!activeGitActionProgressRef.current) {
                return;
            }
            updateActiveProgressToast();
        }, 1000);
        return () => {
            window.clearInterval(interval);
        };
    }, [updateActiveProgressToast]);
    useEffect(() => {
        if (gitCwd === null) {
            return;
        }
        let refreshTimeout = null;
        const scheduleRefreshCurrentGitStatus = () => {
            if (refreshTimeout !== null) {
                window.clearTimeout(refreshTimeout);
            }
            refreshTimeout = window.setTimeout(() => {
                refreshTimeout = null;
                void refreshGitStatus(gitCwd).catch(() => undefined);
            }, GIT_STATUS_WINDOW_REFRESH_DEBOUNCE_MS);
        };
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                scheduleRefreshCurrentGitStatus();
            }
        };
        window.addEventListener("focus", scheduleRefreshCurrentGitStatus);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            if (refreshTimeout !== null) {
                window.clearTimeout(refreshTimeout);
            }
            window.removeEventListener("focus", scheduleRefreshCurrentGitStatus);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [gitCwd]);
    const openExistingPr = useCallback(async () => {
        const api = readNativeApi();
        if (!api) {
            toastManager.add({
                type: "error",
                title: "Link opening is unavailable.",
                data: threadToastData,
            });
            return;
        }
        const prUrl = gitStatusForActions?.pr?.state === "open" ? gitStatusForActions.pr.url : null;
        if (!prUrl) {
            toastManager.add({
                type: "error",
                title: "No open PR found.",
                data: threadToastData,
            });
            return;
        }
        void api.shell.openExternal(prUrl).catch((err) => {
            toastManager.add({
                type: "error",
                title: "Unable to open PR link",
                description: err instanceof Error ? err.message : "An error occurred.",
                data: threadToastData,
            });
        });
    }, [gitStatusForActions, threadToastData]);
    runGitActionWithToast = useEffectEvent(async ({ action, commitMessage, onConfirmed, skipDefaultBranchPrompt = false, statusOverride, featureBranch = false, progressToastId, filePaths, }) => {
        const actionStatus = statusOverride ?? gitStatusForActions;
        const actionBranch = actionStatus?.branch ?? null;
        const actionIsDefaultBranch = featureBranch ? false : isDefaultBranch;
        const actionCanCommit = action === "commit" || action === "commit_push" || action === "commit_push_pr";
        const includesCommit = actionCanCommit &&
            (action === "commit" || !!actionStatus?.hasWorkingTreeChanges || featureBranch);
        if (!skipDefaultBranchPrompt &&
            requiresDefaultBranchConfirmation(action, actionIsDefaultBranch) &&
            actionBranch) {
            if (action !== "push" &&
                action !== "create_pr" &&
                action !== "commit_push" &&
                action !== "commit_push_pr") {
                return;
            }
            setPendingDefaultBranchAction({
                action,
                branchName: actionBranch,
                includesCommit,
                ...(commitMessage ? { commitMessage } : {}),
                ...(onConfirmed ? { onConfirmed } : {}),
                ...(filePaths ? { filePaths } : {}),
            });
            return;
        }
        onConfirmed?.();
        const progressStages = buildGitActionProgressStages({
            action,
            hasCustomCommitMessage: !!commitMessage?.trim(),
            hasWorkingTreeChanges: !!actionStatus?.hasWorkingTreeChanges,
            featureBranch,
            shouldPushBeforePr: action === "create_pr" &&
                (!actionStatus?.hasUpstream || (actionStatus?.aheadCount ?? 0) > 0),
        });
        const scopedToastData = threadToastData ? { ...threadToastData } : undefined;
        const actionId = randomUUID();
        const resolvedProgressToastId = progressToastId ??
            toastManager.add({
                type: "loading",
                title: progressStages[0] ?? "Running git action...",
                description: "Waiting for Git...",
                timeout: 0,
                data: scopedToastData,
            });
        activeGitActionProgressRef.current = {
            toastId: resolvedProgressToastId,
            toastData: scopedToastData,
            actionId,
            title: progressStages[0] ?? "Running git action...",
            phaseStartedAtMs: null,
            hookStartedAtMs: null,
            hookName: null,
            lastOutputLine: null,
            currentPhaseLabel: progressStages[0] ?? "Running git action...",
        };
        if (progressToastId) {
            toastManager.update(progressToastId, {
                type: "loading",
                title: progressStages[0] ?? "Running git action...",
                description: "Waiting for Git...",
                timeout: 0,
                data: scopedToastData,
            });
        }
        const applyProgressEvent = (event) => {
            const progress = activeGitActionProgressRef.current;
            if (!progress) {
                return;
            }
            if (gitCwd && event.cwd !== gitCwd) {
                return;
            }
            if (progress.actionId !== event.actionId) {
                return;
            }
            const now = Date.now();
            switch (event.kind) {
                case "action_started":
                    progress.phaseStartedAtMs = now;
                    progress.hookStartedAtMs = null;
                    progress.hookName = null;
                    progress.lastOutputLine = null;
                    break;
                case "phase_started":
                    progress.title = event.label;
                    progress.currentPhaseLabel = event.label;
                    progress.phaseStartedAtMs = now;
                    progress.hookStartedAtMs = null;
                    progress.hookName = null;
                    progress.lastOutputLine = null;
                    break;
                case "hook_started":
                    progress.title = `Running ${event.hookName}...`;
                    progress.hookName = event.hookName;
                    progress.hookStartedAtMs = now;
                    progress.lastOutputLine = null;
                    break;
                case "hook_output":
                    progress.lastOutputLine = event.text;
                    break;
                case "hook_finished":
                    progress.title = progress.currentPhaseLabel ?? "Committing...";
                    progress.hookName = null;
                    progress.hookStartedAtMs = null;
                    progress.lastOutputLine = null;
                    break;
                case "action_finished":
                    // Let the resolved mutation update the toast so we keep the
                    // elapsed description visible until the final success state renders.
                    return;
                case "action_failed":
                    // Let the rejected mutation publish the error toast to avoid a
                    // transient intermediate state before the final failure message.
                    return;
            }
            updateActiveProgressToast();
        };
        const promise = runImmediateGitActionMutation.mutateAsync({
            actionId,
            action,
            ...(commitMessage ? { commitMessage } : {}),
            ...(featureBranch ? { featureBranch } : {}),
            ...(filePaths ? { filePaths } : {}),
            onProgress: applyProgressEvent,
        });
        try {
            const result = await promise;
            activeGitActionProgressRef.current = null;
            syncThreadBranchAfterGitAction(result);
            const closeResultToast = () => {
                toastManager.close(resolvedProgressToastId);
            };
            const toastCta = result.toast.cta;
            let toastActionProps = null;
            if (toastCta.kind === "run_action") {
                toastActionProps = {
                    children: toastCta.label,
                    onClick: () => {
                        closeResultToast();
                        void runGitActionWithToast({
                            action: toastCta.action.kind,
                        });
                    },
                };
            }
            else if (toastCta.kind === "open_pr") {
                toastActionProps = {
                    children: toastCta.label,
                    onClick: () => {
                        const api = readNativeApi();
                        if (!api)
                            return;
                        closeResultToast();
                        void api.shell.openExternal(toastCta.url);
                    },
                };
            }
            const successToastBase = {
                type: "success",
                title: result.toast.title,
                description: result.toast.description,
                timeout: 0,
                data: {
                    ...scopedToastData,
                    dismissAfterVisibleMs: 10_000,
                },
            };
            if (toastActionProps) {
                toastManager.update(resolvedProgressToastId, {
                    ...successToastBase,
                    actionProps: toastActionProps,
                });
            }
            else {
                toastManager.update(resolvedProgressToastId, successToastBase);
            }
        }
        catch (err) {
            activeGitActionProgressRef.current = null;
            toastManager.update(resolvedProgressToastId, {
                type: "error",
                title: "Action failed",
                description: err instanceof Error ? err.message : "An error occurred.",
                data: scopedToastData,
            });
        }
    });
    const continuePendingDefaultBranchAction = () => {
        if (!pendingDefaultBranchAction)
            return;
        const { action, commitMessage, onConfirmed, filePaths } = pendingDefaultBranchAction;
        setPendingDefaultBranchAction(null);
        void runGitActionWithToast({
            action,
            ...(commitMessage ? { commitMessage } : {}),
            ...(onConfirmed ? { onConfirmed } : {}),
            ...(filePaths ? { filePaths } : {}),
            skipDefaultBranchPrompt: true,
        });
    };
    const checkoutFeatureBranchAndContinuePendingAction = () => {
        if (!pendingDefaultBranchAction)
            return;
        const { action, commitMessage, onConfirmed, filePaths } = pendingDefaultBranchAction;
        setPendingDefaultBranchAction(null);
        void runGitActionWithToast({
            action,
            ...(commitMessage ? { commitMessage } : {}),
            ...(onConfirmed ? { onConfirmed } : {}),
            ...(filePaths ? { filePaths } : {}),
            featureBranch: true,
            skipDefaultBranchPrompt: true,
        });
    };
    const runDialogActionOnNewBranch = () => {
        if (!isCommitDialogOpen)
            return;
        const commitMessage = dialogCommitMessage.trim();
        setIsCommitDialogOpen(false);
        setDialogCommitMessage("");
        setExcludedFiles(new Set());
        setIsEditingFiles(false);
        void runGitActionWithToast({
            action: "commit",
            ...(commitMessage ? { commitMessage } : {}),
            ...(!allSelected ? { filePaths: selectedFiles.map((f) => f.path) } : {}),
            featureBranch: true,
            skipDefaultBranchPrompt: true,
        });
    };
    const runQuickAction = () => {
        if (quickAction.kind === "open_pr") {
            void openExistingPr();
            return;
        }
        if (quickAction.kind === "run_pull") {
            const promise = pullMutation.mutateAsync();
            toastManager.promise(promise, {
                loading: { title: "Pulling...", data: threadToastData },
                success: (result) => ({
                    title: result.status === "pulled" ? "Pulled" : "Already up to date",
                    description: result.status === "pulled"
                        ? `Updated ${result.branch} from ${result.upstreamBranch ?? "upstream"}`
                        : `${result.branch} is already synchronized.`,
                    data: threadToastData,
                }),
                error: (err) => ({
                    title: "Pull failed",
                    description: err instanceof Error ? err.message : "An error occurred.",
                    data: threadToastData,
                }),
            });
            void promise.catch(() => undefined);
            return;
        }
        if (quickAction.kind === "show_hint") {
            toastManager.add({
                type: "info",
                title: quickAction.label,
                description: quickAction.hint,
                data: threadToastData,
            });
            return;
        }
        if (quickAction.action) {
            void runGitActionWithToast({ action: quickAction.action });
        }
    };
    const openDialogForMenuItem = (item) => {
        if (item.disabled)
            return;
        if (item.kind === "open_pr") {
            void openExistingPr();
            return;
        }
        if (item.dialogAction === "push") {
            void runGitActionWithToast({ action: "push" });
            return;
        }
        if (item.dialogAction === "create_pr") {
            void runGitActionWithToast({ action: "create_pr" });
            return;
        }
        setExcludedFiles(new Set());
        setIsEditingFiles(false);
        setIsCommitDialogOpen(true);
    };
    const runDialogAction = () => {
        if (!isCommitDialogOpen)
            return;
        const commitMessage = dialogCommitMessage.trim();
        setIsCommitDialogOpen(false);
        setDialogCommitMessage("");
        setExcludedFiles(new Set());
        setIsEditingFiles(false);
        void runGitActionWithToast({
            action: "commit",
            ...(commitMessage ? { commitMessage } : {}),
            ...(!allSelected ? { filePaths: selectedFiles.map((f) => f.path) } : {}),
        });
    };
    const openChangedFileInEditor = useCallback((filePath) => {
        const api = readNativeApi();
        if (!api || !gitCwd) {
            toastManager.add({
                type: "error",
                title: "Editor opening is unavailable.",
                data: threadToastData,
            });
            return;
        }
        const target = resolvePathLinkTarget(filePath, gitCwd);
        void openInPreferredEditor(api, target).catch((error) => {
            toastManager.add({
                type: "error",
                title: "Unable to open file",
                description: error instanceof Error ? error.message : "An error occurred.",
                data: threadToastData,
            });
        });
    }, [gitCwd, threadToastData]);
    if (!gitCwd)
        return null;
    return (_jsxs(_Fragment, { children: [!isRepo ? (_jsx(Button, { variant: "outline", size: "xs", disabled: initMutation.isPending, onClick: () => initMutation.mutate(), children: initMutation.isPending ? "Initializing..." : "Initialize Git" })) : (_jsxs(Group, { "aria-label": "Git actions", className: "shrink-0", children: [quickActionDisabledReason ? (_jsxs(Popover, { children: [_jsxs(PopoverTrigger, { openOnHover: true, render: _jsx(Button, { "aria-disabled": "true", className: "cursor-not-allowed rounded-e-none border-e-0 opacity-64 before:rounded-e-none", size: "xs", variant: "outline" }), children: [_jsx(GitQuickActionIcon, { quickAction: quickAction }), _jsx("span", { className: "sr-only @3xl/header-actions:not-sr-only @3xl/header-actions:ml-0.5", children: quickAction.label })] }), _jsx(PopoverPopup, { tooltipStyle: true, side: "bottom", align: "start", children: quickActionDisabledReason })] })) : (_jsxs(Button, { variant: "outline", size: "xs", disabled: isGitActionRunning || quickAction.disabled, onClick: runQuickAction, children: [_jsx(GitQuickActionIcon, { quickAction: quickAction }), _jsx("span", { className: "sr-only @3xl/header-actions:not-sr-only @3xl/header-actions:ml-0.5", children: quickAction.label })] })), _jsx(GroupSeparator, { className: "hidden @3xl/header-actions:block" }), _jsxs(Menu, { onOpenChange: (open) => {
                            if (open) {
                                void refreshGitStatus(gitCwd).catch(() => undefined);
                            }
                        }, children: [_jsx(MenuTrigger, { render: _jsx(Button, { "aria-label": "Git action options", size: "icon-xs", variant: "outline" }), disabled: isGitActionRunning, children: _jsx(ChevronDownIcon, { "aria-hidden": "true", className: "size-4" }) }), _jsxs(MenuPopup, { align: "end", className: "w-full", children: [gitActionMenuItems.map((item) => {
                                        const disabledReason = getMenuActionDisabledReason({
                                            item,
                                            gitStatus: gitStatusForActions,
                                            isBusy: isGitActionRunning,
                                            hasOriginRemote,
                                        });
                                        if (item.disabled && disabledReason) {
                                            return (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { openOnHover: true, nativeButton: false, render: _jsx("span", { className: "block w-max cursor-not-allowed" }), children: _jsxs(MenuItem, { className: "w-full", disabled: true, children: [_jsx(GitActionItemIcon, { icon: item.icon }), item.label] }) }), _jsx(PopoverPopup, { tooltipStyle: true, side: "left", align: "center", children: disabledReason })] }, `${item.id}-${item.label}`));
                                        }
                                        return (_jsxs(MenuItem, { disabled: item.disabled, onClick: () => {
                                                openDialogForMenuItem(item);
                                            }, children: [_jsx(GitActionItemIcon, { icon: item.icon }), item.label] }, `${item.id}-${item.label}`));
                                    }), gitStatusForActions?.branch === null && (_jsx("p", { className: "px-2 py-1.5 text-xs text-warning", children: "Detached HEAD: create and checkout a branch to enable push and PR actions." })), gitStatusForActions &&
                                        gitStatusForActions.branch !== null &&
                                        !gitStatusForActions.hasWorkingTreeChanges &&
                                        gitStatusForActions.behindCount > 0 &&
                                        gitStatusForActions.aheadCount === 0 && (_jsx("p", { className: "px-2 py-1.5 text-xs text-warning", children: "Behind upstream. Pull/rebase first." })), gitStatusError && (_jsx("p", { className: "px-2 py-1.5 text-xs text-destructive", children: gitStatusError.message }))] })] })] })), _jsx(Dialog, { open: isCommitDialogOpen, onOpenChange: (open) => {
                    if (!open) {
                        setIsCommitDialogOpen(false);
                        setDialogCommitMessage("");
                        setExcludedFiles(new Set());
                        setIsEditingFiles(false);
                    }
                }, children: _jsxs(DialogPopup, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: COMMIT_DIALOG_TITLE }), _jsx(DialogDescription, { children: COMMIT_DIALOG_DESCRIPTION })] }), _jsxs(DialogPanel, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-3 rounded-lg border border-input bg-muted/40 p-3 text-xs", children: [_jsxs("div", { className: "grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-1", children: [_jsx("span", { className: "text-muted-foreground", children: "Branch" }), _jsxs("span", { className: "flex items-center justify-between gap-2", children: [_jsx("span", { className: "font-medium", children: gitStatusForActions?.branch ?? "(detached HEAD)" }), isDefaultBranch && (_jsx("span", { className: "text-right text-warning text-xs", children: "Warning: default branch" }))] })] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [isEditingFiles && allFiles.length > 0 && (_jsx(Checkbox, { checked: allSelected, indeterminate: !allSelected && !noneSelected, onCheckedChange: () => {
                                                                        setExcludedFiles(allSelected ? new Set(allFiles.map((f) => f.path)) : new Set());
                                                                    } })), _jsx("span", { className: "text-muted-foreground", children: "Files" }), !allSelected && !isEditingFiles && (_jsxs("span", { className: "text-muted-foreground", children: ["(", selectedFiles.length, " of ", allFiles.length, ")"] }))] }), allFiles.length > 0 && (_jsx(Button, { variant: "ghost", size: "xs", onClick: () => setIsEditingFiles((prev) => !prev), children: isEditingFiles ? "Done" : "Edit" }))] }), !gitStatusForActions || allFiles.length === 0 ? (_jsx("p", { className: "font-medium", children: "none" })) : (_jsxs("div", { className: "space-y-2", children: [_jsx(ScrollArea, { className: "h-44 rounded-md border border-input bg-background", children: _jsx("div", { className: "space-y-1 p-1", children: allFiles.map((file) => {
                                                                    const isExcluded = excludedFiles.has(file.path);
                                                                    return (_jsxs("div", { className: "flex w-full items-center gap-2 rounded-md px-2 py-1 font-mono text-xs transition-colors hover:bg-accent/50", children: [isEditingFiles && (_jsx(Checkbox, { checked: !excludedFiles.has(file.path), onCheckedChange: () => {
                                                                                    setExcludedFiles((prev) => {
                                                                                        const next = new Set(prev);
                                                                                        if (next.has(file.path)) {
                                                                                            next.delete(file.path);
                                                                                        }
                                                                                        else {
                                                                                            next.add(file.path);
                                                                                        }
                                                                                        return next;
                                                                                    });
                                                                                } })), _jsxs("button", { type: "button", className: "flex flex-1 items-center justify-between gap-3 text-left truncate", onClick: () => openChangedFileInEditor(file.path), children: [_jsx("span", { className: `truncate${isExcluded ? " text-muted-foreground" : ""}`, children: file.path }), _jsx("span", { className: "shrink-0", children: isExcluded ? (_jsx("span", { className: "text-muted-foreground", children: "Excluded" })) : (_jsxs(_Fragment, { children: [_jsxs("span", { className: "text-success", children: ["+", file.insertions] }), _jsx("span", { className: "text-muted-foreground", children: " / " }), _jsxs("span", { className: "text-destructive", children: ["-", file.deletions] })] })) })] })] }, file.path));
                                                                }) }) }), _jsxs("div", { className: "flex justify-end font-mono", children: [_jsxs("span", { className: "text-success", children: ["+", selectedFiles.reduce((sum, f) => sum + f.insertions, 0)] }), _jsx("span", { className: "text-muted-foreground", children: " / " }), _jsxs("span", { className: "text-destructive", children: ["-", selectedFiles.reduce((sum, f) => sum + f.deletions, 0)] })] })] }))] })] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-xs font-medium", children: "Commit message (optional)" }), _jsxs(Button, { variant: "ghost", size: "sm", className: "h-6 gap-1 px-2 text-xs", disabled: noneSelected || suggestCommitMessageMutation.isPending, onClick: () => {
                                                        const filePaths = selectedFiles.map((f) => f.path);
                                                        suggestCommitMessageMutation.mutate(filePaths.length > 0 ? { filePaths } : {}, {
                                                            onSuccess: (result) => {
                                                                const message = result.body
                                                                    ? `${result.subject}\n\n${result.body}`
                                                                    : result.subject;
                                                                setDialogCommitMessage(message);
                                                            },
                                                            onError: (error) => {
                                                                toastManager.add({
                                                                    title: "Failed to generate commit message",
                                                                    description: error.message,
                                                                    type: "error",
                                                                });
                                                            },
                                                        });
                                                    }, children: [suggestCommitMessageMutation.isPending ? (_jsx(LoaderIcon, { className: "size-3 animate-spin" })) : (_jsx(SparklesIcon, { className: "size-3" })), suggestCommitMessageMutation.isPending ? "Generating…" : "Generate"] })] }), _jsx(Textarea, { value: dialogCommitMessage, onChange: (event) => setDialogCommitMessage(event.target.value), placeholder: "Leave empty to auto-generate", size: "sm" })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => {
                                        setIsCommitDialogOpen(false);
                                        setDialogCommitMessage("");
                                        setExcludedFiles(new Set());
                                        setIsEditingFiles(false);
                                    }, children: "Cancel" }), _jsx(Button, { variant: "outline", size: "sm", disabled: noneSelected, onClick: runDialogActionOnNewBranch, children: "Commit on new branch" }), _jsx(Button, { size: "sm", disabled: noneSelected, onClick: runDialogAction, children: "Commit" })] })] }) }), _jsx(Dialog, { open: pendingDefaultBranchAction !== null, onOpenChange: (open) => {
                    if (!open) {
                        setPendingDefaultBranchAction(null);
                    }
                }, children: _jsxs(DialogPopup, { className: "max-w-xl", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: pendingDefaultBranchActionCopy?.title ?? "Run action on default branch?" }), _jsx(DialogDescription, { children: pendingDefaultBranchActionCopy?.description })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setPendingDefaultBranchAction(null), children: "Abort" }), _jsx(Button, { variant: "outline", size: "sm", onClick: continuePendingDefaultBranchAction, children: pendingDefaultBranchActionCopy?.continueLabel ?? "Continue" }), _jsx(Button, { size: "sm", onClick: checkoutFeatureBranchAndContinuePendingAction, children: "Checkout feature branch & continue" })] })] }) })] }));
}
