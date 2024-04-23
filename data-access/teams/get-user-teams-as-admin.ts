"use server";
import connectDB from "@/db/connectDB";
import { teamModelToTeamDto } from "./utils";
import Team from "@/db/(models)/Team";

import type { TeamDto } from "@/use-cases/team/types";
import type { UserDto } from "@/use-cases/user/types";

async function getUserTeamsAsAdmin(user: UserDto): Promise<TeamDto[]> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  const teamIds = user.teamsAsAdmin;
  const teams: TeamDto[] = [];
  try {
    for (let teamId of teamIds) {
      const team = await Team.findById(teamId);
      teams.push(teamModelToTeamDto(team));
    }
  } catch (error) {
    throw new Error("Error retrieving user's teams as admin:" + error);
  }
  return teams;
}

export default getUserTeamsAsAdmin;
