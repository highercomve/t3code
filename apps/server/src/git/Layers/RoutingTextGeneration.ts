/**
 * RoutingTextGeneration – Dispatches text generation requests to the
 * appropriate CLI implementation based on the provider in each request input.
 *
 * - `"codex"` → Codex CLI (`codex exec`)
 * - `"claudeAgent"` → Claude CLI (`claude -p --json-schema`)
 * - `"antigravity"` → Antigravity CLI (`agy --print`)
 * - `"opencode"` → OpenCode CLI (`opencode acp`)
 *
 * @module RoutingTextGeneration
 */
import { Effect, Layer, Context } from "effect";

import { TextGeneration, type TextGenerationShape } from "../Services/TextGeneration.ts";
import { CodexTextGenerationLive } from "./CodexTextGeneration.ts";
import { ClaudeTextGenerationLive } from "./ClaudeTextGeneration.ts";
import { AntigravityTextGenerationLive } from "./AntigravityTextGeneration.ts";
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

class AntigravityTextGen extends Context.Service<AntigravityTextGen, TextGenerationShape>()(
  "t3/git/Layers/RoutingTextGeneration/AntigravityTextGen",
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
  const antigravity = yield* AntigravityTextGen;
  const opencode = yield* OpencodeTextGen;

  const byProvider = {
    codex,
    claudeAgent: claude,
    antigravity,
    opencode,
    // copilotAgent does not yet have a dedicated text-generation backend; fall
    // back to claude for commit/PR/title text generation tasks.
    copilotAgent: claude,
  } as const;

  return {
    generateCommitMessage: (input) =>
      byProvider[input.modelSelection.provider].generateCommitMessage(input),
    generatePrContent: (input) =>
      byProvider[input.modelSelection.provider].generatePrContent(input),
    generateBranchName: (input) =>
      byProvider[input.modelSelection.provider].generateBranchName(input),
    generateThreadTitle: (input) =>
      byProvider[input.modelSelection.provider].generateThreadTitle(input),
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

const InternalAntigravityLayer = Layer.effect(
  AntigravityTextGen,
  Effect.gen(function* () {
    const svc = yield* TextGeneration;
    return svc;
  }),
).pipe(Layer.provide(AntigravityTextGenerationLive));

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
  Layer.provide(InternalAntigravityLayer),
  Layer.provide(InternalOpencodeLayer),
);
