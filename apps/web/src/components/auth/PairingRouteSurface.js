import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { startTransition, useEffect, useRef, useState, useCallback } from "react";
import { APP_DISPLAY_NAME } from "../../branding";
import {
  peekPairingTokenFromUrl,
  stripPairingTokenFromUrl,
  submitServerAuthCredential,
} from "../../environments/primary";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
export function PairingPendingSurface() {
  return _jsxs("div", {
    className:
      "relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground sm:px-6",
    children: [
      _jsxs("div", {
        className: "pointer-events-none absolute inset-0 opacity-80",
        children: [
          _jsx("div", {
            className:
              "absolute inset-x-0 top-0 h-44 bg-[radial-gradient(44rem_16rem_at_top,color-mix(in_srgb,var(--color-emerald-500)_14%,transparent),transparent)]",
          }),
          _jsx("div", {
            className:
              "absolute inset-y-0 left-0 w-72 bg-[radial-gradient(28rem_18rem_at_left,color-mix(in_srgb,var(--color-sky-500)_10%,transparent),transparent)]",
          }),
          _jsx("div", {
            className:
              "absolute inset-0 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--background)_90%,var(--color-black))_0%,var(--background)_55%)]",
          }),
        ],
      }),
      _jsxs("section", {
        className:
          "relative w-full max-w-xl rounded-2xl border border-border/80 bg-card/90 p-6 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-8",
        children: [
          _jsx("p", {
            className:
              "text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase",
            children: APP_DISPLAY_NAME,
          }),
          _jsx("h1", {
            className: "mt-3 text-2xl font-semibold tracking-tight sm:text-3xl",
            children: "Pairing with this environment",
          }),
          _jsx("p", {
            className: "mt-2 text-sm leading-relaxed text-muted-foreground",
            children: "Validating the pairing link and preparing your session.",
          }),
        ],
      }),
    ],
  });
}
export function PairingRouteSurface({ auth, initialErrorMessage, onAuthenticated }) {
  const autoPairTokenRef = useRef(peekPairingTokenFromUrl());
  const [credential, setCredential] = useState(() => autoPairTokenRef.current ?? "");
  const [errorMessage, setErrorMessage] = useState(initialErrorMessage ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const autoSubmitAttemptedRef = useRef(false);
  const submitCredential = useCallback(
    async (nextCredential) => {
      setIsSubmitting(true);
      setErrorMessage("");
      const submitError = await submitServerAuthCredential(nextCredential).then(
        () => null,
        (error) => errorMessageFromUnknown(error),
      );
      setIsSubmitting(false);
      if (submitError) {
        setErrorMessage(submitError);
        return;
      }
      startTransition(() => {
        onAuthenticated();
      });
    },
    [onAuthenticated],
  );
  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault();
      await submitCredential(credential);
    },
    [submitCredential, credential],
  );
  useEffect(() => {
    const token = autoPairTokenRef.current;
    if (!token || autoSubmitAttemptedRef.current) {
      return;
    }
    autoSubmitAttemptedRef.current = true;
    stripPairingTokenFromUrl();
    void submitCredential(token);
  }, [submitCredential]);
  return _jsxs("div", {
    className:
      "relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground sm:px-6",
    children: [
      _jsxs("div", {
        className: "pointer-events-none absolute inset-0 opacity-80",
        children: [
          _jsx("div", {
            className:
              "absolute inset-x-0 top-0 h-44 bg-[radial-gradient(44rem_16rem_at_top,color-mix(in_srgb,var(--color-emerald-500)_14%,transparent),transparent)]",
          }),
          _jsx("div", {
            className:
              "absolute inset-y-0 left-0 w-72 bg-[radial-gradient(28rem_18rem_at_left,color-mix(in_srgb,var(--color-sky-500)_10%,transparent),transparent)]",
          }),
          _jsx("div", {
            className:
              "absolute inset-0 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--background)_90%,var(--color-black))_0%,var(--background)_55%)]",
          }),
        ],
      }),
      _jsxs("section", {
        className:
          "relative w-full max-w-xl rounded-2xl border border-border/80 bg-card/90 p-6 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-8",
        children: [
          _jsx("p", {
            className:
              "text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase",
            children: APP_DISPLAY_NAME,
          }),
          _jsx("h1", {
            className: "mt-3 text-2xl font-semibold tracking-tight sm:text-3xl",
            children: "Pair with this environment",
          }),
          _jsx("p", {
            className: "mt-2 text-sm leading-relaxed text-muted-foreground",
            children: describeAuthGate(auth.bootstrapMethods),
          }),
          _jsxs("form", {
            className: "mt-6 space-y-4",
            onSubmit: (event) => void handleSubmit(event),
            children: [
              _jsxs("div", {
                className: "space-y-2",
                children: [
                  _jsx("label", {
                    className: "text-sm font-medium",
                    htmlFor: "pairing-token",
                    children: "Pairing token",
                  }),
                  _jsx(Input, {
                    id: "pairing-token",
                    autoCapitalize: "none",
                    autoComplete: "off",
                    autoCorrect: "off",
                    disabled: isSubmitting,
                    nativeInput: true,
                    onChange: (event) => setCredential(event.currentTarget.value),
                    placeholder: "Paste a one-time token or pairing secret",
                    spellCheck: false,
                    value: credential,
                  }),
                ],
              }),
              errorMessage
                ? _jsx("div", {
                    className:
                      "rounded-lg border border-destructive/30 bg-destructive/6 px-3 py-2 text-sm text-destructive",
                    children: errorMessage,
                  })
                : null,
              _jsxs("div", {
                className: "flex flex-wrap gap-2",
                children: [
                  _jsx(Button, {
                    disabled: isSubmitting,
                    size: "sm",
                    type: "submit",
                    children: isSubmitting ? "Pairing..." : "Continue",
                  }),
                  _jsx(Button, {
                    disabled: isSubmitting,
                    onClick: () => window.location.reload(),
                    size: "sm",
                    variant: "outline",
                    children: "Reload app",
                  }),
                ],
              }),
            ],
          }),
          _jsx("div", {
            className:
              "mt-6 rounded-lg border border-border/70 bg-background/55 px-3 py-3 text-xs leading-relaxed text-muted-foreground",
            children: describeSupportedMethods(auth.bootstrapMethods),
          }),
        ],
      }),
    ],
  });
}
function errorMessageFromUnknown(error) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }
  return "Authentication failed.";
}
function describeAuthGate(bootstrapMethods) {
  if (bootstrapMethods.includes("desktop-bootstrap")) {
    return "This environment expects a trusted pairing credential before the app can connect.";
  }
  return "Enter a pairing token to start a session with this environment.";
}
function describeSupportedMethods(bootstrapMethods) {
  if (
    bootstrapMethods.includes("desktop-bootstrap") &&
    bootstrapMethods.includes("one-time-token")
  ) {
    return "Desktop-managed pairing and one-time pairing tokens are both accepted for this environment.";
  }
  if (bootstrapMethods.includes("desktop-bootstrap")) {
    return "This environment is desktop-managed. Open it from the desktop app or paste a bootstrap credential if one was issued explicitly.";
  }
  return "This environment accepts one-time pairing tokens. Pairing links can open this page directly, or you can paste the token here.";
}
