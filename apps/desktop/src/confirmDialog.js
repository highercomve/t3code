import { dialog } from "electron";
const CONFIRM_BUTTON_INDEX = 1;
export async function showDesktopConfirmDialog(message, ownerWindow) {
  const normalizedMessage = message.trim();
  if (normalizedMessage.length === 0) {
    return false;
  }
  const options = {
    type: "question",
    buttons: ["No", "Yes"],
    defaultId: 0,
    cancelId: 0,
    noLink: true,
    message: normalizedMessage,
  };
  const result = ownerWindow
    ? await dialog.showMessageBox(ownerWindow, options)
    : await dialog.showMessageBox(options);
  return result.response === CONFIRM_BUTTON_INDEX;
}
