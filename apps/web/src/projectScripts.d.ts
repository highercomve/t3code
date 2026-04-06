import { type KeybindingCommand, type ProjectScript } from "@t3tools/contracts";
export declare const commandForProjectScript: (scriptId: string) => KeybindingCommand;
export declare function projectScriptIdFromCommand(command: string): string | null;
export declare function nextProjectScriptId(name: string, existingIds: Iterable<string>): string;
export declare function primaryProjectScript(scripts: ProjectScript[]): ProjectScript | null;
