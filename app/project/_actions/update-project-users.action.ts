"use server";
import { updateProject } from "@/data-access/projects/update-project.persistence";
import getProject from "@/data-access/projects/get-project.persistence";
import updateManyProjectMembers from "@/data-access/users/update-many-project-members.persistence";
import updateManyProjectUsers from "@/data-access/users/update-many-project-users.persistence";
import { revalidatePath } from "next/cache";
import { updateProjectUsersUseCase } from "@/use-cases/project/update-project-users.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
import { ValidationError } from "@/use-cases/utils";
export async function updateProjectUsersAction(
  projectId: string,
  updatedUsers: string[]
) {
  const { getUser } = await getUserFromSession();
  console.log("updateProjectMembersAction", projectId, updatedUsers);
  try {
    await updateProjectUsersUseCase(
      {
        updateProject,
        updateManyProjectUsers,
        getProject,
        getUser,
      },
      {
        projectId: projectId,
        updatedUsers: updatedUsers,
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
