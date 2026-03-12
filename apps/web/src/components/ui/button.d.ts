import { useRender } from "@base-ui/react/use-render";
import { type VariantProps } from "class-variance-authority";
import type * as React from "react";
declare const buttonVariants: (
  props?:
    | ({
        size?:
          | "default"
          | "icon"
          | "icon-lg"
          | "icon-sm"
          | "icon-xl"
          | "icon-xs"
          | "lg"
          | "sm"
          | "xl"
          | "xs"
          | null
          | undefined;
        variant?:
          | "default"
          | "link"
          | "ghost"
          | "outline"
          | "destructive"
          | "destructive-outline"
          | "secondary"
          | null
          | undefined;
      } & import("class-variance-authority/types").ClassProp)
    | undefined,
) => string;
interface ButtonProps extends useRender.ComponentProps<"button"> {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
}
declare function Button({
  className,
  variant,
  size,
  render,
  ...props
}: ButtonProps): React.ReactElement<unknown, string | React.JSXElementConstructor<any>>;
export { Button, buttonVariants };
