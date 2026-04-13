import * as Effect from "effect/Effect";
import { NetService } from "@t3tools/shared/Net";
export const DEFAULT_DESKTOP_BACKEND_PORT = 3773;
const MAX_TCP_PORT = 65_535;
const defaultCanListenOnHost = async (port, host) =>
  Effect.service(NetService).pipe(
    Effect.flatMap((net) => net.canListenOnHost(port, host)),
    Effect.provide(NetService.layer),
    Effect.runPromise,
  );
const isValidPort = (port) => Number.isInteger(port) && port >= 1 && port <= MAX_TCP_PORT;
const normalizeHosts = (host, requiredHosts) =>
  Array.from(
    new Set(
      [host, ...requiredHosts]
        .map((candidate) => candidate.trim())
        .filter((candidate) => candidate.length > 0),
    ),
  );
async function canListenOnAllHosts(port, hosts, canListenOnHost) {
  for (const candidateHost of hosts) {
    if (!(await canListenOnHost(port, candidateHost))) {
      return false;
    }
  }
  return true;
}
export async function resolveDesktopBackendPort({
  host,
  startPort = DEFAULT_DESKTOP_BACKEND_PORT,
  maxPort = MAX_TCP_PORT,
  requiredHosts = [],
  canListenOnHost = defaultCanListenOnHost,
}) {
  if (!isValidPort(startPort)) {
    throw new Error(`Invalid desktop backend start port: ${startPort}`);
  }
  if (!isValidPort(maxPort)) {
    throw new Error(`Invalid desktop backend max port: ${maxPort}`);
  }
  if (maxPort < startPort) {
    throw new Error(`Desktop backend max port ${maxPort} is below start port ${startPort}`);
  }
  const hostsToCheck = normalizeHosts(host, requiredHosts);
  // Keep desktop startup predictable across app restarts by probing upward from
  // the same preferred port instead of picking a fresh ephemeral port.
  for (let port = startPort; port <= maxPort; port += 1) {
    if (await canListenOnAllHosts(port, hostsToCheck, canListenOnHost)) {
      return port;
    }
  }
  throw new Error(
    `No desktop backend port is available on hosts ${hostsToCheck.join(", ")} between ${startPort} and ${maxPort}`,
  );
}
