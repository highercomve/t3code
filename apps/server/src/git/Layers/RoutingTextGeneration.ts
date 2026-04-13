/**
 * RoutingTextGeneration – Dispatches text generation requests to the
 * appropriate CLI implementation based on the provider in each request input.
 *
 * - `"codex"` → Codex CLI (`codex exec`)
 * - `"claudeAgent"` → Claude CLI (`claude -p --json-schema`)
 * - `"gemini"` → Gemini CLI (`gemini --experimental-acp`)
 * - `"opencode"` → OpenCode CLI (`opencode acp`)
 *
 * @module RoutingTextGeneration
 */
import { Effect, Layer, Context } from "effect";

import {
  type TextGenerationProvider,
  type TextGenerationShape,
  TextGeneration,
} from "../Services/TextGeneration.ts";
import { CodexTextGenerationLive } from "./CodexTextGeneration.ts";
import { ClaudeTextGenerationLive } from "./ClaudeTextGeneration.ts";
import { GeminiTextGenerationLive } from "./GeminiTextGeneration.ts";
import { OpencodeTextGenerationLive } from "./OpencodeTextGeneration.ts";

// ---------------------------------------------------------------------------
// Internal service tags so all concrete layers can coexist.
// ---------------------------------------------------------------------------

class CodexTextGen extends Context.Service<CodexTextGen, TextGenerationShape>()(
  "t3/git/Layers/RoutingTextGeneration/CodexTextGen",
) {}

class ClaudeTextGen extends Context.Service<ClaudeTextGen, TextGenerationShape>()(
  "t3/git/Layers/RoutingTextGeneration/ClaudeTextGen",
) {}

class GeminiTextGen extends Context.Service<GeminiTextGen, TextGenerationShape>()(
  "t3/git/Layers/RoutingTextGeneration/GeminiTextGen",
) {}

class OpencodeTextGen extends Context.Service<OpencodeTextGen, TextGenerationShape>()(
  "t3/git/Layers/RoutingTextGeneration/OpencodeTextGen",
) {}

// ---------------------------------------------------------------------------
// Routing implementation
// ---------------------------------------------------------------------------

const makeRoutingTextGeneration = Effect.gen(function* () {
  const codex = yield* CodexTextGen;
  const claude = yield* ClaudeTextGen;
  const gemini = yield* GeminiTextGen;
  const opencode = yield* OpencodeTextGen;

  const route = (provider?: TextGenerationProvider): TextGenerationShape => {
    switch (provider) {
      case "claudeAgent":
        return claude;
      case "gemini":
        return gemini;
      case "opencode":
        return opencode;
      default:
        return codex;
    }
  };

  return {
    generateCommitMessage: (input) =>
      route(input.modelSelection.provider).generateCommitMessage(input),
    generatePrContent: (input) => route(input.modelSelection.provider).generatePrContent(input),
    generateBranchName: (input) => route(input.modelSelection.provider).generateBranchName(input),
    generateThreadTitle: (input) => route(input.modelSelection.provider).generateThreadTitle(input),
  } satisfies TextGenerationShape;
});

const InternalCodexLayer = Layer.effect(
  CodexTextGen,
  Effect.gen(function* () {
    const svc = yield* TextGeneration;
    return svc;
  }),
).pipe(Layer.provide(CodexTextGenerationLive));

const InternalClaudeLayer = Layer.effect(
  ClaudeTextGen,
  Effect.gen(function* () {
    const svc = yield* TextGeneration;
    return svc;
  }),
).pipe(Layer.provide(ClaudeTextGenerationLive));

const InternalGeminiLayer = Layer.effect(
  GeminiTextGen,
  Effect.gen(function* () {
    const svc = yield* TextGeneration;
    return svc;
  }),
).pipe(Layer.provide(GeminiTextGenerationLive));

const InternalOpencodeLayer = Layer.effect(
  OpencodeTextGen,
  Effect.gen(function* () {
    const svc = yield* TextGeneration;
    return svc;
  }),
).pipe(Layer.provide(OpencodeTextGenerationLive));

export const RoutingTextGenerationLive = Layer.effect(
  TextGeneration,
  makeRoutingTextGeneration,
).pipe(
  Layer.provide(InternalCodexLayer),
  Layer.provide(InternalClaudeLayer),
  Layer.provide(InternalGeminiLayer),
  Layer.provide(InternalOpencodeLayer),
);
