import { useRender } from "@base-ui/react/use-render";
import { type VariantProps } from "class-variance-authority";
declare const badgeVariants: (
  props?:
    | ({
        size?: "default" | "lg" | "sm" | null | undefined;
        variant?:
          | "default"
          | "error"
          | "info"
          | "warning"
          | "success"
          | "outline"
          | "destructive"
          | "secondary"
          | null
          | undefined;
      } & import("class-variance-authority/types").ClassProp)
    | undefined,
) => string;
interface BadgeProps extends useRender.ComponentProps<"span"> {
  variant?: VariantProps<typeof badgeVariants>["variant"];
  size?: VariantProps<typeof badgeVariants>["size"];
}
declare function Badge({
  className,
  variant,
  size,
  render,
  ...props
}: BadgeProps): import("react").ReactElement<
  unknown,
  string | import("react").JSXElementConstructor<any>
>;
export { Badge, badgeVariants };
