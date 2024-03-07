"use server";
import getProject from "@/data-access/projects/get-project.persistence";
import { revalidatePath } from "next/cache";
import { updateProjectUseCase } from "@/use-cases/project/update-project.use-case";
import { updateProject } from "@/data-access/projects/update-project.persistence";
import { getUserFromSession } from "@/lib/sessionAuth";
import { ProjectDto } from "@/use-cases/project/types";
import { updateProjectColumnOrderUseCase } from "@/use-cases/project/update-project-column-order.use-case";
export async function updateProjectColumnOrderAction(
  projectId: string,
  type: string,
  columnOrder: string[]
) {
  const { getUser } = await getUserFromSession();
  try {
    await updateProjectColumnOrderUseCase(
      {
        updateProject,
        getUser,
      },
      {
        projectId: projectId,
        type: type,

        columnOrder: columnOrder,
      }
    );

    revalidatePath("/TEAMS-CLEAN/[slug]/page");

    //for toasts, not yet implemented
    // return { success: true };
  } catch (error: any) {
    console.error(error);
  }
}
