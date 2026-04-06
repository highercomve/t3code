import { Layer } from "effect";
export interface ClientTracingConfig {
  readonly exportIntervalMs?: number;
}
export declare const ClientTracingLive: Layer.Layer<never, never, never>;
export declare function configureClientTracing(config?: ClientTracingConfig): Promise<void>;
export declare function __resetClientTracingForTests(): Promise<void>;
