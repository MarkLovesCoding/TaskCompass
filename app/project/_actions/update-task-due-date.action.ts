"use server";
import { updateTask } from "@/data-access/tasks/update-task.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";
import { updateTaskDueDateUseCase } from "@/use-cases/task/update-task-due-date.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
import { revalidatePath } from "next/cache";

type FormData = {
  id: string;
  dueDate: Date;
  projectId: string;
};

export async function updateTaskDueDateAction(formData: FormData) {
  const { getUser } = await getUserFromSession();

  try {
    await updateTaskDueDateUseCase(
      {
        updateTask,
        getTask,
        getUser,
      },
      {
        id: formData.id,
        dueDate: formData.dueDate,
      }
    );
    // revalidatePath(`/PROJECTS-CLEAN/${formData.projectId}`);
    revalidatePath(`/project/[slug]`);

    return {
      id: formData.id,
    };
  } catch (error: any) {
    console.error(error);
  }
}
