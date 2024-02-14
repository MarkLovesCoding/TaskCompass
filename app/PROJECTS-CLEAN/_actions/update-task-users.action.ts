"use server";
import { updateTaskUsers } from "@/data-access/tasks/update-task-users.persistence";
// import { removeTaskUsers } from "@/data-access/tasks/remove-task-users.persistence";
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
        updateTaskUsers,
        getUser,
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
