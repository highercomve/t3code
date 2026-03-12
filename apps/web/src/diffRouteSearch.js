import { TurnId } from "@t3tools/contracts";
function isDiffOpenValue(value) {
  return value === "1" || value === 1 || value === true;
}
function normalizeSearchString(value) {
  if (typeof value !== "string") {
    return undefined;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}
export function stripDiffSearchParams(params) {
  const { diff: _diff, diffTurnId: _diffTurnId, diffFilePath: _diffFilePath, ...rest } = params;
  return rest;
}
export function parseDiffRouteSearch(search) {
  const diff = isDiffOpenValue(search.diff) ? "1" : undefined;
  const diffTurnIdRaw = diff ? normalizeSearchString(search.diffTurnId) : undefined;
  const diffTurnId = diffTurnIdRaw ? TurnId.makeUnsafe(diffTurnIdRaw) : undefined;
  const diffFilePath = diff && diffTurnId ? normalizeSearchString(search.diffFilePath) : undefined;
  return {
    ...(diff ? { diff } : {}),
    ...(diffTurnId ? { diffTurnId } : {}),
    ...(diffFilePath ? { diffFilePath } : {}),
  };
}
