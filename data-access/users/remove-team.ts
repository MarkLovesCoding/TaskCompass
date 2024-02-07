import "server-only";

import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";

import type { TeamDto } from "@/use-cases/team/types";
import { UserDto } from "@/use-cases/user/types";

export async function removeTeamFromUser(
  team: TeamDto,
  user: UserDto
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw error;
  }

  try {
    const teamId = team.id;
    const userId = user.id;

    await User.findOneAndUpdate({ _id: userId }, { $pull: { teams: teamId } });
  } catch (error) {
    // Handle User.findOneAndUpdate error
    throw error;
  }
}
