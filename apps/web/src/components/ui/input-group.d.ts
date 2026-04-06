import { type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { type InputProps } from "~/components/ui/input";
import { type TextareaProps } from "~/components/ui/textarea";
declare function InputGroup({
  className,
  ...props
}: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare const inputGroupAddonVariants: (
  props?:
    | ({
        align?: "inline-start" | "block-end" | "block-start" | "inline-end" | null | undefined;
      } & import("class-variance-authority/types").ClassProp)
    | undefined,
) => string;
declare function InputGroupAddon({
  className,
  align,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof inputGroupAddonVariants>): import("react/jsx-runtime").JSX.Element;
declare function InputGroupText({
  className,
  ...props
}: React.ComponentProps<"span">): import("react/jsx-runtime").JSX.Element;
declare function InputGroupInput({
  className,
  ...props
}: InputProps): import("react/jsx-runtime").JSX.Element;
declare function InputGroupTextarea({
  className,
  ...props
}: TextareaProps): import("react/jsx-runtime").JSX.Element;
export { InputGroup, InputGroupAddon, InputGroupText, InputGroupInput, InputGroupTextarea };
