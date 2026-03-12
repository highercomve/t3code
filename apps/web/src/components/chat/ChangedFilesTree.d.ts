import { type TurnId } from "@t3tools/contracts";
import { type TurnDiffFileChange } from "../../types";
export declare const ChangedFilesTree: import("react").NamedExoticComponent<{
  turnId: TurnId;
  files: ReadonlyArray<TurnDiffFileChange>;
  allDirectoriesExpanded: boolean;
  resolvedTheme: "light" | "dark";
  onOpenTurnDiff: (turnId: TurnId, filePath?: string) => void;
}>;
