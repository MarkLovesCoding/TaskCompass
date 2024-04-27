"use server";
import { revalidatePath } from "next/cache";

import { getUserFromSession } from "@/lib/sessionAuth";
import getUserObject from "@/data-access/users/get-user.persistence";
import { getTeam } from "@/data-access/teams/get-team.persistence";
import { updateUser } from "@/data-access/users/update-user.persistence";
import { updateTeamUserRoleUseCase } from "@/use-cases/user/update-team-user-role.use-case";
import { ValidationError } from "@/use-cases/utils";

export async function UpdateTeamUserRoleAction(
  teamUserId: string,
  teamId: string,
  updateType: "admin" | "member"
) {
  const { getUser } = await getUserFromSession();

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
