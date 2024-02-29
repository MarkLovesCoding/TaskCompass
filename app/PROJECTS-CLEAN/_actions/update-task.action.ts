"use server";
import { updateTask } from "@/data-access/tasks/update-task.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";
import { updateTaskUseCase } from "@/use-cases/task/update-task.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
import { revalidatePath } from "next/cache";

type FormData = {
  id: string;
  name: string;
  description: string;
  projectId: string;
  assignees: string[];
  dueDate: Date;
  startDate: Date;
  // archived: boolean;
  category: string;
  priority: string;
  status: string;
  // label?: string | undefined;
};

export async function updateTaskAction(formData: FormData) {
  console.log("updatingformData", formData);
  const { getUser } = await getUserFromSession();

  try {
    await updateTaskUseCase(
      {
        updateTask,
        getTask,
        getUser,
      },
      {
        id: formData.id,
        name: formData.name,
        description: formData.description,
        project: formData.projectId,
        assignees: formData.assignees,
        dueDate: formData.dueDate,
        startDate: formData.startDate,
        // archived: formData.archived,
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        // label: formData.label,
      }
    );
    revalidatePath(`/PROJECTS-CLEAN/${formData.projectId}`);
    // revalidatePath("/PROJECTS-CLEAN/[slug]");
    return {
      id: formData.id,

      project: formData.projectId,
      assignees: formData.assignees,
      dueDate: formData.dueDate,
      startDate: formData.startDate,
      // archived: formData.archived,
      category: formData.category,
      priority: formData.priority,
      status: formData.status,
      // label: formData.label,
    };
  } catch (error: any) {
    console.error(error);
  }
}
