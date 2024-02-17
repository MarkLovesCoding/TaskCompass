import { TeamEntity } from "@/entities/Team";
import { TeamDto, CreateTeamDto } from "@/use-cases/team/types";

export function teamToDto(team: TeamEntity): TeamDto {
  const teamId = team.getId();
  if (!teamId) throw new Error("Project id is required");
  console.log("team.name from entitr", team.getName());
  return {
    id: teamId,
    name: team.getName(),
    members: team.getMembers(),
    projects: team.getProjects(),
  };
}
export function teamToCreateTeamDto(team: TeamEntity): CreateTeamDto {
  return {
    name: team.getName(),
    members: team.getMembers(),
    projects: team.getProjects(),
  };
}
