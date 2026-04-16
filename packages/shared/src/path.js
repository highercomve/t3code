export function isWindowsDrivePath(value) {
    return /^[a-zA-Z]:([/\\]|$)/.test(value);
}
export function isUncPath(value) {
    return value.startsWith("\\\\");
}
export function isWindowsAbsolutePath(value) {
    return isUncPath(value) || isWindowsDrivePath(value);
}
export function isExplicitRelativePath(value) {
    return (value === "." ||
        value === ".." ||
        value.startsWith("./") ||
        value.startsWith("../") ||
        value.startsWith(".\\") ||
        value.startsWith("..\\"));
}
