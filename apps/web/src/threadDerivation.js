const EMPTY_MESSAGES = [];
const EMPTY_ACTIVITIES = [];
const EMPTY_PROPOSED_PLANS = [];
const EMPTY_TURN_DIFF_SUMMARIES = [];
const EMPTY_MESSAGE_MAP = {};
const EMPTY_ACTIVITY_MAP = {};
const EMPTY_PROPOSED_PLAN_MAP = {};
const EMPTY_TURN_DIFF_MAP = {};
const collectedByIdsCache = new WeakMap();
const threadCache = new WeakMap();
function collectByIds(ids, byId, emptyValue) {
  if (!ids || ids.length === 0 || !byId) {
    return emptyValue;
  }
  const cachedByRecord = collectedByIdsCache.get(ids);
  const cached = cachedByRecord?.get(byId);
  if (cached) {
    return cached;
  }
  const nextValues = ids.flatMap((id) => {
    const value = byId[id];
    return value ? [value] : [];
  });
  const nextCachedByRecord = cachedByRecord ?? new WeakMap();
  nextCachedByRecord.set(byId, nextValues);
  if (!cachedByRecord) {
    collectedByIdsCache.set(ids, nextCachedByRecord);
  }
  return nextValues;
}
function selectThreadMessages(state, threadId) {
  return collectByIds(
    state.messageIdsByThreadId[threadId],
    state.messageByThreadId[threadId] ?? EMPTY_MESSAGE_MAP,
    EMPTY_MESSAGES,
  );
}
function selectThreadActivities(state, threadId) {
  return collectByIds(
    state.activityIdsByThreadId[threadId],
    state.activityByThreadId[threadId] ?? EMPTY_ACTIVITY_MAP,
    EMPTY_ACTIVITIES,
  );
}
function selectThreadProposedPlans(state, threadId) {
  return collectByIds(
    state.proposedPlanIdsByThreadId[threadId],
    state.proposedPlanByThreadId[threadId] ?? EMPTY_PROPOSED_PLAN_MAP,
    EMPTY_PROPOSED_PLANS,
  );
}
function selectThreadTurnDiffSummaries(state, threadId) {
  return collectByIds(
    state.turnDiffIdsByThreadId[threadId],
    state.turnDiffSummaryByThreadId[threadId] ?? EMPTY_TURN_DIFF_MAP,
    EMPTY_TURN_DIFF_SUMMARIES,
  );
}
export function getThreadFromEnvironmentState(state, threadId) {
  const shell = state.threadShellById[threadId];
  if (!shell) {
    return undefined;
  }
  const session = state.threadSessionById[threadId] ?? null;
  const turnState = state.threadTurnStateById[threadId];
  const messages = selectThreadMessages(state, threadId);
  const activities = selectThreadActivities(state, threadId);
  const proposedPlans = selectThreadProposedPlans(state, threadId);
  const turnDiffSummaries = selectThreadTurnDiffSummaries(state, threadId);
  const cached = threadCache.get(shell);
  if (
    cached &&
    cached.session === session &&
    cached.turnState === turnState &&
    cached.messages === messages &&
    cached.activities === activities &&
    cached.proposedPlans === proposedPlans &&
    cached.turnDiffSummaries === turnDiffSummaries
  ) {
    return cached.thread;
  }
  const thread = {
    ...shell,
    session,
    latestTurn: turnState?.latestTurn ?? null,
    pendingSourceProposedPlan: turnState?.pendingSourceProposedPlan,
    messages,
    activities,
    proposedPlans,
    turnDiffSummaries,
  };
  threadCache.set(shell, {
    session,
    turnState,
    messages,
    activities,
    proposedPlans,
    turnDiffSummaries,
    thread,
  });
  return thread;
}
