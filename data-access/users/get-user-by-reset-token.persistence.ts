"use server";
import connectDB from "@/db/connectDB";
import { userModelToUserDto } from "./utils";
import User from "@/db/(models)/User";

import type { UserDto } from "@/use-cases/user/types";

export async function getUserByResetToken(
  hashedToken: string
): Promise<UserDto> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    return userModelToUserDto(user);
  } catch (error) {
    throw new Error("Token is invalid or has expired");
  }
}
