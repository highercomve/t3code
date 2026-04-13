import { CommandId, MessageId, ProjectId, ThreadId } from "@t3tools/contracts";
import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import * as Random from "effect/Random";
import * as Effect from "effect/Effect";
import { DraftId } from "../composerDraftStore";
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
export const newCommandId = () => CommandId.make(randomUUID());
export const newProjectId = () => ProjectId.make(randomUUID());
export const newThreadId = () => ThreadId.make(randomUUID());
export const newDraftId = () => DraftId.make(randomUUID());
export const newMessageId = () => MessageId.make(randomUUID());
