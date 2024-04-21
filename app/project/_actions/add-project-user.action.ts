"use server";
import getUserObject from "@/data-access/users/get-user.persistence";
import getTeam from "@/data-access/teams/get-team.persistence";
import { updateTeam } from "@/data-access/teams/update-team.persistence";
import { updateUser } from "@/data-access/users/update-user.persistence";
import { addProjectUserUseCase } from "@/use-cases/user/add-project-user.use-case";
import getProject from "@/data-access/projects/get-project.persistence";
import { updateProject } from "@/data-access/projects/update-project.persistence";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
export async function addProjectUserAction(
  projectId: string,
  projectUserId: string
) {
  const { getUser } = await getUserFromSession();

  try {
    await addProjectUserUseCase(
      {
        getProject,
        updateProject,
        updateUser,
        getUser,
        getUserObject,
      },
      {
        projectId: projectId,
        projectUserId: projectUserId,
      }
    );
    revalidatePath(`/project/${projectId}`);

    //for toasts, not yet implemented
    return { success: true };
  } catch (error: any) {
    console.error(error);
  }
}
