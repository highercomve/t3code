import { type GitManagerServiceError, type GitStatusResult } from "@t3tools/contracts";
import { Cause } from "effect";
import { type WsRpcClient } from "../wsRpcClient";
export type GitStatusStreamError = GitManagerServiceError;
export interface GitStatusState {
    readonly data: GitStatusResult | null;
    readonly error: GitStatusStreamError | null;
    readonly cause: Cause.Cause<GitStatusStreamError> | null;
    readonly isPending: boolean;
}
type GitStatusClient = Pick<WsRpcClient["git"], "onStatus" | "refreshStatus">;
export declare function getGitStatusSnapshot(cwd: string | null): GitStatusState;
export declare function watchGitStatus(cwd: string | null, client?: GitStatusClient): () => void;
export declare function refreshGitStatus(cwd: string | null, client?: GitStatusClient): Promise<GitStatusResult | null>;
export declare function resetGitStatusStateForTests(): void;
export declare function useGitStatus(cwd: string | null): GitStatusState;
export {};
