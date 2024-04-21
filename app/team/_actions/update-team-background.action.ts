"use server";
import { updateTeamBackgroundUseCase } from "@/use-cases/team/update-team-background.use-case";
import { updateTeam } from "@/data-access/teams/update-team.persistence";
import getTeam from "@/data-access/teams/get-team.persistence";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";

export async function updateTeamBackgroundAction(
  teamId: string,
  backgroundImage: string,
  backgroundImageThumbnail: string
) {
  const { getUser } = await getUserFromSession();

  try {
    await updateTeamBackgroundUseCase(
      {
        getTeam,
        updateTeam,
        getUser,
      },
      {
        teamId: teamId,
        backgroundImage: backgroundImage,
        backgroundImageThumbnail: backgroundImageThumbnail,
      }
    );
    revalidatePath(`/team/${teamId}`);
  } catch (error: any) {
    console.error(error);
  }
}
