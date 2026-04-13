import type { ServerProviderSkill } from "@t3tools/contracts";
export declare function searchProviderSkills(
  skills: ReadonlyArray<ServerProviderSkill>,
  query: string,
  limit?: number,
): ServerProviderSkill[];
