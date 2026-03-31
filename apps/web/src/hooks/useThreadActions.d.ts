import { ThreadId } from "@t3tools/contracts";
export declare function useThreadActions(): {
  archiveThread: (threadId: ThreadId) => Promise<void>;
  unarchiveThread: (threadId: ThreadId) => Promise<void>;
  deleteThread: (
    threadId: ThreadId,
    opts?: {
      deletedThreadIds?: ReadonlySet<ThreadId>;
    },
  ) => Promise<void>;
  confirmAndDeleteThread: (threadId: ThreadId) => Promise<void>;
};
