import React from "react";
interface ChatMarkdownProps {
  text: string;
  cwd: string | undefined;
  isStreaming?: boolean;
}
declare function ChatMarkdown({
  text,
  cwd,
  isStreaming,
}: ChatMarkdownProps): import("react/jsx-runtime").JSX.Element;
declare const _default: React.MemoExoticComponent<typeof ChatMarkdown>;
export default _default;
