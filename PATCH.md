# PATCH.md — Fork Patch Inventory

This document tracks every fork-specific feature, file, and code patch that
`highercomve/t3code` carries on top of `pingdotgg/t3code` (upstream). It is the
authoritative checklist for the next upstream merge: anything listed here must
survive a `git merge upstream/main` (or be re-applied to the new upstream
shape).

Last sync references:

- Upstream HEAD at last full audit: `d1e85c4e chore(release): prepare v0.0.24`
- Fork HEAD at last full audit: `fc4623dd fix: post-merge typecheck/lint/format fixes`
- Fork base (closest common ancestor): `ada410bc chore(release): prepare v0.0.21`

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

## Fork commit log (chronological)

These are the commits unique to this fork (older first):

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

Merge commits omitted; see `git log upstream/main..HEAD --oneline` for the
current diff.

---

## Active fork features

### 1. Gemini provider

Full ACP-based provider for Google's Gemini CLI agent.

**New files (must exist after every merge):**

- `apps/server/src/geminiAppServerManager.ts`
- `apps/server/src/provider/Layers/GeminiAdapter.ts`
- `apps/server/src/provider/Layers/GeminiProvider.ts`
- `apps/server/src/provider/Services/GeminiAdapter.ts`
- `apps/server/src/provider/Services/GeminiProvider.ts`
- `apps/server/src/git/Layers/GeminiTextGeneration.ts`

**Touches (must keep Gemini wiring on merge):**

- Provider registry — `apps/server/src/provider/Layers/ProviderRegistry.ts`,
  `apps/server/src/provider/Layers/ProviderAdapterRegistry.ts`
- Commit-message text generation routing — `apps/server/src/git/Layers/RoutingTextGeneration.ts`
- Model + provider contract literals — `packages/contracts/src/providerRuntime.ts`,
  `packages/contracts/src/orchestration.ts`, `packages/contracts/src/settings.ts`,
  `packages/contracts/src/model.ts`
- Web provider/model UI — `apps/web/src/components/**` (search for `gemini`)

**Notes for next merge:**

- Upstream may eventually add a Gemini provider of its own. If so, diff our
  adapter against theirs and keep ours unless theirs is strictly better.
- Gemini reasoning surfaces through the same `turn/plan/updated` /
  `item/reasoning/textDelta` channels as Codex; the central handling lives in
  `apps/server/src/provider/acp/AcpRuntimeModel.ts`.

### 2. Copilot provider

ACP-based provider for GitHub Copilot CLI.

**New files:**

- `apps/server/src/copilotAppServerManager.ts`
- `apps/server/src/provider/Layers/CopilotAdapter.ts`
- `apps/server/src/provider/Layers/CopilotProvider.ts`
- `apps/server/src/provider/Services/CopilotAdapter.ts`
- `apps/server/src/provider/Services/CopilotProvider.ts`

**Touches:**

- Provider registry and adapter registry (same files as Gemini).
- Auth flow — Copilot uses GitHub device-flow auth; relevant code is wired in
  `apps/server/src/auth/`.
- Provider/model literals in `packages/contracts/src/providerRuntime.ts`.

**Notes for next merge:**

- Upstream periodically restructures `provider/Layers`. When that happens,
  re-house the Copilot files in the new directory shape and update imports.

### 3. Claude Code AppServer manager

Fork has a dedicated `claudeCodeAppServerManager.ts` that upstream does not.

**New files:**

- `apps/server/src/claudeCodeAppServerManager.ts`

**Notes:** Investigate whether upstream now handles Claude Code via a different
abstraction (`ClaudeProvider` + `ClaudeAdapter`). If so, this file may be
obsolete; verify before deleting.

### 4. OpenCode provider patches

Upstream has its own OpenCode provider (PascalCase `OpenCodeAdapter`,
`OpenCodeProvider`, `OpenCodeDriver`, plus `provider/Drivers/`,
`textGeneration/` directories). Our fork has an older, lowercase variant
(`opencodeAppServerManager`, `OpencodeAdapter`, `OpencodeProvider`).

**Fork files:**

- `apps/server/src/opencodeAppServerManager.ts`
- `apps/server/src/opencodeAppServerManager.test.ts`
- `apps/server/src/provider/Layers/OpencodeAdapter.ts`
- `apps/server/src/provider/Layers/OpencodeProvider.ts`
- `apps/server/src/provider/Services/OpencodeAdapter.ts`
- `apps/server/src/provider/Services/OpencodeProvider.ts`
- `apps/server/src/provider/opencodeRuntime.ts`
- `apps/server/src/git/Layers/OpencodeTextGeneration.ts`

**Fork-specific behavior to preserve when reconciling with upstream:**

- "OpenCode go subscription" subscribe message (commit `0cd09732`).
- TodoWrite-style plan event normalization. (Already handled centrally via
  `apps/server/src/provider/acp/AcpRuntimeModel.ts` `case "plan"` since
  the upstream lifecycle refactor #2218 — our older ad-hoc patch in
  `opencodeAppServerManager.ts` is now obsolete; do not re-add it.)
- Reasoning streaming (commit `9b3879f2`).
- Messages timeline support (commit `8bdee773`).
- Commit-message generation via OpenCode (commit `c426adb8`).
- Model refresh (commit `e8499d24`).

**Next-merge plan:**

- Decision needed: migrate the fork's lowercase opencode files onto upstream's
  PascalCase + `Drivers/`-based layout, OR keep the fork's variant indefinitely.
  Migrating is the long-term winner; until done, conflicts in this area are
  expected.

### 5. Linux ARM64 + local install support

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

### 6. Claude Opus 4.7 + Gemini effort levels + OpenCode model refresh

Commit `e8499d24`. Add new built-in models and per-provider reasoning effort.

**Touches:**

- `packages/contracts/src/model.ts` and `packages/shared/src/model.ts` — model
  catalog (look for `claude-opus-4-7`, `opus-4-7`).
- `packages/contracts/src/providerRuntime.ts` — Gemini `effort` literal union.
- `apps/server/src/provider/Services/ClaudeProvider.ts` and
  `apps/server/src/provider/Layers/ClaudeProvider.ts` — Opus 4.7 wiring.
- Web model picker — `apps/web/src/components/**` (search for `opus-4-7`).

**Notes for next merge:** Upstream periodically adds new Claude models too
(e.g. `Add Claude Opus 4.5` #2143 already in upstream). When upstream adds
Opus 4.7 or later, drop our local entry to avoid duplicates.

### 7. Reasoning surfaces for Gemini & OpenCode

Commit `9b3879f2`. Maps each provider's reasoning chunks onto the shared
`item/reasoning/textDelta` ACP method so the UI's "thinking" panel works for
non-Codex providers.

**Touches:** the adapter files listed in §1, §2, §4 plus the runtime model
under `apps/server/src/provider/acp/AcpRuntimeModel.ts`.

### 8. Commit message suggestions powered by Gemini / OpenCode

Commit `c426adb8`. Wires Gemini and OpenCode into the "Generate commit
message" / "Generate PR description" flow that upstream originally limited to
Codex and Claude.

**Touches:**

- `apps/server/src/git/Layers/RoutingTextGeneration.ts` — provider router.
- `apps/server/src/git/Layers/GeminiTextGeneration.ts` (new).
- `apps/server/src/git/Layers/OpencodeTextGeneration.ts` (new).

### 9. "Delete projects without threads" fix

Commit `a11a68dd`. Removes the upstream guard that refused to delete a project
that still had any (even empty) thread rows.

**Touches:** project deletion path in `apps/server/src/` and/or
`apps/web/src/`. Search for the original error message text or for the
project-delete RPC handler.

### 10. Serena project memory + project.yml

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

---

## Pending upstream merge (as of fork HEAD `fc4623dd`)

Upstream has **103 commits** ahead of the fork (last audit). A trial
`git merge upstream/main` produced **79 conflicting files**, dominated by
three architectural refactors that overlap heavily with fork work:

1. **`aa219be7 port desktop app to Effect (#2546)`** — splits
   `apps/desktop/src/*.ts` into `apps/desktop/src/{app,backend,electron,ipc,settings,shell,ssh,updates,window}/*.ts`.
   Almost every fork addition under `apps/desktop/src/` (Linux ARM64 hooks,
   `dist:desktop:linux:*` plumbing) needs to be re-homed in the new layout.
2. **`08e6d4cf feat: Multi-Provider support (#2277)`** + **`460d9c3e Refactor
provider settings to declarative metadata (#2452)`** — restructure the
   provider system. Touches every file under `apps/server/src/provider/**`
   that our Gemini/Copilot/Claude-Code work also touches.
3. **`6d7fe2ee Introduce pluggable VCS driver foundation (#2435)`** +
   **`0ce7e56e feat(scm): Gitlab (#2462)`** +
   **`91a03e07 feat(source-control): add Bitbucket & Azure Devops providers (#2473)`** —
   introduce a VCS driver abstraction that our commit-message-suggestions
   wiring (Gemini/OpenCode text generation) needs to align with.

Because of the scope, the recommended path is **not** a single bulk merge:

- **Step 1 — Safe upstream parts**: cherry-pick the small, fork-orthogonal
  commits first (bug fixes, doc updates, UI polish). Skim the upstream log
  from the bottom up and pull anything that does not touch
  `apps/desktop/src/`, `apps/server/src/provider/`, or
  `apps/server/src/git/`. Most of the `[codex]`, `fix(web)`, `fix(mobile)`,
  `feat(web)` commits qualify.
- **Step 2 — Provider refactor catch-up**: port Gemini, Copilot, and the
  fork's OpenCode patches onto upstream's multi-provider + declarative
  metadata system. This is a focused refactor PR on its own.
- **Step 3 — Desktop Effect port**: rehome Linux ARM64 / install hooks onto
  the new `apps/desktop/src/{app,backend,electron,...}` layout.
- **Step 4 — VCS driver alignment**: migrate
  `RoutingTextGeneration`/`GeminiTextGeneration`/`OpencodeTextGeneration`
  onto the new pluggable VCS driver API.

The full pending-upstream commit list lives in
`git log HEAD..upstream/main --oneline`.

---

## Maintenance recipe — merging the next upstream

1. `git fetch upstream && git fetch origin`
2. Read this file end-to-end.
3. `git checkout main && git pull origin main`
4. `git merge upstream/main` — expect conflicts in:
   - `apps/server/src/provider/**`
   - `apps/server/src/git/Layers/*TextGeneration.ts`
   - `packages/contracts/src/{model,providerRuntime,settings,orchestration}.ts`
   - `apps/desktop/**` (Effect port refactors)
   - `.github/workflows/release.yml`
   - `packages/shared/src/model.ts`
5. For each conflict, consult the section above that owns the touched file.
6. Run `bun install`, then `bun fmt && bun lint && bun typecheck` (these
   commands MUST pass before commit — see `CLAUDE.md`).
7. Run `bun run test`.
8. Smoke-test all four providers (Codex, Claude, Gemini, OpenCode, Copilot)
   end-to-end in the desktop app.
9. Update the "Last sync references" block at the top of this file.
10. Commit as `chore: merge upstream/main + reconcile fork patches`.
