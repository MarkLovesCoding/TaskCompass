"use server";

import { updateTeam } from "@/data-access/teams/update-team.persistence";
import { updateProject } from "@/data-access/projects/update-project.persistence";
import { getTeam } from "@/data-access/teams/get-team.persistence";
import { createDefaultTeam } from "@/data-access/teams/create-default-team.persistence";
import { createDefaultProject } from "@/data-access/projects/create-default-project.persistence";
import createNewEmailUser from "@/data-access/users/create-new-email-user.persistence";
import { updateUser } from "@/data-access/users/update-user.persistence";
// import { createNewEmailUserUseCase } from "@/use-cases/team/sign-up-new-user-add-to-team.use-case";
import { ValidationError } from "@/use-cases/utils";
import { createNewEmailUserUseCase } from "@/use-cases/user/create-new-email-user.use-case";
import type { TInvitedUser } from "@/entities/Team";

type Form = {
  name: string;
};
export async function createNewEmailUserAction(values: {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  role: string;
  firstLogIn: boolean;
}) {
  try {
    await createNewEmailUserUseCase(
      {
        createDefaultTeam,
        createNewEmailUser,
        createDefaultProject,
        updateTeam,
        updateProject,
        updateUser,
      },
      {
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
