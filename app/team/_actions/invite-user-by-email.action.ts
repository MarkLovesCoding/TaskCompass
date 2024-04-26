"use server";
import { revalidatePath } from "next/cache";

import { getUserFromSession } from "@/lib/sessionAuth";
import { getUserByEmail } from "@/data-access/users/get-user-by-email.persistence";
import { getTeam } from "@/data-access/teams/get-team.persistence";
import { updateTeam } from "@/data-access/teams/update-team.persistence";
import { updateUser } from "@/data-access/users/update-user.persistence";
import { inviteUserByEmailUseCase } from "@/use-cases/user/invite-user-by-email.use-case";
import { ValidationError } from "@/use-cases/utils";
import { UserDto } from "@/use-cases/user/types";
import { TeamDto } from "@/use-cases/team/types";

export async function inviteUserByEmailAction(
  email: string,
  role: "member" | "admin",
  team: TeamDto,
  inviter: UserDto
) {
  const { getUser } = await getUserFromSession();

  try {
    await inviteUserByEmailUseCase(
      {
        getTeam,
        updateTeam,
        updateUser,
        getUser,
        getUserByEmail,
      },
      {
        email: email,
        team: team,
        role: role,
        inviter: inviter,
      }
    );
    // revalidatePath(`/team/${team.id}`);

    //for toasts, not yet implemented
    // return { success: true };
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
