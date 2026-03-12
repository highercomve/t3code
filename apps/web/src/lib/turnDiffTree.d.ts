import type { TurnDiffFileChange } from "../types";
export interface TurnDiffStat {
  additions: number;
  deletions: number;
}
export interface TurnDiffTreeDirectoryNode {
  kind: "directory";
  name: string;
  path: string;
  stat: TurnDiffStat;
  children: TurnDiffTreeNode[];
}
export interface TurnDiffTreeFileNode {
  kind: "file";
  name: string;
  path: string;
  stat: TurnDiffStat | null;
}
export type TurnDiffTreeNode = TurnDiffTreeDirectoryNode | TurnDiffTreeFileNode;
export declare function summarizeTurnDiffStats(
  files: ReadonlyArray<TurnDiffFileChange>,
): TurnDiffStat;
export declare function buildTurnDiffTree(
  files: ReadonlyArray<TurnDiffFileChange>,
): TurnDiffTreeNode[];
