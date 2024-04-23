"use server";
import connectDB from "@/db/connectDB";
import { userModelToUserDto } from "./utils";
import User from "@/db/(models)/User";

import type { UserDto } from "@/use-cases/user/types";
import type { UserModelType } from "./types";

async function getProjectAdmins(adminIds: string[]): Promise<UserDto[]> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    const admins: UserModelType[] = await User.find({
      _id: { $in: adminIds },
    });
    const validatedAdmins = admins.map((admin) => {
      return userModelToUserDto(admin);
    });
    return validatedAdmins;
  } catch (error) {
    throw new Error("Error retrieving project admins:" + error);
  }
}

export default getProjectAdmins;
