import { EditorId, NativeApi } from "@t3tools/contracts";
export declare function usePreferredEditor(
  availableEditors: ReadonlyArray<EditorId>,
): readonly [
  (
    | "cursor"
    | "vscode"
    | "vscode-insiders"
    | "vscodium"
    | "zed"
    | "antigravity"
    | "file-manager"
    | null
  ),
  (
    value:
      | "cursor"
      | "vscode"
      | "vscode-insiders"
      | "vscodium"
      | "zed"
      | "antigravity"
      | "file-manager"
      | ((
          val:
            | "cursor"
            | "vscode"
            | "vscode-insiders"
            | "vscodium"
            | "zed"
            | "antigravity"
            | "file-manager"
            | null,
        ) =>
          | "cursor"
          | "vscode"
          | "vscode-insiders"
          | "vscodium"
          | "zed"
          | "antigravity"
          | "file-manager"
          | null)
      | null,
  ) => void,
];
export declare function resolveAndPersistPreferredEditor(
  availableEditors: readonly EditorId[],
): EditorId | null;
export declare function openInPreferredEditor(
  api: NativeApi,
  targetPath: string,
): Promise<EditorId>;
