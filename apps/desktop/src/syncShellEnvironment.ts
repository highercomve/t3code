import {
  readEnvironmentFromLoginShell,
  resolveLoginShell,
  ShellEnvironmentReader,
} from "@t3tools/shared/shell";

/**
 * Environment variables to sync from the user's login shell.
 *
 * When the desktop app is launched from a file manager or .desktop shortcut
 * (rather than a terminal), the process environment does not include variables
 * set in the user's shell profile (.bashrc, .zshrc, .profile, etc.).
 *
 * We sync PATH (so provider binaries are found), SSH_AUTH_SOCK (for git),
 * and provider API keys that the spawned CLI processes may need for
 * authentication.
 */
const SYNC_ENV_NAMES = [
  "PATH",
  "SSH_AUTH_SOCK",
  // Provider API keys used by spawned CLI processes (codex, opencode, etc.)
  "OPENCODE_API_KEY",
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "GEMINI_API_KEY",
  "GOOGLE_API_KEY",
] as const;

export function syncShellEnvironment(
  env: NodeJS.ProcessEnv = process.env,
  options: {
    platform?: NodeJS.Platform;
    readEnvironment?: ShellEnvironmentReader;
  } = {},
): void {
  const platform = options.platform ?? process.platform;
  if (platform !== "darwin" && platform !== "linux") return;

  try {
    const shell = resolveLoginShell(platform, env.SHELL);
    if (!shell) return;

    const shellEnvironment = (options.readEnvironment ?? readEnvironmentFromLoginShell)(
      shell,
      SYNC_ENV_NAMES as unknown as string[],
    );

    if (shellEnvironment.PATH) {
      env.PATH = shellEnvironment.PATH;
    }

    if (!env.SSH_AUTH_SOCK && shellEnvironment.SSH_AUTH_SOCK) {
      env.SSH_AUTH_SOCK = shellEnvironment.SSH_AUTH_SOCK;
    }

    // Sync provider API keys — only set if the shell provides them and
    // the current environment does not already have them.
    for (const name of SYNC_ENV_NAMES) {
      if (name === "PATH" || name === "SSH_AUTH_SOCK") continue;
      if (!env[name] && shellEnvironment[name]) {
        env[name] = shellEnvironment[name];
      }
    }
  } catch {
    // Keep inherited environment if shell lookup fails.
  }
}
