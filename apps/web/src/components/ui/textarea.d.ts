import type * as React from "react";
type TextareaProps = React.ComponentProps<"textarea"> & {
  size?: "sm" | "default" | "lg" | number;
  unstyled?: boolean;
};
declare function Textarea({
  className,
  size,
  unstyled,
  ...props
}: TextareaProps): import("react/jsx-runtime").JSX.Element;
export { Textarea, type TextareaProps };
