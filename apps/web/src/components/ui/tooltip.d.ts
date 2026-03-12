import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
declare const TooltipCreateHandle: typeof TooltipPrimitive.createHandle;
declare const TooltipProvider: import("react").FC<import("@base-ui/react").TooltipProviderProps>;
declare const Tooltip: <Payload>(
  props: TooltipPrimitive.Root.Props<Payload>,
) => import("react/jsx-runtime").JSX.Element;
declare function TooltipTrigger(
  props: TooltipPrimitive.Trigger.Props,
): import("react/jsx-runtime").JSX.Element;
declare function TooltipPopup({
  className,
  align,
  sideOffset,
  side,
  anchor,
  children,
  ...props
}: TooltipPrimitive.Popup.Props & {
  align?: TooltipPrimitive.Positioner.Props["align"];
  side?: TooltipPrimitive.Positioner.Props["side"];
  sideOffset?: TooltipPrimitive.Positioner.Props["sideOffset"];
  anchor?: TooltipPrimitive.Positioner.Props["anchor"];
}): import("react/jsx-runtime").JSX.Element;
export { TooltipCreateHandle, TooltipProvider, Tooltip, TooltipTrigger, TooltipPopup };
