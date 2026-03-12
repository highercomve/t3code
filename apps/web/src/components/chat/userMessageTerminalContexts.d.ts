export declare function buildInlineTerminalContextText(
  contexts: ReadonlyArray<{
    header: string;
  }>,
): string;
export declare function formatInlineTerminalContextLabel(header: string): string;
export declare function textContainsInlineTerminalContextLabels(
  text: string,
  contexts: ReadonlyArray<{
    header: string;
  }>,
): boolean;
