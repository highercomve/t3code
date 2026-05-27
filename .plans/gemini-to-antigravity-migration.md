# Migrate the Gemini provider from `gemini --experimental-acp` to Antigravity (`agy`)

Plan owner: architect agent. Last revised: 2026-05-27. Repo HEAD: `07aa3b32` (fork main).

Working tree layout assumed by this plan: **post-`e92e2dba` local layout** (text-generation files still under `apps/server/src/git/Layers/*TextGeneration.ts`, the upstream rename to `apps/server/src/textGeneration/` has NOT landed). Do NOT begin the upstream merge in parallel with this work; reconcile only after this lands (see §7 and §8).

---

## 1. Summary

Replace the existing `gemini --experimental-acp` integration with a line-streaming `agy --print "<prompt>"` integration against the new Antigravity CLI, behind a new provider id `"antigravity"`. The legacy `gemini` provider id is removed from the codebase in the same change — there is no dual-provider transition. A single Effect-layer driver (`AntigravityDriver`) replaces both `geminiAppServerManager.ts` (interactive chat) and `GeminiTextGeneration.ts` (commit-message generation). Line-grained streaming is preserved (one `content.delta` per stdout line, empirically 200-400 ms cadence — see §3.4); reasoning deltas and per-tool permission prompts are dropped for this provider. Multi-turn history is delegated to `agy`'s own conversation store via `--conversation <id>`.

## 2. Key finding — Antigravity is not ACP

`agy` is **not** a drop-in replacement for `gemini --experimental-acp`. Verified probes (binary at `/home/sergiom/.local/bin/agy`, version 1.0.2):

- `agy --acp` → `flags provided but not defined: -acp`
- `agy --experimental-acp` → `flags provided but not defined: -experimental-acp`
- `agy --help` lists only: `--add-dir`, `-c/--continue`, `--conversation`, `--dangerously-skip-permissions`, `-i/--prompt-interactive`, `--log-file`, `-p/--print`, `--print-timeout`, `--prompt`, `--prompt-interactive`, `--sandbox`; subcommands `changelog`, `help`, `install`, `plugin/plugins`, `update`.
- `strings /home/sergiom/.local/bin/agy | grep -i acp` returns nothing; the only JSON-RPC marker is `jsonrpc2` from the MCP go-sdk (used for `agy`'s MCP **server** side, not for an ACP client side).
- `agy plugin import --help` describes importing plugins "from gemini or claude" and writes to `~/.gemini/config/`, confirming Antigravity inherits Gemini's config layout but speaks a different surface (one-shot CLI, not stdio JSON-RPC).

Implication: every line of `geminiAppServerManager.ts` that drives `initialize` / `authenticate` / `session/new` / `session/prompt` / `session/update` is unreachable against `agy` and must be deleted, not repointed.

## 3. Decisions

Each decision below is **recommendation + rationale + alternatives considered + user-visible impact**.

### 3.1 Transport — `agy --print "<prompt>"` per turn, streaming line-buffered stdout (option a)

**Recommendation:** option (a). Each user turn spawns `agy --print "<prompt>" --conversation <agyConversationId> --dangerously-skip-permissions --print-timeout 300s --model <m>`. The driver consumes stdout line-by-line (the binary is line-buffered — see §3.4 empirical evidence) and emits one `content.delta` per line, followed by `turn.completed` on exit.

**Spawn-shape note (empirically verified 2026-05-27):** the prompt is the **argument of `--print`**, NOT a positional after `--`. Probe results:
- `agy --print "Reply only PING"` → emits `PING`. Correct.
- `agy --print -- "Reply only PING"` → ignores the prompt and emits a default greeting. **Do not use `--` here.**
- `echo X | agy --print` → fails with `flag needs an argument: -print`. Stdin-only is not supported; the prompt must be supplied as the `--print` argument.

Argv-length headroom: the existing code sends up to `PROVIDER_SEND_TURN_MAX_INPUT_CHARS = 120_000` chars. Linux `ARG_MAX` is typically ~2 MB, so 120K fits comfortably as a single argv. Phase 0 must still probe the empirical ceiling (see §5 Phase 0 #8) and, if needed, write the prompt to a temp file and reference it via a future stdin escape — but the **default driver shape passes the prompt directly as the `--print` argument.**

**Why:** `agy --print` is the only stable, machine-readable surface and (importantly) it streams stdout incrementally. The TUI (`-i`) is fragile (option b). An ACP shim on top of `--print` (option c) preserves the manager's upward contract but is dead weight. Side-by-side providers (option d) is rejected because the user explicitly wants the deprecated `gemini` binary gone from the fork; carrying both indefinitely freezes the upstream-merge mess in PATCH.md §1. Auto-detect (option e) is a worse version of (d).

**Alternatives considered:**
- (b) `--prompt-interactive` TUI parsing — fragile, no public schema.
- (c) ACP shim wrapping `--print` — purposeless wrapper.
- (d) Both providers — see above.
- (e) Auto-detect — protocols differ; this is just (d) under one id.

**User-visible impact:** line-grained streaming preserved (200-400 ms inter-line gap observed; one `content.delta` per output line). No incremental reasoning panel updates. No mid-turn tool-permission prompts (`--dangerously-skip-permissions` accepts everything, mirroring our existing host-approves-everything behavior). Plan-mode (`ProviderInteractionMode = "plan"`) is not supported — Phase 1 hides the toggle for this provider.

### 3.2 Provider identity — new id `"antigravity"`, drop `"gemini"`

**Recommendation:** introduce `PROVIDER_ANTIGRAVITY = "antigravity"`; remove `PROVIDER_GEMINI` from `ProviderKind`. Display name `"Antigravity"`. The selection schema discriminant becomes `provider: "antigravity"`.

**Why:** the wire protocol, capabilities, config dir, and model catalog all change. Re-using the id `"gemini"` would mean the on-disk shape no longer matches the literal — every settings file, project default selection, and thread record that says `"provider": "gemini"` would silently break. A new id forces an explicit migration with logging.

**Settings/data migration:** add server-settings migration that, on load, rewrites:
- `serverSettings.providers.gemini` → `serverSettings.providers.antigravity` (drop `homePath` from the moved record; `agy` always uses `~/.gemini/config/`, see §3.6).
- `serverSettings.textGenerationModelSelection.provider === "gemini"` → `"antigravity"` with model remapped per §3.8.
- `defaultModelSelection.provider` in every persisted `OrchestrationProject` (SQLite migration; reuse the existing migrations harness — search `apps/server/src/persistence/Migrations.ts`).
- `clientSettings.favorites` entries: drop `{provider: "gemini", …}` favorites or rewrite to `antigravity` if a model mapping exists.
- Any per-thread persisted model selection in the SQLite store (look for `defaultModelSelection` column / JSON blob — implementer must grep for `"gemini"` literals in `apps/server/src/persistence/`).

**Alternatives considered:** keep id `"gemini"` and rebrand display only. Rejected because every existing `provider === "gemini"` runtime branch (event source tags `gemini.app-server.notification`, `gemini.app-server.request`, the `GeminiModelSelection` discriminant) is semantically wrong for `agy`.

**User-visible impact:** existing threads keep working (migration rewrites their `provider` field). Settings UI now says "Antigravity" instead of "Gemini". Anyone with a hand-written `settings.json` referencing `"gemini"` gets auto-migrated on first launch and warned via `config.warning` runtime event.

### 3.3 Multi-turn session state — delegate to `agy`'s `--conversation <id>`

**Recommendation:** each domain `ThreadId` maps to one `agy` conversation id, **minted by `agy` on the first turn and stored by us thereafter**. On the first turn for a thread, omit `--conversation` entirely; after the spawn exits, read the cwd→uuid mapping from `~/.gemini/antigravity-cli/cache/last_conversations.json` and persist that uuid on the thread (new column `provider_conversation_id` in the threads table, or pack into the existing per-thread `metadata` blob if one exists — implementer must inspect the schema in `apps/server/src/persistence/`). On every subsequent turn pass `--conversation <storedId>`. Do NOT use `--continue` — that resumes the most recent `agy` conversation **for the cwd**, which silently races across threads in the same workspace folder.

**Per-CWD conversation isolation — critical constraint.** Phase 0 empirically established that `last_conversations.json` is a per-CWD map; running `agy --print` without `--conversation` auto-resumes whatever conversation was last used in the current working directory. The implementer MUST pass `--conversation <id>` on every turn after the first to avoid two threads of the same project unintentionally sharing memory.

**Reading `last_conversations.json` for the minted id:** the file is JSON, keyed by absolute cwd. The implementer reads it after `agy` exits cleanly, looks up the current cwd, and stores that uuid on the thread. If the lookup fails (file missing or cwd key absent), the implementer logs a `runtime.warning` and stores no id; the next turn for that thread will likewise omit `--conversation` and re-mint.

**Why not client-minted UUIDs:** Phase 0 attempted to pass `--conversation <new-uuid>` for a uuid `agy` had never seen and the call hung indefinitely (no diagnosable error before the kill). Until the behavior is documented, the safe path is "agy mints, we record" — this costs us nothing because our SQLite is the source of truth for the thread↔conversation mapping anyway.

**Alternatives considered:** `--continue` (race condition, no multi-thread support), reconstructing history client-side and re-injecting via prompt prefix (token-expensive, breaks cost accounting, easy to truncate).

**User-visible impact:** threads are persistent across server restarts as long as `agy`'s own conversation store is intact. If the user wipes `~/.gemini/config/`, threads become "frozen" — the implementer must emit a `runtime.warning` when an `agy` invocation reports a missing conversation id, and gracefully start a fresh one (logging which conversation was lost).

### 3.4 Streaming + reasoning — line-grained streaming kept, no reasoning surface

**Empirical evidence (2026-05-27):** `agy --print "Output the numbers 1 through 10, one per line..."` produced lines at 12:16:43.043, 43.244, 43.645, 44.046, 44.247, 44.647, 45.048, 45.249, 45.650, 45.850 — clean ~200-400ms per-line cadence. stdout is line-buffered by the binary, no buffering tweaks needed (no `stdbuf`, no PTY). The Bash probe used `script -q -c '…' /dev/null` to defeat its OWN block-buffering, but `node:child_process.spawn` with default stdio pipes also receives data per-`'data'`-event as the parent process; we read with `readline.createInterface({ input: child.stdout })` (already used in `geminiAppServerManager.ts` line 318) and emit one delta per line.

**Recommendation:** for `antigravity`, the adapter emits:
1. `session.started` + `thread.started` on session open (already issued by the orchestrator framework, no change).
2. `turn.started` when the implementer kicks off `agy --print`.
3. `content.delta` (`streamKind: "assistant_text"`) **per stdout line** with the line text + `"\n"`. First non-empty line also produces `item.started` with `itemType: "assistant_message"`.
4. `item.completed` with `itemType: "assistant_message"` once stdout closes.
5. `turn.completed` with `state: "completed"` and best-effort `usage` parsed from stderr (if `agy` reports it; otherwise omit).

No `reasoning_text` / `reasoning_summary_text` events. The UI's reasoning panel will be empty for this provider, which is correct.

**Alternatives considered:** single-chunk emit on exit (worse UX, no engineering win since the line cadence is free); chunk-poll `--log-file <path>` (adds inotify dependency, format unspecified by `agy`, redundant with line-buffered stdout); stub fake deltas (lies to telemetry).

**User-visible impact:** assistant messages stream line-by-line with sub-second latency for the first token cluster. The reasoning panel stays empty (no thinking surface from `agy`). Document the missing reasoning in the settings panel description.

### 3.5 Tool permissions — always pass `--dangerously-skip-permissions`, no host-side approval surface

**Recommendation:** option (a). Always spawn with `--dangerously-skip-permissions`. Never emit `request.opened` events of type `*_approval` for this provider. The existing ACP host UI ("Approve tool call?") never fires.

**Why:** today's ACP flow auto-accepts everything via the host (the UI shows the prompt but our runtime answers `accept` immediately for `runtimeMode === "full-access"`, which is the default). Skipping permissions at the CLI level is functionally equivalent and removes the need to parse `agy`'s tool-permission output (there is no documented format).

**Settings gate:** add `serverSettings.providers.antigravity.dangerouslySkipPermissions: boolean` (default `true`). When `false`, refuse to start sessions and emit a `config.warning` — the implementer documents this as a manual escape hatch for power users who want to run `agy` interactively elsewhere.

**Alternatives considered:** `--sandbox` (untested, no docs on bwrap availability on the user's distro); drop tool-use surfacing entirely (already the case — see §3.4).

**User-visible impact:** Antigravity threads have no per-call approval prompts. This matches current Gemini behavior under default `full-access` runtime mode.

### 3.6 Auth / config — env passthrough only, no `GEMINI_HOME`

**Recommendation:** `agy` reads `~/.gemini/config/` unconditionally. Remove `homePath` from the new `AntigravitySettings` schema. Pass through `GEMINI_API_KEY` and `GOOGLE_API_KEY` from the desktop shell env (already in `LOGIN_SHELL_ENV_NAMES` in `apps/desktop/src/syncShellEnvironment.ts` — keep them).

**Phase 0 must confirm:** the implementer must `ls -la ~/.gemini/config/` and document what's in there (`settings.json`? credentials? plugins?). If `agy` honors `XDG_CONFIG_HOME` for an `antigravity/` subdir, add that path to the env-passthrough allowlist. Until proven, assume `~/.gemini/config/` is the only path.

**Alternatives considered:** keeping `homePath` for parity with the old `GeminiSettings`. Rejected because `agy --help` exposes no equivalent flag and the env var `GEMINI_HOME` is not referenced in `strings agy`.

**User-visible impact:** users who customized `GEMINI_HOME` to share auth with the deprecated `gemini` CLI lose that override. Document in the migration release notes.

### 3.7 Commit-message generation — exec + capture stdout

**Recommendation:** rewrite `GeminiTextGeneration.ts` → `AntigravityTextGeneration.ts` as a thin `spawnSync`-style call. No ACP, no manager. Inputs: model slug, prompt string, cwd, timeout. Implementation: spawn `agy --print "<prompt>" --dangerously-skip-permissions --print-timeout 60s --model <slug>` (prompt is the `--print` argument; do **not** use `--` separator), await exit, parse stdout via the existing `extractJsonFromText` helper in `apps/server/src/provider/Utils.ts`. Wire into `RoutingTextGeneration.ts` under the new `"antigravity"` provider id.

**Why:** the existing implementation already delegates to `AcpTextGeneration.ts` (see `apps/server/src/git/Layers/GeminiTextGeneration.ts`). That dependency on `AcpTextGeneration` must NOT be reused for Antigravity — `agy` is not ACP. Build the new layer using the `TextGeneration` service contract directly (see `apps/server/src/provider/Services/TextGeneration.ts`).

**Alternatives considered:** none — this is strictly simpler than the current shape.

**User-visible impact:** commit-message generation works identically, possibly faster (no ACP handshake roundtrip).

### 3.8 Models — new catalog, drop legacy `gemini-2.x` entries

**Recommendation:** new catalog for `antigravity`:

| Slug                       | Display name                  | Notes                                        |
| -------------------------- | ----------------------------- | -------------------------------------------- |
| `gemini-3.1-pro`           | Gemini 3.1 Pro                | Antigravity default. From `agy changelog`.   |
| `gemini-3.1-pro-preview`   | Gemini 3.1 Pro Preview        | Carry forward existing slug for migration.   |
| `gemini-3-flash-preview`   | Gemini 3 Flash Preview        | Carry forward.                               |

Drop `gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.5-flash-lite` — these were the deprecated CLI's defaults and Phase 0 must verify they still work against `agy` before keeping any of them. Until verified, drop.

**Default model:** `gemini-3.1-pro` (was `gemini-3.1-pro-preview`). **Text-generation default:** `gemini-3.1-pro` (was `gemini-2.5-flash`).

**Aliases (in `MODEL_SLUG_ALIASES_BY_PROVIDER.antigravity`):** map every old gemini slug onto its closest 3.1 equivalent so persisted thread/project rows continue to resolve after migration. Specifically: `gemini-2.5-pro → gemini-3.1-pro`, `gemini-2.5-flash → gemini-3-flash-preview`, `gemini-2.5-flash-lite → gemini-3-flash-preview`, `pro → gemini-3.1-pro`, `flash → gemini-3-flash-preview`.

**Effort levels:** keep `GEMINI_EFFORT_OPTIONS = ["low", "medium", "high", "xhigh"]` renamed to `ANTIGRAVITY_EFFORT_OPTIONS`. `agy --help` exposes no equivalent flag, so for now the implementer must NOT pass effort to `agy` — it is a no-op stored in settings only (UI hides the control unless Phase 0 proves an effort knob exists). If Phase 0 finds a relevant flag (e.g. via `agy plugins list` or undocumented args), wire it; otherwise leave the toggle hidden.

**Alternatives considered:** keep old gemini-2.x slugs as legacy. Rejected — unverified compatibility, pollutes the picker.

**User-visible impact:** model picker shows three new entries; existing threads silently upgrade via the alias map.

### 3.9 PATCH.md update

Replace the entirety of `PATCH.md` §1 ("Gemini provider") with a new section. **Exact replacement block:**

```markdown
### 1. Antigravity provider (replaces deprecated Gemini ACP integration)

One-shot, non-streaming provider for Google's Antigravity CLI (binary `agy`).
Replaces the deprecated `gemini --experimental-acp` integration entirely. The
on-disk provider id is `"antigravity"`; a settings/SQLite migration rewrites
persisted `"gemini"` references on first launch.

**New files (must exist after every merge):**

- `apps/server/src/antigravityDriver.ts`
- `apps/server/src/provider/Layers/AntigravityAdapter.ts`
- `apps/server/src/provider/Layers/AntigravityProvider.ts`
- `apps/server/src/provider/Services/AntigravityAdapter.ts`
- `apps/server/src/provider/Services/AntigravityProvider.ts`
- `apps/server/src/git/Layers/AntigravityTextGeneration.ts`

**Touches (must keep wiring on merge):**

- Provider registry — `apps/server/src/provider/Layers/ProviderRegistry.ts`,
  `apps/server/src/provider/Layers/ProviderAdapterRegistry.ts`
- Commit-message text generation routing —
  `apps/server/src/git/Layers/RoutingTextGeneration.ts`
- Model + provider contract literals —
  `packages/contracts/src/{providerRuntime,orchestration,settings,model}.ts`,
  `packages/shared/src/model.ts`
- Settings migration —
  `apps/server/src/persistence/Migrations.ts` (rewrites
  `provider: "gemini"` → `provider: "antigravity"` in projects, threads,
  server settings, and favorites).
- Web provider/model UI — `apps/web/src/components/**` (search for
  `antigravity`; the literal `gemini` must NOT appear in the post-migration
  source tree).
- Desktop env passthrough —
  `apps/desktop/src/syncShellEnvironment.ts` (`GEMINI_API_KEY` and
  `GOOGLE_API_KEY` remain in the allowlist; `GEMINI_HOME` is removed).

**Notes for next merge:**

- The driver is NOT ACP. Do NOT reuse `AcpTextGeneration.ts` or
  `AcpRuntimeModel.ts` event normalization for this provider.
- Streaming and tool-permission events are deliberately not surfaced for
  Antigravity. If upstream adds a streaming `--json-stream` flag to `agy`,
  revisit `antigravityDriver.ts` to emit incremental `content.delta`.
- The fork no longer carries a `gemini` provider id. If upstream adds one
  later, evaluate whether to (a) reintroduce it side-by-side with
  Antigravity, or (b) keep our rename. Default: (b).
```

Also: §7 "Reasoning surfaces for Gemini & OpenCode" must be edited to remove the Gemini reference. §8 "Commit message suggestions" must update the bullet `GeminiTextGeneration.ts (new)` → `AntigravityTextGeneration.ts (new)`. The "Pending upstream merge" §3 already mentions `AcpTextGeneration`, `GeminiTextGeneration`, `OpencodeTextGeneration` rehoming — append a note that the Antigravity file replaces the Gemini one and follows the same target directory.

### 3.10 Tests — inventory and disposition

The implementer must `git grep -li 'gemini' -- ':!PATCH.md' ':!.plans/'` after Phase 0 to refresh this list; the table below is the snapshot the implementer should expect:

| Test file                                                                                    | Disposition |
| -------------------------------------------------------------------------------------------- | ----------- |
| `apps/server/src/geminiAppServerManager.test.ts` (if present)                                | Delete      |
| `apps/server/src/provider/Layers/GeminiAdapter.test.ts` (if present)                         | Replicate as `AntigravityAdapter.test.ts`, rewrite expectations for one-shot driver |
| `apps/server/src/provider/Layers/GeminiProvider.test.ts` (if present)                        | Replicate as `AntigravityProvider.test.ts` |
| `apps/server/src/git/Layers/GeminiTextGeneration.test.ts` (if present)                       | Replicate as `AntigravityTextGeneration.test.ts`, drop ACP fixtures |
| `apps/server/src/provider/Layers/ProviderRegistry.test.ts`                                   | Update — replace gemini snapshots with antigravity |
| `apps/server/src/provider/Layers/ProviderAdapterRegistry.test.ts`                            | Update |
| `apps/server/src/provider/acp/AcpRuntimeModel.test.ts`                                       | Update — remove `provider: "gemini"` event normalization cases (they're now irrelevant; Antigravity does not flow through this model) |
| `apps/desktop/src/syncShellEnvironment.test.ts`                                              | Update — keep `GEMINI_API_KEY` / `GOOGLE_API_KEY` cases, remove any `GEMINI_HOME` assertions |
| `packages/contracts/src/orchestration.test.ts`, `provider.test.ts`                           | Update — replace `"gemini"` literal in fixtures with `"antigravity"` |
| `packages/shared/src/model.test.ts`                                                          | Update — alias map, default model |
| `apps/web/src/components/chat/modelPickerSearch.test.ts`                                     | Update |
| `apps/web/src/composerDraftStore.test.ts`                                                    | Update |
| Any other `*.test.ts` matching `git grep gemini`                                             | Update in place; literals only |

Snapshot/fixture files (JSON under `__fixtures__` or `__snapshots__`) — replace `"gemini"` with `"antigravity"` programmatically; verify by re-running the affected test.

---

## 4. Architecture

### 4.1 Files to delete

- `apps/server/src/geminiAppServerManager.ts`
- `apps/server/src/geminiAppServerManager.test.ts` (if present)
- `apps/server/src/provider/Layers/GeminiAdapter.ts`
- `apps/server/src/provider/Layers/GeminiProvider.ts`
- `apps/server/src/provider/Services/GeminiAdapter.ts`
- `apps/server/src/provider/Services/GeminiProvider.ts`
- `apps/server/src/git/Layers/GeminiTextGeneration.ts`

### 4.2 Files to create

- `apps/server/src/antigravityDriver.ts` — one-shot driver. Public surface: `runTurn(input: AntigravityTurnInput): Effect.Effect<AntigravityTurnResult, AntigravityDriverError>`. Owns the spawn, stdout/stderr capture, timeout, and conversation-id handling. Internally uses `node:child_process` `spawn` (no `spawnSync` — we need cancel support).
- `apps/server/src/provider/Services/AntigravityProvider.ts` — Effect service tag mirroring `GeminiProvider`, but with capabilities that report no streaming and no reasoning.
- `apps/server/src/provider/Services/AntigravityAdapter.ts` — service tag mirroring `GeminiAdapter`.
- `apps/server/src/provider/Layers/AntigravityProvider.ts` — live layer building the snapshot from `AntigravitySettings`.
- `apps/server/src/provider/Layers/AntigravityAdapter.ts` — live layer translating adapter operations onto `antigravityDriver`. Maps `runTurn` output onto the five events listed in §3.4. Handles cancellation by sending SIGTERM to the child process.
- `apps/server/src/git/Layers/AntigravityTextGeneration.ts` — text-generation layer per §3.7.
- `apps/server/src/persistence/Migrations/0NN_rename_gemini_to_antigravity.ts` (next-free migration number; implementer checks the existing migration directory). Idempotent SQL/JS migration that rewrites `provider = 'gemini'` → `provider = 'antigravity'` in every relevant table and in every JSON blob column that stores `ModelSelection`.

### 4.3 Files to modify

- `packages/contracts/src/orchestration.ts` — replace `PROVIDER_GEMINI` constant + literal with `PROVIDER_ANTIGRAVITY`. Update `PROVIDER_KIND_VALUES`. Replace `GeminiProviderStartOptions` with `AntigravityProviderStartOptions` (no `homePath`). Replace `GeminiModelSelection` with `AntigravityModelSelection`. Update `ProviderStartOptions` struct field. `DEFAULT_PROVIDER` stays `codex` (already is per line 71); fix the bogus line 56 that sets it to `gemini`.
- `packages/contracts/src/providerRuntime.ts` — remove `gemini.api.response`, `gemini.api.stream`, `gemini.app-server.notification`, `gemini.app-server.request` from `RuntimeEventRawSource`. Add `antigravity.cli.print` and `antigravity.cli.error` as the only two raw-source tags for the new provider.
- `packages/contracts/src/model.ts` — replace `gemini` entries in `MODEL_OPTIONS_BY_PROVIDER`, `DEFAULT_MODEL_BY_PROVIDER`, `DEFAULT_GIT_TEXT_GENERATION_MODEL_BY_PROVIDER`, `MODEL_SLUG_ALIASES_BY_PROVIDER`, `PROVIDER_DISPLAY_NAMES`, `REASONING_EFFORT_OPTIONS_BY_PROVIDER`, `DEFAULT_REASONING_EFFORT_BY_PROVIDER` with `antigravity` per §3.8. Rename `GEMINI_EFFORT_OPTIONS` → `ANTIGRAVITY_EFFORT_OPTIONS`, `GeminiEffort` → `AntigravityEffort`, `GeminiModelOptions` → `AntigravityModelOptions`, `GEMINI_EFFORT_TO_THINKING_BUDGET` → delete (no thinking budget on `agy`), `TolerantGeminiModelOptions` → `TolerantAntigravityModelOptions`.
- `packages/contracts/src/settings.ts` — replace `GeminiSettings` schema with `AntigravitySettings`: fields `enabled: boolean`, `binaryPath: string` (default `"agy"`), `dangerouslySkipPermissions: boolean` (default `true`), `customModels: string[]`. Drop `homePath`. Update `ServerSettings.providers` struct. Update `textGenerationModelSelection` default to `{ provider: "antigravity", model: "gemini-3.1-pro" }`. Update `ModelSelectionPatch` union and `GeminiModelOptionsPatch` → `AntigravityModelOptionsPatch`. Update `CodexSettingsPatch` / `GeminiSettingsPatch` sibling — rename the gemini patch.
- `packages/shared/src/model.ts` — update `MODEL_SLUG_SET_BY_PROVIDER`, `normalizeModelSlug`, and any direct `"gemini"` references.
- `apps/server/src/provider/Layers/ProviderRegistry.ts` — swap `GeminiProviderLive` import for `AntigravityProviderLive`; same for `GeminiProvider` service tag.
- `apps/server/src/provider/Layers/ProviderAdapterRegistry.ts` — same swap for adapter.
- `apps/server/src/git/Layers/RoutingTextGeneration.ts` — route `"antigravity"` to `AntigravityTextGeneration`; remove the `"gemini"` branch.
- `apps/server/src/provider/builtInProviderCatalog.ts` — update entries (if it lists providers).
- `apps/server/src/provider/providerStatusCache.ts` — update `PROVIDER_CACHE_IDS` set (search for `"gemini"`).
- `apps/server/src/provider/acp/AcpRuntimeModel.ts` — remove any gemini-specific branches; the file should no longer mention `gemini`.
- `apps/desktop/src/syncShellEnvironment.ts` — leave `GEMINI_API_KEY` / `GOOGLE_API_KEY` (real upstream env vars used by `agy`'s underlying SDK). Remove any `GEMINI_HOME` handling. Same for the test file.
- `apps/web/src/providerModels.ts`, `apps/web/src/modelSelection.ts`, `apps/web/src/session-logic.ts`, `apps/web/src/composerDraftStore.ts`, `apps/web/src/appSettings.ts` — replace literals.
- `apps/web/src/components/Icons.tsx` — rename `GeminiIcon` → `AntigravityIcon`; replace SVG asset. (The implementer must source or create an Antigravity glyph; until provided, reuse the Gemini icon temporarily and TODO it.)
- `apps/web/src/components/chat/*.tsx` and `apps/web/src/components/settings/SettingsPanels.tsx` — replace user-facing strings and provider keys. Settings panel: drop the `homePath` field; add a `dangerouslySkipPermissions` toggle (default checked, with a warning blurb).
- `PATCH.md` — apply the replacement block from §3.9.

### 4.4 No-touch files

- Codex, Claude, OpenCode, Copilot providers (untouched).
- `apps/server/src/provider/acp/*` other than `AcpRuntimeModel.ts` cleanup.
- `apps/server/src/auth/**` — Antigravity does its own auth via `~/.gemini/config/`; we do not plumb tokens.

### 4.5 Runtime-event flow (new)

```
User clicks send
    │
    ▼
AntigravityAdapter.sendTurn(threadId, input)
    │
    ▼
AntigravityDriver.runTurn({
   binaryPath,
   conversationId: getOrCreate(threadId),
   model,
   prompt,
   dangerouslySkipPermissions: true,
   cwd,
   timeoutMs: 300_000
})
    │   if conversationId: spawn agy --print "<prompt>" --conversation <id> --model <m> --dangerously-skip-permissions --print-timeout 300s
    │   else (first turn): spawn agy --print "<prompt>" --model <m> --dangerously-skip-permissions --print-timeout 300s
    │   readline-wrap child.stdout, accumulate stderr
    │   on each stdout line: forward to adapter
    │   on exit (or timeout / cancel): forward terminal state
    │   if first turn AND exit ok: read ~/.gemini/antigravity-cli/cache/last_conversations.json[cwd]
    │      → persist as thread.provider_conversation_id
    ▼
Adapter emits, in order:
   1. turn.started        { model }
   2. item.started        { itemType: "assistant_message" }     (on first non-empty stdout line)
   3. content.delta       { streamKind: "assistant_text", delta: "<line>\n" }   (one per stdout line)
      … repeated until stdout closes …
   4. item.completed      { itemType: "assistant_message" }
   5. turn.completed      { state: "completed" | "failed" | "cancelled",
                            usage: <parsed-from-stderr-if-present>,
                            errorMessage?: <stderr-tail-on-failure> }
```

Cancellation: adapter sends SIGTERM, waits 2s, escalates to SIGKILL; emits `turn.completed` with `state: "cancelled"`.

---

## 5. Migration phases

Each phase must end with `bun fmt && bun lint && bun typecheck && bun run test` green. Smoke checklist at the end of each phase is in §8.

### Phase 0 — Pre-flight investigation (read-only)

The implementer MUST complete every probe below and paste outputs into the PR description. Do not write code until this phase is done.

1. `agy --version`, `agy changelog | head -50`, `agy --help`, `agy plugin --help`.
2. `ls -la ~/.gemini/ ~/.gemini/config/ 2>/dev/null` and `ls -la ~/.config/antigravity/ 2>/dev/null`. Cat any `settings.json` / `config.json` (redact secrets). Document the on-disk layout.
3. `agy --print "say only OK"` — capture stdout, stderr, exit code, wall time. Confirm output format (plain text? JSON? trailing newline?). **Already confirmed empirically: streams line-by-line, sub-second per-line cadence, exit 0 on success.** Re-confirm in your environment and note any deviation.
4. `agy --print "remember the number 7" --conversation 11111111-1111-1111-1111-111111111111` then `agy --print "what number?" --conversation 11111111-1111-1111-1111-111111111111` — confirm `--conversation` accepts client-generated UUIDs AND that the second turn recalls state. If client-generated ids are rejected, fall back to capturing the id `agy` reports on first run (Phase 0 documents *exactly* how).
5. `agy --print "say only OK" --model gemini-3.1-pro` and the same with `gemini-3-flash-preview`, `gemini-2.5-pro`, `gemini-2.5-flash`. Document which model slugs are accepted vs rejected; this calibrates the §3.8 catalog.
6. `agy --print "list the files in $PWD" --dangerously-skip-permissions` from inside the repo — confirm tool calls execute without prompts and the file list lands in stdout.
7. `time agy --print "count to 1000 slowly" --print-timeout 5s` — confirm `--print-timeout` honors the value and that exceeding it produces a non-zero exit + identifiable stderr. **Important format note:** `--print-timeout` takes a **Go duration string** (`5s`, `60s`, `5m`, `300s`), NOT a bare integer. Probed 2026-05-27: passing `60` yields `invalid value "60" for flag -print-timeout: time: missing unit in duration "60"` and exits with code 2. The driver MUST format the timeout as `${seconds}s`.
8. **Argv length probe.** Pass an increasingly long prompt as the `--print` argument (e.g. 32 KB, 128 KB, 512 KB). Find the empirical ceiling. If it stalls below `PROVIDER_SEND_TURN_MAX_INPUT_CHARS = 120_000` chars, the driver must fall back to writing the prompt to a tempfile and invoking `agy --print "$(cat $tmp)"` via a shell — note that `agy` itself does NOT accept stdin (probed: `echo X | agy --print` fails with `flag needs an argument: -print`). Document the chosen approach.
9. **Spawn shape confirmation.** Re-run `agy --print "Reply only with PING"` and `agy --print -- "Reply only with PING"` — confirm the `--` separator is **NOT** used (already probed 2026-05-27: with `--` the prompt is dropped and `agy` falls back to a default greeting). The driver MUST pass the prompt as the argument of `--print`, not as a positional.
10. `git grep -li 'gemini' -- ':!PATCH.md' ':!.plans/' ':!**/node_modules/**' ':!bun.lock'` — capture the full inventory; cross-check against §3.10 and §4.

Phase 0 produces no commit. It produces a comment block on the PR (or a temporary `.plans/phase-0-findings.md`).

### Phase 1 — Contracts & shared types

Touches only `packages/contracts/src/**`, `packages/shared/src/**`. Goal: introduce the `"antigravity"` provider kind alongside (NOT replacing yet) `"gemini"` to make the rest of the code still compile until Phase 2 lands.

1. Add `PROVIDER_ANTIGRAVITY = "antigravity"` to `PROVIDER_KIND_VALUES`. Do NOT remove `PROVIDER_GEMINI` yet.
2. Add `AntigravityProviderStartOptions`, `AntigravityModelSelection`, `AntigravitySettings`, `AntigravityModelOptions`, `TolerantAntigravityModelOptions`.
3. Add `antigravity` entries to `MODEL_OPTIONS_BY_PROVIDER`, `DEFAULT_MODEL_BY_PROVIDER`, `MODEL_SLUG_ALIASES_BY_PROVIDER`, `PROVIDER_DISPLAY_NAMES`, `DEFAULT_REASONING_EFFORT_BY_PROVIDER`, `REASONING_EFFORT_OPTIONS_BY_PROVIDER`, `DEFAULT_GIT_TEXT_GENERATION_MODEL_BY_PROVIDER`.
4. Add `antigravity.cli.print` and `antigravity.cli.error` to `RuntimeEventRawSource`.
5. Run `bun typecheck` — expect failures in `RoutingTextGeneration.ts`, `ProviderRegistry.ts`, etc., because the literal type union for `ProviderKind` widened (many `satisfies Record<ProviderKind, …>` constructs become incomplete). Fix by giving `antigravity` placeholder values that mirror `gemini`'s; this is a stepping stone, NOT the final state.

Commit message: `feat(contracts): introduce antigravity provider kind (no runtime wiring yet)`.

### Phase 2 — Server provider + driver rewrite

1. Create `antigravityDriver.ts` per §4.2.
2. Create `AntigravityAdapter.ts` (service + layer), `AntigravityProvider.ts` (service + layer).
3. Wire into `ProviderRegistry.ts`, `ProviderAdapterRegistry.ts`, `builtInProviderCatalog.ts`, `providerStatusCache.ts`.
4. Delete the Gemini files listed in §4.1.
5. Remove the `gemini` literal from `packages/contracts/src/{orchestration,settings,model,providerRuntime}.ts` and `packages/shared/src/model.ts` (the placeholder values added in Phase 1 are now removed for `gemini`; only `antigravity` remains).
6. Update `RoutingTextGeneration.ts` to dispatch `"antigravity"` (Phase 3 fills in the actual implementation; for now route to a stub `Effect.fail` so typecheck stays green).
7. Add the persistence migration that rewrites `"gemini"` → `"antigravity"`.

Commit message: `feat(server): replace gemini provider with antigravity (drops --experimental-acp)`.

### Phase 3 — Text generation

1. Create `apps/server/src/git/Layers/AntigravityTextGeneration.ts` per §3.7.
2. Wire it into `RoutingTextGeneration.ts` (replace the Phase 2 stub).
3. Update `RoutingTextGeneration.test.ts` if it exists.

Commit message: `feat(server): wire antigravity into commit-message text generation`.

### Phase 4 — Desktop env / shell sync

1. `apps/desktop/src/syncShellEnvironment.ts` — remove any `GEMINI_HOME` references; keep `GEMINI_API_KEY` and `GOOGLE_API_KEY`. Add an inline comment noting that `agy` reuses Gemini's env vars and config dir.
2. `apps/desktop/src/syncShellEnvironment.test.ts` — drop `GEMINI_HOME` cases; add a case verifying `GOOGLE_API_KEY` and `GEMINI_API_KEY` round-trip.
3. Search for any other desktop wiring referencing `gemini` (project scaffolding, default settings, etc.) and migrate.

Commit message: `chore(desktop): drop GEMINI_HOME passthrough (antigravity migration)`.

### Phase 5 — Web UI

1. Rename `GeminiIcon` → `AntigravityIcon` in `apps/web/src/components/Icons.tsx`. Until a real Antigravity SVG is provided, keep the Gemini glyph and add a TODO comment with the issue link.
2. `apps/web/src/providerModels.ts`, `modelSelection.ts`, `session-logic.ts`, `composerDraftStore.ts`, `appSettings.ts` — replace every `"gemini"` literal with `"antigravity"`.
3. `apps/web/src/components/chat/*.tsx` — replace user-facing strings (`"Gemini"` → `"Antigravity"`); update icon references.
4. `apps/web/src/components/settings/SettingsPanels.tsx` — rename the Gemini panel section, drop the `homePath` field, add a `dangerouslySkipPermissions` checkbox (default checked, with a warning sub-label: "Antigravity executes tool calls without per-call approval. Uncheck to disable Antigravity entirely.").
5. Hide effort and interaction-mode toggles for Antigravity (Phase 0 may have promoted effort to a real flag — if so, keep the toggle).

Commit message: `feat(web): rename Gemini to Antigravity across the UI`.

### Phase 6 — Tests & smoke matrix

1. Apply the test dispositions from §3.10.
2. Run `bun run test` end-to-end.
3. Smoke matrix (manual, dev build):

   | Scenario                                            | Expected                                                |
   | --------------------------------------------------- | ------------------------------------------------------- |
   | Open a fresh thread, pick Antigravity, send "hello" | Assistant replies, no streaming, conversation persisted |
   | Send a second turn in the same thread               | `agy` recalls context                                   |
   | Restart the server, reopen the thread, send a turn  | Context still recalled (conversation id round-trips)    |
   | Send a turn that triggers a tool (read a file)      | Tool executes silently, no approval prompt              |
   | Cancel mid-turn                                     | `turn.completed` with `state: "cancelled"` lands within 3s |
   | Generate a commit message via Antigravity           | Subject + body produced                                 |
   | Open old thread that had `provider: "gemini"`       | Migration silently rewrote it; loads as Antigravity     |
   | Set `enabled: false` in settings                    | Provider disappears from picker                         |
   | Set `binaryPath` to a bogus path                    | `runtime.error` emitted, thread state error             |

Commit message: `test: cover antigravity provider end-to-end`.

### Phase 7 — PATCH.md & docs

1. Apply the §3.9 replacement block to PATCH.md §1.
2. Update PATCH.md §7 (drop Gemini reference) and §8 (rename text-gen file).
3. Add a top-of-file note: "Gemini provider removed in commit `<SHA>`; see Antigravity entry."
4. Update any user-facing docs (README, marketing site `apps/marketing/`) that mention Gemini.

Commit message: `docs: PATCH.md + user docs for antigravity migration`.

---

## 6. Risks & open questions

Items the user must answer (or accept the default) BEFORE Phase 0 starts:

1. **Binary location vs. settings field.** Default plan: `binaryPath` settings field defaults to bare `"agy"` and relies on PATH. Alternative: hardcode `/home/sergiom/.local/bin/agy` until install scripts catch up. The implementer should choose bare `"agy"` unless the user vetoes.
2. **Deprecation window.** Default plan: hard-cut the `"gemini"` provider id in the same PR. Alternative: keep `"gemini"` as a hidden alias that the legacy migration rewrites — already covered. No further window needed.
3. **`gemini-2.x` model slugs.** Phase 0 must prove whether `agy` accepts these. If yes, retain them in the catalog (Phase 1). If no, drop them and rely on the alias map (Phase 1) to silently upgrade old selections.
4. **Effort knob.** Phase 0 must investigate whether `agy` honors a thinking-budget / effort flag. If yes, name it and wire it in Phase 5; if no, hide the toggle in the UI.
5. **Reasoning surface in `agy` future.** If a future `agy` adds `--json-stream`, plan to revisit Phase 2 to emit incremental `content.delta`. Not blocking.
6. **Prompt-injection length limit.** Phase 0 must determine whether long prompts go via stdin or argv. Affects the driver's spawn shape.
7. **Plan mode (`ProviderInteractionMode = "plan"`).** Not supported. Hidden in UI for Antigravity. Open question: should we error if a caller forces plan mode, or silently downgrade? **Recommendation:** silently downgrade and emit a `config.warning` runtime event.
8. **Upstream merge interaction.** The pending 50-commit upstream merge (PATCH.md §Pending) renames `git/Layers/*TextGeneration.ts` → `textGeneration/*TextGeneration.ts`. This migration must NOT block on that merge. After this lands, the merge becomes slightly simpler (one fewer file to rehome). Verify in the next merge that `AntigravityTextGeneration.ts` is moved to the new directory along with the Codex/OpenCode siblings.

## 7. Out of scope

- The pending 50-commit upstream merge (PATCH.md §"Pending upstream merge"). This plan deliberately operates on the current local layout and leaves the upstream merge as the next ticket.
- The OpenCode lowercase → PascalCase rename.
- The Cursor provider arriving upstream.
- The desktop Effect port (#2546).
- Copilot, Codex, Claude, OpenCode provider behavior — not touched.
- Marketing-site content beyond a one-line rename. No new marketing copy.
- Re-implementing reasoning streaming or tool-permission UI for Antigravity (deferred indefinitely; revisit if `agy` gains a streaming flag).
- Auth flows. Antigravity reuses Gemini's `~/.gemini/config/`; the user authenticates by running `agy` once outside the app.

## 8. Verification

### 8.1 Hard gate (must pass before each phase commit)

From the repo root:

```bash
bun install
bun fmt
bun lint
bun typecheck
bun run test
```

All four must exit zero. If `bun fmt` rewrites files, commit them as part of the same phase.

### 8.2 Per-phase manual smoke checklist

Phase 0: probes captured (see §5 Phase 0); no code change.

Phase 1: `bun typecheck` green; no behavioral change yet.

Phase 2: launch dev server, open the app, confirm:
- Provider picker shows "Antigravity" and not "Gemini".
- Settings panel renders the new Antigravity section with no `homePath` field.
- Selecting Antigravity + sending "hello" prints the assistant reply.

Phase 3: in the Git tab (or commit composer), trigger "Generate commit message" with the Antigravity provider selected — confirm the subject + body land.

Phase 4: kill the desktop process, relaunch, verify `GEMINI_API_KEY` (if set in your shell rc) is visible to spawned `agy` (the server log should show the env var passthrough).

Phase 5: pixel-check every place the word "Gemini" used to appear:
- Provider picker, settings panel, model picker, thread header, sidebar avatars.
- `git grep -i 'gemini' apps/web/src/` returns only icon-asset filename references (until the SVG is replaced) and migration-helper code.

Phase 6: walk the smoke matrix in §5 Phase 6.

Phase 7: `git grep -i 'gemini' -- ':!PATCH.md' ':!.plans/' ':!**/Migrations/**'` returns only:
- Env-var names `GEMINI_API_KEY` / `GOOGLE_API_KEY` in `syncShellEnvironment.ts` (intentional).
- Comments referencing the historical Gemini integration.
- Model-slug aliases in `MODEL_SLUG_ALIASES_BY_PROVIDER.antigravity` (intentional).

Anything else is a leftover and must be cleaned up before merging Phase 7.

### 8.3 Final acceptance criteria

- No source file (excluding PATCH.md, `.plans/`, migration code, env-var allowlists, and alias maps) contains the literal `"gemini"` as a `ProviderKind` value.
- `git grep '\-\-experimental-acp'` returns no hits in non-test source.
- `geminiAppServerManager.ts` no longer exists.
- A fresh database + fresh settings file produces a working Antigravity provider with the default model `gemini-3.1-pro` and the default text-generation model `gemini-3.1-pro`.
- An old database with `provider: "gemini"` rows loads cleanly after migration and the threads reopen as Antigravity.
- `bun fmt && bun lint && bun typecheck && bun run test` all exit zero on the final phase.

---

*End of plan.*
