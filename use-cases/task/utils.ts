import { TaskEntity } from "@/entities/Task";

import type { TaskDto, CreateTaskDto } from "@/use-cases/task/types";

export function taskToDto(task: TaskEntity): TaskDto {
  const taskId = task.getId();
  if (!taskId) throw new Error("Project id is required");
  return {
    id: taskId,
    name: task.getName(),
    description: task.getDescription(),
    project: task.getProject(),
    assignees: task.getAssignees(),
    dueDate: task.getDueDate(),
    startDate: task.getStartDate(),
    category: task.getCategory(),
    archived: task.getArchived(),
    priority: task.getPriority(),
    status: task.getStatus(),
  };
}
export function taskToCreateTaskDto(task: TaskEntity): CreateTaskDto {
  return {
    name: task.getName(),
    description: task.getDescription(),
    project: task.getProject(),
    assignees: task.getAssignees(),
    dueDate: task.getDueDate(),
    startDate: task.getStartDate(),
    category: task.getCategory(),
    archived: task.getArchived(),
    priority: task.getPriority(),
    status: task.getStatus(),
  };
}
