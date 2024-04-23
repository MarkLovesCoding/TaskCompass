"use server";
import { revalidatePath } from "next/cache";

import { getUserFromSession } from "@/lib/sessionAuth";
import { updateProjectTasksOrder } from "@/data-access/projects/update-project-tasks-order.persistence";
import { updateProjectTasksOrderUseCase } from "@/use-cases/project/update-project-tasks-order.use-case";
import { ValidationError } from "@/use-cases/utils";
import { TasksOrder } from "@/entities/Project";

export async function updateProjectTasksOrderAction(
  projectId: string,

  tasksOrder: TasksOrder
) {
  const { getUser } = await getUserFromSession();
  try {
    await updateProjectTasksOrderUseCase(
      {
        updateProjectTasksOrder,
        getUser,
      },
      {
        projectId: projectId,
        tasksOrder: tasksOrder,
      }
    );

    revalidatePath(`/project/${projectId}`);
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
