export declare const COMPOSER_FOOTER_COMPACT_BREAKPOINT_PX = 620;
export declare const COMPOSER_FOOTER_WIDE_ACTIONS_COMPACT_BREAKPOINT_PX = 780;
export declare const COMPOSER_PRIMARY_ACTIONS_COMPACT_BREAKPOINT_PX = 780;
export declare function shouldUseCompactComposerFooter(
  width: number | null,
  options?: {
    hasWideActions?: boolean;
  },
): boolean;
export declare function shouldUseCompactComposerPrimaryActions(
  width: number | null,
  options?: {
    hasWideActions?: boolean;
  },
): boolean;
