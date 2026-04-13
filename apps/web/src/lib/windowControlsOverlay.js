const WCO_CLASS_NAME = "wco";
function getWindowControlsOverlay() {
  if (typeof navigator === "undefined") {
    return null;
  }
  return navigator.windowControlsOverlay ?? null;
}
export function syncDocumentWindowControlsOverlayClass() {
  if (typeof document === "undefined") {
    return () => {};
  }
  const overlay = getWindowControlsOverlay();
  const update = () => {
    document.documentElement.classList.toggle(WCO_CLASS_NAME, overlay !== null && overlay.visible);
  };
  update();
  if (!overlay) {
    return () => {};
  }
  overlay.addEventListener("geometrychange", update);
  return () => {
    overlay.removeEventListener("geometrychange", update);
  };
}
