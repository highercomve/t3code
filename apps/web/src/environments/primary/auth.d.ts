import type {
  AuthClientMetadata,
  AuthPairingCredentialResult,
  AuthSessionId,
  AuthSessionState,
} from "@t3tools/contracts";
declare const BootstrapHttpError_base: new <A extends Record<string, any> = {}>(
  args: import("effect/Types").VoidIfEmpty<{
    readonly [P in keyof A as P extends "_tag" ? never : P]: A[P];
  }>,
) => import("effect/Cause").YieldableError & {
  readonly _tag: "BootstrapHttpError";
} & Readonly<A>;
export declare class BootstrapHttpError extends BootstrapHttpError_base<{
  readonly message: string;
  readonly status: number;
}> {}
export interface ServerPairingLinkRecord {
  readonly id: string;
  readonly credential: string;
  readonly role: "owner" | "client";
  readonly subject: string;
  readonly label?: string;
  readonly createdAt: string;
  readonly expiresAt: string;
}
export interface ServerClientSessionRecord {
  readonly sessionId: AuthSessionId;
  readonly subject: string;
  readonly role: "owner" | "client";
  readonly method: "browser-session-cookie" | "bearer-session-token";
  readonly client: AuthClientMetadata;
  readonly issuedAt: string;
  readonly expiresAt: string;
  readonly lastConnectedAt: string | null;
  readonly connected: boolean;
  readonly current: boolean;
}
type ServerAuthGateState =
  | {
      status: "authenticated";
    }
  | {
      status: "requires-auth";
      auth: AuthSessionState["auth"];
      errorMessage?: string;
    };
export declare function peekPairingTokenFromUrl(): string | null;
export declare function stripPairingTokenFromUrl(): void;
export declare function takePairingTokenFromUrl(): string | null;
export declare function fetchSessionState(): Promise<AuthSessionState>;
export declare function retryTransientBootstrap<T>(operation: () => Promise<T>): Promise<T>;
export declare function submitServerAuthCredential(credential: string): Promise<void>;
export declare function createServerPairingCredential(
  label?: string,
): Promise<AuthPairingCredentialResult>;
export declare function listServerPairingLinks(): Promise<ReadonlyArray<ServerPairingLinkRecord>>;
export declare function revokeServerPairingLink(id: string): Promise<void>;
export declare function listServerClientSessions(): Promise<
  ReadonlyArray<ServerClientSessionRecord>
>;
export declare function revokeServerClientSession(sessionId: AuthSessionId): Promise<void>;
export declare function revokeOtherServerClientSessions(): Promise<number>;
export declare function resolveInitialServerAuthGateState(): Promise<ServerAuthGateState>;
export declare function __resetServerAuthBootstrapForTests(): void;
export {};
