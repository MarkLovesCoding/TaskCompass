export type ProjectDto = {
  id: string;
  name: string;
  description: string;
  members: string[];
  admins: string[];
  tasks: string[];
  team: string;
  archived: boolean;
};
export type CreateProjectDto = {
  name: string;
  description: string;
  members: string[];
  admins: string[];
  tasks: string[];
  team: string;
  archived: boolean;
};
export type UpdateProjectMembers = (
  projectId: string,
  initialMembers: string[],
  updatedMembers: string[]
) => Promise<void>;
export type UpdateProjectAdmins = (
  projectId: string,
  initialAdmins: string[],
  updatedAdmins: string[]
) => Promise<void>;
export type CreateNewProject = (project: CreateProjectDto) => Promise<void>;
export type UpdateProject = (project: ProjectDto) => void;
export type DeleteProject = (projectId: string) => void;
export type GetProject = (projectId: string) => Promise<ProjectDto>;
