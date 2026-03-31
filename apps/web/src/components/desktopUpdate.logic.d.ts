import type { DesktopUpdateActionResult, DesktopUpdateState } from "@t3tools/contracts";
export type DesktopUpdateButtonAction = "download" | "install" | "none";
export declare function resolveDesktopUpdateButtonAction(
  state: DesktopUpdateState,
): DesktopUpdateButtonAction;
export declare function shouldShowDesktopUpdateButton(state: DesktopUpdateState | null): boolean;
export declare function shouldShowArm64IntelBuildWarning(state: DesktopUpdateState | null): boolean;
export declare function isDesktopUpdateButtonDisabled(state: DesktopUpdateState | null): boolean;
export declare function getArm64IntelBuildWarningDescription(state: DesktopUpdateState): string;
export declare function getDesktopUpdateButtonTooltip(state: DesktopUpdateState): string;
export declare function getDesktopUpdateInstallConfirmationMessage(
  state: Pick<DesktopUpdateState, "availableVersion" | "downloadedVersion">,
): string;
export declare function getDesktopUpdateActionError(
  result: DesktopUpdateActionResult,
): string | null;
export declare function shouldToastDesktopUpdateActionResult(
  result: DesktopUpdateActionResult,
): boolean;
export declare function shouldHighlightDesktopUpdateError(
  state: DesktopUpdateState | null,
): boolean;
export declare function canCheckForUpdate(state: DesktopUpdateState | null): boolean;
