import { CommandId, MessageId, ProjectId, ThreadId } from "@t3tools/contracts";
import { String, Predicate } from "effect";
import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import * as Random from "effect/Random";
import * as Effect from "effect/Effect";
export function cn(...inputs) {
  return twMerge(cx(inputs));
}
export function isMacPlatform(platform) {
  return /mac|iphone|ipad|ipod/i.test(platform);
}
export function isWindowsPlatform(platform) {
  return /^win(dows)?/i.test(platform);
}
export function isLinuxPlatform(platform) {
  return /linux/i.test(platform);
}
export function randomUUID() {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Effect.runSync(Random.nextUUIDv4);
}
export const newCommandId = () => CommandId.makeUnsafe(randomUUID());
export const newProjectId = () => ProjectId.makeUnsafe(randomUUID());
export const newThreadId = () => ThreadId.makeUnsafe(randomUUID());
export const newMessageId = () => MessageId.makeUnsafe(randomUUID());
const isNonEmptyString = Predicate.compose(Predicate.isString, String.isNonEmpty);
const firstNonEmptyString = (...values) => {
  for (const value of values) {
    if (isNonEmptyString(value)) {
      return value;
    }
  }
  throw new Error("No non-empty string provided");
};
export const resolveServerUrl = (options) => {
  const rawUrl = firstNonEmptyString(
    options?.url,
    window.desktopBridge?.getWsUrl(),
    import.meta.env.VITE_WS_URL,
    window.location.origin,
  );
  const parsedUrl = new URL(rawUrl);
  if (options?.protocol) {
    parsedUrl.protocol = options.protocol;
  }
  if (options?.pathname) {
    parsedUrl.pathname = options.pathname;
  } else {
    parsedUrl.pathname = "/";
  }
  if (options?.searchParams) {
    parsedUrl.search = new URLSearchParams(options.searchParams).toString();
  }
  return parsedUrl.toString();
};
