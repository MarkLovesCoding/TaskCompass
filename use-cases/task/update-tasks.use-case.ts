import { GetTask, TaskDto, UpdateTasks } from "@/use-cases/task/types";
import { GetUserSession } from "@/use-cases/user/types";
import { AuthenticationError } from "../utils";
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
