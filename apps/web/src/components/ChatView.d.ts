import { type ThreadId } from "@t3tools/contracts";
interface ChatViewProps {
  threadId: ThreadId;
}
export default function ChatView({
  threadId,
}: ChatViewProps): import("react/jsx-runtime").JSX.Element;
export {};
