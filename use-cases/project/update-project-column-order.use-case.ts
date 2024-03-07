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
} from "@/use-cases/project/types";
import { GetUserSession } from "@/use-cases/user/types";
import { taskToDto } from "@/use-cases/task/utils";
import { OrderInLists } from "@/use-cases/task/types";
export async function updateProjectColumnOrderUseCase(
  context: {
    updateProjectColumnOrder: UpdateProjectColumnOrder;

    getUser: GetUserSession;
  },
  data: {
    projectId: string;
    type: string;
    columnOrder: string[];
  }
) {
  const user = context.getUser();
  if (!user) throw new Error("User not found");
  // const retrievedTask = await context.getTask(data.id);

  // const taskAsEntity = new TaskEntity({ ...retrievedTask });

  // console.log("updatedTaskEntity w name", taskAsEntity);
  //perform validation on data access layer to prevent many db calls
  await context.updateProjectColumnOrder(
    data.projectId,
    data.type,
    data.columnOrder
  );
}
