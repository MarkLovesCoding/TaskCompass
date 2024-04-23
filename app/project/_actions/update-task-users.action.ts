"use server";
import { revalidatePath } from "next/cache";

import { getUserFromSession } from "@/lib/sessionAuth";
import { updateTask } from "@/data-access/tasks/update-task.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";
import updateTaskUsers from "@/data-access/users/update-many-task-users.persistence";
import { updateTaskUsersUseCase } from "@/use-cases/task/update-task-users.use-case";

export async function updateTaskUsersAction(
  taskId: string,
  addedAssignees: string[],
  removedAssignees: string[]
) {
  const { getUser } = await getUserFromSession();

  try {
    await updateTaskUsersUseCase(
      {
        updateTask,
        getTask,
        getUser,
        updateTaskUsers,
      },
      {
        taskId: taskId,
        addedAssignees: addedAssignees,
        removedAssignees: removedAssignees,
      }
    );
    revalidatePath("/project/[slug]");
    return {
      success: true,
    };
  } catch (error: any) {
    console.error(error);
  }
}
