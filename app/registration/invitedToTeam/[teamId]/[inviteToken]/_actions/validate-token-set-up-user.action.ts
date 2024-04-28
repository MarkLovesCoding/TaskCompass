"use server";
import { revalidatePath } from "next/cache";

import { getUserFromSession } from "@/lib/sessionAuth";
import { updateTeam } from "@/data-access/teams/update-team.persistence";
import { getTeam } from "@/data-access/teams/get-team.persistence";
import { getUserByEmail } from "@/data-access/users/get-user-by-email.persistence";
import { updateUser } from "@/data-access/users/update-user.persistence";
import { validateTokenSetUpUserUseCase } from "@/use-cases/team/validate-token-set-up-user.use-case";
import { ValidationError } from "@/use-cases/utils";

type Form = {
  name: string;
};

export async function validateTokenSetUpUserAction(
  teamId: string,
  inviteToken: string
) {
  try {
    const inviteData = await validateTokenSetUpUserUseCase(
      {
        getTeam,
        updateTeam,
        getUserByEmail,
        updateUser,
      },
      {
        teamId: teamId,
        inviteToken: inviteToken,
      }
    );
    console.log("inviteData", inviteData);
    return inviteData;
  } catch (err) {
    const error = err as Error;
    console.log("error", error);
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
