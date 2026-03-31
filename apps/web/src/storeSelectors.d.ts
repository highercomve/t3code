import { type ThreadId } from "@t3tools/contracts";
import { type Project, type Thread } from "./types";
export declare function useProjectById(
  projectId: Project["id"] | null | undefined,
): Project | undefined;
export declare function useThreadById(threadId: ThreadId | null | undefined): Thread | undefined;
