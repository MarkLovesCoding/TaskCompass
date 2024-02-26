export type TeamDto = {
  id: string;
  name: string;
  users: string[];
  projects: string[];
  createdBy: string;
};
export type CreateTeamDto = {
  name: string;
  users: string[];
  projects: string[];
  createdBy: string;
};
export type UpdateTeamUsers = (
  teamId: string,
  initialUsers: string[],
  updatedUsers: string[]
) => Promise<void>;
export type GetTeam = (teamId: string) => Promise<TeamDto>;
export type CreateNewTeam = (team: CreateTeamDto) => Promise<void>;
export type UpdateTeam = (team: TeamDto) => Promise<void>;
