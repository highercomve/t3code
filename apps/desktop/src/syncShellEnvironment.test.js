import { describe, expect, it, vi } from "vitest";
import { syncShellEnvironment } from "./syncShellEnvironment";
describe("syncShellEnvironment", () => {
  it("hydrates PATH and missing SSH_AUTH_SOCK from the login shell on macOS", () => {
    const env = {
      SHELL: "/bin/zsh",
      PATH: "/usr/bin",
    };
    const readEnvironment = vi.fn(() => ({
      PATH: "/opt/homebrew/bin:/usr/bin",
      SSH_AUTH_SOCK: "/tmp/secretive.sock",
    }));
    syncShellEnvironment(env, {
      platform: "darwin",
      readEnvironment,
    });
    expect(readEnvironment).toHaveBeenCalledWith("/bin/zsh", expect.any(Array));
    expect(env.PATH).toBe("/opt/homebrew/bin:/usr/bin");
    expect(env.SSH_AUTH_SOCK).toBe("/tmp/secretive.sock");
  });
  it("preserves an inherited SSH_AUTH_SOCK value", () => {
    const env = {
      SHELL: "/bin/zsh",
      PATH: "/usr/bin",
      SSH_AUTH_SOCK: "/tmp/inherited.sock",
    };
    const readEnvironment = vi.fn(() => ({
      PATH: "/opt/homebrew/bin:/usr/bin",
      SSH_AUTH_SOCK: "/tmp/login-shell.sock",
    }));
    syncShellEnvironment(env, {
      platform: "darwin",
      readEnvironment,
    });
    expect(env.PATH).toBe("/opt/homebrew/bin:/usr/bin");
    expect(env.SSH_AUTH_SOCK).toBe("/tmp/inherited.sock");
  });
  it("preserves inherited values when the login shell omits them", () => {
    const env = {
      SHELL: "/bin/zsh",
      PATH: "/usr/bin",
      SSH_AUTH_SOCK: "/tmp/inherited.sock",
    };
    const readEnvironment = vi.fn(() => ({
      PATH: "/opt/homebrew/bin:/usr/bin",
    }));
    syncShellEnvironment(env, {
      platform: "darwin",
      readEnvironment,
    });
    expect(env.PATH).toBe("/opt/homebrew/bin:/usr/bin");
    expect(env.SSH_AUTH_SOCK).toBe("/tmp/inherited.sock");
  });
  it("hydrates PATH and missing SSH_AUTH_SOCK from the login shell on linux", () => {
    const env = {
      SHELL: "/bin/zsh",
      PATH: "/usr/bin",
    };
    const readEnvironment = vi.fn(() => ({
      PATH: "/home/linuxbrew/.linuxbrew/bin:/usr/bin",
      SSH_AUTH_SOCK: "/tmp/secretive.sock",
    }));
    syncShellEnvironment(env, {
      platform: "linux",
      readEnvironment,
    });
    expect(readEnvironment).toHaveBeenCalledWith("/bin/zsh", expect.any(Array));
    expect(env.PATH).toBe("/home/linuxbrew/.linuxbrew/bin:/usr/bin");
    expect(env.SSH_AUTH_SOCK).toBe("/tmp/secretive.sock");
  });
  it("hydrates PATH and provider API keys from the login shell on Linux", () => {
    const env = {
      SHELL: "/bin/bash",
      PATH: "/usr/bin",
    };
    const readEnvironment = vi.fn(() => ({
      PATH: "/home/user/.local/bin:/usr/bin",
      OPENCODE_API_KEY: "oc-key-123",
      ANTHROPIC_API_KEY: "sk-ant-123",
    }));
    syncShellEnvironment(env, {
      platform: "linux",
      readEnvironment,
    });
    expect(readEnvironment).toHaveBeenCalled();
    expect(env.PATH).toBe("/home/user/.local/bin:/usr/bin");
    expect(env.OPENCODE_API_KEY).toBe("oc-key-123");
    expect(env.ANTHROPIC_API_KEY).toBe("sk-ant-123");
  });
  it("preserves existing API keys on Linux", () => {
    const env = {
      SHELL: "/bin/bash",
      PATH: "/usr/bin",
      OPENCODE_API_KEY: "existing-key",
    };
    const readEnvironment = vi.fn(() => ({
      PATH: "/home/user/.local/bin:/usr/bin",
      OPENCODE_API_KEY: "shell-key",
    }));
    syncShellEnvironment(env, {
      platform: "linux",
      readEnvironment,
    });
    expect(env.OPENCODE_API_KEY).toBe("existing-key");
  });
  it("does nothing outside macOS and linux", () => {
    const env = {
      SHELL: "C:/Program Files/Git/bin/bash.exe",
      PATH: "C:\\Windows\\System32",
      SSH_AUTH_SOCK: "/tmp/inherited.sock",
    };
    const readEnvironment = vi.fn(() => ({
      PATH: "/usr/local/bin:/usr/bin",
      SSH_AUTH_SOCK: "/tmp/secretive.sock",
    }));
    syncShellEnvironment(env, {
      platform: "win32",
      readEnvironment,
    });
    expect(readEnvironment).not.toHaveBeenCalled();
    expect(env.PATH).toBe("C:\\Windows\\System32");
    expect(env.SSH_AUTH_SOCK).toBe("/tmp/inherited.sock");
  });
});
