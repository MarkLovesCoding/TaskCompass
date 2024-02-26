"use server";
import { updateProject } from "@/data-access/projects/update-project.persistence";
import getProject from "@/data-access/projects/get-project.persistence";
import updateManyProjectAdmins from "@/data-access/users/update-many-project-admins.persistence";
import { updateProjectAdminsUseCase } from "@/use-cases/project/update-project-admins.use-case";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
export async function updateProjectAdminsAction(
  projectId: string,
  updatedAdmins: string[]
) {
  const { getUser } = await getUserFromSession();
  console.log("updateProjectAdminsAction", projectId, updatedAdmins);
  try {
    await updateProjectAdminsUseCase(
      {
        updateProject,
        updateManyProjectAdmins,
        getProject,
        getUser,
      },
      {
        projectId: projectId,
        updatedAdmins: updatedAdmins,
      }
    );
    revalidatePath("/TEAMS-CLEAN/[slug]");

    //for toasts, not yet implemented
    return { success: true };
  } catch (error: any) {
    console.error(error);
  }
}
