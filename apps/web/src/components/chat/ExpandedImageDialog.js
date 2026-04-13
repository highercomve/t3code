import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
export const ExpandedImageDialog = memo(function ExpandedImageDialog({
  preview: initialPreview,
  onClose,
}) {
  const [preview, setPreview] = useState(initialPreview);
  // Sync when the parent hands us a new preview reference.
  useEffect(() => {
    setPreview(initialPreview);
  }, [initialPreview]);
  const navigateImage = useCallback((direction) => {
    setPreview((existing) => {
      if (existing.images.length <= 1) return existing;
      const nextIndex =
        (existing.index + direction + existing.images.length) % existing.images.length;
      if (nextIndex === existing.index) return existing;
      return { ...existing, index: nextIndex };
    });
  }, []);
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }
      if (preview.images.length <= 1) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
        navigateImage(-1);
        return;
      }
      if (event.key !== "ArrowRight") return;
      event.preventDefault();
      event.stopPropagation();
      navigateImage(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigateImage, onClose, preview.images.length]);
  const item = preview.images[preview.index];
  if (!item) return null;
  return _jsxs("div", {
    className:
      "fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 [-webkit-app-region:no-drag]",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Expanded image preview",
    children: [
      _jsx("button", {
        type: "button",
        className: "absolute inset-0 z-0 cursor-zoom-out",
        "aria-label": "Close image preview",
        onClick: onClose,
      }),
      preview.images.length > 1 &&
        _jsx(Button, {
          type: "button",
          size: "icon",
          variant: "ghost",
          className:
            "absolute left-2 top-1/2 z-20 -translate-y-1/2 text-white/90 hover:bg-white/10 hover:text-white sm:left-6",
          "aria-label": "Previous image",
          onClick: () => navigateImage(-1),
          children: _jsx(ChevronLeftIcon, { className: "size-5" }),
        }),
      _jsxs("div", {
        className: "relative isolate z-10 max-h-[92vh] max-w-[92vw]",
        children: [
          _jsx(Button, {
            type: "button",
            size: "icon-xs",
            variant: "ghost",
            className: "absolute right-2 top-2",
            onClick: onClose,
            "aria-label": "Close image preview",
            children: _jsx(XIcon, {}),
          }),
          _jsx("img", {
            src: item.src,
            alt: item.name,
            className:
              "max-h-[86vh] max-w-[92vw] select-none rounded-lg border border-border/70 bg-background object-contain shadow-2xl",
            draggable: false,
          }),
          _jsxs("p", {
            className: "mt-2 max-w-[92vw] truncate text-center text-xs text-muted-foreground/80",
            children: [
              item.name,
              preview.images.length > 1 ? ` (${preview.index + 1}/${preview.images.length})` : "",
            ],
          }),
        ],
      }),
      preview.images.length > 1 &&
        _jsx(Button, {
          type: "button",
          size: "icon",
          variant: "ghost",
          className:
            "absolute right-2 top-1/2 z-20 -translate-y-1/2 text-white/90 hover:bg-white/10 hover:text-white sm:right-6",
          "aria-label": "Next image",
          onClick: () => navigateImage(1),
          children: _jsx(ChevronRightIcon, { className: "size-5" }),
        }),
    ],
  });
});
