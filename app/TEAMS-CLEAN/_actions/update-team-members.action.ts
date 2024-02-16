"use server";
import { updateTeam } from "@/data-access/teams/update-team.persistence";
import getTeam from "@/data-access/teams/get-team";
import { updateTeamMembersUseCase } from "@/use-cases/team/update-team-members.use-case";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
import type { TeamDto } from "@/use-cases/team/types";

export async function updateTeamMembersAction(
  teamId: string,
  addedMembers: string[],
  removedMembers: string[]
) {
  const { getUser } = await getUserFromSession();

  try {
    await updateTeamMembersUseCase(
      {
        updateTeam,
        getTeam,
        getUser,
      },
      {
        teamId: teamId,
        addedMembers: addedMembers,
        removedMembers: removedMembers,
      }
    );
    revalidatePath("/TEAMS-CLEAN/[slug]");

    //for toasts, not yet implemented
    return { success: true };
  } catch (error: any) {
    console.error(error);
  }
}
