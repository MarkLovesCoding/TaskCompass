import type { TaskModelType } from "./types";
export function taskModelToTaskDto(task: TaskModelType) {
  const convertedAssignees =
    task.assignees.length > 0
      ? task.assignees.map((task) => task.toString())
      : [];

  const plainifyOrderInLists = JSON.parse(JSON.stringify(task.orderInLists));
  return {
    id: task._id.toString(),
    name: task.name,
    description: task.description,
    project: task.project.toString(),
    assignees: convertedAssignees,
    dueDate: task.dueDate,
    startDate: task.startDate,
    category: task.category,
    priority: task.priority,
    status: task.status,
    archived: task.archived,
    orderInLists: plainifyOrderInLists,
    // label: task.category,
  };
}
