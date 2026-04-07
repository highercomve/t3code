import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronDownIcon } from "lucide-react";
import { useCallback, useDeferredValue, useEffect, useMemo, useOptimistic, useRef, useState, useTransition, } from "react";
import { gitBranchSearchInfiniteQueryOptions, gitQueryKeys } from "../lib/gitReactQuery";
import { useGitStatus } from "../lib/gitStatusState";
import { readNativeApi } from "../nativeApi";
import { parsePullRequestReference } from "../pullRequestReference";
import { deriveLocalBranchNameFromRemoteRef, resolveBranchSelectionTarget, resolveBranchToolbarValue, shouldIncludeBranchPickerItem, } from "./BranchToolbar.logic";
import { Button } from "./ui/button";
import { Combobox, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxPopup, ComboboxStatus, ComboboxTrigger, } from "./ui/combobox";
import { toastManager } from "./ui/toast";
function toBranchActionErrorMessage(error) {
    return error instanceof Error ? error.message : "An error occurred.";
}
function getBranchTriggerLabel(input) {
    const { activeWorktreePath, effectiveEnvMode, resolvedActiveBranch } = input;
    if (!resolvedActiveBranch) {
        return "Select branch";
    }
    if (effectiveEnvMode === "worktree" && !activeWorktreePath) {
        return `From ${resolvedActiveBranch}`;
    }
    return resolvedActiveBranch;
}
export function BranchToolbarBranchSelector({ activeProjectCwd, activeThreadBranch, activeWorktreePath, branchCwd, effectiveEnvMode, envLocked, onSetThreadBranch, onCheckoutPullRequestRequest, onComposerFocusRequest, }) {
    const queryClient = useQueryClient();
    const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false);
    const [branchQuery, setBranchQuery] = useState("");
    const deferredBranchQuery = useDeferredValue(branchQuery);
    const branchStatusQuery = useGitStatus(branchCwd);
    const trimmedBranchQuery = branchQuery.trim();
    const deferredTrimmedBranchQuery = deferredBranchQuery.trim();
    useEffect(() => {
        if (!branchCwd)
            return;
        void queryClient.prefetchInfiniteQuery(gitBranchSearchInfiniteQueryOptions({ cwd: branchCwd, query: "" }));
    }, [branchCwd, queryClient]);
    const { data: branchesSearchData, fetchNextPage, hasNextPage, isFetchingNextPage, isPending: isBranchesSearchPending, } = useInfiniteQuery(gitBranchSearchInfiniteQueryOptions({
        cwd: branchCwd,
        query: deferredTrimmedBranchQuery,
    }));
    const branches = useMemo(() => branchesSearchData?.pages.flatMap((page) => page.branches) ?? [], [branchesSearchData?.pages]);
    const currentGitBranch = branchStatusQuery.data?.branch ?? branches.find((branch) => branch.current)?.name ?? null;
    const canonicalActiveBranch = resolveBranchToolbarValue({
        envMode: effectiveEnvMode,
        activeWorktreePath,
        activeThreadBranch,
        currentGitBranch,
    });
    const branchNames = useMemo(() => branches.map((branch) => branch.name), [branches]);
    const branchByName = useMemo(() => new Map(branches.map((branch) => [branch.name, branch])), [branches]);
    const normalizedDeferredBranchQuery = deferredTrimmedBranchQuery.toLowerCase();
    const prReference = parsePullRequestReference(trimmedBranchQuery);
    const isSelectingWorktreeBase = effectiveEnvMode === "worktree" && !envLocked && !activeWorktreePath;
    const checkoutPullRequestItemValue = prReference && onCheckoutPullRequestRequest ? `__checkout_pull_request__:${prReference}` : null;
    const canCreateBranch = !isSelectingWorktreeBase && trimmedBranchQuery.length > 0;
    const hasExactBranchMatch = branchByName.has(trimmedBranchQuery);
    const createBranchItemValue = canCreateBranch
        ? `__create_new_branch__:${trimmedBranchQuery}`
        : null;
    const branchPickerItems = useMemo(() => {
        const items = [...branchNames];
        if (createBranchItemValue && !hasExactBranchMatch) {
            items.push(createBranchItemValue);
        }
        if (checkoutPullRequestItemValue) {
            items.unshift(checkoutPullRequestItemValue);
        }
        return items;
    }, [branchNames, checkoutPullRequestItemValue, createBranchItemValue, hasExactBranchMatch]);
    const filteredBranchPickerItems = useMemo(() => normalizedDeferredBranchQuery.length === 0
        ? branchPickerItems
        : branchPickerItems.filter((itemValue) => shouldIncludeBranchPickerItem({
            itemValue,
            normalizedQuery: normalizedDeferredBranchQuery,
            createBranchItemValue,
            checkoutPullRequestItemValue,
        })), [
        branchPickerItems,
        checkoutPullRequestItemValue,
        createBranchItemValue,
        normalizedDeferredBranchQuery,
    ]);
    const [resolvedActiveBranch, setOptimisticBranch] = useOptimistic(canonicalActiveBranch, (_currentBranch, optimisticBranch) => optimisticBranch);
    const [isBranchActionPending, startBranchActionTransition] = useTransition();
    const shouldVirtualizeBranchList = filteredBranchPickerItems.length > 40;
    const totalBranchCount = branchesSearchData?.pages[0]?.totalCount ?? 0;
    const branchStatusText = isBranchesSearchPending
        ? "Loading branches..."
        : isFetchingNextPage
            ? "Loading more branches..."
            : hasNextPage
                ? `Showing ${branches.length} of ${totalBranchCount} branches`
                : null;
    const runBranchAction = (action) => {
        startBranchActionTransition(async () => {
            await action().catch(() => undefined);
            await queryClient
                .invalidateQueries({ queryKey: gitQueryKeys.branches(branchCwd) })
                .catch(() => undefined);
        });
    };
    const selectBranch = (branch) => {
        const api = readNativeApi();
        if (!api || !branchCwd || isBranchActionPending)
            return;
        // In new-worktree mode, selecting a branch sets the base branch.
        if (isSelectingWorktreeBase) {
            onSetThreadBranch(branch.name, null);
            setIsBranchMenuOpen(false);
            onComposerFocusRequest?.();
            return;
        }
        const selectionTarget = resolveBranchSelectionTarget({
            activeProjectCwd,
            activeWorktreePath,
            branch,
        });
        // If the branch already lives in a worktree, point the thread there.
        if (selectionTarget.reuseExistingWorktree) {
            onSetThreadBranch(branch.name, selectionTarget.nextWorktreePath);
            setIsBranchMenuOpen(false);
            onComposerFocusRequest?.();
            return;
        }
        const selectedBranchName = branch.isRemote
            ? deriveLocalBranchNameFromRemoteRef(branch.name)
            : branch.name;
        setIsBranchMenuOpen(false);
        onComposerFocusRequest?.();
        runBranchAction(async () => {
            const previousBranch = resolvedActiveBranch;
            setOptimisticBranch(selectedBranchName);
            try {
                const checkoutResult = await api.git.checkout({
                    cwd: selectionTarget.checkoutCwd,
                    branch: branch.name,
                });
                const nextBranchName = branch.isRemote
                    ? (checkoutResult.branch ?? selectedBranchName)
                    : selectedBranchName;
                setOptimisticBranch(nextBranchName);
                onSetThreadBranch(nextBranchName, selectionTarget.nextWorktreePath);
            }
            catch (error) {
                setOptimisticBranch(previousBranch);
                toastManager.add({
                    type: "error",
                    title: "Failed to checkout branch.",
                    description: toBranchActionErrorMessage(error),
                });
            }
        });
    };
    const createBranch = (rawName) => {
        const name = rawName.trim();
        const api = readNativeApi();
        if (!api || !branchCwd || !name || isBranchActionPending)
            return;
        setIsBranchMenuOpen(false);
        onComposerFocusRequest?.();
        runBranchAction(async () => {
            const previousBranch = resolvedActiveBranch;
            setOptimisticBranch(name);
            try {
                const createBranchResult = await api.git.createBranch({
                    cwd: branchCwd,
                    branch: name,
                    checkout: true,
                });
                setOptimisticBranch(createBranchResult.branch);
                onSetThreadBranch(createBranchResult.branch, activeWorktreePath);
            }
            catch (error) {
                setOptimisticBranch(previousBranch);
                toastManager.add({
                    type: "error",
                    title: "Failed to create and checkout branch.",
                    description: toBranchActionErrorMessage(error),
                });
            }
        });
    };
    useEffect(() => {
        if (effectiveEnvMode !== "worktree" ||
            activeWorktreePath ||
            activeThreadBranch ||
            !currentGitBranch) {
            return;
        }
        onSetThreadBranch(currentGitBranch, null);
    }, [
        activeThreadBranch,
        activeWorktreePath,
        currentGitBranch,
        effectiveEnvMode,
        onSetThreadBranch,
    ]);
    const handleOpenChange = useCallback((open) => {
        setIsBranchMenuOpen(open);
        if (!open) {
            setBranchQuery("");
            return;
        }
        void queryClient.invalidateQueries({
            queryKey: gitQueryKeys.branches(branchCwd),
        });
    }, [branchCwd, queryClient]);
    const branchListScrollElementRef = useRef(null);
    const maybeFetchNextBranchPage = useCallback(() => {
        if (!isBranchMenuOpen || !hasNextPage || isFetchingNextPage) {
            return;
        }
        const scrollElement = branchListScrollElementRef.current;
        if (!scrollElement) {
            return;
        }
        const distanceFromBottom = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight;
        if (distanceFromBottom > 96) {
            return;
        }
        void fetchNextPage().catch(() => undefined);
    }, [fetchNextPage, hasNextPage, isBranchMenuOpen, isFetchingNextPage]);
    const branchListVirtualizer = useVirtualizer({
        count: filteredBranchPickerItems.length,
        estimateSize: (index) => filteredBranchPickerItems[index] === checkoutPullRequestItemValue ? 44 : 28,
        getScrollElement: () => branchListScrollElementRef.current,
        overscan: 12,
        enabled: isBranchMenuOpen && shouldVirtualizeBranchList,
        initialRect: {
            height: 224,
            width: 0,
        },
    });
    const virtualBranchRows = branchListVirtualizer.getVirtualItems();
    const setBranchListRef = useCallback((element) => {
        branchListScrollElementRef.current =
            element?.parentElement ?? null;
        if (element) {
            branchListVirtualizer.measure();
        }
    }, [branchListVirtualizer]);
    useEffect(() => {
        if (!isBranchMenuOpen || !shouldVirtualizeBranchList)
            return;
        queueMicrotask(() => {
            branchListVirtualizer.measure();
        });
    }, [
        branchListVirtualizer,
        filteredBranchPickerItems.length,
        isBranchMenuOpen,
        shouldVirtualizeBranchList,
    ]);
    useEffect(() => {
        if (!isBranchMenuOpen) {
            return;
        }
        branchListScrollElementRef.current?.scrollTo({ top: 0 });
    }, [deferredTrimmedBranchQuery, isBranchMenuOpen]);
    useEffect(() => {
        const scrollElement = branchListScrollElementRef.current;
        if (!scrollElement || !isBranchMenuOpen) {
            return;
        }
        const handleScroll = () => {
            maybeFetchNextBranchPage();
        };
        scrollElement.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => {
            scrollElement.removeEventListener("scroll", handleScroll);
        };
    }, [isBranchMenuOpen, maybeFetchNextBranchPage]);
    useEffect(() => {
        maybeFetchNextBranchPage();
    }, [branches.length, maybeFetchNextBranchPage]);
    const triggerLabel = getBranchTriggerLabel({
        activeWorktreePath,
        effectiveEnvMode,
        resolvedActiveBranch,
    });
    function renderPickerItem(itemValue, index, style) {
        if (checkoutPullRequestItemValue && itemValue === checkoutPullRequestItemValue) {
            return (_jsx(ComboboxItem, { hideIndicator: true, index: index, value: itemValue, style: style, onClick: () => {
                    if (!prReference || !onCheckoutPullRequestRequest) {
                        return;
                    }
                    setIsBranchMenuOpen(false);
                    setBranchQuery("");
                    onComposerFocusRequest?.();
                    onCheckoutPullRequestRequest(prReference);
                }, children: _jsxs("div", { className: "flex min-w-0 flex-col items-start py-1", children: [_jsx("span", { className: "truncate font-medium", children: "Checkout Pull Request" }), _jsx("span", { className: "truncate text-muted-foreground text-xs", children: prReference })] }) }, itemValue));
        }
        if (createBranchItemValue && itemValue === createBranchItemValue) {
            return (_jsx(ComboboxItem, { hideIndicator: true, index: index, value: itemValue, style: style, onClick: () => createBranch(trimmedBranchQuery), children: _jsxs("span", { className: "truncate", children: ["Create new branch \"", trimmedBranchQuery, "\""] }) }, itemValue));
        }
        const branch = branchByName.get(itemValue);
        if (!branch)
            return null;
        const hasSecondaryWorktree = branch.worktreePath && branch.worktreePath !== activeProjectCwd;
        const badge = branch.current
            ? "current"
            : hasSecondaryWorktree
                ? "worktree"
                : branch.isRemote
                    ? "remote"
                    : branch.isDefault
                        ? "default"
                        : null;
        return (_jsx(ComboboxItem, { hideIndicator: true, index: index, value: itemValue, style: style, onClick: () => selectBranch(branch), children: _jsxs("div", { className: "flex w-full items-center justify-between gap-2", children: [_jsx("span", { className: "truncate", children: itemValue }), badge && _jsx("span", { className: "shrink-0 text-[10px] text-muted-foreground/45", children: badge })] }) }, itemValue));
    }
    return (_jsxs(Combobox, { items: branchPickerItems, filteredItems: filteredBranchPickerItems, autoHighlight: true, virtualized: shouldVirtualizeBranchList, onItemHighlighted: (_value, eventDetails) => {
            if (!isBranchMenuOpen || eventDetails.index < 0)
                return;
            branchListVirtualizer.scrollToIndex(eventDetails.index, { align: "auto" });
        }, onOpenChange: handleOpenChange, open: isBranchMenuOpen, value: resolvedActiveBranch, children: [_jsxs(ComboboxTrigger, { render: _jsx(Button, { variant: "ghost", size: "xs" }), className: "text-muted-foreground/70 hover:text-foreground/80", disabled: (isBranchesSearchPending && branches.length === 0) || isBranchActionPending, children: [_jsx("span", { className: "max-w-[240px] truncate", children: triggerLabel }), _jsx(ChevronDownIcon, {})] }), _jsxs(ComboboxPopup, { align: "end", side: "top", className: "w-80", children: [_jsx("div", { className: "border-b p-1", children: _jsx(ComboboxInput, { className: "[&_input]:font-sans rounded-md", inputClassName: "ring-0", placeholder: "Search branches...", showTrigger: false, size: "sm", value: branchQuery, onChange: (event) => setBranchQuery(event.target.value) }) }), _jsx(ComboboxEmpty, { children: "No branches found." }), _jsx(ComboboxList, { ref: setBranchListRef, className: "max-h-56", children: shouldVirtualizeBranchList ? (_jsx("div", { className: "relative", style: {
                                height: `${branchListVirtualizer.getTotalSize()}px`,
                            }, children: virtualBranchRows.map((virtualRow) => {
                                const itemValue = filteredBranchPickerItems[virtualRow.index];
                                if (!itemValue)
                                    return null;
                                return renderPickerItem(itemValue, virtualRow.index, {
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    transform: `translateY(${virtualRow.start}px)`,
                                });
                            }) })) : (filteredBranchPickerItems.map((itemValue, index) => renderPickerItem(itemValue, index))) }), branchStatusText ? _jsx(ComboboxStatus, { children: branchStatusText }) : null] })] }));
}
