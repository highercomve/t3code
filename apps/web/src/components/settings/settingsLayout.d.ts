import { type ReactNode } from "react";
/** Re-render every `intervalMs`; return a stable timestamp snapshot for render-time relative labels. */
export declare function useRelativeTimeTick(intervalMs?: number): number;
export declare function SettingsSection({
  title,
  icon,
  headerAction,
  children,
}: {
  title: string;
  icon?: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function SettingsRow({
  title,
  description,
  status,
  resetAction,
  control,
  children,
}: {
  title: ReactNode;
  description: string;
  status?: ReactNode;
  resetAction?: ReactNode;
  control?: ReactNode;
  children?: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function SettingResetButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function SettingsPageContainer({
  children,
}: {
  children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
