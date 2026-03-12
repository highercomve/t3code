import { Select as SelectPrimitive } from "@base-ui/react/select";
import { useRender } from "@base-ui/react/use-render";
import { type VariantProps } from "class-variance-authority";
import type * as React from "react";
declare const Select: typeof SelectPrimitive.Root;
declare const selectTriggerVariants: (
  props?:
    | ({
        variant?: "default" | "ghost" | null | undefined;
        size?: "default" | "lg" | "sm" | "xs" | null | undefined;
      } & import("class-variance-authority/types").ClassProp)
    | undefined,
) => string;
interface SelectButtonProps extends useRender.ComponentProps<"button"> {
  size?: VariantProps<typeof selectTriggerVariants>["size"];
  variant?: VariantProps<typeof selectTriggerVariants>["variant"];
}
declare function SelectButton({
  className,
  size,
  variant,
  render,
  children,
  ...props
}: SelectButtonProps): React.ReactElement<unknown, string | React.JSXElementConstructor<any>>;
declare function SelectTrigger({
  className,
  size,
  variant,
  children,
  ...props
}: SelectPrimitive.Trigger.Props &
  VariantProps<typeof selectTriggerVariants>): import("react/jsx-runtime").JSX.Element;
declare function SelectValue({
  className,
  ...props
}: SelectPrimitive.Value.Props): import("react/jsx-runtime").JSX.Element;
declare function SelectPopup({
  className,
  children,
  side,
  sideOffset,
  align,
  alignOffset,
  alignItemWithTrigger,
  anchor,
  ...props
}: SelectPrimitive.Popup.Props & {
  side?: SelectPrimitive.Positioner.Props["side"];
  sideOffset?: SelectPrimitive.Positioner.Props["sideOffset"];
  align?: SelectPrimitive.Positioner.Props["align"];
  alignOffset?: SelectPrimitive.Positioner.Props["alignOffset"];
  alignItemWithTrigger?: SelectPrimitive.Positioner.Props["alignItemWithTrigger"];
  anchor?: SelectPrimitive.Positioner.Props["anchor"];
}): import("react/jsx-runtime").JSX.Element;
declare function SelectItem({
  className,
  children,
  hideIndicator,
  ...props
}: SelectPrimitive.Item.Props & {
  hideIndicator?: boolean;
}): import("react/jsx-runtime").JSX.Element;
declare function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props): import("react/jsx-runtime").JSX.Element;
declare function SelectGroup(
  props: SelectPrimitive.Group.Props,
): import("react/jsx-runtime").JSX.Element;
declare function SelectGroupLabel(
  props: SelectPrimitive.GroupLabel.Props,
): import("react/jsx-runtime").JSX.Element;
export {
  Select,
  SelectTrigger,
  SelectButton,
  selectTriggerVariants,
  SelectValue,
  SelectPopup,
  SelectPopup as SelectContent,
  SelectItem,
  SelectSeparator,
  SelectGroup,
  SelectGroupLabel,
};
