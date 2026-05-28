/**
 * CopilotTextGeneration — placeholder text generation for the Copilot driver.
 *
 * All four operations currently fail with `TextGenerationError` so that
 * routing-layer fallbacks (e.g. Codex/Antigravity) take over when a user
 * selects Copilot as their git text-generation provider. A full Copilot
 * implementation can drive the same `copilot acp` runtime used by the
 * adapter once that lands.
 *
 * @module CopilotTextGeneration
 */
import * as Effect from "effect/Effect";

import { type CopilotSettings, TextGenerationError } from "@t3tools/contracts";

import type { TextGenerationShape } from "./TextGeneration.ts";

const fail = (operation: Parameters<typeof TextGenerationError.make>[0]["operation"]) =>
  Effect.fail(
    new TextGenerationError({
      operation,
      detail:
        "Copilot text generation is not yet wired in this build. Pick another provider for commit/PR/branch/title generation.",
    }),
  );

export const makeCopilotTextGeneration = Effect.fn("makeCopilotTextGeneration")(function* (
  _copilotSettings: CopilotSettings,
  _environment: NodeJS.ProcessEnv = process.env,
) {
  const generateCommitMessage: TextGenerationShape["generateCommitMessage"] = (_input) =>
    fail("generateCommitMessage");

  const generatePrContent: TextGenerationShape["generatePrContent"] = (_input) =>
    fail("generatePrContent");

  const generateBranchName: TextGenerationShape["generateBranchName"] = (_input) =>
    fail("generateBranchName");

  const generateThreadTitle: TextGenerationShape["generateThreadTitle"] = (_input) =>
    fail("generateThreadTitle");

  return {
    generateCommitMessage,
    generatePrContent,
    generateBranchName,
    generateThreadTitle,
  } satisfies TextGenerationShape;
});
