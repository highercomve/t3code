import { Debouncer } from "@tanstack/react-pacer";
import { create } from "zustand";
const PERSISTED_STATE_KEY = "t3code:ui-state:v1";
const LEGACY_PERSISTED_STATE_KEYS = [
  "t3code:renderer-state:v8",
  "t3code:renderer-state:v7",
  "t3code:renderer-state:v6",
  "t3code:renderer-state:v5",
  "t3code:renderer-state:v4",
  "t3code:renderer-state:v3",
  "codething:renderer-state:v4",
  "codething:renderer-state:v3",
  "codething:renderer-state:v2",
  "codething:renderer-state:v1",
];
const initialState = {
  projectExpandedById: {},
  projectOrder: [],
  threadLastVisitedAtById: {},
};
const persistedExpandedProjectCwds = new Set();
const persistedProjectOrderCwds = [];
const currentProjectCwdById = new Map();
let legacyKeysCleanedUp = false;
function readPersistedState() {
  if (typeof window === "undefined") {
    return initialState;
  }
  try {
    const raw = window.localStorage.getItem(PERSISTED_STATE_KEY);
    if (!raw) {
      for (const legacyKey of LEGACY_PERSISTED_STATE_KEYS) {
        const legacyRaw = window.localStorage.getItem(legacyKey);
        if (!legacyRaw) {
          continue;
        }
        hydratePersistedProjectState(JSON.parse(legacyRaw));
        return initialState;
      }
      return initialState;
    }
    hydratePersistedProjectState(JSON.parse(raw));
    return initialState;
  } catch {
    return initialState;
  }
}
function hydratePersistedProjectState(parsed) {
  persistedExpandedProjectCwds.clear();
  persistedProjectOrderCwds.length = 0;
  for (const cwd of parsed.expandedProjectCwds ?? []) {
    if (typeof cwd === "string" && cwd.length > 0) {
      persistedExpandedProjectCwds.add(cwd);
    }
  }
  for (const cwd of parsed.projectOrderCwds ?? []) {
    if (typeof cwd === "string" && cwd.length > 0 && !persistedProjectOrderCwds.includes(cwd)) {
      persistedProjectOrderCwds.push(cwd);
    }
  }
}
function persistState(state) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const expandedProjectCwds = Object.entries(state.projectExpandedById)
      .filter(([, expanded]) => expanded)
      .flatMap(([projectId]) => {
        const cwd = currentProjectCwdById.get(projectId);
        return cwd ? [cwd] : [];
      });
    const projectOrderCwds = state.projectOrder.flatMap((projectId) => {
      const cwd = currentProjectCwdById.get(projectId);
      return cwd ? [cwd] : [];
    });
    window.localStorage.setItem(
      PERSISTED_STATE_KEY,
      JSON.stringify({
        expandedProjectCwds,
        projectOrderCwds,
      }),
    );
    if (!legacyKeysCleanedUp) {
      legacyKeysCleanedUp = true;
      for (const legacyKey of LEGACY_PERSISTED_STATE_KEYS) {
        window.localStorage.removeItem(legacyKey);
      }
    }
  } catch {
    // Ignore quota/storage errors to avoid breaking chat UX.
  }
}
const debouncedPersistState = new Debouncer(persistState, { wait: 500 });
function recordsEqual(left, right) {
  const leftEntries = Object.entries(left);
  const rightEntries = Object.entries(right);
  if (leftEntries.length !== rightEntries.length) {
    return false;
  }
  for (const [key, value] of leftEntries) {
    if (right[key] !== value) {
      return false;
    }
  }
  return true;
}
function projectOrdersEqual(left, right) {
  return (
    left.length === right.length && left.every((projectId, index) => projectId === right[index])
  );
}
export function syncProjects(state, projects) {
  const previousProjectCwdById = new Map(currentProjectCwdById);
  const previousProjectIdByCwd = new Map(
    [...previousProjectCwdById.entries()].map(([projectId, cwd]) => [cwd, projectId]),
  );
  currentProjectCwdById.clear();
  for (const project of projects) {
    currentProjectCwdById.set(project.id, project.cwd);
  }
  const cwdMappingChanged =
    previousProjectCwdById.size !== currentProjectCwdById.size ||
    projects.some((project) => previousProjectCwdById.get(project.id) !== project.cwd);
  const nextExpandedById = {};
  const previousExpandedById = state.projectExpandedById;
  const persistedOrderByCwd = new Map(persistedProjectOrderCwds.map((cwd, index) => [cwd, index]));
  const mappedProjects = projects.map((project, index) => {
    const previousProjectIdForCwd = previousProjectIdByCwd.get(project.cwd);
    const expanded =
      previousExpandedById[project.id] ??
      (previousProjectIdForCwd ? previousExpandedById[previousProjectIdForCwd] : undefined) ??
      (persistedExpandedProjectCwds.size > 0
        ? persistedExpandedProjectCwds.has(project.cwd)
        : true);
    nextExpandedById[project.id] = expanded;
    return {
      id: project.id,
      cwd: project.cwd,
      incomingIndex: index,
    };
  });
  const nextProjectOrder =
    state.projectOrder.length > 0
      ? (() => {
          const nextProjectIdByCwd = new Map(
            mappedProjects.map((project) => [project.cwd, project.id]),
          );
          const usedProjectIds = new Set();
          const orderedProjectIds = [];
          for (const projectId of state.projectOrder) {
            const matchedProjectId =
              (projectId in nextExpandedById ? projectId : undefined) ??
              (() => {
                const previousCwd = previousProjectCwdById.get(projectId);
                return previousCwd ? nextProjectIdByCwd.get(previousCwd) : undefined;
              })();
            if (!matchedProjectId || usedProjectIds.has(matchedProjectId)) {
              continue;
            }
            usedProjectIds.add(matchedProjectId);
            orderedProjectIds.push(matchedProjectId);
          }
          for (const project of mappedProjects) {
            if (usedProjectIds.has(project.id)) {
              continue;
            }
            orderedProjectIds.push(project.id);
          }
          return orderedProjectIds;
        })()
      : mappedProjects
          .map((project) => ({
            id: project.id,
            incomingIndex: project.incomingIndex,
            orderIndex:
              persistedOrderByCwd.get(project.cwd) ??
              persistedProjectOrderCwds.length + project.incomingIndex,
          }))
          .toSorted((left, right) => {
            const byOrder = left.orderIndex - right.orderIndex;
            if (byOrder !== 0) {
              return byOrder;
            }
            return left.incomingIndex - right.incomingIndex;
          })
          .map((project) => project.id);
  if (
    recordsEqual(state.projectExpandedById, nextExpandedById) &&
    projectOrdersEqual(state.projectOrder, nextProjectOrder) &&
    !cwdMappingChanged
  ) {
    return state;
  }
  return {
    ...state,
    projectExpandedById: nextExpandedById,
    projectOrder: nextProjectOrder,
  };
}
export function syncThreads(state, threads) {
  const retainedThreadIds = new Set(threads.map((thread) => thread.id));
  const nextThreadLastVisitedAtById = Object.fromEntries(
    Object.entries(state.threadLastVisitedAtById).filter(([threadId]) =>
      retainedThreadIds.has(threadId),
    ),
  );
  for (const thread of threads) {
    if (
      nextThreadLastVisitedAtById[thread.id] === undefined &&
      thread.seedVisitedAt !== undefined &&
      thread.seedVisitedAt.length > 0
    ) {
      nextThreadLastVisitedAtById[thread.id] = thread.seedVisitedAt;
    }
  }
  if (recordsEqual(state.threadLastVisitedAtById, nextThreadLastVisitedAtById)) {
    return state;
  }
  return {
    ...state,
    threadLastVisitedAtById: nextThreadLastVisitedAtById,
  };
}
export function markThreadVisited(state, threadId, visitedAt) {
  const at = visitedAt ?? new Date().toISOString();
  const visitedAtMs = Date.parse(at);
  const previousVisitedAt = state.threadLastVisitedAtById[threadId];
  const previousVisitedAtMs = previousVisitedAt ? Date.parse(previousVisitedAt) : NaN;
  if (
    Number.isFinite(previousVisitedAtMs) &&
    Number.isFinite(visitedAtMs) &&
    previousVisitedAtMs >= visitedAtMs
  ) {
    return state;
  }
  return {
    ...state,
    threadLastVisitedAtById: {
      ...state.threadLastVisitedAtById,
      [threadId]: at,
    },
  };
}
export function markThreadUnread(state, threadId, latestTurnCompletedAt) {
  if (!latestTurnCompletedAt) {
    return state;
  }
  const latestTurnCompletedAtMs = Date.parse(latestTurnCompletedAt);
  if (Number.isNaN(latestTurnCompletedAtMs)) {
    return state;
  }
  const unreadVisitedAt = new Date(latestTurnCompletedAtMs - 1).toISOString();
  if (state.threadLastVisitedAtById[threadId] === unreadVisitedAt) {
    return state;
  }
  return {
    ...state,
    threadLastVisitedAtById: {
      ...state.threadLastVisitedAtById,
      [threadId]: unreadVisitedAt,
    },
  };
}
export function clearThreadUi(state, threadId) {
  if (!(threadId in state.threadLastVisitedAtById)) {
    return state;
  }
  const nextThreadLastVisitedAtById = { ...state.threadLastVisitedAtById };
  delete nextThreadLastVisitedAtById[threadId];
  return {
    ...state,
    threadLastVisitedAtById: nextThreadLastVisitedAtById,
  };
}
export function toggleProject(state, projectId) {
  const expanded = state.projectExpandedById[projectId] ?? true;
  return {
    ...state,
    projectExpandedById: {
      ...state.projectExpandedById,
      [projectId]: !expanded,
    },
  };
}
export function setProjectExpanded(state, projectId, expanded) {
  if ((state.projectExpandedById[projectId] ?? true) === expanded) {
    return state;
  }
  return {
    ...state,
    projectExpandedById: {
      ...state.projectExpandedById,
      [projectId]: expanded,
    },
  };
}
export function reorderProjects(state, draggedProjectId, targetProjectId) {
  if (draggedProjectId === targetProjectId) {
    return state;
  }
  const draggedIndex = state.projectOrder.findIndex((projectId) => projectId === draggedProjectId);
  const targetIndex = state.projectOrder.findIndex((projectId) => projectId === targetProjectId);
  if (draggedIndex < 0 || targetIndex < 0) {
    return state;
  }
  const projectOrder = [...state.projectOrder];
  const [draggedProject] = projectOrder.splice(draggedIndex, 1);
  if (!draggedProject) {
    return state;
  }
  projectOrder.splice(targetIndex, 0, draggedProject);
  return {
    ...state,
    projectOrder,
  };
}
export const useUiStateStore = create((set) => ({
  ...readPersistedState(),
  syncProjects: (projects) => set((state) => syncProjects(state, projects)),
  syncThreads: (threads) => set((state) => syncThreads(state, threads)),
  markThreadVisited: (threadId, visitedAt) =>
    set((state) => markThreadVisited(state, threadId, visitedAt)),
  markThreadUnread: (threadId, latestTurnCompletedAt) =>
    set((state) => markThreadUnread(state, threadId, latestTurnCompletedAt)),
  clearThreadUi: (threadId) => set((state) => clearThreadUi(state, threadId)),
  toggleProject: (projectId) => set((state) => toggleProject(state, projectId)),
  setProjectExpanded: (projectId, expanded) =>
    set((state) => setProjectExpanded(state, projectId, expanded)),
  reorderProjects: (draggedProjectId, targetProjectId) =>
    set((state) => reorderProjects(state, draggedProjectId, targetProjectId)),
}));
useUiStateStore.subscribe((state) => debouncedPersistState.maybeExecute(state));
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    debouncedPersistState.flush();
  });
}
