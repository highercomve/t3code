import { useRender } from "@base-ui/react/use-render";
declare function Label({
  className,
  render,
  ...props
}: useRender.ComponentProps<"label">): import("react").ReactElement<
  unknown,
  string | import("react").JSXElementConstructor<any>
>;
export { Label };
