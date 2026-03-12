import { jsx as _jsx } from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuSubButton,
  SidebarProvider,
} from "./sidebar";
function renderSidebarButton(className) {
  return renderToStaticMarkup(
    _jsx(SidebarProvider, {
      children: _jsx(SidebarMenuButton, { className: className, children: "Projects" }),
    }),
  );
}
describe("sidebar interactive cursors", () => {
  it("uses a pointer cursor for menu buttons by default", () => {
    const html = renderSidebarButton();
    expect(html).toContain('data-slot="sidebar-menu-button"');
    expect(html).toContain("cursor-pointer");
  });
  it("lets project drag handles override the default pointer cursor", () => {
    const html = renderSidebarButton("cursor-grab");
    expect(html).toContain("cursor-grab");
    expect(html).not.toContain("cursor-pointer");
  });
  it("uses a pointer cursor for menu actions", () => {
    const html = renderToStaticMarkup(
      _jsx(SidebarMenuAction, {
        "aria-label": "Create thread",
        children: _jsx("span", { children: "+" }),
      }),
    );
    expect(html).toContain('data-slot="sidebar-menu-action"');
    expect(html).toContain("cursor-pointer");
  });
  it("uses a pointer cursor for submenu buttons", () => {
    const html = renderToStaticMarkup(
      _jsx(SidebarMenuSubButton, {
        render: _jsx("button", { type: "button" }),
        children: "Show more",
      }),
    );
    expect(html).toContain('data-slot="sidebar-menu-sub-button"');
    expect(html).toContain("cursor-pointer");
  });
});
