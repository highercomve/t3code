import type { ThreadId } from "@t3tools/contracts";
interface GitActionsControlProps {
  gitCwd: string | null;
  activeThreadId: ThreadId | null;
}
export default function GitActionsControl({
  gitCwd,
  activeThreadId,
}: GitActionsControlProps): import("react/jsx-runtime").JSX.Element | null;
export {};
