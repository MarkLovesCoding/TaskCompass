import "server-only";

import connectDB from "@/db/connectDB";
import Team from "@/db/(models)/Team";

import type { TeamDto } from "@/use-cases/team/types";
import { UserDto } from "@/use-cases/user/types";

export async function addUserToTeam(
  team: TeamDto,
  user: UserDto
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    const teamId = team.id;
    const userId = user.id;

    await Team.findOneAndUpdate(
      { _id: teamId },
      { $push: { members: userId } }
    );
  } catch (error) {
    // Handle newProject.save error
    throw new Error("Error adding user to team:" + error);
  }
}
