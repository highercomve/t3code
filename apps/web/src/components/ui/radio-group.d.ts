import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
declare function RadioGroup({
  className,
  ...props
}: RadioGroupPrimitive.Props): import("react/jsx-runtime").JSX.Element;
declare function Radio({
  className,
  ...props
}: RadioPrimitive.Root.Props): import("react/jsx-runtime").JSX.Element;
export { RadioGroup, Radio, Radio as RadioGroupItem };
