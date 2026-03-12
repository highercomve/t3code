import { Field as FieldPrimitive } from "@base-ui/react/field";
declare function Field({
  className,
  ...props
}: FieldPrimitive.Root.Props): import("react/jsx-runtime").JSX.Element;
declare function FieldLabel({
  className,
  ...props
}: FieldPrimitive.Label.Props): import("react/jsx-runtime").JSX.Element;
declare function FieldItem({
  className,
  ...props
}: FieldPrimitive.Item.Props): import("react/jsx-runtime").JSX.Element;
declare function FieldDescription({
  className,
  ...props
}: FieldPrimitive.Description.Props): import("react/jsx-runtime").JSX.Element;
declare function FieldError({
  className,
  ...props
}: FieldPrimitive.Error.Props): import("react/jsx-runtime").JSX.Element;
declare const FieldControl: import("react").ForwardRefExoticComponent<
  Omit<import("@base-ui/react").FieldControlProps, "ref"> &
    import("react").RefAttributes<HTMLElement>
>;
declare const FieldValidity: import("react").FC<import("@base-ui/react").FieldValidityProps>;
export { Field, FieldLabel, FieldDescription, FieldError, FieldControl, FieldItem, FieldValidity };
