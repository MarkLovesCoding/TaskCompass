import "server-only";

import connectDB from "@/db/connectDB";

import Team from "@/db/(models)/Team";

import type { TeamDto } from "@/use-cases/team/types";
import type { UserDto } from "@/use-cases/user/types";
import { teamModelToTeamDto } from "./utils";
// May require refactpr to get by ID
export async function getUserTeamsAsMember(user: UserDto): Promise<TeamDto[]> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  // const teamId = team.id;
  const teamIds = user.teamsAsMember;
  const teams: TeamDto[] = [];
  try {
    // Find the user by ID
    for (let teamId of teamIds) {
      const team = await Team.findById(teamId);
      teams.push(teamModelToTeamDto(team));
    }
  } catch (error) {
    throw new Error("Error retrieving team:" + error);
  }
  return teams;
}

export default getUserTeamsAsMember;
