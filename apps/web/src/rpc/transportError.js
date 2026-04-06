const TRANSPORT_ERROR_PATTERNS = [
  /\bSocketCloseError\b/i,
  /\bSocketOpenError\b/i,
  /Unable to connect to the T3 server WebSocket\./i,
  /\bping timeout\b/i,
];
export function isTransportConnectionErrorMessage(message) {
  if (typeof message !== "string") {
    return false;
  }
  const normalizedMessage = message.trim();
  if (normalizedMessage.length === 0) {
    return false;
  }
  return TRANSPORT_ERROR_PATTERNS.some((pattern) => pattern.test(normalizedMessage));
}
export function sanitizeThreadErrorMessage(message) {
  return isTransportConnectionErrorMessage(message) ? null : (message ?? null);
}
