import "server-only";

import connectDB from "@/db/connectDB";
import Team from "@/db/(models)/Team";

import type { TeamDto } from "@/use-cases/team/types";
export async function updateTeamAdmins(
  team: TeamDto,
  addedAdmins: string[],
  removedAdmins: string[]
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    await Team.findOneAndUpdate(
      { _id: team.id }, // Find the Team object by its ID
      {
        $addToSet: { admins: { $each: addedAdmins } }, // Add Admins to the array
        $pullAll: { admins: removedAdmins }, // Remove members from the array
      }
    );
  } catch (error) {
    throw new Error("Error updating team admins:" + error);
  }
}
