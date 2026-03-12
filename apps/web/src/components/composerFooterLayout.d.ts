export declare const COMPOSER_FOOTER_COMPACT_BREAKPOINT_PX = 620;
export declare const COMPOSER_FOOTER_WIDE_ACTIONS_COMPACT_BREAKPOINT_PX = 720;
export declare function shouldUseCompactComposerFooter(
  width: number | null,
  options?: {
    hasWideActions?: boolean;
  },
): boolean;
