import { createElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { StoreProvider } from "./store";
export function getRouter(history) {
  const queryClient = new QueryClient();
  return createRouter({
    routeTree,
    history,
    context: {
      queryClient,
    },
    Wrap: ({ children }) =>
      createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(StoreProvider, null, children),
      ),
  });
}
