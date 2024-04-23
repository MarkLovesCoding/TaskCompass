"use server";
import connectDB from "@/db/connectDB";
import { userModelToUserDto } from "./utils";
import User from "@/db/(models)/User";

import type { UserDto } from "@/use-cases/user/types";

async function getAllUsers(): Promise<UserDto[]> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    // Find the user by ID
    const users = await User.find();
    const validatedUsers = users.map((user) => {
      return userModelToUserDto(user);
    });
    return validatedUsers;
  } catch (error) {
    throw new Error("Error retrieving users:" + error);
  }
}

export default getAllUsers;
