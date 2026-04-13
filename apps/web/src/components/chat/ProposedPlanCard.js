import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useState, useId } from "react";
import {
  buildCollapsedProposedPlanPreviewMarkdown,
  buildProposedPlanMarkdownFilename,
  downloadPlanAsTextFile,
  normalizePlanMarkdownForExport,
  proposedPlanTitle,
  stripDisplayedPlanMarkdown,
} from "../../proposedPlan";
import ChatMarkdown from "../ChatMarkdown";
import { EllipsisIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "../ui/menu";
import { cn } from "~/lib/utils";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "../ui/dialog";
import { toastManager } from "../ui/toast";
import { readEnvironmentApi } from "~/environmentApi";
import { useCopyToClipboard } from "~/hooks/useCopyToClipboard";
export const ProposedPlanCard = memo(function ProposedPlanCard({
  planMarkdown,
  environmentId,
  cwd,
  workspaceRoot,
}) {
  const [expanded, setExpanded] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [savePath, setSavePath] = useState("");
  const [isSavingToWorkspace, setIsSavingToWorkspace] = useState(false);
  const { copyToClipboard, isCopied } = useCopyToClipboard({
    onError: (error) => {
      toastManager.add({
        type: "error",
        title: "Could not copy plan",
        description: error instanceof Error ? error.message : "An error occurred while copying.",
      });
    },
  });
  const savePathInputId = useId();
  const title = proposedPlanTitle(planMarkdown) ?? "Proposed plan";
  const lineCount = planMarkdown.split("\n").length;
  const canCollapse = planMarkdown.length > 900 || lineCount > 20;
  const displayedPlanMarkdown = stripDisplayedPlanMarkdown(planMarkdown);
  const collapsedPreview = canCollapse
    ? buildCollapsedProposedPlanPreviewMarkdown(planMarkdown, { maxLines: 10 })
    : null;
  const downloadFilename = buildProposedPlanMarkdownFilename(planMarkdown);
  const saveContents = normalizePlanMarkdownForExport(planMarkdown);
  const handleDownload = () => {
    downloadPlanAsTextFile(downloadFilename, saveContents);
  };
  const handleCopyPlan = () => {
    copyToClipboard(saveContents);
  };
  const openSaveDialog = () => {
    if (!workspaceRoot) {
      toastManager.add({
        type: "error",
        title: "Workspace path is unavailable",
        description: "This thread does not have a workspace path to save into.",
      });
      return;
    }
    setSavePath((existing) => (existing.length > 0 ? existing : downloadFilename));
    setIsSaveDialogOpen(true);
  };
  const handleSaveToWorkspace = () => {
    const api = readEnvironmentApi(environmentId);
    const relativePath = savePath.trim();
    if (!api || !workspaceRoot) {
      return;
    }
    if (!relativePath) {
      toastManager.add({
        type: "warning",
        title: "Enter a workspace path",
      });
      return;
    }
    setIsSavingToWorkspace(true);
    void api.projects
      .writeFile({
        cwd: workspaceRoot,
        relativePath,
        contents: saveContents,
      })
      .then((result) => {
        setIsSaveDialogOpen(false);
        toastManager.add({
          type: "success",
          title: "Plan saved to workspace",
          description: result.relativePath,
        });
      })
      .catch((error) => {
        toastManager.add({
          type: "error",
          title: "Could not save plan",
          description: error instanceof Error ? error.message : "An error occurred while saving.",
        });
      })
      .then(
        () => {
          setIsSavingToWorkspace(false);
        },
        () => {
          setIsSavingToWorkspace(false);
        },
      );
  };
  return _jsxs("div", {
    className: "rounded-[24px] border border-border/80 bg-card/70 p-4 sm:p-5",
    children: [
      _jsxs("div", {
        className: "flex flex-wrap items-center justify-between gap-3",
        children: [
          _jsxs("div", {
            className: "flex min-w-0 items-center gap-2",
            children: [
              _jsx(Badge, { variant: "secondary", children: "Plan" }),
              _jsx("p", {
                className: "truncate text-sm font-medium text-foreground",
                children: title,
              }),
            ],
          }),
          _jsxs(Menu, {
            children: [
              _jsx(MenuTrigger, {
                render: _jsx(Button, {
                  "aria-label": "Plan actions",
                  size: "icon-xs",
                  variant: "outline",
                }),
                children: _jsx(EllipsisIcon, { "aria-hidden": "true", className: "size-4" }),
              }),
              _jsxs(MenuPopup, {
                align: "end",
                children: [
                  _jsx(MenuItem, {
                    onClick: handleCopyPlan,
                    children: isCopied ? "Copied!" : "Copy to clipboard",
                  }),
                  _jsx(MenuItem, { onClick: handleDownload, children: "Download as markdown" }),
                  _jsx(MenuItem, {
                    onClick: openSaveDialog,
                    disabled: !workspaceRoot || isSavingToWorkspace,
                    children: "Save to workspace",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      _jsxs("div", {
        className: "mt-4",
        children: [
          _jsxs("div", {
            className: cn("relative", canCollapse && !expanded && "max-h-104 overflow-hidden"),
            children: [
              canCollapse && !expanded
                ? _jsx(ChatMarkdown, { text: collapsedPreview ?? "", cwd: cwd, isStreaming: false })
                : _jsx(ChatMarkdown, { text: displayedPlanMarkdown, cwd: cwd, isStreaming: false }),
              canCollapse && !expanded
                ? _jsx("div", {
                    className:
                      "pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-card/95 via-card/80 to-transparent",
                  })
                : null,
            ],
          }),
          canCollapse
            ? _jsx("div", {
                className: "mt-4 flex justify-center",
                children: _jsx(Button, {
                  size: "sm",
                  variant: "outline",
                  "data-scroll-anchor-ignore": true,
                  onClick: () => setExpanded((value) => !value),
                  children: expanded ? "Collapse plan" : "Expand plan",
                }),
              })
            : null,
        ],
      }),
      _jsx(Dialog, {
        open: isSaveDialogOpen,
        onOpenChange: (open) => {
          if (!isSavingToWorkspace) {
            setIsSaveDialogOpen(open);
          }
        },
        children: _jsxs(DialogPopup, {
          className: "max-w-xl",
          children: [
            _jsxs(DialogHeader, {
              children: [
                _jsx(DialogTitle, { children: "Save plan to workspace" }),
                _jsxs(DialogDescription, {
                  children: [
                    "Enter a path relative to ",
                    _jsx("code", { children: workspaceRoot ?? "the workspace" }),
                    ".",
                  ],
                }),
              ],
            }),
            _jsx(DialogPanel, {
              className: "space-y-3",
              children: _jsxs("label", {
                htmlFor: savePathInputId,
                className: "grid gap-1.5",
                children: [
                  _jsx("span", {
                    className: "text-xs font-medium text-foreground",
                    children: "Workspace path",
                  }),
                  _jsx(Input, {
                    id: savePathInputId,
                    value: savePath,
                    onChange: (event) => setSavePath(event.target.value),
                    placeholder: downloadFilename,
                    spellCheck: false,
                    disabled: isSavingToWorkspace,
                  }),
                ],
              }),
            }),
            _jsxs(DialogFooter, {
              children: [
                _jsx(Button, {
                  variant: "outline",
                  size: "sm",
                  onClick: () => setIsSaveDialogOpen(false),
                  disabled: isSavingToWorkspace,
                  children: "Cancel",
                }),
                _jsx(Button, {
                  size: "sm",
                  onClick: () => void handleSaveToWorkspace(),
                  disabled: isSavingToWorkspace,
                  children: isSavingToWorkspace ? "Saving..." : "Save",
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
});
