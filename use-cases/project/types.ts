export type ProjectDto = {
  id: string;
  name: string;
  description: string;
  users: string[];
  tasks: string[];
  team: string;
  createdBy: string;
  archived: boolean;
  listsNextAvailable: object;
};
export type CreateProjectDto = {
  name: string;
  description: string;
  users: string[];
  tasks: string[];
  team: string;
  createdBy: string;
  archived: boolean;
  listsNextAvailable: object;
};
export type UpdateProjectUsers = (
  projectId: string,
  initialUsers: string[],
  updatedUsers: string[]
) => Promise<void>;

export type CreateNewProject = (
  project: CreateProjectDto,
  userId: string
) => Promise<void>;
export type UpdateProject = (project: ProjectDto) => void;
export type DeleteProject = (projectId: string) => void;
export type GetProject = (projectId: string) => Promise<ProjectDto>;
