import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
declare const PopoverCreateHandle: typeof PopoverPrimitive.createHandle;
declare const Popover: typeof PopoverPrimitive.Root;
declare function PopoverTrigger({
  className,
  children,
  ...props
}: PopoverPrimitive.Trigger.Props): import("react/jsx-runtime").JSX.Element;
declare function PopoverPopup({
  children,
  className,
  side,
  align,
  sideOffset,
  alignOffset,
  tooltipStyle,
  anchor,
  ...props
}: PopoverPrimitive.Popup.Props & {
  side?: PopoverPrimitive.Positioner.Props["side"];
  align?: PopoverPrimitive.Positioner.Props["align"];
  sideOffset?: PopoverPrimitive.Positioner.Props["sideOffset"];
  alignOffset?: PopoverPrimitive.Positioner.Props["alignOffset"];
  tooltipStyle?: boolean;
  anchor?: PopoverPrimitive.Positioner.Props["anchor"];
}): import("react/jsx-runtime").JSX.Element;
declare function PopoverClose({
  ...props
}: PopoverPrimitive.Close.Props): import("react/jsx-runtime").JSX.Element;
declare function PopoverTitle({
  className,
  ...props
}: PopoverPrimitive.Title.Props): import("react/jsx-runtime").JSX.Element;
declare function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props): import("react/jsx-runtime").JSX.Element;
export {
  PopoverCreateHandle,
  Popover,
  PopoverTrigger,
  PopoverPopup,
  PopoverPopup as PopoverContent,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
};
