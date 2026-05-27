import * as Effect from "effect/Effect";
import * as SqlClient from "effect/unstable/sql/SqlClient";

/**
 * Rename persisted provider id `"gemini"` to `"antigravity"` and create the
 * dedicated `antigravity_conversations` table keyed by thread id.
 *
 * Idempotent: every UPDATE is gated on the legacy `"gemini"` literal still
 * being present, and the CREATE TABLE uses `IF NOT EXISTS`. Running it twice
 * is a no-op.
 *
 * Touched storage (all JSON-string columns under SQLite's json1):
 *   - `projection_threads.model_selection_json.$.provider`
 *   - `projection_projects.default_model_selection_json.$.provider`
 *   - `orchestration_events.payload_json.$.modelSelection.provider`
 *     (thread.created | thread.meta-updated | thread.turn-start-requested)
 *   - `orchestration_events.payload_json.$.defaultModelSelection.provider`
 *     (project.created | project.meta-updated)
 *   - `projection_thread_sessions.provider_name`
 *   - `provider_session_runtime.provider_name`
 */
export default Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;

  yield* sql`
    CREATE TABLE IF NOT EXISTS antigravity_conversations (
      thread_id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `;

  yield* sql`
    UPDATE projection_threads
    SET model_selection_json = json_set(model_selection_json, '$.provider', 'antigravity')
    WHERE model_selection_json IS NOT NULL
      AND json_extract(model_selection_json, '$.provider') = 'gemini'
  `;

  yield* sql`
    UPDATE projection_projects
    SET default_model_selection_json = json_set(
      default_model_selection_json,
      '$.provider',
      'antigravity'
    )
    WHERE default_model_selection_json IS NOT NULL
      AND json_extract(default_model_selection_json, '$.provider') = 'gemini'
  `;

  yield* sql`
    UPDATE orchestration_events
    SET payload_json = json_set(payload_json, '$.modelSelection.provider', 'antigravity')
    WHERE event_type IN (
      'thread.created',
      'thread.meta-updated',
      'thread.turn-start-requested'
    )
      AND json_extract(payload_json, '$.modelSelection.provider') = 'gemini'
  `;

  yield* sql`
    UPDATE orchestration_events
    SET payload_json = json_set(
      payload_json,
      '$.defaultModelSelection.provider',
      'antigravity'
    )
    WHERE event_type IN ('project.created', 'project.meta-updated')
      AND json_extract(payload_json, '$.defaultModelSelection.provider') = 'gemini'
  `;

  yield* sql`
    UPDATE projection_thread_sessions
    SET provider_name = 'antigravity'
    WHERE provider_name = 'gemini'
  `;

  yield* sql`
    UPDATE provider_session_runtime
    SET provider_name = 'antigravity'
    WHERE provider_name = 'gemini'
  `;
});
