"use server";
import connectDB from "@/db/connectDB";
import { userModelToUserDto } from "./utils";
import User from "@/db/(models)/User";

import type { UserDto } from "@/use-cases/user/types";
import type { UserModelType } from "./types";

async function getProjectMembers(memberIds: string[]): Promise<UserDto[]> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    const members: UserModelType[] = await User.find({
      _id: { $in: memberIds },
    });
    const validatedMembers = members.map((member) => {
      return userModelToUserDto(member);
    });
    return validatedMembers;
  } catch (error) {
    throw new Error("Error retrieving project members:" + error);
  }
}

export default getProjectMembers;
