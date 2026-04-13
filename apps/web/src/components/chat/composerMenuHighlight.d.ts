export declare function resolveComposerMenuActiveItemId(input: {
  items: ReadonlyArray<{
    id: string;
  }>;
  highlightedItemId: string | null;
  currentSearchKey: string | null;
  highlightedSearchKey: string | null;
}): string | null;
