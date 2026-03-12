declare const BREAKPOINTS: {
  readonly "2xl": 1536;
  readonly "3xl": 1600;
  readonly "4xl": 2000;
  readonly lg: 1024;
  readonly md: 768;
  readonly sm: 640;
  readonly xl: 1280;
};
type Breakpoint = keyof typeof BREAKPOINTS;
type BreakpointQuery = Breakpoint | `max-${Breakpoint}` | `${Breakpoint}:max-${Breakpoint}`;
export type MediaQueryInput = {
  min?: Breakpoint | number;
  max?: Breakpoint | number;
  /** Touch-like input (finger). Use "fine" for mouse/trackpad. */
  pointer?: "coarse" | "fine";
};
export declare function useMediaQuery(
  query: BreakpointQuery | MediaQueryInput | (string & {}),
): boolean;
export declare function useIsMobile(): boolean;
export {};
