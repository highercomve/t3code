import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { ThreadId } from "@t3tools/contracts";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
const THREAD_A = ThreadId.makeUnsafe("thread-a");
const THREAD_B = ThreadId.makeUnsafe("thread-b");
const GIT_CWD = "/repo/project";
const BRANCH_NAME = "feature/toast-scope";
const {
  invalidateGitQueriesSpy,
  invalidateGitStatusQuerySpy,
  runStackedActionMutateAsyncSpy,
  setThreadBranchSpy,
  toastAddSpy,
  toastCloseSpy,
  toastPromiseSpy,
  toastUpdateSpy,
} = vi.hoisted(() => ({
  invalidateGitQueriesSpy: vi.fn(() => Promise.resolve()),
  invalidateGitStatusQuerySpy: vi.fn(() => Promise.resolve()),
  runStackedActionMutateAsyncSpy: vi.fn(() => new Promise(() => undefined)),
  setThreadBranchSpy: vi.fn(),
  toastAddSpy: vi.fn(() => "toast-1"),
  toastCloseSpy: vi.fn(),
  toastPromiseSpy: vi.fn(),
  toastUpdateSpy: vi.fn(),
}));
vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useIsMutating: vi.fn(() => 0),
    useMutation: vi.fn((options) => {
      if (options.__kind === "run-stacked-action") {
        return {
          mutateAsync: runStackedActionMutateAsyncSpy,
          isPending: false,
        };
      }
      if (options.__kind === "pull") {
        return {
          mutateAsync: vi.fn(),
          isPending: false,
        };
      }
      return {
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isPending: false,
      };
    }),
    useQuery: vi.fn((options) => {
      if (options.queryKey?.[0] === "git-status") {
        return {
          data: {
            branch: BRANCH_NAME,
            hasWorkingTreeChanges: false,
            workingTree: { files: [], insertions: 0, deletions: 0 },
            hasUpstream: true,
            aheadCount: 1,
            behindCount: 0,
            pr: null,
          },
          error: null,
        };
      }
      if (options.queryKey?.[0] === "git-branches") {
        return {
          data: {
            isRepo: true,
            hasOriginRemote: true,
            branches: [
              {
                name: BRANCH_NAME,
                current: true,
                isDefault: false,
                worktreePath: null,
              },
            ],
          },
          error: null,
        };
      }
      return { data: null, error: null };
    }),
    useQueryClient: vi.fn(() => ({})),
  };
});
vi.mock("~/components/ui/toast", () => ({
  toastManager: {
    add: toastAddSpy,
    close: toastCloseSpy,
    promise: toastPromiseSpy,
    update: toastUpdateSpy,
  },
}));
vi.mock("~/editorPreferences", () => ({
  openInPreferredEditor: vi.fn(),
}));
vi.mock("~/lib/gitReactQuery", () => ({
  gitBranchesQueryOptions: vi.fn(() => ({ queryKey: ["git-branches"] })),
  gitInitMutationOptions: vi.fn(() => ({ __kind: "init" })),
  gitMutationKeys: {
    pull: vi.fn(() => ["pull"]),
    runStackedAction: vi.fn(() => ["run-stacked-action"]),
  },
  gitPullMutationOptions: vi.fn(() => ({ __kind: "pull" })),
  gitRunStackedActionMutationOptions: vi.fn(() => ({ __kind: "run-stacked-action" })),
  gitStatusQueryOptions: vi.fn(() => ({ queryKey: ["git-status"] })),
  invalidateGitQueries: invalidateGitQueriesSpy,
  invalidateGitStatusQuery: invalidateGitStatusQuerySpy,
}));
vi.mock("~/lib/utils", async () => {
  const actual = await vi.importActual("~/lib/utils");
  return {
    ...actual,
    newCommandId: vi.fn(() => "command-1"),
    randomUUID: vi.fn(() => "action-1"),
  };
});
vi.mock("~/nativeApi", () => ({
  readNativeApi: vi.fn(() => null),
}));
vi.mock("~/store", () => ({
  useStore: (selector) =>
    selector({
      setThreadBranch: setThreadBranchSpy,
      threads: [
        { id: THREAD_A, branch: BRANCH_NAME, worktreePath: null },
        { id: THREAD_B, branch: BRANCH_NAME, worktreePath: null },
      ],
    }),
}));
vi.mock("~/terminal-links", () => ({
  resolvePathLinkTarget: vi.fn(),
}));
import GitActionsControl from "./GitActionsControl";
function findButtonByText(text) {
  return (
    Array.from(document.querySelectorAll("button")).find((button) =>
      button.textContent?.includes(text),
    ) ?? null
  );
}
function Harness() {
  const [activeThreadId, setActiveThreadId] = useState(THREAD_A);
  return _jsxs(_Fragment, {
    children: [
      _jsx("button", {
        type: "button",
        onClick: () => setActiveThreadId(THREAD_B),
        children: "Switch thread",
      }),
      _jsx(GitActionsControl, { gitCwd: GIT_CWD, activeThreadId: activeThreadId }),
    ],
  });
}
describe("GitActionsControl thread-scoped progress toast", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    document.body.innerHTML = "";
  });
  it("keeps an in-flight git action toast pinned to the thread that started it", async () => {
    vi.useFakeTimers();
    const host = document.createElement("div");
    document.body.append(host);
    const screen = await render(_jsx(Harness, {}), { container: host });
    try {
      const quickActionButton = findButtonByText("Push & create PR");
      expect(quickActionButton, 'Unable to find button containing "Push & create PR"').toBeTruthy();
      if (!(quickActionButton instanceof HTMLButtonElement)) {
        throw new Error('Unable to find button containing "Push & create PR"');
      }
      quickActionButton.click();
      expect(toastAddSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { threadId: THREAD_A },
          title: "Pushing...",
          type: "loading",
        }),
      );
      await vi.advanceTimersByTimeAsync(1_000);
      expect(toastUpdateSpy).toHaveBeenLastCalledWith(
        "toast-1",
        expect.objectContaining({
          data: { threadId: THREAD_A },
          title: "Pushing...",
          type: "loading",
        }),
      );
      const switchThreadButton = findButtonByText("Switch thread");
      expect(switchThreadButton, 'Unable to find button containing "Switch thread"').toBeTruthy();
      if (!(switchThreadButton instanceof HTMLButtonElement)) {
        throw new Error('Unable to find button containing "Switch thread"');
      }
      switchThreadButton.click();
      await vi.advanceTimersByTimeAsync(1_000);
      expect(toastUpdateSpy).toHaveBeenLastCalledWith(
        "toast-1",
        expect.objectContaining({
          data: { threadId: THREAD_A },
          title: "Pushing...",
          type: "loading",
        }),
      );
    } finally {
      await screen.unmount();
      host.remove();
    }
  });
});
