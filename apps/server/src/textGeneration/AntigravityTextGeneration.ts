/**
 * AntigravityTextGeneration – Text generation factory using the Antigravity CLI.
 *
 * Spawns `agy --print "<prompt>"` once per request, accumulates the
 * line-buffered stdout into a single string, and decodes it as JSON against
 * the per-operation output schema. No ACP. Conversation-less by design — see
 * the inline note on `conversationId: null`.
 *
 * @module AntigravityTextGeneration
 */
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { type AntigravitySettings, TextGenerationError, type ModelSelection } from "@t3tools/contracts";
import { sanitizeBranchFragment, sanitizeFeatureBranchName } from "@t3tools/shared/git";

import { type TextGenerationShape } from "./TextGeneration.ts";
import {
  buildBranchNamePrompt,
  buildCommitMessagePrompt,
  buildPrContentPrompt,
  buildThreadTitlePrompt,
} from "./TextGenerationPrompts.ts";
import {
  normalizeCliError,
  sanitizeCommitSubject,
  sanitizePrTitle,
  sanitizeThreadTitle,
} from "./TextGenerationUtils.ts";
import { runAntigravityTurn, type AntigravityStreamEvent } from "../antigravityDriver.ts";

const ANTIGRAVITY_TIMEOUT_MS = 60_000;

const JSON_PREAMBLE = [
  "CRITICAL: You must respond with ONLY a valid JSON object.",
  "No markdown code fences, no explanation, no additional text before or after the JSON.",
  "Just the raw JSON object.",
  "",
].join("\n");

/**
 * Extracts JSON object/array text from a model response that may contain
 * surrounding prose, code fences, or trailing whitespace. Returns the original
 * string when no JSON can be located.
 */
function extractJsonFromText(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  // Strip ```json ... ``` fences
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch && typeof fenceMatch[1] === "string") {
    return fenceMatch[1].trim();
  }
  // Find first {…} or […] balanced span
  const firstBrace = trimmed.search(/[{[]/);
  if (firstBrace === -1) return trimmed;
  const lastBrace = Math.max(trimmed.lastIndexOf("}"), trimmed.lastIndexOf("]"));
  if (lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }
  return trimmed;
}

export const makeAntigravityTextGeneration = Effect.fn("makeAntigravityTextGeneration")(function* (
  antigravitySettings: AntigravitySettings,
  _environment: NodeJS.ProcessEnv = process.env,
) {
  const binaryPath = antigravitySettings.binaryPath || "agy";

  const runAntigravityJson = Effect.fn("runAntigravityJson")(function* <S extends Schema.Top>({
    operation,
    cwd,
    prompt,
    outputSchemaJson,
    modelSelection,
  }: {
    operation:
      | "generateCommitMessage"
      | "generatePrContent"
      | "generateBranchName"
      | "generateThreadTitle";
    cwd: string;
    prompt: string;
    outputSchemaJson: S;
    modelSelection: ModelSelection;
  }): Effect.fn.Return<S["Type"], TextGenerationError, S["DecodingServices"]> {
    const collected: string[] = [];
    const onStreamEvent = (event: AntigravityStreamEvent): Effect.Effect<void> =>
      Effect.sync(() => {
        collected.push(event.text);
      });

    const result = yield* runAntigravityTurn(
      {
        binaryPath,
        cwd,
        // agy has no --model flag; this value is informational only and the
        // driver does NOT forward it.
        model: modelSelection.model,
        prompt: JSON_PREAMBLE + prompt,
        // Text generation is single-shot per request — must NOT share the user's chat thread conversation.
        conversationId: null,
        dangerouslySkipPermissions: true,
        timeoutMs: ANTIGRAVITY_TIMEOUT_MS,
      },
      onStreamEvent,
    ).pipe(
      Effect.mapError((cause) =>
        normalizeCliError("antigravity", operation, cause, "Antigravity CLI command failed"),
      ),
    );

    if (result.state !== "completed") {
      const detail =
        result.errorMessage ?? `Antigravity CLI command failed (state: ${result.state}).`;
      return yield* new TextGenerationError({
        operation,
        detail,
      });
    }

    const rawStdout = collected.join("\n");
    const jsonStr = extractJsonFromText(rawStdout);

    return yield* Schema.decodeEffect(Schema.fromJsonString(outputSchemaJson))(jsonStr).pipe(
      Effect.catchTag("SchemaError", (cause) =>
        Effect.fail(
          new TextGenerationError({
            operation,
            detail: "Antigravity returned invalid structured output.",
            cause,
          }),
        ),
      ),
    );
  });

  const generateCommitMessage: TextGenerationShape["generateCommitMessage"] = Effect.fn(
    "AntigravityTextGeneration.generateCommitMessage",
  )(function* (input) {
    const { prompt, outputSchema } = buildCommitMessagePrompt({
      branch: input.branch,
      stagedSummary: input.stagedSummary,
      stagedPatch: input.stagedPatch,
      includeBranch: input.includeBranch === true,
    });

    const generated = yield* runAntigravityJson({
      operation: "generateCommitMessage",
      cwd: input.cwd,
      prompt,
      outputSchemaJson: outputSchema,
      modelSelection: input.modelSelection,
    });

    return {
      subject: sanitizeCommitSubject(generated.subject),
      body: generated.body.trim(),
      ...("branch" in generated && typeof generated.branch === "string"
        ? { branch: sanitizeFeatureBranchName(generated.branch) }
        : {}),
    };
  });

  const generatePrContent: TextGenerationShape["generatePrContent"] = Effect.fn(
    "AntigravityTextGeneration.generatePrContent",
  )(function* (input) {
    const { prompt, outputSchema } = buildPrContentPrompt({
      baseBranch: input.baseBranch,
      headBranch: input.headBranch,
      commitSummary: input.commitSummary,
      diffSummary: input.diffSummary,
      diffPatch: input.diffPatch,
    });

    const generated = yield* runAntigravityJson({
      operation: "generatePrContent",
      cwd: input.cwd,
      prompt,
      outputSchemaJson: outputSchema,
      modelSelection: input.modelSelection,
    });

    return {
      title: sanitizePrTitle(generated.title),
      body: generated.body.trim(),
    };
  });

  const generateBranchName: TextGenerationShape["generateBranchName"] = Effect.fn(
    "AntigravityTextGeneration.generateBranchName",
  )(function* (input) {
    const { prompt, outputSchema } = buildBranchNamePrompt({
      message: input.message,
      attachments: input.attachments,
    });

    const generated = yield* runAntigravityJson({
      operation: "generateBranchName",
      cwd: input.cwd,
      prompt,
      outputSchemaJson: outputSchema,
      modelSelection: input.modelSelection,
    });

    return {
      branch: sanitizeBranchFragment(generated.branch),
    };
  });

  const generateThreadTitle: TextGenerationShape["generateThreadTitle"] = Effect.fn(
    "AntigravityTextGeneration.generateThreadTitle",
  )(function* (input) {
    const { prompt, outputSchema } = buildThreadTitlePrompt({
      message: input.message,
      attachments: input.attachments,
    });

    const generated = yield* runAntigravityJson({
      operation: "generateThreadTitle",
      cwd: input.cwd,
      prompt,
      outputSchemaJson: outputSchema,
      modelSelection: input.modelSelection,
    });

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
