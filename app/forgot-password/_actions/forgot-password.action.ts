"use server";

import { updateUser } from "@/data-access/users/update-user.persistence";
// import { createNewEmailUserUseCase } from "@/use-cases/team/sign-up-new-user-add-to-team.use-case";
import { ValidationError } from "@/use-cases/utils";
import { forgotPasswordUseCase } from "@/use-cases/user/forgot-password.use-case";
import { getUserByEmail } from "@/data-access/users/get-user-by-email.persistence";

type Form = {
  email: string;
};
export async function forgotPasswordAction(values: { email: string }) {
  try {
    await forgotPasswordUseCase(
      {
        getUserByEmail,
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
