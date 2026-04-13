import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CloudIcon, MonitorIcon } from "lucide-react";
import { memo, useMemo } from "react";
import {
  Select,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
export const BranchToolbarEnvironmentSelector = memo(function BranchToolbarEnvironmentSelector({
  envLocked,
  environmentId,
  availableEnvironments,
  onEnvironmentChange,
}) {
  const activeEnvironment = useMemo(() => {
    return availableEnvironments.find((env) => env.environmentId === environmentId) ?? null;
  }, [availableEnvironments, environmentId]);
  const environmentItems = useMemo(
    () =>
      availableEnvironments.map((env) => ({
        value: env.environmentId,
        label: env.label,
      })),
    [availableEnvironments],
  );
  if (envLocked) {
    return _jsxs("span", {
      className:
        "inline-flex items-center gap-1 border border-transparent px-[calc(--spacing(3)-1px)] text-sm font-medium text-muted-foreground/70 sm:text-xs",
      children: [
        activeEnvironment?.isPrimary
          ? _jsx(MonitorIcon, { className: "size-3" })
          : _jsx(CloudIcon, { className: "size-3" }),
        activeEnvironment?.label ?? "Run on",
      ],
    });
  }
  return _jsxs(Select, {
    value: environmentId,
    onValueChange: (value) => onEnvironmentChange(value),
    items: environmentItems,
    children: [
      _jsxs(SelectTrigger, {
        variant: "ghost",
        size: "xs",
        className: "font-medium",
        "aria-label": "Run on",
        children: [
          activeEnvironment?.isPrimary
            ? _jsx(MonitorIcon, { className: "size-3" })
            : _jsx(CloudIcon, { className: "size-3" }),
          _jsx(SelectValue, {}),
        ],
      }),
      _jsx(SelectPopup, {
        children: _jsxs(SelectGroup, {
          children: [
            _jsx(SelectGroupLabel, { children: "Run on" }),
            availableEnvironments.map((env) =>
              _jsx(
                SelectItem,
                {
                  value: env.environmentId,
                  children: _jsxs("span", {
                    className: "inline-flex items-center gap-1.5",
                    children: [
                      env.isPrimary
                        ? _jsx(MonitorIcon, { className: "size-3" })
                        : _jsx(CloudIcon, { className: "size-3" }),
                      env.label,
                    ],
                  }),
                },
                env.environmentId,
              ),
            ),
          ],
        }),
      }),
    ],
  });
});
