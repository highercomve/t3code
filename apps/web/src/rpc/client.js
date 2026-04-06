import { WsRpcGroup } from "@t3tools/contracts";
import { Layer, ManagedRuntime } from "effect";
import { AtomRpc } from "effect/unstable/reactivity";
import {
  __resetClientTracingForTests,
  ClientTracingLive,
  configureClientTracing,
} from "../observability/clientTracing";
import { createWsRpcProtocolLayer } from "./protocol";
export class WsRpcAtomClient extends AtomRpc.Service()("WsRpcAtomClient", {
  group: WsRpcGroup,
  protocol: Layer.suspend(() => createWsRpcProtocolLayer()),
}) {}
let sharedRuntime = null;
function getRuntime() {
  if (sharedRuntime !== null) {
    return sharedRuntime;
  }
  sharedRuntime = ManagedRuntime.make(Layer.mergeAll(WsRpcAtomClient.layer, ClientTracingLive));
  return sharedRuntime;
}
export function runRpc(execute) {
  return configureClientTracing().then(() => {
    const runtime = getRuntime();
    return runtime.runPromise(WsRpcAtomClient.use(execute));
  });
}
export async function __resetWsRpcAtomClientForTests() {
  const runtime = sharedRuntime;
  sharedRuntime = null;
  await runtime?.dispose();
  await __resetClientTracingForTests();
}
