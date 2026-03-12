import type { Thread } from "./types";
export declare function getOrphanedWorktreePathForThread(
  threads: readonly Thread[],
  threadId: Thread["id"],
): string | null;
export declare function formatWorktreePathForDisplay(worktreePath: string): string;
