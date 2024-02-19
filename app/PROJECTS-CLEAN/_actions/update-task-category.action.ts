"use server";
import { updateTask } from "@/data-access/tasks/update-task.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";
import { updateTaskCategoryUseCase } from "@/use-cases/task/update-task-category.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
import { revalidatePath } from "next/cache";

type FormData = {
  id: string;
  category: string;
  projectId: string;
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
    // revalidatePath(`/PROJECTS-CLEAN/${formData.projectId}`);
    revalidatePath("/PROJECTS-CLEAN/[slug]");
    return {
      id: formData.id,
    };
  } catch (error: any) {
    console.error(error);
  }
}
