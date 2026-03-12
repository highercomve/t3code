import { type DiffPanelMode } from "./DiffPanelShell";
interface DiffPanelProps {
  mode?: DiffPanelMode;
}
export { DiffWorkerPoolProvider } from "./DiffWorkerPoolProvider";
export default function DiffPanel({
  mode,
}: DiffPanelProps): import("react/jsx-runtime").JSX.Element;
