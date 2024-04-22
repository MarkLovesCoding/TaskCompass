import { TaskEntity } from "@/entities/Task";
import { UpdateTask, GetTask } from "@/use-cases/task/types";
import { GetUserSession } from "@/use-cases/user/types";
import { taskToDto } from "@/use-cases/task/utils";
import { AuthenticationError } from "../utils";
export async function updateTaskDueDateUseCase(
  context: {
    updateTask: UpdateTask;
    getTask: GetTask;
    getUser: GetUserSession;
  },
  data: {
    id: string;
    dueDate: Date;
  }
) {
  const user = context.getUser();
  if (!user) throw new AuthenticationError();
  const retrievedTask = await context.getTask(data.id);

  const taskAsEntity = new TaskEntity({ ...retrievedTask });
  taskAsEntity.updateDueDate(data.dueDate);

  await context.updateTask(taskToDto(taskAsEntity));
}
