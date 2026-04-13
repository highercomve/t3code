import type { WorkLogEntry } from "../../session-logic";
declare function isContextGatheringTool(entry: WorkLogEntry): boolean;
interface ContextToolGroupProps {
  entries: readonly WorkLogEntry[];
  defaultOpen?: boolean;
}
export declare const ContextToolGroup: import("react").NamedExoticComponent<ContextToolGroupProps>;
export { isContextGatheringTool };
