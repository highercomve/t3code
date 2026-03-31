var __addDisposableResource =
  (this && this.__addDisposableResource) ||
  function (env, value, async) {
    if (value !== null && value !== void 0) {
      if (typeof value !== "object" && typeof value !== "function")
        throw new TypeError("Object expected.");
      var dispose, inner;
      if (async) {
        if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
        dispose = value[Symbol.asyncDispose];
      }
      if (dispose === void 0) {
        if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
        dispose = value[Symbol.dispose];
        if (async) inner = dispose;
      }
      if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
      if (inner)
        dispose = function () {
          try {
            inner.call(this);
          } catch (e) {
            return Promise.reject(e);
          }
        };
      env.stack.push({ value: value, dispose: dispose, async: async });
    } else if (async) {
      env.stack.push({ async: true });
    }
    return value;
  };
var __disposeResources =
  (this && this.__disposeResources) ||
  (function (SuppressedError) {
    return function (env) {
      function fail(e) {
        env.error = env.hasError
          ? new SuppressedError(e, env.error, "An error was suppressed during disposal.")
          : e;
        env.hasError = true;
      }
      var r,
        s = 0;
      function next() {
        while ((r = env.stack.pop())) {
          try {
            if (!r.async && s === 1)
              return ((s = 0), env.stack.push(r), Promise.resolve().then(next));
            if (r.dispose) {
              var result = r.dispose.call(r.value);
              if (r.async)
                return (
                  (s |= 2),
                  Promise.resolve(result).then(next, function (e) {
                    fail(e);
                    return next();
                  })
                );
            } else s |= 1;
          } catch (e) {
            fail(e);
          }
        }
        if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
        if (env.hasError) throw env.error;
      }
      return next();
    };
  })(
    typeof SuppressedError === "function"
      ? SuppressedError
      : function (error, suppressed, message) {
          var e = new Error(message);
          return ((e.name = "SuppressedError"), (e.error = error), (e.suppressed = suppressed), e);
        },
  );
import { jsx as _jsx } from "react/jsx-runtime";
import { DEFAULT_MODEL_BY_PROVIDER, ThreadId } from "@t3tools/contracts";
import "../../index.css";
import { page } from "vitest/browser";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { CompactComposerControlsMenu } from "./CompactComposerControlsMenu";
import { TraitsMenuContent } from "./TraitsPicker";
import { useComposerDraftStore } from "../../composerDraftStore";
async function mountMenu(props) {
  const threadId = ThreadId.makeUnsafe("thread-compact-menu");
  const provider = props?.modelSelection?.provider ?? "claudeAgent";
  const draftsByThreadId = {};
  const model = props?.modelSelection?.model ?? DEFAULT_MODEL_BY_PROVIDER[provider];
  draftsByThreadId[threadId] = {
    prompt: props?.prompt ?? "",
    images: [],
    nonPersistedImageIds: [],
    persistedAttachments: [],
    terminalContexts: [],
    modelSelectionByProvider: {
      [provider]: {
        provider,
        model,
        ...(props?.modelSelection?.options ? { options: props.modelSelection.options } : {}),
      },
    },
    activeProvider: provider,
    runtimeMode: null,
    interactionMode: null,
  };
  useComposerDraftStore.setState({
    draftsByThreadId,
    draftThreadsByThreadId: {},
    projectDraftThreadIdByProjectId: {},
  });
  const host = document.createElement("div");
  document.body.append(host);
  const onPromptChange = vi.fn();
  const providerOptions = props?.modelSelection?.options;
  const models =
    provider === "claudeAgent"
      ? [
          {
            slug: "claude-opus-4-6",
            name: "Claude Opus 4.6",
            isCustom: false,
            capabilities: {
              reasoningEffortLevels: [
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High", isDefault: true },
                { value: "max", label: "Max" },
                { value: "ultrathink", label: "Ultrathink" },
              ],
              supportsFastMode: true,
              supportsThinkingToggle: false,
              contextWindowOptions: [],
              promptInjectedEffortLevels: ["ultrathink"],
            },
          },
          {
            slug: "claude-haiku-4-5",
            name: "Claude Haiku 4.5",
            isCustom: false,
            capabilities: {
              reasoningEffortLevels: [],
              supportsFastMode: false,
              supportsThinkingToggle: true,
              contextWindowOptions: [],
              promptInjectedEffortLevels: [],
            },
          },
          {
            slug: "claude-sonnet-4-6",
            name: "Claude Sonnet 4.6",
            isCustom: false,
            capabilities: {
              reasoningEffortLevels: [
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High", isDefault: true },
                { value: "ultrathink", label: "Ultrathink" },
              ],
              supportsFastMode: false,
              supportsThinkingToggle: false,
              contextWindowOptions: [],
              promptInjectedEffortLevels: ["ultrathink"],
            },
          },
        ]
      : [
          {
            slug: "gpt-5.4",
            name: "GPT-5.4",
            isCustom: false,
            capabilities: {
              reasoningEffortLevels: [
                { value: "xhigh", label: "Extra High" },
                { value: "high", label: "High", isDefault: true },
              ],
              supportsFastMode: true,
              supportsThinkingToggle: false,
              contextWindowOptions: [],
              promptInjectedEffortLevels: [],
            },
          },
        ];
  const screen = await render(
    _jsx(CompactComposerControlsMenu, {
      activePlan: false,
      interactionMode: "default",
      planSidebarOpen: false,
      runtimeMode: "approval-required",
      traitsMenuContent: _jsx(TraitsMenuContent, {
        provider: provider,
        models: models,
        threadId: threadId,
        model: model,
        prompt: props?.prompt ?? "",
        modelOptions: providerOptions,
        onPromptChange: onPromptChange,
      }),
      onToggleInteractionMode: vi.fn(),
      onTogglePlanSidebar: vi.fn(),
      onToggleRuntimeMode: vi.fn(),
    }),
    { container: host },
  );
  const cleanup = async () => {
    await screen.unmount();
    host.remove();
  };
  return {
    [Symbol.asyncDispose]: cleanup,
    cleanup,
  };
}
describe("CompactComposerControlsMenu", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    useComposerDraftStore.setState({
      draftsByThreadId: {},
      draftThreadsByThreadId: {},
      projectDraftThreadIdByProjectId: {},
      stickyModelSelectionByProvider: {},
    });
  });
  it("shows fast mode controls for Opus", async () => {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const _ = __addDisposableResource(
        env_1,
        await mountMenu({
          modelSelection: { provider: "claudeAgent", model: "claude-opus-4-6" },
        }),
        true,
      );
      await page.getByLabelText("More composer controls").click();
      await vi.waitFor(() => {
        const text = document.body.textContent ?? "";
        expect(text).toContain("Fast Mode");
        expect(text).toContain("off");
        expect(text).toContain("on");
      });
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      const result_1 = __disposeResources(env_1);
      if (result_1) await result_1;
    }
  });
  it("hides fast mode controls for non-Opus Claude models", async () => {
    const env_2 = { stack: [], error: void 0, hasError: false };
    try {
      const _ = __addDisposableResource(
        env_2,
        await mountMenu({
          modelSelection: { provider: "claudeAgent", model: "claude-sonnet-4-6" },
        }),
        true,
      );
      await page.getByLabelText("More composer controls").click();
      await vi.waitFor(() => {
        expect(document.body.textContent ?? "").not.toContain("Fast Mode");
      });
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      const result_2 = __disposeResources(env_2);
      if (result_2) await result_2;
    }
  });
  it("shows only the provided effort options", async () => {
    const env_3 = { stack: [], error: void 0, hasError: false };
    try {
      const _ = __addDisposableResource(
        env_3,
        await mountMenu({
          modelSelection: { provider: "claudeAgent", model: "claude-sonnet-4-6" },
        }),
        true,
      );
      await page.getByLabelText("More composer controls").click();
      await vi.waitFor(() => {
        const text = document.body.textContent ?? "";
        expect(text).toContain("Low");
        expect(text).toContain("Medium");
        expect(text).toContain("High");
        expect(text).not.toContain("Max");
        expect(text).toContain("Ultrathink");
      });
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      const result_3 = __disposeResources(env_3);
      if (result_3) await result_3;
    }
  });
  it("shows a Claude thinking on/off section for Haiku", async () => {
    const env_4 = { stack: [], error: void 0, hasError: false };
    try {
      const _ = __addDisposableResource(
        env_4,
        await mountMenu({
          modelSelection: {
            provider: "claudeAgent",
            model: "claude-haiku-4-5",
            options: { thinking: true },
          },
        }),
        true,
      );
      await page.getByLabelText("More composer controls").click();
      await vi.waitFor(() => {
        const text = document.body.textContent ?? "";
        expect(text).toContain("Thinking");
        expect(text).toContain("On (default)");
        expect(text).toContain("Off");
      });
    } catch (e_4) {
      env_4.error = e_4;
      env_4.hasError = true;
    } finally {
      const result_4 = __disposeResources(env_4);
      if (result_4) await result_4;
    }
  });
  it("shows prompt-controlled Ultrathink state with selectable effort controls", async () => {
    const env_5 = { stack: [], error: void 0, hasError: false };
    try {
      const _ = __addDisposableResource(
        env_5,
        await mountMenu({
          modelSelection: {
            provider: "claudeAgent",
            model: "claude-opus-4-6",
            options: { effort: "high" },
          },
          prompt: "Ultrathink:\nInvestigate this",
        }),
        true,
      );
      await page.getByLabelText("More composer controls").click();
      await vi.waitFor(() => {
        const text = document.body.textContent ?? "";
        expect(text).toContain("Effort");
        expect(text).not.toContain("ultrathink");
      });
    } catch (e_5) {
      env_5.error = e_5;
      env_5.hasError = true;
    } finally {
      const result_5 = __disposeResources(env_5);
      if (result_5) await result_5;
    }
  });
  it("warns when ultrathink appears in prompt body text", async () => {
    const env_6 = { stack: [], error: void 0, hasError: false };
    try {
      const _ = __addDisposableResource(
        env_6,
        await mountMenu({
          modelSelection: {
            provider: "claudeAgent",
            model: "claude-opus-4-6",
            options: { effort: "high" },
          },
          prompt: "Ultrathink:\nplease ultrathink about this problem",
        }),
        true,
      );
      await page.getByLabelText("More composer controls").click();
      await vi.waitFor(() => {
        const text = document.body.textContent ?? "";
        expect(text).toContain(
          'Your prompt contains "ultrathink" in the text. Remove it to change effort.',
        );
      });
    } catch (e_6) {
      env_6.error = e_6;
      env_6.hasError = true;
    } finally {
      const result_6 = __disposeResources(env_6);
      if (result_6) await result_6;
    }
  });
});
