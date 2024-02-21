"use server";
import { updateTask } from "@/data-access/tasks/update-task.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";
import { updateTaskArchivedUseCase } from "@/use-cases/task/update-task-archive.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
import { revalidatePath } from "next/cache";

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
        // assignees: formData.assignees,
        archived: formData.archived,
        // label: formData.label,
      }
    );
    revalidatePath(`/PROJECTS-CLEAN/${formData.projectId}`);
    // revalidatePath("/PROJECTS-CLEAN/[slug]");
    return {
      id: formData.id,

      project: formData.projectId,
      // assignees: formData.assignees,
      // dueDate: formData.dueDate,
      // startDate: formData.startDate,
      // complete: formData.complete,
      // category: formData.category,
      // priority: formData.priority,
      // status: formData.status,
      archived: formData.archived,
    };
  } catch (error: any) {
    console.error(error);
  }
}
