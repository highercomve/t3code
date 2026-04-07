const SORT_LOCALE_OPTIONS = { numeric: true, sensitivity: "base" };
function normalizePathSegments(pathValue) {
    return pathValue
        .replaceAll("\\", "/")
        .split("/")
        .filter((segment) => segment.length > 0);
}
function compareByName(a, b) {
    return a.name.localeCompare(b.name, undefined, SORT_LOCALE_OPTIONS);
}
function readStat(file) {
    if (typeof file.additions !== "number" || typeof file.deletions !== "number") {
        return null;
    }
    return {
        additions: file.additions,
        deletions: file.deletions,
    };
}
function compactDirectoryNode(node) {
    const compactedChildren = node.children.map((child) => child.kind === "directory" ? compactDirectoryNode(child) : child);
    let compactedNode = {
        ...node,
        children: compactedChildren,
    };
    while (compactedNode.children.length === 1 && compactedNode.children[0]?.kind === "directory") {
        const onlyChild = compactedNode.children[0];
        compactedNode = {
            kind: "directory",
            name: `${compactedNode.name}/${onlyChild.name}`,
            path: onlyChild.path,
            stat: onlyChild.stat,
            children: onlyChild.children,
        };
    }
    return compactedNode;
}
function toTreeNodes(directory) {
    const subdirectories = Array.from(directory.directories.values())
        .toSorted(compareByName)
        .map((subdirectory) => ({
        kind: "directory",
        name: subdirectory.name,
        path: subdirectory.path,
        stat: {
            additions: subdirectory.stat.additions,
            deletions: subdirectory.stat.deletions,
        },
        children: toTreeNodes(subdirectory),
    }))
        .map((subdirectory) => compactDirectoryNode(subdirectory));
    const files = directory.files.toSorted(compareByName);
    return [...subdirectories, ...files];
}
export function summarizeTurnDiffStats(files) {
    return files.reduce((acc, file) => {
        const stat = readStat(file);
        if (!stat)
            return acc;
        return {
            additions: acc.additions + stat.additions,
            deletions: acc.deletions + stat.deletions,
        };
    }, { additions: 0, deletions: 0 });
}
export function buildTurnDiffTree(files) {
    const root = {
        name: "",
        path: "",
        stat: { additions: 0, deletions: 0 },
        directories: new Map(),
        files: [],
    };
    for (const file of files) {
        const segments = normalizePathSegments(file.path);
        if (segments.length === 0) {
            continue;
        }
        const filePath = segments.join("/");
        const fileName = segments.at(-1);
        if (!fileName) {
            continue;
        }
        const stat = readStat(file);
        const ancestors = [root];
        let currentDirectory = root;
        for (const segment of segments.slice(0, -1)) {
            const nextPath = currentDirectory.path ? `${currentDirectory.path}/${segment}` : segment;
            const existing = currentDirectory.directories.get(segment);
            if (existing) {
                currentDirectory = existing;
            }
            else {
                const created = {
                    name: segment,
                    path: nextPath,
                    stat: { additions: 0, deletions: 0 },
                    directories: new Map(),
                    files: [],
                };
                currentDirectory.directories.set(segment, created);
                currentDirectory = created;
            }
            ancestors.push(currentDirectory);
        }
        currentDirectory.files.push({
            kind: "file",
            name: fileName,
            path: filePath,
            stat,
        });
        if (stat) {
            for (const ancestor of ancestors) {
                ancestor.stat.additions += stat.additions;
                ancestor.stat.deletions += stat.deletions;
            }
        }
    }
    return toTreeNodes(root);
}
