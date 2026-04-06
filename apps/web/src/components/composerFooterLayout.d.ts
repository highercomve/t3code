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
export declare function measureComposerFooterOverflowPx(input: {
  footerContentWidth: number | null;
  leadingContentWidth: number | null;
  actionsWidth: number | null;
}): number | null;
export declare function shouldForceCompactComposerFooterForFit(input: {
  footerContentWidth: number | null;
  leadingContentWidth: number | null;
  actionsWidth: number | null;
}): boolean;
export declare function resolveComposerFooterContentWidth(input: {
  footerWidth: number | null;
  paddingLeft: number | null;
  paddingRight: number | null;
}): number | null;
