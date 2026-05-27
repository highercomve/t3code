/**
 * AntigravityAdapter - Antigravity (`agy`) implementation of the provider
 * adapter contract. Uses a one-shot CLI driver instead of ACP.
 */
import { Context } from "effect";

import type { ProviderAdapterError } from "../Errors.ts";
import type { ProviderAdapterShape } from "./ProviderAdapter.ts";

export interface AntigravityAdapterShape extends ProviderAdapterShape<ProviderAdapterError> {
  readonly provider: "antigravity";
}

export class AntigravityAdapter extends Context.Service<
  AntigravityAdapter,
  AntigravityAdapterShape
>()("t3/provider/Services/AntigravityAdapter") {}
