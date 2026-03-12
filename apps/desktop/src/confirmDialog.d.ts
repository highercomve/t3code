import { type BrowserWindow } from "electron";
export declare function showDesktopConfirmDialog(
  message: string,
  ownerWindow: BrowserWindow | null,
): Promise<boolean>;
