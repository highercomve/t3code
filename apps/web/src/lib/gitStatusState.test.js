import { afterEach, describe, expect, it, vi } from "vitest";
import { getGitStatusSnapshot, resetGitStatusStateForTests, refreshGitStatus, watchGitStatus, } from "./gitStatusState";
function registerListener(listeners, listener) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}
const gitStatusListeners = new Set();
const BASE_STATUS = {
    isRepo: true,
    hasOriginRemote: true,
    isDefaultBranch: false,
    branch: "feature/push-status",
    hasWorkingTreeChanges: false,
    workingTree: { files: [], insertions: 0, deletions: 0 },
    hasUpstream: true,
    aheadCount: 0,
    behindCount: 0,
    pr: null,
};
const gitClient = {
    refreshStatus: vi.fn(async (input) => ({
        ...BASE_STATUS,
        branch: `${input.cwd}-refreshed`,
    })),
    onStatus: vi.fn((input, listener) => registerListener(gitStatusListeners, listener)),
};
function emitGitStatus(event) {
    for (const listener of gitStatusListeners) {
        listener(event);
    }
}
afterEach(() => {
    gitStatusListeners.clear();
    gitClient.onStatus.mockClear();
    gitClient.refreshStatus.mockClear();
    resetGitStatusStateForTests();
});
describe("gitStatusState", () => {
    it("starts fresh cwd state in a pending state", () => {
        expect(getGitStatusSnapshot("/fresh")).toEqual({
            data: null,
            error: null,
            cause: null,
            isPending: true,
        });
    });
    it("shares one live subscription per cwd and updates the per-cwd atom snapshot", () => {
        const releaseA = watchGitStatus("/repo", gitClient);
        const releaseB = watchGitStatus("/repo", gitClient);
        expect(gitClient.onStatus).toHaveBeenCalledOnce();
        expect(getGitStatusSnapshot("/repo")).toEqual({
            data: null,
            error: null,
            cause: null,
            isPending: true,
        });
        emitGitStatus(BASE_STATUS);
        expect(getGitStatusSnapshot("/repo")).toEqual({
            data: BASE_STATUS,
            error: null,
            cause: null,
            isPending: false,
        });
        releaseA();
        expect(gitStatusListeners.size).toBe(1);
        releaseB();
        expect(gitStatusListeners.size).toBe(0);
    });
    it("refreshes git status through the unary RPC without restarting the stream", async () => {
        const release = watchGitStatus("/repo", gitClient);
        emitGitStatus(BASE_STATUS);
        const refreshed = await refreshGitStatus("/repo", gitClient);
        expect(gitClient.onStatus).toHaveBeenCalledOnce();
        expect(gitClient.refreshStatus).toHaveBeenCalledWith({ cwd: "/repo" });
        expect(refreshed).toEqual({ ...BASE_STATUS, branch: "/repo-refreshed" });
        expect(getGitStatusSnapshot("/repo")).toEqual({
            data: BASE_STATUS,
            error: null,
            cause: null,
            isPending: false,
        });
        release();
    });
});
