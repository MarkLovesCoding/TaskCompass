"use server";
import getUserObject from "@/data-access/users/get-user.persistence";
import getTeam from "@/data-access/teams/get-team.persistence";
import { updateTeam } from "@/data-access/teams/update-team.persistence";
import { updateUser } from "@/data-access/users/update-user.persistence";
import { removeProjectUserUseCase } from "@/use-cases/user/remove-project-user.use-case";
import getProject from "@/data-access/projects/get-project.persistence";
import { updateProject } from "@/data-access/projects/update-project.persistence";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
import { ValidationError } from "@/use-cases/utils";
export async function removeProjectUserAction(
  projectId: string,
  projectUserId: string
) {
  const { getUser } = await getUserFromSession();

  try {
    await removeProjectUserUseCase(
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
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
