import { type TimestampFormat } from "@t3tools/contracts/settings";
export declare function getTimestampFormatOptions(
  timestampFormat: TimestampFormat,
  includeSeconds: boolean,
): Intl.DateTimeFormatOptions;
export declare function formatTimestamp(isoDate: string, timestampFormat: TimestampFormat): string;
export declare function formatShortTimestamp(
  isoDate: string,
  timestampFormat: TimestampFormat,
): string;
/**
 * Format a relative time string from an ISO date.
 * Returns `{ value: "20s", suffix: "ago" }` or `{ value: "just now", suffix: null }`
 * so callers can style the numeric portion independently.
 */
export declare function formatRelativeTime(isoDate: string): {
  value: string;
  suffix: string | null;
};
export declare function formatRelativeTimeLabel(isoDate: string): string;
