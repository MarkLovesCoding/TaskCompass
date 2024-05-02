"use server";

import { updateUser } from "@/data-access/users/update-user.persistence";
// import { createNewEmailUserUseCase } from "@/use-cases/team/sign-up-new-user-add-to-team.use-case";
import { ValidationError } from "@/use-cases/utils";
import { verifyResetTokenUseCase } from "@/use-cases/user/verify-reset-token.use-case";
import { getUserByResetToken } from "@/data-access/users/get-user-by-reset-token.persistence";

type Form = {
  token: string;
};
export async function verifyResetTokenAction(token: string) {
  try {
    const validatedUser = await verifyResetTokenUseCase(
      {
        getUserByResetToken,
      },
      {
        token,
      }
    );
    return validatedUser;
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
