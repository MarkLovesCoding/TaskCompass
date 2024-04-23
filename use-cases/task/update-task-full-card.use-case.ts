import { taskToDto } from "@/use-cases/task/utils";
import { TaskEntity, TaskEntityValidationError } from "@/entities/Task";
import { AuthenticationError, ValidationError } from "../utils";

import type { UpdateTaskFullCard, GetTask } from "@/use-cases/task/types";
import type { GetUserSession } from "@/use-cases/user/types";

export async function updateTaskFullCardUseCase(
  context: {
    updateTaskFullCard: UpdateTaskFullCard;

    getTask: GetTask;
    getUser: GetUserSession;
  },
  data: {
    id: string;
    name: string;
    description: string;
    project: string;
    assignees: string[];
    dueDate: Date;
    startDate: Date;
    category: string;
    priority: string;
    status: string;
    originalAssignees: string[];
  }
) {
  const user = context.getUser();
  if (!user) throw new AuthenticationError();
  try {
    const task = await context.getTask(data.id);
    if (!task) throw new Error("Task not found");
    const taskAsEntity = new TaskEntity({
      ...task,
      project: data.project,
      name: data.name,
      description: data.description,
      assignees: data.assignees,
      dueDate: data.dueDate,
      startDate: data.startDate,
      category: data.category,
      priority: data.priority,
      status: data.status,
    });
    const removedAssignees =
      data.originalAssignees.length > 0
        ? data.originalAssignees.filter(
            (assignee) => !data.assignees.includes(assignee)
          )
        : [];

    const addedAssignees =
      data.assignees.length > 0
        ? data.assignees.filter(
            (assignee) => !data.originalAssignees.includes(assignee)
          )
        : [];
    await context.updateTaskFullCard(
      taskToDto(taskAsEntity),
      removedAssignees,
      addedAssignees
    );
  } catch (err) {
    const error = err as TaskEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
