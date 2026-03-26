/**
 * ProviderDynamicModels - Simple module-level store for dynamically discovered
 * provider models (e.g. from OpenCode ACP session/new response).
 *
 * This avoids complex Effect Service layer wiring while still allowing
 * the OpenCode manager (class-based) to publish model lists and the
 * wsServer (Effect-based) to read and subscribe to changes.
 */
import type { ProviderKind } from "@t3tools/contracts";

export interface DynamicModel {
  readonly id: string;
  readonly name: string;
}

type Listener = () => void;

const modelsByProvider = new Map<ProviderKind, ReadonlyArray<DynamicModel>>();
const listeners = new Set<Listener>();

/**
 * Store dynamic models for a provider, replacing any previous list.
 * Notifies all subscribers.
 */
export function setProviderDynamicModels(
  provider: ProviderKind,
  models: ReadonlyArray<DynamicModel>,
): void {
  const existing = modelsByProvider.get(provider);
  // Skip no-op updates
  if (
    existing &&
    existing.length === models.length &&
    existing.every((m, i) => m.id === models[i]?.id)
  ) {
    return;
  }
  modelsByProvider.set(provider, models);
  for (const listener of listeners) {
    try {
      listener();
    } catch {
      // Listeners should not throw, but be defensive
    }
  }
}

/**
 * Get the dynamic models for a provider, or undefined if none discovered yet.
 */
export function getProviderDynamicModels(
  provider: ProviderKind,
): ReadonlyArray<DynamicModel> | undefined {
  return modelsByProvider.get(provider);
}

/**
 * Subscribe to any dynamic model changes. Returns unsubscribe function.
 */
export function onDynamicModelsChanged(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
