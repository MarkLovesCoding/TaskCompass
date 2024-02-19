"use server";
import { updateTask } from "@/data-access/tasks/update-task.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";
import { updateTaskStatusUseCase } from "@/use-cases/task/update-task-status.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
import { revalidatePath } from "next/cache";

type FormData = {
  id: string;
  status: string;
  projectId: string;
};

export async function updateTaskStatusAction(formData: FormData) {
  console.log("updatingformNameData", formData);
  const { getUser } = await getUserFromSession();

  try {
    await updateTaskStatusUseCase(
      {
        updateTask,
        getTask,
        getUser,
      },
      {
        id: formData.id,
        status: formData.status,
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
