function normalizeDesktopArch(arch) {
  if (arch === "arm64") return "arm64";
  if (arch === "x64") return "x64";
  return "other";
}
export function resolveDesktopRuntimeInfo(input) {
  const appArch = normalizeDesktopArch(input.processArch);
  if (input.platform !== "darwin") {
    return {
      hostArch: appArch,
      appArch,
      runningUnderArm64Translation: false,
    };
  }
  const hostArch = appArch === "arm64" || input.runningUnderArm64Translation ? "arm64" : appArch;
  return {
    hostArch,
    appArch,
    runningUnderArm64Translation: input.runningUnderArm64Translation,
  };
}
export function isArm64HostRunningIntelBuild(runtimeInfo) {
  return runtimeInfo.hostArch === "arm64" && runtimeInfo.appArch === "x64";
}
