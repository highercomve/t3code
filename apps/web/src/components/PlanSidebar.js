import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useState, useCallback } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import ChatMarkdown from "./ChatMarkdown";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EllipsisIcon,
  LoaderIcon,
  PanelRightCloseIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { formatTimestamp } from "../timestampFormat";
import {
  proposedPlanTitle,
  buildProposedPlanMarkdownFilename,
  normalizePlanMarkdownForExport,
  downloadPlanAsTextFile,
  stripDisplayedPlanMarkdown,
} from "../proposedPlan";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "./ui/menu";
import { readEnvironmentApi } from "~/environmentApi";
import { toastManager } from "./ui/toast";
import { useCopyToClipboard } from "~/hooks/useCopyToClipboard";
function stepStatusIcon(status) {
  if (status === "completed") {
    return _jsx("span", {
      className:
        "flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500",
      children: _jsx(CheckIcon, { className: "size-3" }),
    });
  }
  if (status === "inProgress") {
    return _jsx("span", {
      className:
        "flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-400",
      children: _jsx(LoaderIcon, { className: "size-3 animate-spin" }),
    });
  }
  return _jsx("span", {
    className:
      "flex size-5 shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted/30",
    children: _jsx("span", { className: "size-1.5 rounded-full bg-muted-foreground/30" }),
  });
}
const PlanSidebar = memo(function PlanSidebar({
  activePlan,
  activeProposedPlan,
  environmentId,
  markdownCwd,
  workspaceRoot,
  timestampFormat,
  onClose,
}) {
  const [proposedPlanExpanded, setProposedPlanExpanded] = useState(false);
  const [isSavingToWorkspace, setIsSavingToWorkspace] = useState(false);
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const planMarkdown = activeProposedPlan?.planMarkdown ?? null;
  const displayedPlanMarkdown = planMarkdown ? stripDisplayedPlanMarkdown(planMarkdown) : null;
  const planTitle = planMarkdown ? proposedPlanTitle(planMarkdown) : null;
  const handleCopyPlan = useCallback(() => {
    if (!planMarkdown) return;
    copyToClipboard(planMarkdown);
  }, [planMarkdown, copyToClipboard]);
  const handleDownload = useCallback(() => {
    if (!planMarkdown) return;
    const filename = buildProposedPlanMarkdownFilename(planMarkdown);
    downloadPlanAsTextFile(filename, normalizePlanMarkdownForExport(planMarkdown));
  }, [planMarkdown]);
  const handleSaveToWorkspace = useCallback(() => {
    const api = readEnvironmentApi(environmentId);
    if (!api || !workspaceRoot || !planMarkdown) return;
    const filename = buildProposedPlanMarkdownFilename(planMarkdown);
    setIsSavingToWorkspace(true);
    void api.projects
      .writeFile({
        cwd: workspaceRoot,
        relativePath: filename,
        contents: normalizePlanMarkdownForExport(planMarkdown),
      })
      .then((result) => {
        toastManager.add({
          type: "success",
          title: "Plan saved",
          description: result.relativePath,
        });
      })
      .catch((error) => {
        toastManager.add({
          type: "error",
          title: "Could not save plan",
          description: error instanceof Error ? error.message : "An error occurred.",
        });
      })
      .then(
        () => setIsSavingToWorkspace(false),
        () => setIsSavingToWorkspace(false),
      );
  }, [environmentId, planMarkdown, workspaceRoot]);
  return _jsxs("div", {
    className: "flex h-full w-[340px] shrink-0 flex-col border-l border-border/70 bg-card/50",
    children: [
      _jsxs("div", {
        className: "flex h-12 shrink-0 items-center justify-between border-b border-border/60 px-3",
        children: [
          _jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              _jsx(Badge, {
                variant: "secondary",
                className:
                  "rounded-md bg-blue-500/10 px-1.5 py-0 text-[10px] font-semibold tracking-wide text-blue-400 uppercase",
                children: "Plan",
              }),
              activePlan
                ? _jsx("span", {
                    className: "text-[11px] text-muted-foreground/60",
                    children: formatTimestamp(activePlan.createdAt, timestampFormat),
                  })
                : null,
            ],
          }),
          _jsxs("div", {
            className: "flex items-center gap-1",
            children: [
              planMarkdown
                ? _jsxs(Menu, {
                    children: [
                      _jsx(MenuTrigger, {
                        render: _jsx(Button, {
                          size: "icon-xs",
                          variant: "ghost",
                          className: "text-muted-foreground/50 hover:text-foreground/70",
                          "aria-label": "Plan actions",
                        }),
                        children: _jsx(EllipsisIcon, { className: "size-3.5" }),
                      }),
                      _jsxs(MenuPopup, {
                        align: "end",
                        children: [
                          _jsx(MenuItem, {
                            onClick: handleCopyPlan,
                            children: isCopied ? "Copied!" : "Copy to clipboard",
                          }),
                          _jsx(MenuItem, {
                            onClick: handleDownload,
                            children: "Download as markdown",
                          }),
                          _jsx(MenuItem, {
                            onClick: handleSaveToWorkspace,
                            disabled: !workspaceRoot || isSavingToWorkspace,
                            children: "Save to workspace",
                          }),
                        ],
                      }),
                    ],
                  })
                : null,
              _jsx(Button, {
                size: "icon-xs",
                variant: "ghost",
                onClick: onClose,
                "aria-label": "Close plan sidebar",
                className: "text-muted-foreground/50 hover:text-foreground/70",
                children: _jsx(PanelRightCloseIcon, { className: "size-3.5" }),
              }),
            ],
          }),
        ],
      }),
      _jsx(ScrollArea, {
        className: "min-h-0 flex-1",
        children: _jsxs("div", {
          className: "p-3 space-y-4",
          children: [
            activePlan?.explanation
              ? _jsx("p", {
                  className: "text-[13px] leading-relaxed text-muted-foreground/80",
                  children: activePlan.explanation,
                })
              : null,
            activePlan && activePlan.steps.length > 0
              ? _jsxs("div", {
                  className: "space-y-1",
                  children: [
                    _jsx("p", {
                      className:
                        "mb-2 text-[10px] font-semibold tracking-widest text-muted-foreground/40 uppercase",
                      children: "Steps",
                    }),
                    activePlan.steps.map((step) =>
                      _jsxs(
                        "div",
                        {
                          className: cn(
                            "flex items-start gap-2.5 rounded-lg px-2.5 py-2 transition-colors duration-200",
                            step.status === "inProgress" && "bg-blue-500/5",
                            step.status === "completed" && "bg-emerald-500/5",
                          ),
                          children: [
                            _jsx("div", {
                              className: "mt-0.5",
                              children: stepStatusIcon(step.status),
                            }),
                            _jsx("p", {
                              className: cn(
                                "text-[13px] leading-snug",
                                step.status === "completed"
                                  ? "text-muted-foreground/50 line-through decoration-muted-foreground/20"
                                  : step.status === "inProgress"
                                    ? "text-foreground/90"
                                    : "text-muted-foreground/70",
                              ),
                              children: step.step,
                            }),
                          ],
                        },
                        `${step.status}:${step.step}`,
                      ),
                    ),
                  ],
                })
              : null,
            planMarkdown
              ? _jsxs("div", {
                  className: "space-y-2",
                  children: [
                    _jsxs("button", {
                      type: "button",
                      className: "group flex w-full items-center gap-1.5 text-left",
                      onClick: () => setProposedPlanExpanded((v) => !v),
                      children: [
                        proposedPlanExpanded
                          ? _jsx(ChevronDownIcon, {
                              className:
                                "size-3 shrink-0 text-muted-foreground/40 transition-transform",
                            })
                          : _jsx(ChevronRightIcon, {
                              className:
                                "size-3 shrink-0 text-muted-foreground/40 transition-transform",
                            }),
                        _jsx("span", {
                          className:
                            "text-[10px] font-semibold tracking-widest text-muted-foreground/40 uppercase group-hover:text-muted-foreground/60",
                          children: planTitle ?? "Full Plan",
                        }),
                      ],
                    }),
                    proposedPlanExpanded
                      ? _jsx("div", {
                          className: "rounded-lg border border-border/50 bg-background/50 p-3",
                          children: _jsx(ChatMarkdown, {
                            text: displayedPlanMarkdown ?? "",
                            cwd: markdownCwd,
                            isStreaming: false,
                          }),
                        })
                      : null,
                  ],
                })
              : null,
            !activePlan && !planMarkdown
              ? _jsxs("div", {
                  className: "flex flex-col items-center justify-center py-12 text-center",
                  children: [
                    _jsx("p", {
                      className: "text-[13px] text-muted-foreground/40",
                      children: "No active plan yet.",
                    }),
                    _jsx("p", {
                      className: "mt-1 text-[11px] text-muted-foreground/30",
                      children: "Plans will appear here when generated.",
                    }),
                  ],
                })
              : null,
          ],
        }),
      }),
    ],
  });
});
export default PlanSidebar;
