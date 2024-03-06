import { TaskEntity } from "@/entities/Task";
import { GetTask, UpdateTaskOrderInLists } from "@/use-cases/task/types";
import { GetUserSession } from "@/use-cases/user/types";
import { taskToDto } from "@/use-cases/task/utils";
import { OrderInLists } from "@/use-cases/task/types";
export async function updateTaskOrderInListsUseCase(
  context: {
    updateTaskOrderInLists: UpdateTaskOrderInLists;
    getTask: GetTask;
    getUser: GetUserSession;
  },
  data: {
    id: string;
    projectId: string;
    orderInLists: OrderInLists;
  }
) {
  const user = context.getUser();
  if (!user) throw new Error("User not found");
  const retrievedTask = await context.getTask(data.id);

  const taskAsEntity = new TaskEntity({ ...retrievedTask });
  taskAsEntity.updateOrderInLists(data.orderInLists);
  console.log("updatedTaskEntity w name", taskAsEntity);
  await context.updateTaskOrderInLists(taskToDto(taskAsEntity));
}
