"use server";
import { updateProject } from "@/data-access/projects/update-project.persistence";
import getProject from "@/data-access/projects/get-project.persistence";
import updateManyProjectMembers from "@/data-access/users/update-many-project-members.persistence";
import { updateProjectMembersUseCase } from "@/use-cases/project/update-project-members.use-case";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
export async function updateProjectMembersAction(
  projectId: string,
  updatedMembers: string[]
) {
  const { getUser } = await getUserFromSession();
  console.log("updateProjectMembersAction", projectId, updatedMembers);
  try {
    await updateProjectMembersUseCase(
      {
        updateProject,
        updateManyProjectMembers,
        getProject,
        getUser,
      },
      {
        projectId: projectId,
        updatedMembers: updatedMembers,
      }
    );
    revalidatePath("/TEAMS-CLEAN/[slug]");

    //for toasts, not yet implemented
    return { success: true };
  } catch (error: any) {
    console.error(error);
  }
}
