import { Schema } from "effect";
import { TrimmedNonEmptyString } from "./baseSchemas";
const FILESYSTEM_PATH_MAX_LENGTH = 512;
export const FilesystemBrowseInput = Schema.Struct({
    partialPath: TrimmedNonEmptyString.check(Schema.isMaxLength(FILESYSTEM_PATH_MAX_LENGTH)),
    cwd: Schema.optional(TrimmedNonEmptyString.check(Schema.isMaxLength(FILESYSTEM_PATH_MAX_LENGTH))),
});
export const FilesystemBrowseEntry = Schema.Struct({
    name: TrimmedNonEmptyString,
    fullPath: TrimmedNonEmptyString,
});
export const FilesystemBrowseResult = Schema.Struct({
    parentPath: TrimmedNonEmptyString,
    entries: Schema.Array(FilesystemBrowseEntry),
});
export class FilesystemBrowseError extends Schema.TaggedErrorClass()("FilesystemBrowseError", {
    message: TrimmedNonEmptyString,
    cause: Schema.optional(Schema.Defect),
}) {
}
