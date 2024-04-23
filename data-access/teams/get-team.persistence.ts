"use server";
import connectDB from "@/db/connectDB";
import { teamModelToTeamDto } from "./utils";
import Team from "@/db/(models)/Team";

import type { TeamDto } from "@/use-cases/team/types";

async function getTeam(teamId: string): Promise<TeamDto> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    const team = await Team.findById(teamId);
    return teamModelToTeamDto(team);
  } catch (error) {
    throw new Error("Error retrieving team:" + error);
  }
}

export default getTeam;
