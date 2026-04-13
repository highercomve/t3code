import { jsx as _jsx } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { NoActiveThreadState } from "../components/NoActiveThreadState";
function ChatIndexRouteView() {
  return _jsx(NoActiveThreadState, {});
}
export const Route = createFileRoute("/_chat/")({
  component: ChatIndexRouteView,
});
