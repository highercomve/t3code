import type { ThreadId } from "@t3tools/contracts";
interface TerminalRetentionThread {
  id: ThreadId;
  deletedAt: string | null;
  archivedAt: string | null;
}
interface CollectActiveTerminalThreadIdsInput {
  snapshotThreads: readonly TerminalRetentionThread[];
  draftThreadIds: Iterable<ThreadId>;
}
export declare function collectActiveTerminalThreadIds(
  input: CollectActiveTerminalThreadIdsInput,
): Set<ThreadId>;
export {};
