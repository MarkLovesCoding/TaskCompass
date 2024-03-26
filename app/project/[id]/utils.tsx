import type { TaskDto } from "@/use-cases/task/types";
import type { SortType } from "./constants";
import { ProjectDto } from "@/use-cases/project/types";

// Type guard to check if 'key' is a valid key of type 'T'
function isValidKey<T extends object>(obj: T, key: keyof any): key is keyof T {
  return key in obj;
}

export const sortByType = (
  type: string,
  sortType: SortType,
  tasks: TaskDto[],
  project: ProjectDto
): { [key: string]: TaskDto[] } => {
  if (!sortType[type]) {
    return {};
  }

  return sortType[type].reduce((result, value) => {
    // Filter tasks based on the current value of the type
    const filteredTasks = tasks.filter((task) => {
      if (isValidKey(task, type)) {
        return task[type] === value;
      }
      return false;
    });
    // filteredTasks.sort(
    //   (a, b) => a.orderInLists[type][1] - b.orderInLists[type][1]
    // );

    // Add the filtered tasks to the result object
    return {
      ...result,
      [value]: filteredTasks,
    };
  }, {});
};
export function capitalizeEachWord(str: string) {
  if (typeof str !== "string" || str.length === 0) {
    return str;
  }

  return str
    .split(" ")
    .map((word) => {
      const firstLetter = word.charAt(0).toUpperCase();
      const restOfWord = word.slice(1).toLowerCase();
      return firstLetter + restOfWord;
    })
    .join(" ");
}
