import { scopeProjectRef } from "@t3tools/client-runtime";
export function resolveThreadActionProjectRef(context) {
  if (context.activeThread) {
    return scopeProjectRef(context.activeThread.environmentId, context.activeThread.projectId);
  }
  if (context.activeDraftThread) {
    return scopeProjectRef(
      context.activeDraftThread.environmentId,
      context.activeDraftThread.projectId,
    );
  }
  return context.defaultProjectRef;
}
function buildContextualThreadOptions(context) {
  return {
    branch: context.activeThread?.branch ?? context.activeDraftThread?.branch ?? null,
    worktreePath:
      context.activeThread?.worktreePath ?? context.activeDraftThread?.worktreePath ?? null,
    envMode:
      context.activeDraftThread?.envMode ??
      (context.activeThread?.worktreePath ? "worktree" : "local"),
  };
}
function buildDefaultThreadOptions(context) {
  return {
    envMode: context.defaultThreadEnvMode,
  };
}
export async function startNewThreadInProjectFromContext(context, projectRef) {
  await context.handleNewThread(projectRef, buildContextualThreadOptions(context));
}
export async function startNewThreadFromContext(context) {
  const projectRef = resolveThreadActionProjectRef(context);
  if (!projectRef) {
    return false;
  }
  await startNewThreadInProjectFromContext(context, projectRef);
  return true;
}
export async function startNewLocalThreadFromContext(context) {
  const projectRef = resolveThreadActionProjectRef(context);
  if (!projectRef) {
    return false;
  }
  await context.handleNewThread(projectRef, buildDefaultThreadOptions(context));
  return true;
}
