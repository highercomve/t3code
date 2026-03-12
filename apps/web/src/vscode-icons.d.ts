export declare function basenameOfPath(pathValue: string): string;
export declare function inferEntryKindFromPath(pathValue: string): "file" | "directory";
export declare function getVscodeIconUrlForEntry(
  pathValue: string,
  kind: "file" | "directory",
  theme: "light" | "dark",
): string;
