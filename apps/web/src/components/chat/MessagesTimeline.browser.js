import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "../../index.css";
import { EnvironmentId } from "@t3tools/contracts";
import { createRef } from "react";
import { page } from "vitest/browser";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
const scrollToEndSpy = vi.fn();
const getStateSpy = vi.fn(() => ({ isAtEnd: true }));
vi.mock("@legendapp/list/react", async () => {
  const React = await import("react");
  const LegendList = React.forwardRef(function MockLegendList(props, ref) {
    React.useImperativeHandle(ref, () => ({
      scrollToEnd: scrollToEndSpy,
      getState: getStateSpy,
    }));
    return _jsxs("div", {
      "data-testid": "legend-list",
      children: [
        props.ListHeaderComponent,
        props.data.map((item) =>
          _jsx("div", { children: props.renderItem({ item }) }, props.keyExtractor(item)),
        ),
        props.ListFooterComponent,
      ],
    });
  });
  return { LegendList };
});
import { MessagesTimeline } from "./MessagesTimeline";
function buildProps() {
  return {
    isWorking: false,
    activeTurnInProgress: false,
    activeTurnId: null,
    activeTurnStartedAt: null,
    listRef: createRef(),
    completionDividerBeforeEntryId: null,
    completionSummary: null,
    turnDiffSummaryByAssistantMessageId: new Map(),
    routeThreadKey: "environment-local:thread-1",
    onOpenTurnDiff: vi.fn(),
    revertTurnCountByUserMessageId: new Map(),
    onRevertUserMessage: vi.fn(),
    isRevertingCheckpoint: false,
    onImageExpand: vi.fn(),
    activeThreadEnvironmentId: EnvironmentId.make("environment-local"),
    markdownCwd: undefined,
    resolvedTheme: "dark",
    timestampFormat: "24-hour",
    workspaceRoot: undefined,
    onIsAtEndChange: vi.fn(),
  };
}
describe("MessagesTimeline", () => {
  afterEach(() => {
    scrollToEndSpy.mockReset();
    getStateSpy.mockClear();
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });
  it("renders activity rows instead of the empty placeholder when a thread has non-message timeline data", async () => {
    const screen = await render(
      _jsx(MessagesTimeline, {
        ...buildProps(),
        timelineEntries: [
          {
            id: "work-1",
            kind: "work",
            createdAt: "2026-04-13T12:00:00.000Z",
            entry: {
              id: "work-1",
              createdAt: "2026-04-13T12:00:00.000Z",
              label: "thinking",
              detail: "Inspecting repository state",
              tone: "thinking",
            },
          },
        ],
      }),
    );
    try {
      await expect
        .element(page.getByText("Send a message to start the conversation."))
        .not.toBeInTheDocument();
      await expect.element(page.getByText("Thinking - Inspecting repository state")).toBeVisible();
    } finally {
      await screen.unmount();
    }
  });
  it("snaps to the bottom when timeline rows appear after an initially empty render", async () => {
    const requestAnimationFrameSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback) => {
        callback(0);
        return 1;
      });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
    const props = buildProps();
    const screen = await render(_jsx(MessagesTimeline, { ...props, timelineEntries: [] }));
    try {
      await expect
        .element(page.getByText("Send a message to start the conversation."))
        .toBeVisible();
      await screen.rerender(
        _jsx(MessagesTimeline, {
          ...props,
          timelineEntries: [
            {
              id: "work-1",
              kind: "work",
              createdAt: "2026-04-13T12:00:00.000Z",
              entry: {
                id: "work-1",
                createdAt: "2026-04-13T12:00:00.000Z",
                label: "thinking",
                detail: "Inspecting repository state",
                tone: "thinking",
              },
            },
          ],
        }),
      );
      await expect.element(page.getByText("Thinking - Inspecting repository state")).toBeVisible();
      expect(props.onIsAtEndChange).toHaveBeenCalledWith(true);
      expect(scrollToEndSpy).toHaveBeenCalledWith({ animated: false });
      expect(requestAnimationFrameSpy).toHaveBeenCalled();
    } finally {
      await screen.unmount();
    }
  });
});
