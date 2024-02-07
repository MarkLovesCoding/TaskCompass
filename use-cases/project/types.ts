export type ProjectDto = {
  id?: string;
  name: string;
  description: string;
  members: string[];
  tasks: string[];
};
export type CreateProjectDto = {
  name: string;
  description: string;
};
