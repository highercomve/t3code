import {
  type ProviderKind,
  type ProviderModelOptions,
  type ServerProviderModel,
  type ThreadId,
} from "@t3tools/contracts";
import type { ReactNode } from "react";
export type ComposerProviderStateInput = {
  provider: ProviderKind;
  model: string;
  models: ReadonlyArray<ServerProviderModel>;
  prompt: string;
  modelOptions: ProviderModelOptions | null | undefined;
};
export type ComposerProviderState = {
  provider: ProviderKind;
  promptEffort: string | null;
  modelOptionsForDispatch: ProviderModelOptions[ProviderKind] | undefined;
  composerFrameClassName?: string;
  composerSurfaceClassName?: string;
  modelPickerIconClassName?: string;
};
export declare function getComposerProviderState(
  input: ComposerProviderStateInput,
): ComposerProviderState;
export declare function renderProviderTraitsMenuContent(input: {
  provider: ProviderKind;
  threadId: ThreadId;
  model: string;
  models: ReadonlyArray<ServerProviderModel>;
  modelOptions: ProviderModelOptions[ProviderKind] | undefined;
  prompt: string;
  onPromptChange: (prompt: string) => void;
}): ReactNode;
export declare function renderProviderTraitsPicker(input: {
  provider: ProviderKind;
  threadId: ThreadId;
  model: string;
  models: ReadonlyArray<ServerProviderModel>;
  modelOptions: ProviderModelOptions[ProviderKind] | undefined;
  prompt: string;
  onPromptChange: (prompt: string) => void;
}): ReactNode;
