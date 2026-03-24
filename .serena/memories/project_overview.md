# Project Overview: T3 Code

T3 Code is a minimal web GUI for coding agents, currently optimized for Codex with Claude Code support planned. It aims to provide a fast, reliable, and maintainable interface for AI-driven development.

## Purpose
The project provides a web-based interface that wraps the Codex `app-server` and other provider sessions, enabling a GUI-driven workflow for coding agents.

## Codebase Structure (Monorepo)
- `apps/server`: Node.js server (Effect-based) that manages provider sessions via WebSockets. It wraps the Codex app-server and projects provider runtime activity into orchestration events.
- `apps/web`: React/Vite UI that owns the session UX and renders conversation events.
- `packages/contracts`: Shared TypeScript schemas and contracts for events and protocols (no runtime logic).
- `packages/shared`: Shared runtime utilities with explicit subpath exports.

## Tech Stack
- **Runtime:** Bun / Node.js
- **Frontend:** React, Vite, Tailwind CSS (optional, prefer Vanilla CSS)
- **Backend:** Effect-TS, SQLite (via @effect/sql-sqlite-bun), WebSockets (ws)
- **Testing:** Vitest
- **Tooling:** Turbo, oxlint, oxfmt, TypeScript
