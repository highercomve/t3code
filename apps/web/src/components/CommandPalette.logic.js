import { sortThreads } from "../lib/threadSort";
import { formatRelativeTimeLabel } from "../timestampFormat";
export const RECENT_THREAD_LIMIT = 12;
export const ITEM_ICON_CLASS = "size-4 text-muted-foreground/80";
export const ADDON_ICON_CLASS = "size-4";
export function normalizeSearchText(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}
export function buildProjectActionItems(input) {
  return input.projects.map((project) => ({
    kind: "action",
    value: `${input.valuePrefix}:${project.environmentId}:${project.id}`,
    searchTerms: [project.name, project.cwd],
    title: project.name,
    description: project.cwd,
    icon: input.icon(project),
    run: async () => {
      await input.runProject(project);
    },
  }));
}
export function buildThreadActionItems(input) {
  const sortedThreads = sortThreads(
    input.threads.filter((thread) => thread.archivedAt === null),
    input.sortOrder,
  );
  const visibleThreads =
    input.limit === undefined ? sortedThreads : sortedThreads.slice(0, input.limit);
  return visibleThreads.map((thread) => {
    const projectTitle = input.projectTitleById.get(thread.projectId);
    const descriptionParts = [];
    if (projectTitle) {
      descriptionParts.push(projectTitle);
    }
    if (thread.branch) {
      descriptionParts.push(`#${thread.branch}`);
    }
    if (thread.id === input.activeThreadId) {
      descriptionParts.push("Current thread");
    }
    return {
      kind: "action",
      value: `thread:${thread.id}`,
      searchTerms: [thread.title, projectTitle ?? "", thread.branch ?? ""],
      title: thread.title,
      description: descriptionParts.join(" · "),
      timestamp: formatRelativeTimeLabel(
        thread.latestUserMessageAt ?? thread.updatedAt ?? thread.createdAt,
      ),
      icon: input.icon,
      run: async () => {
        await input.runThread(thread);
      },
    };
  });
}
function rankSearchFieldMatch(field, normalizedQuery) {
  const normalizedField = normalizeSearchText(field);
  if (normalizedField.length === 0 || !normalizedField.includes(normalizedQuery)) {
    return Number.NEGATIVE_INFINITY;
  }
  if (normalizedField === normalizedQuery) {
    return 3;
  }
  if (normalizedField.startsWith(normalizedQuery)) {
    return 2;
  }
  return 1;
}
function rankCommandPaletteItemMatch(item, normalizedQuery) {
  const terms = item.searchTerms.filter((term) => term.length > 0);
  if (terms.length === 0) {
    return 0;
  }
  for (const [index, field] of terms.entries()) {
    const fieldRank = rankSearchFieldMatch(field, normalizedQuery);
    if (fieldRank !== Number.NEGATIVE_INFINITY) {
      return 1_000 - index * 100 + fieldRank;
    }
  }
  return 0;
}
export function filterCommandPaletteGroups(input) {
  const isActionsFilter = input.query.startsWith(">");
  const searchQuery = isActionsFilter ? input.query.slice(1) : input.query;
  const normalizedQuery = normalizeSearchText(searchQuery);
  if (normalizedQuery.length === 0) {
    if (isActionsFilter) {
      return input.activeGroups.filter((group) => group.value === "actions");
    }
    return [...input.activeGroups];
  }
  let baseGroups = [...input.activeGroups];
  if (isActionsFilter) {
    baseGroups = baseGroups.filter((group) => group.value === "actions");
  } else if (!input.isInSubmenu) {
    baseGroups = baseGroups.filter((group) => group.value !== "recent-threads");
  }
  const searchableGroups = [...baseGroups];
  if (!input.isInSubmenu && !isActionsFilter) {
    if (input.projectSearchItems.length > 0) {
      searchableGroups.push({
        value: "projects-search",
        label: "Projects",
        items: input.projectSearchItems,
      });
    }
    if (input.threadSearchItems.length > 0) {
      searchableGroups.push({
        value: "threads-search",
        label: "Threads",
        items: input.threadSearchItems,
      });
    }
  }
  return searchableGroups.flatMap((group) => {
    const items = group.items
      .map((item, index) => {
        const haystack = normalizeSearchText(item.searchTerms.join(" "));
        if (!haystack.includes(normalizedQuery)) {
          return null;
        }
        return {
          item,
          index,
          rank: rankCommandPaletteItemMatch(item, normalizedQuery),
        };
      })
      .filter((entry) => entry !== null)
      .toSorted((left, right) => right.rank - left.rank || left.index - right.index)
      .map((entry) => entry.item);
    if (items.length === 0) {
      return [];
    }
    return [{ value: group.value, label: group.label, items }];
  });
}
export function getCommandPaletteMode(input) {
  return input.currentView ? "submenu" : "root";
}
export function buildRootGroups(input) {
  const groups = [];
  if (input.actionItems.length > 0) {
    groups.push({ value: "actions", label: "Actions", items: input.actionItems });
  }
  if (input.recentThreadItems.length > 0) {
    groups.push({
      value: "recent-threads",
      label: "Recent Threads",
      items: input.recentThreadItems,
    });
  }
  return groups;
}
export function getCommandPaletteInputPlaceholder(mode) {
  switch (mode) {
    case "root":
      return "Search commands, projects, and threads...";
    case "submenu":
      return "Search...";
  }
}
