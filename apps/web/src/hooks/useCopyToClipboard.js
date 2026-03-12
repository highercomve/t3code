import * as React from "react";
export function useCopyToClipboard({ timeout = 2000, onCopy, onError } = {}) {
  const [isCopied, setIsCopied] = React.useState(false);
  const timeoutIdRef = React.useRef(null);
  const onCopyRef = React.useRef(onCopy);
  const onErrorRef = React.useRef(onError);
  const timeoutRef = React.useRef(timeout);
  onCopyRef.current = onCopy;
  onErrorRef.current = onError;
  timeoutRef.current = timeout;
  const copyToClipboard = React.useCallback((value, ctx) => {
    if (typeof window === "undefined" || !navigator.clipboard?.writeText) {
      onErrorRef.current?.(new Error("Clipboard API unavailable."), ctx);
      return;
    }
    if (!value) return;
    navigator.clipboard.writeText(value).then(
      () => {
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
        }
        setIsCopied(true);
        onCopyRef.current?.(ctx);
        if (timeoutRef.current !== 0) {
          timeoutIdRef.current = setTimeout(() => {
            setIsCopied(false);
            timeoutIdRef.current = null;
          }, timeoutRef.current);
        }
      },
      (error) => {
        if (onErrorRef.current) {
          onErrorRef.current(error, ctx);
        } else {
          console.error(error);
        }
      },
    );
  }, []);
  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);
  return { copyToClipboard, isCopied };
}
