import {
  type ProviderKind,
  type ProviderModelOptions,
  type ScopedThreadRef,
  type ServerProviderModel,
} from "@t3tools/contracts";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "../ui/button";
import { DraftId } from "../../composerDraftStore";
type ProviderOptions = ProviderModelOptions[ProviderKind];
type TraitsPersistence =
  | {
      threadRef?: ScopedThreadRef;
      draftId?: DraftId;
      onModelOptionsChange?: never;
    }
  | {
      threadRef?: undefined;
      onModelOptionsChange: (nextOptions: ProviderOptions | undefined) => void;
    };
export interface TraitsMenuContentProps {
  provider: ProviderKind;
  models: ReadonlyArray<ServerProviderModel>;
  model: string | null | undefined;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  modelOptions?: ProviderOptions | null | undefined;
  allowPromptInjectedEffort?: boolean;
  triggerVariant?: VariantProps<typeof buttonVariants>["variant"];
  triggerClassName?: string;
}
export declare const TraitsMenuContent: import("react").NamedExoticComponent<
  TraitsMenuContentProps & TraitsPersistence
>;
export declare const TraitsPicker: import("react").NamedExoticComponent<
  TraitsMenuContentProps & TraitsPersistence
>;
export {};
