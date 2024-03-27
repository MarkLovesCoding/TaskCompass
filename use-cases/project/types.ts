export type ColumnOrder = Record<string, string[]>;
export type TasksOrder = Record<string, Record<string, string[]>>;
export type ProjectDto = {
  id: string;
  name: string;
  description: string;
  users: string[];
  tasks: string[];
  team: string;
  createdBy: string;
  archived: boolean;
  tasksOrder: TasksOrder;
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
  tasksOrder: TasksOrder;
  columnOrder: ColumnOrder;
};
export type UpdateProjectUsers = (
  projectId: string,
  initialUsers: string[],
  updatedUsers: string[]
) => Promise<void>;
export type UpdateProjectColumnOrder = (
  projectId: string,
  type: string,
  columnOrder: string[]
) => Promise<void>;
export type UpdateTasksOrder = (
  projectId: string,
  taskId: TasksOrder
) => Promise<void>;
export type UpdateTasksOrderFromTaskCard = (
  projectId: string,
  taskId: string,
  priority: string,
  category: string,
  status: string
) => Promise<void>;
export type CreateNewProject = (
  project: CreateProjectDto,
  userId: string
) => Promise<void>;
export type UpdateProject = (project: ProjectDto) => Promise<void>;
export type DeleteProject = (projectId: string) => Promise<void>;
export type GetProject = (projectId: string) => Promise<ProjectDto>;
