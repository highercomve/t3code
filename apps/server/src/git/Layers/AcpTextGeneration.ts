/**
 * AcpTextGeneration – Lightweight ACP (Agent Client Protocol) client for
 * single-shot text generation, plus a factory for building provider layers.
 *
 * Used by providers whose CLIs only expose the ACP protocol (Gemini, OpenCode)
 * and lack native structured-output flags like `--output-schema` (Codex) or
 * `--json-schema` (Claude).
 *
 * Protocol flow:
 *   1. Spawn CLI in ACP mode
 *   2. initialize({ protocolVersion: 1 })
 *   3. session/new({ cwd, model?, mcpServers: [] })
 *   4. session/prompt({ sessionId, prompt: [...] })
 *      — collect `agent_message_chunk` text from `session/update` notifications
 *   5. Kill process
 *
 * @module AcpTextGeneration
 */
import { type ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import readline from "node:readline";

import { Effect, Layer, Schema } from "effect";

import type { GeminiSettings, ModelSelection, OpencodeSettings } from "@t3tools/contracts";
import { sanitizeBranchFragment, sanitizeFeatureBranchName } from "@t3tools/shared/git";

import { ServerSettingsService } from "../../serverSettings.ts";

import { TextGenerationError } from "../Errors.ts";
import { type TextGenerationShape, TextGeneration } from "../Services/TextGeneration.ts";
import {
  buildBranchNamePrompt,
  buildCommitMessagePrompt,
  buildPrContentPrompt,
  buildThreadTitlePrompt,
} from "../Prompts.ts";
import {
  extractJsonFromText,
  normalizeCliError,
  sanitizeCommitSubject,
  sanitizePrTitle,
  sanitizeThreadTitle,
} from "../Utils.ts";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export interface AcpTextGenerationConfig {
  /** Name used in error messages (e.g. "gemini", "opencode"). */
  readonly cliName: string;
  /** Absolute path or bare binary name. */
  readonly binaryPath: string;
  /** CLI arguments (e.g. `["--experimental-acp", "--model", m]`). */
  readonly args: readonly string[];
  /** Model slug – if provided, sent in the `session/new` params. */
  readonly model?: string | undefined;
  /** Working directory for the process and session. */
  readonly cwd: string;
  /** Extra environment variables. */
  readonly env?: Record<string, string | undefined> | undefined;
  /** Timeout for the entire operation in milliseconds. */
  readonly timeoutMs: number;
  /** The operation name for error context. */
  readonly operation: string;
}

// ---------------------------------------------------------------------------
// JSON prompt preamble for providers without native structured output.
// ---------------------------------------------------------------------------

const JSON_PREAMBLE = [
  "CRITICAL: You must respond with ONLY a valid JSON object.",
  "No markdown code fences, no explanation, no additional text before or after the JSON.",
  "Just the raw JSON object.",
  "",
].join("\n");

// ---------------------------------------------------------------------------
// ndjson helpers
// ---------------------------------------------------------------------------

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: string;
  method: string;
  params: unknown;
}

// ---------------------------------------------------------------------------
// Core ACP execution
// ---------------------------------------------------------------------------

/**
 * Run a single text-generation prompt over the ACP protocol and return the
 * raw model response text.
 */
export function runAcpTextGeneration(
  config: AcpTextGenerationConfig,
  prompt: string,
): Effect.Effect<string, TextGenerationError> {
  return Effect.tryPromise({
    try: (signal) => runAcpInternal(config, prompt, signal),
    catch: (cause) =>
      normalizeCliError(
        config.cliName,
        config.operation,
        cause,
        `${config.cliName} ACP text generation failed`,
      ),
  });
}

/**
 * Validate and decode the raw ACP response text against a schema.
 */
function decodeAcpResponse<S extends Schema.Top>(
  operation: string,
  cliName: string,
  raw: string,
  schema: S,
): Effect.Effect<S["Type"], TextGenerationError, S["DecodingServices"]> {
  const jsonStr = extractJsonFromText(raw);
  return Schema.decodeEffect(Schema.fromJsonString(schema))(jsonStr).pipe(
    Effect.catchTag("SchemaError", (cause) =>
      Effect.fail(
        new TextGenerationError({
          operation,
          detail: `${cliName} returned invalid structured output.`,
          cause,
        }),
      ),
    ),
  );
}

// ---------------------------------------------------------------------------
// Layer factory – builds a TextGenerationShape from a config resolver
// ---------------------------------------------------------------------------

type AcpProviderKey = "gemini" | "opencode";
type ProviderSettingsFor<K extends AcpProviderKey> = K extends "gemini"
  ? GeminiSettings
  : OpencodeSettings;

export interface AcpProviderLayerConfig<K extends AcpProviderKey> {
  /** Provider name used in Effect span names (e.g. "GeminiTextGeneration"). */
  readonly providerName: string;
  /** The expected `provider` discriminator on ModelSelection. */
  readonly providerKey: K;
  /** Default CLI binary name (e.g. "gemini", "opencode"). */
  readonly defaultBinaryName: string;
  /** CLI arguments to start ACP mode. */
  readonly makeArgs: (model: string) => readonly string[];
  /** Whether the model slug is sent in the ACP `session/new` params
   *  (true for OpenCode) or via CLI args (false for Gemini). */
  readonly modelInSessionNew: boolean;
  /** Build extra env vars from the provider's settings block. */
  readonly makeEnv: (settings: ProviderSettingsFor<K> | undefined) => Record<string, string>;
  /** Overall timeout in milliseconds. */
  readonly timeoutMs: number;
}

/**
 * Create a full `TextGenerationShape` Effect backed by ACP text generation.
 * Eliminates duplication between Gemini and OpenCode layers.
 */
export function makeAcpTextGenerationLayer<K extends AcpProviderKey>(
  layerConfig: AcpProviderLayerConfig<K>,
) {
  const { providerName, providerKey, defaultBinaryName, makeArgs, modelInSessionNew, makeEnv } =
    layerConfig;

  const make = Effect.gen(function* () {
    const serverSettingsService = yield* Effect.service(ServerSettingsService);

    /** Resolve an AcpTextGenerationConfig from current server settings. */
    const resolveConfig = (operation: string, cwd: string, modelSelection: ModelSelection) =>
      Effect.gen(function* () {
        const providerSettings = yield* Effect.map(
          serverSettingsService.getSettings,
          (s) => s.providers[providerKey] as ProviderSettingsFor<K>,
        ).pipe(Effect.catch(() => Effect.undefined));

        return {
          cliName: providerKey,
          binaryPath: providerSettings?.binaryPath || defaultBinaryName,
          args: makeArgs(modelSelection.model),
          model: modelInSessionNew ? modelSelection.model : undefined,
          cwd,
          env: makeEnv(providerSettings),
          timeoutMs: layerConfig.timeoutMs,
          operation,
        } satisfies AcpTextGenerationConfig;
      });
    const generateCommitMessage: TextGenerationShape["generateCommitMessage"] = Effect.fn(
      `${providerName}.generateCommitMessage`,
    )(function* (input) {
      if (input.modelSelection.provider !== providerKey) {
        return yield* new TextGenerationError({
          operation: "generateCommitMessage",
          detail: "Invalid model selection.",
        });
      }

      const { prompt, outputSchema } = buildCommitMessagePrompt({
        branch: input.branch,
        stagedSummary: input.stagedSummary,
        stagedPatch: input.stagedPatch,
        includeBranch: input.includeBranch === true,
      });

      const config = yield* resolveConfig("generateCommitMessage", input.cwd, input.modelSelection);
      const raw = yield* runAcpTextGeneration(config, JSON_PREAMBLE + prompt);
      const generated = yield* decodeAcpResponse(
        "generateCommitMessage",
        providerKey,
        raw,
        outputSchema,
      );

      return {
        subject: sanitizeCommitSubject(generated.subject),
        body: generated.body.trim(),
        ...("branch" in generated && typeof generated.branch === "string"
          ? { branch: sanitizeFeatureBranchName(generated.branch) }
          : {}),
      };
    });

    const generatePrContent: TextGenerationShape["generatePrContent"] = Effect.fn(
      `${providerName}.generatePrContent`,
    )(function* (input) {
      if (input.modelSelection.provider !== providerKey) {
        return yield* new TextGenerationError({
          operation: "generatePrContent",
          detail: "Invalid model selection.",
        });
      }

      const { prompt, outputSchema } = buildPrContentPrompt({
        baseBranch: input.baseBranch,
        headBranch: input.headBranch,
        commitSummary: input.commitSummary,
        diffSummary: input.diffSummary,
        diffPatch: input.diffPatch,
      });

      const config = yield* resolveConfig("generatePrContent", input.cwd, input.modelSelection);
      const raw = yield* runAcpTextGeneration(config, JSON_PREAMBLE + prompt);
      const generated = yield* decodeAcpResponse(
        "generatePrContent",
        providerKey,
        raw,
        outputSchema,
      );

      return {
        title: sanitizePrTitle(generated.title),
        body: generated.body.trim(),
      };
    });

    const generateBranchName: TextGenerationShape["generateBranchName"] = Effect.fn(
      `${providerName}.generateBranchName`,
    )(function* (input) {
      if (input.modelSelection.provider !== providerKey) {
        return yield* new TextGenerationError({
          operation: "generateBranchName",
          detail: "Invalid model selection.",
        });
      }

      const { prompt, outputSchema } = buildBranchNamePrompt({
        message: input.message,
        attachments: input.attachments,
      });

      const config = yield* resolveConfig("generateBranchName", input.cwd, input.modelSelection);
      const raw = yield* runAcpTextGeneration(config, JSON_PREAMBLE + prompt);
      const generated = yield* decodeAcpResponse(
        "generateBranchName",
        providerKey,
        raw,
        outputSchema,
      );

      return {
        branch: sanitizeBranchFragment(generated.branch),
      };
    });

    const generateThreadTitle: TextGenerationShape["generateThreadTitle"] = Effect.fn(
      `${providerName}.generateThreadTitle`,
    )(function* (input) {
      if (input.modelSelection.provider !== providerKey) {
        return yield* new TextGenerationError({
          operation: "generateThreadTitle",
          detail: "Invalid model selection.",
        });
      }

      const { prompt, outputSchema } = buildThreadTitlePrompt({
        message: input.message,
        attachments: input.attachments,
      });

      const config = yield* resolveConfig("generateThreadTitle", input.cwd, input.modelSelection);
      const raw = yield* runAcpTextGeneration(config, JSON_PREAMBLE + prompt);
      const generated = yield* decodeAcpResponse(
        "generateThreadTitle",
        providerKey,
        raw,
        outputSchema,
      );

      return {
        title: sanitizeThreadTitle(generated.title),
      };
    });

    return {
      generateCommitMessage,
      generatePrContent,
      generateBranchName,
      generateThreadTitle,
    } satisfies TextGenerationShape;
  });

  return Layer.effect(TextGeneration, make);
}

// ---------------------------------------------------------------------------
// Internal ACP client
// ---------------------------------------------------------------------------

async function runAcpInternal(
  config: AcpTextGenerationConfig,
  prompt: string,
  signal: AbortSignal,
): Promise<string> {
  let child: ChildProcessWithoutNullStreams | undefined;
  let output: readline.Interface | undefined;
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  const pending = new Map<
    string,
    { resolve: (value: unknown) => void; reject: (error: Error) => void }
  >();
  let nextId = 1;
  let collectedText = "";
  let settled = false;

  function cleanup() {
    if (timeoutHandle) clearTimeout(timeoutHandle);
    output?.close();
    if (child && !child.killed) {
      child.stdin.end();
      child.kill();
    }
    // Reject any outstanding requests so they don't leak.
    for (const [, req] of pending) {
      req.reject(new Error("ACP session terminated"));
    }
    pending.clear();
  }

  return new Promise<string>((resolve, reject) => {
    const settle = (err?: Error) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (err) reject(err);
      else resolve(collectedText);
    };

    // Abort from Effect timeout
    signal.addEventListener("abort", () => settle(new Error("Aborted")), { once: true });

    // Timeout
    timeoutHandle = setTimeout(
      () => settle(new Error(`${config.cliName} ACP request timed out`)),
      config.timeoutMs,
    );

    // Spawn
    try {
      child = spawn(config.binaryPath, config.args as string[], {
        cwd: config.cwd,
        env: { ...process.env, ...config.env },
        stdio: ["pipe", "pipe", "pipe"],
        shell: process.platform === "win32",
      });
    } catch (err) {
      return settle(err instanceof Error ? err : new Error(`Failed to spawn ${config.cliName}`));
    }

    child.on("error", (err) => settle(err));
    child.on("exit", (code) => {
      if (!settled && code !== 0) {
        settle(new Error(`${config.cliName} ACP process exited with code ${code}`));
      }
    });

    // ndjson reader
    output = readline.createInterface({ input: child.stdout });
    let stderrChunks = "";
    child.stderr.on("data", (chunk: Buffer) => {
      stderrChunks += chunk.toString();
    });

    output.on("line", (line: string) => {
      let msg: Record<string, unknown>;
      try {
        msg = JSON.parse(line) as Record<string, unknown>;
      } catch {
        return; // skip non-JSON lines
      }

      // Response to a request
      if (msg.id && pending.has(String(msg.id))) {
        const req = pending.get(String(msg.id))!;
        pending.delete(String(msg.id));
        if (msg.error) {
          const errObj = msg.error as Record<string, unknown>;
          req.reject(new Error(String(errObj.message ?? "ACP error")));
        } else {
          req.resolve(msg.result);
        }
        return;
      }

      // Notification: session/update
      if (msg.method === "session/update") {
        const params = msg.params as Record<string, unknown> | undefined;
        const update = params?.update as Record<string, unknown> | undefined;
        if (update?.sessionUpdate === "agent_message_chunk") {
          const content = update.content as Record<string, unknown> | undefined;
          const text = typeof content?.text === "string" ? content.text : "";
          collectedText += text;
        }
      }
    });

    // Helper: send a JSON-RPC request and await the response
    function send(method: string, params: unknown): Promise<unknown> {
      return new Promise((res, rej) => {
        const id = String(nextId++);
        pending.set(id, { resolve: res, reject: rej });
        const request: JsonRpcRequest = { jsonrpc: "2.0", id, method, params };
        child!.stdin.write(JSON.stringify(request) + "\n");
      });
    }

    // Protocol flow
    void (async () => {
      try {
        // 1. Initialize
        await send("initialize", { protocolVersion: 1 });

        // 2. New session
        const sessionResult = (await send("session/new", {
          cwd: config.cwd,
          ...(config.model ? { model: config.model } : {}),
          mcpServers: [],
        })) as Record<string, unknown> | null;

        const sessionId =
          typeof sessionResult?.sessionId === "string" ? sessionResult.sessionId : undefined;

        // 3. Send prompt (long-running – text arrives via notifications)
        await send("session/prompt", {
          sessionId,
          prompt: [{ type: "text", text: prompt }],
        });

        // 4. Done
        settle();
      } catch (err) {
        const errorDetail =
          stderrChunks.trim().length > 0
            ? stderrChunks.trim()
            : err instanceof Error
              ? err.message
              : String(err);
        settle(new Error(errorDetail));
      }
    })();
  });
}
