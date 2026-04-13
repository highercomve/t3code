import type { ThreadId } from "@t3tools/contracts";
import type { EnvironmentState } from "./store";
import type { Thread } from "./types";
export declare function getThreadFromEnvironmentState(
  state: EnvironmentState,
  threadId: ThreadId,
): Thread | undefined;
