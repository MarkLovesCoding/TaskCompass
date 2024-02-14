import "server-only";

import connectDB from "@/db/connectDB";

import Team from "@/db/(models)/Team";

import { TeamDto } from "@/use-cases/team/types";

type TeamModelType = {
  _id: string;
  name: string;
  projects: string[];
  members: string[];
};
export function teamToTeamDto(team: TeamModelType) {
  const convertedProjects =
    team.projects.length > 0
      ? team.projects.map((team) => team.toString())
      : [];
  const convertedMembers =
    team.members.length > 0 ? team.members.map((team) => team.toString()) : [];
  return {
    id: team._id.toString(),
    name: team.name,
    projects: convertedProjects,
    members: convertedMembers,
  };
}
// May require refactpr to get by ID
async function getTeam(teamId: string): Promise<TeamDto> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  // const teamId = team.id;
  try {
    // Find the user by ID
    const team = await Team.findById(teamId);
    console.log("TEAM RETRIEVED: ", teamToTeamDto(team));
    return teamToTeamDto(team);
  } catch (error) {
    throw new Error("Error retrieving team:" + error);
  }
}

export default getTeam;
