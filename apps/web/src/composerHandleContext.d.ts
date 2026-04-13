import { type MutableRefObject } from "react";
import type { ChatComposerHandle } from "./components/chat/ChatComposer";
export type ComposerHandleRef = MutableRefObject<ChatComposerHandle | null>;
export declare const ComposerHandleContext: import("react").Context<ComposerHandleRef | null>;
export declare function useComposerHandleContext(): ComposerHandleRef | null;
