import { scopeThreadRef } from "@t3tools/client-runtime";
export function buildThreadRouteParams(ref) {
  return {
    environmentId: ref.environmentId,
    threadId: ref.threadId,
  };
}
export function buildDraftThreadRouteParams(draftId) {
  return { draftId };
}
export function resolveThreadRouteRef(params) {
  if (!params.environmentId || !params.threadId) {
    return null;
  }
  return scopeThreadRef(params.environmentId, params.threadId);
}
export function resolveThreadRouteTarget(params) {
  if (params.environmentId && params.threadId) {
    return {
      kind: "server",
      threadRef: scopeThreadRef(params.environmentId, params.threadId),
    };
  }
  if (!params.draftId) {
    return null;
  }
  return {
    kind: "draft",
    draftId: params.draftId,
  };
}
