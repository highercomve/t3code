import type { DesktopServerExposureMode } from "@t3tools/contracts";
export interface DesktopSettings {
  readonly serverExposureMode: DesktopServerExposureMode;
}
export declare const DEFAULT_DESKTOP_SETTINGS: DesktopSettings;
export declare function setDesktopServerExposurePreference(
  settings: DesktopSettings,
  requestedMode: DesktopServerExposureMode,
): DesktopSettings;
export declare function readDesktopSettings(settingsPath: string): DesktopSettings;
export declare function writeDesktopSettings(settingsPath: string, settings: DesktopSettings): void;
