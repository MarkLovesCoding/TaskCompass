import { TaskEntity } from "@/entities/Task";
import { UpdateTask, GetTask } from "@/use-cases/task/types";
import { GetUser } from "@/use-cases/user/types";
import { taskToDto } from "@/use-cases/task/utils";

export async function updateTaskPriorityUseCase(
  context: {
    updateTask: UpdateTask;
    getTask: GetTask;
    getUser: GetUser;
  },
  data: {
    id: string;
    priority: string;
  }
) {
  const user = context.getUser();
  if (!user) throw new Error("User not found");
  const retrievedTask = await context.getTask(data.id);

  const taskAsEntity = new TaskEntity({ ...retrievedTask });
  taskAsEntity.updatePriority(data.priority);

  await context.updateTask(taskToDto(taskAsEntity));
}
