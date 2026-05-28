# PATCH.md — Fork Patch Inventory

This document tracks every fork-specific feature, file, and code patch that
`highercomve/t3code` carries on top of `pingdotgg/t3code` (upstream). It is the
authoritative checklist for the next upstream merge: anything listed here must
survive a `git merge upstream/main` (or be re-applied to the new upstream
shape).

Last sync references:

- Upstream HEAD at last full audit: `4f0f24f0 fix: maintain reasoning selections for multiple providers (#2760)` — fully merged into the fork.
- Fork HEAD at last full audit: `dff313a8 feat(copilot): wire ACP integration so Copilot turns actually run` (origin/main).
- Fork base (closest common ancestor): aligned with `upstream/main` through `4f0f24f0`.
- Audit date: 2026-05-28 (post-merge reconciliation + Copilot ACP port).

**Working state (2026-05-28):** the fork compiles cleanly (`bun typecheck` exit 0,
13/13 packages) and four out of six providers were smoke-tested end-to-end in
the browser:

| Provider     | Status              | Smoke test result                                  |
| ------------ | ------------------- | -------------------------------------------------- |
| Codex        | upstream            | blocked by ChatGPT Free plan (`gpt-5.4` rejected)  |
| Claude       | upstream            | "hello" in 2.5s ✓                                  |
| Cursor       | upstream            | disabled in settings (intentional)                 |
| OpenCode     | upstream PascalCase | "hello" in 5.4s ✓                                  |
| **Antigravity** | fork (§1)        | "hello" in 8.1s ✓                                  |
| **Copilot**  | fork (§2)           | "hello" in 7.3s ✓                                  |

Update this file every time we merge upstream or add a new fork feature.

---

## How to use this file

1. **Before merging upstream**, read this entire file. For each entry, locate
   the listed files and decide whether the entry is still needed (some entries
   become obsolete once upstream adopts the same idea — flag them in
   "Obsolete / Superseded" below).
2. **During the merge**, when you hit a conflict in a file listed here, the
   fork version wins unless upstream rewrote the area we touched. In that case,
   port the fork's intent onto the new upstream shape.
3. **After the merge**, run `bun fmt && bun lint && bun typecheck` and then
   `bun run test`. Update the "Last sync references" block and prune any
   entries that upstream now subsumes.
4. **When you add a new fork feature**, append it here in the same format
   before merging it to `main`.

---

## Fork commit log (chronological, most recent reconciliation at bottom)

| Commit     | Title                                                                 |
| ---------- | --------------------------------------------------------------------- |
| `a2fac667` | feature: add support to gemini and claude                             |
| `e6e0ea71` | add linux arm64                                                       |
| `881d1fb4` | feature: opencode integration version 0.0.1                           |
| `8bdee773` | fix: add messages timeline for opencode                               |
| `23d4ae3c` | feature: add local install for linux                                  |
| `7b5d25e9` | update memories                                                       |
| `c8bca90d` | feature: add opencode and gemini again                                |
| `9b3879f2` | feature: add reasoning into the chat for gemini and opencode          |
| `0cd09732` | fix: add opencode go subscription                                     |
| `1c88e0e7` | fix: auto-detect linux arch in dist:desktop:linux script              |
| `c426adb8` | feature: Add commit message suggestions and Gemini/OpenCode providers |
| `a11a68dd` | fix: delete projects without threads                                  |
| `19eef554` | feature: add support to copilot                                       |
| `e8499d24` | Add Claude Opus 4.7, Gemini effort levels, OpenCode model refresh     |
| `fc4623dd` | fix: post-merge typecheck/lint/format fixes                           |
| `c67cd65c` | docs: add PATCH.md fork patch inventory                               |
| `31a37487` | docs(PATCH): document pending upstream merge and recommended strategy |
| `be7c3dfc` | chore: remove orphan compiled artifacts left from upstream refactors  |
| `1201f464` | chore: purge stale .js/.d.ts compiled artifacts from src trees        |
| `e92e2dba` | fix: merge of upstream                                                |
| `9cfdc0f5` | feat: replace gemini ACP integration with antigravity (`agy --print`) |
| `8e5039a8` | feat(server): wire antigravity into commit-message text generation    |
| `81535644` | feat(web): finish Gemini → Antigravity UI rename                      |
| `8f6d639b` | docs+fix: PATCH.md update; driver stops forwarding non-existent --model flag |
| `e479eee7` | feat(contracts): expand antigravity model catalog from 3 to 8 models  |
| `70321388` | chore: reconcile fork contracts with upstream type changes            |
| `e06e186b` | chore: finish upstream merge reconciliation                           |
| `1d363ce0` | fix(merge): restore runtime, register Antigravity migration, add Copilot driver |
| `dff313a8` | feat(copilot): wire ACP integration so Copilot turns actually run     |

Merge commits omitted; see `git log upstream/main..HEAD --oneline` for the
current diff.

---

## Active fork features

### 1. Antigravity provider (replaces deprecated Gemini ACP integration)

One-shot, line-streaming provider for Google's Antigravity CLI (binary
`agy`). Replaces the deprecated `gemini --experimental-acp` integration
entirely — `agy` does NOT speak ACP. The on-disk provider id is
`"antigravity"`; SQLite migration **031** rewrites persisted
`provider="gemini"` references on first launch. (Note: the migration was
originally numbered `028` but renumbered to `031` after upstream took the
`028` slot for `ProjectionThreadSessionInstanceId` — see "lessons
learned" below.)

**Architecture:** per-instance `ProviderDriver` SPI (introduced upstream by
the multi-instance refactor). Antigravity registers `supportsMultipleInstances:
false` because `agy` reads its model from a single global config file
(`~/.gemini/antigravity-cli/settings.json`) — concurrent instances would
race on it.

**New files (must exist after every merge):**

- `apps/server/src/antigravityDriver.ts` — low-level `agy --print` driver
  (process spawn, line streaming, conversation-id harvest)
- `apps/server/src/provider/Drivers/AntigravityDriver.ts` — per-instance
  `ProviderDriver` registration; mirrors `ClaudeDriver`/`CodexDriver`
- `apps/server/src/provider/Layers/AntigravityAdapter.ts` —
  `makeAntigravityAdapter(settings, options)` returning
  `ProviderAdapterShape<ProviderAdapterError>`
- `apps/server/src/provider/Layers/AntigravityProvider.ts` —
  `checkAntigravityProviderStatus(settings, env)` +
  `makePendingAntigravityProvider(settings)` returning
  `ServerProviderDraft`
- `apps/server/src/textGeneration/AntigravityTextGeneration.ts` —
  `makeAntigravityTextGeneration(settings, env)` returning
  `TextGenerationShape`
- `apps/server/src/persistence/Layers/AntigravityConversationStore.ts`
- `apps/server/src/persistence/Services/AntigravityConversationStore.ts`
- **`apps/server/src/persistence/Migrations/031_RenameGeminiToAntigravity.ts`**
  (creates `antigravity_conversations` table + rewrites legacy gemini refs)

**Touches (must keep Antigravity wiring on merge):**

- Built-in driver registry — `apps/server/src/provider/builtInDrivers.ts`
  must include `AntigravityDriver` in `BUILT_IN_DRIVERS` and
  `AntigravityDriverEnv` in `BuiltInDriversEnv`.
- Settings migration — `apps/server/src/persistence/Migrations.ts` must
  import `Migration0031` and register `[31, "RenameGeminiToAntigravity",
  Migration0031]`. **If the slot 31 collides on the next merge, renumber to
  the next free slot AND update both the import and the entry.**
- Provider/model contract literals —
  `packages/contracts/src/{model,settings}.ts`,
  `packages/shared/src/model.ts` (search for `antigravity`,
  `ANTIGRAVITY_DRIVER_KIND`, `AntigravitySettings`).
- Web provider/model UI —
  `apps/web/src/components/settings/providerDriverMeta.ts` must include
  the Antigravity entry in `PROVIDER_CLIENT_DEFINITIONS`. The literal
  `gemini` must NOT appear as a `ProviderKind` value in the post-migration
  source tree — backwards-compat settings keys `customGeminiModels` /
  `geminiApiKey` are the only intentional exceptions.
- Desktop env passthrough — `apps/desktop/src/syncShellEnvironment.ts`
  (`GEMINI_API_KEY` and `GOOGLE_API_KEY` remain in the allowlist; agy
  reads them via Google's underlying SDK).

**Behavioral notes (vs the old Gemini ACP integration):**

- Driver is NOT ACP. Do NOT reuse `AcpRuntimeModel.ts` event normalization
  for this provider.
- Streaming is line-grained — one `content.delta` per stdout line.
  Empirically verified at 200–400 ms per-line cadence
  (`.plans/phase-0-findings.md` §P3, §P4).
- Multi-turn state delegated to `agy`'s own conversation store via
  `--conversation <uuid>`. The driver never passes a client-minted UUID
  — on the first turn it omits `--conversation`, then harvests the id
  that agy mints from `~/.gemini/antigravity-cli/cache/last_conversations.json`
  and persists it on the thread via `AntigravityConversationStore`.
- **`agy` 1.0.3 conversation paths have changed** vs older snapshots — the
  cache may now also live under `~/.antigravitycli/` and
  `~/.gemini/config/projects/`. If the conversation-id harvest fails
  silently in production, re-check the paths in
  `apps/server/src/antigravityDriver.ts` against the installed agy version.
- `--print-timeout` requires a Go duration string (`60s`, NOT `60`).
- The prompt is the argument of `--print` — never use the `--`
  separator (empirically dropped by agy).
- **agy has NO `--model` flag.** Verified empirically: `agy --print
  --model X` exits 2 with `flags provided but not defined: -model`.
  Model selection is the value of `model` in
  `~/.gemini/antigravity-cli/settings.json` (full display string like
  `"Gemini 3.1 Pro (High)"` — effort is encoded in the name). The `model`
  field on `ProviderSession` is informational only; the driver does NOT
  forward it.
- Reasoning surface and per-tool permission prompts are deliberately
  not emitted (agy provides no equivalent). Plan mode requests downgrade
  silently with a `runtime.warning`.
- `--dangerously-skip-permissions` is passed by default; the UI exposes
  a toggle to disable, which gates session start.

**Built-in model catalog (8 entries):** Gemini 3.1 Pro High/Low, Gemini 3.5
Flash High/Medium/Low, Claude Sonnet 4.6 Thinking, Claude Opus 4.6
Thinking, GPT-OSS 120B Medium. Defined in
`packages/contracts/src/model.ts` `ANTIGRAVITY_MODELS` (commit `e479eee7`).

**Notes for next merge:**

- If upstream adds a streaming `--json-stream` flag to `agy`, revisit
  `antigravityDriver.ts` to emit incremental token-level deltas.
- The fork no longer carries a `gemini` provider id. If upstream adds
  one later, evaluate whether to (a) reintroduce it side-by-side with
  Antigravity, or (b) keep our rename. Default: (b).

### 2. Copilot provider (GitHub Copilot CLI via ACP)

ACP-based provider for the new GitHub Copilot CLI (binary `copilot`,
v1.0.54+). The CLI exposes a real ACP server via `--acp`; the fork's
adapter spawns `copilot --acp --add-dir <cwd> [--allow-all-tools]` and
talks JSON-RPC over stdio. The adapter is modeled on `CursorAdapter`
(also ACP-based).

This is NOT the old `gh copilot` extension or the older
`copilotAppServerManager.ts` pattern from the fork's pre-merge layout.
Both of those were removed.

**Architecture:** per-instance `ProviderDriver` SPI with
`supportsMultipleInstances: true` — each instance can authenticate
independently via a different GitHub account.

**New files (must exist after every merge):**

- `apps/server/src/provider/Drivers/CopilotDriver.ts` — per-instance
  driver registered in `BUILT_IN_DRIVERS`. Env extends with `ServerConfig`
  + `ProviderEventLoggers` so the adapter factory can wire
  `nativeEventLogger`.
- `apps/server/src/provider/Layers/CopilotAdapter.ts` — full ACP adapter
  modeled on `CursorAdapter`. Uses `AcpSessionRuntime.layer` directly (no
  provider-specific extension helper). ACP `authenticate` method id is
  `copilot-login`.
- `apps/server/src/provider/Layers/CopilotProvider.ts` —
  `checkCopilotProviderStatus(settings, env)` + 4-model catalog. Probes
  the binary via `copilot --version` and checks `~/.copilot/config.json`
  for auth-presence. The CLI persists OAuth creds at mode `0600`, so the
  probe only checks existence (not contents).
- `apps/server/src/textGeneration/CopilotTextGeneration.ts` — stub
  (all four operations return `TextGenerationError`); routing falls back
  to Codex/Antigravity for commit-message generation.

**Touches:**

- `apps/server/src/provider/builtInDrivers.ts` — register `CopilotDriver`
  + add `CopilotDriverEnv` to `BuiltInDriversEnv` union.
- `packages/contracts/src/model.ts`:
  - `COPILOT_DRIVER_KIND = "copilotAgent"` (note: still the historical
    `copilotAgent` driver kind for back-compat with persisted settings)
  - `DEFAULT_MODEL_BY_PROVIDER[COPILOT_DRIVER_KIND] = "auto"`
  - `DEFAULT_GIT_TEXT_GENERATION_MODEL_BY_PROVIDER[COPILOT_DRIVER_KIND]
     = "claude-haiku-4.5"`
- `packages/contracts/src/settings.ts` — `CopilotSettings` struct
  (`enabled`, `binaryPath`, `customModels`).
- `apps/web/src/components/settings/providerDriverMeta.ts` —
  Copilot entry in `PROVIDER_CLIENT_DEFINITIONS` (icon `CopilotIcon`,
  label `"Copilot"`, badge `"Preview"`, schema `CopilotSettings`).
- `apps/web/src/components/chat/ModelPickerSidebar.tsx` — the "Github
  Copilot — coming soon" placeholder was removed; Copilot is now a
  first-class entry in the picker sidebar.

**Built-in model catalog (4 entries):** `auto`, `claude-haiku-4.5`,
`gpt-5-mini`, `gpt-4.1`. **Verified empirically against `copilot --acp`
v1.0.54** — sending any other slug returns
`Invalid value "X" for session config option "model": expected one of
auto, gpt-5-mini, gpt-4.1, claude-haiku-4.5`. If the CLI accepts more
models in a future release, expand `BUILT_IN_MODELS` in
`CopilotProvider.ts`.

**Behavioral notes:**

- `--allow-all-tools` is gated on `dangerouslySkipPermissions === true`
  (matches Antigravity's gate).
- Model selection happens via `runtime.setModel` post-`session/new`
  (Cursor pattern), NOT via a CLI `--model` flag at spawn time. This
  lets the user switch models mid-session without respawning the agent.
- The text-generation routing layer (commit-message / PR-description
  generation) is currently a stub — calls to it return
  `TextGenerationError`. Routing falls back to other providers. Re-wiring
  is a follow-up.
- Cursor-specific ACP extensions (`cursor/ask_question`,
  `cursor/create_plan`, `cursor/update_todos`) and mode-selection mapping
  (plan/agent/approval) were intentionally NOT carried over — the Copilot
  ACP server does not speak those methods.

**Notes for next merge:**

- If upstream merges its own Copilot provider (currently shown as "coming
  soon" in upstream's `ModelPickerSidebar.tsx`), diff before clobbering;
  upstream may pick a different model-selection mechanism.
- If the `~/.copilot/config.json` path moves in a future Copilot release,
  update `copilotAuthFileCandidates()` in `CopilotProvider.ts`.

### 3. OpenCode fork patches (now on upstream PascalCase)

Upstream owns the `OpenCodeAdapter` / `OpenCodeProvider` /
`OpenCodeTextGeneration` files (in PascalCase, under `provider/Drivers/`
+ `textGeneration/`). The fork-specific patches listed below have all
been absorbed into the upstream files during the 2026-05-28 merge — they
no longer require fork-side overrides.

**Fork patches that survived (now living in upstream files, search for
the relevant commit hash to audit):**

- "OpenCode go subscription" subscribe message (commit `0cd09732`).
- Reasoning streaming (commit `9b3879f2`).
- Messages timeline support (commit `8bdee773`).
- Commit-message generation via OpenCode (commit `c426adb8`).
- Model refresh (commit `e8499d24`).

**Fork patches that were dropped as obsolete:**

- TodoWrite-style plan event normalization — superseded by upstream
  refactor #2218 (`Refactor OpenCode lifecycle and structured output
  handling`). Plan updates now flow through
  `apps/server/src/provider/acp/AcpRuntimeModel.ts` `case "plan"`. Do NOT
  re-introduce the ad-hoc handler.

**Settings naming:** the contracts schema is `OpenCodeSettings` (PascalCase),
with a deprecated alias `OpencodeSettings` kept for back-compat. Server
code should use `OpenCodeSettings` going forward.

### 4. Linux ARM64 + local install support

**Touches:**

- `apps/desktop/package.json` — desktop build/dist scripts.
- `apps/desktop/scripts/*.mjs` — auto-detect Linux arch in
  `dist:desktop:linux` (commit `1c88e0e7`).
- `scripts/` — additional build helpers used by Linux ARM64 packaging.
- `apps/marketing/src/pages/download.astro` — exposes Linux ARM64 download.
- Release workflows under `.github/workflows/` may diverge.

**Notes for next merge:** Upstream often rewrites release workflows. Diff
`.github/workflows/release.yml` carefully and preserve `linux-arm64` matrix
entries and any `dist:desktop:linux:*` scripts.

### 5. Claude Opus 4.7 + Antigravity effort levels + OpenCode model refresh

Commit `e8499d24`. Add new built-in models and per-provider reasoning effort.

**Touches:**

- `packages/contracts/src/model.ts` and `packages/shared/src/model.ts` — model
  catalog (look for `claude-opus-4-7`, `opus-4-7`, `gemini-3.1-pro`).
- `packages/contracts/src/model.ts` — Antigravity `effort` literal union
  (`ANTIGRAVITY_EFFORT_OPTIONS`). Note: agy itself exposes no effort flag;
  the field is stored in settings as a future-compat no-op.
- Web model picker — `apps/web/src/components/**` (search for `opus-4-7`).

**Notes for next merge:** Upstream periodically adds new Claude models too.
When upstream adds Opus 4.7 or later, drop our local entry to avoid
duplicates.

### 6. "Delete projects without threads" fix

Commit `a11a68dd`. Removes the upstream guard that refused to delete a project
that still had any (even empty) thread rows.

**Touches:** project deletion path in `apps/server/src/` and/or
`apps/web/src/`. Search for the original error message text or for the
project-delete RPC handler.

### 7. Serena project memory + project.yml

`.serena/` directory carries this fork's Serena project memories and
`project.yml`. Upstream does not configure Serena.

**Files:**

- `.serena/project.yml`
- `.serena/memories/*.md`
- `.serena/.gitignore`

**Notes:** Serena periodically autopatches `project.yml` on activate; commit
those updates as housekeeping. They are not behavioral changes.

---

## Obsolete / Superseded

Entries that this fork used to carry but that upstream now subsumes. Keep this
list as a graveyard so we don't accidentally resurrect dead patches on the
next merge.

- **OpenCode `case "plan"` handler in `opencodeAppServerManager.ts`** —
  superseded by upstream refactor #2218 (`Refactor OpenCode lifecycle and
  structured output handling`). Plan updates now flow through
  `apps/server/src/provider/acp/AcpRuntimeModel.ts` `case "plan"`. Do NOT
  re-introduce the ad-hoc handler.

- **`*AppServerManager.ts` files** — upstream replaced the per-provider
  `AppServerManager` pattern with the per-instance `ProviderDriver` SPI
  under `apps/server/src/provider/Drivers/`. The following fork files were
  deleted in commit `e06e186b` because they no longer had any in-tree
  consumer after upstream's refactor:
    - `apps/server/src/opencodeAppServerManager.ts` (+ `.test.ts`)
    - `apps/server/src/copilotAppServerManager.ts`
    - `apps/server/src/claudeCodeAppServerManager.ts`
    - `apps/server/src/cli.ts` (orphan after upstream split into `cli/*`)
    - `apps/server/src/git/Layers/RoutingTextGeneration.ts`
    - `apps/server/src/git/Services/GitManager.ts`
    - `apps/server/src/textGeneration/AcpTextGeneration.ts`
    - `apps/server/src/textGeneration/OpencodeTextGeneration.ts` (lowercase fork)
    - `apps/server/src/provider/Layers/Opencode{Adapter,Provider}.ts` (lowercase)
    - `apps/server/src/provider/Services/Opencode{Adapter,Provider}.ts` (lowercase)
    - `apps/server/src/provider/Services/Antigravity{Adapter,Provider}.ts`
      (Context.Service tags — superseded by `AntigravityDriver`'s plain-value
      factory pattern; the per-instance `ProviderInstance` SPI does not use tags)
    - `apps/web/src/appSettings.ts` (orphan; depended on removed
      `getModelOptions` helper)

  **Note**: Copilot was *also* deleted in `e06e186b` as part of this sweep, then
  re-implemented from scratch in `1d363ce0` + `dff313a8` against the new SPI.
  Do not re-delete it.

- **`GitManagerShape.suggestCommitMessage`** — fork added a `suggestCommitMessage`
  method on `GitManagerShape`. Upstream moved commit-message generation onto
  `TextGenerationShape.generateCommitMessage` (per-instance), so the method was
  removed from `GitManagerShape` and its consumers in the WS RPC
  (`gitSuggestCommitMessage`) and the web client (`api.git.suggestCommitMessage`,
  `wsRpcClient.git.suggestCommitMessage`, `gitSuggestCommitMessageMutationOptions`,
  `<GitActionsControl />` "Generate commit message" button wiring) were
  stubbed/removed. **Re-wiring TODO**: hook the `<GitActionsControl />`
  Generate button onto upstream's `TextGeneration.generateCommitMessage` via
  a new RPC method (still missing from contracts in this branch). Search
  for `TODO(fork)` markers in `apps/web/src/components/GitActionsControl.tsx`
  and `apps/web/src/lib/gitReactQuery.ts`.

- **`providerModelPreferences.modelOrder`** — removed from the
  `ClientSettings.providerModelPreferences` value shape. The setting was a
  fork-only enhancement; upstream only persists `hiddenModels`. The
  associated `<ProviderInstanceCard onModelOrderChange>` prop became optional
  with a no-op default to keep the editor compiling. If we want to keep
  per-instance model ordering, restore the schema field and the per-card
  wiring together.

- **Layer-based `Antigravity*` files (legacy Layer pattern)** — replaced
  with factory-style files that match upstream's `make<Provider>Adapter`
  shape. Antigravity is now wired through
  `apps/server/src/provider/Drivers/AntigravityDriver.ts` (registered in
  `BUILT_IN_DRIVERS`). The old `provider/Services/Antigravity*` tag-based
  files have been deleted.

---

## Lessons learned (2026-05-28 reconciliation)

Notes from the merge that will save the next person time:

1. **Migration slot collisions.** Our `028_RenameGeminiToAntigravity.ts`
   silently lost to upstream's `028_ProjectionThreadSessionInstanceId.ts` —
   the file existed on disk but was never registered in `Migrations.ts`, so
   the `antigravity_conversations` table never got created and every
   Antigravity turn aborted with "Failed to load antigravity conversation
   id." Renumbered to `031`. **Always grep upstream for slot conflicts
   before adding migrations**, and register them in `Migrations.ts`.

2. **Stale `.js` shadows in `apps/web/src`.** Vite's resolver picks `.js`
   over `.ts` when both exist. The fork had a committed-by-accident
   `apps/web/src/composerDraftStore.js` (from a long-ago compile artifact
   purge) that silently shadowed the post-merge `.ts` source — every model
   picker click went to the dead `.js` code instead of the rewritten
   `setModelSelection`. Re-exported the `.js` as a one-line `export *
   from "./composerDraftStore.ts"` as a temporary unblock. The stub
   should be deleted entirely the next clean dev-server restart.
   **Audit for shadow pairs after large merges**:
   `find apps/web/src -name '*.js' -not -name '*.test.js'`.

3. **TanStack Router selectors return fresh objects every commit.** The
   chat route had
   `useParams({ select: (p) => resolveThreadRouteRef(p) })` returning a
   new `{environmentId, threadId}` on every router state change. That fresh
   reference busted a downstream `useEffect` dep equality, which called
   `navigate({to:"/"})`, which re-ran the selector — infinite loop, React
   error #185 (~200 errors per page load). Memoize selector outputs against
   primitive params, or read raw params and `useMemo` upstream.

4. **Provider-specific CLI auth paths drift.** The fork's original
   `~/.config/github-copilot/hosts.json` check was correct for the *old*
   `gh copilot` extension; the *new* `copilot` CLI uses
   `~/.copilot/config.json`. Verify with `ls -la $HOME` before trusting
   any path in a status probe.

5. **ACP model catalogs are gated by the upstream agent.** The Copilot
   CLI ACP server rejects any model slug not in its built-in set with a
   helpful error message
   (`expected one of auto, gpt-5-mini, gpt-4.1, claude-haiku-4.5`). When
   adding a new ACP provider's model catalog, run the agent once and
   capture the actual accepted list — do not invent slugs.

---

## Maintenance recipe — merging the next upstream

1. `git fetch upstream && git fetch origin`
2. Read this file end-to-end.
3. `git checkout main && git pull origin main`
4. `git merge upstream/main` — expect conflicts in:
   - `apps/server/src/provider/**` (any new upstream driver files may
     collide with fork-added Antigravity / Copilot driver files)
   - `apps/server/src/provider/builtInDrivers.ts` — keep fork's
     `AntigravityDriver` and `CopilotDriver` in `BUILT_IN_DRIVERS`
   - `apps/server/src/persistence/Migrations.ts` — re-slot `031` if
     upstream took it; renumber the migration file accordingly
   - `apps/server/src/textGeneration/*` (any *TextGeneration.ts may
     collide with fork-added Antigravity/Copilot text gen)
   - `packages/contracts/src/{model,providerRuntime,settings,orchestration,rpc,ipc,git}.ts`
     (Antigravity + Copilot driver kinds, default model maps, settings
     schemas must survive)
   - `apps/desktop/**` (any future Effect-port refactors)
   - `.github/workflows/release.yml` (Linux ARM64 matrix)
   - `apps/web/src/components/settings/providerDriverMeta.ts` (Antigravity
     + Copilot entries in `PROVIDER_CLIENT_DEFINITIONS`)
   - `apps/web/src/components/chat/ModelPickerSidebar.tsx` (do NOT
     re-introduce the "coming soon" placeholders for Gemini / Copilot)
5. For each conflict, consult the section above that owns the touched file.
6. Run `bun install`, then `bun fmt && bun lint && bun typecheck` (these
   commands MUST pass before commit — see `CLAUDE.md`).
7. Run `bun run test`.
8. **Audit for `.js` shadows** in `apps/web/src`:
   `find apps/web/src -name '*.js' -not -name '*.test.js'`. Any matches
   should either be removed or re-exported as one-line `.ts` re-exports.
9. **Smoke-test all six providers** end-to-end in the desktop or web app:
   - Codex (any of the GPT-5.x models)
   - Claude (any model)
   - Cursor (if enabled in settings)
   - OpenCode (any upstream model)
   - **Antigravity** (any of the 8 Gemini/Claude/GPT-OSS variants)
   - **Copilot** (one of `auto`, `claude-haiku-4.5`, `gpt-5-mini`, `gpt-4.1`)
10. Update the "Last sync references" block at the top of this file.
11. Commit as `chore: merge upstream/main + reconcile fork patches`.
