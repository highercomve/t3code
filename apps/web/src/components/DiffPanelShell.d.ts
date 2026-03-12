import type { ReactNode } from "react";
export type DiffPanelMode = "inline" | "sheet" | "sidebar";
export declare function DiffPanelShell(props: {
  mode: DiffPanelMode;
  header: ReactNode;
  children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function DiffPanelHeaderSkeleton(): import("react/jsx-runtime").JSX.Element;
export declare function DiffPanelLoadingState(props: {
  label: string;
}): import("react/jsx-runtime").JSX.Element;
