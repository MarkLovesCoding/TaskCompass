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

export type UpdateTeamMembers = (
  team: TeamDto,
  addedMembers: string[],
  removedMembers: string[]
) => Promise<void>;
// export type RemoveTeamMember = (
//   team: TeamDto,
//   memberId: string
// ) => Promise<void>;
export type CreateNewTeam = (team: CreateTeamDto) => Promise<void>;
