"use server";
import connectDB from "@/db/connectDB";
import Team from "@/db/(models)/Team";

import type { TeamDto } from "@/use-cases/team/types";

export async function updateTeamMembers(
  team: TeamDto,
  addedMembers: string[],
  removedMembers: string[]
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
        $addToSet: { members: { $each: addedMembers } }, // Add members to the array
        $pullAll: { members: removedMembers }, // Remove members from the array
      }
    );
  } catch (error) {
    throw new Error("Error updating team members:" + error);
  }
}
