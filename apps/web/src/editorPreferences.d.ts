import { EditorId, NativeApi } from "@t3tools/contracts";
export declare function usePreferredEditor(
  availableEditors: ReadonlyArray<EditorId>,
): readonly [
  (
    | "cursor"
    | "trae"
    | "vscode"
    | "vscode-insiders"
    | "vscodium"
    | "zed"
    | "antigravity"
    | "idea"
    | "file-manager"
    | null
  ),
  (
    value:
      | "cursor"
      | "trae"
      | "vscode"
      | "vscode-insiders"
      | "vscodium"
      | "zed"
      | "antigravity"
      | "idea"
      | "file-manager"
      | ((
          val:
            | "cursor"
            | "trae"
            | "vscode"
            | "vscode-insiders"
            | "vscodium"
            | "zed"
            | "antigravity"
            | "idea"
            | "file-manager"
            | null,
        ) =>
          | "cursor"
          | "trae"
          | "vscode"
          | "vscode-insiders"
          | "vscodium"
          | "zed"
          | "antigravity"
          | "idea"
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
