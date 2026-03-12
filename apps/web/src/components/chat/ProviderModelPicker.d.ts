import { type ProviderKind, type ServerProvider } from "@t3tools/contracts";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "../ui/button";
export declare const AVAILABLE_PROVIDER_OPTIONS: {
  value: ProviderKind;
  label: string;
  available: true;
}[];
export declare const ProviderModelPicker: import("react").NamedExoticComponent<{
  provider: ProviderKind;
  model: string;
  lockedProvider: ProviderKind | null;
  providers?: ReadonlyArray<ServerProvider>;
  modelOptionsByProvider: Record<
    ProviderKind,
    ReadonlyArray<{
      slug: string;
      name: string;
    }>
  >;
  activeProviderIconClassName?: string;
  compact?: boolean;
  disabled?: boolean;
  triggerVariant?: VariantProps<typeof buttonVariants>["variant"];
  triggerClassName?: string;
  onProviderModelChange: (provider: ProviderKind, model: string) => void;
}>;
