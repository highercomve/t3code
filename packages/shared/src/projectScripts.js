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
export function setupProjectScript(scripts) {
    return scripts.find((script) => script.runOnWorktreeCreate) ?? null;
}
