import { type EnvironmentId, type ThreadId } from "@t3tools/contracts";
import { type DraftId } from "../composerDraftStore";
type ChatViewProps =
  | {
      environmentId: EnvironmentId;
      threadId: ThreadId;
      onDiffPanelOpen?: () => void;
      reserveTitleBarControlInset?: boolean;
      routeKind: "server";
      draftId?: never;
    }
  | {
      environmentId: EnvironmentId;
      threadId: ThreadId;
      onDiffPanelOpen?: () => void;
      reserveTitleBarControlInset?: boolean;
      routeKind: "draft";
      draftId: DraftId;
    };
export default function ChatView(props: ChatViewProps): import("react/jsx-runtime").JSX.Element;
export {};
