import { TaskEntity } from "@/entities/Task";
import { UpdateTask, GetTask } from "@/use-cases/task/types";
import { GetUserSession } from "@/use-cases/user/types";
import { taskToDto } from "@/use-cases/task/utils";

export async function updateTaskDescriptionUseCase(
  context: {
    updateTask: UpdateTask;
    getTask: GetTask;
    getUser: GetUserSession;
  },
  data: {
    id: string;
    description: string;
  }
) {
  const user = context.getUser();
  if (!user) throw new Error("User not found");
  const retrievedTask = await context.getTask(data.id);
  console.log("retrieved task old desc", retrievedTask);
  console.log("data description", data.description);

  const taskAsEntity = new TaskEntity({ ...retrievedTask });
  taskAsEntity.updateDescription(data.description);
  console.log("updatedTaskEntity w description", taskAsEntity);
  await context.updateTask(taskToDto(taskAsEntity));
}
