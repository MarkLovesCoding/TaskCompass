"use server";
import { revalidatePath } from "next/cache";

import { getUserFromSession } from "@/lib/sessionAuth";
import { deleteTask } from "@/data-access/tasks/delete-task.persistence";
import  getProject  from "@/data-access/projects/get-project.persistence";
import { updateProject } from "@/data-access/projects/update-project.persistence";
import { deleteTaskUseCase } from "@/use-cases/task/delete-task.use-case";
import { ValidationError } from "@/use-cases/utils";

type FormData = {
  taskId: string;
  projectId:string;
};

export async function deleteTaskAction(formData: FormData) {
  const { getUser } = await getUserFromSession();

  try {
    await deleteTaskUseCase(
      {
        deleteTask,
        getProject,
        updateProject,
        getUser,
      },
      {
        taskId: formData.taskId,
        projectId: formData.projectId,
      }
    );
    revalidatePath(`/project/[slug]`);
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
