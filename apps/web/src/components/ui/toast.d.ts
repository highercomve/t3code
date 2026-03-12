import { Toast } from "@base-ui/react/toast";
import { ThreadId } from "@t3tools/contracts";
type ThreadToastData = {
  threadId?: ThreadId | null;
  tooltipStyle?: boolean;
  dismissAfterVisibleMs?: number;
};
declare const toastManager: import("@base-ui/react").ToastManager<ThreadToastData>;
declare const anchoredToastManager: import("@base-ui/react").ToastManager<ThreadToastData>;
type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
interface ToastProviderProps extends Toast.Provider.Props {
  position?: ToastPosition;
}
declare function ToastProvider({
  children,
  position,
  ...props
}: ToastProviderProps): import("react/jsx-runtime").JSX.Element;
declare function AnchoredToastProvider({
  children,
  ...props
}: Toast.Provider.Props): import("react/jsx-runtime").JSX.Element;
export {
  ToastProvider,
  type ToastPosition,
  toastManager,
  AnchoredToastProvider,
  anchoredToastManager,
};
