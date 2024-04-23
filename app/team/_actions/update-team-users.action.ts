"use server";
import { revalidatePath } from "next/cache";

import { getUserFromSession } from "@/lib/sessionAuth";
import { updateTeam } from "@/data-access/teams/update-team.persistence";
import updateManyTeamUsers from "@/data-access/users/update-many-team-users.persistence";
import getTeam from "@/data-access/teams/get-team.persistence";
import { updateTeamUsersUseCase } from "@/use-cases/team/update-team-users.use-case";
import { ValidationError } from "@/use-cases/utils";

export async function updateTeamUsersAction(
  teamId: string,
  updatedUsers: string[]
) {
  const { getUser } = await getUserFromSession();

  try {
    await updateTeamUsersUseCase(
      {
        updateTeam,
        updateManyTeamUsers,
        getTeam,
        getUser,
      },
      {
        teamId: teamId,
        updatedUsers: updatedUsers,
      }
    );
    revalidatePath(`/team/${teamId}`);

    //for toasts, not yet implemented
    return { success: true };
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
