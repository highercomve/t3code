import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback, useMemo, useState } from "react";
import { buildTurnDiffTree } from "../../lib/turnDiffTree";
import { ChevronRightIcon, FolderIcon, FolderClosedIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { DiffStatLabel, hasNonZeroStat } from "./DiffStatLabel";
import { VscodeEntryIcon } from "./VscodeEntryIcon";
const EMPTY_DIRECTORY_OVERRIDES = {};
export const ChangedFilesTree = memo(function ChangedFilesTree(props) {
  const { files, allDirectoriesExpanded, onOpenTurnDiff, resolvedTheme, turnId } = props;
  const treeNodes = useMemo(() => buildTurnDiffTree(files), [files]);
  const directoryPathsKey = useMemo(
    () => collectDirectoryPaths(treeNodes).join("\u0000"),
    [treeNodes],
  );
  const expansionStateKey = `${allDirectoriesExpanded ? "expanded" : "collapsed"}\u0000${directoryPathsKey}`;
  const [directoryExpansionState, setDirectoryExpansionState] = useState(() => ({
    key: expansionStateKey,
    overrides: {},
  }));
  const expandedDirectories =
    directoryExpansionState.key === expansionStateKey
      ? directoryExpansionState.overrides
      : EMPTY_DIRECTORY_OVERRIDES;
  const toggleDirectory = useCallback(
    (pathValue) => {
      setDirectoryExpansionState((current) => {
        const nextOverrides = current.key === expansionStateKey ? current.overrides : {};
        return {
          key: expansionStateKey,
          overrides: {
            ...nextOverrides,
            [pathValue]: !(nextOverrides[pathValue] ?? allDirectoriesExpanded),
          },
        };
      });
    },
    [allDirectoriesExpanded, expansionStateKey],
  );
  const renderTreeNode = (node, depth) => {
    const leftPadding = 8 + depth * 14;
    if (node.kind === "directory") {
      const isExpanded = expandedDirectories[node.path] ?? allDirectoriesExpanded;
      return _jsxs(
        "div",
        {
          children: [
            _jsxs("button", {
              type: "button",
              "data-scroll-anchor-ignore": true,
              className:
                "group flex w-full items-center gap-1.5 rounded-md py-1 pr-2 text-left hover:bg-background/80",
              style: { paddingLeft: `${leftPadding}px` },
              onClick: () => toggleDirectory(node.path),
              children: [
                _jsx(ChevronRightIcon, {
                  "aria-hidden": "true",
                  className: cn(
                    "size-3.5 shrink-0 text-muted-foreground/70 transition-transform group-hover:text-foreground/80",
                    isExpanded && "rotate-90",
                  ),
                }),
                isExpanded
                  ? _jsx(FolderIcon, { className: "size-3.5 shrink-0 text-muted-foreground/75" })
                  : _jsx(FolderClosedIcon, {
                      className: "size-3.5 shrink-0 text-muted-foreground/75",
                    }),
                _jsx("span", {
                  className:
                    "truncate font-mono text-[11px] text-muted-foreground/90 group-hover:text-foreground/90",
                  children: node.name,
                }),
                hasNonZeroStat(node.stat) &&
                  _jsx("span", {
                    className: "ml-auto shrink-0 font-mono text-[10px] tabular-nums",
                    children: _jsx(DiffStatLabel, {
                      additions: node.stat.additions,
                      deletions: node.stat.deletions,
                    }),
                  }),
              ],
            }),
            isExpanded &&
              _jsx("div", {
                className: "space-y-0.5",
                children: node.children.map((childNode) => renderTreeNode(childNode, depth + 1)),
              }),
          ],
        },
        `dir:${node.path}`,
      );
    }
    return _jsxs(
      "button",
      {
        type: "button",
        className:
          "group flex w-full items-center gap-1.5 rounded-md py-1 pr-2 text-left hover:bg-background/80",
        style: { paddingLeft: `${leftPadding}px` },
        onClick: () => onOpenTurnDiff(turnId, node.path),
        children: [
          _jsx("span", { "aria-hidden": "true", className: "size-3.5 shrink-0" }),
          _jsx(VscodeEntryIcon, {
            pathValue: node.path,
            kind: "file",
            theme: resolvedTheme,
            className: "size-3.5 text-muted-foreground/70",
          }),
          _jsx("span", {
            className:
              "truncate font-mono text-[11px] text-muted-foreground/80 group-hover:text-foreground/90",
            children: node.name,
          }),
          node.stat &&
            _jsx("span", {
              className: "ml-auto shrink-0 font-mono text-[10px] tabular-nums",
              children: _jsx(DiffStatLabel, {
                additions: node.stat.additions,
                deletions: node.stat.deletions,
              }),
            }),
        ],
      },
      `file:${node.path}`,
    );
  };
  return _jsx("div", {
    className: "space-y-0.5",
    children: treeNodes.map((node) => renderTreeNode(node, 0)),
  });
});
function collectDirectoryPaths(nodes) {
  const paths = [];
  for (const node of nodes) {
    if (node.kind !== "directory") continue;
    paths.push(node.path);
    paths.push(...collectDirectoryPaths(node.children));
  }
  return paths;
}
