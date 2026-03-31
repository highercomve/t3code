/**
 * GeminiTextGeneration – Text generation layer using the Gemini CLI.
 *
 * Delegates to the `gemini` CLI in ACP mode
 * (`gemini --experimental-acp --model <model>`). The model is passed via
 * CLI args; structured output is extracted from the free-text response.
 *
 * @module GeminiTextGeneration
 */
import type { GeminiSettings } from "@t3tools/contracts";
import { makeAcpTextGenerationLayer } from "./AcpTextGeneration.ts";

export const GeminiTextGenerationLive = makeAcpTextGenerationLayer({
  providerName: "GeminiTextGeneration",
  providerKey: "gemini",
  defaultBinaryName: "gemini",
  makeArgs: (model) => ["--experimental-acp", "--model", model],
  modelInSessionNew: false,
  makeEnv: (settings: GeminiSettings | undefined) => ({
    ...(settings?.homePath ? { GEMINI_HOME: settings.homePath } : {}),
  }),
  timeoutMs: 180_000,
});
