import { ProviderInteractionMode, RuntimeMode } from "@t3tools/contracts";
import { type ReactNode } from "react";
export declare const CompactComposerControlsMenu: import("react").NamedExoticComponent<{
  activePlan: boolean;
  interactionMode: ProviderInteractionMode;
  planSidebarOpen: boolean;
  runtimeMode: RuntimeMode;
  traitsMenuContent?: ReactNode;
  onToggleInteractionMode: () => void;
  onTogglePlanSidebar: () => void;
  onRuntimeModeChange: (mode: RuntimeMode) => void;
}>;
