import { TeamEntity } from "@/entities/Team";
import { TeamDto } from "@/use-cases/team/types";

export function teamToDto(team: TeamEntity): TeamDto {
  const teamId = team.getId();
  if (!teamId) throw new Error("Project id is required");
  return {
    id: teamId,
    name: team.getName(),
    members: team.getMembers(),
    projects: team.getProjects(),
  };
}
