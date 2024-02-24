"use server";
import { updateTeam } from "@/data-access/teams/update-team.persistence";
import updateTeamMembers from "@/data-access/users/update-team-members.persistence";
import getTeam from "@/data-access/teams/get-team.persistence";
import { updateTeamMembersUseCase } from "@/use-cases/team/update-team-members.use-case";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
export async function updateTeamMembersAction(
  teamId: string,
  updatedMembers: string[]
) {
  const { getUser } = await getUserFromSession();

  try {
    await updateTeamMembersUseCase(
      {
        updateTeam,
        updateTeamMembers,
        getTeam,
        getUser,
      },
      {
        teamId: teamId,
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