"use server";
import { revalidatePath } from "next/cache";

import { getUserFromSession } from "@/lib/sessionAuth";
import { updateTask } from "@/data-access/tasks/update-task.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";
import { updateTaskCategoryUseCase } from "@/use-cases/task/update-task-category.use-case";

type FormData = {
  id: string;
  category: string;
  // projectId: string;
};

export async function updateTaskCategoryAction(formData: FormData) {
  const { getUser } = await getUserFromSession();

  try {
    await updateTaskCategoryUseCase(
      {
        updateTask,
        getTask,
        getUser,
      },
      {
        id: formData.id,
        category: formData.category,
      }
    );
    revalidatePath("/project/[slug]");
  } catch (error: any) {
    console.error(error);
  }
}
