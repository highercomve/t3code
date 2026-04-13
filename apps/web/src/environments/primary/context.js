import { attachEnvironmentDescriptor, createKnownEnvironment } from "@t3tools/client-runtime";
import { create } from "zustand";
import { BootstrapHttpError, retryTransientBootstrap } from "./auth";
import { readPrimaryEnvironmentTarget, resolvePrimaryEnvironmentHttpUrl } from "./target";
const SERVER_ENVIRONMENT_DESCRIPTOR_PATH = "/.well-known/t3/environment";
const usePrimaryEnvironmentBootstrapStore = create()((set) => ({
  descriptor: null,
  setDescriptor: (descriptor) => set({ descriptor }),
  reset: () => set({ descriptor: null }),
}));
let primaryEnvironmentDescriptorPromise = null;
function createPrimaryKnownEnvironment(input) {
  const descriptor = readPrimaryEnvironmentDescriptor();
  if (!descriptor) {
    return null;
  }
  return attachEnvironmentDescriptor(
    createKnownEnvironment({
      id: descriptor.environmentId,
      label: descriptor.label,
      source: input.source,
      target: input.target,
    }),
    descriptor,
  );
}
async function fetchPrimaryEnvironmentDescriptor() {
  return retryTransientBootstrap(async () => {
    const response = await fetch(
      resolvePrimaryEnvironmentHttpUrl(SERVER_ENVIRONMENT_DESCRIPTOR_PATH),
    );
    if (!response.ok) {
      throw new BootstrapHttpError({
        message: `Failed to load server environment descriptor (${response.status}).`,
        status: response.status,
      });
    }
    const descriptor = await response.json();
    writePrimaryEnvironmentDescriptor(descriptor);
    return descriptor;
  });
}
export function readPrimaryEnvironmentDescriptor() {
  return usePrimaryEnvironmentBootstrapStore.getState().descriptor;
}
export function usePrimaryEnvironmentId() {
  return usePrimaryEnvironmentBootstrapStore((state) => state.descriptor?.environmentId ?? null);
}
export function writePrimaryEnvironmentDescriptor(descriptor) {
  usePrimaryEnvironmentBootstrapStore.getState().setDescriptor(descriptor);
}
export function getPrimaryKnownEnvironment() {
  const primaryTarget = readPrimaryEnvironmentTarget();
  if (!primaryTarget) {
    return null;
  }
  return createPrimaryKnownEnvironment({
    source: primaryTarget.source,
    target: primaryTarget.target,
  });
}
export function resolveInitialPrimaryEnvironmentDescriptor() {
  const descriptor = readPrimaryEnvironmentDescriptor();
  if (descriptor) {
    return Promise.resolve(descriptor);
  }
  if (primaryEnvironmentDescriptorPromise) {
    return primaryEnvironmentDescriptorPromise;
  }
  const nextPromise = fetchPrimaryEnvironmentDescriptor();
  primaryEnvironmentDescriptorPromise = nextPromise;
  return nextPromise.finally(() => {
    if (primaryEnvironmentDescriptorPromise === nextPromise) {
      primaryEnvironmentDescriptorPromise = null;
    }
  });
}
export function __resetPrimaryEnvironmentBootstrapForTests() {
  primaryEnvironmentDescriptorPromise = null;
  usePrimaryEnvironmentBootstrapStore.getState().reset();
}
export const resetPrimaryEnvironmentDescriptorForTests = __resetPrimaryEnvironmentBootstrapForTests;
export const __resetPrimaryEnvironmentDescriptorBootstrapForTests =
  __resetPrimaryEnvironmentBootstrapForTests;
