interface CommandPaletteStore {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
}
export declare const useCommandPaletteStore: import("zustand").UseBoundStore<
  import("zustand").StoreApi<CommandPaletteStore>
>;
export {};
