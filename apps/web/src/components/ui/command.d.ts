import { Dialog as CommandDialogPrimitive } from "@base-ui/react/dialog";
import type * as React from "react";
import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteSeparator,
} from "~/components/ui/autocomplete";
declare const CommandDialog: typeof CommandDialogPrimitive.Root;
declare const CommandCreateHandle: typeof CommandDialogPrimitive.createHandle;
declare function CommandDialogTrigger(
  props: CommandDialogPrimitive.Trigger.Props,
): import("react/jsx-runtime").JSX.Element;
declare function CommandDialogPopup({
  className,
  children,
  ...props
}: CommandDialogPrimitive.Popup.Props): import("react/jsx-runtime").JSX.Element;
declare function Command({
  autoHighlight,
  keepHighlight,
  ...props
}: React.ComponentProps<typeof Autocomplete>): import("react/jsx-runtime").JSX.Element;
declare function CommandInput({
  className,
  wrapperClassName,
  placeholder,
  ...props
}: React.ComponentProps<typeof AutocompleteInput> & {
  wrapperClassName?: string | undefined;
}): import("react/jsx-runtime").JSX.Element;
declare function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof AutocompleteList>): import("react/jsx-runtime").JSX.Element;
declare function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof AutocompleteEmpty>): import("react/jsx-runtime").JSX.Element;
declare function CommandPanel({
  className,
  ...props
}: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof AutocompleteGroup>): import("react/jsx-runtime").JSX.Element;
declare function CommandGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof AutocompleteGroupLabel>): import("react/jsx-runtime").JSX.Element;
declare function CommandCollection({
  ...props
}: React.ComponentProps<typeof AutocompleteCollection>): import("react/jsx-runtime").JSX.Element;
declare function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof AutocompleteItem>): import("react/jsx-runtime").JSX.Element;
declare function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof AutocompleteSeparator>): import("react/jsx-runtime").JSX.Element;
declare function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"kbd">): import("react/jsx-runtime").JSX.Element;
declare function CommandFooter({
  className,
  ...props
}: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
export {
  CommandCreateHandle,
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
  CommandShortcut,
};
