import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
declare const AlertDialogCreateHandle: typeof AlertDialogPrimitive.createHandle;
declare const AlertDialog: typeof AlertDialogPrimitive.Root;
declare const AlertDialogPortal: import("react").ForwardRefExoticComponent<
  Omit<import("@base-ui/react").DialogPortalProps, "ref"> &
    import("react").RefAttributes<HTMLDivElement>
>;
declare function AlertDialogTrigger(
  props: AlertDialogPrimitive.Trigger.Props,
): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogBackdrop({
  className,
  ...props
}: AlertDialogPrimitive.Backdrop.Props): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogViewport({
  className,
  ...props
}: AlertDialogPrimitive.Viewport.Props): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogPopup({
  className,
  bottomStickOnMobile,
  ...props
}: AlertDialogPrimitive.Popup.Props & {
  bottomStickOnMobile?: boolean;
}): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogFooter({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "bare";
}): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogTitle({
  className,
  ...props
}: AlertDialogPrimitive.Title.Props): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogDescription({
  className,
  ...props
}: AlertDialogPrimitive.Description.Props): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogClose(
  props: AlertDialogPrimitive.Close.Props,
): import("react/jsx-runtime").JSX.Element;
export {
  AlertDialogCreateHandle,
  AlertDialog,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogBackdrop as AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogPopup,
  AlertDialogPopup as AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
  AlertDialogViewport,
};
