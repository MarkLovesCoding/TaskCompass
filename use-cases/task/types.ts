export type TaskDto = {
  id: string;
  name: string;
  description: string;
  project: string;
  assignees: string[];
  dueDate?: number;
  startDate: number;
  complete: boolean;
  priority: string;
  status: string;
  label: string;
};
export type CreateTaskDto = {
  name: string;
  description: string;
  project: string;
  assignees: string[];
  dueDate?: number;
  startDate: number;
  complete: boolean;
  priority: string;
  status: string;
  label: string;
};
export type CreateTask = (task: CreateTaskDto) => Promise<void>;
export type GetTask = (id: string) => Promise<TaskDto>;
export type GetUser = () => Promise<string>;
export type UpdateTask = (task: TaskDto) => Promise<void>;
