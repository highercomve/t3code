import { useRender } from "@base-ui/react/use-render";
import { type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { Separator } from "./separator";
declare const groupVariants: (
  props?:
    | ({
        orientation?: "horizontal" | "vertical" | null | undefined;
      } & import("class-variance-authority/types").ClassProp)
    | undefined,
) => string;
declare function Group({
  className,
  orientation,
  children,
  ...props
}: {
  className?: string;
  orientation?: VariantProps<typeof groupVariants>["orientation"];
  children: React.ReactNode;
} & React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function GroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement<
  unknown,
  string | React.JSXElementConstructor<any>
>;
declare function GroupSeparator({
  className,
  orientation,
  ...props
}: {
  className?: string;
} & React.ComponentProps<typeof Separator>): import("react/jsx-runtime").JSX.Element;
export {
  Group,
  Group as ButtonGroup,
  GroupText,
  GroupText as ButtonGroupText,
  GroupSeparator,
  GroupSeparator as ButtonGroupSeparator,
  groupVariants,
};
