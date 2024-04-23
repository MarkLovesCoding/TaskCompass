import { taskToDto } from "@/use-cases/task/utils";
import { TaskEntity, TaskEntityValidationError } from "@/entities/Task";
import { AuthenticationError, ValidationError } from "../utils";

import type { UpdateTask, GetTask } from "@/use-cases/task/types";
import type { GetUserSession } from "@/use-cases/user/types";

export async function updateTaskArchivedUseCase(
  context: {
    updateTask: UpdateTask;
    getTask: GetTask;
    getUser: GetUserSession;
  },
  data: {
    id: string;
    project: string;
    archived: boolean;
  }
) {
  const user = context.getUser();
  if (!user) throw new AuthenticationError();

  try {
    const retrievedTask = await context.getTask(data.id);
    const taskAsEntity = new TaskEntity({ ...retrievedTask });
    taskAsEntity.updateArchived(data.archived);
    await context.updateTask(taskToDto(taskAsEntity));
  } catch (err) {
    const error = err as TaskEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
