import type {
  ProjectScript,
  ProjectScriptIcon,
  ResolvedKeybindingsConfig,
} from "@t3tools/contracts";
export interface NewProjectScriptInput {
  name: string;
  command: string;
  icon: ProjectScriptIcon;
  runOnWorktreeCreate: boolean;
  keybinding: string | null;
}
interface ProjectScriptsControlProps {
  scripts: ProjectScript[];
  keybindings: ResolvedKeybindingsConfig;
  preferredScriptId?: string | null;
  onRunScript: (script: ProjectScript) => void;
  onAddScript: (input: NewProjectScriptInput) => Promise<void> | void;
  onUpdateScript: (scriptId: string, input: NewProjectScriptInput) => Promise<void> | void;
  onDeleteScript: (scriptId: string) => Promise<void> | void;
}
export default function ProjectScriptsControl({
  scripts,
  keybindings,
  preferredScriptId,
  onRunScript,
  onAddScript,
  onUpdateScript,
  onDeleteScript,
}: ProjectScriptsControlProps): import("react/jsx-runtime").JSX.Element;
export {};
