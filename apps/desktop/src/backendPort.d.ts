export declare const DEFAULT_DESKTOP_BACKEND_PORT = 3773;
export interface ResolveDesktopBackendPortOptions {
  readonly host: string;
  readonly startPort?: number;
  readonly maxPort?: number;
  readonly requiredHosts?: ReadonlyArray<string>;
  readonly canListenOnHost?: (port: number, host: string) => Promise<boolean>;
}
export declare function resolveDesktopBackendPort({
  host,
  startPort,
  maxPort,
  requiredHosts,
  canListenOnHost,
}: ResolveDesktopBackendPortOptions): Promise<number>;
