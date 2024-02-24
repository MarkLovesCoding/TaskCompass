import type { TaskDto } from "@/use-cases/task/types";
import type { SortType } from "./constants";

// Type guard to check if 'key' is a valid key of type 'T'
function isValidKey<T extends object>(obj: T, key: keyof any): key is keyof T {
  return key in obj;
}

export const sortByType = (
  type: string,
  sortType: SortType,
  tasks: TaskDto[]
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

    // Add the filtered tasks to the result object
    return {
      ...result,
      [value]: filteredTasks,
    };
  }, {});
};