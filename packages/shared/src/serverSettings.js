import { ServerSettings } from "@t3tools/contracts";
import { Schema } from "effect";
import { fromLenientJson } from "./schemaJson";
const ServerSettingsJson = fromLenientJson(ServerSettings);
export function normalizePersistedServerSettingString(value) {
    const trimmed = value?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : undefined;
}
export function extractPersistedServerObservabilitySettings(input) {
    return {
        otlpTracesUrl: normalizePersistedServerSettingString(input.observability?.otlpTracesUrl),
        otlpMetricsUrl: normalizePersistedServerSettingString(input.observability?.otlpMetricsUrl),
    };
}
export function parsePersistedServerObservabilitySettings(raw) {
    try {
        const decoded = Schema.decodeUnknownSync(ServerSettingsJson)(raw);
        return extractPersistedServerObservabilitySettings(decoded);
    }
    catch {
        return { otlpTracesUrl: undefined, otlpMetricsUrl: undefined };
    }
}
