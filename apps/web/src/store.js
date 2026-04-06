import { DEFAULT_PROVIDER, isProviderKind } from "@t3tools/contracts";
import { resolveModelSlugForProvider } from "@t3tools/shared/model";
import { create } from "zustand";
import {
  findLatestProposedPlan,
  hasActionableProposedPlan,
  derivePendingApprovals,
  derivePendingUserInputs,
} from "./session-logic";
import { sanitizeThreadErrorMessage } from "./rpc/transportError";
const initialState = {
  projects: [],
  threads: [],
  sidebarThreadsById: {},
  threadIdsByProjectId: {},
  bootstrapComplete: false,
};
const MAX_THREAD_MESSAGES = 2_000;
const MAX_THREAD_CHECKPOINTS = 500;
const MAX_THREAD_PROPOSED_PLANS = 200;
const MAX_THREAD_ACTIVITIES = 500;
const EMPTY_THREAD_IDS = [];
// ── Pure helpers ──────────────────────────────────────────────────────
function updateThread(threads, threadId, updater) {
  let changed = false;
  const next = threads.map((t) => {
    if (t.id !== threadId) return t;
    const updated = updater(t);
    if (updated !== t) changed = true;
    return updated;
  });
  return changed ? next : threads;
}
function updateProject(projects, projectId, updater) {
  let changed = false;
  const next = projects.map((project) => {
    if (project.id !== projectId) {
      return project;
    }
    const updated = updater(project);
    if (updated !== project) {
      changed = true;
    }
    return updated;
  });
  return changed ? next : projects;
}
function normalizeModelSelection(selection) {
  return {
    ...selection,
    model: resolveModelSlugForProvider(selection.provider, selection.model),
  };
}
function mapProjectScripts(scripts) {
  return scripts.map((script) => ({ ...script }));
}
function mapSession(session) {
  return {
    provider: toLegacyProvider(session.providerName),
    status: toLegacySessionStatus(session.status),
    orchestrationStatus: session.status,
    activeTurnId: session.activeTurnId ?? undefined,
    createdAt: session.updatedAt,
    updatedAt: session.updatedAt,
    ...(session.lastError ? { lastError: session.lastError } : {}),
  };
}
function mapMessage(message) {
  const attachments = message.attachments?.map((attachment) => ({
    type: "image",
    id: attachment.id,
    name: attachment.name,
    mimeType: attachment.mimeType,
    sizeBytes: attachment.sizeBytes,
    previewUrl: toAttachmentPreviewUrl(attachmentPreviewRoutePath(attachment.id)),
  }));
  return {
    id: message.id,
    role: message.role,
    text: message.text,
    turnId: message.turnId,
    createdAt: message.createdAt,
    streaming: message.streaming,
    ...(message.streaming ? {} : { completedAt: message.updatedAt }),
    ...(attachments && attachments.length > 0 ? { attachments } : {}),
  };
}
function mapProposedPlan(proposedPlan) {
  return {
    id: proposedPlan.id,
    turnId: proposedPlan.turnId,
    planMarkdown: proposedPlan.planMarkdown,
    implementedAt: proposedPlan.implementedAt,
    implementationThreadId: proposedPlan.implementationThreadId,
    createdAt: proposedPlan.createdAt,
    updatedAt: proposedPlan.updatedAt,
  };
}
function mapTurnDiffSummary(checkpoint) {
  return {
    turnId: checkpoint.turnId,
    completedAt: checkpoint.completedAt,
    status: checkpoint.status,
    assistantMessageId: checkpoint.assistantMessageId ?? undefined,
    checkpointTurnCount: checkpoint.checkpointTurnCount,
    checkpointRef: checkpoint.checkpointRef,
    files: checkpoint.files.map((file) => ({ ...file })),
  };
}
function mapThread(thread) {
  return {
    id: thread.id,
    codexThreadId: null,
    projectId: thread.projectId,
    title: thread.title,
    modelSelection: normalizeModelSelection(thread.modelSelection),
    runtimeMode: thread.runtimeMode,
    interactionMode: thread.interactionMode,
    session: thread.session ? mapSession(thread.session) : null,
    messages: thread.messages.map(mapMessage),
    proposedPlans: thread.proposedPlans.map(mapProposedPlan),
    error: sanitizeThreadErrorMessage(thread.session?.lastError),
    createdAt: thread.createdAt,
    archivedAt: thread.archivedAt,
    updatedAt: thread.updatedAt,
    latestTurn: thread.latestTurn,
    pendingSourceProposedPlan: thread.latestTurn?.sourceProposedPlan,
    branch: thread.branch,
    worktreePath: thread.worktreePath,
    turnDiffSummaries: thread.checkpoints.map(mapTurnDiffSummary),
    activities: thread.activities.map((activity) => ({ ...activity })),
  };
}
function mapProject(project) {
  return {
    id: project.id,
    name: project.title,
    cwd: project.workspaceRoot,
    defaultModelSelection: project.defaultModelSelection
      ? normalizeModelSelection(project.defaultModelSelection)
      : null,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    scripts: mapProjectScripts(project.scripts),
  };
}
function getLatestUserMessageAt(messages) {
  let latestUserMessageAt = null;
  for (const message of messages) {
    if (message.role !== "user") {
      continue;
    }
    if (latestUserMessageAt === null || message.createdAt > latestUserMessageAt) {
      latestUserMessageAt = message.createdAt;
    }
  }
  return latestUserMessageAt;
}
function buildSidebarThreadSummary(thread) {
  return {
    id: thread.id,
    projectId: thread.projectId,
    title: thread.title,
    interactionMode: thread.interactionMode,
    session: thread.session,
    createdAt: thread.createdAt,
    archivedAt: thread.archivedAt,
    updatedAt: thread.updatedAt,
    latestTurn: thread.latestTurn,
    branch: thread.branch,
    worktreePath: thread.worktreePath,
    latestUserMessageAt: getLatestUserMessageAt(thread.messages),
    hasPendingApprovals: derivePendingApprovals(thread.activities).length > 0,
    hasPendingUserInput: derivePendingUserInputs(thread.activities).length > 0,
    hasActionableProposedPlan: hasActionableProposedPlan(
      findLatestProposedPlan(thread.proposedPlans, thread.latestTurn?.turnId ?? null),
    ),
  };
}
function sidebarThreadSummariesEqual(left, right) {
  return (
    left !== undefined &&
    left.id === right.id &&
    left.projectId === right.projectId &&
    left.title === right.title &&
    left.interactionMode === right.interactionMode &&
    left.session === right.session &&
    left.createdAt === right.createdAt &&
    left.archivedAt === right.archivedAt &&
    left.updatedAt === right.updatedAt &&
    left.latestTurn === right.latestTurn &&
    left.branch === right.branch &&
    left.worktreePath === right.worktreePath &&
    left.latestUserMessageAt === right.latestUserMessageAt &&
    left.hasPendingApprovals === right.hasPendingApprovals &&
    left.hasPendingUserInput === right.hasPendingUserInput &&
    left.hasActionableProposedPlan === right.hasActionableProposedPlan
  );
}
function appendThreadIdByProjectId(threadIdsByProjectId, projectId, threadId) {
  const existingThreadIds = threadIdsByProjectId[projectId] ?? EMPTY_THREAD_IDS;
  if (existingThreadIds.includes(threadId)) {
    return threadIdsByProjectId;
  }
  return {
    ...threadIdsByProjectId,
    [projectId]: [...existingThreadIds, threadId],
  };
}
function removeThreadIdByProjectId(threadIdsByProjectId, projectId, threadId) {
  const existingThreadIds = threadIdsByProjectId[projectId] ?? EMPTY_THREAD_IDS;
  if (!existingThreadIds.includes(threadId)) {
    return threadIdsByProjectId;
  }
  const nextThreadIds = existingThreadIds.filter(
    (existingThreadId) => existingThreadId !== threadId,
  );
  if (nextThreadIds.length === existingThreadIds.length) {
    return threadIdsByProjectId;
  }
  if (nextThreadIds.length === 0) {
    const nextThreadIdsByProjectId = { ...threadIdsByProjectId };
    delete nextThreadIdsByProjectId[projectId];
    return nextThreadIdsByProjectId;
  }
  return {
    ...threadIdsByProjectId,
    [projectId]: nextThreadIds,
  };
}
function buildThreadIdsByProjectId(threads) {
  const threadIdsByProjectId = {};
  for (const thread of threads) {
    const existingThreadIds = threadIdsByProjectId[thread.projectId] ?? EMPTY_THREAD_IDS;
    threadIdsByProjectId[thread.projectId] = [...existingThreadIds, thread.id];
  }
  return threadIdsByProjectId;
}
function buildSidebarThreadsById(threads) {
  return Object.fromEntries(
    threads.map((thread) => [thread.id, buildSidebarThreadSummary(thread)]),
  );
}
function checkpointStatusToLatestTurnState(status) {
  if (status === "error") {
    return "error";
  }
  if (status === "missing") {
    return "interrupted";
  }
  return "completed";
}
function compareActivities(left, right) {
  if (left.sequence !== undefined && right.sequence !== undefined) {
    if (left.sequence !== right.sequence) {
      return left.sequence - right.sequence;
    }
  } else if (left.sequence !== undefined) {
    return 1;
  } else if (right.sequence !== undefined) {
    return -1;
  }
  return left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id);
}
function buildLatestTurn(params) {
  const resolvedPlan =
    params.previous?.turnId === params.turnId
      ? params.previous.sourceProposedPlan
      : params.sourceProposedPlan;
  return {
    turnId: params.turnId,
    state: params.state,
    requestedAt: params.requestedAt,
    startedAt: params.startedAt,
    completedAt: params.completedAt,
    assistantMessageId: params.assistantMessageId,
    ...(resolvedPlan ? { sourceProposedPlan: resolvedPlan } : {}),
  };
}
function rebindTurnDiffSummariesForAssistantMessage(turnDiffSummaries, turnId, assistantMessageId) {
  let changed = false;
  const nextSummaries = turnDiffSummaries.map((summary) => {
    if (summary.turnId !== turnId || summary.assistantMessageId === assistantMessageId) {
      return summary;
    }
    changed = true;
    return {
      ...summary,
      assistantMessageId: assistantMessageId ?? undefined,
    };
  });
  return changed ? nextSummaries : [...turnDiffSummaries];
}
function retainThreadMessagesAfterRevert(messages, retainedTurnIds, turnCount) {
  const retainedMessageIds = new Set();
  for (const message of messages) {
    if (message.role === "system") {
      retainedMessageIds.add(message.id);
      continue;
    }
    if (
      message.turnId !== undefined &&
      message.turnId !== null &&
      retainedTurnIds.has(message.turnId)
    ) {
      retainedMessageIds.add(message.id);
    }
  }
  const retainedUserCount = messages.filter(
    (message) => message.role === "user" && retainedMessageIds.has(message.id),
  ).length;
  const missingUserCount = Math.max(0, turnCount - retainedUserCount);
  if (missingUserCount > 0) {
    const fallbackUserMessages = messages
      .filter(
        (message) =>
          message.role === "user" &&
          !retainedMessageIds.has(message.id) &&
          (message.turnId === undefined ||
            message.turnId === null ||
            retainedTurnIds.has(message.turnId)),
      )
      .toSorted(
        (left, right) =>
          left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id),
      )
      .slice(0, missingUserCount);
    for (const message of fallbackUserMessages) {
      retainedMessageIds.add(message.id);
    }
  }
  const retainedAssistantCount = messages.filter(
    (message) => message.role === "assistant" && retainedMessageIds.has(message.id),
  ).length;
  const missingAssistantCount = Math.max(0, turnCount - retainedAssistantCount);
  if (missingAssistantCount > 0) {
    const fallbackAssistantMessages = messages
      .filter(
        (message) =>
          message.role === "assistant" &&
          !retainedMessageIds.has(message.id) &&
          (message.turnId === undefined ||
            message.turnId === null ||
            retainedTurnIds.has(message.turnId)),
      )
      .toSorted(
        (left, right) =>
          left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id),
      )
      .slice(0, missingAssistantCount);
    for (const message of fallbackAssistantMessages) {
      retainedMessageIds.add(message.id);
    }
  }
  return messages.filter((message) => retainedMessageIds.has(message.id));
}
function retainThreadActivitiesAfterRevert(activities, retainedTurnIds) {
  return activities.filter(
    (activity) => activity.turnId === null || retainedTurnIds.has(activity.turnId),
  );
}
function retainThreadProposedPlansAfterRevert(proposedPlans, retainedTurnIds) {
  return proposedPlans.filter(
    (proposedPlan) => proposedPlan.turnId === null || retainedTurnIds.has(proposedPlan.turnId),
  );
}
function toLegacySessionStatus(status) {
  switch (status) {
    case "starting":
      return "connecting";
    case "running":
      return "running";
    case "error":
      return "error";
    case "ready":
    case "interrupted":
      return "ready";
    case "idle":
    case "stopped":
      return "closed";
  }
}
function toLegacyProvider(providerName) {
  if (providerName !== null && isProviderKind(providerName)) {
    return providerName;
  }
  return DEFAULT_PROVIDER;
}
function resolveWsHttpOrigin() {
  if (typeof window === "undefined") return "";
  const bridgeWsUrl = window.desktopBridge?.getWsUrl?.();
  const envWsUrl = import.meta.env.VITE_WS_URL;
  const wsCandidate =
    typeof bridgeWsUrl === "string" && bridgeWsUrl.length > 0
      ? bridgeWsUrl
      : typeof envWsUrl === "string" && envWsUrl.length > 0
        ? envWsUrl
        : null;
  if (!wsCandidate) return window.location.origin;
  try {
    const wsUrl = new URL(wsCandidate);
    const protocol =
      wsUrl.protocol === "wss:" ? "https:" : wsUrl.protocol === "ws:" ? "http:" : wsUrl.protocol;
    return `${protocol}//${wsUrl.host}`;
  } catch {
    return window.location.origin;
  }
}
function toAttachmentPreviewUrl(rawUrl) {
  if (rawUrl.startsWith("/")) {
    return `${resolveWsHttpOrigin()}${rawUrl}`;
  }
  return rawUrl;
}
function attachmentPreviewRoutePath(attachmentId) {
  return `/attachments/${encodeURIComponent(attachmentId)}`;
}
function updateThreadState(state, threadId, updater) {
  let updatedThread = null;
  const threads = updateThread(state.threads, threadId, (thread) => {
    const nextThread = updater(thread);
    if (nextThread !== thread) {
      updatedThread = nextThread;
    }
    return nextThread;
  });
  if (threads === state.threads || updatedThread === null) {
    return state;
  }
  const nextSummary = buildSidebarThreadSummary(updatedThread);
  const previousSummary = state.sidebarThreadsById[threadId];
  const sidebarThreadsById = sidebarThreadSummariesEqual(previousSummary, nextSummary)
    ? state.sidebarThreadsById
    : {
        ...state.sidebarThreadsById,
        [threadId]: nextSummary,
      };
  if (sidebarThreadsById === state.sidebarThreadsById) {
    return {
      ...state,
      threads,
    };
  }
  return {
    ...state,
    threads,
    sidebarThreadsById,
  };
}
// ── Pure state transition functions ────────────────────────────────────
export function syncServerReadModel(state, readModel) {
  const projects = readModel.projects
    .filter((project) => project.deletedAt === null)
    .map(mapProject);
  const threads = readModel.threads.filter((thread) => thread.deletedAt === null).map(mapThread);
  const sidebarThreadsById = buildSidebarThreadsById(threads);
  const threadIdsByProjectId = buildThreadIdsByProjectId(threads);
  return {
    ...state,
    projects,
    threads,
    sidebarThreadsById,
    threadIdsByProjectId,
    bootstrapComplete: true,
  };
}
export function applyOrchestrationEvent(state, event) {
  switch (event.type) {
    case "project.created": {
      const existingIndex = state.projects.findIndex(
        (project) =>
          project.id === event.payload.projectId || project.cwd === event.payload.workspaceRoot,
      );
      const nextProject = mapProject({
        id: event.payload.projectId,
        title: event.payload.title,
        workspaceRoot: event.payload.workspaceRoot,
        defaultModelSelection: event.payload.defaultModelSelection,
        scripts: event.payload.scripts,
        createdAt: event.payload.createdAt,
        updatedAt: event.payload.updatedAt,
        deletedAt: null,
      });
      const projects =
        existingIndex >= 0
          ? state.projects.map((project, index) =>
              index === existingIndex ? nextProject : project,
            )
          : [...state.projects, nextProject];
      return { ...state, projects };
    }
    case "project.meta-updated": {
      const projects = updateProject(state.projects, event.payload.projectId, (project) => ({
        ...project,
        ...(event.payload.title !== undefined ? { name: event.payload.title } : {}),
        ...(event.payload.workspaceRoot !== undefined ? { cwd: event.payload.workspaceRoot } : {}),
        ...(event.payload.defaultModelSelection !== undefined
          ? {
              defaultModelSelection: event.payload.defaultModelSelection
                ? normalizeModelSelection(event.payload.defaultModelSelection)
                : null,
            }
          : {}),
        ...(event.payload.scripts !== undefined
          ? { scripts: mapProjectScripts(event.payload.scripts) }
          : {}),
        updatedAt: event.payload.updatedAt,
      }));
      return projects === state.projects ? state : { ...state, projects };
    }
    case "project.deleted": {
      const projects = state.projects.filter((project) => project.id !== event.payload.projectId);
      return projects.length === state.projects.length ? state : { ...state, projects };
    }
    case "thread.created": {
      const existing = state.threads.find((thread) => thread.id === event.payload.threadId);
      const nextThread = mapThread({
        id: event.payload.threadId,
        projectId: event.payload.projectId,
        title: event.payload.title,
        modelSelection: event.payload.modelSelection,
        runtimeMode: event.payload.runtimeMode,
        interactionMode: event.payload.interactionMode,
        branch: event.payload.branch,
        worktreePath: event.payload.worktreePath,
        latestTurn: null,
        createdAt: event.payload.createdAt,
        updatedAt: event.payload.updatedAt,
        archivedAt: null,
        deletedAt: null,
        messages: [],
        proposedPlans: [],
        activities: [],
        checkpoints: [],
        session: null,
      });
      const threads = existing
        ? state.threads.map((thread) => (thread.id === nextThread.id ? nextThread : thread))
        : [...state.threads, nextThread];
      const nextSummary = buildSidebarThreadSummary(nextThread);
      const previousSummary = state.sidebarThreadsById[nextThread.id];
      const sidebarThreadsById = sidebarThreadSummariesEqual(previousSummary, nextSummary)
        ? state.sidebarThreadsById
        : {
            ...state.sidebarThreadsById,
            [nextThread.id]: nextSummary,
          };
      const nextThreadIdsByProjectId =
        existing !== undefined && existing.projectId !== nextThread.projectId
          ? removeThreadIdByProjectId(state.threadIdsByProjectId, existing.projectId, existing.id)
          : state.threadIdsByProjectId;
      const threadIdsByProjectId = appendThreadIdByProjectId(
        nextThreadIdsByProjectId,
        nextThread.projectId,
        nextThread.id,
      );
      return {
        ...state,
        threads,
        sidebarThreadsById,
        threadIdsByProjectId,
      };
    }
    case "thread.deleted": {
      const threads = state.threads.filter((thread) => thread.id !== event.payload.threadId);
      if (threads.length === state.threads.length) {
        return state;
      }
      const deletedThread = state.threads.find((thread) => thread.id === event.payload.threadId);
      const sidebarThreadsById = { ...state.sidebarThreadsById };
      delete sidebarThreadsById[event.payload.threadId];
      const threadIdsByProjectId = deletedThread
        ? removeThreadIdByProjectId(
            state.threadIdsByProjectId,
            deletedThread.projectId,
            deletedThread.id,
          )
        : state.threadIdsByProjectId;
      return {
        ...state,
        threads,
        sidebarThreadsById,
        threadIdsByProjectId,
      };
    }
    case "thread.archived": {
      return updateThreadState(state, event.payload.threadId, (thread) => ({
        ...thread,
        archivedAt: event.payload.archivedAt,
        updatedAt: event.payload.updatedAt,
      }));
    }
    case "thread.unarchived": {
      return updateThreadState(state, event.payload.threadId, (thread) => ({
        ...thread,
        archivedAt: null,
        updatedAt: event.payload.updatedAt,
      }));
    }
    case "thread.meta-updated": {
      return updateThreadState(state, event.payload.threadId, (thread) => ({
        ...thread,
        ...(event.payload.title !== undefined ? { title: event.payload.title } : {}),
        ...(event.payload.modelSelection !== undefined
          ? { modelSelection: normalizeModelSelection(event.payload.modelSelection) }
          : {}),
        ...(event.payload.branch !== undefined ? { branch: event.payload.branch } : {}),
        ...(event.payload.worktreePath !== undefined
          ? { worktreePath: event.payload.worktreePath }
          : {}),
        updatedAt: event.payload.updatedAt,
      }));
    }
    case "thread.runtime-mode-set": {
      return updateThreadState(state, event.payload.threadId, (thread) => ({
        ...thread,
        runtimeMode: event.payload.runtimeMode,
        updatedAt: event.payload.updatedAt,
      }));
    }
    case "thread.interaction-mode-set": {
      return updateThreadState(state, event.payload.threadId, (thread) => ({
        ...thread,
        interactionMode: event.payload.interactionMode,
        updatedAt: event.payload.updatedAt,
      }));
    }
    case "thread.turn-start-requested": {
      return updateThreadState(state, event.payload.threadId, (thread) => ({
        ...thread,
        ...(event.payload.modelSelection !== undefined
          ? { modelSelection: normalizeModelSelection(event.payload.modelSelection) }
          : {}),
        runtimeMode: event.payload.runtimeMode,
        interactionMode: event.payload.interactionMode,
        pendingSourceProposedPlan: event.payload.sourceProposedPlan,
        updatedAt: event.occurredAt,
      }));
    }
    case "thread.turn-interrupt-requested": {
      if (event.payload.turnId === undefined) {
        return state;
      }
      return updateThreadState(state, event.payload.threadId, (thread) => {
        const latestTurn = thread.latestTurn;
        if (latestTurn === null || latestTurn.turnId !== event.payload.turnId) {
          return thread;
        }
        return {
          ...thread,
          latestTurn: buildLatestTurn({
            previous: latestTurn,
            turnId: event.payload.turnId,
            state: "interrupted",
            requestedAt: latestTurn.requestedAt,
            startedAt: latestTurn.startedAt ?? event.payload.createdAt,
            completedAt: latestTurn.completedAt ?? event.payload.createdAt,
            assistantMessageId: latestTurn.assistantMessageId,
          }),
          updatedAt: event.occurredAt,
        };
      });
    }
    case "thread.message-sent": {
      return updateThreadState(state, event.payload.threadId, (thread) => {
        const message = mapMessage({
          id: event.payload.messageId,
          role: event.payload.role,
          text: event.payload.text,
          ...(event.payload.attachments !== undefined
            ? { attachments: event.payload.attachments }
            : {}),
          turnId: event.payload.turnId,
          streaming: event.payload.streaming,
          createdAt: event.payload.createdAt,
          updatedAt: event.payload.updatedAt,
        });
        const existingMessage = thread.messages.find((entry) => entry.id === message.id);
        const messages = existingMessage
          ? thread.messages.map((entry) =>
              entry.id !== message.id
                ? entry
                : {
                    ...entry,
                    text: message.streaming
                      ? `${entry.text}${message.text}`
                      : message.text.length > 0
                        ? message.text
                        : entry.text,
                    streaming: message.streaming,
                    ...(message.turnId !== undefined ? { turnId: message.turnId } : {}),
                    ...(message.streaming
                      ? entry.completedAt !== undefined
                        ? { completedAt: entry.completedAt }
                        : {}
                      : message.completedAt !== undefined
                        ? { completedAt: message.completedAt }
                        : {}),
                    ...(message.attachments !== undefined
                      ? { attachments: message.attachments }
                      : {}),
                  },
            )
          : [...thread.messages, message];
        const cappedMessages = messages.slice(-MAX_THREAD_MESSAGES);
        const turnDiffSummaries =
          event.payload.role === "assistant" && event.payload.turnId !== null
            ? rebindTurnDiffSummariesForAssistantMessage(
                thread.turnDiffSummaries,
                event.payload.turnId,
                event.payload.messageId,
              )
            : thread.turnDiffSummaries;
        const latestTurn =
          event.payload.role === "assistant" &&
          event.payload.turnId !== null &&
          (thread.latestTurn === null || thread.latestTurn.turnId === event.payload.turnId)
            ? buildLatestTurn({
                previous: thread.latestTurn,
                turnId: event.payload.turnId,
                state: event.payload.streaming
                  ? "running"
                  : thread.latestTurn?.state === "interrupted"
                    ? "interrupted"
                    : thread.latestTurn?.state === "error"
                      ? "error"
                      : "completed",
                requestedAt:
                  thread.latestTurn?.turnId === event.payload.turnId
                    ? thread.latestTurn.requestedAt
                    : event.payload.createdAt,
                startedAt:
                  thread.latestTurn?.turnId === event.payload.turnId
                    ? (thread.latestTurn.startedAt ?? event.payload.createdAt)
                    : event.payload.createdAt,
                sourceProposedPlan: thread.pendingSourceProposedPlan,
                completedAt: event.payload.streaming
                  ? thread.latestTurn?.turnId === event.payload.turnId
                    ? (thread.latestTurn.completedAt ?? null)
                    : null
                  : event.payload.updatedAt,
                assistantMessageId: event.payload.messageId,
              })
            : thread.latestTurn;
        return {
          ...thread,
          messages: cappedMessages,
          turnDiffSummaries,
          latestTurn,
          updatedAt: event.occurredAt,
        };
      });
    }
    case "thread.session-set": {
      return updateThreadState(state, event.payload.threadId, (thread) => ({
        ...thread,
        session: mapSession(event.payload.session),
        error: sanitizeThreadErrorMessage(event.payload.session.lastError),
        latestTurn:
          event.payload.session.status === "running" && event.payload.session.activeTurnId !== null
            ? buildLatestTurn({
                previous: thread.latestTurn,
                turnId: event.payload.session.activeTurnId,
                state: "running",
                requestedAt:
                  thread.latestTurn?.turnId === event.payload.session.activeTurnId
                    ? thread.latestTurn.requestedAt
                    : event.payload.session.updatedAt,
                startedAt:
                  thread.latestTurn?.turnId === event.payload.session.activeTurnId
                    ? (thread.latestTurn.startedAt ?? event.payload.session.updatedAt)
                    : event.payload.session.updatedAt,
                completedAt: null,
                assistantMessageId:
                  thread.latestTurn?.turnId === event.payload.session.activeTurnId
                    ? thread.latestTurn.assistantMessageId
                    : null,
                sourceProposedPlan: thread.pendingSourceProposedPlan,
              })
            : thread.latestTurn,
        updatedAt: event.occurredAt,
      }));
    }
    case "thread.session-stop-requested": {
      return updateThreadState(state, event.payload.threadId, (thread) =>
        thread.session === null
          ? thread
          : {
              ...thread,
              session: {
                ...thread.session,
                status: "closed",
                orchestrationStatus: "stopped",
                activeTurnId: undefined,
                updatedAt: event.payload.createdAt,
              },
              updatedAt: event.occurredAt,
            },
      );
    }
    case "thread.proposed-plan-upserted": {
      return updateThreadState(state, event.payload.threadId, (thread) => {
        const proposedPlan = mapProposedPlan(event.payload.proposedPlan);
        const proposedPlans = [
          ...thread.proposedPlans.filter((entry) => entry.id !== proposedPlan.id),
          proposedPlan,
        ]
          .toSorted(
            (left, right) =>
              left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id),
          )
          .slice(-MAX_THREAD_PROPOSED_PLANS);
        return {
          ...thread,
          proposedPlans,
          updatedAt: event.occurredAt,
        };
      });
    }
    case "thread.turn-diff-completed": {
      return updateThreadState(state, event.payload.threadId, (thread) => {
        const checkpoint = mapTurnDiffSummary({
          turnId: event.payload.turnId,
          checkpointTurnCount: event.payload.checkpointTurnCount,
          checkpointRef: event.payload.checkpointRef,
          status: event.payload.status,
          files: event.payload.files,
          assistantMessageId: event.payload.assistantMessageId,
          completedAt: event.payload.completedAt,
        });
        const existing = thread.turnDiffSummaries.find(
          (entry) => entry.turnId === checkpoint.turnId,
        );
        if (existing && existing.status !== "missing" && checkpoint.status === "missing") {
          return thread;
        }
        const turnDiffSummaries = [
          ...thread.turnDiffSummaries.filter((entry) => entry.turnId !== checkpoint.turnId),
          checkpoint,
        ]
          .toSorted(
            (left, right) =>
              (left.checkpointTurnCount ?? Number.MAX_SAFE_INTEGER) -
              (right.checkpointTurnCount ?? Number.MAX_SAFE_INTEGER),
          )
          .slice(-MAX_THREAD_CHECKPOINTS);
        const latestTurn =
          thread.latestTurn === null || thread.latestTurn.turnId === event.payload.turnId
            ? buildLatestTurn({
                previous: thread.latestTurn,
                turnId: event.payload.turnId,
                state: checkpointStatusToLatestTurnState(event.payload.status),
                requestedAt: thread.latestTurn?.requestedAt ?? event.payload.completedAt,
                startedAt: thread.latestTurn?.startedAt ?? event.payload.completedAt,
                completedAt: event.payload.completedAt,
                assistantMessageId: event.payload.assistantMessageId,
                sourceProposedPlan: thread.pendingSourceProposedPlan,
              })
            : thread.latestTurn;
        return {
          ...thread,
          turnDiffSummaries,
          latestTurn,
          updatedAt: event.occurredAt,
        };
      });
    }
    case "thread.reverted": {
      return updateThreadState(state, event.payload.threadId, (thread) => {
        const turnDiffSummaries = thread.turnDiffSummaries
          .filter(
            (entry) =>
              entry.checkpointTurnCount !== undefined &&
              entry.checkpointTurnCount <= event.payload.turnCount,
          )
          .toSorted(
            (left, right) =>
              (left.checkpointTurnCount ?? Number.MAX_SAFE_INTEGER) -
              (right.checkpointTurnCount ?? Number.MAX_SAFE_INTEGER),
          )
          .slice(-MAX_THREAD_CHECKPOINTS);
        const retainedTurnIds = new Set(turnDiffSummaries.map((entry) => entry.turnId));
        const messages = retainThreadMessagesAfterRevert(
          thread.messages,
          retainedTurnIds,
          event.payload.turnCount,
        ).slice(-MAX_THREAD_MESSAGES);
        const proposedPlans = retainThreadProposedPlansAfterRevert(
          thread.proposedPlans,
          retainedTurnIds,
        ).slice(-MAX_THREAD_PROPOSED_PLANS);
        const activities = retainThreadActivitiesAfterRevert(thread.activities, retainedTurnIds);
        const latestCheckpoint = turnDiffSummaries.at(-1) ?? null;
        return {
          ...thread,
          turnDiffSummaries,
          messages,
          proposedPlans,
          activities,
          pendingSourceProposedPlan: undefined,
          latestTurn:
            latestCheckpoint === null
              ? null
              : {
                  turnId: latestCheckpoint.turnId,
                  state: checkpointStatusToLatestTurnState(latestCheckpoint.status ?? "ready"),
                  requestedAt: latestCheckpoint.completedAt,
                  startedAt: latestCheckpoint.completedAt,
                  completedAt: latestCheckpoint.completedAt,
                  assistantMessageId: latestCheckpoint.assistantMessageId ?? null,
                },
          updatedAt: event.occurredAt,
        };
      });
    }
    case "thread.activity-appended": {
      return updateThreadState(state, event.payload.threadId, (thread) => {
        const activities = [
          ...thread.activities.filter((activity) => activity.id !== event.payload.activity.id),
          { ...event.payload.activity },
        ]
          .toSorted(compareActivities)
          .slice(-MAX_THREAD_ACTIVITIES);
        return {
          ...thread,
          activities,
          updatedAt: event.occurredAt,
        };
      });
    }
    case "thread.approval-response-requested":
    case "thread.user-input-response-requested":
      return state;
  }
  return state;
}
export function applyOrchestrationEvents(state, events) {
  if (events.length === 0) {
    return state;
  }
  return events.reduce((nextState, event) => applyOrchestrationEvent(nextState, event), state);
}
export const selectProjectById = (projectId) => (state) =>
  projectId ? state.projects.find((project) => project.id === projectId) : undefined;
export const selectThreadById = (threadId) => (state) =>
  threadId ? state.threads.find((thread) => thread.id === threadId) : undefined;
export const selectSidebarThreadSummaryById = (threadId) => (state) =>
  threadId ? state.sidebarThreadsById[threadId] : undefined;
export const selectThreadIdsByProjectId = (projectId) => (state) =>
  projectId ? (state.threadIdsByProjectId[projectId] ?? EMPTY_THREAD_IDS) : EMPTY_THREAD_IDS;
export function setError(state, threadId, error) {
  return updateThreadState(state, threadId, (t) => {
    if (t.error === error) return t;
    return { ...t, error };
  });
}
export function setThreadBranch(state, threadId, branch, worktreePath) {
  return updateThreadState(state, threadId, (t) => {
    if (t.branch === branch && t.worktreePath === worktreePath) return t;
    const cwdChanged = t.worktreePath !== worktreePath;
    return {
      ...t,
      branch,
      worktreePath,
      ...(cwdChanged ? { session: null } : {}),
    };
  });
}
export const useStore = create((set) => ({
  ...initialState,
  syncServerReadModel: (readModel) => set((state) => syncServerReadModel(state, readModel)),
  applyOrchestrationEvent: (event) => set((state) => applyOrchestrationEvent(state, event)),
  applyOrchestrationEvents: (events) => set((state) => applyOrchestrationEvents(state, events)),
  setError: (threadId, error) => set((state) => setError(state, threadId, error)),
  setThreadBranch: (threadId, branch, worktreePath) =>
    set((state) => setThreadBranch(state, threadId, branch, worktreePath)),
}));
