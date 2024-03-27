import { GetTask, TaskDto, UpdateTasks } from "@/use-cases/task/types";
import { GetUserSession } from "@/use-cases/user/types";
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
  if (!user) throw new Error("User not found");
  await context.updateTasks(data.tasks);
}
