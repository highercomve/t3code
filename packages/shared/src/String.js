export function truncate(text, maxLength = 50) {
    const trimmed = text.trim();
    if (trimmed.length <= maxLength) {
        return trimmed;
    }
    return `${trimmed.slice(0, maxLength)}...`;
}
