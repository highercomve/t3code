export declare function shouldHideCollapsedToastContent(
  visibleToastIndex: number,
  visibleToastCount: number,
): boolean;
type ToastWithHeight = {
  height?: number | null | undefined;
};
type VisibleToastLayoutItem<TToast extends object> = {
  toast: TToast;
  visibleIndex: number;
  offsetY: number;
};
export declare function buildVisibleToastLayout<TToast extends object>(
  visibleToasts: readonly (TToast & ToastWithHeight)[],
): {
  frontmostHeight: number;
  items: VisibleToastLayoutItem<TToast & ToastWithHeight>[];
};
export {};
