import { UpdateTasksOrder } from "@/use-cases/project/types";
import { GetUserSession } from "@/use-cases/user/types";
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
  //perform validation on data access layer to prevent many db calls
  await context.updateProjectTasksOrder(data.projectId, data.tasksOrder);
}
