"use server";

import { updateUser } from "@/data-access/users/update-user.persistence";
// import { createNewEmailUserUseCase } from "@/use-cases/team/sign-up-new-user-add-to-team.use-case";
import { ValidationError } from "@/use-cases/utils";
import { resetPasswordUseCase } from "@/use-cases/user/reset-password.use-case";
import getUserObject from "@/data-access/users/get-user.persistence";
type Form = {
  email: string;
  password: string;
  passwordConfirm: string;
};
export async function resetPasswordAction(values: {
  userId: string;
  password: string;
  passwordConfirm: string;
}) {
  try {
    await resetPasswordUseCase(
      {
        getUserObject,
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
