import { MAX_SCRIPT_ID_LENGTH, SCRIPT_RUN_COMMAND_PATTERN } from "@t3tools/contracts";
import { Schema } from "effect";
function normalizeScriptId(value) {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (cleaned.length === 0) {
    return "script";
  }
  if (cleaned.length <= MAX_SCRIPT_ID_LENGTH) {
    return cleaned;
  }
  return cleaned.slice(0, MAX_SCRIPT_ID_LENGTH).replace(/-+$/g, "") || "script";
}
export const commandForProjectScript = (scriptId) =>
  SCRIPT_RUN_COMMAND_PATTERN.makeUnsafe(`script.${scriptId}.run`);
export function projectScriptIdFromCommand(command) {
  const trimmed = command.trim();
  if (!Schema.is(SCRIPT_RUN_COMMAND_PATTERN)(trimmed)) {
    return null;
  }
  const [prefix, , suffix] = SCRIPT_RUN_COMMAND_PATTERN.parts;
  return trimmed.slice(prefix.literal.length, -suffix.literal.length);
}
export function nextProjectScriptId(name, existingIds) {
  const taken = new Set(Array.from(existingIds));
  const baseId = normalizeScriptId(name);
  if (!taken.has(baseId)) return baseId;
  let suffix = 2;
  while (suffix < 10_000) {
    const candidate = `${baseId}-${suffix}`;
    const safeCandidate =
      candidate.length <= MAX_SCRIPT_ID_LENGTH
        ? candidate
        : `${baseId.slice(0, Math.max(1, MAX_SCRIPT_ID_LENGTH - String(suffix).length - 1))}-${suffix}`;
    if (!taken.has(safeCandidate)) {
      return safeCandidate;
    }
    suffix += 1;
  }
  // This last-resort fallback only triggers after exhausting thousands of suffixes.
  return `${baseId}-${Date.now()}`.slice(0, MAX_SCRIPT_ID_LENGTH);
}
export function projectScriptCwd(input) {
  return input.worktreePath ?? input.project.cwd;
}
export function projectScriptRuntimeEnv(input) {
  const env = {
    T3CODE_PROJECT_ROOT: input.project.cwd,
  };
  if (input.worktreePath) {
    env.T3CODE_WORKTREE_PATH = input.worktreePath;
  }
  if (input.extraEnv) {
    return { ...env, ...input.extraEnv };
  }
  return env;
}
export function primaryProjectScript(scripts) {
  const regular = scripts.find((script) => !script.runOnWorktreeCreate);
  return regular ?? scripts[0] ?? null;
}
export function setupProjectScript(scripts) {
  return scripts.find((script) => script.runOnWorktreeCreate) ?? null;
}
