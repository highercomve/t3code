type Theme = "light" | "dark" | "system";
export declare function useTheme(): {
  readonly theme: Theme;
  readonly setTheme: (next: Theme) => void;
  readonly resolvedTheme: "light" | "dark";
};
export {};
