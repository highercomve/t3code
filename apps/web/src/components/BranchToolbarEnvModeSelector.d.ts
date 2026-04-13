import { type EnvMode } from "./BranchToolbar.logic";
interface BranchToolbarEnvModeSelectorProps {
  envLocked: boolean;
  effectiveEnvMode: EnvMode;
  activeWorktreePath: string | null;
  onEnvModeChange: (mode: EnvMode) => void;
}
export declare const BranchToolbarEnvModeSelector: import("react").NamedExoticComponent<BranchToolbarEnvModeSelectorProps>;
export {};
