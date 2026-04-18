import { Effect, Schema } from "effect";
import { EnvironmentId, ProjectId, ThreadId, TrimmedNonEmptyString } from "./baseSchemas";
export const ExecutionEnvironmentPlatformOs = Schema.Literals([
  "darwin",
  "linux",
  "windows",
  "unknown",
]);
export const ExecutionEnvironmentPlatformArch = Schema.Literals(["arm64", "x64", "other"]);
export const ExecutionEnvironmentPlatform = Schema.Struct({
  os: ExecutionEnvironmentPlatformOs,
  arch: ExecutionEnvironmentPlatformArch,
});
export const ExecutionEnvironmentCapabilities = Schema.Struct({
  repositoryIdentity: Schema.Boolean.pipe(Schema.withDecodingDefault(Effect.succeed(false))),
});
export const ExecutionEnvironmentDescriptor = Schema.Struct({
  environmentId: EnvironmentId,
  label: TrimmedNonEmptyString,
  platform: ExecutionEnvironmentPlatform,
  serverVersion: TrimmedNonEmptyString,
  capabilities: ExecutionEnvironmentCapabilities,
});
export const EnvironmentConnectionState = Schema.Literals([
  "connecting",
  "connected",
  "disconnected",
  "error",
]);
export const RepositoryIdentityLocator = Schema.Struct({
  source: Schema.Literal("git-remote"),
  remoteName: TrimmedNonEmptyString,
  remoteUrl: TrimmedNonEmptyString,
});
export const RepositoryIdentity = Schema.Struct({
  canonicalKey: TrimmedNonEmptyString,
  locator: RepositoryIdentityLocator,
  displayName: Schema.optionalKey(TrimmedNonEmptyString),
  provider: Schema.optionalKey(TrimmedNonEmptyString),
  owner: Schema.optionalKey(TrimmedNonEmptyString),
  name: Schema.optionalKey(TrimmedNonEmptyString),
});
export const ScopedProjectRef = Schema.Struct({
  environmentId: EnvironmentId,
  projectId: ProjectId,
});
export const ScopedThreadRef = Schema.Struct({
  environmentId: EnvironmentId,
  threadId: ThreadId,
});
export const ScopedThreadSessionRef = Schema.Struct({
  environmentId: EnvironmentId,
  threadId: ThreadId,
});
