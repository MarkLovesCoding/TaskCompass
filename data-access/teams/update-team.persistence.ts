import "server-only";

import connectDB from "@/db/connectDB";
import Team from "@/db/(models)/Team";

import type { TeamDto } from "@/use-cases/team/types";
export async function updateTeam(team: TeamDto): Promise<void> {
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
        team,
      }
    );
  } catch (error) {
    throw new Error("Error adding user to task:" + error);
  }
}
