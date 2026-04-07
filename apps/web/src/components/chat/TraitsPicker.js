import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { applyClaudePromptEffortPrefix, isClaudeUltrathinkPrompt, trimOrNull, getDefaultEffort, getDefaultContextWindow, hasContextWindowOption, resolveEffort, } from "@t3tools/shared/model";
import { memo, useCallback, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Menu, MenuGroup, MenuPopup, MenuRadioGroup, MenuRadioItem, MenuSeparator as MenuDivider, MenuTrigger, } from "../ui/menu";
import { useComposerDraftStore } from "../../composerDraftStore";
import { getProviderModelCapabilities } from "../../providerModels";
import { cn } from "~/lib/utils";
const ULTRATHINK_PROMPT_PREFIX = "Ultrathink:\n";
function getRawEffort(provider, modelOptions) {
    if (provider === "codex" || provider === "opencode") {
        return trimOrNull(modelOptions?.reasoningEffort);
    }
    if (provider === "claudeAgent") {
        return trimOrNull(modelOptions?.effort);
    }
    return null;
}
function getRawContextWindow(provider, modelOptions) {
    if (provider === "claudeAgent") {
        return trimOrNull(modelOptions?.contextWindow);
    }
    return null;
}
function buildNextOptions(provider, modelOptions, patch) {
    if (provider === "codex" || provider === "opencode") {
        return { ...modelOptions, ...patch };
    }
    if (provider === "gemini") {
        return { ...modelOptions, ...patch };
    }
    return { ...modelOptions, ...patch };
}
function getSelectedTraits(provider, models, model, prompt, modelOptions, allowPromptInjectedEffort) {
    const caps = getProviderModelCapabilities(models, model, provider);
    const effortLevels = allowPromptInjectedEffort
        ? caps.reasoningEffortLevels
        : caps.reasoningEffortLevels.filter((option) => !caps.promptInjectedEffortLevels.includes(option.value));
    // Resolve effort from options (provider-specific key)
    const rawEffort = getRawEffort(provider, modelOptions);
    const effort = resolveEffort(caps, rawEffort) ?? null;
    // Thinking toggle (only for models that support it)
    const thinkingEnabled = caps.supportsThinkingToggle
        ? (modelOptions?.thinking ?? true)
        : null;
    // Fast mode
    const fastModeEnabled = caps.supportsFastMode &&
        modelOptions?.fastMode === true;
    // Context window
    const contextWindowOptions = caps.contextWindowOptions;
    const rawContextWindow = getRawContextWindow(provider, modelOptions);
    const defaultContextWindow = getDefaultContextWindow(caps);
    const contextWindow = rawContextWindow && hasContextWindowOption(caps, rawContextWindow)
        ? rawContextWindow
        : defaultContextWindow;
    // Prompt-controlled effort (e.g. ultrathink in prompt text)
    const ultrathinkPromptControlled = allowPromptInjectedEffort &&
        caps.promptInjectedEffortLevels.length > 0 &&
        isClaudeUltrathinkPrompt(prompt);
    // Check if "ultrathink" appears in the body text (not just our prefix)
    const ultrathinkInBodyText = ultrathinkPromptControlled && isClaudeUltrathinkPrompt(prompt.replace(/^Ultrathink:\s*/i, ""));
    return {
        caps,
        effort,
        effortLevels,
        thinkingEnabled,
        fastModeEnabled,
        contextWindowOptions,
        contextWindow,
        defaultContextWindow,
        ultrathinkPromptControlled,
        ultrathinkInBodyText,
    };
}
export const TraitsMenuContent = memo(function TraitsMenuContentImpl({ provider, models, model, prompt, onPromptChange, modelOptions, allowPromptInjectedEffort = true, ...persistence }) {
    const setProviderModelOptions = useComposerDraftStore((store) => store.setProviderModelOptions);
    const updateModelOptions = useCallback((nextOptions) => {
        if ("onModelOptionsChange" in persistence) {
            persistence.onModelOptionsChange(nextOptions);
            return;
        }
        setProviderModelOptions(persistence.threadId, provider, nextOptions, { persistSticky: true });
    }, [persistence, provider, setProviderModelOptions]);
    const { caps, effort, effortLevels, thinkingEnabled, fastModeEnabled, contextWindowOptions, contextWindow, defaultContextWindow, ultrathinkPromptControlled, ultrathinkInBodyText, } = getSelectedTraits(provider, models, model, prompt, modelOptions, allowPromptInjectedEffort);
    const defaultEffort = getDefaultEffort(caps);
    const handleEffortChange = useCallback((value) => {
        if (!value)
            return;
        const nextOption = effortLevels.find((option) => option.value === value);
        if (!nextOption)
            return;
        if (caps.promptInjectedEffortLevels.includes(nextOption.value)) {
            const nextPrompt = prompt.trim().length === 0
                ? ULTRATHINK_PROMPT_PREFIX
                : applyClaudePromptEffortPrefix(prompt, "ultrathink");
            onPromptChange(nextPrompt);
            return;
        }
        if (ultrathinkInBodyText)
            return;
        if (ultrathinkPromptControlled) {
            const stripped = prompt.replace(/^Ultrathink:\s*/i, "");
            onPromptChange(stripped);
        }
        const effortKey = provider === "codex" || provider === "opencode" ? "reasoningEffort" : "effort";
        updateModelOptions(buildNextOptions(provider, modelOptions, { [effortKey]: nextOption.value }));
    }, [
        ultrathinkPromptControlled,
        ultrathinkInBodyText,
        modelOptions,
        onPromptChange,
        updateModelOptions,
        effortLevels,
        prompt,
        caps.promptInjectedEffortLevels,
        provider,
    ]);
    if (effort === null && thinkingEnabled === null && contextWindowOptions.length <= 1) {
        return null;
    }
    return (_jsxs(_Fragment, { children: [effort ? (_jsx(_Fragment, { children: _jsxs(MenuGroup, { children: [_jsx("div", { className: "px-2 pt-1.5 pb-1 font-medium text-muted-foreground text-xs", children: "Effort" }), ultrathinkInBodyText ? (_jsx("div", { className: "px-2 pb-1.5 text-muted-foreground/80 text-xs", children: "Your prompt contains \"ultrathink\" in the text. Remove it to change effort." })) : null, _jsx(MenuRadioGroup, { value: ultrathinkPromptControlled ? "ultrathink" : effort, onValueChange: handleEffortChange, children: effortLevels.map((option) => (_jsxs(MenuRadioItem, { value: option.value, disabled: ultrathinkInBodyText, children: [option.label, option.value === defaultEffort ? " (default)" : ""] }, option.value))) })] }) })) : thinkingEnabled !== null ? (_jsxs(MenuGroup, { children: [_jsx("div", { className: "px-2 py-1.5 font-medium text-muted-foreground text-xs", children: "Thinking" }), _jsxs(MenuRadioGroup, { value: thinkingEnabled ? "on" : "off", onValueChange: (value) => {
                            updateModelOptions(buildNextOptions(provider, modelOptions, { thinking: value === "on" }));
                        }, children: [_jsx(MenuRadioItem, { value: "on", children: "On (default)" }), _jsx(MenuRadioItem, { value: "off", children: "Off" })] })] })) : null, caps.supportsFastMode ? (_jsxs(_Fragment, { children: [_jsx(MenuDivider, {}), _jsxs(MenuGroup, { children: [_jsx("div", { className: "px-2 py-1.5 font-medium text-muted-foreground text-xs", children: "Fast Mode" }), _jsxs(MenuRadioGroup, { value: fastModeEnabled ? "on" : "off", onValueChange: (value) => {
                                    updateModelOptions(buildNextOptions(provider, modelOptions, { fastMode: value === "on" }));
                                }, children: [_jsx(MenuRadioItem, { value: "off", children: "off" }), _jsx(MenuRadioItem, { value: "on", children: "on" })] })] })] })) : null, contextWindowOptions.length > 1 ? (_jsxs(_Fragment, { children: [_jsx(MenuDivider, {}), _jsxs(MenuGroup, { children: [_jsx("div", { className: "px-2 py-1.5 font-medium text-muted-foreground text-xs", children: "Context Window" }), _jsx(MenuRadioGroup, { value: contextWindow ?? defaultContextWindow ?? "", onValueChange: (value) => {
                                    updateModelOptions(buildNextOptions(provider, modelOptions, {
                                        contextWindow: value,
                                    }));
                                }, children: contextWindowOptions.map((option) => (_jsxs(MenuRadioItem, { value: option.value, children: [option.label, option.value === defaultContextWindow ? " (default)" : ""] }, option.value))) })] })] })) : null] }));
});
export const TraitsPicker = memo(function TraitsPicker({ provider, models, model, prompt, onPromptChange, modelOptions, allowPromptInjectedEffort = true, triggerVariant, triggerClassName, ...persistence }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { caps, effort, effortLevels, thinkingEnabled, fastModeEnabled, contextWindowOptions, contextWindow, defaultContextWindow, ultrathinkPromptControlled, } = getSelectedTraits(provider, models, model, prompt, modelOptions, allowPromptInjectedEffort);
    const effortLabel = effort
        ? (effortLevels.find((l) => l.value === effort)?.label ?? effort)
        : null;
    const contextWindowLabel = contextWindowOptions.length > 1 && contextWindow !== defaultContextWindow
        ? (contextWindowOptions.find((o) => o.value === contextWindow)?.label ?? null)
        : null;
    const triggerLabel = [
        ultrathinkPromptControlled
            ? "Ultrathink"
            : effortLabel
                ? effortLabel
                : thinkingEnabled === null
                    ? null
                    : `Thinking ${thinkingEnabled ? "On" : "Off"}`,
        ...(caps.supportsFastMode && fastModeEnabled ? ["Fast"] : []),
        ...(contextWindowLabel ? [contextWindowLabel] : []),
    ]
        .filter(Boolean)
        .join(" · ");
    const isCodexStyle = provider === "codex" || provider === "gemini" || provider === "opencode";
    return (_jsxs(Menu, { open: isMenuOpen, onOpenChange: (open) => {
            setIsMenuOpen(open);
        }, children: [_jsx(MenuTrigger, { render: _jsx(Button, { size: "sm", variant: triggerVariant ?? "ghost", className: cn(isCodexStyle
                        ? "min-w-0 max-w-40 shrink justify-start overflow-hidden whitespace-nowrap px-2 text-muted-foreground/70 hover:text-foreground/80 sm:max-w-48 sm:px-3 [&_svg]:mx-0"
                        : "shrink-0 whitespace-nowrap px-2 text-muted-foreground/70 hover:text-foreground/80 sm:px-3", triggerClassName) }), children: isCodexStyle ? (_jsxs("span", { className: "flex min-w-0 w-full items-center gap-2 overflow-hidden", children: [triggerLabel, _jsx(ChevronDownIcon, { "aria-hidden": "true", className: "size-3 shrink-0 opacity-60" })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { children: triggerLabel }), _jsx(ChevronDownIcon, { "aria-hidden": "true", className: "size-3 opacity-60" })] })) }), _jsx(MenuPopup, { align: "start", children: _jsx(TraitsMenuContent, { provider: provider, models: models, model: model, prompt: prompt, onPromptChange: onPromptChange, modelOptions: modelOptions, allowPromptInjectedEffort: allowPromptInjectedEffort, ...persistence }) })] }));
});
