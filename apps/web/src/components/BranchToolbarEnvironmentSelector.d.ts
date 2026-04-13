import type { EnvironmentId } from "@t3tools/contracts";
import type { EnvironmentOption } from "./BranchToolbar.logic";
interface BranchToolbarEnvironmentSelectorProps {
  envLocked: boolean;
  environmentId: EnvironmentId;
  availableEnvironments: readonly EnvironmentOption[];
  onEnvironmentChange: (environmentId: EnvironmentId) => void;
}
export declare const BranchToolbarEnvironmentSelector: import("react").NamedExoticComponent<BranchToolbarEnvironmentSelectorProps>;
export {};
