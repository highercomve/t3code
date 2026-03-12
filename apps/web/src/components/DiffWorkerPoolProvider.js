import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { WorkerPoolContextProvider, useWorkerPool } from "@pierre/diffs/react";
import DiffsWorker from "@pierre/diffs/worker/worker.js?worker";
import { useEffect, useMemo } from "react";
import { useTheme } from "../hooks/useTheme";
import { resolveDiffThemeName } from "../lib/diffRendering";
function DiffWorkerThemeSync({ themeName }) {
  const workerPool = useWorkerPool();
  useEffect(() => {
    if (!workerPool) {
      return;
    }
    const current = workerPool.getDiffRenderOptions();
    if (current.theme === themeName) {
      return;
    }
    void workerPool
      .setRenderOptions({
        ...current,
        theme: themeName,
      })
      .catch(() => undefined);
  }, [themeName, workerPool]);
  return null;
}
export function DiffWorkerPoolProvider({ children }) {
  const { resolvedTheme } = useTheme();
  const diffThemeName = resolveDiffThemeName(resolvedTheme);
  const workerPoolSize = useMemo(() => {
    const cores =
      typeof navigator === "undefined" ? 4 : Math.max(1, navigator.hardwareConcurrency || 4);
    return Math.max(2, Math.min(6, Math.floor(cores / 2)));
  }, []);
  return _jsxs(WorkerPoolContextProvider, {
    poolOptions: {
      workerFactory: () => new DiffsWorker(),
      poolSize: workerPoolSize,
      totalASTLRUCacheSize: 240,
    },
    highlighterOptions: {
      theme: diffThemeName,
      tokenizeMaxLineLength: 1_000,
    },
    children: [_jsx(DiffWorkerThemeSync, { themeName: diffThemeName }), children],
  });
}
