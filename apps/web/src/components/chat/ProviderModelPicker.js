import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { resolveSelectableModel } from "@t3tools/shared/model";
import { memo, useState } from "react";
import { PROVIDER_OPTIONS } from "../../session-logic";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Menu, MenuGroup, MenuItem, MenuPopup, MenuRadioGroup, MenuRadioItem, MenuSeparator as MenuDivider, MenuSub, MenuSubPopup, MenuSubTrigger, MenuTrigger, } from "../ui/menu";
import { ClaudeAI, CursorIcon, Gemini, OpenAI, OpenCodeIcon } from "../Icons";
import { cn } from "~/lib/utils";
import { getProviderSnapshot } from "../../providerModels";
function isAvailableProviderOption(option) {
    return option.available;
}
const PROVIDER_ICON_BY_PROVIDER = {
    codex: OpenAI,
    gemini: Gemini,
    claudeAgent: ClaudeAI,
    opencode: OpenCodeIcon,
    cursor: CursorIcon,
};
export const AVAILABLE_PROVIDER_OPTIONS = PROVIDER_OPTIONS.filter(isAvailableProviderOption);
const UNAVAILABLE_PROVIDER_OPTIONS = PROVIDER_OPTIONS.filter((option) => !option.available);
const COMING_SOON_PROVIDER_OPTIONS = [];
function providerIconClassName(provider, fallbackClassName) {
    return provider === "claudeAgent" ? "text-[#d97757]" : fallbackClassName;
}
export const ProviderModelPicker = memo(function ProviderModelPicker(props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const activeProvider = props.lockedProvider ?? props.provider;
    const selectedProviderOptions = props.modelOptionsByProvider[activeProvider];
    const selectedModelLabel = selectedProviderOptions.find((option) => option.slug === props.model)?.name ?? props.model;
    const ProviderIcon = PROVIDER_ICON_BY_PROVIDER[activeProvider];
    const handleModelChange = (provider, value) => {
        if (props.disabled)
            return;
        if (!value)
            return;
        const resolvedModel = resolveSelectableModel(provider, value, props.modelOptionsByProvider[provider]);
        if (!resolvedModel)
            return;
        props.onProviderModelChange(provider, resolvedModel);
        setIsMenuOpen(false);
    };
    return (_jsxs(Menu, { open: isMenuOpen, onOpenChange: (open) => {
            if (props.disabled) {
                setIsMenuOpen(false);
                return;
            }
            setIsMenuOpen(open);
        }, children: [_jsx(MenuTrigger, { render: _jsx(Button, { size: "sm", variant: props.triggerVariant ?? "ghost", className: cn("min-w-0 justify-start overflow-hidden whitespace-nowrap px-2 text-muted-foreground/70 hover:text-foreground/80 [&_svg]:mx-0", props.compact ? "max-w-42 shrink-0" : "max-w-48 shrink sm:max-w-56 sm:px-3", props.triggerClassName), disabled: props.disabled }), children: _jsxs("span", { className: cn("flex min-w-0 w-full items-center gap-2 overflow-hidden", props.compact ? "max-w-36" : undefined), children: [_jsx(ProviderIcon, { "aria-hidden": "true", className: cn("size-4 shrink-0", providerIconClassName(activeProvider, "text-muted-foreground/70"), props.activeProviderIconClassName) }), _jsx("span", { className: "min-w-0 flex-1 truncate", children: selectedModelLabel }), _jsx(ChevronDownIcon, { "aria-hidden": "true", className: "size-3 shrink-0 opacity-60" })] }) }), _jsx(MenuPopup, { align: "start", children: props.lockedProvider !== null ? (_jsx(MenuGroup, { children: _jsx(MenuRadioGroup, { value: props.model, onValueChange: (value) => handleModelChange(props.lockedProvider, value), children: props.modelOptionsByProvider[props.lockedProvider].map((modelOption) => (_jsx(MenuRadioItem, { value: modelOption.slug, onClick: () => setIsMenuOpen(false), children: modelOption.name }, `${props.lockedProvider}:${modelOption.slug}`))) }) })) : (_jsxs(_Fragment, { children: [AVAILABLE_PROVIDER_OPTIONS.map((option) => {
                            const OptionIcon = PROVIDER_ICON_BY_PROVIDER[option.value];
                            const liveProvider = props.providers
                                ? getProviderSnapshot(props.providers, option.value)
                                : undefined;
                            if (liveProvider && liveProvider.status !== "ready") {
                                const unavailableLabel = !liveProvider.enabled
                                    ? "Disabled"
                                    : !liveProvider.installed
                                        ? "Not installed"
                                        : "Unavailable";
                                return (_jsxs(MenuItem, { disabled: true, children: [_jsx(OptionIcon, { "aria-hidden": "true", className: cn("size-4 shrink-0 opacity-80", providerIconClassName(option.value, "text-muted-foreground/85")) }), _jsx("span", { children: option.label }), _jsx("span", { className: "ms-auto text-[11px] text-muted-foreground/80 uppercase tracking-[0.08em]", children: unavailableLabel })] }, option.value));
                            }
                            return (_jsxs(MenuSub, { children: [_jsxs(MenuSubTrigger, { children: [_jsx(OptionIcon, { "aria-hidden": "true", className: cn("size-4 shrink-0", providerIconClassName(option.value, "text-muted-foreground/85")) }), option.label] }), _jsx(MenuSubPopup, { className: "[--available-height:min(24rem,70vh)]", sideOffset: 4, children: _jsx(MenuGroup, { children: _jsx(MenuRadioGroup, { value: props.provider === option.value ? props.model : "", onValueChange: (value) => handleModelChange(option.value, value), children: props.modelOptionsByProvider[option.value].map((modelOption) => (_jsx(MenuRadioItem, { value: modelOption.slug, onClick: () => setIsMenuOpen(false), children: modelOption.name }, `${option.value}:${modelOption.slug}`))) }) }) })] }, option.value));
                        }), UNAVAILABLE_PROVIDER_OPTIONS.length > 0 && _jsx(MenuDivider, {}), UNAVAILABLE_PROVIDER_OPTIONS.map((option) => {
                            const OptionIcon = PROVIDER_ICON_BY_PROVIDER[option.value];
                            return (_jsxs(MenuItem, { disabled: true, children: [_jsx(OptionIcon, { "aria-hidden": "true", className: "size-4 shrink-0 text-muted-foreground/85 opacity-80" }), _jsx("span", { children: option.label }), _jsx("span", { className: "ms-auto text-[11px] text-muted-foreground/80 uppercase tracking-[0.08em]", children: "Coming soon" })] }, option.value));
                        }), UNAVAILABLE_PROVIDER_OPTIONS.length === 0 && _jsx(MenuDivider, {}), COMING_SOON_PROVIDER_OPTIONS.map((option) => {
                            const OptionIcon = option.icon;
                            return (_jsxs(MenuItem, { disabled: true, children: [_jsx(OptionIcon, { "aria-hidden": "true", className: "size-4 shrink-0 opacity-80" }), _jsx("span", { children: option.label }), _jsx("span", { className: "ms-auto text-[11px] text-muted-foreground/80 uppercase tracking-[0.08em]", children: "Coming soon" })] }, option.id));
                        })] })) })] }));
});
