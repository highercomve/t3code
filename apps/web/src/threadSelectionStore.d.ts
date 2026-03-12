/**
 * Zustand store for sidebar thread multi-selection state.
 *
 * Supports Cmd/Ctrl+Click (toggle individual), Shift+Click (range select),
 * and bulk actions on the selected set.
 */
import type { ThreadId } from "@t3tools/contracts";
export interface ThreadSelectionState {
  /** Currently selected thread IDs. */
  selectedThreadIds: ReadonlySet<ThreadId>;
  /** The thread ID that anchors shift-click range selection. */
  anchorThreadId: ThreadId | null;
}
interface ThreadSelectionStore extends ThreadSelectionState {
  /** Toggle a single thread in the selection (Cmd/Ctrl+Click). */
  toggleThread: (threadId: ThreadId) => void;
  /**
   * Select a range of threads (Shift+Click).
   * Requires the ordered list of thread IDs within the same project
   * so the store can compute which threads fall between anchor and target.
   */
  rangeSelectTo: (threadId: ThreadId, orderedThreadIds: readonly ThreadId[]) => void;
  /** Clear all selection state. */
  clearSelection: () => void;
  /** Remove specific thread IDs from the selection (e.g. after deletion). */
  removeFromSelection: (threadIds: readonly ThreadId[]) => void;
  /** Set the anchor thread without adding it to the selection (e.g. on plain-click navigate). */
  setAnchor: (threadId: ThreadId) => void;
  /** Check if any threads are selected. */
  hasSelection: () => boolean;
}
export declare const useThreadSelectionStore: import("zustand").UseBoundStore<
  import("zustand").StoreApi<ThreadSelectionStore>
>;
export {};
