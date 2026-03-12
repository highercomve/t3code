import type { DesktopRuntimeInfo, DesktopUpdateState } from "@t3tools/contracts";
export declare function createInitialDesktopUpdateState(
  currentVersion: string,
  runtimeInfo: DesktopRuntimeInfo,
): DesktopUpdateState;
export declare function reduceDesktopUpdateStateOnCheckStart(
  state: DesktopUpdateState,
  checkedAt: string,
): DesktopUpdateState;
export declare function reduceDesktopUpdateStateOnCheckFailure(
  state: DesktopUpdateState,
  message: string,
  checkedAt: string,
): DesktopUpdateState;
export declare function reduceDesktopUpdateStateOnUpdateAvailable(
  state: DesktopUpdateState,
  version: string,
  checkedAt: string,
): DesktopUpdateState;
export declare function reduceDesktopUpdateStateOnNoUpdate(
  state: DesktopUpdateState,
  checkedAt: string,
): DesktopUpdateState;
export declare function reduceDesktopUpdateStateOnDownloadStart(
  state: DesktopUpdateState,
): DesktopUpdateState;
export declare function reduceDesktopUpdateStateOnDownloadFailure(
  state: DesktopUpdateState,
  message: string,
): DesktopUpdateState;
export declare function reduceDesktopUpdateStateOnDownloadProgress(
  state: DesktopUpdateState,
  percent: number,
): DesktopUpdateState;
export declare function reduceDesktopUpdateStateOnDownloadComplete(
  state: DesktopUpdateState,
  version: string,
): DesktopUpdateState;
export declare function reduceDesktopUpdateStateOnInstallFailure(
  state: DesktopUpdateState,
  message: string,
): DesktopUpdateState;
