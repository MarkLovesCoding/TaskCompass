import { TeamEntity } from "@/entities/Team";
import type { TeamDto, CreateTeamDto } from "@/use-cases/team/types";

export function teamToDto(team: TeamEntity): TeamDto {
  const teamId = team.getId();
  if (!teamId) throw new Error("Project id is required");
  console.log("team.name from entitr", team.getName());
  return {
    id: teamId,
    name: team.getName(),
    users: team.getUsers(),
    projects: team.getProjects(),
    createdBy: team.getCreatedBy(),
    backgroundImage: team.getBackgroundImage(),
    backgroundImageThumbnail: team.getBackgroundImageThumbnail(),
    invitedUsers: team.getInvitedUsers(),
  };
}
export function teamToCreateTeamDto(team: TeamEntity): CreateTeamDto {
  return {
    name: team.getName(),
    users: team.getUsers(),
    projects: team.getProjects(),
    createdBy: team.getCreatedBy(),
    backgroundImage: team.getBackgroundImage(),
    backgroundImageThumbnail: team.getBackgroundImageThumbnail(),
    invitedUsers: team.getInvitedUsers(),
  };
}
