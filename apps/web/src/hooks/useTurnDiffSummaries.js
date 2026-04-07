import { useMemo } from "react";
import { inferCheckpointTurnCountByTurnId } from "../session-logic";
export function useTurnDiffSummaries(activeThread) {
    const turnDiffSummaries = useMemo(() => {
        if (!activeThread) {
            return [];
        }
        return activeThread.turnDiffSummaries;
    }, [activeThread]);
    const inferredCheckpointTurnCountByTurnId = useMemo(() => inferCheckpointTurnCountByTurnId(turnDiffSummaries), [turnDiffSummaries]);
    return { turnDiffSummaries, inferredCheckpointTurnCountByTurnId };
}
