import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
declare const Autocomplete: typeof AutocompletePrimitive.Root;
declare function AutocompleteInput({
  className,
  showTrigger,
  showClear,
  startAddon,
  size,
  ...props
}: Omit<AutocompletePrimitive.Input.Props, "size"> & {
  showTrigger?: boolean;
  showClear?: boolean;
  startAddon?: React.ReactNode;
  size?: "sm" | "default" | "lg" | number;
  ref?: React.Ref<HTMLInputElement>;
}): import("react/jsx-runtime").JSX.Element;
declare function AutocompletePopup({
  className,
  children,
  side,
  sideOffset,
  alignOffset,
  align,
  anchor,
  ...props
}: AutocompletePrimitive.Popup.Props & {
  align?: AutocompletePrimitive.Positioner.Props["align"];
  sideOffset?: AutocompletePrimitive.Positioner.Props["sideOffset"];
  alignOffset?: AutocompletePrimitive.Positioner.Props["alignOffset"];
  side?: AutocompletePrimitive.Positioner.Props["side"];
  anchor?: AutocompletePrimitive.Positioner.Props["anchor"];
}): import("react/jsx-runtime").JSX.Element;
declare function AutocompleteItem({
  className,
  children,
  ...props
}: AutocompletePrimitive.Item.Props): import("react/jsx-runtime").JSX.Element;
declare function AutocompleteSeparator({
  className,
  ...props
}: AutocompletePrimitive.Separator.Props): import("react/jsx-runtime").JSX.Element;
declare function AutocompleteGroup({
  className,
  ...props
}: AutocompletePrimitive.Group.Props): import("react/jsx-runtime").JSX.Element;
declare function AutocompleteGroupLabel({
  className,
  ...props
}: AutocompletePrimitive.GroupLabel.Props): import("react/jsx-runtime").JSX.Element;
declare function AutocompleteEmpty({
  className,
  ...props
}: AutocompletePrimitive.Empty.Props): import("react/jsx-runtime").JSX.Element;
declare function AutocompleteRow({
  className,
  ...props
}: AutocompletePrimitive.Row.Props): import("react/jsx-runtime").JSX.Element;
declare function AutocompleteValue({
  ...props
}: AutocompletePrimitive.Value.Props): import("react/jsx-runtime").JSX.Element;
declare function AutocompleteList({
  className,
  ...props
}: AutocompletePrimitive.List.Props): import("react/jsx-runtime").JSX.Element;
declare function AutocompleteClear({
  className,
  ...props
}: AutocompletePrimitive.Clear.Props): import("react/jsx-runtime").JSX.Element;
declare function AutocompleteStatus({
  className,
  ...props
}: AutocompletePrimitive.Status.Props): import("react/jsx-runtime").JSX.Element;
declare function AutocompleteCollection({
  ...props
}: AutocompletePrimitive.Collection.Props): import("react/jsx-runtime").JSX.Element;
declare function AutocompleteTrigger({
  className,
  children,
  ...props
}: AutocompletePrimitive.Trigger.Props): import("react/jsx-runtime").JSX.Element;
declare const useAutocompleteFilter: (
  options?: import("@base-ui/react").AutocompleteFilterOptions,
) => import("@base-ui/react").AutocompleteFilter;
export {
  Autocomplete,
  AutocompleteInput,
  AutocompleteTrigger,
  AutocompletePopup,
  AutocompleteItem,
  AutocompleteSeparator,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteEmpty,
  AutocompleteValue,
  AutocompleteList,
  AutocompleteClear,
  AutocompleteStatus,
  AutocompleteRow,
  AutocompleteCollection,
  useAutocompleteFilter,
};
