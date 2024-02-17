export type TeamDto = {
  id: string;
  name: string;
  members: string[];
  projects: string[];
};
export type CreateTeamDto = {
  name: string;
  members: string[];
  projects: string[];
};
export type GetTeam = (teamId: string) => Promise<TeamDto>;
export type CreateNewTeam = (team: CreateTeamDto) => Promise<void>;
export type UpdateTeam = (team: TeamDto) => Promise<void>;
