"use server";
import { updateTask } from "@/data-access/tasks/update-task.persistence";
import { updateUser } from "@/data-access/users/update-user.persistence";
import getUserObject from "@/data-access/users/get-user.persistence";
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
  category: string;
  priority: string;
  status: string;
};

export async function updateTaskAction(
  formData: FormData,
  originalAssignees: string[]
) {
  console.log("updatingformData", formData);
  const { getUser } = await getUserFromSession();

  try {
    await updateTaskUseCase(
      {
        updateTask,
        getTask,
        getUser,
        getUserObject,
        updateUser,
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
  } catch (error: any) {
    console.error(error);
  }
}
