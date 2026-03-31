import { isMacPlatform } from "./lib/utils";
const URL_PATTERN = /https?:\/\/[^\s"'`<>]+/g;
const FILE_PATH_PATTERN =
  /(?:~\/|\.{1,2}\/|\/|[A-Za-z]:[\\/]|\\\\)[^\s"'`<>]+|[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)+(?::\d+){0,2}/g;
const TRAILING_PUNCTUATION_PATTERN = /[.,;!?]+$/;
function trimClosingDelimiters(value) {
  let output = value.replace(TRAILING_PUNCTUATION_PATTERN, "");
  if (output.length === 0) return output;
  const trimUnbalanced = (open, close) => {
    while (output.endsWith(close)) {
      const opens = output.split(open).length - 1;
      const closes = output.split(close).length - 1;
      if (opens >= closes) return;
      output = output.slice(0, -1);
    }
  };
  trimUnbalanced("(", ")");
  trimUnbalanced("[", "]");
  trimUnbalanced("{", "}");
  return output;
}
function overlaps(a, b) {
  return a.start < b.end && b.start < a.end;
}
function collectMatches(line, kind, pattern, existing) {
  const matches = [];
  pattern.lastIndex = 0;
  for (const rawMatch of line.matchAll(pattern)) {
    const raw = rawMatch[0];
    const start = rawMatch.index ?? -1;
    if (start < 0 || raw.length === 0) continue;
    const trimmed = trimClosingDelimiters(raw);
    if (trimmed.length === 0) continue;
    if (kind === "path" && /^https?:\/\//i.test(trimmed)) continue;
    const candidate = {
      kind,
      text: trimmed,
      start,
      end: start + trimmed.length,
    };
    const collides = [...existing, ...matches].some((other) => overlaps(candidate, other));
    if (collides) continue;
    matches.push(candidate);
  }
  return matches;
}
function isWindowsAbsolutePath(value) {
  return /^[A-Za-z]:[\\/]/.test(value) || value.startsWith("\\\\");
}
function isAbsolutePath(value) {
  return value.startsWith("/") || isWindowsAbsolutePath(value);
}
function isWindowsPathStyle(value) {
  return isWindowsAbsolutePath(value) || /[A-Za-z]:\\/.test(value);
}
function joinPath(base, next, separator) {
  const cleanBase = base.replace(/[\\/]+$/, "");
  if (separator === "\\") {
    return `${cleanBase}\\${next.replaceAll("/", "\\")}`;
  }
  return `${cleanBase}/${next.replace(/^\/+/, "")}`;
}
function inferHomeFromCwd(cwd) {
  const posixUser = cwd.match(/^\/Users\/([^/]+)/);
  if (posixUser?.[1]) {
    return `/Users/${posixUser[1]}`;
  }
  const posixHome = cwd.match(/^\/home\/([^/]+)/);
  if (posixHome?.[1]) {
    return `/home/${posixHome[1]}`;
  }
  const windowsUser = cwd.match(/^([A-Za-z]:\\Users\\[^\\]+)/);
  if (windowsUser?.[1]) {
    return windowsUser[1];
  }
  return undefined;
}
function splitPathAndPosition(value) {
  let path = value;
  let column;
  let line;
  const columnMatch = path.match(/:(\d+)$/);
  if (!columnMatch?.[1]) {
    return { path, line: undefined, column: undefined };
  }
  column = columnMatch[1];
  path = path.slice(0, -columnMatch[0].length);
  const lineMatch = path.match(/:(\d+)$/);
  if (lineMatch?.[1]) {
    line = lineMatch[1];
    path = path.slice(0, -lineMatch[0].length);
  } else {
    line = column;
    column = undefined;
  }
  return { path, line, column };
}
export function extractTerminalLinks(line) {
  const urlMatches = collectMatches(line, "url", URL_PATTERN, []);
  const pathMatches = collectMatches(line, "path", FILE_PATH_PATTERN, urlMatches);
  return [...urlMatches, ...pathMatches].toSorted((a, b) => a.start - b.start);
}
export function isTerminalLinkActivation(
  event,
  platform = typeof navigator === "undefined" ? "" : navigator.platform,
) {
  if (platform.length === 0) return false;
  return isMacPlatform(platform)
    ? event.metaKey && !event.ctrlKey
    : event.ctrlKey && !event.metaKey;
}
export function resolvePathLinkTarget(rawPath, cwd) {
  const { path, line, column } = splitPathAndPosition(rawPath);
  let resolvedPath = path;
  if (path.startsWith("~/")) {
    const home = inferHomeFromCwd(cwd);
    if (home) {
      const separator = isWindowsPathStyle(home) ? "\\" : "/";
      resolvedPath = joinPath(home, path.slice(2), separator);
    }
  } else if (!isAbsolutePath(path)) {
    const separator = isWindowsPathStyle(cwd) ? "\\" : "/";
    resolvedPath = joinPath(cwd, path, separator);
  }
  if (!line) return resolvedPath;
  return `${resolvedPath}:${line}${column ? `:${column}` : ""}`;
}
