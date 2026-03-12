import { useRender } from "@base-ui/react/use-render";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { TooltipPopup } from "~/components/ui/tooltip";
type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};
type SidebarResizableOptions = {
  maxWidth?: number;
  minWidth?: number;
  onResize?: (width: number) => void;
  shouldAcceptWidth?: (context: {
    currentWidth: number;
    nextWidth: number;
    rail: HTMLButtonElement;
    side: "left" | "right";
    sidebarRoot: HTMLElement;
    wrapper: HTMLElement;
  }) => boolean;
  storageKey?: string;
};
declare function useSidebar(): SidebarContextProps;
declare function SidebarProvider({
  defaultOpen,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
declare function Sidebar({
  side,
  variant,
  collapsible,
  resizable,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
  resizable?: boolean | SidebarResizableOptions;
}): import("react/jsx-runtime").JSX.Element;
declare function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>): import("react/jsx-runtime").JSX.Element;
declare function SidebarRail({
  className,
  onClick,
  onPointerCancel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  ...props
}: React.ComponentProps<"button">): import("react/jsx-runtime").JSX.Element;
declare function SidebarInset({
  className,
  ...props
}: React.ComponentProps<"main">): import("react/jsx-runtime").JSX.Element;
declare function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>): import("react/jsx-runtime").JSX.Element;
declare function SidebarHeader({
  className,
  ...props
}: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function SidebarFooter({
  className,
  ...props
}: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>): import("react/jsx-runtime").JSX.Element;
declare function SidebarContent({
  className,
  ...props
}: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function SidebarGroup({
  className,
  ...props
}: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function SidebarGroupLabel({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement<
  unknown,
  string | React.JSXElementConstructor<any>
>;
declare function SidebarGroupAction({
  className,
  render,
  ...props
}: useRender.ComponentProps<"button">): React.ReactElement<
  unknown,
  string | React.JSXElementConstructor<any>
>;
declare function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function SidebarMenu({
  className,
  ...props
}: React.ComponentProps<"ul">): import("react/jsx-runtime").JSX.Element;
declare function SidebarMenuItem({
  className,
  ...props
}: React.ComponentProps<"li">): import("react/jsx-runtime").JSX.Element;
declare const sidebarMenuButtonVariants: (
  props?:
    | ({
        size?: "default" | "lg" | "sm" | null | undefined;
        variant?: "default" | "outline" | null | undefined;
      } & import("class-variance-authority/types").ClassProp)
    | undefined,
) => string;
declare function SidebarMenuButton({
  isActive,
  variant,
  size,
  tooltip,
  className,
  render,
  ...props
}: useRender.ComponentProps<"button"> & {
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipPopup>;
} & VariantProps<typeof sidebarMenuButtonVariants>): import("react/jsx-runtime").JSX.Element;
declare function SidebarMenuAction({
  className,
  showOnHover,
  render,
  ...props
}: useRender.ComponentProps<"button"> & {
  showOnHover?: boolean;
}): React.ReactElement<unknown, string | React.JSXElementConstructor<any>>;
declare function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function SidebarMenuSkeleton({
  className,
  showIcon,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean;
}): import("react/jsx-runtime").JSX.Element;
declare function SidebarMenuSub({
  className,
  ...props
}: React.ComponentProps<"ul">): import("react/jsx-runtime").JSX.Element;
declare function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">): import("react/jsx-runtime").JSX.Element;
declare function SidebarMenuSubButton({
  size,
  isActive,
  className,
  render,
  ...props
}: useRender.ComponentProps<"a"> & {
  size?: "sm" | "md";
  isActive?: boolean;
}): React.ReactElement<unknown, string | React.JSXElementConstructor<any>>;
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
