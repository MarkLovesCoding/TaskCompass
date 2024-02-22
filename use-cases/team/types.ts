export type TeamDto = {
  id: string;
  name: string;
  admins: string[];
  members: string[];
  projects: string[];
};
export type CreateTeamDto = {
  name: string;
  admins: string[];
  members: string[];
  projects: string[];
};
export type UpdateTeamMembers = (
  teamId: string,
  initialMembers: string[],
  updatedMembers: string[]
) => Promise<void>;
export type UpdateTeamAdmins = (
  teamId: string,
  initialAdmins: string[],
  updatedAdmins: string[]
) => Promise<void>;
export type GetTeam = (teamId: string) => Promise<TeamDto>;
export type CreateNewTeam = (team: CreateTeamDto) => Promise<void>;
export type UpdateTeam = (team: TeamDto) => Promise<void>;
