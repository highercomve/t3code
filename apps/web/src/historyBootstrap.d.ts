import type { ChatMessage } from "./types";
export interface BootstrapInputResult {
  text: string;
  includedCount: number;
  omittedCount: number;
  truncated: boolean;
}
export declare function buildBootstrapInput(
  previousMessages: ChatMessage[],
  latestPrompt: string,
  maxChars: number,
): BootstrapInputResult;
