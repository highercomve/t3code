import type { OrchestrationThreadActivity, ThreadTokenUsageSnapshot } from "@t3tools/contracts";
type NullableContextWindowUsage = {
  readonly [Key in keyof ThreadTokenUsageSnapshot]: undefined extends ThreadTokenUsageSnapshot[Key]
    ? Exclude<ThreadTokenUsageSnapshot[Key], undefined> | null
    : ThreadTokenUsageSnapshot[Key];
};
export type ContextWindowSnapshot = NullableContextWindowUsage & {
  readonly remainingTokens: number | null;
  readonly usedPercentage: number | null;
  readonly remainingPercentage: number | null;
  readonly updatedAt: string;
};
export declare function deriveLatestContextWindowSnapshot(
  activities: ReadonlyArray<OrchestrationThreadActivity>,
): ContextWindowSnapshot | null;
export declare function formatContextWindowTokens(value: number | null): string;
export {};
