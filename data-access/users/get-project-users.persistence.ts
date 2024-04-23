"use server";
import connectDB from "@/db/connectDB";
import { userModelToUserDto } from "./utils";
import User from "@/db/(models)/User";

import type { UserModelType } from "./types";
import type { UserDto } from "@/use-cases/user/types";

async function getProjectUsers(userIds: string[]): Promise<UserDto[]> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    const users: UserModelType[] = await User.find({
      _id: { $in: userIds },
    });
    const validatedUsers = users.map((user) => {
      return userModelToUserDto(user);
    });
    return validatedUsers;
  } catch (error) {
    throw new Error("Error retrieving project users:" + error);
  }
}

export default getProjectUsers;
