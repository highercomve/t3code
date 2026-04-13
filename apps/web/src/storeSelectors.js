import { selectEnvironmentState } from "./store";
import { getThreadFromEnvironmentState } from "./threadDerivation";
export function createProjectSelectorByRef(ref) {
  return (state) =>
    ref ? selectEnvironmentState(state, ref.environmentId).projectById[ref.projectId] : undefined;
}
function createScopedThreadSelector(resolveRef) {
  let previousEnvironmentState;
  let previousThreadId;
  let previousThread;
  return (state) => {
    const ref = resolveRef(state);
    if (!ref) {
      return undefined;
    }
    const environmentState = selectEnvironmentState(state, ref.environmentId);
    if (
      previousThread &&
      previousEnvironmentState === environmentState &&
      previousThreadId === ref.threadId
    ) {
      return previousThread;
    }
    previousEnvironmentState = environmentState;
    previousThreadId = ref.threadId;
    previousThread = getThreadFromEnvironmentState(environmentState, ref.threadId);
    return previousThread;
  };
}
export function createThreadSelectorByRef(ref) {
  return createScopedThreadSelector(() => ref);
}
export function createThreadSelectorAcrossEnvironments(threadId) {
  return createScopedThreadSelector((state) => {
    if (!threadId) {
      return undefined;
    }
    for (const [environmentId, environmentState] of Object.entries(state.environmentStateById)) {
      if (environmentState.threadShellById[threadId]) {
        return {
          environmentId,
          threadId,
        };
      }
    }
    return undefined;
  });
}
