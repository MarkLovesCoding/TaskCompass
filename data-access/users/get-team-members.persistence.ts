import "server-only";

import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";
import { UserDto } from "@/use-cases/user/types";
import { userModelToUserDto } from "./utils";
import { UserModelType } from "./types";

async function getTeamMembers(memberIds: string[]): Promise<UserDto[]> {
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
    throw new Error("Error retrieving users:" + error);
  }
}

export default getTeamMembers;
