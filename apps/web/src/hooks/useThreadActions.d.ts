import { type ScopedThreadRef } from "@t3tools/contracts";
export declare function useThreadActions(): {
  archiveThread: (target: ScopedThreadRef) => Promise<void>;
  unarchiveThread: (target: ScopedThreadRef) => Promise<void>;
  deleteThread: (
    target: ScopedThreadRef,
    opts?: {
      deletedThreadKeys?: ReadonlySet<string>;
    },
  ) => Promise<void>;
  confirmAndDeleteThread: (target: ScopedThreadRef) => Promise<void>;
};
