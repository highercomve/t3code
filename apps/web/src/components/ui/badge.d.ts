import { useRender } from "@base-ui/react/use-render";
import { type VariantProps } from "class-variance-authority";
declare const badgeVariants: (props?: ({
    size?: "default" | "lg" | "sm" | null | undefined;
    variant?: "success" | "error" | "warning" | "default" | "info" | "destructive" | "outline" | "secondary" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
interface BadgeProps extends useRender.ComponentProps<"span"> {
    variant?: VariantProps<typeof badgeVariants>["variant"];
    size?: VariantProps<typeof badgeVariants>["size"];
}
declare function Badge({ className, variant, size, render, ...props }: BadgeProps): import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>;
export { Badge, badgeVariants };
