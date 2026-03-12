export const AUTO_SCROLL_BOTTOM_THRESHOLD_PX = 64;
export function isScrollContainerNearBottom(
  position,
  thresholdPx = AUTO_SCROLL_BOTTOM_THRESHOLD_PX,
) {
  const threshold = Number.isFinite(thresholdPx)
    ? Math.max(0, thresholdPx)
    : AUTO_SCROLL_BOTTOM_THRESHOLD_PX;
  const { scrollTop, clientHeight, scrollHeight } = position;
  if (![scrollTop, clientHeight, scrollHeight].every(Number.isFinite)) {
    return true;
  }
  const distanceFromBottom = scrollHeight - clientHeight - scrollTop;
  return distanceFromBottom <= threshold;
}
