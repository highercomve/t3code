import { jsx as _jsx } from "react/jsx-runtime";
export function SplashScreen() {
  return _jsx("div", {
    className: "flex min-h-screen items-center justify-center bg-background",
    children: _jsx("div", {
      className: "flex size-24 items-center justify-center",
      "aria-label": "T3 Code splash screen",
      children: _jsx("img", {
        alt: "T3 Code",
        className: "size-16 object-contain",
        src: "/apple-touch-icon.png",
      }),
    }),
  });
}
