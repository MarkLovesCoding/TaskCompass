"use server";
import { revalidatePath } from "next/cache";

import { getUserFromSession } from "@/lib/sessionAuth";
import { updateTaskFullCard } from "@/data-access/tasks/update-task-full-card.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";
import { updateTaskFullCardUseCase } from "@/use-cases/task/update-task-full-card.use-case";
import { ValidationError } from "@/use-cases/utils";

type FormData = {
  id: string;
  name: string;
  description: string;
  projectId: string;
  assignees: string[];
  dueDate: Date;
  startDate: Date;
  category: string;
  priority: string;
  status: string;
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
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        originalAssignees: originalAssignees,
      }
    );
    revalidatePath(`/project/${formData.projectId}`);
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
