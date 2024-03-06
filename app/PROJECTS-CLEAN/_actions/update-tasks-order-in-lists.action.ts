"use server";
import { updateTask } from "@/data-access/tasks/update-task.persistence";
import { updateTasksOrderInLists } from "@/data-access/tasks/update-tasks-order-in-lists.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";

import { updateTasksOrderInListsUseCase } from "@/use-cases/task/update-tasks-order-in-lists.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
import { revalidatePath } from "next/cache";
import { OrderInLists, TaskDto } from "@/use-cases/task/types";

export async function updateTasksOrderInListsAction(
  projectId: string,
  tasks: TaskDto[]
) {
  const { getUser } = await getUserFromSession();

  try {
    await updateTasksOrderInListsUseCase(
      {
        updateTasksOrderInLists,
        getTask,
        getUser,
      },
      {
        projectId: projectId,
        tasks: tasks,
        // label: formData.label,
      }
    );
    revalidatePath(`/PROJECTS-CLEAN/${projectId}/page`);
    // revalidatePath("/PROJECTS-CLEAN/[slug]/page");
  } catch (error: any) {
    console.error(error);
  }
}
