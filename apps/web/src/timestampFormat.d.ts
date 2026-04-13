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
/**
 * Relative elapsed duration since an ISO instant, without an "ago" suffix.
 * Useful for labels like "Connected for 3m".
 */
export declare function formatElapsedDurationLabel(isoDate: string, nowMs?: number): string;
/**
 * Relative time until an ISO instant (e.g. expiry). Mirrors {@link formatRelativeTime} but for future times.
 */
export declare function formatRelativeTimeUntil(isoDate: string): {
  value: string;
  suffix: string | null;
};
export declare function formatRelativeTimeUntilLabel(isoDate: string): string;
/**
 * Countdown for a future instant (e.g. link expiry): "Expires in 4m 12s", with second precision under one hour.
 * Pass `nowMs` when a parent tick drives re-renders so the diff matches that snapshot.
 */
export declare function formatExpiresInLabel(isoDate: string, nowMs?: number): string;
