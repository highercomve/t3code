interface PullRequestThreadDialogProps {
  open: boolean;
  cwd: string | null;
  initialReference: string | null;
  onOpenChange: (open: boolean) => void;
  onPrepared: (input: { branch: string; worktreePath: string | null }) => Promise<void> | void;
}
export declare function PullRequestThreadDialog({
  open,
  cwd,
  initialReference,
  onOpenChange,
  onPrepared,
}: PullRequestThreadDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
