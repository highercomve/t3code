export function normalizeSearchQuery(input, options) {
    const trimmed = input.trim();
    if (!trimmed) {
        return "";
    }
    return options?.trimLeadingPattern
        ? trimmed.replace(options.trimLeadingPattern, "").toLowerCase()
        : trimmed.toLowerCase();
}
export function scoreSubsequenceMatch(value, query) {
    if (!query)
        return 0;
    let queryIndex = 0;
    let firstMatchIndex = -1;
    let previousMatchIndex = -1;
    let gapPenalty = 0;
    for (let valueIndex = 0; valueIndex < value.length; valueIndex += 1) {
        if (value[valueIndex] !== query[queryIndex]) {
            continue;
        }
        if (firstMatchIndex === -1) {
            firstMatchIndex = valueIndex;
        }
        if (previousMatchIndex !== -1) {
            gapPenalty += valueIndex - previousMatchIndex - 1;
        }
        previousMatchIndex = valueIndex;
        queryIndex += 1;
        if (queryIndex === query.length) {
            const spanPenalty = valueIndex - firstMatchIndex + 1 - query.length;
            const lengthPenalty = Math.min(64, value.length - query.length);
            return firstMatchIndex * 2 + gapPenalty * 3 + spanPenalty + lengthPenalty;
        }
    }
    return null;
}
function lengthPenalty(value, query) {
    return Math.min(64, Math.max(0, value.length - query.length));
}
function findBoundaryMatchIndex(value, query, boundaryMarkers) {
    let bestIndex = null;
    for (const marker of boundaryMarkers) {
        const index = value.indexOf(`${marker}${query}`);
        if (index === -1) {
            continue;
        }
        const matchIndex = index + marker.length;
        if (bestIndex === null || matchIndex < bestIndex) {
            bestIndex = matchIndex;
        }
    }
    return bestIndex;
}
/**
 * Scores how well `value` matches `query` using tiered match strategies.
 *
 * **Expects pre-normalized inputs**: both `value` and `query` must already be
 * trimmed and lowercased (e.g. via {@link normalizeSearchQuery}).
 */
export function scoreQueryMatch(input) {
    const { value, query } = input;
    if (!value || !query) {
        return null;
    }
    if (value === query) {
        return input.exactBase;
    }
    if (input.prefixBase !== undefined && value.startsWith(query)) {
        return input.prefixBase + lengthPenalty(value, query);
    }
    if (input.boundaryBase !== undefined) {
        const boundaryIndex = findBoundaryMatchIndex(value, query, input.boundaryMarkers ?? [" ", "-", "_", "/"]);
        if (boundaryIndex !== null) {
            return input.boundaryBase + boundaryIndex * 2 + lengthPenalty(value, query);
        }
    }
    if (input.includesBase !== undefined) {
        const includesIndex = value.indexOf(query);
        if (includesIndex !== -1) {
            return input.includesBase + includesIndex * 2 + lengthPenalty(value, query);
        }
    }
    if (input.fuzzyBase !== undefined) {
        const fuzzyScore = scoreSubsequenceMatch(value, query);
        if (fuzzyScore !== null) {
            return input.fuzzyBase + fuzzyScore;
        }
    }
    return null;
}
export function compareRankedSearchResults(left, right) {
    const scoreDelta = left.score - right.score;
    if (scoreDelta !== 0)
        return scoreDelta;
    return left.tieBreaker.localeCompare(right.tieBreaker);
}
function findInsertionIndex(rankedEntries, candidate) {
    let low = 0;
    let high = rankedEntries.length;
    while (low < high) {
        const middle = low + Math.floor((high - low) / 2);
        const current = rankedEntries[middle];
        if (!current) {
            break;
        }
        if (compareRankedSearchResults(candidate, current) < 0) {
            high = middle;
        }
        else {
            low = middle + 1;
        }
    }
    return low;
}
export function insertRankedSearchResult(rankedEntries, candidate, limit) {
    if (limit <= 0) {
        return;
    }
    const insertionIndex = findInsertionIndex(rankedEntries, candidate);
    if (rankedEntries.length < limit) {
        rankedEntries.splice(insertionIndex, 0, candidate);
        return;
    }
    if (insertionIndex >= limit) {
        return;
    }
    rankedEntries.splice(insertionIndex, 0, candidate);
    rankedEntries.pop();
}
