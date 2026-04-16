import { Schema } from "effect";
import { NonNegativeInt, PositiveInt, ThreadId, TrimmedNonEmptyString } from "./baseSchemas";
const TrimmedNonEmptyStringSchema = TrimmedNonEmptyString;
const GIT_LIST_BRANCHES_MAX_LIMIT = 200;
// Domain Types
export const GitStackedAction = Schema.Literals([
    "commit",
    "push",
    "create_pr",
    "commit_push",
    "commit_push_pr",
]);
export const GitActionProgressPhase = Schema.Literals(["branch", "commit", "push", "pr"]);
export const GitActionProgressKind = Schema.Literals([
    "action_started",
    "phase_started",
    "hook_started",
    "hook_output",
    "hook_finished",
    "action_finished",
    "action_failed",
]);
export const GitActionProgressStream = Schema.Literals(["stdout", "stderr"]);
const GitCommitStepStatus = Schema.Literals([
    "created",
    "skipped_no_changes",
    "skipped_not_requested",
]);
const GitPushStepStatus = Schema.Literals([
    "pushed",
    "skipped_not_requested",
    "skipped_up_to_date",
]);
const GitBranchStepStatus = Schema.Literals(["created", "skipped_not_requested"]);
const GitPrStepStatus = Schema.Literals(["created", "opened_existing", "skipped_not_requested"]);
const GitStatusPrState = Schema.Literals(["open", "closed", "merged"]);
const GitPullRequestReference = TrimmedNonEmptyStringSchema;
const GitPullRequestState = Schema.Literals(["open", "closed", "merged"]);
const GitPreparePullRequestThreadMode = Schema.Literals(["local", "worktree"]);
export const GitHostingProviderKind = Schema.Literals(["github", "gitlab", "unknown"]);
export const GitHostingProvider = Schema.Struct({
    kind: GitHostingProviderKind,
    name: TrimmedNonEmptyStringSchema,
    baseUrl: Schema.String,
});
export const GitRunStackedActionToastRunAction = Schema.Struct({
    kind: GitStackedAction,
});
const GitRunStackedActionToastCta = Schema.Union([
    Schema.Struct({
        kind: Schema.Literal("none"),
    }),
    Schema.Struct({
        kind: Schema.Literal("open_pr"),
        label: TrimmedNonEmptyStringSchema,
        url: Schema.String,
    }),
    Schema.Struct({
        kind: Schema.Literal("run_action"),
        label: TrimmedNonEmptyStringSchema,
        action: GitRunStackedActionToastRunAction,
    }),
]);
const GitRunStackedActionToast = Schema.Struct({
    title: TrimmedNonEmptyStringSchema,
    description: Schema.optional(TrimmedNonEmptyStringSchema),
    cta: GitRunStackedActionToastCta,
});
export const GitBranch = Schema.Struct({
    name: TrimmedNonEmptyStringSchema,
    isRemote: Schema.optional(Schema.Boolean),
    remoteName: Schema.optional(TrimmedNonEmptyStringSchema),
    current: Schema.Boolean,
    isDefault: Schema.Boolean,
    worktreePath: TrimmedNonEmptyStringSchema.pipe(Schema.NullOr),
});
const GitWorktree = Schema.Struct({
    path: TrimmedNonEmptyStringSchema,
    branch: TrimmedNonEmptyStringSchema,
});
const GitResolvedPullRequest = Schema.Struct({
    number: PositiveInt,
    title: TrimmedNonEmptyStringSchema,
    url: Schema.String,
    baseBranch: TrimmedNonEmptyStringSchema,
    headBranch: TrimmedNonEmptyStringSchema,
    state: GitPullRequestState,
});
// RPC Inputs
export const GitStatusInput = Schema.Struct({
    cwd: TrimmedNonEmptyStringSchema,
});
export const GitPullInput = Schema.Struct({
    cwd: TrimmedNonEmptyStringSchema,
});
export const GitRunStackedActionInput = Schema.Struct({
    actionId: TrimmedNonEmptyStringSchema,
    cwd: TrimmedNonEmptyStringSchema,
    action: GitStackedAction,
    commitMessage: Schema.optional(TrimmedNonEmptyStringSchema.check(Schema.isMaxLength(10_000))),
    featureBranch: Schema.optional(Schema.Boolean),
    filePaths: Schema.optional(Schema.Array(TrimmedNonEmptyStringSchema).check(Schema.isMinLength(1))),
});
export const GitSuggestCommitMessageInput = Schema.Struct({
    cwd: TrimmedNonEmptyStringSchema,
    filePaths: Schema.optional(Schema.Array(TrimmedNonEmptyStringSchema).check(Schema.isMinLength(1))),
});
export const GitSuggestCommitMessageResult = Schema.Struct({
    subject: Schema.String,
    body: Schema.String,
});
export const GitListBranchesInput = Schema.Struct({
    cwd: TrimmedNonEmptyStringSchema,
    query: Schema.optional(TrimmedNonEmptyStringSchema.check(Schema.isMaxLength(256))),
    cursor: Schema.optional(NonNegativeInt),
    limit: Schema.optional(PositiveInt.check(Schema.isLessThanOrEqualTo(GIT_LIST_BRANCHES_MAX_LIMIT))),
});
export const GitCreateWorktreeInput = Schema.Struct({
    cwd: TrimmedNonEmptyStringSchema,
    branch: TrimmedNonEmptyStringSchema,
    newBranch: Schema.optional(TrimmedNonEmptyStringSchema),
    path: Schema.NullOr(TrimmedNonEmptyStringSchema),
});
export const GitPullRequestRefInput = Schema.Struct({
    cwd: TrimmedNonEmptyStringSchema,
    reference: GitPullRequestReference,
});
export const GitPreparePullRequestThreadInput = Schema.Struct({
    cwd: TrimmedNonEmptyStringSchema,
    reference: GitPullRequestReference,
    mode: GitPreparePullRequestThreadMode,
    threadId: Schema.optional(ThreadId),
});
export const GitRemoveWorktreeInput = Schema.Struct({
    cwd: TrimmedNonEmptyStringSchema,
    path: TrimmedNonEmptyStringSchema,
    force: Schema.optional(Schema.Boolean),
});
export const GitCreateBranchInput = Schema.Struct({
    cwd: TrimmedNonEmptyStringSchema,
    branch: TrimmedNonEmptyStringSchema,
    checkout: Schema.optional(Schema.Boolean),
});
export const GitCreateBranchResult = Schema.Struct({
    branch: TrimmedNonEmptyStringSchema,
});
export const GitCheckoutInput = Schema.Struct({
    cwd: TrimmedNonEmptyStringSchema,
    branch: TrimmedNonEmptyStringSchema,
});
export const GitInitInput = Schema.Struct({
    cwd: TrimmedNonEmptyStringSchema,
});
// RPC Results
const GitStatusPr = Schema.Struct({
    number: PositiveInt,
    title: TrimmedNonEmptyStringSchema,
    url: Schema.String,
    baseBranch: TrimmedNonEmptyStringSchema,
    headBranch: TrimmedNonEmptyStringSchema,
    state: GitStatusPrState,
});
const GitStatusLocalShape = {
    isRepo: Schema.Boolean,
    hostingProvider: Schema.optional(GitHostingProvider),
    hasOriginRemote: Schema.Boolean,
    isDefaultBranch: Schema.Boolean,
    branch: Schema.NullOr(TrimmedNonEmptyStringSchema),
    hasWorkingTreeChanges: Schema.Boolean,
    workingTree: Schema.Struct({
        files: Schema.Array(Schema.Struct({
            path: TrimmedNonEmptyStringSchema,
            insertions: NonNegativeInt,
            deletions: NonNegativeInt,
        })),
        insertions: NonNegativeInt,
        deletions: NonNegativeInt,
    }),
};
const GitStatusRemoteShape = {
    hasUpstream: Schema.Boolean,
    aheadCount: NonNegativeInt,
    behindCount: NonNegativeInt,
    pr: Schema.NullOr(GitStatusPr),
};
export const GitStatusLocalResult = Schema.Struct(GitStatusLocalShape);
export const GitStatusRemoteResult = Schema.Struct(GitStatusRemoteShape);
export const GitStatusResult = Schema.Struct({
    ...GitStatusLocalShape,
    ...GitStatusRemoteShape,
});
export const GitStatusStreamEvent = Schema.Union([
    Schema.TaggedStruct("snapshot", {
        local: GitStatusLocalResult,
        remote: Schema.NullOr(GitStatusRemoteResult),
    }),
    Schema.TaggedStruct("localUpdated", {
        local: GitStatusLocalResult,
    }),
    Schema.TaggedStruct("remoteUpdated", {
        remote: Schema.NullOr(GitStatusRemoteResult),
    }),
]);
export const GitListBranchesResult = Schema.Struct({
    branches: Schema.Array(GitBranch),
    isRepo: Schema.Boolean,
    hasOriginRemote: Schema.Boolean,
    nextCursor: NonNegativeInt.pipe(Schema.NullOr),
    totalCount: NonNegativeInt,
});
export const GitCreateWorktreeResult = Schema.Struct({
    worktree: GitWorktree,
});
export const GitResolvePullRequestResult = Schema.Struct({
    pullRequest: GitResolvedPullRequest,
});
export const GitPreparePullRequestThreadResult = Schema.Struct({
    pullRequest: GitResolvedPullRequest,
    branch: TrimmedNonEmptyStringSchema,
    worktreePath: TrimmedNonEmptyStringSchema.pipe(Schema.NullOr),
});
export const GitCheckoutResult = Schema.Struct({
    branch: Schema.NullOr(TrimmedNonEmptyStringSchema),
});
export const GitRunStackedActionResult = Schema.Struct({
    action: GitStackedAction,
    branch: Schema.Struct({
        status: GitBranchStepStatus,
        name: Schema.optional(TrimmedNonEmptyStringSchema),
    }),
    commit: Schema.Struct({
        status: GitCommitStepStatus,
        commitSha: Schema.optional(TrimmedNonEmptyStringSchema),
        subject: Schema.optional(TrimmedNonEmptyStringSchema),
    }),
    push: Schema.Struct({
        status: GitPushStepStatus,
        branch: Schema.optional(TrimmedNonEmptyStringSchema),
        upstreamBranch: Schema.optional(TrimmedNonEmptyStringSchema),
        setUpstream: Schema.optional(Schema.Boolean),
    }),
    pr: Schema.Struct({
        status: GitPrStepStatus,
        url: Schema.optional(Schema.String),
        number: Schema.optional(PositiveInt),
        baseBranch: Schema.optional(TrimmedNonEmptyStringSchema),
        headBranch: Schema.optional(TrimmedNonEmptyStringSchema),
        title: Schema.optional(TrimmedNonEmptyStringSchema),
    }),
    toast: GitRunStackedActionToast,
});
export const GitPullResult = Schema.Struct({
    status: Schema.Literals(["pulled", "skipped_up_to_date"]),
    branch: TrimmedNonEmptyStringSchema,
    upstreamBranch: TrimmedNonEmptyStringSchema.pipe(Schema.NullOr),
});
// RPC / domain errors
export class GitCommandError extends Schema.TaggedErrorClass()("GitCommandError", {
    operation: Schema.String,
    command: Schema.String,
    cwd: Schema.String,
    detail: Schema.String,
    cause: Schema.optional(Schema.Defect),
}) {
    get message() {
        return `Git command failed in ${this.operation}: ${this.command} (${this.cwd}) - ${this.detail}`;
    }
}
export class GitHubCliError extends Schema.TaggedErrorClass()("GitHubCliError", {
    operation: Schema.String,
    detail: Schema.String,
    cause: Schema.optional(Schema.Defect),
}) {
    get message() {
        return `GitHub CLI failed in ${this.operation}: ${this.detail}`;
    }
}
export class TextGenerationError extends Schema.TaggedErrorClass()("TextGenerationError", {
    operation: Schema.String,
    detail: Schema.String,
    cause: Schema.optional(Schema.Defect),
}) {
    get message() {
        return `Text generation failed in ${this.operation}: ${this.detail}`;
    }
}
export class GitManagerError extends Schema.TaggedErrorClass()("GitManagerError", {
    operation: Schema.String,
    detail: Schema.String,
    cause: Schema.optional(Schema.Defect),
}) {
    get message() {
        return `Git manager failed in ${this.operation}: ${this.detail}`;
    }
}
export const GitManagerServiceError = Schema.Union([
    GitManagerError,
    GitCommandError,
    GitHubCliError,
    TextGenerationError,
]);
const GitActionProgressBase = Schema.Struct({
    actionId: TrimmedNonEmptyStringSchema,
    cwd: TrimmedNonEmptyStringSchema,
    action: GitStackedAction,
});
const GitActionStartedEvent = Schema.Struct({
    ...GitActionProgressBase.fields,
    kind: Schema.Literal("action_started"),
    phases: Schema.Array(GitActionProgressPhase),
});
const GitActionPhaseStartedEvent = Schema.Struct({
    ...GitActionProgressBase.fields,
    kind: Schema.Literal("phase_started"),
    phase: GitActionProgressPhase,
    label: TrimmedNonEmptyStringSchema,
});
const GitActionHookStartedEvent = Schema.Struct({
    ...GitActionProgressBase.fields,
    kind: Schema.Literal("hook_started"),
    hookName: TrimmedNonEmptyStringSchema,
});
const GitActionHookOutputEvent = Schema.Struct({
    ...GitActionProgressBase.fields,
    kind: Schema.Literal("hook_output"),
    hookName: Schema.NullOr(TrimmedNonEmptyStringSchema),
    stream: GitActionProgressStream,
    text: TrimmedNonEmptyStringSchema,
});
const GitActionHookFinishedEvent = Schema.Struct({
    ...GitActionProgressBase.fields,
    kind: Schema.Literal("hook_finished"),
    hookName: TrimmedNonEmptyStringSchema,
    exitCode: Schema.NullOr(Schema.Int),
    durationMs: Schema.NullOr(NonNegativeInt),
});
const GitActionFinishedEvent = Schema.Struct({
    ...GitActionProgressBase.fields,
    kind: Schema.Literal("action_finished"),
    result: GitRunStackedActionResult,
});
const GitActionFailedEvent = Schema.Struct({
    ...GitActionProgressBase.fields,
    kind: Schema.Literal("action_failed"),
    phase: Schema.NullOr(GitActionProgressPhase),
    message: TrimmedNonEmptyStringSchema,
});
export const GitActionProgressEvent = Schema.Union([
    GitActionStartedEvent,
    GitActionPhaseStartedEvent,
    GitActionHookStartedEvent,
    GitActionHookOutputEvent,
    GitActionHookFinishedEvent,
    GitActionFinishedEvent,
    GitActionFailedEvent,
]);
