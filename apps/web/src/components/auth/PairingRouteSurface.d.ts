import type { AuthSessionState } from "@t3tools/contracts";
export declare function PairingPendingSurface(): import("react/jsx-runtime").JSX.Element;
export declare function PairingRouteSurface({
  auth,
  initialErrorMessage,
  onAuthenticated,
}: {
  auth: AuthSessionState["auth"];
  initialErrorMessage?: string;
  onAuthenticated: () => void;
}): import("react/jsx-runtime").JSX.Element;
