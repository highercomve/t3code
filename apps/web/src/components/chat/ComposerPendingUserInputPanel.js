import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback, useEffect, useRef } from "react";
import { derivePendingUserInputProgress } from "../../pendingUserInput";
import { CheckIcon } from "lucide-react";
import { cn } from "~/lib/utils";
export const ComposerPendingUserInputPanel = memo(function ComposerPendingUserInputPanel({
  pendingUserInputs,
  respondingRequestIds,
  answers,
  questionIndex,
  onSelectOption,
  onAdvance,
}) {
  if (pendingUserInputs.length === 0) return null;
  const activePrompt = pendingUserInputs[0];
  if (!activePrompt) return null;
  return _jsx(
    ComposerPendingUserInputCard,
    {
      prompt: activePrompt,
      isResponding: respondingRequestIds.includes(activePrompt.requestId),
      answers: answers,
      questionIndex: questionIndex,
      onSelectOption: onSelectOption,
      onAdvance: onAdvance,
    },
    activePrompt.requestId,
  );
});
const ComposerPendingUserInputCard = memo(function ComposerPendingUserInputCard({
  prompt,
  isResponding,
  answers,
  questionIndex,
  onSelectOption,
  onAdvance,
}) {
  const progress = derivePendingUserInputProgress(prompt.questions, answers, questionIndex);
  const activeQuestion = progress.activeQuestion;
  const autoAdvanceTimerRef = useRef(null);
  // Clear auto-advance timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current !== null) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);
  const selectOptionAndAutoAdvance = useCallback(
    (questionId, optionLabel) => {
      onSelectOption(questionId, optionLabel);
      if (autoAdvanceTimerRef.current !== null) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }
      autoAdvanceTimerRef.current = window.setTimeout(() => {
        autoAdvanceTimerRef.current = null;
        onAdvance();
      }, 200);
    },
    [onSelectOption, onAdvance],
  );
  // Keyboard shortcut: number keys 1-9 select corresponding option and auto-advance.
  // Works even when the Lexical composer (contenteditable) has focus — the composer
  // doubles as a custom-answer field during user input, and when it's empty the digit
  // keys should pick options instead of typing into the editor.
  useEffect(() => {
    if (!activeQuestion || isResponding) return;
    const handler = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        return;
      }
      // If the user has started typing a custom answer in the contenteditable
      // composer, let digit keys pass through so they can type numbers.
      if (target instanceof HTMLElement && target.isContentEditable) {
        const hasCustomText = progress.customAnswer.length > 0;
        if (hasCustomText) return;
      }
      const digit = Number.parseInt(event.key, 10);
      if (Number.isNaN(digit) || digit < 1 || digit > 9) return;
      const optionIndex = digit - 1;
      if (optionIndex >= activeQuestion.options.length) return;
      const option = activeQuestion.options[optionIndex];
      if (!option) return;
      event.preventDefault();
      selectOptionAndAutoAdvance(activeQuestion.id, option.label);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [activeQuestion, isResponding, selectOptionAndAutoAdvance, progress.customAnswer.length]);
  if (!activeQuestion) {
    return null;
  }
  return _jsxs("div", {
    className: "px-4 py-3 sm:px-5",
    children: [
      _jsx("div", {
        className: "flex items-center gap-3",
        children: _jsxs("div", {
          className: "flex items-center gap-2",
          children: [
            prompt.questions.length > 1
              ? _jsxs("span", {
                  className:
                    "flex h-5 items-center rounded-md bg-muted/60 px-1.5 text-[10px] font-medium tabular-nums text-muted-foreground/60",
                  children: [questionIndex + 1, "/", prompt.questions.length],
                })
              : null,
            _jsx("span", {
              className:
                "text-[11px] font-semibold tracking-widest text-muted-foreground/50 uppercase",
              children: activeQuestion.header,
            }),
          ],
        }),
      }),
      _jsx("p", {
        className: "mt-1.5 text-sm text-foreground/90",
        children: activeQuestion.question,
      }),
      _jsx("div", {
        className: "mt-3 space-y-1",
        children: activeQuestion.options.map((option, index) => {
          const isSelected = progress.selectedOptionLabel === option.label;
          const shortcutKey = index < 9 ? index + 1 : null;
          return _jsxs(
            "button",
            {
              type: "button",
              disabled: isResponding,
              onClick: () => selectOptionAndAutoAdvance(activeQuestion.id, option.label),
              className: cn(
                "group flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-all duration-150",
                isSelected
                  ? "border-blue-500/40 bg-blue-500/8 text-foreground"
                  : "border-transparent bg-muted/20 text-foreground/80 hover:bg-muted/40 hover:border-border/40",
                isResponding && "opacity-50 cursor-not-allowed",
              ),
              children: [
                shortcutKey !== null
                  ? _jsx("kbd", {
                      className: cn(
                        "flex size-5 shrink-0 items-center justify-center rounded text-[11px] font-medium tabular-nums transition-colors duration-150",
                        isSelected
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-muted/40 text-muted-foreground/50 group-hover:bg-muted/60 group-hover:text-muted-foreground/70",
                      ),
                      children: shortcutKey,
                    })
                  : null,
                _jsxs("div", {
                  className: "min-w-0 flex-1",
                  children: [
                    _jsx("span", { className: "text-sm font-medium", children: option.label }),
                    option.description && option.description !== option.label
                      ? _jsx("span", {
                          className: "ml-2 text-xs text-muted-foreground/50",
                          children: option.description,
                        })
                      : null,
                  ],
                }),
                isSelected
                  ? _jsx(CheckIcon, { className: "size-3.5 shrink-0 text-blue-400" })
                  : null,
              ],
            },
            `${activeQuestion.id}:${option.label}`,
          );
        }),
      }),
    ],
  });
});
