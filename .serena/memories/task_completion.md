# Task Completion: T3 Code

To ensure high-quality contributions and consistent codebase integrity, these steps must be performed before finishing a task in the T3 Code monorepo.

## Verification Checklist

- **Linting:** Run `bun lint` from the root and ensure it passes with no warnings.
- **Type Checking:** Run `bun typecheck` from the root and ensure all TS projects pass.
- **Testing:** Run `bun run test` from the root (Vitest) and ensure all tests pass.
- **NEVER** run `bun test` directly; always use `bun run test`.

## Style Review

- Ensure new logic is extracted to shared modules if duplicated.
- Check that `packages/contracts` only contains schema definitions.
- Verify `packages/shared` uses explicit subpath exports.
- Confirm any new code adheres to Effect-TS patterns if in `apps/server`.

## Deployment/Release (Local)

- For local verification, ensure `bun run build` passes for the relevant packages and apps.
- If working on the server, ensure `bun run dev:server` starts successfully.
- If working on the web, ensure `bun run dev:web` starts successfully.
