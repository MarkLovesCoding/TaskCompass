import "server-only";

import connectDB from "@/db/connectDB";

import Team from "@/db/(models)/Team";

import { TeamDto } from "@/use-cases/team/types";

// May require refactpr to get by ID
async function getTeam(team: TeamDto): Promise<TeamDto> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  const teamId = team.id;
  try {
    // Find the user by ID
    const team = await Team.findById(teamId);
    return team;
  } catch (error) {
    throw new Error("Error retrieving team:" + error);
  }
}

export default getTeam;
