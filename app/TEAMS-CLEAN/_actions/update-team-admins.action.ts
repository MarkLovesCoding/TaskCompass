"use server";
import { updateTeam } from "@/data-access/teams/update-team.persistence";
import updateTeamAdmins from "@/data-access/users/update-team-admins.persistence";
import getTeam from "@/data-access/teams/get-team.persistence";
import { updateTeamAdminsUseCase } from "@/use-cases/team/update-team-admins.use-case";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
export async function updateTeamAdminsAction(
  teamId: string,
  updatedAdmins: string[]
) {
  const { getUser } = await getUserFromSession();

  try {
    await updateTeamAdminsUseCase(
      {
        updateTeam,
        updateTeamAdmins,
        getTeam,
        getUser,
      },
      {
        teamId: teamId,
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
