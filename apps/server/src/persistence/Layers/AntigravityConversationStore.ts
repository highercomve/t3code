import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";
import * as SqlClient from "effect/unstable/sql/SqlClient";

import { toPersistenceSqlError } from "../Errors.ts";
import {
  AntigravityConversationStore,
  type AntigravityConversationStoreShape,
} from "../Services/AntigravityConversationStore.ts";

const ConversationIdRowSchema = Schema.Struct({
  conversation_id: Schema.String,
});

const makeAntigravityConversationStore = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;

  const get: AntigravityConversationStoreShape["get"] = (threadId) =>
    sql`
      SELECT conversation_id
      FROM antigravity_conversations
      WHERE thread_id = ${threadId}
      LIMIT 1
    `.pipe(
      Effect.mapError(toPersistenceSqlError("AntigravityConversationStore.get")),
      Effect.map((rows): string | null => {
        const first = rows[0];
        if (!first || !Schema.is(ConversationIdRowSchema)(first)) {
          return null;
        }
        return first.conversation_id;
      }),
    );

  const set: AntigravityConversationStoreShape["set"] = (threadId, conversationId) =>
    Effect.gen(function* () {
      const now = DateTime.formatIso(yield* DateTime.now);
      return yield* sql`
        INSERT INTO antigravity_conversations (thread_id, conversation_id, updated_at)
        VALUES (${threadId}, ${conversationId}, ${now})
        ON CONFLICT (thread_id) DO UPDATE SET
          conversation_id = excluded.conversation_id,
          updated_at = excluded.updated_at
      `.pipe(
        Effect.asVoid,
        Effect.mapError(toPersistenceSqlError("AntigravityConversationStore.set")),
      );
    });

  const clear: AntigravityConversationStoreShape["clear"] = (threadId) =>
    sql`
      DELETE FROM antigravity_conversations
      WHERE thread_id = ${threadId}
    `.pipe(
      Effect.asVoid,
      Effect.mapError(toPersistenceSqlError("AntigravityConversationStore.clear")),
    );

  return {
    get,
    set,
    clear,
  } satisfies AntigravityConversationStoreShape;
});

export const AntigravityConversationStoreLive = Layer.effect(
  AntigravityConversationStore,
  makeAntigravityConversationStore,
);
