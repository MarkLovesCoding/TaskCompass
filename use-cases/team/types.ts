export type TInviteUser = {
  email: string;
  role: string;
  newUser: boolean;
  inviteUserToken: string;
  inviteUserTokenExpires: number;
};
export type TeamDto = {
  id: string;
  name: string;
  users: string[];
  projects: string[];
  createdBy: string;
  backgroundImage: string;
  backgroundImageThumbnail: string;
  invitedUsers?: TInviteUser[];
};
export type CreateTeamDto = {
  name: string;
  users: string[];
  projects: string[];
  createdBy: string;
  backgroundImage: string;
  backgroundImageThumbnail: string;
};
export type UpdateTeamUsers = (
  teamId: string,
  initialUsers: string[],
  updatedUsers: string[]
) => Promise<void>;
export type UpdateTeamInvitedUsers = (
  teamId: string,
  invitedUser: TInviteUser,
  updateType: "add" | "remove"
) => Promise<void>;
export type GetTeam = (teamId: string) => Promise<TeamDto>;
export type CreateNewTeam = (
  team: CreateTeamDto,
  userId: string
) => Promise<void>;
export type UpdateTeam = (team: TeamDto) => Promise<void>;
