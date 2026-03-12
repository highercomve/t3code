import { getCanRetryAfterDownloadFailure, nextStatusAfterDownloadFailure } from "./updateState";
export function createInitialDesktopUpdateState(currentVersion, runtimeInfo) {
  return {
    enabled: false,
    status: "disabled",
    currentVersion,
    hostArch: runtimeInfo.hostArch,
    appArch: runtimeInfo.appArch,
    runningUnderArm64Translation: runtimeInfo.runningUnderArm64Translation,
    availableVersion: null,
    downloadedVersion: null,
    downloadPercent: null,
    checkedAt: null,
    message: null,
    errorContext: null,
    canRetry: false,
  };
}
export function reduceDesktopUpdateStateOnCheckStart(state, checkedAt) {
  return {
    ...state,
    status: "checking",
    checkedAt,
    message: null,
    downloadPercent: null,
    errorContext: null,
    canRetry: false,
  };
}
export function reduceDesktopUpdateStateOnCheckFailure(state, message, checkedAt) {
  return {
    ...state,
    status: "error",
    message,
    checkedAt,
    downloadPercent: null,
    errorContext: "check",
    canRetry: true,
  };
}
export function reduceDesktopUpdateStateOnUpdateAvailable(state, version, checkedAt) {
  return {
    ...state,
    status: "available",
    availableVersion: version,
    downloadedVersion: null,
    downloadPercent: null,
    checkedAt,
    message: null,
    errorContext: null,
    canRetry: false,
  };
}
export function reduceDesktopUpdateStateOnNoUpdate(state, checkedAt) {
  return {
    ...state,
    status: "up-to-date",
    availableVersion: null,
    downloadedVersion: null,
    downloadPercent: null,
    checkedAt,
    message: null,
    errorContext: null,
    canRetry: false,
  };
}
export function reduceDesktopUpdateStateOnDownloadStart(state) {
  return {
    ...state,
    status: "downloading",
    downloadPercent: 0,
    message: null,
    errorContext: null,
    canRetry: false,
  };
}
export function reduceDesktopUpdateStateOnDownloadFailure(state, message) {
  return {
    ...state,
    status: nextStatusAfterDownloadFailure(state),
    message,
    downloadPercent: null,
    errorContext: "download",
    canRetry: getCanRetryAfterDownloadFailure(state),
  };
}
export function reduceDesktopUpdateStateOnDownloadProgress(state, percent) {
  return {
    ...state,
    status: "downloading",
    downloadPercent: percent,
    message: null,
    errorContext: null,
    canRetry: false,
  };
}
export function reduceDesktopUpdateStateOnDownloadComplete(state, version) {
  return {
    ...state,
    status: "downloaded",
    availableVersion: version,
    downloadedVersion: version,
    downloadPercent: 100,
    message: null,
    errorContext: null,
    canRetry: true,
  };
}
export function reduceDesktopUpdateStateOnInstallFailure(state, message) {
  return {
    ...state,
    status: "downloaded",
    message,
    errorContext: "install",
    canRetry: true,
  };
}
