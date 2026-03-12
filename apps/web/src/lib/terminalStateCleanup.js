export function collectActiveTerminalThreadIds(input) {
  const activeThreadIds = new Set();
  for (const thread of input.snapshotThreads) {
    if (thread.deletedAt !== null) continue;
    activeThreadIds.add(thread.id);
  }
  for (const draftThreadId of input.draftThreadIds) {
    activeThreadIds.add(draftThreadId);
  }
  return activeThreadIds;
}
