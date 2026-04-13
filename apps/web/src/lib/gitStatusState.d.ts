import {
  type EnvironmentId,
  type GitManagerServiceError,
  type GitStatusResult,
} from "@t3tools/contracts";
import { Cause } from "effect";
import type { WsRpcClient } from "~/rpc/wsRpcClient";
interface GitStatusState {
  readonly data: GitStatusResult | null;
  readonly error: GitManagerServiceError | null;
  readonly cause: Cause.Cause<GitManagerServiceError> | null;
  readonly isPending: boolean;
}
type GitStatusClient = Pick<WsRpcClient["git"], "onStatus" | "refreshStatus">;
interface GitStatusTarget {
  readonly environmentId: EnvironmentId | null;
  readonly cwd: string | null;
}
export declare function getGitStatusSnapshot(target: GitStatusTarget): GitStatusState;
export declare function watchGitStatus(
  target: GitStatusTarget,
  client?: GitStatusClient,
): () => void;
export declare function refreshGitStatus(
  target: GitStatusTarget,
  client?: GitStatusClient,
): Promise<GitStatusResult | null>;
export declare function resetGitStatusStateForTests(): void;
export declare function useGitStatus(target: GitStatusTarget): GitStatusState;
export {};
