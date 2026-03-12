/**
 * Zustand store for sidebar thread multi-selection state.
 *
 * Supports Cmd/Ctrl+Click (toggle individual), Shift+Click (range select),
 * and bulk actions on the selected set.
 */
import { create } from "zustand";
const EMPTY_SET = new Set();
export const useThreadSelectionStore = create((set, get) => ({
  selectedThreadIds: EMPTY_SET,
  anchorThreadId: null,
  toggleThread: (threadId) => {
    set((state) => {
      const next = new Set(state.selectedThreadIds);
      if (next.has(threadId)) {
        next.delete(threadId);
      } else {
        next.add(threadId);
      }
      return {
        selectedThreadIds: next,
        anchorThreadId: next.has(threadId) ? threadId : state.anchorThreadId,
      };
    });
  },
  rangeSelectTo: (threadId, orderedThreadIds) => {
    set((state) => {
      const anchor = state.anchorThreadId;
      if (anchor === null) {
        // No anchor yet — treat as a single toggle
        const next = new Set(state.selectedThreadIds);
        next.add(threadId);
        return { selectedThreadIds: next, anchorThreadId: threadId };
      }
      const anchorIndex = orderedThreadIds.indexOf(anchor);
      const targetIndex = orderedThreadIds.indexOf(threadId);
      if (anchorIndex === -1 || targetIndex === -1) {
        // Anchor or target not in this list (different project?) — fallback to toggle
        const next = new Set(state.selectedThreadIds);
        next.add(threadId);
        return { selectedThreadIds: next, anchorThreadId: threadId };
      }
      const start = Math.min(anchorIndex, targetIndex);
      const end = Math.max(anchorIndex, targetIndex);
      const next = new Set(state.selectedThreadIds);
      for (let i = start; i <= end; i++) {
        const id = orderedThreadIds[i];
        if (id !== undefined) {
          next.add(id);
        }
      }
      // Keep anchor stable so subsequent shift-clicks extend from the same point
      return { selectedThreadIds: next, anchorThreadId: anchor };
    });
  },
  clearSelection: () => {
    const state = get();
    if (state.selectedThreadIds.size === 0 && state.anchorThreadId === null) return;
    set({ selectedThreadIds: EMPTY_SET, anchorThreadId: null });
  },
  setAnchor: (threadId) => {
    if (get().anchorThreadId === threadId) return;
    set({ anchorThreadId: threadId });
  },
  removeFromSelection: (threadIds) => {
    set((state) => {
      const toRemove = new Set(threadIds);
      let changed = false;
      const next = new Set();
      for (const id of state.selectedThreadIds) {
        if (toRemove.has(id)) {
          changed = true;
        } else {
          next.add(id);
        }
      }
      if (!changed) return state;
      const newAnchor =
        state.anchorThreadId !== null && toRemove.has(state.anchorThreadId)
          ? null
          : state.anchorThreadId;
      return { selectedThreadIds: next, anchorThreadId: newAnchor };
    });
  },
  hasSelection: () => get().selectedThreadIds.size > 0,
}));
