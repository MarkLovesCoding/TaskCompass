"use server";
import getUserObject from "@/data-access/users/get-user.persistence";
import getTeam from "@/data-access/teams/get-team.persistence";
import { updateTeam } from "@/data-access/teams/update-team.persistence";
import { updateUser } from "@/data-access/users/update-user.persistence";
import { addTeamUserUseCase } from "@/use-cases/user/add-team-user.use-case";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
export async function addTeamUserAction(teamId: string, teamUserId: string) {
  const { getUser } = await getUserFromSession();

  try {
    await addTeamUserUseCase(
      {
        getTeam,
        updateTeam,
        updateUser,
        getUser,
        getUserObject,
      },
      {
        teamId: teamId,
        teamUserId: teamUserId,
      }
    );
    revalidatePath(`/team/${teamId}`);

    //for toasts, not yet implemented
    return { success: true };
  } catch (error: any) {
    console.error(error);
  }
}
