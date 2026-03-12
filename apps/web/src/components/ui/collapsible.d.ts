import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
declare function Collapsible({
  ...props
}: CollapsiblePrimitive.Root.Props): import("react/jsx-runtime").JSX.Element;
declare function CollapsibleTrigger({
  className,
  ...props
}: CollapsiblePrimitive.Trigger.Props): import("react/jsx-runtime").JSX.Element;
declare function CollapsiblePanel({
  className,
  ...props
}: CollapsiblePrimitive.Panel.Props): import("react/jsx-runtime").JSX.Element;
export {
  Collapsible,
  CollapsibleTrigger,
  CollapsiblePanel,
  CollapsiblePanel as CollapsibleContent,
};
