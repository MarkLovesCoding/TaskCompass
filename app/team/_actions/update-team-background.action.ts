"use server";
import { revalidatePath } from "next/cache";

import { getUserFromSession } from "@/lib/sessionAuth";
import { updateTeam } from "@/data-access/teams/update-team.persistence";
import { getTeam } from "@/data-access/teams/get-team.persistence";
import { updateTeamBackgroundUseCase } from "@/use-cases/team/update-team-background.use-case";
import { ValidationError } from "@/use-cases/utils";

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
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
