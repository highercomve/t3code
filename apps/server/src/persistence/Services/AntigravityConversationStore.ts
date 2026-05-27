import { Context, Effect } from "effect";
import type { ThreadId } from "@t3tools/contracts";

import type { PersistenceDecodeError, PersistenceSqlError } from "../Errors.ts";

export type AntigravityConversationStoreError = PersistenceSqlError | PersistenceDecodeError;

export interface AntigravityConversationStoreShape {
  readonly get: (
    threadId: ThreadId,
  ) => Effect.Effect<string | null, AntigravityConversationStoreError>;
  readonly set: (
    threadId: ThreadId,
    conversationId: string,
  ) => Effect.Effect<void, AntigravityConversationStoreError>;
  readonly clear: (threadId: ThreadId) => Effect.Effect<void, AntigravityConversationStoreError>;
}

export class AntigravityConversationStore extends Context.Service<
  AntigravityConversationStore,
  AntigravityConversationStoreShape
>()("t3/persistence/Services/AntigravityConversationStore") {}
