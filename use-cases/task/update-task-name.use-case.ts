import { TaskEntity } from "@/entities/Task";
import { UpdateTask, GetTask } from "@/use-cases/task/types";
import { GetUser } from "@/use-cases/user/types";
import { taskToDto } from "@/use-cases/task/utils";

export async function updateTaskNameUseCase(
  context: {
    updateTask: UpdateTask;
    getTask: GetTask;
    getUser: GetUser;
  },
  data: {
    id: string;
    name: string;
  }
) {
  const user = context.getUser();
  if (!user) throw new Error("User not found");
  const retrievedTask = await context.getTask(data.id);
  console.log("retrieved task old name", retrievedTask);
  console.log("data name", data.name);

  const taskAsEntity = new TaskEntity({ ...retrievedTask });
  taskAsEntity.updateName(data.name);
  console.log("updatedTaskEntity w name", taskAsEntity);
  await context.updateTask(taskToDto(taskAsEntity));
}
