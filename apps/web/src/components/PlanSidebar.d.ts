import { type TimestampFormat } from "@t3tools/contracts/settings";
import type { ActivePlanState } from "../session-logic";
import type { LatestProposedPlanState } from "../session-logic";
interface PlanSidebarProps {
  activePlan: ActivePlanState | null;
  activeProposedPlan: LatestProposedPlanState | null;
  markdownCwd: string | undefined;
  workspaceRoot: string | undefined;
  timestampFormat: TimestampFormat;
  onClose: () => void;
}
declare const PlanSidebar: import("react").NamedExoticComponent<PlanSidebarProps>;
export default PlanSidebar;
export type { PlanSidebarProps };
