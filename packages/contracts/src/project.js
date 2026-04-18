import { Schema } from "effect";
import { PositiveInt, TrimmedNonEmptyString } from "./baseSchemas";
const PROJECT_SEARCH_ENTRIES_MAX_LIMIT = 200;
const PROJECT_WRITE_FILE_PATH_MAX_LENGTH = 512;
export const ProjectSearchEntriesInput = Schema.Struct({
  cwd: TrimmedNonEmptyString,
  query: TrimmedNonEmptyString.check(Schema.isMaxLength(256)),
  limit: PositiveInt.check(Schema.isLessThanOrEqualTo(PROJECT_SEARCH_ENTRIES_MAX_LIMIT)),
});
const ProjectEntryKind = Schema.Literals(["file", "directory"]);
export const ProjectEntry = Schema.Struct({
  path: TrimmedNonEmptyString,
  kind: ProjectEntryKind,
  parentPath: Schema.optional(TrimmedNonEmptyString),
});
export const ProjectSearchEntriesResult = Schema.Struct({
  entries: Schema.Array(ProjectEntry),
  truncated: Schema.Boolean,
});
export class ProjectSearchEntriesError extends Schema.TaggedErrorClass()(
  "ProjectSearchEntriesError",
  {
    message: TrimmedNonEmptyString,
    cause: Schema.optional(Schema.Defect),
  },
) {}
export const ProjectWriteFileInput = Schema.Struct({
  cwd: TrimmedNonEmptyString,
  relativePath: TrimmedNonEmptyString.check(Schema.isMaxLength(PROJECT_WRITE_FILE_PATH_MAX_LENGTH)),
  contents: Schema.String,
});
export const ProjectWriteFileResult = Schema.Struct({
  relativePath: TrimmedNonEmptyString,
});
export class ProjectWriteFileError extends Schema.TaggedErrorClass()("ProjectWriteFileError", {
  message: TrimmedNonEmptyString,
  cause: Schema.optional(Schema.Defect),
}) {}
