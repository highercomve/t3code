import { INLINE_TERMINAL_CONTEXT_PLACEHOLDER } from "./lib/terminalContext";
const MENTION_TOKEN_REGEX = /(^|\s)@([^\s@]+)(?=\s)/g;
const SKILL_TOKEN_REGEX = /(^|\s)\$([a-zA-Z][a-zA-Z0-9:_-]*)(?=\s)/g;
function rangeIncludesIndex(start, end, index) {
  return start <= index && index < end;
}
function pushTextSegment(segments, text) {
  if (!text) return;
  const last = segments[segments.length - 1];
  if (last && last.type === "text") {
    last.text += text;
    return;
  }
  segments.push({ type: "text", text });
}
function collectInlineTokenMatches(text) {
  const matches = [];
  for (const match of text.matchAll(MENTION_TOKEN_REGEX)) {
    const fullMatch = match[0];
    const prefix = match[1] ?? "";
    const path = match[2] ?? "";
    const matchIndex = match.index ?? 0;
    const start = matchIndex + prefix.length;
    const end = start + fullMatch.length - prefix.length;
    if (path.length > 0) {
      matches.push({ type: "mention", value: path, start, end });
    }
  }
  for (const match of text.matchAll(SKILL_TOKEN_REGEX)) {
    const fullMatch = match[0];
    const prefix = match[1] ?? "";
    const skillName = match[2] ?? "";
    const matchIndex = match.index ?? 0;
    const start = matchIndex + prefix.length;
    const end = start + fullMatch.length - prefix.length;
    if (skillName.length > 0) {
      matches.push({ type: "skill", value: skillName, start, end });
    }
  }
  return matches.toSorted((left, right) => left.start - right.start);
}
function forEachPromptSegmentSlice(prompt, visitor) {
  let textCursor = 0;
  for (let index = 0; index < prompt.length; index += 1) {
    if (prompt[index] !== INLINE_TERMINAL_CONTEXT_PLACEHOLDER) {
      continue;
    }
    if (
      index > textCursor &&
      visitor({
        type: "text",
        text: prompt.slice(textCursor, index),
        promptOffset: textCursor,
      }) === true
    ) {
      return true;
    }
    if (visitor({ type: "terminal-context", promptOffset: index }) === true) {
      return true;
    }
    textCursor = index + 1;
  }
  if (
    textCursor < prompt.length &&
    visitor({
      type: "text",
      text: prompt.slice(textCursor),
      promptOffset: textCursor,
    }) === true
  ) {
    return true;
  }
  return false;
}
function forEachPromptTextSlice(prompt, visitor) {
  return forEachPromptSegmentSlice(prompt, (slice) => {
    if (slice.type !== "text") {
      return false;
    }
    return visitor(slice.text, slice.promptOffset);
  });
}
function forEachMentionMatch(prompt, visitor) {
  return forEachPromptTextSlice(prompt, (text, promptOffset) => {
    for (const match of text.matchAll(MENTION_TOKEN_REGEX)) {
      if (visitor(match, promptOffset) === true) {
        return true;
      }
    }
    return false;
  });
}
function splitPromptTextIntoComposerSegments(text) {
  const segments = [];
  if (!text) {
    return segments;
  }
  const tokenMatches = collectInlineTokenMatches(text);
  let cursor = 0;
  for (const match of tokenMatches) {
    if (match.start < cursor) {
      continue;
    }
    if (match.start > cursor) {
      pushTextSegment(segments, text.slice(cursor, match.start));
    }
    if (match.type === "mention") {
      segments.push({ type: "mention", path: match.value });
    } else {
      segments.push({ type: "skill", name: match.value });
    }
    cursor = match.end;
  }
  if (cursor < text.length) {
    pushTextSegment(segments, text.slice(cursor));
  }
  return segments;
}
export function selectionTouchesMentionBoundary(prompt, start, end) {
  if (!prompt || start >= end) {
    return false;
  }
  return forEachMentionMatch(prompt, (match, promptOffset) => {
    const fullMatch = match[0];
    const prefix = match[1] ?? "";
    const matchIndex = match.index ?? 0;
    const mentionStart = promptOffset + matchIndex + prefix.length;
    const mentionEnd = mentionStart + fullMatch.length - prefix.length;
    const beforeMentionIndex = mentionStart - 1;
    const afterMentionIndex = mentionEnd;
    if (
      beforeMentionIndex >= 0 &&
      /\s/.test(prompt[beforeMentionIndex] ?? "") &&
      rangeIncludesIndex(start, end, beforeMentionIndex)
    ) {
      return true;
    }
    if (
      afterMentionIndex < prompt.length &&
      /\s/.test(prompt[afterMentionIndex] ?? "") &&
      rangeIncludesIndex(start, end, afterMentionIndex)
    ) {
      return true;
    }
    return false;
  });
}
export function splitPromptIntoComposerSegments(prompt, terminalContexts = []) {
  if (!prompt) {
    return [];
  }
  const segments = [];
  let terminalContextIndex = 0;
  forEachPromptSegmentSlice(prompt, (slice) => {
    if (slice.type === "text") {
      segments.push(...splitPromptTextIntoComposerSegments(slice.text));
      return false;
    }
    segments.push({
      type: "terminal-context",
      context: terminalContexts[terminalContextIndex] ?? null,
    });
    terminalContextIndex += 1;
    return false;
  });
  return segments;
}
