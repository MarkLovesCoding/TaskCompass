export type ProjectDto = {
  id: string;
  name: string;
  description: string;
  users: string[];
  tasks: string[];
  team: string;
  createdBy: string;
  archived: boolean;
};
export type CreateProjectDto = {
  name: string;
  description: string;
  users: string[];
  tasks: string[];
  team: string;
  createdBy: string;
  archived: boolean;
};
export type UpdateProjectUsers = (
  projectId: string,
  initialUsers: string[],
  updatedUsers: string[]
) => Promise<void>;

export type CreateNewProject = (project: CreateProjectDto) => Promise<void>;
export type UpdateProject = (project: ProjectDto) => void;
export type DeleteProject = (projectId: string) => void;
export type GetProject = (projectId: string) => Promise<ProjectDto>;
