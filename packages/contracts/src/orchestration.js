import { Option, Schema, SchemaIssue, Struct } from "effect";
import { ClaudeModelOptions, CodexModelOptions, GeminiModelOptions, OpencodeModelOptions, } from "./model";
import { ApprovalRequestId, CheckpointRef, CommandId, EventId, IsoDateTime, MessageId, NonNegativeInt, ProjectId, ProviderItemId, ThreadId, TrimmedNonEmptyString, TurnId, } from "./baseSchemas";
export const ORCHESTRATION_WS_METHODS = {
    getSnapshot: "orchestration.getSnapshot",
    dispatchCommand: "orchestration.dispatchCommand",
    getTurnDiff: "orchestration.getTurnDiff",
    getFullThreadDiff: "orchestration.getFullThreadDiff",
    replayEvents: "orchestration.replayEvents",
};
export const ORCHESTRATION_WS_CHANNELS = {
    domainEvent: "orchestration.domainEvent",
};
export const PROVIDER_CODEX = "codex";
export const PROVIDER_GEMINI = "gemini";
export const PROVIDER_CLAUDE_AGENT = "claudeAgent";
export const PROVIDER_OPENCODE = "opencode";
const PROVIDER_KIND_VALUES = [
    PROVIDER_CODEX,
    PROVIDER_GEMINI,
    PROVIDER_CLAUDE_AGENT,
    PROVIDER_OPENCODE,
];
export const ProviderKind = Schema.Literals(PROVIDER_KIND_VALUES);
export const PROVIDER_KIND_SET = new Set(PROVIDER_KIND_VALUES);
export function isProviderKind(value) {
    return PROVIDER_KIND_SET.has(value);
}
export const DEFAULT_PROVIDER = PROVIDER_GEMINI;
export const ProviderApprovalPolicy = Schema.Literals([
    "untrusted",
    "on-failure",
    "on-request",
    "never",
]);
export const ProviderSandboxMode = Schema.Literals([
    "read-only",
    "workspace-write",
    "danger-full-access",
]);
export const DEFAULT_PROVIDER_KIND = "codex";
export const CodexProviderStartOptions = Schema.Struct({
    binaryPath: Schema.optional(TrimmedNonEmptyString),
    homePath: Schema.optional(TrimmedNonEmptyString),
});
export const ClaudeProviderStartOptions = Schema.Struct({
    binaryPath: Schema.optional(TrimmedNonEmptyString),
    permissionMode: Schema.optional(TrimmedNonEmptyString),
    maxThinkingTokens: Schema.optional(NonNegativeInt),
});
export const GeminiProviderStartOptions = Schema.Struct({
    binaryPath: Schema.optional(TrimmedNonEmptyString),
    homePath: Schema.optional(TrimmedNonEmptyString),
});
export const OpencodeProviderStartOptions = Schema.Struct({
    binaryPath: Schema.optional(TrimmedNonEmptyString),
    apiKey: Schema.optional(TrimmedNonEmptyString),
});
export const ProviderStartOptions = Schema.Struct({
    codex: Schema.optional(CodexProviderStartOptions),
    gemini: Schema.optional(GeminiProviderStartOptions),
    claudeAgent: Schema.optional(ClaudeProviderStartOptions),
    opencode: Schema.optional(OpencodeProviderStartOptions),
});
export const CodexModelSelection = Schema.Struct({
    provider: Schema.Literal("codex"),
    model: TrimmedNonEmptyString,
    options: Schema.optionalKey(CodexModelOptions),
});
export const GeminiModelSelection = Schema.Struct({
    provider: Schema.Literal("gemini"),
    model: TrimmedNonEmptyString,
    options: Schema.optionalKey(GeminiModelOptions),
});
export const ClaudeModelSelection = Schema.Struct({
    provider: Schema.Literal("claudeAgent"),
    model: TrimmedNonEmptyString,
    options: Schema.optionalKey(ClaudeModelOptions),
});
export const OpencodeModelSelection = Schema.Struct({
    provider: Schema.Literal("opencode"),
    model: TrimmedNonEmptyString,
    options: Schema.optionalKey(OpencodeModelOptions),
});
export const ModelSelection = Schema.Union([
    CodexModelSelection,
    GeminiModelSelection,
    ClaudeModelSelection,
    OpencodeModelSelection,
]);
export const RuntimeMode = Schema.Literals(["approval-required", "full-access"]);
export const DEFAULT_RUNTIME_MODE = "full-access";
export const ProviderInteractionMode = Schema.Literals(["default", "plan"]);
export const DEFAULT_PROVIDER_INTERACTION_MODE = "default";
export const ProviderRequestKind = Schema.Literals(["command", "file-read", "file-change"]);
export const AssistantDeliveryMode = Schema.Literals(["buffered", "streaming"]);
export const ProviderApprovalDecision = Schema.Literals([
    "accept",
    "acceptForSession",
    "decline",
    "cancel",
]);
export const ProviderUserInputAnswers = Schema.Record(Schema.String, Schema.Unknown);
export const PROVIDER_SEND_TURN_MAX_INPUT_CHARS = 120_000;
export const PROVIDER_SEND_TURN_MAX_ATTACHMENTS = 8;
export const PROVIDER_SEND_TURN_MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const PROVIDER_SEND_TURN_MAX_IMAGE_DATA_URL_CHARS = 14_000_000;
const CHAT_ATTACHMENT_ID_MAX_CHARS = 128;
export const CorrelationId = CommandId;
const ChatAttachmentId = TrimmedNonEmptyString.check(Schema.isMaxLength(CHAT_ATTACHMENT_ID_MAX_CHARS), Schema.isPattern(/^[a-z0-9_-]+$/i));
export const ChatImageAttachment = Schema.Struct({
    type: Schema.Literal("image"),
    id: ChatAttachmentId,
    name: TrimmedNonEmptyString.check(Schema.isMaxLength(255)),
    mimeType: TrimmedNonEmptyString.check(Schema.isMaxLength(100), Schema.isPattern(/^image\//i)),
    sizeBytes: NonNegativeInt.check(Schema.isLessThanOrEqualTo(PROVIDER_SEND_TURN_MAX_IMAGE_BYTES)),
});
const UploadChatImageAttachment = Schema.Struct({
    type: Schema.Literal("image"),
    name: TrimmedNonEmptyString.check(Schema.isMaxLength(255)),
    mimeType: TrimmedNonEmptyString.check(Schema.isMaxLength(100), Schema.isPattern(/^image\//i)),
    sizeBytes: NonNegativeInt.check(Schema.isLessThanOrEqualTo(PROVIDER_SEND_TURN_MAX_IMAGE_BYTES)),
    dataUrl: TrimmedNonEmptyString.check(Schema.isMaxLength(PROVIDER_SEND_TURN_MAX_IMAGE_DATA_URL_CHARS)),
});
export const ChatAttachment = Schema.Union([ChatImageAttachment]);
const UploadChatAttachment = Schema.Union([UploadChatImageAttachment]);
export const ProjectScriptIcon = Schema.Literals([
    "play",
    "test",
    "lint",
    "configure",
    "build",
    "debug",
]);
export const ProjectScript = Schema.Struct({
    id: TrimmedNonEmptyString,
    name: TrimmedNonEmptyString,
    command: TrimmedNonEmptyString,
    icon: ProjectScriptIcon,
    runOnWorktreeCreate: Schema.Boolean,
});
export const OrchestrationProject = Schema.Struct({
    id: ProjectId,
    title: TrimmedNonEmptyString,
    workspaceRoot: TrimmedNonEmptyString,
    defaultModelSelection: Schema.NullOr(ModelSelection),
    scripts: Schema.Array(ProjectScript),
    createdAt: IsoDateTime,
    updatedAt: IsoDateTime,
    deletedAt: Schema.NullOr(IsoDateTime),
});
export const OrchestrationMessageRole = Schema.Literals(["user", "assistant", "system"]);
export const OrchestrationMessage = Schema.Struct({
    id: MessageId,
    role: OrchestrationMessageRole,
    text: Schema.String,
    attachments: Schema.optional(Schema.Array(ChatAttachment)),
    turnId: Schema.NullOr(TurnId),
    streaming: Schema.Boolean,
    createdAt: IsoDateTime,
    updatedAt: IsoDateTime,
});
export const OrchestrationProposedPlanId = TrimmedNonEmptyString;
export const OrchestrationProposedPlan = Schema.Struct({
    id: OrchestrationProposedPlanId,
    turnId: Schema.NullOr(TurnId),
    planMarkdown: TrimmedNonEmptyString,
    implementedAt: Schema.NullOr(IsoDateTime).pipe(Schema.withDecodingDefault(() => null)),
    implementationThreadId: Schema.NullOr(ThreadId).pipe(Schema.withDecodingDefault(() => null)),
    createdAt: IsoDateTime,
    updatedAt: IsoDateTime,
});
const SourceProposedPlanReference = Schema.Struct({
    threadId: ThreadId,
    planId: OrchestrationProposedPlanId,
});
export const OrchestrationSessionStatus = Schema.Literals([
    "idle",
    "starting",
    "running",
    "ready",
    "interrupted",
    "stopped",
    "error",
]);
export const OrchestrationSession = Schema.Struct({
    threadId: ThreadId,
    status: OrchestrationSessionStatus,
    providerName: Schema.NullOr(TrimmedNonEmptyString),
    runtimeMode: RuntimeMode.pipe(Schema.withDecodingDefault(() => DEFAULT_RUNTIME_MODE)),
    activeTurnId: Schema.NullOr(TurnId),
    lastError: Schema.NullOr(TrimmedNonEmptyString),
    updatedAt: IsoDateTime,
});
export const OrchestrationCheckpointFile = Schema.Struct({
    path: TrimmedNonEmptyString,
    kind: TrimmedNonEmptyString,
    additions: NonNegativeInt,
    deletions: NonNegativeInt,
});
export const OrchestrationCheckpointStatus = Schema.Literals(["ready", "missing", "error"]);
export const OrchestrationCheckpointSummary = Schema.Struct({
    turnId: TurnId,
    checkpointTurnCount: NonNegativeInt,
    checkpointRef: CheckpointRef,
    status: OrchestrationCheckpointStatus,
    files: Schema.Array(OrchestrationCheckpointFile),
    assistantMessageId: Schema.NullOr(MessageId),
    completedAt: IsoDateTime,
});
export const OrchestrationThreadActivityTone = Schema.Literals([
    "info",
    "tool",
    "approval",
    "error",
]);
export const OrchestrationThreadActivity = Schema.Struct({
    id: EventId,
    tone: OrchestrationThreadActivityTone,
    kind: TrimmedNonEmptyString,
    summary: TrimmedNonEmptyString,
    payload: Schema.Unknown,
    turnId: Schema.NullOr(TurnId),
    sequence: Schema.optional(NonNegativeInt),
    createdAt: IsoDateTime,
});
const OrchestrationLatestTurnState = Schema.Literals([
    "running",
    "interrupted",
    "completed",
    "error",
]);
export const OrchestrationLatestTurn = Schema.Struct({
    turnId: TurnId,
    state: OrchestrationLatestTurnState,
    requestedAt: IsoDateTime,
    startedAt: Schema.NullOr(IsoDateTime),
    completedAt: Schema.NullOr(IsoDateTime),
    assistantMessageId: Schema.NullOr(MessageId),
    sourceProposedPlan: Schema.optional(SourceProposedPlanReference),
});
export const OrchestrationThread = Schema.Struct({
    id: ThreadId,
    projectId: ProjectId,
    title: TrimmedNonEmptyString,
    modelSelection: ModelSelection,
    runtimeMode: RuntimeMode,
    interactionMode: ProviderInteractionMode.pipe(Schema.withDecodingDefault(() => DEFAULT_PROVIDER_INTERACTION_MODE)),
    branch: Schema.NullOr(TrimmedNonEmptyString),
    worktreePath: Schema.NullOr(TrimmedNonEmptyString),
    latestTurn: Schema.NullOr(OrchestrationLatestTurn),
    createdAt: IsoDateTime,
    updatedAt: IsoDateTime,
    deletedAt: Schema.NullOr(IsoDateTime),
    messages: Schema.Array(OrchestrationMessage),
    proposedPlans: Schema.Array(OrchestrationProposedPlan).pipe(Schema.withDecodingDefault(() => [])),
    activities: Schema.Array(OrchestrationThreadActivity),
    checkpoints: Schema.Array(OrchestrationCheckpointSummary),
    session: Schema.NullOr(OrchestrationSession),
});
export const OrchestrationReadModel = Schema.Struct({
    snapshotSequence: NonNegativeInt,
    projects: Schema.Array(OrchestrationProject),
    threads: Schema.Array(OrchestrationThread),
    updatedAt: IsoDateTime,
});
export const ProjectCreateCommand = Schema.Struct({
    type: Schema.Literal("project.create"),
    commandId: CommandId,
    projectId: ProjectId,
    title: TrimmedNonEmptyString,
    workspaceRoot: TrimmedNonEmptyString,
    defaultModelSelection: Schema.optional(Schema.NullOr(ModelSelection)),
    createdAt: IsoDateTime,
});
const ProjectMetaUpdateCommand = Schema.Struct({
    type: Schema.Literal("project.meta.update"),
    commandId: CommandId,
    projectId: ProjectId,
    title: Schema.optional(TrimmedNonEmptyString),
    workspaceRoot: Schema.optional(TrimmedNonEmptyString),
    defaultModelSelection: Schema.optional(Schema.NullOr(ModelSelection)),
    scripts: Schema.optional(Schema.Array(ProjectScript)),
});
const ProjectDeleteCommand = Schema.Struct({
    type: Schema.Literal("project.delete"),
    commandId: CommandId,
    projectId: ProjectId,
});
const ThreadCreateCommand = Schema.Struct({
    type: Schema.Literal("thread.create"),
    commandId: CommandId,
    threadId: ThreadId,
    projectId: ProjectId,
    title: TrimmedNonEmptyString,
    modelSelection: ModelSelection,
    runtimeMode: RuntimeMode,
    interactionMode: ProviderInteractionMode.pipe(Schema.withDecodingDefault(() => DEFAULT_PROVIDER_INTERACTION_MODE)),
    branch: Schema.NullOr(TrimmedNonEmptyString),
    worktreePath: Schema.NullOr(TrimmedNonEmptyString),
    createdAt: IsoDateTime,
});
const ThreadDeleteCommand = Schema.Struct({
    type: Schema.Literal("thread.delete"),
    commandId: CommandId,
    threadId: ThreadId,
});
const ThreadMetaUpdateCommand = Schema.Struct({
    type: Schema.Literal("thread.meta.update"),
    commandId: CommandId,
    threadId: ThreadId,
    title: Schema.optional(TrimmedNonEmptyString),
    modelSelection: Schema.optional(ModelSelection),
    branch: Schema.optional(Schema.NullOr(TrimmedNonEmptyString)),
    worktreePath: Schema.optional(Schema.NullOr(TrimmedNonEmptyString)),
});
const ThreadRuntimeModeSetCommand = Schema.Struct({
    type: Schema.Literal("thread.runtime-mode.set"),
    commandId: CommandId,
    threadId: ThreadId,
    runtimeMode: RuntimeMode,
    createdAt: IsoDateTime,
});
const ThreadInteractionModeSetCommand = Schema.Struct({
    type: Schema.Literal("thread.interaction-mode.set"),
    commandId: CommandId,
    threadId: ThreadId,
    interactionMode: ProviderInteractionMode,
    createdAt: IsoDateTime,
});
export const ThreadTurnStartCommand = Schema.Struct({
    type: Schema.Literal("thread.turn.start"),
    commandId: CommandId,
    threadId: ThreadId,
    message: Schema.Struct({
        messageId: MessageId,
        role: Schema.Literal("user"),
        text: Schema.String,
        attachments: Schema.Array(ChatAttachment),
    }),
    modelSelection: Schema.optional(ModelSelection),
    providerOptions: Schema.optional(ProviderStartOptions),
    assistantDeliveryMode: Schema.optional(AssistantDeliveryMode),
    runtimeMode: RuntimeMode.pipe(Schema.withDecodingDefault(() => DEFAULT_RUNTIME_MODE)),
    interactionMode: ProviderInteractionMode.pipe(Schema.withDecodingDefault(() => DEFAULT_PROVIDER_INTERACTION_MODE)),
    sourceProposedPlan: Schema.optional(SourceProposedPlanReference),
    createdAt: IsoDateTime,
});
const ClientThreadTurnStartCommand = Schema.Struct({
    type: Schema.Literal("thread.turn.start"),
    commandId: CommandId,
    threadId: ThreadId,
    message: Schema.Struct({
        messageId: MessageId,
        role: Schema.Literal("user"),
        text: Schema.String,
        attachments: Schema.Array(UploadChatAttachment),
    }),
    modelSelection: Schema.optional(ModelSelection),
    providerOptions: Schema.optional(ProviderStartOptions),
    assistantDeliveryMode: Schema.optional(AssistantDeliveryMode),
    runtimeMode: RuntimeMode,
    interactionMode: ProviderInteractionMode,
    sourceProposedPlan: Schema.optional(SourceProposedPlanReference),
    createdAt: IsoDateTime,
});
const ThreadTurnInterruptCommand = Schema.Struct({
    type: Schema.Literal("thread.turn.interrupt"),
    commandId: CommandId,
    threadId: ThreadId,
    turnId: Schema.optional(TurnId),
    createdAt: IsoDateTime,
});
const ThreadApprovalRespondCommand = Schema.Struct({
    type: Schema.Literal("thread.approval.respond"),
    commandId: CommandId,
    threadId: ThreadId,
    requestId: ApprovalRequestId,
    decision: ProviderApprovalDecision,
    createdAt: IsoDateTime,
});
const ThreadUserInputRespondCommand = Schema.Struct({
    type: Schema.Literal("thread.user-input.respond"),
    commandId: CommandId,
    threadId: ThreadId,
    requestId: ApprovalRequestId,
    answers: ProviderUserInputAnswers,
    createdAt: IsoDateTime,
});
const ThreadCheckpointRevertCommand = Schema.Struct({
    type: Schema.Literal("thread.checkpoint.revert"),
    commandId: CommandId,
    threadId: ThreadId,
    turnCount: NonNegativeInt,
    createdAt: IsoDateTime,
});
const ThreadSessionStopCommand = Schema.Struct({
    type: Schema.Literal("thread.session.stop"),
    commandId: CommandId,
    threadId: ThreadId,
    createdAt: IsoDateTime,
});
const DispatchableClientOrchestrationCommand = Schema.Union([
    ProjectCreateCommand,
    ProjectMetaUpdateCommand,
    ProjectDeleteCommand,
    ThreadCreateCommand,
    ThreadDeleteCommand,
    ThreadMetaUpdateCommand,
    ThreadRuntimeModeSetCommand,
    ThreadInteractionModeSetCommand,
    ThreadTurnStartCommand,
    ThreadTurnInterruptCommand,
    ThreadApprovalRespondCommand,
    ThreadUserInputRespondCommand,
    ThreadCheckpointRevertCommand,
    ThreadSessionStopCommand,
]);
export const ClientOrchestrationCommand = Schema.Union([
    ProjectCreateCommand,
    ProjectMetaUpdateCommand,
    ProjectDeleteCommand,
    ThreadCreateCommand,
    ThreadDeleteCommand,
    ThreadMetaUpdateCommand,
    ThreadRuntimeModeSetCommand,
    ThreadInteractionModeSetCommand,
    ClientThreadTurnStartCommand,
    ThreadTurnInterruptCommand,
    ThreadApprovalRespondCommand,
    ThreadUserInputRespondCommand,
    ThreadCheckpointRevertCommand,
    ThreadSessionStopCommand,
]);
const ThreadSessionSetCommand = Schema.Struct({
    type: Schema.Literal("thread.session.set"),
    commandId: CommandId,
    threadId: ThreadId,
    session: OrchestrationSession,
    createdAt: IsoDateTime,
});
const ThreadMessageAssistantDeltaCommand = Schema.Struct({
    type: Schema.Literal("thread.message.assistant.delta"),
    commandId: CommandId,
    threadId: ThreadId,
    messageId: MessageId,
    delta: Schema.String,
    turnId: Schema.optional(TurnId),
    createdAt: IsoDateTime,
});
const ThreadMessageAssistantCompleteCommand = Schema.Struct({
    type: Schema.Literal("thread.message.assistant.complete"),
    commandId: CommandId,
    threadId: ThreadId,
    messageId: MessageId,
    turnId: Schema.optional(TurnId),
    createdAt: IsoDateTime,
});
const ThreadProposedPlanUpsertCommand = Schema.Struct({
    type: Schema.Literal("thread.proposed-plan.upsert"),
    commandId: CommandId,
    threadId: ThreadId,
    proposedPlan: OrchestrationProposedPlan,
    createdAt: IsoDateTime,
});
const ThreadTurnDiffCompleteCommand = Schema.Struct({
    type: Schema.Literal("thread.turn.diff.complete"),
    commandId: CommandId,
    threadId: ThreadId,
    turnId: TurnId,
    completedAt: IsoDateTime,
    checkpointRef: CheckpointRef,
    status: OrchestrationCheckpointStatus,
    files: Schema.Array(OrchestrationCheckpointFile),
    assistantMessageId: Schema.optional(MessageId),
    checkpointTurnCount: NonNegativeInt,
    createdAt: IsoDateTime,
});
const ThreadActivityAppendCommand = Schema.Struct({
    type: Schema.Literal("thread.activity.append"),
    commandId: CommandId,
    threadId: ThreadId,
    activity: OrchestrationThreadActivity,
    createdAt: IsoDateTime,
});
const ThreadRevertCompleteCommand = Schema.Struct({
    type: Schema.Literal("thread.revert.complete"),
    commandId: CommandId,
    threadId: ThreadId,
    turnCount: NonNegativeInt,
    createdAt: IsoDateTime,
});
const InternalOrchestrationCommand = Schema.Union([
    ThreadSessionSetCommand,
    ThreadMessageAssistantDeltaCommand,
    ThreadMessageAssistantCompleteCommand,
    ThreadProposedPlanUpsertCommand,
    ThreadTurnDiffCompleteCommand,
    ThreadActivityAppendCommand,
    ThreadRevertCompleteCommand,
]);
export const OrchestrationCommand = Schema.Union([
    DispatchableClientOrchestrationCommand,
    InternalOrchestrationCommand,
]);
export const OrchestrationEventType = Schema.Literals([
    "project.created",
    "project.meta-updated",
    "project.deleted",
    "thread.created",
    "thread.deleted",
    "thread.meta-updated",
    "thread.runtime-mode-set",
    "thread.interaction-mode-set",
    "thread.message-sent",
    "thread.turn-start-requested",
    "thread.turn-interrupt-requested",
    "thread.approval-response-requested",
    "thread.user-input-response-requested",
    "thread.checkpoint-revert-requested",
    "thread.reverted",
    "thread.session-stop-requested",
    "thread.session-set",
    "thread.proposed-plan-upserted",
    "thread.turn-diff-completed",
    "thread.activity-appended",
]);
export const OrchestrationAggregateKind = Schema.Literals(["project", "thread"]);
export const OrchestrationActorKind = Schema.Literals(["client", "server", "provider"]);
export const ProjectCreatedPayload = Schema.Struct({
    projectId: ProjectId,
    title: TrimmedNonEmptyString,
    workspaceRoot: TrimmedNonEmptyString,
    defaultModelSelection: Schema.NullOr(ModelSelection),
    scripts: Schema.Array(ProjectScript),
    createdAt: IsoDateTime,
    updatedAt: IsoDateTime,
});
export const ProjectMetaUpdatedPayload = Schema.Struct({
    projectId: ProjectId,
    title: Schema.optional(TrimmedNonEmptyString),
    workspaceRoot: Schema.optional(TrimmedNonEmptyString),
    defaultModelSelection: Schema.optional(Schema.NullOr(ModelSelection)),
    scripts: Schema.optional(Schema.Array(ProjectScript)),
    updatedAt: IsoDateTime,
});
export const ProjectDeletedPayload = Schema.Struct({
    projectId: ProjectId,
    deletedAt: IsoDateTime,
});
export const ThreadCreatedPayload = Schema.Struct({
    threadId: ThreadId,
    projectId: ProjectId,
    title: TrimmedNonEmptyString,
    modelSelection: ModelSelection,
    runtimeMode: RuntimeMode.pipe(Schema.withDecodingDefault(() => DEFAULT_RUNTIME_MODE)),
    interactionMode: ProviderInteractionMode.pipe(Schema.withDecodingDefault(() => DEFAULT_PROVIDER_INTERACTION_MODE)),
    branch: Schema.NullOr(TrimmedNonEmptyString),
    worktreePath: Schema.NullOr(TrimmedNonEmptyString),
    createdAt: IsoDateTime,
    updatedAt: IsoDateTime,
});
export const ThreadDeletedPayload = Schema.Struct({
    threadId: ThreadId,
    deletedAt: IsoDateTime,
});
export const ThreadMetaUpdatedPayload = Schema.Struct({
    threadId: ThreadId,
    title: Schema.optional(TrimmedNonEmptyString),
    modelSelection: Schema.optional(ModelSelection),
    branch: Schema.optional(Schema.NullOr(TrimmedNonEmptyString)),
    worktreePath: Schema.optional(Schema.NullOr(TrimmedNonEmptyString)),
    updatedAt: IsoDateTime,
});
export const ThreadRuntimeModeSetPayload = Schema.Struct({
    threadId: ThreadId,
    runtimeMode: RuntimeMode,
    updatedAt: IsoDateTime,
});
export const ThreadInteractionModeSetPayload = Schema.Struct({
    threadId: ThreadId,
    interactionMode: ProviderInteractionMode.pipe(Schema.withDecodingDefault(() => DEFAULT_PROVIDER_INTERACTION_MODE)),
    updatedAt: IsoDateTime,
});
export const ThreadMessageSentPayload = Schema.Struct({
    threadId: ThreadId,
    messageId: MessageId,
    role: OrchestrationMessageRole,
    text: Schema.String,
    attachments: Schema.optional(Schema.Array(ChatAttachment)),
    turnId: Schema.NullOr(TurnId),
    streaming: Schema.Boolean,
    createdAt: IsoDateTime,
    updatedAt: IsoDateTime,
});
export const ThreadTurnStartRequestedPayload = Schema.Struct({
    threadId: ThreadId,
    messageId: MessageId,
    modelSelection: Schema.optional(ModelSelection),
    providerOptions: Schema.optional(ProviderStartOptions),
    assistantDeliveryMode: Schema.optional(AssistantDeliveryMode),
    runtimeMode: RuntimeMode.pipe(Schema.withDecodingDefault(() => DEFAULT_RUNTIME_MODE)),
    interactionMode: ProviderInteractionMode.pipe(Schema.withDecodingDefault(() => DEFAULT_PROVIDER_INTERACTION_MODE)),
    sourceProposedPlan: Schema.optional(SourceProposedPlanReference),
    createdAt: IsoDateTime,
});
export const ThreadTurnInterruptRequestedPayload = Schema.Struct({
    threadId: ThreadId,
    turnId: Schema.optional(TurnId),
    createdAt: IsoDateTime,
});
export const ThreadApprovalResponseRequestedPayload = Schema.Struct({
    threadId: ThreadId,
    requestId: ApprovalRequestId,
    decision: ProviderApprovalDecision,
    createdAt: IsoDateTime,
});
const ThreadUserInputResponseRequestedPayload = Schema.Struct({
    threadId: ThreadId,
    requestId: ApprovalRequestId,
    answers: ProviderUserInputAnswers,
    createdAt: IsoDateTime,
});
export const ThreadCheckpointRevertRequestedPayload = Schema.Struct({
    threadId: ThreadId,
    turnCount: NonNegativeInt,
    createdAt: IsoDateTime,
});
export const ThreadRevertedPayload = Schema.Struct({
    threadId: ThreadId,
    turnCount: NonNegativeInt,
});
export const ThreadSessionStopRequestedPayload = Schema.Struct({
    threadId: ThreadId,
    createdAt: IsoDateTime,
});
export const ThreadSessionSetPayload = Schema.Struct({
    threadId: ThreadId,
    session: OrchestrationSession,
});
export const ThreadProposedPlanUpsertedPayload = Schema.Struct({
    threadId: ThreadId,
    proposedPlan: OrchestrationProposedPlan,
});
export const ThreadTurnDiffCompletedPayload = Schema.Struct({
    threadId: ThreadId,
    turnId: TurnId,
    checkpointTurnCount: NonNegativeInt,
    checkpointRef: CheckpointRef,
    status: OrchestrationCheckpointStatus,
    files: Schema.Array(OrchestrationCheckpointFile),
    assistantMessageId: Schema.NullOr(MessageId),
    completedAt: IsoDateTime,
});
export const ThreadActivityAppendedPayload = Schema.Struct({
    threadId: ThreadId,
    activity: OrchestrationThreadActivity,
});
export const OrchestrationEventMetadata = Schema.Struct({
    providerTurnId: Schema.optional(TrimmedNonEmptyString),
    providerItemId: Schema.optional(ProviderItemId),
    adapterKey: Schema.optional(TrimmedNonEmptyString),
    requestId: Schema.optional(ApprovalRequestId),
    ingestedAt: Schema.optional(IsoDateTime),
});
const EventBaseFields = {
    sequence: NonNegativeInt,
    eventId: EventId,
    aggregateKind: OrchestrationAggregateKind,
    aggregateId: Schema.Union([ProjectId, ThreadId]),
    occurredAt: IsoDateTime,
    commandId: Schema.NullOr(CommandId),
    causationEventId: Schema.NullOr(EventId),
    correlationId: Schema.NullOr(CommandId),
    metadata: OrchestrationEventMetadata,
};
export const OrchestrationEvent = Schema.Union([
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("project.created"),
        payload: ProjectCreatedPayload,
    }),
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("project.meta-updated"),
        payload: ProjectMetaUpdatedPayload,
    }),
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("project.deleted"),
        payload: ProjectDeletedPayload,
    }),
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("thread.created"),
        payload: ThreadCreatedPayload,
    }),
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("thread.deleted"),
        payload: ThreadDeletedPayload,
    }),
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("thread.meta-updated"),
        payload: ThreadMetaUpdatedPayload,
    }),
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("thread.runtime-mode-set"),
        payload: ThreadRuntimeModeSetPayload,
    }),
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("thread.interaction-mode-set"),
        payload: ThreadInteractionModeSetPayload,
    }),
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("thread.message-sent"),
        payload: ThreadMessageSentPayload,
    }),
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("thread.turn-start-requested"),
        payload: ThreadTurnStartRequestedPayload,
    }),
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("thread.turn-interrupt-requested"),
        payload: ThreadTurnInterruptRequestedPayload,
    }),
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("thread.approval-response-requested"),
        payload: ThreadApprovalResponseRequestedPayload,
    }),
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("thread.user-input-response-requested"),
        payload: ThreadUserInputResponseRequestedPayload,
    }),
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("thread.checkpoint-revert-requested"),
        payload: ThreadCheckpointRevertRequestedPayload,
    }),
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("thread.reverted"),
        payload: ThreadRevertedPayload,
    }),
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("thread.session-stop-requested"),
        payload: ThreadSessionStopRequestedPayload,
    }),
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("thread.session-set"),
        payload: ThreadSessionSetPayload,
    }),
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("thread.proposed-plan-upserted"),
        payload: ThreadProposedPlanUpsertedPayload,
    }),
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("thread.turn-diff-completed"),
        payload: ThreadTurnDiffCompletedPayload,
    }),
    Schema.Struct({
        ...EventBaseFields,
        type: Schema.Literal("thread.activity-appended"),
        payload: ThreadActivityAppendedPayload,
    }),
]);
export const OrchestrationCommandReceiptStatus = Schema.Literals(["accepted", "rejected"]);
export const TurnCountRange = Schema.Struct({
    fromTurnCount: NonNegativeInt,
    toTurnCount: NonNegativeInt,
}).check(Schema.makeFilter((input) => input.fromTurnCount <= input.toTurnCount ||
    new SchemaIssue.InvalidValue(Option.some(input.fromTurnCount), {
        message: "fromTurnCount must be less than or equal to toTurnCount",
    }), { identifier: "OrchestrationTurnDiffRange" }));
export const ThreadTurnDiff = TurnCountRange.mapFields(Struct.assign({
    threadId: ThreadId,
    diff: Schema.String,
}), { unsafePreserveChecks: true });
export const ProviderSessionRuntimeStatus = Schema.Literals([
    "starting",
    "running",
    "stopped",
    "error",
]);
const ProjectionThreadTurnStatus = Schema.Literals([
    "running",
    "completed",
    "interrupted",
    "error",
]);
const ProjectionCheckpointRow = Schema.Struct({
    threadId: ThreadId,
    turnId: TurnId,
    checkpointTurnCount: NonNegativeInt,
    checkpointRef: CheckpointRef,
    status: OrchestrationCheckpointStatus,
    files: Schema.Array(OrchestrationCheckpointFile),
    assistantMessageId: Schema.NullOr(MessageId),
    completedAt: IsoDateTime,
});
export const ProjectionPendingApprovalStatus = Schema.Literals(["pending", "resolved"]);
export const ProjectionPendingApprovalDecision = Schema.NullOr(ProviderApprovalDecision);
export const DispatchResult = Schema.Struct({
    sequence: NonNegativeInt,
});
export const OrchestrationGetSnapshotInput = Schema.Struct({});
const OrchestrationGetSnapshotResult = OrchestrationReadModel;
export const OrchestrationGetTurnDiffInput = TurnCountRange.mapFields(Struct.assign({ threadId: ThreadId }), { unsafePreserveChecks: true });
export const OrchestrationGetTurnDiffResult = ThreadTurnDiff;
export const OrchestrationGetFullThreadDiffInput = Schema.Struct({
    threadId: ThreadId,
    toTurnCount: NonNegativeInt,
});
export const OrchestrationGetFullThreadDiffResult = ThreadTurnDiff;
export const OrchestrationReplayEventsInput = Schema.Struct({
    fromSequenceExclusive: NonNegativeInt,
});
const OrchestrationReplayEventsResult = Schema.Array(OrchestrationEvent);
export const OrchestrationRpcSchemas = {
    getSnapshot: {
        input: OrchestrationGetSnapshotInput,
        output: OrchestrationGetSnapshotResult,
    },
    dispatchCommand: {
        input: ClientOrchestrationCommand,
        output: DispatchResult,
    },
    getTurnDiff: {
        input: OrchestrationGetTurnDiffInput,
        output: OrchestrationGetTurnDiffResult,
    },
    getFullThreadDiff: {
        input: OrchestrationGetFullThreadDiffInput,
        output: OrchestrationGetFullThreadDiffResult,
    },
    replayEvents: {
        input: OrchestrationReplayEventsInput,
        output: OrchestrationReplayEventsResult,
    },
};
