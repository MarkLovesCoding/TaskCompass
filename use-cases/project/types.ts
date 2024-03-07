export type ListsNextAvailable = Record<string, Record<string, number>>;
export type ColumnOrder = Record<string, string[]>;

export type ProjectDto = {
  id: string;
  name: string;
  description: string;
  users: string[];
  tasks: string[];
  team: string;
  createdBy: string;
  archived: boolean;
  listsNextAvailable: ListsNextAvailable;
  columnOrder: ColumnOrder;
};
export type CreateProjectDto = {
  name: string;
  description: string;
  users: string[];
  tasks: string[];
  team: string;
  createdBy: string;
  archived: boolean;
  listsNextAvailable: ListsNextAvailable;
  columnOrder: ColumnOrder;
};
export type UpdateProjectUsers = (
  projectId: string,
  initialUsers: string[],
  updatedUsers: string[]
) => Promise<void>;
export type UpdateColumnOrder = (
  projectId: string,
  columnOrder: ColumnOrder
) => Promise<void>;
export type CreateNewProject = (
  project: CreateProjectDto,
  userId: string
) => Promise<void>;
export type UpdateProject = (project: ProjectDto) => void;
export type DeleteProject = (projectId: string) => void;
export type GetProject = (projectId: string) => Promise<ProjectDto>;
