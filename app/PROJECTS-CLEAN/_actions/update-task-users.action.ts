"use server";
import { updateTask } from "@/data-access/tasks/update-task.persistence";
// import { removeTaskUsers } from "@/data-access/tasks/remove-task-users.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";
import updateTaskUsers from "@/data-access/users/update-many-task-users.persistence";
import { updateTaskUsersUseCase } from "@/use-cases/task/update-task-users.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
import { revalidatePath } from "next/cache";

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
    revalidatePath("/PROJECTS-CLEAN/[slug]");
    //pertains to toasts, not yet implemented
    return {
      success: true,
    };
  } catch (error: any) {
    console.error(error);
  }
}
