export type ProjectDto = {
  id: string;
  name: string;
  description: string;
  members: string[];
  tasks: string[];
  team: string;
};
export type CreateProjectDto = {
  name: string;
  description: string;
  members: string[];
  tasks: string[];
  team: string;
};

export type CreateNewProject = (project: CreateProjectDto) => Promise<void>;
export type UpdateProject = (project: ProjectDto) => void;
export type DeleteProject = (projectId: string) => void;
export type GetProject = (projectId: string) => Promise<ProjectDto>;
