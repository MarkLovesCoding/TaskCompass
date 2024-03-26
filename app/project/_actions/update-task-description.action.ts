"use server";
import { updateTask } from "@/data-access/tasks/update-task.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";
import { updateTaskDescriptionUseCase } from "@/use-cases/task/update-task-description.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
import { revalidatePath } from "next/cache";

type FormData = {
  id: string;
  description: string;
  projectId: string;
};

export async function updateTaskDescriptionAction(formData: FormData) {
  console.log("updatingformDescriptionData", formData);
  const { getUser } = await getUserFromSession();

  try {
    await updateTaskDescriptionUseCase(
      {
        updateTask,
        getTask,
        getUser,
      },
      {
        id: formData.id,
        description: formData.description,
      }
    );
    revalidatePath(`/PROJECTS-CLEAN/${formData.projectId}`);
    return {
      id: formData.id,
    };
  } catch (error: any) {
    console.error(error);
  }
}
