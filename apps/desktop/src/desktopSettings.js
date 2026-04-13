import * as FS from "node:fs";
import * as Path from "node:path";
export const DEFAULT_DESKTOP_SETTINGS = {
  serverExposureMode: "local-only",
};
export function setDesktopServerExposurePreference(settings, requestedMode) {
  return settings.serverExposureMode === requestedMode
    ? settings
    : {
        ...settings,
        serverExposureMode: requestedMode,
      };
}
export function readDesktopSettings(settingsPath) {
  try {
    if (!FS.existsSync(settingsPath)) {
      return DEFAULT_DESKTOP_SETTINGS;
    }
    const raw = FS.readFileSync(settingsPath, "utf8");
    const parsed = JSON.parse(raw);
    return {
      serverExposureMode:
        parsed.serverExposureMode === "network-accessible" ? "network-accessible" : "local-only",
    };
  } catch {
    return DEFAULT_DESKTOP_SETTINGS;
  }
}
export function writeDesktopSettings(settingsPath, settings) {
  const directory = Path.dirname(settingsPath);
  const tempPath = `${settingsPath}.${process.pid}.${Date.now()}.tmp`;
  FS.mkdirSync(directory, { recursive: true });
  FS.writeFileSync(tempPath, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
  FS.renameSync(tempPath, settingsPath);
}
