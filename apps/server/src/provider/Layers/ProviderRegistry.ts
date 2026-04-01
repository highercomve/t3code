/**
 * ProviderRegistryLive - Aggregates provider-specific snapshot services.
 *
 * @module ProviderRegistryLive
 */
import type { ProviderKind, ServerProvider } from "@t3tools/contracts";
import { Effect, Equal, Layer, PubSub, Ref, Stream } from "effect";

import { ClaudeProviderLive } from "./ClaudeProvider";
import { CodexProviderLive } from "./CodexProvider";
import { CopilotProviderLive } from "./CopilotProvider";
import { GeminiProviderLive } from "./GeminiProvider";
import { OpencodeProviderLive } from "./OpencodeProvider";
import type { ClaudeProviderShape } from "../Services/ClaudeProvider";
import { ClaudeProvider } from "../Services/ClaudeProvider";
import type { CodexProviderShape } from "../Services/CodexProvider";
import { CodexProvider } from "../Services/CodexProvider";
import type { CopilotProviderShape } from "../Services/CopilotProvider";
import { CopilotProvider } from "../Services/CopilotProvider";
import type { GeminiProviderShape } from "../Services/GeminiProvider";
import { GeminiProvider } from "../Services/GeminiProvider";
import type { OpencodeProviderShape } from "../Services/OpencodeProvider";
import { OpencodeProvider } from "../Services/OpencodeProvider";
import { ProviderRegistry, type ProviderRegistryShape } from "../Services/ProviderRegistry";

const loadProviders = (
  codexProvider: CodexProviderShape,
  claudeProvider: ClaudeProviderShape,
  copilotProvider: CopilotProviderShape,
  geminiProvider: GeminiProviderShape,
  opencodeProvider: OpencodeProviderShape,
): Effect.Effect<
  readonly [ServerProvider, ServerProvider, ServerProvider, ServerProvider, ServerProvider]
> =>
  Effect.all(
    [
      codexProvider.getSnapshot,
      claudeProvider.getSnapshot,
      copilotProvider.getSnapshot,
      geminiProvider.getSnapshot,
      opencodeProvider.getSnapshot,
    ],
    {
      concurrency: "unbounded",
    },
  );

export const haveProvidersChanged = (
  previousProviders: ReadonlyArray<ServerProvider>,
  nextProviders: ReadonlyArray<ServerProvider>,
): boolean => !Equal.equals(previousProviders, nextProviders);

export const ProviderRegistryLive = Layer.effect(
  ProviderRegistry,
  Effect.gen(function* () {
    const codexProvider = yield* CodexProvider;
    const claudeProvider = yield* ClaudeProvider;
    const copilotProvider = yield* CopilotProvider;
    const geminiProvider = yield* GeminiProvider;
    const opencodeProvider = yield* OpencodeProvider;
    const changesPubSub = yield* Effect.acquireRelease(
      PubSub.unbounded<ReadonlyArray<ServerProvider>>(),
      PubSub.shutdown,
    );
    const providersRef = yield* Ref.make<ReadonlyArray<ServerProvider>>(
      yield* loadProviders(
        codexProvider,
        claudeProvider,
        copilotProvider,
        geminiProvider,
        opencodeProvider,
      ),
    );

    const syncProviders = (options?: { readonly publish?: boolean }) =>
      Effect.gen(function* () {
        const previousProviders = yield* Ref.get(providersRef);
        const providers = yield* loadProviders(
          codexProvider,
          claudeProvider,
          copilotProvider,
          geminiProvider,
          opencodeProvider,
        );
        yield* Ref.set(providersRef, providers);

        if (options?.publish !== false && haveProvidersChanged(previousProviders, providers)) {
          yield* PubSub.publish(changesPubSub, providers);
        }

        return providers;
      });

    yield* Stream.runForEach(codexProvider.streamChanges, () => syncProviders()).pipe(
      Effect.forkScoped,
    );
    yield* Stream.runForEach(claudeProvider.streamChanges, () => syncProviders()).pipe(
      Effect.forkScoped,
    );
    yield* Stream.runForEach(copilotProvider.streamChanges, () => syncProviders()).pipe(
      Effect.forkScoped,
    );
    yield* Stream.runForEach(geminiProvider.streamChanges, () => syncProviders()).pipe(
      Effect.forkScoped,
    );
    yield* Stream.runForEach(opencodeProvider.streamChanges, () => syncProviders()).pipe(
      Effect.forkScoped,
    );

    return {
      getProviders: syncProviders({ publish: false }).pipe(
        Effect.tapError(Effect.logError),
        Effect.orElseSucceed(() => []),
      ),
      refresh: (provider?: ProviderKind) =>
        Effect.gen(function* () {
          switch (provider) {
            case "codex":
              yield* codexProvider.refresh;
              break;
            case "claudeAgent":
              yield* claudeProvider.refresh;
              break;
            case "copilotAgent":
              yield* copilotProvider.refresh;
              break;
            case "gemini":
              yield* geminiProvider.refresh;
              break;
            case "opencode":
              yield* opencodeProvider.refresh;
              break;
            default:
              yield* Effect.all(
                [
                  codexProvider.refresh,
                  claudeProvider.refresh,
                  copilotProvider.refresh,
                  geminiProvider.refresh,
                  opencodeProvider.refresh,
                ],
                {
                  concurrency: "unbounded",
                },
              );
              break;
          }
          return yield* syncProviders();
        }).pipe(
          Effect.tapError(Effect.logError),
          Effect.orElseSucceed(() => []),
        ),
      get streamChanges() {
        return Stream.fromPubSub(changesPubSub);
      },
    } satisfies ProviderRegistryShape;
  }),
).pipe(
  Layer.provideMerge(CodexProviderLive),
  Layer.provideMerge(ClaudeProviderLive),
  Layer.provideMerge(CopilotProviderLive),
  Layer.provideMerge(GeminiProviderLive),
  Layer.provideMerge(OpencodeProviderLive),
);
