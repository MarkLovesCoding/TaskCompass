"use server";
import { updateTeamMembers } from "@/data-access/teams/update-team-members.persistence";
import { updateTeamMembersUseCase } from "@/use-cases/team/update-team-members.use-case";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
import type { TeamDto } from "@/use-cases/team/types";

export async function updateTeamMembersAction(
  team: TeamDto,
  addedMembers: string[],
  removedMembers: string[]
) {
  const { getUser } = await getUserFromSession();

  try {
    await updateTeamMembersUseCase(
      {
        updateTeamMembers,
        getUser,
      },
      {
        team: team,
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
