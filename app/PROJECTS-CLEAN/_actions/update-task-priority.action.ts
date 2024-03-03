"use server";
import { updateTask } from "@/data-access/tasks/update-task.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";
import { updateTaskPriorityUseCase } from "@/use-cases/task/update-task-priority.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
import { revalidatePath } from "next/cache";

type FormData = {
  id: string;
  priority: string;
  // projectId: string;
};

export async function updateTaskPriorityAction(formData: FormData) {
  console.log("updatingformNameData", formData);
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
    // revalidatePath(`/PROJECTS-CLEAN/${formData.projectId}`);
    revalidatePath("/PROJECTS-CLEAN/[slug]/page");
  } catch (error: any) {
    console.error(error);
  }
}
