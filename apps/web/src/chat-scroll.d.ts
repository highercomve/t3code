export declare const AUTO_SCROLL_BOTTOM_THRESHOLD_PX = 64;
interface ScrollPosition {
  scrollTop: number;
  clientHeight: number;
  scrollHeight: number;
}
export declare function isScrollContainerNearBottom(
  position: ScrollPosition,
  thresholdPx?: number,
): boolean;
export {};
