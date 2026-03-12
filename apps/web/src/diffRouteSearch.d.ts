import { TurnId } from "@t3tools/contracts";
export interface DiffRouteSearch {
  diff?: "1" | undefined;
  diffTurnId?: TurnId | undefined;
  diffFilePath?: string | undefined;
}
export declare function stripDiffSearchParams<T extends Record<string, unknown>>(
  params: T,
): Omit<T, "diff" | "diffTurnId" | "diffFilePath">;
export declare function parseDiffRouteSearch(search: Record<string, unknown>): DiffRouteSearch;
