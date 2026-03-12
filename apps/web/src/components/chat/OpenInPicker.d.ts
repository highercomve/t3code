import { EditorId, type ResolvedKeybindingsConfig } from "@t3tools/contracts";
export declare const OpenInPicker: import("react").NamedExoticComponent<{
  keybindings: ResolvedKeybindingsConfig;
  availableEditors: ReadonlyArray<EditorId>;
  openInCwd: string | null;
}>;
