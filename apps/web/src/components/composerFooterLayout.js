export const COMPOSER_FOOTER_COMPACT_BREAKPOINT_PX = 620;
export const COMPOSER_FOOTER_WIDE_ACTIONS_COMPACT_BREAKPOINT_PX = 720;
export function shouldUseCompactComposerFooter(width, options) {
  const breakpoint = options?.hasWideActions
    ? COMPOSER_FOOTER_WIDE_ACTIONS_COMPACT_BREAKPOINT_PX
    : COMPOSER_FOOTER_COMPACT_BREAKPOINT_PX;
  return width !== null && width < breakpoint;
}
