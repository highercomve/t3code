import type { ComponentType } from "react";
export type SettingsSectionPath = "/settings/general" | "/settings/archived";
export declare const SETTINGS_NAV_ITEMS: ReadonlyArray<{
  label: string;
  to: SettingsSectionPath;
  icon: ComponentType<{
    className?: string;
  }>;
}>;
export declare function SettingsSidebarNav({
  pathname,
}: {
  pathname: string;
}): import("react/jsx-runtime").JSX.Element;
