export type TerminalLinkKind = "url" | "path";
export interface TerminalLinkMatch {
  kind: TerminalLinkKind;
  text: string;
  start: number;
  end: number;
}
export declare function extractTerminalLinks(line: string): TerminalLinkMatch[];
export declare function isTerminalLinkActivation(
  event: Pick<MouseEvent, "metaKey" | "ctrlKey">,
  platform?: string,
): boolean;
export declare function resolvePathLinkTarget(rawPath: string, cwd: string): string;
