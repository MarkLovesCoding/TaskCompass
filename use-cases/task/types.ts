import { UserDto } from "../user/types";
export type OrderInLists = Record<string, [string, number]>;

export type TaskDto = {
  id: string;
  name: string;
  description: string;
  project: string;
  assignees: string[];
  dueDate: Date;
  startDate: Date;
  archived: boolean;
  category: string;
  priority: string;
  status: string;
};
export type CreateTaskDto = {
  name: string;
  description: string;
  project: string;
  assignees: string[];
  dueDate: Date;
  startDate: Date;
  category: string;
  archived: boolean;
  priority: string;
  status: string;
};
export type CreateTask = (task: CreateTaskDto) => Promise<void>;
export type GetTask = (id: string) => Promise<TaskDto>;
export type GetUser = () => Promise<string>;
export type UpdateTask = (task: TaskDto) => Promise<void>;
export type UpdateTasks = (tasks: TaskDto[]) => Promise<void>;
export type UpdateTaskFullCard = (
  task: TaskDto,
  removedAssignees: string[],
  addedAssignees: string[]
) => Promise<void>;
export type UpdateTaskOrderInLists = (task: TaskDto) => Promise<void>;
export type UpdateTasksOrderInLists = (tasks: TaskDto[]) => Promise<void>;
export type UpdateTaskUsers = (
  taskId: string,
  addedAssignees: string[],
  removedAssignees: string[]
) => Promise<void>;
export type AddTaskUsers = (taskId: string, userId: string[]) => Promise<void>;
export type RemoveTaskUsers = (
  taskId: string,
  userId: string[]
) => Promise<void>;
