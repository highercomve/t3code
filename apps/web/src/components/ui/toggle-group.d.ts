import type { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Separator } from "~/components/ui/separator";
import { type toggleVariants } from "~/components/ui/toggle";
declare function ToggleGroup({
  className,
  variant,
  size,
  orientation,
  children,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants>): import("react/jsx-runtime").JSX.Element;
declare function Toggle({
  className,
  children,
  variant,
  size,
  ...props
}: TogglePrimitive.Props &
  VariantProps<typeof toggleVariants>): import("react/jsx-runtime").JSX.Element;
declare function ToggleGroupSeparator({
  className,
  orientation,
  ...props
}: {
  className?: string;
} & React.ComponentProps<typeof Separator>): import("react/jsx-runtime").JSX.Element;
export { ToggleGroup, Toggle, Toggle as ToggleGroupItem, ToggleGroupSeparator };
