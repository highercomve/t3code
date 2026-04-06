import { useMemo } from "react";
import {
  selectProjectById,
  selectSidebarThreadSummaryById,
  selectThreadById,
  useStore,
} from "./store";
export function useProjectById(projectId) {
  const selector = useMemo(() => selectProjectById(projectId), [projectId]);
  return useStore(selector);
}
export function useThreadById(threadId) {
  const selector = useMemo(() => selectThreadById(threadId), [threadId]);
  return useStore(selector);
}
export function useSidebarThreadSummaryById(threadId) {
  const selector = useMemo(() => selectSidebarThreadSummaryById(threadId), [threadId]);
  return useStore(selector);
}
