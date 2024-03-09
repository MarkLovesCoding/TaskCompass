import { TaskEntity } from "@/entities/Task";
import {
  GetTask,
  TaskDto,
  UpdateTasksOrderInLists,
} from "@/use-cases/task/types";
import {
  GetProject,
  ProjectDto,
  UpdateProjectColumnOrder,
  UpdateTasksOrder,
} from "@/use-cases/project/types";
import { GetUserSession } from "@/use-cases/user/types";
import { taskToDto } from "@/use-cases/task/utils";
import { OrderInLists } from "@/use-cases/task/types";
import { TasksOrder } from "@/use-cases/project/types";
export async function updateProjectTasksOrderUseCase(
  context: {
    updateProjectTasksOrder: UpdateTasksOrder;

    getUser: GetUserSession;
  },
  data: {
    projectId: string;
    tasksOrder: TasksOrder;
  }
) {
  const user = context.getUser();
  if (!user) throw new Error("User not found");
  // const retrievedTask = await context.getTask(data.id);

  // const taskAsEntity = new TaskEntity({ ...retrievedTask });

  // console.log("updatedTaskEntity w name", taskAsEntity);
  //perform validation on data access layer to prevent many db calls
  await context.updateProjectTasksOrder(data.projectId, data.tasksOrder);
}
