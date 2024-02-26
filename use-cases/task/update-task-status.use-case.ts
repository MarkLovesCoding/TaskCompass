import { TaskEntity } from "@/entities/Task";
import { UpdateTask, GetTask } from "@/use-cases/task/types";
import { GetUserSession } from "@/use-cases/user/types";
import { taskToDto } from "@/use-cases/task/utils";

export async function updateTaskStatusUseCase(
  context: {
    updateTask: UpdateTask;
    getTask: GetTask;
    getUser: GetUserSession;
  },
  data: {
    id: string;
    status: string;
  }
) {
  const user = context.getUser();
  if (!user) throw new Error("User not found");
  const retrievedTask = await context.getTask(data.id);

  const taskAsEntity = new TaskEntity({ ...retrievedTask });
  taskAsEntity.updateStatus(data.status);

  await context.updateTask(taskToDto(taskAsEntity));
}
