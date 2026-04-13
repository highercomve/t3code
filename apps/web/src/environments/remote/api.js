class RemoteEnvironmentAuthHttpError extends Error {
  status;
  constructor(message, status) {
    super(message);
    this.name = "RemoteEnvironmentAuthHttpError";
    this.status = status;
  }
}
function remoteEndpointUrl(httpBaseUrl, pathname) {
  const url = new URL(httpBaseUrl);
  url.pathname = pathname;
  url.search = "";
  url.hash = "";
  return url.toString();
}
async function readRemoteAuthErrorMessage(response, fallbackMessage) {
  const text = await response.text();
  if (!text) {
    return fallbackMessage;
  }
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed.error === "string" && parsed.error.length > 0) {
      return parsed.error;
    }
  } catch {
    // Fall back to raw text below.
  }
  return text;
}
async function fetchRemoteJson(input) {
  const requestUrl = remoteEndpointUrl(input.httpBaseUrl, input.pathname);
  let response;
  try {
    response = await fetch(requestUrl, {
      method: input.method ?? "GET",
      headers: {
        ...(input.body !== undefined ? { "content-type": "application/json" } : {}),
        ...(input.bearerToken ? { authorization: `Bearer ${input.bearerToken}` } : {}),
      },
      ...(input.body !== undefined ? { body: JSON.stringify(input.body) } : {}),
    });
  } catch (error) {
    throw new Error(`Failed to fetch remote auth endpoint ${requestUrl} (${error.message}).`, {
      cause: error,
    });
  }
  if (!response.ok) {
    throw new RemoteEnvironmentAuthHttpError(
      await readRemoteAuthErrorMessage(
        response,
        `Remote auth request failed (${response.status}).`,
      ),
      response.status,
    );
  }
  return await response.json();
}
export async function bootstrapRemoteBearerSession(input) {
  return fetchRemoteJson({
    httpBaseUrl: input.httpBaseUrl,
    pathname: "/api/auth/bootstrap/bearer",
    method: "POST",
    body: {
      credential: input.credential,
    },
  });
}
export async function fetchRemoteSessionState(input) {
  return fetchRemoteJson({
    httpBaseUrl: input.httpBaseUrl,
    pathname: "/api/auth/session",
    bearerToken: input.bearerToken,
  });
}
export async function fetchRemoteEnvironmentDescriptor(input) {
  return fetchRemoteJson({
    httpBaseUrl: input.httpBaseUrl,
    pathname: "/.well-known/t3/environment",
  });
}
export async function issueRemoteWebSocketToken(input) {
  return fetchRemoteJson({
    httpBaseUrl: input.httpBaseUrl,
    pathname: "/api/auth/ws-token",
    method: "POST",
    bearerToken: input.bearerToken,
  });
}
export async function resolveRemoteWebSocketConnectionUrl(input) {
  const issued = await issueRemoteWebSocketToken({
    httpBaseUrl: input.httpBaseUrl,
    bearerToken: input.bearerToken,
  });
  const url = new URL(input.wsBaseUrl, window.location.origin);
  url.searchParams.set("wsToken", issued.token);
  return url.toString();
}
