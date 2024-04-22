import { UpdateTasksOrder } from "@/use-cases/project/types";
import { GetUserSession } from "@/use-cases/user/types";
import { TasksOrder } from "@/use-cases/project/types";
import { AuthenticationError } from "../utils";

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
  if (!user) throw new AuthenticationError();
  //perform validation on data access layer to prevent many db calls
  try {
    await context.updateProjectTasksOrder(data.projectId, data.tasksOrder);
  } catch (err) {
    throw new Error("Error updating project tasks order. Please try again.");
  }
}
