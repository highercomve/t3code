import { Schema } from "effect";
export const TrimmedString = Schema.Trim;
export const TrimmedNonEmptyString = TrimmedString.check(Schema.isNonEmpty());
export const NonNegativeInt = Schema.Int.check(Schema.isGreaterThanOrEqualTo(0));
export const PositiveInt = Schema.Int.check(Schema.isGreaterThanOrEqualTo(1));
export const IsoDateTime = Schema.String;
/**
 * Construct a branded identifier. Enforces non-empty trimmed strings
 */
const makeEntityId = (brand) => {
    return TrimmedNonEmptyString.pipe(Schema.brand(brand));
};
export const ThreadId = makeEntityId("ThreadId");
export const ProjectId = makeEntityId("ProjectId");
export const EnvironmentId = makeEntityId("EnvironmentId");
export const CommandId = makeEntityId("CommandId");
export const EventId = makeEntityId("EventId");
export const MessageId = makeEntityId("MessageId");
export const TurnId = makeEntityId("TurnId");
export const AuthSessionId = makeEntityId("AuthSessionId");
export const ProviderItemId = makeEntityId("ProviderItemId");
export const RuntimeSessionId = makeEntityId("RuntimeSessionId");
export const RuntimeItemId = makeEntityId("RuntimeItemId");
export const RuntimeRequestId = makeEntityId("RuntimeRequestId");
export const RuntimeTaskId = makeEntityId("RuntimeTaskId");
export const ApprovalRequestId = makeEntityId("ApprovalRequestId");
export const CheckpointRef = makeEntityId("CheckpointRef");
