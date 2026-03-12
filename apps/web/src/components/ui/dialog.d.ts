import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
declare const DialogCreateHandle: typeof DialogPrimitive.createHandle;
declare const Dialog: typeof DialogPrimitive.Root;
declare const DialogPortal: import("react").ForwardRefExoticComponent<
  Omit<import("@base-ui/react").DialogPortalProps, "ref"> &
    import("react").RefAttributes<HTMLDivElement>
>;
declare function DialogTrigger(
  props: DialogPrimitive.Trigger.Props,
): import("react/jsx-runtime").JSX.Element;
declare function DialogClose(
  props: DialogPrimitive.Close.Props,
): import("react/jsx-runtime").JSX.Element;
declare function DialogBackdrop({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props): import("react/jsx-runtime").JSX.Element;
declare function DialogViewport({
  className,
  ...props
}: DialogPrimitive.Viewport.Props): import("react/jsx-runtime").JSX.Element;
declare function DialogPopup({
  className,
  children,
  showCloseButton,
  bottomStickOnMobile,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
  bottomStickOnMobile?: boolean;
}): import("react/jsx-runtime").JSX.Element;
declare function DialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function DialogFooter({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "bare";
}): import("react/jsx-runtime").JSX.Element;
declare function DialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props): import("react/jsx-runtime").JSX.Element;
declare function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props): import("react/jsx-runtime").JSX.Element;
declare function DialogPanel({
  className,
  scrollFade,
  ...props
}: React.ComponentProps<"div"> & {
  scrollFade?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export {
  DialogCreateHandle,
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogBackdrop,
  DialogBackdrop as DialogOverlay,
  DialogPopup,
  DialogPopup as DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogPanel,
  DialogViewport,
};
