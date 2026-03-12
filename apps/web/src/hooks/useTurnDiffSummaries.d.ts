import type { Thread } from "../types";
export declare function useTurnDiffSummaries(activeThread: Thread | undefined): {
  turnDiffSummaries: import("../types").TurnDiffSummary[];
  inferredCheckpointTurnCountByTurnId: Record<
    string & import("effect/Brand").Brand<"TurnId">,
    number
  >;
};
