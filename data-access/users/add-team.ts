import "server-only";

import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";

import type { TeamDto } from "@/use-cases/team/types";
import { UserDto } from "@/use-cases/user/types";

export async function addTeamToUser(
  team: TeamDto,
  user: UserDto
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  const teamId = team.id;
  const userId = user.id;
  try {
    await User.findOneAndUpdate({ _id: userId }, { $push: { teams: teamId } });
  } catch (error) {
    throw new Error("Error updating user:" + error);
  }
}
