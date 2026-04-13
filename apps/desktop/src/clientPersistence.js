import * as FS from "node:fs";
import * as Path from "node:path";
import { Predicate } from "effect";
function readJsonFile(filePath) {
  try {
    if (!FS.existsSync(filePath)) {
      return null;
    }
    return JSON.parse(FS.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}
function writeJsonFile(filePath, value) {
  const directory = Path.dirname(filePath);
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  FS.mkdirSync(directory, { recursive: true });
  FS.writeFileSync(tempPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  FS.renameSync(tempPath, filePath);
}
function isPersistedSavedEnvironmentStorageRecord(value) {
  return (
    Predicate.isObject(value) &&
    typeof value.environmentId === "string" &&
    typeof value.label === "string" &&
    typeof value.httpBaseUrl === "string" &&
    typeof value.wsBaseUrl === "string" &&
    typeof value.createdAt === "string" &&
    (value.lastConnectedAt === null || typeof value.lastConnectedAt === "string") &&
    (value.encryptedBearerToken === undefined || typeof value.encryptedBearerToken === "string")
  );
}
function readSavedEnvironmentRegistryDocument(filePath) {
  const parsed = readJsonFile(filePath);
  if (!Predicate.isObject(parsed)) {
    return { records: [] };
  }
  return {
    records: Array.isArray(parsed.records)
      ? parsed.records.filter(isPersistedSavedEnvironmentStorageRecord)
      : [],
  };
}
function toPersistedSavedEnvironmentRecord(record) {
  return {
    environmentId: record.environmentId,
    label: record.label,
    httpBaseUrl: record.httpBaseUrl,
    wsBaseUrl: record.wsBaseUrl,
    createdAt: record.createdAt,
    lastConnectedAt: record.lastConnectedAt,
  };
}
export function readClientSettings(settingsPath) {
  return readJsonFile(settingsPath)?.settings ?? null;
}
export function writeClientSettings(settingsPath, settings) {
  writeJsonFile(settingsPath, { settings });
}
export function readSavedEnvironmentRegistry(registryPath) {
  return readSavedEnvironmentRegistryDocument(registryPath).records.map((record) =>
    toPersistedSavedEnvironmentRecord(record),
  );
}
export function writeSavedEnvironmentRegistry(registryPath, records) {
  const currentDocument = readSavedEnvironmentRegistryDocument(registryPath);
  const encryptedBearerTokenById = new Map(
    currentDocument.records.flatMap((record) =>
      record.encryptedBearerToken ? [[record.environmentId, record.encryptedBearerToken]] : [],
    ),
  );
  writeJsonFile(registryPath, {
    records: records.map((record) => {
      const encryptedBearerToken = encryptedBearerTokenById.get(record.environmentId);
      return encryptedBearerToken
        ? {
            environmentId: record.environmentId,
            label: record.label,
            httpBaseUrl: record.httpBaseUrl,
            wsBaseUrl: record.wsBaseUrl,
            createdAt: record.createdAt,
            lastConnectedAt: record.lastConnectedAt,
            encryptedBearerToken,
          }
        : record;
    }),
  });
}
export function readSavedEnvironmentSecret(input) {
  const document = readSavedEnvironmentRegistryDocument(input.registryPath);
  const encoded = document.records.find(
    (record) => record.environmentId === input.environmentId,
  )?.encryptedBearerToken;
  if (!encoded) {
    return null;
  }
  if (!input.secretStorage.isEncryptionAvailable()) {
    return null;
  }
  try {
    return input.secretStorage.decryptString(Buffer.from(encoded, "base64"));
  } catch {
    return null;
  }
}
export function writeSavedEnvironmentSecret(input) {
  const document = readSavedEnvironmentRegistryDocument(input.registryPath);
  if (!input.secretStorage.isEncryptionAvailable()) {
    return false;
  }
  let found = false;
  writeJsonFile(input.registryPath, {
    records: document.records.map((record) => {
      if (record.environmentId !== input.environmentId) {
        return record;
      }
      found = true;
      const encryptedBearerToken = input.secretStorage
        .encryptString(input.secret)
        .toString("base64");
      return {
        environmentId: record.environmentId,
        label: record.label,
        httpBaseUrl: record.httpBaseUrl,
        wsBaseUrl: record.wsBaseUrl,
        createdAt: record.createdAt,
        lastConnectedAt: record.lastConnectedAt,
        encryptedBearerToken,
      };
    }),
  });
  return found;
}
export function removeSavedEnvironmentSecret(input) {
  const document = readSavedEnvironmentRegistryDocument(input.registryPath);
  if (
    !document.records.some(
      (record) =>
        record.environmentId === input.environmentId && record.encryptedBearerToken !== undefined,
    )
  ) {
    return;
  }
  writeJsonFile(input.registryPath, {
    records: document.records.map((record) => {
      if (record.environmentId !== input.environmentId) {
        return record;
      }
      return toPersistedSavedEnvironmentRecord(record);
    }),
  });
}
