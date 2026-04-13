export function shouldHideCollapsedToastContent(visibleToastIndex, visibleToastCount) {
  // Keep the front-most toast readable even if Base UI marks it as "behind"
  // due to toasts hidden by thread filtering.
  if (visibleToastCount <= 1) return false;
  return visibleToastIndex > 0;
}
export function buildVisibleToastLayout(visibleToasts) {
  let offsetY = 0;
  return {
    frontmostHeight: normalizeToastHeight(visibleToasts[0]?.height),
    items: visibleToasts.map((toast, visibleIndex) => {
      const item = {
        toast,
        visibleIndex,
        offsetY,
      };
      offsetY += normalizeToastHeight(toast.height);
      return item;
    }),
  };
}
function normalizeToastHeight(height) {
  return typeof height === "number" && Number.isFinite(height) && height > 0 ? height : 0;
}
export function shouldRenderThreadScopedToast(data, activeThreadRef) {
  if (data?.threadRef) {
    return (
      activeThreadRef !== null &&
      data.threadRef.environmentId === activeThreadRef.environmentId &&
      data.threadRef.threadId === activeThreadRef.threadId
    );
  }
  const toastThreadId = data?.threadId;
  if (!toastThreadId) {
    return true;
  }
  return activeThreadRef?.threadId === toastThreadId;
}
