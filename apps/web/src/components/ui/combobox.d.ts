import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import * as React from "react";
declare function Combobox<Value, Multiple extends boolean | undefined = false>(
  props: ComboboxPrimitive.Root.Props<Value, Multiple>,
): import("react/jsx-runtime").JSX.Element;
declare function ComboboxChipsInput({
  className,
  size,
  ...props
}: Omit<ComboboxPrimitive.Input.Props, "size"> & {
  size?: "sm" | "default" | "lg" | number;
  ref?: React.Ref<HTMLInputElement>;
}): import("react/jsx-runtime").JSX.Element;
declare function ComboboxInput({
  className,
  inputClassName,
  showTrigger,
  showClear,
  startAddon,
  size,
  ...props
}: Omit<ComboboxPrimitive.Input.Props, "size"> & {
  inputClassName?: string;
  showTrigger?: boolean;
  showClear?: boolean;
  startAddon?: React.ReactNode;
  size?: "sm" | "default" | "lg" | number;
  ref?: React.Ref<HTMLInputElement>;
}): import("react/jsx-runtime").JSX.Element;
declare function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props): import("react/jsx-runtime").JSX.Element;
declare function ComboboxPopup({
  className,
  children,
  side,
  sideOffset,
  alignOffset,
  align,
  anchor: anchorProp,
  ...props
}: ComboboxPrimitive.Popup.Props & {
  align?: ComboboxPrimitive.Positioner.Props["align"];
  sideOffset?: ComboboxPrimitive.Positioner.Props["sideOffset"];
  alignOffset?: ComboboxPrimitive.Positioner.Props["alignOffset"];
  side?: ComboboxPrimitive.Positioner.Props["side"];
  anchor?: ComboboxPrimitive.Positioner.Props["anchor"];
}): import("react/jsx-runtime").JSX.Element;
declare function ComboboxItem({
  className,
  children,
  hideIndicator,
  ...props
}: ComboboxPrimitive.Item.Props & {
  hideIndicator?: boolean;
}): import("react/jsx-runtime").JSX.Element;
declare function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props): import("react/jsx-runtime").JSX.Element;
declare function ComboboxGroup({
  className,
  ...props
}: ComboboxPrimitive.Group.Props): import("react/jsx-runtime").JSX.Element;
declare function ComboboxGroupLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props): import("react/jsx-runtime").JSX.Element;
declare function ComboboxEmpty({
  className,
  ...props
}: ComboboxPrimitive.Empty.Props): import("react/jsx-runtime").JSX.Element;
declare function ComboboxRow({
  className,
  ...props
}: ComboboxPrimitive.Row.Props): import("react/jsx-runtime").JSX.Element;
declare function ComboboxValue({
  ...props
}: ComboboxPrimitive.Value.Props): import("react/jsx-runtime").JSX.Element;
declare function ComboboxList({
  className,
  ...props
}: ComboboxPrimitive.List.Props): import("react/jsx-runtime").JSX.Element;
declare function ComboboxClear({
  className,
  ...props
}: ComboboxPrimitive.Clear.Props): import("react/jsx-runtime").JSX.Element;
declare function ComboboxStatus({
  className,
  ...props
}: ComboboxPrimitive.Status.Props): import("react/jsx-runtime").JSX.Element;
declare function ComboboxCollection(
  props: ComboboxPrimitive.Collection.Props,
): import("react/jsx-runtime").JSX.Element;
declare function ComboboxChips({
  className,
  children,
  startAddon,
  ...props
}: ComboboxPrimitive.Chips.Props & {
  startAddon?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
declare function ComboboxChip({
  children,
  ...props
}: ComboboxPrimitive.Chip.Props): import("react/jsx-runtime").JSX.Element;
declare const useComboboxFilter: typeof ComboboxPrimitive.useFilter;
export {
  Combobox,
  ComboboxChipsInput,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxPopup,
  ComboboxItem,
  ComboboxSeparator,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxEmpty,
  ComboboxValue,
  ComboboxList,
  ComboboxClear,
  ComboboxStatus,
  ComboboxRow,
  ComboboxCollection,
  ComboboxChips,
  ComboboxChip,
  useComboboxFilter,
};
