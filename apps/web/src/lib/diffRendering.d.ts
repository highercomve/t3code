export declare const DIFF_THEME_NAMES: {
  readonly light: "pierre-light";
  readonly dark: "pierre-dark";
};
export type DiffThemeName = (typeof DIFF_THEME_NAMES)[keyof typeof DIFF_THEME_NAMES];
export declare function resolveDiffThemeName(theme: "light" | "dark"): DiffThemeName;
export declare function fnv1a32(input: string, seed?: number, multiplier?: number): number;
export declare function buildPatchCacheKey(patch: string, scope?: string): string;
