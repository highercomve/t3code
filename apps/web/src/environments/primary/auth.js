import {
  getPairingTokenFromUrl,
  stripPairingTokenFromUrl as stripPairingTokenUrl,
} from "../../pairingUrl";
import { resolvePrimaryEnvironmentHttpUrl } from "./target";
import { Data, Predicate } from "effect";
export class BootstrapHttpError extends Data.TaggedError("BootstrapHttpError") {}
const isBootstrapHttpError = (u) => Predicate.isTagged(u, "BootstrapHttpError");
let bootstrapPromise = null;
let resolvedAuthenticatedGateState = null;
const AUTH_SESSION_ESTABLISH_TIMEOUT_MS = 2_000;
const AUTH_SESSION_ESTABLISH_STEP_MS = 100;
export function peekPairingTokenFromUrl() {
  return getPairingTokenFromUrl(new URL(window.location.href));
}
export function stripPairingTokenFromUrl() {
  const url = new URL(window.location.href);
  const next = stripPairingTokenUrl(url);
  if (next.toString() === url.toString()) {
    return;
  }
  window.history.replaceState({}, document.title, next.toString());
}
export function takePairingTokenFromUrl() {
  const token = peekPairingTokenFromUrl();
  if (!token) {
    return null;
  }
  stripPairingTokenFromUrl();
  return token;
}
function getDesktopBootstrapCredential() {
  const bootstrap = window.desktopBridge?.getLocalEnvironmentBootstrap();
  return typeof bootstrap?.bootstrapToken === "string" && bootstrap.bootstrapToken.length > 0
    ? bootstrap.bootstrapToken
    : null;
}
export async function fetchSessionState() {
  return retryTransientBootstrap(async () => {
    const response = await fetch(resolvePrimaryEnvironmentHttpUrl("/api/auth/session"), {
      credentials: "include",
    });
    if (!response.ok) {
      throw new BootstrapHttpError({
        message: `Failed to load server auth session state (${response.status}).`,
        status: response.status,
      });
    }
    return await response.json();
  });
}
async function readErrorMessage(response, fallbackMessage) {
  const text = await response.text();
  return text || fallbackMessage;
}
async function exchangeBootstrapCredential(credential) {
  return retryTransientBootstrap(async () => {
    const payload = { credential };
    const response = await fetch(resolvePrimaryEnvironmentHttpUrl("/api/auth/bootstrap"), {
      body: JSON.stringify(payload),
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });
    if (!response.ok) {
      const message = await response.text();
      throw new BootstrapHttpError({
        message: message || `Failed to bootstrap auth session (${response.status}).`,
        status: response.status,
      });
    }
    return await response.json();
  });
}
async function waitForAuthenticatedSessionAfterBootstrap() {
  const startedAt = Date.now();
  while (true) {
    const session = await fetchSessionState();
    if (session.authenticated) {
      return session;
    }
    if (Date.now() - startedAt >= AUTH_SESSION_ESTABLISH_TIMEOUT_MS) {
      throw new Error("Timed out waiting for authenticated session after bootstrap.");
    }
    await waitForBootstrapRetry(AUTH_SESSION_ESTABLISH_STEP_MS);
  }
}
const TRANSIENT_BOOTSTRAP_STATUS_CODES = new Set([502, 503, 504]);
const BOOTSTRAP_RETRY_TIMEOUT_MS = 15_000;
const BOOTSTRAP_RETRY_STEP_MS = 500;
export async function retryTransientBootstrap(operation) {
  const startedAt = Date.now();
  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (!isTransientBootstrapError(error)) {
        throw error;
      }
      if (Date.now() - startedAt >= BOOTSTRAP_RETRY_TIMEOUT_MS) {
        throw error;
      }
      await waitForBootstrapRetry(BOOTSTRAP_RETRY_STEP_MS);
    }
  }
}
function waitForBootstrapRetry(delayMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}
function isTransientBootstrapError(error) {
  if (isBootstrapHttpError(error)) {
    return TRANSIENT_BOOTSTRAP_STATUS_CODES.has(error.status);
  }
  if (error instanceof TypeError) {
    return true;
  }
  return error instanceof DOMException && error.name === "AbortError";
}
async function bootstrapServerAuth() {
  const bootstrapCredential = getDesktopBootstrapCredential();
  const currentSession = await fetchSessionState();
  if (currentSession.authenticated) {
    return { status: "authenticated" };
  }
  if (!bootstrapCredential) {
    return {
      status: "requires-auth",
      auth: currentSession.auth,
    };
  }
  try {
    await exchangeBootstrapCredential(bootstrapCredential);
    await waitForAuthenticatedSessionAfterBootstrap();
    return { status: "authenticated" };
  } catch (error) {
    return {
      status: "requires-auth",
      auth: currentSession.auth,
      errorMessage: error instanceof Error ? error.message : "Authentication failed.",
    };
  }
}
export async function submitServerAuthCredential(credential) {
  const trimmedCredential = credential.trim();
  if (!trimmedCredential) {
    throw new Error("Enter a pairing token to continue.");
  }
  resolvedAuthenticatedGateState = null;
  await exchangeBootstrapCredential(trimmedCredential);
  bootstrapPromise = null;
  stripPairingTokenFromUrl();
}
export async function createServerPairingCredential(label) {
  const trimmedLabel = label?.trim();
  const payload = trimmedLabel ? { label: trimmedLabel } : {};
  const response = await fetch(resolvePrimaryEnvironmentHttpUrl("/api/auth/pairing-token"), {
    body: JSON.stringify(payload),
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, `Failed to create pairing credential (${response.status}).`),
    );
  }
  return await response.json();
}
export async function listServerPairingLinks() {
  const response = await fetch(resolvePrimaryEnvironmentHttpUrl("/api/auth/pairing-links"), {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, `Failed to load pairing links (${response.status}).`),
    );
  }
  return await response.json();
}
export async function revokeServerPairingLink(id) {
  const payload = { id };
  const response = await fetch(resolvePrimaryEnvironmentHttpUrl("/api/auth/pairing-links/revoke"), {
    body: JSON.stringify(payload),
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, `Failed to revoke pairing link (${response.status}).`),
    );
  }
}
export async function listServerClientSessions() {
  const response = await fetch(resolvePrimaryEnvironmentHttpUrl("/api/auth/clients"), {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, `Failed to load paired clients (${response.status}).`),
    );
  }
  return await response.json();
}
export async function revokeServerClientSession(sessionId) {
  const payload = { sessionId };
  const response = await fetch(resolvePrimaryEnvironmentHttpUrl("/api/auth/clients/revoke"), {
    body: JSON.stringify(payload),
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, `Failed to revoke client session (${response.status}).`),
    );
  }
}
export async function revokeOtherServerClientSessions() {
  const response = await fetch(
    resolvePrimaryEnvironmentHttpUrl("/api/auth/clients/revoke-others"),
    {
      credentials: "include",
      method: "POST",
    },
  );
  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        `Failed to revoke other client sessions (${response.status}).`,
      ),
    );
  }
  const result = await response.json();
  return result.revokedCount ?? 0;
}
export async function resolveInitialServerAuthGateState() {
  if (resolvedAuthenticatedGateState?.status === "authenticated") {
    return resolvedAuthenticatedGateState;
  }
  if (bootstrapPromise) {
    return bootstrapPromise;
  }
  const nextPromise = bootstrapServerAuth();
  bootstrapPromise = nextPromise;
  return nextPromise
    .then((result) => {
      if (result.status === "authenticated") {
        resolvedAuthenticatedGateState = result;
      }
      return result;
    })
    .finally(() => {
      if (bootstrapPromise === nextPromise) {
        bootstrapPromise = null;
      }
    });
}
export function __resetServerAuthBootstrapForTests() {
  bootstrapPromise = null;
  resolvedAuthenticatedGateState = null;
}
