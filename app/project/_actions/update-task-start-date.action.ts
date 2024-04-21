"use server";
import { updateTask } from "@/data-access/tasks/update-task.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";
import { updateTaskStartDateUseCase } from "@/use-cases/task/update-task-start-date.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
import { revalidatePath } from "next/cache";

type FormData = {
  id: string;
  startDate: Date;
  projectId: string;
};

export async function updateTaskStartDateAction(formData: FormData) {
  const { getUser } = await getUserFromSession();

  try {
    await updateTaskStartDateUseCase(
      {
        updateTask,
        getTask,
        getUser,
      },
      {
        id: formData.id,
        startDate: formData.startDate,
      }
    );
    revalidatePath("/project/[slug]");
    return {
      id: formData.id,
    };
  } catch (error: any) {
    console.error(error);
  }
}
