export declare function proposedPlanTitle(planMarkdown: string): string | null;
export declare function stripDisplayedPlanMarkdown(planMarkdown: string): string;
export declare function buildCollapsedProposedPlanPreviewMarkdown(
  planMarkdown: string,
  options?: {
    maxLines?: number;
  },
): string;
export declare function buildPlanImplementationPrompt(planMarkdown: string): string;
export declare function resolvePlanFollowUpSubmission(input: {
  draftText: string;
  planMarkdown: string;
}): {
  text: string;
  interactionMode: "default" | "plan";
};
export declare function buildPlanImplementationThreadTitle(planMarkdown: string): string;
export declare function buildProposedPlanMarkdownFilename(planMarkdown: string): string;
export declare function normalizePlanMarkdownForExport(planMarkdown: string): string;
export declare function downloadPlanAsTextFile(filename: string, contents: string): void;
