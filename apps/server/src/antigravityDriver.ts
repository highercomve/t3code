/**
 * AntigravityDriver - one-shot spawn driver for `agy --print`.
 *
 * Replaces the ACP-driven Gemini manager. Each turn spawns the binary, streams
 * stdout line by line, captures stderr, and resolves with the terminal state.
 * Conversation IDs are minted by agy on the first turn and harvested from
 * `~/.gemini/antigravity-cli/cache/last_conversations.json`.
 */
import { spawn, type ChildProcessByStdio } from "node:child_process";
import readline from "node:readline";
import { readFile } from "node:fs/promises";
import * as nodePath from "node:path";
import type { Readable } from "node:stream";

import { Data, Effect } from "effect";

export interface AntigravityTurnInput {
  readonly binaryPath: string;
  readonly cwd: string;
  readonly model: string;
  readonly prompt: string;
  readonly conversationId: string | null;
  readonly dangerouslySkipPermissions: boolean;
  readonly timeoutMs: number;
  readonly env?: Record<string, string>;
}

export interface AntigravityStreamEvent {
  readonly kind: "line";
  readonly text: string;
}

export interface AntigravityTurnResult {
  readonly exitCode: number;
  readonly stdoutLineCount: number;
  readonly stderrText: string;
  readonly state: "completed" | "failed" | "cancelled";
  readonly errorMessage?: string;
  readonly mintedConversationId: string | null;
}

type DriverReason =
  | "binary-not-found"
  | "spawn-failed"
  | "timeout"
  | "non-zero-exit"
  | "missing-conversation-id"
  | "io-error";

export class AntigravityDriverError extends Data.TaggedError("AntigravityDriverError")<{
  readonly reason: DriverReason;
  readonly message: string;
  readonly cause?: unknown;
}> {}

const SIGKILL_GRACE_MS = 2_000;
const STDERR_TAIL_BYTES = 1_024;

function tail(text: string, maxBytes: number): string {
  if (text.length <= maxBytes) return text;
  return text.slice(text.length - maxBytes);
}

function buildArgv(input: AntigravityTurnInput): ReadonlyArray<string> {
  const argv: string[] = ["--print", input.prompt];
  // agy's --print-timeout is a Go duration string; bare integers are rejected.
  const seconds = Math.max(1, Math.ceil(input.timeoutMs / 1000));
  argv.push("--print-timeout", `${seconds}s`);
  if (input.conversationId !== null) {
    argv.push("--conversation", input.conversationId);
  }
  // NOTE: agy has no `--model` flag — verified empirically (`agy --print
  // --model X` exits 2 with `flags provided but not defined: -model`). The
  // active model is whatever is in `~/.gemini/antigravity-cli/settings.json`
  // ("Gemini 3.1 Pro (High)", "Claude Opus 4.6 (Thinking)", etc.). `input.model`
  // is therefore informational only — the driver does NOT forward it.
  if (input.dangerouslySkipPermissions) {
    argv.push("--dangerously-skip-permissions");
  }
  return argv;
}

function lastConversationsPath(): string {
  const home = process.env.HOME ?? "";
  return nodePath.join(home, ".gemini", "antigravity-cli", "cache", "last_conversations.json");
}

async function readMintedConversationId(cwd: string): Promise<string | null> {
  try {
    const raw = await readFile(lastConversationsPath(), "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const map = parsed as Record<string, unknown>;
    const value = map[cwd];
    return typeof value === "string" && value.length > 0 ? value : null;
  } catch {
    return null;
  }
}

interface SpawnRunResult {
  readonly exitCode: number;
  readonly signal: NodeJS.Signals | null;
  readonly stderrText: string;
  readonly stdoutLineCount: number;
  readonly timedOut: boolean;
  readonly cancelled: boolean;
  readonly spawnError?: NodeJS.ErrnoException;
}

const spawnAndStream = (
  input: AntigravityTurnInput,
  onStreamEvent: (event: AntigravityStreamEvent) => Effect.Effect<void>,
) =>
  Effect.callback<SpawnRunResult, AntigravityDriverError>((resume) => {
    const argv = buildArgv(input);
    let child: ChildProcessByStdio<null, Readable, Readable>;
    try {
      child = spawn(input.binaryPath, [...argv], {
        cwd: input.cwd,
        env: {
          ...process.env,
          ...(input.env ?? {}),
        },
        stdio: ["ignore", "pipe", "pipe"],
        shell: false,
      });
    } catch (cause) {
      resume(
        Effect.fail(
          new AntigravityDriverError({
            reason: "spawn-failed",
            message: `Failed to spawn ${input.binaryPath}: ${
              cause instanceof Error ? cause.message : String(cause)
            }`,
            cause,
          }),
        ),
      );
      return;
    }

    const stderrChunks: Buffer[] = [];
    let stdoutLineCount = 0;
    let timedOut = false;
    let cancelled = false;
    let killGraceTimer: ReturnType<typeof setTimeout> | undefined;

    const escalate = () => {
      killGraceTimer = setTimeout(() => {
        if (!child.killed) {
          try {
            child.kill("SIGKILL");
          } catch {
            // ignored — child may already be gone
          }
        }
      }, SIGKILL_GRACE_MS);
    };

    const timeoutHandle = setTimeout(() => {
      timedOut = true;
      try {
        child.kill("SIGTERM");
      } catch {
        // ignored
      }
      escalate();
    }, input.timeoutMs);

    const rl = readline.createInterface({ input: child.stdout });
    rl.on("line", (line: string) => {
      stdoutLineCount += 1;
      Effect.runPromise(onStreamEvent({ kind: "line", text: line })).catch(() => {
        // Listener errors must not crash the driver.
      });
    });

    child.stderr.on("data", (chunk: Buffer) => {
      stderrChunks.push(chunk);
    });

    child.on("error", (error: NodeJS.ErrnoException) => {
      clearTimeout(timeoutHandle);
      if (killGraceTimer) clearTimeout(killGraceTimer);
      const reason: DriverReason = error.code === "ENOENT" ? "binary-not-found" : "spawn-failed";
      resume(
        Effect.fail(
          new AntigravityDriverError({
            reason,
            message:
              reason === "binary-not-found"
                ? `agy binary not found at '${input.binaryPath}' (ENOENT).`
                : `agy process error: ${error.message}`,
            cause: error,
          }),
        ),
      );
    });

    child.on("exit", (code, signal) => {
      clearTimeout(timeoutHandle);
      if (killGraceTimer) clearTimeout(killGraceTimer);
      rl.close();
      const stderrText = Buffer.concat(stderrChunks).toString("utf8");
      resume(
        Effect.succeed({
          exitCode: code ?? -1,
          signal,
          stderrText,
          stdoutLineCount,
          timedOut,
          cancelled,
        }),
      );
    });

    return Effect.sync(() => {
      cancelled = true;
      try {
        if (!child.killed) child.kill("SIGTERM");
      } catch {
        // ignored
      }
      escalate();
    });
  });

export const runAntigravityTurn = (
  input: AntigravityTurnInput,
  onStreamEvent: (event: AntigravityStreamEvent) => Effect.Effect<void>,
): Effect.Effect<AntigravityTurnResult, AntigravityDriverError> =>
  Effect.gen(function* () {
    yield* Effect.logInfo("antigravity spawn start").pipe(
      Effect.annotateLogs({
        binaryPath: input.binaryPath,
        cwd: input.cwd,
        model: input.model,
        promptLength: input.prompt.length,
        hasConversationId: input.conversationId !== null,
        timeoutMs: input.timeoutMs,
      }),
    );

    const run = yield* spawnAndStream(input, onStreamEvent);

    let state: AntigravityTurnResult["state"];
    let errorMessage: string | undefined;
    if (run.cancelled) {
      state = "cancelled";
    } else if (run.timedOut) {
      state = "failed";
      errorMessage = `agy exceeded the ${Math.ceil(input.timeoutMs / 1000)}s --print-timeout window.`;
    } else if (run.exitCode === 0) {
      state = "completed";
    } else {
      state = "failed";
      const tailText = tail(run.stderrText.trim(), STDERR_TAIL_BYTES);
      errorMessage =
        tailText.length > 0
          ? `agy exited with code ${run.exitCode}: ${tailText}`
          : `agy exited with code ${run.exitCode}.`;
      yield* Effect.logError("antigravity non-zero exit").pipe(
        Effect.annotateLogs({
          exitCode: run.exitCode,
          stderrTail: tailText,
        }),
      );
    }

    let mintedConversationId: string | null = null;
    if (state === "completed" && input.conversationId === null) {
      mintedConversationId = yield* Effect.tryPromise({
        try: () => readMintedConversationId(input.cwd),
        catch: () => null as string | null,
      }).pipe(Effect.orElseSucceed(() => null));
      if (mintedConversationId === null) {
        yield* Effect.logWarning(
          "antigravity: no minted conversation id in last_conversations.json",
        ).pipe(Effect.annotateLogs({ cwd: input.cwd }));
      }
    }

    return {
      exitCode: run.exitCode,
      stdoutLineCount: run.stdoutLineCount,
      stderrText: run.stderrText,
      state,
      ...(errorMessage !== undefined ? { errorMessage } : {}),
      mintedConversationId,
    } satisfies AntigravityTurnResult;
  });
