import { TaskEntity } from "@/entities/Task";
import {
  GetTask,
  TaskDto,
  UpdateTasksOrderInLists,
} from "@/use-cases/task/types";
import { GetUserSession } from "@/use-cases/user/types";
import { taskToDto } from "@/use-cases/task/utils";
import { OrderInLists } from "@/use-cases/task/types";
export async function updateTasksOrderInListsUseCase(
  context: {
    updateTasksOrderInLists: UpdateTasksOrderInLists;
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
  // const retrievedTask = await context.getTask(data.id);

  // const taskAsEntity = new TaskEntity({ ...retrievedTask });

  // console.log("updatedTaskEntity w name", taskAsEntity);
  //perform validation on data access layer to prevent many db calls
  await context.updateTasksOrderInLists(data.tasks);
}
