import type { WorkLogEntry } from "../../session-logic";
interface ToolCallBlockProps {
  entry: WorkLogEntry;
  defaultOpen?: boolean;
}
export declare const ToolCallBlock: import("react").NamedExoticComponent<ToolCallBlockProps>;
export declare const ThinkingBlock: import("react").NamedExoticComponent<ToolCallBlockProps>;
export {};
