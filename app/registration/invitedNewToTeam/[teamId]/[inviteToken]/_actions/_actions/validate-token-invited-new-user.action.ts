"use server";

import { getTeam } from "@/data-access/teams/get-team.persistence";
import { validateTokenInvitedNewUserUseCase } from "@/use-cases/team/validate-token-invited-new-user.use-case";
import { ValidationError } from "@/use-cases/utils";

import type { TInvitedUser } from "@/entities/Team";

type Form = {
  name: string;
};
export async function validateTokenInvitedNewUserAction(
  teamId: string,
  inviteToken: string
) {
  try {
    const invitedUserData = await validateTokenInvitedNewUserUseCase(
      {
        getTeam,
      },
      {
        teamId: teamId,
        inviteToken: inviteToken,
      }
    );
    console.log("invitedUserData", invitedUserData);
    return invitedUserData as TInvitedUser;
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
