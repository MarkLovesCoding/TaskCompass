import "server-only";

import connectDB from "@/db/connectDB";

import Team from "@/db/(models)/Team";

import type { TeamDto } from "@/use-cases/team/types";
import type { UserDto } from "@/use-cases/user/types";
import { teamToTeamDto } from "./get-team";
// May require refactpr to get by ID
export async function getUserTeams(user: UserDto): Promise<TeamDto[]> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  // const teamId = team.id;
  const teamIds = user.teams;
  const teams: TeamDto[] = [];
  try {
    // Find the user by ID
    for (let teamId of teamIds) {
      const team = await Team.findById(teamId);
      teams.push(teamToTeamDto(team));
    }
  } catch (error) {
    throw new Error("Error retrieving team:" + error);
  }
  return teams;
}

export default getUserTeams;
