export declare function useSettingsRestore(onRestored?: () => void): {
  changedSettingLabels: string[];
  restoreDefaults: () => Promise<void>;
};
export declare function GeneralSettingsPanel(): import("react/jsx-runtime").JSX.Element;
export declare function ArchivedThreadsPanel(): import("react/jsx-runtime").JSX.Element;
