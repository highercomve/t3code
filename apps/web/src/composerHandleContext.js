import { createContext, useContext } from "react";
export const ComposerHandleContext = createContext(null);
export function useComposerHandleContext() {
  return useContext(ComposerHandleContext);
}
