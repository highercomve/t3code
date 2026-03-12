import type { ContextMenuItem } from "@t3tools/contracts";
/**
 * Imperative DOM-based context menu for non-Electron environments.
 * Shows a positioned dropdown and returns a promise that resolves
 * with the clicked item id, or null if dismissed.
 */
export declare function showContextMenuFallback<T extends string>(
  items: readonly ContextMenuItem<T>[],
  position?: {
    x: number;
    y: number;
  },
): Promise<T | null>;
