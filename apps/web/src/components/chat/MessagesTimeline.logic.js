export function computeMessageDurationStart(messages) {
  const result = new Map();
  let lastBoundary = null;
  for (const message of messages) {
    if (message.role === "user") {
      lastBoundary = message.createdAt;
    }
    result.set(message.id, lastBoundary ?? message.createdAt);
    if (message.role === "assistant" && message.completedAt) {
      lastBoundary = message.completedAt;
    }
  }
  return result;
}
export function normalizeCompactToolLabel(value) {
  return value.replace(/\s+(?:complete|completed)\s*$/i, "").trim();
}
