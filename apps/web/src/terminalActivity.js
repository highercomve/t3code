export function terminalRunningSubprocessFromEvent(event) {
  switch (event.type) {
    case "activity":
      return event.hasRunningSubprocess;
    case "started":
    case "restarted":
    case "exited":
      return false;
    default:
      return null;
  }
}
