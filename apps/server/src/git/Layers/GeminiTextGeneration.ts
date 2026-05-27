/**
 * Phase 2 stub — kept only so `RoutingTextGeneration.ts` can route `antigravity`
 * to this layer until Phase 3 lands the real `AntigravityTextGeneration`.
 *
 * TODO(phase-3): replace with `AntigravityTextGenerationLive` and delete this
 * file. The orchestrator will `git rm` it after Phase 3 commits.
 */
import { TextGenerationError } from "@t3tools/contracts";
import { Effect, Layer } from "effect";

import { TextGeneration, type TextGenerationShape } from "../Services/TextGeneration.ts";

const fail = <T>(operation: string): Effect.Effect<T, TextGenerationError> =>
  Effect.fail(
    new TextGenerationError({
      operation,
      detail: `Antigravity text generation (${operation}) is not yet wired in Phase 2; landing in Phase 3.`,
    }),
  );

export const GeminiTextGenerationLive = Layer.succeed(TextGeneration, {
  generateCommitMessage: () => fail("generateCommitMessage"),
  generatePrContent: () => fail("generatePrContent"),
  generateBranchName: () => fail("generateBranchName"),
  generateThreadTitle: () => fail("generateThreadTitle"),
} satisfies TextGenerationShape);
