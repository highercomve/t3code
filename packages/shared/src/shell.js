import { execFileSync } from "node:child_process";
const PATH_CAPTURE_START = "__T3CODE_PATH_START__";
const PATH_CAPTURE_END = "__T3CODE_PATH_END__";
const SHELL_ENV_NAME_PATTERN = /^[A-Z0-9_]+$/;
export function resolveLoginShell(platform, shell) {
  const trimmedShell = shell?.trim();
  if (trimmedShell) {
    return trimmedShell;
  }
  if (platform === "darwin") {
    return "/bin/zsh";
  }
  if (platform === "linux") {
    return "/bin/bash";
  }
  return undefined;
}
export function extractPathFromShellOutput(output) {
  const startIndex = output.indexOf(PATH_CAPTURE_START);
  if (startIndex === -1) return null;
  const valueStartIndex = startIndex + PATH_CAPTURE_START.length;
  const endIndex = output.indexOf(PATH_CAPTURE_END, valueStartIndex);
  if (endIndex === -1) return null;
  const pathValue = output.slice(valueStartIndex, endIndex).trim();
  return pathValue.length > 0 ? pathValue : null;
}
export function readPathFromLoginShell(shell, execFile = execFileSync) {
  return readEnvironmentFromLoginShell(shell, ["PATH"], execFile).PATH;
}
function envCaptureStart(name) {
  return `__T3CODE_ENV_${name}_START__`;
}
function envCaptureEnd(name) {
  return `__T3CODE_ENV_${name}_END__`;
}
function buildEnvironmentCaptureCommand(names) {
  return names
    .map((name) => {
      if (!SHELL_ENV_NAME_PATTERN.test(name)) {
        throw new Error(`Unsupported environment variable name: ${name}`);
      }
      return [
        `printf '%s\\n' '${envCaptureStart(name)}'`,
        `printenv ${name} || true`,
        `printf '%s\\n' '${envCaptureEnd(name)}'`,
      ].join("; ");
    })
    .join("; ");
}
function extractEnvironmentValue(output, name) {
  const startMarker = envCaptureStart(name);
  const endMarker = envCaptureEnd(name);
  const startIndex = output.indexOf(startMarker);
  if (startIndex === -1) return undefined;
  const valueStartIndex = startIndex + startMarker.length;
  const endIndex = output.indexOf(endMarker, valueStartIndex);
  if (endIndex === -1) return undefined;
  let value = output.slice(valueStartIndex, endIndex);
  if (value.startsWith("\n")) {
    value = value.slice(1);
  }
  if (value.endsWith("\n")) {
    value = value.slice(0, -1);
  }
  return value.length > 0 ? value : undefined;
}
export const readEnvironmentFromLoginShell = (shell, names, execFile = execFileSync) => {
  if (names.length === 0) {
    return {};
  }
  // On bash, `-ilc` reads ~/.bash_profile but NOT ~/.bashrc. Many tools
  // (nvm, pyenv, etc.) set up PATH in ~/.bashrc, so we explicitly source it.
  // On zsh, `-ilc` already reads both .zprofile and .zshrc — no extra step needed.
  const isBash = shell.endsWith("/bash") || shell === "bash";
  const rcPrefix = isBash ? '[ -f "$HOME/.bashrc" ] && . "$HOME/.bashrc" 2>/dev/null; ' : "";
  const output = execFile(shell, ["-ilc", rcPrefix + buildEnvironmentCaptureCommand(names)], {
    encoding: "utf8",
    timeout: 5000,
  });
  const environment = {};
  for (const name of names) {
    const value = extractEnvironmentValue(output, name);
    if (value !== undefined) {
      environment[name] = value;
    }
  }
  return environment;
};
