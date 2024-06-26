"use server";
import { revalidatePath } from "next/cache";

import { getUserFromSession } from "@/lib/sessionAuth";
import getUserObject from "@/data-access/users/get-user.persistence";
import { getTeam } from "@/data-access/teams/get-team.persistence";
import { updateTeam } from "@/data-access/teams/update-team.persistence";
import { updateUser } from "@/data-access/users/update-user.persistence";
import { removeTeamUserUseCase } from "@/use-cases/user/remove-team-user.use-case";
import { ValidationError } from "@/use-cases/utils";

export async function removeTeamUserAction(teamId: string, teamUserId: string) {
  const { getUser } = await getUserFromSession();

  try {
    await removeTeamUserUseCase(
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
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
