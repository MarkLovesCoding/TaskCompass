// export const PRIORITIES_BY_COLORS = [
//   { option: "High", color: "red" },
//   { option: "Medium", color: "yellow" },
//   { option: "Low", color: "green" },
// ];
export const PRIORITY_COLORS = {
  High: "red",
  Medium: "yellow",
  Low: "green",
} as { [key: string]: string };

export type PriorityColorType = keyof typeof PRIORITY_COLORS;
export type SortTypeType = "priority" | "category" | "status" | "";

export const CATEGORIES = [
  "Household",
  "Personal",
  "Work",
  "School",
  "Other",
] as const;
export const PRIORITIES = ["High", "Medium", "Low"] as const;
export const STATUSES = [
  "Not Started",
  "Up Next",
  "In Progress",
  "Completed",
] as const;

export type SortType = Record<string, ReadonlyArray<string>>;

export const SORT_TYPES: SortType = {
  priority: PRIORITIES,
  category: CATEGORIES,
  status: STATUSES,
};
