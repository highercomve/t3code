# Style and Conventions: T3 Code

These guidelines should be followed when contributing to the T3 Code monorepo.

## Coding Style
- **TypeScript First:** All code is written in TypeScript with strict typing.
- **Strictness:** `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and `noImplicitOverride` are enabled.
- **Effect-TS:** The backend (`apps/server`) is built on **Effect-TS**. Follow Effect patterns (Services, Layers, schemas).
- **Naming:** Follow standard TypeScript camelCase for variables/functions and PascalCase for Classes/Types.
- **No Barrel Imports:** In `packages/shared`, use explicit subpath exports (e.g. `@t3tools/shared/git`) instead of barrel indices (`index.ts` files).

## Linting & Formatting
- **Linting:** Use `oxlint` (`bun lint`) for high-performance linting. No unused disable directives.
- **Formatting:** Use `oxfmt` (`bun fmt`) for consistent code formatting.

## Architectural Patterns
- **Correctness & Robustness:** Prioritize behavior over short-term convenience.
- **Logic Extraction:** Avoid duplicated logic; extract shared code into `packages/shared`.
- **Schema Separation:** `packages/contracts` must be schema-only (no runtime logic).
- **Communication:** Communication between components is handled via structured events (e.g. WebSocket push on `orchestration.domainEvent`).

## Visual Design
- **Prefer Vanilla CSS:** Use standard CSS over Tailwind CSS unless explicitly requested.
- **Performance First:** Keep the app fast and responsive.
- **Predictable Behavior:** Ensure correct behavior under load and during partial failures (session restarts/reconnects).
