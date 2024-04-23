import { AuthenticationError } from "../utils";

import type { GetUserSession } from "@/use-cases/user/types";
import type { GetTask, TaskDto, UpdateTasks } from "@/use-cases/task/types";

export async function updateTasksUseCase(
  context: {
    updateTasks: UpdateTasks;
    getTask: GetTask;
    getUser: GetUserSession;
  },
  data: {
    projectId: string;
    tasks: TaskDto[];
  }
) {
  const user = context.getUser();
  if (!user) throw new AuthenticationError();
  try {
    await context.updateTasks(data.tasks);
  } catch (err) {
    throw new Error("Error updating tasks");
  }
}
