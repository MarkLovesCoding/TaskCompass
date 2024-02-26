"use server";
import { updateProject } from "@/data-access/projects/update-project.persistence";
import getProject from "@/data-access/projects/get-project.persistence";
// import { updateProjectMembersUseCase } from "@/use-cases/project/update-project-members.use-case";
// import { updateProjectAdminsUseCase } from "@/use-cases/project/update-project-admins.use-case";
import getUserObject from "@/data-access/users/get-user.persistence";
import { updateUser } from "@/data-access/users/update-user.persistence";
import { updateProjectUserRoleUseCase } from "@/use-cases/user/update-project-user-role.use-case";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
export async function UpdateProjectUserRoleAction(
  projectId: string,
  projectUserId: string,
  updateType: "admin" | "member"
) {
  const { getUser } = await getUserFromSession();
  try {
    await updateProjectUserRoleUseCase(
      {
        updateProject,
        updateUser,
        getProject,
        getUser,
        getUserObject,
      },
      {
        projectId: projectId,
        projectUserId: projectUserId,
        updateType: updateType,
      }
    );
    revalidatePath("/TEAMS-CLEAN/[slug]");

    //for toasts, not yet implemented
    return { success: true };
  } catch (error: any) {
    console.error(error);
  }
}
