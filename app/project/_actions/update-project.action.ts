"use server";
import getProject from "@/data-access/projects/get-project.persistence";
import { revalidatePath } from "next/cache";
import { updateProjectUseCase } from "@/use-cases/project/update-project.use-case";
import { updateProject } from "@/data-access/projects/update-project.persistence";
import { getUserFromSession } from "@/lib/sessionAuth";
import { ProjectDto } from "@/use-cases/project/types";
export async function updateProjectAction(project: ProjectDto) {
  const { getUser } = await getUserFromSession();
  try {
    await updateProjectUseCase(
      {
        updateProject,
        getUser,
      },
      {
        project: project,
      }
    );

    // revalidatePath("/TEAMS-CLEAN/[slug]/page");

    //for toasts, not yet implemented
    // return { success: true };
  } catch (error: any) {
    console.error(error);
  }
}
