import crypto from "crypto";

import type { GetUserByResetToken } from "./types";

//******************************************
//This function impliments the verifyResetToken use case,
//it uses the getUserByResetToken function to get the user by the reset token
//it validates the user and retrusn error if the token is invalid or user not found.
//******************************************
export async function verifyResetTokenUseCase(
  context: {
    getUserByResetToken: GetUserByResetToken;
  },
  tokenData: {
    token: string;
  }
) {
  const hashedToken = crypto
    .createHash("sha256")
    .update(tokenData.token)
    .digest("hex");

  try {
    const validatedUser = await context.getUserByResetToken(hashedToken);
    return validatedUser;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
}
