interface TerminalRetentionThread {
  key: string;
  deletedAt: string | null;
  archivedAt: string | null;
}
interface CollectActiveTerminalThreadIdsInput {
  snapshotThreads: readonly TerminalRetentionThread[];
  draftThreadKeys: Iterable<string>;
}
export declare function collectActiveTerminalThreadIds(
  input: CollectActiveTerminalThreadIdsInput,
): Set<string>;
export {};
