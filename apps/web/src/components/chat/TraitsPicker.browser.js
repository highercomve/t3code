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
import "../../index.css";
import {
  DEFAULT_MODEL_BY_PROVIDER,
  DEFAULT_SERVER_SETTINGS,
  ProjectId,
  ThreadId,
} from "@t3tools/contracts";
import { page } from "vitest/browser";
import { useCallback } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { TraitsPicker } from "./TraitsPicker";
import {
  COMPOSER_DRAFT_STORAGE_KEY,
  useComposerDraftStore,
  useComposerThreadDraft,
  useEffectiveComposerModelState,
} from "../../composerDraftStore";
import { DEFAULT_CLIENT_SETTINGS } from "@t3tools/contracts/settings";
// ── Claude TraitsPicker tests ─────────────────────────────────────────
const CLAUDE_THREAD_ID = ThreadId.makeUnsafe("thread-claude-traits");
const TEST_PROVIDERS = [
  {
    provider: "codex",
    enabled: true,
    installed: true,
    version: "0.1.0",
    status: "ready",
    auth: { status: "authenticated" },
    checkedAt: "2026-01-01T00:00:00.000Z",
    models: [
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
    ],
  },
  {
    provider: "claudeAgent",
    enabled: true,
    installed: true,
    version: "0.1.0",
    status: "ready",
    auth: { status: "authenticated" },
    checkedAt: "2026-01-01T00:00:00.000Z",
    models: [
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
    ],
  },
];
function ClaudeTraitsPickerHarness(props) {
  const prompt = useComposerThreadDraft(CLAUDE_THREAD_ID).prompt;
  const setPrompt = useComposerDraftStore((store) => store.setPrompt);
  const { modelOptions, selectedModel } = useEffectiveComposerModelState({
    threadId: CLAUDE_THREAD_ID,
    providers: TEST_PROVIDERS,
    selectedProvider: "claudeAgent",
    threadModelSelection: props.fallbackModelSelection,
    projectModelSelection: null,
    settings: {
      ...DEFAULT_SERVER_SETTINGS,
      ...DEFAULT_CLIENT_SETTINGS,
    },
  });
  const handlePromptChange = useCallback(
    (nextPrompt) => {
      setPrompt(CLAUDE_THREAD_ID, nextPrompt);
    },
    [setPrompt],
  );
  return _jsx(TraitsPicker, {
    provider: "claudeAgent",
    models: TEST_PROVIDERS[1].models,
    threadId: CLAUDE_THREAD_ID,
    model: selectedModel ?? props.model,
    prompt: prompt,
    modelOptions: modelOptions?.claudeAgent,
    onPromptChange: handlePromptChange,
    triggerVariant: props.triggerVariant,
  });
}
async function mountClaudePicker(props) {
  const model = props?.model ?? "claude-opus-4-6";
  const claudeOptions = !props?.skipDraftModelOptions ? props?.options : undefined;
  const draftsByThreadId = {
    [CLAUDE_THREAD_ID]: {
      prompt: props?.prompt ?? "",
      images: [],
      nonPersistedImageIds: [],
      persistedAttachments: [],
      terminalContexts: [],
      modelSelectionByProvider: props?.skipDraftModelOptions
        ? {}
        : {
            claudeAgent: {
              provider: "claudeAgent",
              model,
              ...(claudeOptions && Object.keys(claudeOptions).length > 0
                ? { options: claudeOptions }
                : {}),
            },
          },
      activeProvider: "claudeAgent",
      runtimeMode: null,
      interactionMode: null,
    },
  };
  useComposerDraftStore.setState({
    draftsByThreadId,
    draftThreadsByThreadId: {},
    projectDraftThreadIdByProjectId: {},
  });
  const host = document.createElement("div");
  document.body.append(host);
  const fallbackModelSelection =
    props?.fallbackModelOptions !== undefined
      ? {
          provider: "claudeAgent",
          model,
          ...(props.fallbackModelOptions ? { options: props.fallbackModelOptions } : {}),
        }
      : null;
  const screen = await render(
    _jsx(ClaudeTraitsPickerHarness, {
      model: model,
      fallbackModelSelection: fallbackModelSelection,
      ...(props?.triggerVariant ? { triggerVariant: props.triggerVariant } : {}),
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
describe("TraitsPicker (Claude)", () => {
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
      const _ = __addDisposableResource(env_1, await mountClaudePicker(), true);
      await page.getByRole("button").click();
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
  it("hides fast mode controls for non-Opus models", async () => {
    const env_2 = { stack: [], error: void 0, hasError: false };
    try {
      const _ = __addDisposableResource(
        env_2,
        await mountClaudePicker({ model: "claude-sonnet-4-6" }),
        true,
      );
      await page.getByRole("button").click();
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
        await mountClaudePicker({
          model: "claude-sonnet-4-6",
        }),
        true,
      );
      await page.getByRole("button").click();
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
  it("shows a th  inking on/off dropdown for Haiku", async () => {
    const env_4 = { stack: [], error: void 0, hasError: false };
    try {
      const _ = __addDisposableResource(
        env_4,
        await mountClaudePicker({
          model: "claude-haiku-4-5",
          options: { thinking: true },
        }),
        true,
      );
      await vi.waitFor(() => {
        expect(document.body.textContent ?? "").toContain("Thinking On");
      });
      await page.getByRole("button").click();
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
        await mountClaudePicker({
          model: "claude-opus-4-6",
          options: { effort: "high" },
          prompt: "Ultrathink:\nInvestigate this",
        }),
        true,
      );
      await vi.waitFor(() => {
        expect(document.body.textContent ?? "").toContain("Ultrathink");
        expect(document.body.textContent ?? "").not.toContain("Ultrathink · Prompt");
      });
      await page.getByRole("button").click();
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
        await mountClaudePicker({
          model: "claude-opus-4-6",
          options: { effort: "high" },
          prompt: "Ultrathink:\nplease ultrathink about this problem",
        }),
        true,
      );
      await page.getByRole("button").click();
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
  it("persists sticky claude model options when traits change", async () => {
    const env_7 = { stack: [], error: void 0, hasError: false };
    try {
      const _ = __addDisposableResource(
        env_7,
        await mountClaudePicker({
          model: "claude-opus-4-6",
          options: { effort: "medium", fastMode: false },
        }),
        true,
      );
      await page.getByRole("button").click();
      await page.getByRole("menuitemradio", { name: "Max" }).click();
      expect(
        useComposerDraftStore.getState().stickyModelSelectionByProvider.claudeAgent,
      ).toMatchObject({
        provider: "claudeAgent",
        options: {
          effort: "max",
        },
      });
    } catch (e_7) {
      env_7.error = e_7;
      env_7.hasError = true;
    } finally {
      const result_7 = __disposeResources(env_7);
      if (result_7) await result_7;
    }
  });
  it("accepts outline trigger styling", async () => {
    const env_8 = { stack: [], error: void 0, hasError: false };
    try {
      const _ = __addDisposableResource(
        env_8,
        await mountClaudePicker({
          triggerVariant: "outline",
        }),
        true,
      );
      const button = document.querySelector("button");
      if (!(button instanceof HTMLButtonElement)) {
        throw new Error("Expected traits trigger button to be rendered.");
      }
      expect(button.className).toContain("border-input");
      expect(button.className).toContain("bg-popover");
    } catch (e_8) {
      env_8.error = e_8;
      env_8.hasError = true;
    } finally {
      const result_8 = __disposeResources(env_8);
      if (result_8) await result_8;
    }
  });
});
// ── Codex TraitsPicker tests ──────────────────────────────────────────
async function mountCodexPicker(props) {
  const threadId = ThreadId.makeUnsafe("thread-codex-traits");
  const model = props.model ?? DEFAULT_MODEL_BY_PROVIDER.codex;
  const draftsByThreadId = {
    [threadId]: {
      prompt: "",
      images: [],
      nonPersistedImageIds: [],
      persistedAttachments: [],
      terminalContexts: [],
      modelSelectionByProvider: {
        codex: {
          provider: "codex",
          model,
          ...(props.options ? { options: props.options } : {}),
        },
      },
      activeProvider: "codex",
      runtimeMode: null,
      interactionMode: null,
    },
  };
  useComposerDraftStore.setState({
    draftsByThreadId,
    draftThreadsByThreadId: {},
    projectDraftThreadIdByProjectId: {
      [ProjectId.makeUnsafe("project-codex-traits")]: threadId,
    },
  });
  const host = document.createElement("div");
  document.body.append(host);
  const screen = await render(
    _jsx(TraitsPicker, {
      provider: "codex",
      models: TEST_PROVIDERS[0].models,
      threadId: threadId,
      model: props.model ?? DEFAULT_MODEL_BY_PROVIDER.codex,
      prompt: "",
      modelOptions: props.options,
      onPromptChange: () => {},
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
describe("TraitsPicker (Codex)", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    localStorage.removeItem(COMPOSER_DRAFT_STORAGE_KEY);
    useComposerDraftStore.setState({
      draftsByThreadId: {},
      draftThreadsByThreadId: {},
      projectDraftThreadIdByProjectId: {},
      stickyModelSelectionByProvider: {},
    });
  });
  it("shows fast mode controls", async () => {
    const env_9 = { stack: [], error: void 0, hasError: false };
    try {
      const _ = __addDisposableResource(
        env_9,
        await mountCodexPicker({
          options: { fastMode: false },
        }),
        true,
      );
      await page.getByRole("button").click();
      await vi.waitFor(() => {
        const text = document.body.textContent ?? "";
        expect(text).toContain("Fast Mode");
        expect(text).toContain("off");
        expect(text).toContain("on");
      });
    } catch (e_9) {
      env_9.error = e_9;
      env_9.hasError = true;
    } finally {
      const result_9 = __disposeResources(env_9);
      if (result_9) await result_9;
    }
  });
  it("shows Fast in the trigger label when fast mode is active", async () => {
    const env_10 = { stack: [], error: void 0, hasError: false };
    try {
      const _ = __addDisposableResource(
        env_10,
        await mountCodexPicker({
          options: { fastMode: true },
        }),
        true,
      );
      await vi.waitFor(() => {
        expect(document.body.textContent ?? "").toContain("High · Fast");
      });
    } catch (e_10) {
      env_10.error = e_10;
      env_10.hasError = true;
    } finally {
      const result_10 = __disposeResources(env_10);
      if (result_10) await result_10;
    }
  });
  it("shows only the provided effort options", async () => {
    const env_11 = { stack: [], error: void 0, hasError: false };
    try {
      const _ = __addDisposableResource(
        env_11,
        await mountCodexPicker({
          options: { fastMode: false },
        }),
        true,
      );
      await page.getByRole("button").click();
      await vi.waitFor(() => {
        const text = document.body.textContent ?? "";
        expect(text).toContain("Extra High");
        expect(text).toContain("High");
        expect(text).not.toContain("Low");
        expect(text).not.toContain("Medium");
      });
    } catch (e_11) {
      env_11.error = e_11;
      env_11.hasError = true;
    } finally {
      const result_11 = __disposeResources(env_11);
      if (result_11) await result_11;
    }
  });
  it("persists sticky codex model options when traits change", async () => {
    const env_12 = { stack: [], error: void 0, hasError: false };
    try {
      const _ = __addDisposableResource(
        env_12,
        await mountCodexPicker({
          options: { fastMode: false },
        }),
        true,
      );
      await page.getByRole("button").click();
      await page.getByRole("menuitemradio", { name: "on" }).click();
      expect(useComposerDraftStore.getState().stickyModelSelectionByProvider.codex).toMatchObject({
        provider: "codex",
        options: { fastMode: true },
      });
    } catch (e_12) {
      env_12.error = e_12;
      env_12.hasError = true;
    } finally {
      const result_12 = __disposeResources(env_12);
      if (result_12) await result_12;
    }
  });
});
