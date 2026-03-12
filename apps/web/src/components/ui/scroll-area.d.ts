import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
declare function ScrollArea({
  className,
  children,
  scrollFade,
  scrollbarGutter,
  hideScrollbars,
  ...props
}: ScrollAreaPrimitive.Root.Props & {
  scrollFade?: boolean;
  scrollbarGutter?: boolean;
  hideScrollbars?: boolean;
}): import("react/jsx-runtime").JSX.Element;
declare function ScrollBar({
  className,
  orientation,
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props): import("react/jsx-runtime").JSX.Element;
export { ScrollArea, ScrollBar };
