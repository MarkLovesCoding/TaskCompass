import { AuthenticationError } from "../utils";
import type { GetUserSession } from "@/use-cases/user/types";
import type { TasksOrder } from "@/use-cases/project/types";
import type { UpdateTasksOrder } from "@/use-cases/project/types";

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
