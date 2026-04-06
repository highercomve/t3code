import { type ReactNode } from "react";
import { type WsConnectionStatus } from "../rpc/wsConnectionState";
type WsAutoReconnectTrigger = "focus" | "online";
export declare function shouldAutoReconnect(
  status: WsConnectionStatus,
  trigger: WsAutoReconnectTrigger,
): boolean;
export declare function WebSocketConnectionCoordinator(): null;
export declare function SlowRpcAckToastCoordinator(): null;
export declare function WebSocketConnectionSurface({
  children,
}: {
  readonly children: ReactNode;
}):
  | string
  | number
  | bigint
  | boolean
  | import("react/jsx-runtime").JSX.Element
  | Iterable<ReactNode>
  | Promise<
      | string
      | number
      | bigint
      | boolean
      | import("react").ReactPortal
      | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>
      | Iterable<ReactNode>
      | null
      | undefined
    >
  | null
  | undefined;
export {};
