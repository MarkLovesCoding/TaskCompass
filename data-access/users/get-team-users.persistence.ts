"use server";
import connectDB from "@/db/connectDB";
import { userModelToUserDto } from "./utils";
import User from "@/db/(models)/User";

import type { UserDto } from "@/use-cases/user/types";
import type { UserModelType } from "./types";

async function getTeamUsers(userIds: string[]): Promise<UserDto[]> {
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
    throw new Error("Error retrieving users:" + error);
  }
}

export default getTeamUsers;
