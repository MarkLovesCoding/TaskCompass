"use server";
import { updateTask } from "@/data-access/tasks/update-task.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";
import { updateTaskPriorityUseCase } from "@/use-cases/task/update-task-priority.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
import { revalidatePath } from "next/cache";

type FormData = {
  id: string;
  priority: string;
};

export async function updateTaskPriorityAction(formData: FormData) {
  const { getUser } = await getUserFromSession();

  try {
    await updateTaskPriorityUseCase(
      {
        updateTask,
        getTask,
        getUser,
      },
      {
        id: formData.id,
        priority: formData.priority,
      }
    );
    revalidatePath("/project/[slug]");
  } catch (error: any) {
    console.error(error);
  }
}
