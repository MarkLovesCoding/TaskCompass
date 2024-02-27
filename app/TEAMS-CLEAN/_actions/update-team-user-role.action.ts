"use server";
// import { updateProjectMembersUseCase } from "@/use-cases/project/update-project-members.use-case";
// import { updateProjectAdminsUseCase } from "@/use-cases/project/update-project-admins.use-case";
import getUserObject from "@/data-access/users/get-user.persistence";
import getTeam from "@/data-access/teams/get-team.persistence";
import { updateUser } from "@/data-access/users/update-user.persistence";
import { updateTeamUserRoleUseCase } from "@/use-cases/user/update-team-user-role.use-case";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
export async function UpdateTeamUserRoleAction(
  teamUserId: string,
  teamId: string,
  updateType: "admin" | "member"
) {
  const { getUser } = await getUserFromSession();
  console.log("teamId", teamId);
  console.log("teamUserId", teamUserId);
  console.log("updateType", updateType);

  try {
    await updateTeamUserRoleUseCase(
      {
        getTeam,
        updateUser,
        getUser,
        getUserObject,
      },
      {
        teamUserId: teamUserId,
        teamId: teamId,
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
