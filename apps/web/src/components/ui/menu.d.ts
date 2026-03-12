import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import type * as React from "react";
declare const MenuCreateHandle: typeof MenuPrimitive.createHandle;
declare const Menu: <Payload>(
  props: MenuPrimitive.Root.Props<Payload>,
) => import("react/jsx-runtime").JSX.Element;
declare const MenuPortal: React.ForwardRefExoticComponent<
  Omit<import("@base-ui/react").ContextMenuPortalProps, "ref"> & React.RefAttributes<HTMLDivElement>
>;
declare function MenuTrigger({
  className,
  children,
  ...props
}: MenuPrimitive.Trigger.Props): import("react/jsx-runtime").JSX.Element;
declare function MenuPopup({
  children,
  className,
  sideOffset,
  align,
  alignOffset,
  side,
  anchor,
  ...props
}: MenuPrimitive.Popup.Props & {
  align?: MenuPrimitive.Positioner.Props["align"];
  sideOffset?: MenuPrimitive.Positioner.Props["sideOffset"];
  alignOffset?: MenuPrimitive.Positioner.Props["alignOffset"];
  side?: MenuPrimitive.Positioner.Props["side"];
  anchor?: MenuPrimitive.Positioner.Props["anchor"];
}): import("react/jsx-runtime").JSX.Element;
declare function MenuGroup(
  props: MenuPrimitive.Group.Props,
): import("react/jsx-runtime").JSX.Element;
declare function MenuItem({
  className,
  inset,
  variant,
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: "default" | "destructive";
}): import("react/jsx-runtime").JSX.Element;
declare function MenuCheckboxItem({
  className,
  children,
  checked,
  variant,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  variant?: "default" | "switch";
}): import("react/jsx-runtime").JSX.Element;
declare function MenuRadioGroup(
  props: MenuPrimitive.RadioGroup.Props,
): import("react/jsx-runtime").JSX.Element;
declare function MenuRadioItem({
  className,
  children,
  ...props
}: MenuPrimitive.RadioItem.Props): import("react/jsx-runtime").JSX.Element;
declare function MenuGroupLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}): import("react/jsx-runtime").JSX.Element;
declare function MenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props): import("react/jsx-runtime").JSX.Element;
declare function MenuShortcut({
  className,
  ...props
}: React.ComponentProps<"kbd">): import("react/jsx-runtime").JSX.Element;
declare function MenuSub(
  props: MenuPrimitive.SubmenuRoot.Props,
): import("react/jsx-runtime").JSX.Element;
declare function MenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}): import("react/jsx-runtime").JSX.Element;
declare function MenuSubPopup({
  className,
  sideOffset,
  alignOffset,
  align,
  ...props
}: MenuPrimitive.Popup.Props & {
  align?: MenuPrimitive.Positioner.Props["align"];
  sideOffset?: MenuPrimitive.Positioner.Props["sideOffset"];
  alignOffset?: MenuPrimitive.Positioner.Props["alignOffset"];
}): import("react/jsx-runtime").JSX.Element;
export {
  MenuCreateHandle,
  MenuCreateHandle as DropdownMenuCreateHandle,
  Menu,
  Menu as DropdownMenu,
  MenuPortal,
  MenuPortal as DropdownMenuPortal,
  MenuTrigger,
  MenuTrigger as DropdownMenuTrigger,
  MenuPopup,
  MenuPopup as DropdownMenuContent,
  MenuGroup,
  MenuGroup as DropdownMenuGroup,
  MenuItem,
  MenuItem as DropdownMenuItem,
  MenuCheckboxItem,
  MenuCheckboxItem as DropdownMenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioGroup as DropdownMenuRadioGroup,
  MenuRadioItem,
  MenuRadioItem as DropdownMenuRadioItem,
  MenuGroupLabel,
  MenuGroupLabel as DropdownMenuLabel,
  MenuSeparator,
  MenuSeparator as DropdownMenuSeparator,
  MenuShortcut,
  MenuShortcut as DropdownMenuShortcut,
  MenuSub,
  MenuSub as DropdownMenuSub,
  MenuSubTrigger,
  MenuSubTrigger as DropdownMenuSubTrigger,
  MenuSubPopup,
  MenuSubPopup as DropdownMenuSubContent,
};
