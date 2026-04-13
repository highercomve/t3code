import { useAtomValue } from "@effect/atom-react";
import { Atom } from "effect/unstable/reactivity";
import { useEffect } from "react";
import { appAtomRegistry } from "../rpc/atomRegistry";
import {
  readEnvironmentConnection,
  subscribeEnvironmentConnections,
} from "../environments/runtime";
const EMPTY_GIT_STATUS_STATE = Object.freeze({
  data: null,
  error: null,
  cause: null,
  isPending: false,
});
const INITIAL_GIT_STATUS_STATE = Object.freeze({
  ...EMPTY_GIT_STATUS_STATE,
  isPending: true,
});
const EMPTY_GIT_STATUS_ATOM = Atom.make(EMPTY_GIT_STATUS_STATE).pipe(
  Atom.keepAlive,
  Atom.withLabel("git-status:null"),
);
const NOOP = () => undefined;
const watchedGitStatuses = new Map();
const knownGitStatusKeys = new Set();
const gitStatusRefreshInFlight = new Map();
const gitStatusLastRefreshAtByKey = new Map();
const GIT_STATUS_REFRESH_DEBOUNCE_MS = 1_000;
const gitStatusStateAtom = Atom.family((key) => {
  knownGitStatusKeys.add(key);
  return Atom.make(INITIAL_GIT_STATUS_STATE).pipe(
    Atom.keepAlive,
    Atom.withLabel(`git-status:${key}`),
  );
});
function getGitStatusTargetKey(target) {
  if (target.environmentId === null || target.cwd === null) {
    return null;
  }
  return `${target.environmentId}:${target.cwd}`;
}
function readResolvedGitStatusClient(target) {
  if (target.environmentId === null) {
    return null;
  }
  const connection = readEnvironmentConnection(target.environmentId);
  return connection
    ? { clientIdentity: connection.environmentId, client: connection.client.git }
    : null;
}
export function getGitStatusSnapshot(target) {
  const targetKey = getGitStatusTargetKey(target);
  if (targetKey === null) {
    return EMPTY_GIT_STATUS_STATE;
  }
  return appAtomRegistry.get(gitStatusStateAtom(targetKey));
}
export function watchGitStatus(target, client) {
  const targetKey = getGitStatusTargetKey(target);
  if (targetKey === null) {
    return NOOP;
  }
  const watched = watchedGitStatuses.get(targetKey);
  if (watched) {
    watched.refCount += 1;
    return () => unwatchGitStatus(targetKey);
  }
  watchedGitStatuses.set(targetKey, {
    refCount: 1,
    unsubscribe: subscribeToGitStatusTarget(targetKey, target, client),
  });
  return () => unwatchGitStatus(targetKey);
}
export function refreshGitStatus(target, client) {
  const targetKey = getGitStatusTargetKey(target);
  if (targetKey === null || target.cwd === null) {
    return Promise.resolve(null);
  }
  const resolvedClient = client ?? readResolvedGitStatusClient(target)?.client;
  if (!resolvedClient) {
    return Promise.resolve(getGitStatusSnapshot(target).data);
  }
  const currentInFlight = gitStatusRefreshInFlight.get(targetKey);
  if (currentInFlight) {
    return currentInFlight;
  }
  const lastRequestedAt = gitStatusLastRefreshAtByKey.get(targetKey) ?? 0;
  if (Date.now() - lastRequestedAt < GIT_STATUS_REFRESH_DEBOUNCE_MS) {
    return Promise.resolve(getGitStatusSnapshot(target).data);
  }
  gitStatusLastRefreshAtByKey.set(targetKey, Date.now());
  const refreshPromise = resolvedClient.refreshStatus({ cwd: target.cwd }).finally(() => {
    gitStatusRefreshInFlight.delete(targetKey);
  });
  gitStatusRefreshInFlight.set(targetKey, refreshPromise);
  return refreshPromise;
}
export function resetGitStatusStateForTests() {
  for (const watched of watchedGitStatuses.values()) {
    watched.unsubscribe();
  }
  watchedGitStatuses.clear();
  gitStatusRefreshInFlight.clear();
  gitStatusLastRefreshAtByKey.clear();
  for (const key of knownGitStatusKeys) {
    appAtomRegistry.set(gitStatusStateAtom(key), INITIAL_GIT_STATUS_STATE);
  }
  knownGitStatusKeys.clear();
}
export function useGitStatus(target) {
  const targetKey = getGitStatusTargetKey(target);
  useEffect(
    () => watchGitStatus({ environmentId: target.environmentId, cwd: target.cwd }),
    [target.environmentId, target.cwd],
  );
  const state = useAtomValue(
    targetKey !== null ? gitStatusStateAtom(targetKey) : EMPTY_GIT_STATUS_ATOM,
  );
  return targetKey === null ? EMPTY_GIT_STATUS_STATE : state;
}
function unwatchGitStatus(targetKey) {
  const watched = watchedGitStatuses.get(targetKey);
  if (!watched) {
    return;
  }
  watched.refCount -= 1;
  if (watched.refCount > 0) {
    return;
  }
  watched.unsubscribe();
  watchedGitStatuses.delete(targetKey);
}
function subscribeToGitStatusTarget(targetKey, target, providedClient) {
  if (target.cwd === null) {
    return NOOP;
  }
  const cwd = target.cwd;
  let currentClientIdentity = null;
  let currentUnsubscribe = NOOP;
  const syncClientSubscription = () => {
    const resolved = providedClient
      ? {
          clientIdentity: `provided:${targetKey}`,
          client: providedClient,
        }
      : readResolvedGitStatusClient(target);
    if (!resolved) {
      if (currentClientIdentity !== null) {
        currentUnsubscribe();
        currentUnsubscribe = NOOP;
        currentClientIdentity = null;
      }
      markGitStatusPending(targetKey);
      return;
    }
    if (currentClientIdentity === resolved.clientIdentity) {
      return;
    }
    currentUnsubscribe();
    currentClientIdentity = resolved.clientIdentity;
    currentUnsubscribe = subscribeToGitStatus(targetKey, cwd, resolved.client);
  };
  const unsubscribeRegistry = providedClient
    ? NOOP
    : subscribeEnvironmentConnections(syncClientSubscription);
  syncClientSubscription();
  return () => {
    unsubscribeRegistry();
    currentUnsubscribe();
  };
}
function subscribeToGitStatus(targetKey, cwd, client) {
  markGitStatusPending(targetKey);
  return client.onStatus(
    { cwd },
    (status) => {
      appAtomRegistry.set(gitStatusStateAtom(targetKey), {
        data: status,
        error: null,
        cause: null,
        isPending: false,
      });
    },
    {
      onResubscribe: () => {
        markGitStatusPending(targetKey);
      },
    },
  );
}
function markGitStatusPending(targetKey) {
  const atom = gitStatusStateAtom(targetKey);
  const current = appAtomRegistry.get(atom);
  const next =
    current.data === null
      ? INITIAL_GIT_STATUS_STATE
      : {
          ...current,
          error: null,
          cause: null,
          isPending: true,
        };
  if (
    current.data === next.data &&
    current.error === next.error &&
    current.cause === next.cause &&
    current.isPending === next.isPending
  ) {
    return;
  }
  appAtomRegistry.set(atom, next);
}
