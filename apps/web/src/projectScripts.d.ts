import { type KeybindingCommand, type ProjectScript } from "@t3tools/contracts";
export declare const commandForProjectScript: (scriptId: string) => KeybindingCommand;
export declare function projectScriptIdFromCommand(command: string): string | null;
export declare function nextProjectScriptId(name: string, existingIds: Iterable<string>): string;
interface ProjectScriptRuntimeEnvInput {
  project: {
    cwd: string;
  };
  worktreePath?: string | null;
  extraEnv?: Record<string, string>;
}
export declare function projectScriptCwd(input: {
  project: {
    cwd: string;
  };
  worktreePath?: string | null;
}): string;
export declare function projectScriptRuntimeEnv(
  input: ProjectScriptRuntimeEnvInput,
): Record<string, string>;
export declare function primaryProjectScript(scripts: ProjectScript[]): ProjectScript | null;
export declare function setupProjectScript(scripts: ProjectScript[]): ProjectScript | null;
export {};
