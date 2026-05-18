import * as Effect from "effect/Effect";
import * as SqlClient from "effect/unstable/sql/SqlClient";

/**
 * Convert `modelSelection.options` / `defaultModelSelection.options` from the
 * v3 array-of-selections shape (`[{id, value}, …]`) introduced by migration 026
 * to the current provider-specific struct shape (`{effort: "high", …}`).
 *
 * After migration 026, stored data has options as an array like:
 *   `[{"id":"effort","value":"high"},{"id":"contextWindow","value":"1m"}]`
 *
 * The current ModelSelection schema expects provider-specific struct fields like:
 *   `{"effort": "high", "contextWindow": "1m"}` (ClaudeModelOptions)
 *   `{"reasoningEffort": "high", "fastMode": true}`    (CodexModelOptions)
 *
 * For each `{id, value}` pair in the array, `id` becomes the object key and
 * `value` becomes the object value. Boolean true/false are preserved through
 * `json_type` checks.
 *
 * Note: `json_objectagg` is not available in Bun's SQLite build, so we use
 * `group_concat` with `json()` instead.
 *
 * Touched storage:
 *   - `projection_threads.model_selection_json.options`
 *   - `projection_projects.default_model_selection_json.options`
 *   - `orchestration_events.payload_json.$.modelSelection.options`
 *     (thread.created | thread.meta-updated | thread.turn-start-requested)
 *   - `orchestration_events.payload_json.$.defaultModelSelection.options`
 *     (project.created | project.meta-updated)
 */
export default Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;

  yield* sql`
    UPDATE projection_threads
    SET model_selection_json = json_set(
      model_selection_json,
      '$.options',
      (
        SELECT json('{' || group_concat(
          CASE json_type(arr.value, '$.value')
            WHEN 'true' THEN '"' || json_extract(arr.value, '$.id') || '":true'
            WHEN 'false' THEN '"' || json_extract(arr.value, '$.id') || '":false'
            ELSE '"' || json_extract(arr.value, '$.id') || '":"' || json_extract(arr.value, '$.value') || '"'
          END, ','
        ) || '}')
        FROM json_each(json_extract(model_selection_json, '$.options')) AS arr
      )
    )
    WHERE model_selection_json IS NOT NULL
      AND json_type(model_selection_json, '$.options') = 'array'
  `;

  yield* sql`
    UPDATE projection_projects
    SET default_model_selection_json = json_set(
      default_model_selection_json,
      '$.options',
      (
        SELECT json('{' || group_concat(
          CASE json_type(arr.value, '$.value')
            WHEN 'true' THEN '"' || json_extract(arr.value, '$.id') || '":true'
            WHEN 'false' THEN '"' || json_extract(arr.value, '$.id') || '":false'
            ELSE '"' || json_extract(arr.value, '$.id') || '":"' || json_extract(arr.value, '$.value') || '"'
          END, ','
        ) || '}')
        FROM json_each(json_extract(default_model_selection_json, '$.options')) AS arr
      )
    )
    WHERE default_model_selection_json IS NOT NULL
      AND json_type(default_model_selection_json, '$.options') = 'array'
  `;

  yield* sql`
    UPDATE orchestration_events
    SET payload_json = json_set(
      payload_json,
      '$.modelSelection.options',
      (
        SELECT json('{' || group_concat(
          CASE json_type(arr.value, '$.value')
            WHEN 'true' THEN '"' || json_extract(arr.value, '$.id') || '":true'
            WHEN 'false' THEN '"' || json_extract(arr.value, '$.id') || '":false'
            ELSE '"' || json_extract(arr.value, '$.id') || '":"' || json_extract(arr.value, '$.value') || '"'
          END, ','
        ) || '}')
        FROM json_each(json_extract(payload_json, '$.modelSelection.options')) AS arr
      )
    )
    WHERE event_type IN (
      'thread.created',
      'thread.meta-updated',
      'thread.turn-start-requested'
    )
      AND json_type(payload_json, '$.modelSelection.options') = 'array'
  `;

  yield* sql`
    UPDATE orchestration_events
    SET payload_json = json_set(
      payload_json,
      '$.defaultModelSelection.options',
      (
        SELECT json('{' || group_concat(
          CASE json_type(arr.value, '$.value')
            WHEN 'true' THEN '"' || json_extract(arr.value, '$.id') || '":true'
            WHEN 'false' THEN '"' || json_extract(arr.value, '$.id') || '":false'
            ELSE '"' || json_extract(arr.value, '$.id') || '":"' || json_extract(arr.value, '$.value') || '"'
          END, ','
        ) || '}')
        FROM json_each(json_extract(payload_json, '$.defaultModelSelection.options')) AS arr
      )
    )
    WHERE event_type IN ('project.created', 'project.meta-updated')
      AND json_type(payload_json, '$.defaultModelSelection.options') = 'array'
  `;
});
