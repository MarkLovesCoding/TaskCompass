"use server";
import { revalidatePath } from "next/cache";

import { getUserFromSession } from "@/lib/sessionAuth";
import { updateTask } from "@/data-access/tasks/update-task.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";
import { updateTaskArchivedUseCase } from "@/use-cases/task/update-task-archive.use-case";

type FormData = {
  id: string;
  archived: boolean;
  projectId: string;
};

export async function updateTaskArchivedAction(formData: FormData) {
  console.log("updatingformData", formData);
  const { getUser } = await getUserFromSession();

  try {
    await updateTaskArchivedUseCase(
      {
        updateTask,
        getTask,
        getUser,
      },
      {
        id: formData.id,
        project: formData.projectId,
        archived: formData.archived,
      }
    );
    revalidatePath(`/project/${formData.projectId}`);

    return {
      id: formData.id,

      project: formData.projectId,
      archived: formData.archived,
    };
  } catch (error: any) {
    console.error(error);
  }
}
