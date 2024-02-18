"use server";
import { updateTask } from "@/data-access/tasks/update-task.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";
import { updateTaskNameUseCase } from "@/use-cases/task/update-task-name.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
import { revalidatePath } from "next/cache";

type FormData = {
  id: string;
  name: string;
  projectId: string;
};

export async function updateTaskNameAction(formData: FormData) {
  console.log("updatingformNameData", formData);
  const { getUser } = await getUserFromSession();

  try {
    await updateTaskNameUseCase(
      {
        updateTask,
        getTask,
        getUser,
      },
      {
        id: formData.id,
        name: formData.name,
      }
    );
    // revalidatePath(`/PROJECTS-CLEAN/${formData.projectId}`);
    revalidatePath("/PROJECTS-CLEAN/[slug]");
    return {
      id: formData.id,
    };
  } catch (error: any) {
    console.error(error);
  }
}
