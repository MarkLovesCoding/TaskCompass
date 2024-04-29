import type { TeamModelType } from "./types";

export function teamModelToTeamDto(team: TeamModelType) {
  const convertedProjects =
    team.projects.length > 0
      ? team.projects.map((team) => team.toString())
      : [];
  const convertedUsers =
    team.users.length > 0 ? team.users.map((user) => user.toString()) : [];
  const convertedInvitedUsers = team.invitedUsers.map((invitedUser) => {
    return {
      email: invitedUser.email,
      role: invitedUser.role,
      teamId: invitedUser.teamId?.toString(),
      inviteUserToken: invitedUser.inviteUserToken,
      inviteUserTokenExpires: invitedUser.inviteUserTokenExpires,
    };
  });
  return {
    id: team._id.toString(),
    name: team.name,
    projects: convertedProjects,
    users: convertedUsers,
    createdBy: team.createdBy.toString(),
    backgroundImage: team.backgroundImage,
    backgroundImageThumbnail: team.backgroundImageThumbnail,
    invitedUsers: convertedInvitedUsers,
  };
}
