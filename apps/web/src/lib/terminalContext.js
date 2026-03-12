export const INLINE_TERMINAL_CONTEXT_PLACEHOLDER = "\uFFFC";
const TRAILING_TERMINAL_CONTEXT_BLOCK_PATTERN =
  /\n*<terminal_context>\n([\s\S]*?)\n<\/terminal_context>\s*$/;
export function normalizeTerminalContextText(text) {
  return text.replace(/\r\n/g, "\n").replace(/^\n+|\n+$/g, "");
}
export function hasTerminalContextText(context) {
  return normalizeTerminalContextText(context.text).length > 0;
}
export function isTerminalContextExpired(context) {
  return !hasTerminalContextText(context);
}
export function filterTerminalContextsWithText(contexts) {
  return contexts.filter((context) => hasTerminalContextText(context));
}
function previewTerminalContextText(text) {
  const normalized = normalizeTerminalContextText(text);
  if (normalized.length === 0) {
    return "";
  }
  const lines = normalized.split("\n");
  const visibleLines = lines.slice(0, 3);
  if (lines.length > 3) {
    visibleLines.push("...");
  }
  const preview = visibleLines.join("\n");
  return preview.length > 180 ? `${preview.slice(0, 177)}...` : preview;
}
export function normalizeTerminalContextSelection(selection) {
  const text = normalizeTerminalContextText(selection.text);
  const terminalId = selection.terminalId.trim();
  const terminalLabel = selection.terminalLabel.trim();
  if (text.length === 0 || terminalId.length === 0 || terminalLabel.length === 0) {
    return null;
  }
  const lineStart = Math.max(1, Math.floor(selection.lineStart));
  const lineEnd = Math.max(lineStart, Math.floor(selection.lineEnd));
  return {
    terminalId,
    terminalLabel,
    lineStart,
    lineEnd,
    text,
  };
}
export function formatTerminalContextRange(selection) {
  return selection.lineStart === selection.lineEnd
    ? `line ${selection.lineStart}`
    : `lines ${selection.lineStart}-${selection.lineEnd}`;
}
export function formatTerminalContextLabel(selection) {
  return `${selection.terminalLabel} ${formatTerminalContextRange(selection)}`;
}
export function formatInlineTerminalContextLabel(selection) {
  const terminalLabel = selection.terminalLabel.trim().toLowerCase().replace(/\s+/g, "-");
  const range =
    selection.lineStart === selection.lineEnd
      ? `${selection.lineStart}`
      : `${selection.lineStart}-${selection.lineEnd}`;
  return `@${terminalLabel}:${range}`;
}
export function buildTerminalContextPreviewTitle(contexts) {
  if (contexts.length === 0) {
    return null;
  }
  const previews = contexts
    .map((context) => {
      const normalized = normalizeTerminalContextSelection(context);
      if (!normalized) {
        return null;
      }
      const preview = previewTerminalContextText(normalized.text);
      return preview.length > 0
        ? `${formatTerminalContextLabel(normalized)}\n${preview}`
        : formatTerminalContextLabel(normalized);
    })
    .filter((value) => value !== null)
    .join("\n\n");
  return previews.length > 0 ? previews : null;
}
function buildTerminalContextBodyLines(selection) {
  return normalizeTerminalContextText(selection.text)
    .split("\n")
    .map((line, index) => `  ${selection.lineStart + index} | ${line}`);
}
export function buildTerminalContextBlock(contexts) {
  const normalizedContexts = contexts
    .map((context) => normalizeTerminalContextSelection(context))
    .filter((context) => context !== null);
  if (normalizedContexts.length === 0) {
    return "";
  }
  const lines = [];
  for (let index = 0; index < normalizedContexts.length; index += 1) {
    const context = normalizedContexts[index];
    lines.push(`- ${formatTerminalContextLabel(context)}:`);
    lines.push(...buildTerminalContextBodyLines(context));
    if (index < normalizedContexts.length - 1) {
      lines.push("");
    }
  }
  return ["<terminal_context>", ...lines, "</terminal_context>"].join("\n");
}
export function materializeInlineTerminalContextPrompt(prompt, contexts) {
  let nextContextIndex = 0;
  let result = "";
  for (const char of prompt) {
    if (char !== INLINE_TERMINAL_CONTEXT_PLACEHOLDER) {
      result += char;
      continue;
    }
    const context = contexts[nextContextIndex] ?? null;
    nextContextIndex += 1;
    if (!context) {
      continue;
    }
    result += formatInlineTerminalContextLabel(context);
  }
  return result;
}
export function appendTerminalContextsToPrompt(prompt, contexts) {
  const trimmedPrompt = materializeInlineTerminalContextPrompt(prompt, contexts).trim();
  const contextBlock = buildTerminalContextBlock(contexts);
  if (contextBlock.length === 0) {
    return trimmedPrompt;
  }
  return trimmedPrompt.length > 0 ? `${trimmedPrompt}\n\n${contextBlock}` : contextBlock;
}
export function extractTrailingTerminalContexts(prompt) {
  const match = TRAILING_TERMINAL_CONTEXT_BLOCK_PATTERN.exec(prompt);
  if (!match) {
    return {
      promptText: prompt,
      contextCount: 0,
      previewTitle: null,
      contexts: [],
    };
  }
  const promptText = prompt.slice(0, match.index).replace(/\n+$/, "");
  const parsedContexts = parseTerminalContextEntries(match[1] ?? "");
  return {
    promptText,
    contextCount: parsedContexts.length,
    previewTitle:
      parsedContexts.length > 0
        ? parsedContexts
            .map(({ header, body }) => (body.length > 0 ? `${header}\n${body}` : header))
            .join("\n\n")
        : null,
    contexts: parsedContexts,
  };
}
export function deriveDisplayedUserMessageState(prompt) {
  const extractedContexts = extractTrailingTerminalContexts(prompt);
  return {
    visibleText: extractedContexts.promptText,
    copyText: prompt,
    contextCount: extractedContexts.contextCount,
    previewTitle: extractedContexts.previewTitle,
    contexts: extractedContexts.contexts,
  };
}
function parseTerminalContextEntries(block) {
  const entries = [];
  let current = null;
  const commitCurrent = () => {
    if (!current) {
      return;
    }
    entries.push({
      header: current.header,
      body: current.bodyLines.join("\n").trimEnd(),
    });
    current = null;
  };
  for (const rawLine of block.split("\n")) {
    const headerMatch = /^- (.+):$/.exec(rawLine);
    if (headerMatch) {
      commitCurrent();
      current = {
        header: headerMatch[1],
        bodyLines: [],
      };
      continue;
    }
    if (!current) {
      continue;
    }
    if (rawLine.startsWith("  ")) {
      current.bodyLines.push(rawLine.slice(2));
      continue;
    }
    if (rawLine.length === 0) {
      current.bodyLines.push("");
    }
  }
  commitCurrent();
  return entries;
}
export function countInlineTerminalContextPlaceholders(prompt) {
  let count = 0;
  for (const char of prompt) {
    if (char === INLINE_TERMINAL_CONTEXT_PLACEHOLDER) {
      count += 1;
    }
  }
  return count;
}
export function ensureInlineTerminalContextPlaceholders(prompt, terminalContextCount) {
  const missingCount = terminalContextCount - countInlineTerminalContextPlaceholders(prompt);
  if (missingCount <= 0) {
    return prompt;
  }
  return `${INLINE_TERMINAL_CONTEXT_PLACEHOLDER.repeat(missingCount)}${prompt}`;
}
function isInlineTerminalContextBoundaryWhitespace(char) {
  return char === undefined || char === " " || char === "\n" || char === "\t" || char === "\r";
}
export function insertInlineTerminalContextPlaceholder(prompt, cursorInput) {
  const cursor = Math.max(0, Math.min(prompt.length, Math.floor(cursorInput)));
  const needsLeadingSpace = !isInlineTerminalContextBoundaryWhitespace(prompt[cursor - 1]);
  const replacement = `${needsLeadingSpace ? " " : ""}${INLINE_TERMINAL_CONTEXT_PLACEHOLDER} `;
  const rangeEnd = prompt[cursor] === " " ? cursor + 1 : cursor;
  return {
    prompt: `${prompt.slice(0, cursor)}${replacement}${prompt.slice(rangeEnd)}`,
    cursor: cursor + replacement.length,
    contextIndex: countInlineTerminalContextPlaceholders(prompt.slice(0, cursor)),
  };
}
export function stripInlineTerminalContextPlaceholders(prompt) {
  return prompt.replaceAll(INLINE_TERMINAL_CONTEXT_PLACEHOLDER, "");
}
export function removeInlineTerminalContextPlaceholder(prompt, contextIndex) {
  if (contextIndex < 0) {
    return { prompt, cursor: prompt.length };
  }
  let placeholderIndex = 0;
  for (let index = 0; index < prompt.length; index += 1) {
    if (prompt[index] !== INLINE_TERMINAL_CONTEXT_PLACEHOLDER) {
      continue;
    }
    if (placeholderIndex === contextIndex) {
      return {
        prompt: prompt.slice(0, index) + prompt.slice(index + 1),
        cursor: index,
      };
    }
    placeholderIndex += 1;
  }
  return { prompt, cursor: prompt.length };
}
