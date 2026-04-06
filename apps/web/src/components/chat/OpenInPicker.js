import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback, useEffect, useMemo } from "react";
import { isOpenFavoriteEditorShortcut, shortcutLabelForCommand } from "../../keybindings";
import { usePreferredEditor } from "../../editorPreferences";
import { ChevronDownIcon, FolderClosedIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Group, GroupSeparator } from "../ui/group";
import { Menu, MenuItem, MenuPopup, MenuShortcut, MenuTrigger } from "../ui/menu";
import {
  AntigravityIcon,
  CursorIcon,
  TraeIcon,
  IntelliJIdeaIcon,
  VisualStudioCode,
  Zed,
} from "../Icons";
import { isMacPlatform, isWindowsPlatform } from "~/lib/utils";
import { readNativeApi } from "~/nativeApi";
const resolveOptions = (platform, availableEditors) => {
  const baseOptions = [
    {
      label: "Cursor",
      Icon: CursorIcon,
      value: "cursor",
    },
    {
      label: "Trae",
      Icon: TraeIcon,
      value: "trae",
    },
    {
      label: "VS Code",
      Icon: VisualStudioCode,
      value: "vscode",
    },
    {
      label: "VS Code Insiders",
      Icon: VisualStudioCode,
      value: "vscode-insiders",
    },
    {
      label: "VSCodium",
      Icon: VisualStudioCode,
      value: "vscodium",
    },
    {
      label: "Zed",
      Icon: Zed,
      value: "zed",
    },
    {
      label: "Antigravity",
      Icon: AntigravityIcon,
      value: "antigravity",
    },
    {
      label: "IntelliJ IDEA",
      Icon: IntelliJIdeaIcon,
      value: "idea",
    },
    {
      label: isMacPlatform(platform)
        ? "Finder"
        : isWindowsPlatform(platform)
          ? "Explorer"
          : "Files",
      Icon: FolderClosedIcon,
      value: "file-manager",
    },
  ];
  return baseOptions.filter((option) => availableEditors.includes(option.value));
};
export const OpenInPicker = memo(function OpenInPicker({
  keybindings,
  availableEditors,
  openInCwd,
}) {
  const [preferredEditor, setPreferredEditor] = usePreferredEditor(availableEditors);
  const options = useMemo(
    () => resolveOptions(navigator.platform, availableEditors),
    [availableEditors],
  );
  const primaryOption = options.find(({ value }) => value === preferredEditor) ?? null;
  const openInEditor = useCallback(
    (editorId) => {
      const api = readNativeApi();
      if (!api || !openInCwd) return;
      const editor = editorId ?? preferredEditor;
      if (!editor) return;
      void api.shell.openInEditor(openInCwd, editor);
      setPreferredEditor(editor);
    },
    [preferredEditor, openInCwd, setPreferredEditor],
  );
  const openFavoriteEditorShortcutLabel = useMemo(
    () => shortcutLabelForCommand(keybindings, "editor.openFavorite"),
    [keybindings],
  );
  useEffect(() => {
    const handler = (e) => {
      const api = readNativeApi();
      if (!isOpenFavoriteEditorShortcut(e, keybindings)) return;
      if (!api || !openInCwd) return;
      if (!preferredEditor) return;
      e.preventDefault();
      void api.shell.openInEditor(openInCwd, preferredEditor);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [preferredEditor, keybindings, openInCwd]);
  return _jsxs(Group, {
    "aria-label": "Subscription actions",
    children: [
      _jsxs(Button, {
        size: "xs",
        variant: "outline",
        disabled: !preferredEditor || !openInCwd,
        onClick: () => openInEditor(preferredEditor),
        children: [
          primaryOption?.Icon &&
            _jsx(primaryOption.Icon, { "aria-hidden": "true", className: "size-3.5" }),
          _jsx("span", {
            className: "sr-only @3xl/header-actions:not-sr-only @3xl/header-actions:ml-0.5",
            children: "Open",
          }),
        ],
      }),
      _jsx(GroupSeparator, { className: "hidden @3xl/header-actions:block" }),
      _jsxs(Menu, {
        children: [
          _jsx(MenuTrigger, {
            render: _jsx(Button, {
              "aria-label": "Copy options",
              size: "icon-xs",
              variant: "outline",
            }),
            children: _jsx(ChevronDownIcon, { "aria-hidden": "true", className: "size-4" }),
          }),
          _jsxs(MenuPopup, {
            align: "end",
            children: [
              options.length === 0 &&
                _jsx(MenuItem, { disabled: true, children: "No installed editors found" }),
              options.map(({ label, Icon, value }) =>
                _jsxs(
                  MenuItem,
                  {
                    onClick: () => openInEditor(value),
                    children: [
                      _jsx(Icon, { "aria-hidden": "true", className: "text-muted-foreground" }),
                      label,
                      value === preferredEditor &&
                        openFavoriteEditorShortcutLabel &&
                        _jsx(MenuShortcut, { children: openFavoriteEditorShortcutLabel }),
                    ],
                  },
                  value,
                ),
              ),
            ],
          }),
        ],
      }),
    ],
  });
});
