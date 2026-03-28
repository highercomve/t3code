# Suggested Commands: T3 Code

These are the primary commands for local development within the T3 Code monorepo.

## Project-wide (from root)

- `bun run dev`: Start all dev services (server and web).
- `bun run dev:server`: Start only the server in dev mode.
- `bun run dev:web`: Start only the web UI in dev mode.
- `bun run dev:desktop`: Start the desktop application (Tauri-based).
- `bun run build`: Build all workspaces via Turbo.
- `bun run typecheck`: Run TypeScript type checking project-wide.
- `bun run lint`: Run `oxlint` to check for issues.
- `bun run fmt`: Run `oxfmt` to format the codebase.
- `bun run test`: Run all tests via Vitest (managed by Turbo).

## apps/server (from server directory)

- `bun run src/index.ts` (via `bun dev`): Start server dev mode.
- `tsc --noEmit` (via `bun typecheck`): Run local type checking.
- `vitest run` (via `bun test`): Run server-specific tests.

## apps/web (from web directory)

- `vite` (via `bun dev`): Start web dev mode.
- `tsc --noEmit` (via `bun typecheck`): Run local type checking.
- `vitest run` (via `bun test`): Run web-specific tests.

## Utility Commands

- `ls`, `cd`, `grep`, `find`, `git` (standard Linux tools).
- `turbo run <task>`: Run Turbo-managed tasks across the monorepo.
