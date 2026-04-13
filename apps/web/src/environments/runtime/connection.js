function createBootstrapGate() {
  let resolve = null;
  let reject = null;
  let promise = new Promise((nextResolve, nextReject) => {
    resolve = nextResolve;
    reject = nextReject;
  });
  return {
    wait: () => promise,
    resolve: () => {
      resolve?.();
      resolve = null;
      reject = null;
    },
    reject: (error) => {
      reject?.(error);
      resolve = null;
      reject = null;
    },
    reset: () => {
      promise = new Promise((nextResolve, nextReject) => {
        resolve = nextResolve;
        reject = nextReject;
      });
    },
  };
}
export function createEnvironmentConnection(input) {
  const environmentId = input.knownEnvironment.environmentId;
  if (!environmentId) {
    throw new Error(
      `Known environment ${input.knownEnvironment.label} is missing its environmentId.`,
    );
  }
  let disposed = false;
  const bootstrapGate = createBootstrapGate();
  const observeEnvironmentIdentity = (nextEnvironmentId, source) => {
    if (environmentId !== nextEnvironmentId) {
      throw new Error(
        `Environment connection ${environmentId} changed identity to ${nextEnvironmentId} via ${source}.`,
      );
    }
  };
  const unsubLifecycle = input.client.server.subscribeLifecycle((event) => {
    if (event.type !== "welcome") {
      return;
    }
    observeEnvironmentIdentity(event.payload.environment.environmentId, "server lifecycle welcome");
    input.onWelcome?.(event.payload);
  });
  const unsubConfig = input.client.server.subscribeConfig((event) => {
    if (event.type !== "snapshot") {
      return;
    }
    observeEnvironmentIdentity(event.config.environment.environmentId, "server config snapshot");
    input.onConfigSnapshot?.(event.config);
  });
  const unsubShell = input.client.orchestration.subscribeShell(
    (item) => {
      if (item.kind === "snapshot") {
        input.syncShellSnapshot(item.snapshot, environmentId);
        bootstrapGate.resolve();
        return;
      }
      input.applyShellEvent(item, environmentId);
    },
    {
      onResubscribe: () => {
        if (disposed) {
          return;
        }
        bootstrapGate.reset();
      },
    },
  );
  const unsubTerminalEvent = input.client.terminal.onEvent((event) => {
    input.applyTerminalEvent(event, environmentId);
  });
  const cleanup = () => {
    disposed = true;
    unsubShell();
    unsubTerminalEvent();
    unsubLifecycle();
    unsubConfig();
  };
  return {
    kind: input.kind,
    environmentId,
    knownEnvironment: input.knownEnvironment,
    client: input.client,
    ensureBootstrapped: () => bootstrapGate.wait(),
    reconnect: async () => {
      bootstrapGate.reset();
      try {
        await input.client.reconnect();
        await input.refreshMetadata?.();
        await bootstrapGate.wait();
      } catch (error) {
        bootstrapGate.reject(error);
        throw error;
      }
    },
    dispose: async () => {
      cleanup();
      await input.client.dispose();
    },
  };
}
