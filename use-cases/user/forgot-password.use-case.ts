import crypto from "crypto";

import { ValidationError } from "../utils";
import type { GetUserByEmail, UpdateUser } from "./types";
import { UserEntity, UserEntityValidationError } from "@/entities/User";
import { userToDto } from "./utils";
import { getUserByEmail } from "@/data-access/users/get-user-by-email.persistence";
import { Resend } from "resend";

//******************************************
//This function impliments the forgot password use case,
//it uses the getUserByEmail and updateUser functions to find and update the user
//it sends an email to the user with a link to reset their password
//it also creates a reset token and expiry date for the user
//******************************************

export async function forgotPasswordUseCase(
  context: {
    getUserByEmail: GetUserByEmail;
    updateUser: UpdateUser;
  },
  forgotPasswordData: {
    values: {
      email: string;
    };
  }
) {
  //check if user exists
  const existingUser = await getUserByEmail(forgotPasswordData.values.email);
  if (!existingUser) {
    throw new Error("User with that Email was not found.");
  }

  //create tokens
  const resetToken = crypto.randomBytes(20).toString("hex");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const passwordResetExpires = Date.now() + 3600000; // 1 hour from now

  //convert user to Entity to update with tokens.
  try {
    const userEntity = new UserEntity(existingUser);
    userEntity.setResetToken(passwordResetToken);
    userEntity.setResetTokenExpiry(passwordResetExpires);

    await context.updateUser(userToDto(userEntity));
  } catch (err) {
    const error = err as UserEntityValidationError;
    throw new ValidationError(error.getErrors());
  }

  //create email link and body.
  const environment = process.env.ENVIRONMENT;
  const uri =
    environment === "development"
      ? "http://localhost:3000"
      : "https://taskcompass.ca";
  const resetURL = `${uri}/reset-password/${resetToken}`;

  const body = "Reset Password by clicking on following link: " + resetURL;
  const msg = {
    to: forgotPasswordData.values.email, // Change to your recipient
    from: "no_reply@taskcompass.ca", // Change to your verified sender
    subject: "TaskCompass -- Reset Password",
    text: body,
  };
  //create resend object from Resend with API key
  const resend = new Resend(process.env.RESEND_API);

  //send email
  const { data, error } = await resend.emails.send(msg);

  //if error, remove tokens and throw appropriate error)
  if (error) {
    try {
      const existingUser = await getUserByEmail(
        forgotPasswordData.values.email
      );
      if (!existingUser) {
        throw new Error("User with that Email was not found.");
      }
      const userEntity = new UserEntity(existingUser);

      userEntity.removeResetToken();
      userEntity.removeResetTokenExpiry();
      try {
        await context.updateUser(userToDto(userEntity));
      } catch (err) {
        throw new Error("Error updating user with reset tokens");
      }
    } catch (err) {
      console.log(
        "Error removing reset tokens, please try process again.",
        err
      );
      const error = err as UserEntityValidationError;
      throw new ValidationError(error.getErrors());
    }
    throw new Error("Error sending email, please try again.");
  }
}
