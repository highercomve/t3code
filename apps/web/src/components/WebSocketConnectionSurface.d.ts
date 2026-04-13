import { type ReactNode } from "react";
import { type WsConnectionStatus } from "../rpc/wsConnectionState";
type WsAutoReconnectTrigger = "focus" | "online";
export declare function shouldAutoReconnect(
  status: WsConnectionStatus,
  trigger: WsAutoReconnectTrigger,
): boolean;
export declare function shouldRestartStalledReconnect(
  status: WsConnectionStatus,
  expectedNextRetryAt: string,
): boolean;
export declare function WebSocketConnectionCoordinator(): null;
export declare function SlowRpcAckToastCoordinator(): null;
export declare function WebSocketConnectionSurface({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode;
export {};
