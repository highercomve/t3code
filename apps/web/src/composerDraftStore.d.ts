import {
  ModelSelection,
  ProjectId,
  ProviderInteractionMode,
  ProviderKind,
  ProviderModelOptions,
  RuntimeMode,
  type ServerProvider,
  ThreadId,
} from "@t3tools/contracts";
import * as Schema from "effect/Schema";
import { type ChatImageAttachment } from "./types";
import { type TerminalContextDraft } from "./lib/terminalContext";
import { UnifiedSettings } from "@t3tools/contracts/settings";
export declare const COMPOSER_DRAFT_STORAGE_KEY = "t3code:composer-drafts:v1";
declare const DraftThreadEnvModeSchema: Schema.Literals<readonly ["local", "worktree"]>;
export type DraftThreadEnvMode = typeof DraftThreadEnvModeSchema.Type;
export declare const PersistedComposerImageAttachment: Schema.Struct<{
  readonly id: Schema.String;
  readonly name: Schema.String;
  readonly mimeType: Schema.String;
  readonly sizeBytes: Schema.Number;
  readonly dataUrl: Schema.String;
}>;
export type PersistedComposerImageAttachment = typeof PersistedComposerImageAttachment.Type;
export interface ComposerImageAttachment extends Omit<ChatImageAttachment, "previewUrl"> {
  previewUrl: string;
  file: File;
}
export interface ComposerThreadDraftState {
  prompt: string;
  images: ComposerImageAttachment[];
  nonPersistedImageIds: string[];
  persistedAttachments: PersistedComposerImageAttachment[];
  terminalContexts: TerminalContextDraft[];
  modelSelectionByProvider: Partial<Record<ProviderKind, ModelSelection>>;
  activeProvider: ProviderKind | null;
  runtimeMode: RuntimeMode | null;
  interactionMode: ProviderInteractionMode | null;
}
export interface DraftThreadState {
  projectId: ProjectId;
  createdAt: string;
  runtimeMode: RuntimeMode;
  interactionMode: ProviderInteractionMode;
  branch: string | null;
  worktreePath: string | null;
  envMode: DraftThreadEnvMode;
}
interface ProjectDraftThread extends DraftThreadState {
  threadId: ThreadId;
}
interface ComposerDraftStoreState {
  draftsByThreadId: Record<ThreadId, ComposerThreadDraftState>;
  draftThreadsByThreadId: Record<ThreadId, DraftThreadState>;
  projectDraftThreadIdByProjectId: Record<ProjectId, ThreadId>;
  stickyModelSelectionByProvider: Partial<Record<ProviderKind, ModelSelection>>;
  stickyActiveProvider: ProviderKind | null;
  getDraftThreadByProjectId: (projectId: ProjectId) => ProjectDraftThread | null;
  getDraftThread: (threadId: ThreadId) => DraftThreadState | null;
  setProjectDraftThreadId: (
    projectId: ProjectId,
    threadId: ThreadId,
    options?: {
      branch?: string | null;
      worktreePath?: string | null;
      createdAt?: string;
      envMode?: DraftThreadEnvMode;
      runtimeMode?: RuntimeMode;
      interactionMode?: ProviderInteractionMode;
    },
  ) => void;
  setDraftThreadContext: (
    threadId: ThreadId,
    options: {
      branch?: string | null;
      worktreePath?: string | null;
      projectId?: ProjectId;
      createdAt?: string;
      envMode?: DraftThreadEnvMode;
      runtimeMode?: RuntimeMode;
      interactionMode?: ProviderInteractionMode;
    },
  ) => void;
  clearProjectDraftThreadId: (projectId: ProjectId) => void;
  clearProjectDraftThreadById: (projectId: ProjectId, threadId: ThreadId) => void;
  clearDraftThread: (threadId: ThreadId) => void;
  setStickyModelSelection: (modelSelection: ModelSelection | null | undefined) => void;
  setPrompt: (threadId: ThreadId, prompt: string) => void;
  setTerminalContexts: (threadId: ThreadId, contexts: TerminalContextDraft[]) => void;
  setModelSelection: (
    threadId: ThreadId,
    modelSelection: ModelSelection | null | undefined,
  ) => void;
  setModelOptions: (
    threadId: ThreadId,
    modelOptions: ProviderModelOptions | null | undefined,
  ) => void;
  applyStickyState: (threadId: ThreadId) => void;
  setProviderModelOptions: (
    threadId: ThreadId,
    provider: ProviderKind,
    nextProviderOptions: ProviderModelOptions[ProviderKind] | null | undefined,
    options?: {
      persistSticky?: boolean;
    },
  ) => void;
  setRuntimeMode: (threadId: ThreadId, runtimeMode: RuntimeMode | null | undefined) => void;
  setInteractionMode: (
    threadId: ThreadId,
    interactionMode: ProviderInteractionMode | null | undefined,
  ) => void;
  addImage: (threadId: ThreadId, image: ComposerImageAttachment) => void;
  addImages: (threadId: ThreadId, images: ComposerImageAttachment[]) => void;
  removeImage: (threadId: ThreadId, imageId: string) => void;
  insertTerminalContext: (
    threadId: ThreadId,
    prompt: string,
    context: TerminalContextDraft,
    index: number,
  ) => boolean;
  addTerminalContext: (threadId: ThreadId, context: TerminalContextDraft) => void;
  addTerminalContexts: (threadId: ThreadId, contexts: TerminalContextDraft[]) => void;
  removeTerminalContext: (threadId: ThreadId, contextId: string) => void;
  clearTerminalContexts: (threadId: ThreadId) => void;
  clearPersistedAttachments: (threadId: ThreadId) => void;
  syncPersistedAttachments: (
    threadId: ThreadId,
    attachments: PersistedComposerImageAttachment[],
  ) => void;
  clearComposerContent: (threadId: ThreadId) => void;
}
export interface EffectiveComposerModelState {
  selectedModel: string;
  modelOptions: ProviderModelOptions | null;
}
export declare function deriveEffectiveComposerModelState(input: {
  draft:
    | Pick<ComposerThreadDraftState, "modelSelectionByProvider" | "activeProvider">
    | null
    | undefined;
  providers: ReadonlyArray<ServerProvider>;
  selectedProvider: ProviderKind;
  threadModelSelection: ModelSelection | null | undefined;
  projectModelSelection: ModelSelection | null | undefined;
  settings: UnifiedSettings;
}): EffectiveComposerModelState;
export declare const useComposerDraftStore: import("zustand").UseBoundStore<
  Omit<import("zustand").StoreApi<ComposerDraftStoreState>, "setState" | "persist"> & {
    setState(
      partial:
        | ComposerDraftStoreState
        | Partial<ComposerDraftStoreState>
        | ((
            state: ComposerDraftStoreState,
          ) => ComposerDraftStoreState | Partial<ComposerDraftStoreState>),
      replace?: false | undefined,
    ): unknown;
    setState(
      state:
        | ComposerDraftStoreState
        | ((state: ComposerDraftStoreState) => ComposerDraftStoreState),
      replace: true,
    ): unknown;
    persist: {
      setOptions: (
        options: Partial<
          import("zustand/middleware").PersistOptions<ComposerDraftStoreState, unknown, unknown>
        >,
      ) => void;
      clearStorage: () => void;
      rehydrate: () => Promise<void> | void;
      hasHydrated: () => boolean;
      onHydrate: (fn: (state: ComposerDraftStoreState) => void) => () => void;
      onFinishHydration: (fn: (state: ComposerDraftStoreState) => void) => () => void;
      getOptions: () => Partial<
        import("zustand/middleware").PersistOptions<ComposerDraftStoreState, unknown, unknown>
      >;
    };
  }
>;
export declare function useComposerThreadDraft(threadId: ThreadId): ComposerThreadDraftState;
export declare function useEffectiveComposerModelState(input: {
  threadId: ThreadId;
  providers: ReadonlyArray<ServerProvider>;
  selectedProvider: ProviderKind;
  threadModelSelection: ModelSelection | null | undefined;
  projectModelSelection: ModelSelection | null | undefined;
  settings: UnifiedSettings;
}): EffectiveComposerModelState;
/**
 * Clear draft threads that have been promoted to server threads.
 *
 * Call this after a snapshot sync so the route guard in `_chat.$threadId`
 * sees the server thread before the draft is removed — avoids a redirect
 * to `/` caused by a gap where neither draft nor server thread exists.
 */
export declare function clearPromotedDraftThreads(serverThreadIds: ReadonlySet<ThreadId>): void;
export {};
