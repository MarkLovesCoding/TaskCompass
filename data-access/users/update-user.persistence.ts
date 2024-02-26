import "server-only";

import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";
import { UserDto } from "@/use-cases/user/types";
export async function updateUser(user: UserDto): Promise<void> {
  console.log("UPDATING User", user.name);
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    const updateTeam = await User.findOneAndUpdate(
      { _id: user.id }, // Find the Team object by its ID
      {
        ...user,
      }
    );
  } catch (error) {
    throw new Error("Error adding user to task:" + error);
  }
}
