"use server";
import getProject from "@/data-access/projects/get-project.persistence";
import { revalidatePath } from "next/cache";
import { updateProjectUseCase } from "@/use-cases/project/update-project.use-case";
import { updateProject } from "@/data-access/projects/update-project.persistence";
import { updateProjectColumnOrder } from "@/data-access/projects/update-project-column-order.persistence";
import { updateProjectTasksOrder } from "@/data-access/projects/update-project-tasks-order.persistence";
import { getUserFromSession } from "@/lib/sessionAuth";
import { ProjectDto } from "@/use-cases/project/types";
import { updateProjectColumnOrderUseCase } from "@/use-cases/project/update-project-column-order.use-case";
import { updateProjectTasksOrderUseCase } from "@/use-cases/project/update-project-tasks-order.use-case";
// import { updateProjectColumnOrderUseCase } from "@/use-cases/project/update-project-tasks-order.use-case";

import { TasksOrder } from "@/entities/Project";
export async function updateProjectTasksOrderAction(
  projectId: string,

  tasksOrder: TasksOrder
) {
  const { getUser } = await getUserFromSession();
  try {
    await updateProjectTasksOrderUseCase(
      {
        updateProjectTasksOrder,
        getUser,
      },
      {
        projectId: projectId,
        tasksOrder: tasksOrder,
      }
    );

    revalidatePath("/TEAMS-CLEAN/[slug]/page");

    //for toasts, not yet implemented
    // return { success: true };
  } catch (error: any) {
    console.error(error);
  }
}
