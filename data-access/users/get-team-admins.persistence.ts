"use server";
import connectDB from "@/db/connectDB";
import { userModelToUserDto } from "./utils";
import User from "@/db/(models)/User";

import type { UserDto } from "@/use-cases/user/types";
import type { UserModelType } from "./types";

async function getTeamAdmins(memberIds: string[]): Promise<UserDto[]> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    const admins: UserModelType[] = await User.find({
      _id: { $in: memberIds },
    });
    const validatedAdmins = admins.map((member) => {
      return userModelToUserDto(member);
    });
    return validatedAdmins;
  } catch (error) {
    throw new Error("Error retrieving team admins:" + error);
  }
}

export default getTeamAdmins;
