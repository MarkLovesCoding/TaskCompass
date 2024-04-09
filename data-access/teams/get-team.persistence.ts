import "server-only";

import connectDB from "@/db/connectDB";

import Team from "@/db/(models)/Team";

import { TeamDto } from "@/use-cases/team/types";
import { teamModelToTeamDto } from "./utils";

async function getTeam(teamId: string): Promise<TeamDto> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    // Find the user by ID
    const team = await Team.findById(teamId);
    return teamModelToTeamDto(team);
  } catch (error) {
    throw new Error("Error retrieving team:" + error);
  }
}

export default getTeam;
