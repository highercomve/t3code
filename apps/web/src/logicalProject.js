import { scopedProjectKey, scopeProjectRef } from "@t3tools/client-runtime";
export function deriveLogicalProjectKey(project) {
  return (
    project.repositoryIdentity?.canonicalKey ??
    scopedProjectKey(scopeProjectRef(project.environmentId, project.id))
  );
}
export function deriveLogicalProjectKeyFromRef(projectRef, project) {
  return project?.repositoryIdentity?.canonicalKey ?? scopedProjectKey(projectRef);
}
