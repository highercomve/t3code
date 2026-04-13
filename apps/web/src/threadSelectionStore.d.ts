export interface ThreadSelectionState {
  /** Currently selected scoped thread keys. */
  selectedThreadKeys: ReadonlySet<string>;
  /** The scoped thread key that anchors shift-click range selection. */
  anchorThreadKey: string | null;
}
interface ThreadSelectionStore extends ThreadSelectionState {
  /** Toggle a single scoped thread key in the selection (Cmd/Ctrl+Click). */
  toggleThread: (threadKey: string) => void;
  /**
   * Select a range of threads (Shift+Click).
   * Requires the ordered list of scoped thread keys within the same project
   * so the store can compute which threads fall between anchor and target.
   */
  rangeSelectTo: (threadKey: string, orderedThreadKeys: readonly string[]) => void;
  /** Clear all selection state. */
  clearSelection: () => void;
  /** Remove specific scoped thread keys from the selection (e.g. after deletion). */
  removeFromSelection: (threadKeys: readonly string[]) => void;
  /** Set the anchor thread without adding it to the selection (e.g. on plain-click navigate). */
  setAnchor: (threadKey: string) => void;
  /** Check if any threads are selected. */
  hasSelection: () => boolean;
}
export declare const useThreadSelectionStore: import("zustand").UseBoundStore<
  import("zustand").StoreApi<ThreadSelectionStore>
>;
export {};
