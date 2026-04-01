/**
 * CopilotAdapter - Copilot implementation of the generic provider adapter contract.
 *
 * This service owns Copilot CLI process / JSON-RPC semantics and emits
 * Copilot provider events. It does not perform cross-provider routing, shared
 * event fan-out, or checkpoint orchestration.
 *
 * Uses Effect `ServiceMap.Service` for dependency injection and returns the
 * shared provider-adapter error channel with `provider: "copilotAgent"` context.
 *
 * @module CopilotAdapter
 */
import { ServiceMap } from "effect";

import type { ProviderAdapterError } from "../Errors.ts";
import type { ProviderAdapterShape } from "./ProviderAdapter.ts";

/**
 * CopilotAdapterShape - Service API for the Copilot provider adapter.
 */
export interface CopilotAdapterShape extends ProviderAdapterShape<ProviderAdapterError> {
  readonly provider: "copilotAgent";
}

/**
 * CopilotAdapter - Service tag for Copilot provider adapter operations.
 */
export class CopilotAdapter extends ServiceMap.Service<CopilotAdapter, CopilotAdapterShape>()(
  "t3/provider/Services/CopilotAdapter",
) {}
