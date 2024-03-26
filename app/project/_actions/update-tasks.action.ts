"use server";

import { updateTasks } from "@/data-access/tasks/update-tasks.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";

import { updateTasksUseCase } from "@/use-cases/task/update-tasks.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
import { revalidatePath } from "next/cache";
import { OrderInLists, TaskDto } from "@/use-cases/task/types";

export async function updateTasksAction(projectId: string, tasks: TaskDto[]) {
  const { getUser } = await getUserFromSession();

  try {
    await updateTasksUseCase(
      {
        updateTasks,
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
