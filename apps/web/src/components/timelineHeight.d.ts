interface TimelineMessageHeightInput {
  role: "user" | "assistant" | "system";
  text: string;
  attachments?: ReadonlyArray<{
    id: string;
  }>;
}
interface TimelineHeightEstimateLayout {
  timelineWidthPx: number | null;
}
export declare function estimateTimelineMessageHeight(
  message: TimelineMessageHeightInput,
  layout?: TimelineHeightEstimateLayout,
): number;
export {};
