# Phase 0 findings — Antigravity (`agy`) probes

Date: 2026-05-27. Probed against `/home/sergiom/.local/bin/agy` (version `1.0.2`).
Findings feed back into `.plans/gemini-to-antigravity-migration.md`.

## P1 — Versions & help

- `agy --version` → `1.0.2`.
- `agy --help` exposes flags: `--add-dir`, `-c`/`--continue`, `--conversation`,
  `--dangerously-skip-permissions`, `-i`/`--prompt-interactive`, `--log-file`,
  `-p`/`--print`, `--print-timeout` (default `5m0s`), `--prompt` (alias of
  `--print`), `--prompt-interactive`, `--sandbox`. Subcommands: `changelog`,
  `help`, `install`, `plugin`/`plugins`, `update`.
- No `--acp`, `--experimental-acp`, `--model`, `--json`, `--stream`, `--effort`,
  or `--thinking-budget` flags. **Confirms plan §2: agy speaks no ACP.**
- `agy plugin import` description: "Import plugins from gemini or claude".
  Writes to `~/.gemini/config/` (per the 1.0.2 changelog), but the empirical
  config tree lives under `~/.gemini/antigravity-cli/` (see P2).

## P2 — On-disk config layout

Top-level: `~/.gemini/` (NOT `~/.gemini/config/` as the changelog implied).
The interesting subtree for our integration:

```
~/.gemini/
├── settings.json            # cross-product settings (auth, MCP servers, etc.)
├── projects.json
├── trustedFolders.json
├── oauth_creds.json
├── state.json
├── google_accounts.json
├── antigravity-cli/         # ← THIS is the cli-specific tree
│   ├── settings.json        # cli settings (model, perms, trustedWorkspaces)
│   ├── keybindings.json
│   ├── installation_id
│   ├── history.jsonl
│   ├── conversations/       # per-conversation .pb files
│   │   └── <uuid>.pb
│   ├── cache/
│   │   └── last_conversations.json   # ⚠ per-CWD → conversation-id map
│   ├── brain/               # agent skill state per conversation
│   │   └── <uuid>/.system_generated/logs/transcript.jsonl
│   ├── log/cli-<timestamp>.log
│   └── cli.log → log/cli-…log
├── antigravity/             # likely the desktop-app variant
├── antigravity-cli/ (see above)
├── antigravity-ide/
└── antigravity-browser-profile/
```

`antigravity-cli/settings.json` (excerpt):

```json
{
  "model": "Gemini 3.1 Pro (High)",
  "permissions": { "allow": [...] },
  "trustedWorkspaces": ["/home/projects/personal/t3code", ...]
}
```

Important: the model field stores a **display string** ("Gemini 3.1 Pro (High)"),
NOT the wire slug. Our integration must continue to pass `--model <slug>` (per
P5).

## P3 — `agy --print "<prompt>"` smoke

`agy --print "Reply with only the two letters: OK"` →
- exit `0`
- stdout: `OK` (no trailing newline)
- stderr: empty
- wall: `9.05 s`

So `--print` is reasonably fast for short replies. Stdout has **no trailing
newline** when the response is a single token, which we should account for
when emitting the final `content.delta`.

## P4 — Multi-turn / `--conversation` semantics (PARTIAL)

⚠ **This probe is incomplete.** I tried `agy --print "<P>" --conversation
<new-uuid>` twice; the first attempt with a bare integer timeout failed (P7),
the second with a Go duration timeout hung for >5 minutes before being killed.
Cause was not diagnosable without diving into agy's internals.

Empirical fact recovered before the kill:
`~/.gemini/antigravity-cli/cache/last_conversations.json` is a **per-CWD map**:

```json
{
  "/home/projects/personal/t3code": "7e3a9fc7-c1b8-48fd-ad6b-cae1acc17367",
  "/home/sergiom":                  "570eeceb-8693-4a3f-9835-3fcec6c5645a",
  ...
}
```

That means default `agy --print` (no flag) **auto-resumes the most recent
conversation for the CWD.** This is a major design constraint our plan did NOT
account for: every thread in the same workspace folder shares the same default
conversation unless we explicitly pass `--conversation <id>`.

**Implementation implication:**
- The driver MUST pass `--conversation <thread-uuid>` on **every** spawn, not
  just on resumes.
- Whether `agy` accepts a *client-minted* UUID (one it hasn't created yet) is
  still unknown. The fallback strategy in plan §3.3 is correct: omit
  `--conversation` on the first turn, capture the id agy minted, store it,
  reuse on every subsequent turn. The driver detects "this is the first turn
  for this thread" by checking whether `provider_conversation_id` is null.

**Open question (NOT a blocker — discovered during impl):** does
`--conversation <id>` for a non-existent id hang, error fast, or mint a new
conversation under that id? If it hangs, the driver's first-turn fallback
becomes the only safe path. **Recommendation: implement the first-turn-mints,
reuse-via-`--conversation` strategy unconditionally.** Skip the
client-minted-UUID optimization. This costs us nothing: we still own the
thread-to-conversation mapping in our SQLite, we just store the id agy
returned.

## P5 — Model slugs (RESOLVED — `agy` has NO `--model` flag)

**Resolved during Phase 7 (2026-05-27, post-Phase 6) by user-supplied
screenshot of agy's interactive `/switch-model` picker.** Verified
empirically: `agy --print --model gemini-3.1-pro` exits 2 with
`flags provided but not defined: -model`. Every slug attempt (slug form,
display form with effort, display form without effort) is rejected the
same way — the flag itself doesn't exist.

**Actual model selection mechanism in agy:**
- TUI picker shows: `Gemini 3.5 Flash (Low/Medium/High)`, `Gemini 3.1
  Pro (Low/High)`, `Claude Sonnet 4.6 (Thinking)`, `Claude Opus 4.6
  (Thinking)`, `GPT-OSS 120B (Medium)`. Effort is baked into the display
  name; there is no separate effort dimension at the CLI level.
- The picker writes the selected display string to
  `~/.gemini/antigravity-cli/settings.json`'s `model` field
  (e.g. `"Gemini 3.1 Pro (High)"`).
- `agy --print` reads that field — there is NO per-invocation override.

**Driver consequence:** `antigravityDriver.ts:buildArgv` must NOT
forward `input.model` to argv. The field is kept on the type for future
use (e.g. if we ever rewrite settings.json before spawn) but is
informational today.

**Settings/UI consequence:** the model picker in our web UI is currently
decorative for Antigravity — selecting a different model in our app
will not change what agy actually uses. If we want true model-switching
we need to either (a) call `agy` interactively and drive the picker
programmatically, or (b) rewrite `~/.gemini/antigravity-cli/settings.json`
before each spawn (and restore afterwards). Out of scope for this
migration; tracked as a follow-up.

## P6 — Tool exec without prompts (NOT RUN)

Deferred. Plan §3.5 always passes `--dangerously-skip-permissions` regardless.
Whether the flag works as documented is verifiable during Phase 6 smoke.

## P7 — Timeout format ⚠ **PLAN BUG FOUND AND FIXED**

`agy --print-timeout 60` (bare integer) fails fast with:

```
invalid value "60" for flag -print-timeout: time: missing unit in duration "60"
```

Exit code `2`. `agy` parses `--print-timeout` as a **Go `time.Duration`**.
Valid forms: `60s`, `5m`, `300s`, `5m0s`, `1h30m`. The plan was written with
bare integers everywhere and has been updated (plan §3.7, §3.1, §5/Phase 0
#7).

## P8 — Argv length (NOT RUN)

Linux `ARG_MAX` is typically ≥2 MB. Our cap is
`PROVIDER_SEND_TURN_MAX_INPUT_CHARS = 120_000`. **120K fits comfortably.**
Deferred until the implementer hits a regression; default driver shape passes
the prompt as a single `--print "<prompt>"` argument.

## P9 — Spawn shape (re-confirmed)

| Form                            | Result                                  |
| ------------------------------- | --------------------------------------- |
| `agy --print "X"`               | ✅ Prompt = "X"                          |
| `agy --print -- "X"`            | ❌ Prompt is treated as `--`; "X" lost   |
| `echo X \| agy --print`         | ❌ `flag needs an argument: -print`     |
| `agy --print "X" --other-flag` | ✅ Other flags after `--print "X"` work |

**Driver must pass the prompt as the argument of `--print`, never as a
positional. No `--` separator. Stdin is not an option.**

## P10 — Codebase `gemini` inventory (51 files)

`git grep -li 'gemini' -- ':!PATCH.md' ':!.plans/' ':!**/node_modules/**'
':!bun.lock'` returns 51 files. Highlights beyond plan §4:

- **Will need updates (not enumerated in plan §4):**
  - `apps/server/src/observability/Attributes.ts` — observability attribute
    names; rename `gemini.*` → `antigravity.*` (or drop).
  - `apps/server/src/config.ts` — search and update any `gemini` literal.
  - `apps/server/src/cli.ts` and `cli.test.ts`.
  - `apps/server/src/serverSettings.ts` and `server.test.ts`.
  - `apps/server/src/environment/Layers/ServerEnvironment.test.ts`.
  - `apps/server/src/git/Layers/AcpTextGeneration.ts` — has a gemini branch
    that needs to be torn out (Antigravity is not ACP).
  - `apps/server/src/git/Services/TextGeneration.ts`.
  - `apps/server/src/provider/Layers/OpencodeAdapter.ts` — investigate why
    Opencode references gemini (likely shared constants).
  - `apps/web/src/vscode-icons-manifest.json` — icon manifest, replace
    `gemini` icon ref.
  - `apps/web/src/components/KeybindingsToast.browser.tsx`.
  - `apps/server/test_gemini.ts` (top-level fork artifact).
  - `apps/server/src/rewrite.py` (fork-only Python tool, likely a search/
    replace helper).

- **Already in plan §4 (re-confirmed present):**
  - `apps/server/src/geminiAppServerManager.ts`
  - `apps/server/src/provider/Layers/{GeminiAdapter,GeminiProvider}.ts`
  - `apps/server/src/provider/Services/{GeminiAdapter,GeminiProvider}.ts`
  - `apps/server/src/git/Layers/GeminiTextGeneration.ts`
  - `apps/server/src/provider/{builtInProviderCatalog,providerStatusCache}.ts`
  - `apps/server/src/provider/Layers/{ProviderAdapterRegistry,ProviderRegistry}.ts`
  - `apps/server/src/provider/Layers/ProviderAdapterRegistry.test.ts`
  - `apps/server/src/git/Layers/RoutingTextGeneration.ts`
  - `packages/contracts/src/{model,orchestration,providerRuntime,settings}.ts`
  - `packages/shared/src/model.ts`
  - `apps/desktop/src/syncShellEnvironment.{ts,test.ts}`
  - All `apps/web/src/{providerModels,modelSelection,session-logic,composerDraftStore,appSettings}.ts(.test.ts)?`
  - `apps/web/src/components/{Icons.tsx,chat/*.tsx,settings/SettingsPanels.tsx}`

- **NO-OP fixture files** (`.playwright-mcp/*.yml`) — leave alone or clean up
  separately; not in scope for this migration.

## Net implications for the plan

1. **Driver always passes `--conversation <id>`.** First turn: omit, capture
   minted id from `last_conversations.json[cwd]` after exit, store in our
   thread persistence. Subsequent turns: pass `--conversation <stored-id>`.
2. **Timeout format is a Go duration string** — driver must serialize as
   `${seconds}s`.
3. **Stdout has no trailing newline guarantee.** Driver should not split on
   `\n` and discard empties; instead emit a `content.delta` per line and a
   final flush of any unterminated tail when stdout closes.
4. **`antigravity-cli/settings.json` already exists** with `trustedWorkspaces`
   listing the repo. Our integration does NOT need to manage this; agy reads
   it on every invocation.
5. **6 additional files** beyond plan §4 must be touched (see P10).

## What was NOT run and why

- P4 turn-2 recall — agy hung; revisit at Phase 6 smoke.
- P5 (model slug acceptance per slug) — defer to Phase 6 smoke.
- P6 (tool-exec without prompts) — defer to Phase 6 smoke.
- P7 (timeout enforcement positive test) — bug already found; the negative
  case in Phase 7 verification is enough.
- P8 (argv ceiling) — well below known `ARG_MAX`; defer.

None of the deferrals block Phase 1 (pure file edits). They surface as smoke
matrix failures if our assumptions are wrong, which is the right time to fix
them — Phase 1 doesn't depend on these answers.
