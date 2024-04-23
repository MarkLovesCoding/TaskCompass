import { userToDto } from "../user/utils";
import { taskToDto } from "@/use-cases/task/utils";
import { TaskEntity, TaskEntityValidationError } from "@/entities/Task";
import { UserEntity, UserEntityValidationError } from "@/entities/User";
import { AuthenticationError, ValidationError } from "../utils";

import type { UpdateTask, GetTask } from "@/use-cases/task/types";
import type {
  GetUserSession,
  UpdateUser,
  GetUser,
} from "@/use-cases/user/types";

export async function updateTaskUseCase(
  context: {
    updateTask: UpdateTask;
    updateUser: UpdateUser;
    getTask: GetTask;
    getUser: GetUserSession;
    getUserObject: GetUser;
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

  const task = await context.getTask(data.id);
  if (!task) throw new Error("Task not found");

  try {
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
    await context.updateTask(taskToDto(taskAsEntity));
  } catch (err) {
    const error = err as TaskEntityValidationError;
    throw new ValidationError(error.getErrors());
  }

  const removedAssignees = data.originalAssignees.filter(
    (assignee) => !data.assignees.includes(assignee)
  );
  const addedAssignees = data.assignees.filter(
    (assignee) => !data.originalAssignees.includes(assignee)
  );

  try {
    for (const assignee of removedAssignees) {
      const user = await context.getUserObject(assignee);
      const userAsEntity = new UserEntity(user);
      userAsEntity.removeTask(data.id);
      await context.updateUser(userToDto(userAsEntity));
    }
  } catch (err) {
    const error = err as UserEntityValidationError;
    throw new ValidationError(error.getErrors());
  }

  try {
    for (const assignee of addedAssignees) {
      const user = await context.getUserObject(assignee);
      const userAsEntity = new UserEntity(user);
      userAsEntity.addTask(data.id);
      await context.updateUser(userToDto(userAsEntity));
    }
  } catch (err) {
    const error = err as UserEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
