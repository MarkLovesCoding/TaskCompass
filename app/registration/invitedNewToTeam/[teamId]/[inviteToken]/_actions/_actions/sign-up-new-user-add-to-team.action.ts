"use server";

import { updateTeam } from "@/data-access/teams/update-team.persistence";
import { getTeam } from "@/data-access/teams/get-team.persistence";
import createNewEmailUser from "@/data-access/users/create-new-email-user.persistence";
import { updateUser } from "@/data-access/users/update-user.persistence";
import { signUpNewUserAddToTeamUseCase } from "@/use-cases/team/sign-up-new-user-add-to-team.use-case";
import { ValidationError } from "@/use-cases/utils";

import type { TInvitedUser } from "@/entities/Team";

type Form = {
  name: string;
};
export async function signUpNewUserAddToTeamAction(
  invitedUserData: TInvitedUser,
  values: {
    name: string;
    email: string;
    password: string;
    role: string;
    firstLogIn: boolean;
  }
) {
  try {
    await signUpNewUserAddToTeamUseCase(
      {
        getTeam,
        createNewEmailUser,
        updateTeam,
        updateUser,
      },
      {
        invitedUserData,
        values,
      }
    );
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
