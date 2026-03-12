import { afterEach, describe, expect, it } from "vitest";
import { isTerminalFocused } from "./terminalFocus";
class MockHTMLElement {
  isConnected = false;
  className = "";
  classList = {
    contains: (value) => this.className.split(/\s+/).includes(value),
  };
  closest(selector) {
    return selector === ".thread-terminal-drawer .xterm" && this.isConnected ? this : null;
  }
}
const originalDocument = globalThis.document;
const originalHTMLElement = globalThis.HTMLElement;
afterEach(() => {
  if (originalDocument === undefined) {
    delete globalThis.document;
  } else {
    globalThis.document = originalDocument;
  }
  if (originalHTMLElement === undefined) {
    delete globalThis.HTMLElement;
  } else {
    globalThis.HTMLElement = originalHTMLElement;
  }
});
describe("isTerminalFocused", () => {
  it("returns false for detached xterm helper textareas", () => {
    const detached = new MockHTMLElement();
    detached.className = "xterm-helper-textarea";
    globalThis.HTMLElement = MockHTMLElement;
    globalThis.document = { activeElement: detached };
    expect(isTerminalFocused()).toBe(false);
  });
  it("returns true for connected xterm helper textareas", () => {
    const attached = new MockHTMLElement();
    attached.className = "xterm-helper-textarea";
    attached.isConnected = true;
    globalThis.HTMLElement = MockHTMLElement;
    globalThis.document = { activeElement: attached };
    expect(isTerminalFocused()).toBe(true);
  });
});
