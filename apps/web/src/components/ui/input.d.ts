import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";
type InputProps = Omit<InputPrimitive.Props & React.RefAttributes<HTMLInputElement>, "size"> & {
  size?: "sm" | "default" | "lg" | number;
  unstyled?: boolean;
  nativeInput?: boolean;
};
declare function Input({
  className,
  size,
  unstyled,
  nativeInput,
  ...props
}: InputProps): import("react/jsx-runtime").JSX.Element;
export { Input, type InputProps };
