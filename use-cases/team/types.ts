export type TeamDto = {
  id?: string;
  name: string;
  members: string[];
  projects: string[];
};
export type CreateTeamDto = {
  name: string;
  members: string[];
};
