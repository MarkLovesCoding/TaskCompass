"use server";

import { updateTasks } from "@/data-access/tasks/update-tasks.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";

import { updateTasksUseCase } from "@/use-cases/task/update-tasks.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
import { revalidatePath } from "next/cache";
import { TaskDto } from "@/use-cases/task/types";
import { ValidationError } from "@/use-cases/utils";

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
      }
    );
    revalidatePath(`/project/${projectId}/page`);
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
