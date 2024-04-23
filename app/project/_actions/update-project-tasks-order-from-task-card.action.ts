"use server";
import { revalidatePath } from "next/cache";

import { getUserFromSession } from "@/lib/sessionAuth";
import getProject from "@/data-access/projects/get-project.persistence";
import { updateProject } from "@/data-access/projects/update-project.persistence";
import { updateProjectTasksOrderFromTaskCardUseCase } from "@/use-cases/project/update-project-tasks-order-from-task-card.use-case";
import { ValidationError } from "@/use-cases/utils";

export async function updateProjectTasksOrderFromTaskCardAction(
  projectId: string,
  taskId: string,
  taskOrderChanges: Record<string, string>
) {
  const { getUser } = await getUserFromSession();
  try {
    await updateProjectTasksOrderFromTaskCardUseCase(
      {
        updateProject,
        getProject,
        getUser,
      },
      {
        projectId: projectId,
        taskId: taskId,
        taskOrderChanges: taskOrderChanges,
      }
    );

    revalidatePath(`/project/${projectId}`);

    //for toasts, not yet implemented
    // return { success: true };
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
