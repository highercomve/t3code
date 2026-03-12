export interface TimelineDurationMessage {
  id: string;
  role: "user" | "assistant" | "system";
  createdAt: string;
  completedAt?: string | undefined;
}
export declare function computeMessageDurationStart(
  messages: ReadonlyArray<TimelineDurationMessage>,
): Map<string, string>;
export declare function normalizeCompactToolLabel(value: string): string;
