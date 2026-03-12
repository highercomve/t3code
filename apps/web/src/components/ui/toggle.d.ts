import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { type VariantProps } from "class-variance-authority";
declare const toggleVariants: (
  props?:
    | ({
        size?: "default" | "lg" | "sm" | "xs" | null | undefined;
        variant?: "default" | "outline" | null | undefined;
      } & import("class-variance-authority/types").ClassProp)
    | undefined,
) => string;
declare function Toggle({
  className,
  variant,
  size,
  ...props
}: TogglePrimitive.Props &
  VariantProps<typeof toggleVariants>): import("react/jsx-runtime").JSX.Element;
export { Toggle, toggleVariants };
