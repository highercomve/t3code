import { Schema } from "effect";
import { IsoDateTime, TrimmedNonEmptyString } from "./baseSchemas";
import { KeybindingRule, ResolvedKeybindingsConfig } from "./keybindings";
import { EditorId } from "./editor";
import { ModelCapabilities } from "./model";
import { ProviderKind } from "./orchestration";
import { ServerSettings } from "./settings";
const KeybindingsMalformedConfigIssue = Schema.Struct({
  kind: Schema.Literal("keybindings.malformed-config"),
  message: TrimmedNonEmptyString,
});
const KeybindingsInvalidEntryIssue = Schema.Struct({
  kind: Schema.Literal("keybindings.invalid-entry"),
  message: TrimmedNonEmptyString,
  index: Schema.Number,
});
export const ServerConfigIssue = Schema.Union([
  KeybindingsMalformedConfigIssue,
  KeybindingsInvalidEntryIssue,
]);
const ServerConfigIssues = Schema.Array(ServerConfigIssue);
export const ServerProviderState = Schema.Literals(["ready", "warning", "error", "disabled"]);
export const ServerProviderAuthStatus = Schema.Literals([
  "authenticated",
  "unauthenticated",
  "unknown",
]);
export const ServerProviderModel = Schema.Struct({
  slug: TrimmedNonEmptyString,
  name: TrimmedNonEmptyString,
  isCustom: Schema.Boolean,
  capabilities: Schema.NullOr(ModelCapabilities),
});
export const ServerProvider = Schema.Struct({
  provider: ProviderKind,
  enabled: Schema.Boolean,
  installed: Schema.Boolean,
  version: Schema.NullOr(TrimmedNonEmptyString),
  status: ServerProviderState,
  authStatus: ServerProviderAuthStatus,
  checkedAt: IsoDateTime,
  message: Schema.optional(TrimmedNonEmptyString),
  models: Schema.Array(ServerProviderModel),
});
const ServerProviders = Schema.Array(ServerProvider);
export const ServerConfig = Schema.Struct({
  cwd: TrimmedNonEmptyString,
  keybindingsConfigPath: TrimmedNonEmptyString,
  keybindings: ResolvedKeybindingsConfig,
  issues: ServerConfigIssues,
  providers: ServerProviders,
  availableEditors: Schema.Array(EditorId),
  settings: ServerSettings,
});
export const ServerUpsertKeybindingInput = KeybindingRule;
export const ServerUpsertKeybindingResult = Schema.Struct({
  keybindings: ResolvedKeybindingsConfig,
  issues: ServerConfigIssues,
});
export const ServerConfigUpdatedPayload = Schema.Struct({
  issues: ServerConfigIssues,
  settings: Schema.optional(ServerSettings),
});
export const ServerProviderUpdatedPayload = Schema.Struct({
  providers: ServerProviders,
});
