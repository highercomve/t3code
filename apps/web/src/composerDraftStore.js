// Stub re-export: this file used to be a stale compiled artifact that
// shadowed `./composerDraftStore.ts` in vite's `.js`-before-`.ts` resolve
// order, freezing the store at its pre-merge shape (Bug 2 from the post-merge
// triage). Deleting it broke vite's in-memory HMR module graph because the
// running dev server kept a reference to the old timestamped URL.
//
// Re-exporting from the .ts module gives us the best of both: vite resolves
// the `.js` path (preserving the dev server's existing module identity) but
// loads the up-to-date source from the .ts file. The duplicate file should
// be removed once the dev server is restarted; PATCH.md notes that as a
// follow-up.
export * from "./composerDraftStore.ts";
