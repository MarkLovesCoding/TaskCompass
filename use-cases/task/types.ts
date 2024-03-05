import { UserDto } from "../user/types";

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
  orderInLists: object;
  // label?: string;
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
  orderInLists: object;
  // label?: string | undefined;
};
export type CreateTask = (task: CreateTaskDto) => Promise<void>;
export type GetTask = (id: string) => Promise<TaskDto>;
export type GetUser = () => Promise<string>;
export type UpdateTask = (
  task: TaskDto,
  removedAssignees: string[],
  addedAssignees: string[]
) => Promise<void>;
// export type UpdateTaskUsers = (
//   taskId: string,
//   addedAssignees: string[],
//   removedAssignees: string[]
// ) => Promise<void>;
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
