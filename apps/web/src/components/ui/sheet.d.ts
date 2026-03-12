import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
declare const Sheet: typeof SheetPrimitive.Root;
declare const SheetPortal: import("react").ForwardRefExoticComponent<
  Omit<import("@base-ui/react").DialogPortalProps, "ref"> &
    import("react").RefAttributes<HTMLDivElement>
>;
declare function SheetTrigger(
  props: SheetPrimitive.Trigger.Props,
): import("react/jsx-runtime").JSX.Element;
declare function SheetClose(
  props: SheetPrimitive.Close.Props,
): import("react/jsx-runtime").JSX.Element;
declare function SheetBackdrop({
  className,
  ...props
}: SheetPrimitive.Backdrop.Props): import("react/jsx-runtime").JSX.Element;
declare function SheetPopup({
  className,
  children,
  showCloseButton,
  keepMounted,
  side,
  variant,
  ...props
}: SheetPrimitive.Popup.Props & {
  showCloseButton?: boolean;
  keepMounted?: boolean;
  side?: "right" | "left" | "top" | "bottom";
  variant?: "default" | "inset";
}): import("react/jsx-runtime").JSX.Element;
declare function SheetHeader({
  className,
  ...props
}: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function SheetFooter({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "bare";
}): import("react/jsx-runtime").JSX.Element;
declare function SheetTitle({
  className,
  ...props
}: SheetPrimitive.Title.Props): import("react/jsx-runtime").JSX.Element;
declare function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props): import("react/jsx-runtime").JSX.Element;
declare function SheetPanel({
  className,
  scrollFade,
  ...props
}: React.ComponentProps<"div"> & {
  scrollFade?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export {
  Sheet,
  SheetTrigger,
  SheetPortal,
  SheetClose,
  SheetBackdrop,
  SheetBackdrop as SheetOverlay,
  SheetPopup,
  SheetPopup as SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetPanel,
};
