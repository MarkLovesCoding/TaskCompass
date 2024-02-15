import { TeamModelType } from "./types";
export function teamModelToTeamDto(team: TeamModelType) {
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
