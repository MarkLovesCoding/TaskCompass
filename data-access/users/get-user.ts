import "server-only";

import connectDB from "@/db/connectDB";

import User from "@/db/(models)/User";

import { UserDto } from "@/use-cases/user/types";

// May require refactpr to get by ID
async function getUser(user: UserDto): Promise<UserDto> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  const userId = user.id;
  try {
    // Find the user by ID
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw new Error("Error retrieving user:" + error);
  }
}

export default getUser;
