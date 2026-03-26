import { describe, expect, it, vi } from "vitest";
import { ApprovalRequestId, TurnId, type ThreadId } from "@t3tools/contracts";

import {
  classifyOpencodeStderrChunk,
  classifyOpencodeStderrLine,
  OpencodeAppServerManager,
} from "./opencodeAppServerManager";

const asThreadId = (value: string): ThreadId => value as ThreadId;

describe("classifyOpencodeStderrLine", () => {
  it("ignores empty lines", () => {
    expect(classifyOpencodeStderrLine("   ")).toBeNull();
  });

  it("ignores non-error structured opencode logs", () => {
    const line = "INFO 2026-03-25T23:03:48 +72ms service=models.dev fetched cached models";
    expect(classifyOpencodeStderrLine(line)).toBeNull();
  });

  it("ignores known benign models.dev fetch failures", () => {
    const line =
      "\u001b[31mERROR\u001b[0m 2026-03-25T23:03:48 +72ms service=models.dev error=Unable to connect. Is the computer able to access the url? Failed to fetch models.dev";
    expect(classifyOpencodeStderrLine(line)).toBeNull();
  });

  it("keeps unknown structured errors", () => {
    const line = "ERROR 2026-03-25T23:03:48 +72ms service=agent runtime failed to start";
    expect(classifyOpencodeStderrLine(line)).toEqual({
      message: line,
    });
  });

  it("keeps plain stderr messages", () => {
    const line = "Failed to run the query 'PRAGMA wal_checkpoint(PASSIVE)'";
    expect(classifyOpencodeStderrLine(line)).toEqual({
      message: line,
    });
  });

  it("ignores punctuation-only stderr fragments", () => {
    expect(classifyOpencodeStderrLine("}")).toBeNull();
  });
});

describe("classifyOpencodeStderrChunk", () => {
  it("collapses multiline stderr into a single error", () => {
    const chunk = [
      "Error: Unexpected error, check log file for more details",
      "{",
      '  "service": "agent",',
      '  "message": "failed to start"',
      "}",
    ].join("\n");

    expect(classifyOpencodeStderrChunk(chunk)).toEqual({
      message: "Error: Unexpected error, check log file for more details",
    });
  });
});

describe("OpencodeAppServerManager server requests", () => {
  it("tracks requestUserInput requests instead of rejecting them", () => {
    const manager = new OpencodeAppServerManager();
    const context = {
      session: {
        provider: "opencode",
        status: "running",
        threadId: asThreadId("thread_1"),
        runtimeMode: "full-access",
        model: "opencode/big-pickle",
        activeTurnId: TurnId.makeUnsafe("turn_1"),
        createdAt: "2026-02-10T00:00:00.000Z",
        updatedAt: "2026-02-10T00:00:00.000Z",
      },
      acpSessionId: "sess_1",
      pending: new Map(),
      pendingApprovals: new Map(),
      pendingUserInputs: new Map(),
      nextRequestId: 1,
      stopping: false,
    };

    const emitEvent = vi
      .spyOn(manager as unknown as { emitEvent: (event: unknown) => void }, "emitEvent")
      .mockImplementation(() => {});
    const writeMessage = vi
      .spyOn(
        manager as unknown as { writeMessage: (context: unknown, message: unknown) => void },
        "writeMessage",
      )
      .mockImplementation(() => {});

    (
      manager as unknown as {
        handleServerRequest: (context: typeof context, request: Record<string, unknown>) => void;
      }
    ).handleServerRequest(context, {
      id: 42,
      method: "item/tool/requestUserInput",
      params: {
        questions: [
          {
            id: "scope",
            question: "Which scope?",
          },
        ],
      },
    });

    const request = Array.from(context.pendingUserInputs.values())[0];
    expect(request?.jsonRpcId).toBe(42);
    expect(request?.threadId).toBe("thread_1");
    expect(request?.turnId).toBe("turn_1");
    expect(writeMessage).not.toHaveBeenCalled();
    expect(emitEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: "request",
        method: "item/tool/requestUserInput",
        threadId: "thread_1",
        turnId: "turn_1",
        payload: {
          questions: [
            {
              id: "scope",
              question: "Which scope?",
            },
          ],
        },
      }),
    );
  });

  it("responds to pending requestUserInput requests", async () => {
    const manager = new OpencodeAppServerManager();
    const context = {
      session: {
        provider: "opencode",
        status: "ready",
        threadId: asThreadId("thread_1"),
        runtimeMode: "full-access",
        model: "opencode/big-pickle",
        createdAt: "2026-02-10T00:00:00.000Z",
        updatedAt: "2026-02-10T00:00:00.000Z",
      },
      pendingUserInputs: new Map([
        [
          ApprovalRequestId.makeUnsafe("req-user-input-1"),
          {
            requestId: ApprovalRequestId.makeUnsafe("req-user-input-1"),
            jsonRpcId: 42,
            threadId: asThreadId("thread_1"),
          },
        ],
      ]),
    };

    const requireSession = vi
      .spyOn(
        manager as unknown as { requireSession: (threadId: ThreadId) => typeof context },
        "requireSession",
      )
      .mockReturnValue(context);
    const writeMessage = vi
      .spyOn(
        manager as unknown as { writeMessage: (context: unknown, message: unknown) => void },
        "writeMessage",
      )
      .mockImplementation(() => {});
    const emitEvent = vi
      .spyOn(manager as unknown as { emitEvent: (event: unknown) => void }, "emitEvent")
      .mockImplementation(() => {});

    await manager.respondToUserInput(
      asThreadId("thread_1"),
      ApprovalRequestId.makeUnsafe("req-user-input-1"),
      {
        scope: "All request methods",
      },
    );

    expect(requireSession).toHaveBeenCalledWith("thread_1");
    expect(writeMessage).toHaveBeenCalledWith(context, {
      id: 42,
      result: {
        answers: {
          scope: "All request methods",
        },
      },
    });
    expect(emitEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "item/tool/requestUserInput/answered",
        payload: {
          requestId: "req-user-input-1",
          answers: {
            scope: "All request methods",
          },
        },
      }),
    );
  });
});
