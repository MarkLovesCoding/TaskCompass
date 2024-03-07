"use server";
import { updateTaskFullCard } from "@/data-access/tasks/update-task-full-card.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";
import { updateTaskFullCardUseCase } from "@/use-cases/task/update-task-full-card.use-case";
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

export async function updateTaskFullCardAction(
  formData: FormData,
  originalAssignees: string[]
) {
  console.log("updatingformData", formData);
  const { getUser } = await getUserFromSession();

  try {
    await updateTaskFullCardUseCase(
      {
        updateTaskFullCard,
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
        originalAssignees: originalAssignees,
      }
    );
    revalidatePath(`/PROJECTS-CLEAN/${formData.projectId}/page`);
    // revalidatePath("/PROJECTS-CLEAN/[slug]/page");
  } catch (error: any) {
    console.error(error);
  }
}
