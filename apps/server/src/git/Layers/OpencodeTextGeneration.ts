/**
 * OpencodeTextGeneration – Text generation layer using the OpenCode CLI.
 *
 * Delegates to the `opencode` CLI in ACP mode (`opencode acp`). The model
 * is passed via the ACP `session/new` request; structured output is
 * extracted from the free-text response.
 *
 * @module OpencodeTextGeneration
 */
import type { OpencodeSettings } from "@t3tools/contracts";
import { makeAcpTextGenerationLayer } from "./AcpTextGeneration.ts";

export const OpencodeTextGenerationLive = makeAcpTextGenerationLayer({
  providerName: "OpencodeTextGeneration",
  providerKey: "opencode",
  defaultBinaryName: "opencode",
  makeArgs: () => ["acp"],
  modelInSessionNew: true,
  makeEnv: (settings: OpencodeSettings | undefined) => ({
    ...(settings?.apiKey ? { OPENCODE_API_KEY: settings.apiKey } : {}),
  }),
  timeoutMs: 180_000,
});
