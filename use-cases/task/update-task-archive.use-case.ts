import { TaskEntity } from "@/entities/Task";
import { UpdateTask, GetTask } from "@/use-cases/task/types";
import { GetUserSession } from "@/use-cases/user/types";
import { taskToDto } from "@/use-cases/task/utils";

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
  if (!user) throw new Error("User not found");
  const retrievedTask = await context.getTask(data.id);
  console.log("retrieved task old desc", retrievedTask);
  console.log("data archive status", data.archived);

  const taskAsEntity = new TaskEntity({ ...retrievedTask });
  taskAsEntity.updateArchived(data.archived);
  console.log("updatedTaskEntity w description", taskAsEntity);
  await context.updateTask(taskToDto(taskAsEntity));
}
