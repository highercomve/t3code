import { type ScopedThreadRef } from "@t3tools/contracts";
import { type DraftId } from "~/composerDraftStore";
interface GitActionsControlProps {
  gitCwd: string | null;
  activeThreadRef: ScopedThreadRef | null;
  draftId?: DraftId;
}
export default function GitActionsControl({
  gitCwd,
  activeThreadRef,
  draftId,
}: GitActionsControlProps): import("react/jsx-runtime").JSX.Element | null;
export {};
