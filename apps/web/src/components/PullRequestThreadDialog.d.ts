import type { ThreadId } from "@t3tools/contracts";
interface PullRequestThreadDialogProps {
  open: boolean;
  threadId: ThreadId;
  cwd: string | null;
  initialReference: string | null;
  onOpenChange: (open: boolean) => void;
  onPrepared: (input: { branch: string; worktreePath: string | null }) => Promise<void> | void;
}
export declare function PullRequestThreadDialog({
  open,
  threadId,
  cwd,
  initialReference,
  onOpenChange,
  onPrepared,
}: PullRequestThreadDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
